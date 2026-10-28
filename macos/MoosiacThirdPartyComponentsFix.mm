//
//  MoosiacThirdPartyComponentsFix.mm
//
//  Keeps a New-Architecture (Fabric) app from crashing at startup when a
//  third-party component has no native component view on the current platform.
//  This is chiefly a macOS fix, and it ships here — in a pod every app already
//  links — so an app gets it just by depending on this package. There is
//  nothing to wire into its AppDelegate, and nothing is patched inside
//  react-native / react-native-macos.
//
//  Why it is needed
//  ----------------
//  React Native's codegen writes, per app, a generated class
//  `RCTThirdPartyComponentsProvider` whose `+thirdPartyFabricComponents` builds
//  the registry of third-party Fabric components as an Objective-C dictionary
//  literal:
//
//      thirdPartyComponents = @{
//        @"RNSVGCircle": NSClassFromString(@"RNSVGCircle"),
//        @"RNSScreen":   NSClassFromString(@"RNSScreenView"),
//        ...
//      };
//
//  On macOS many of those components ship no macOS component view, so
//  `NSClassFromString` returns `nil`. A dictionary literal with a `nil` value
//  raises `NSInvalidArgumentException` ("attempt to insert nil object"), which
//  aborts Fabric setup at launch — it typically surfaces to JS as a
//  `getEnforcing('PlatformConstants')` failure. The set of nil components is
//  app-specific (it depends on which libraries the app pulls in), so there is
//  no single class to stub.
//
//  react-native-macos used to carry a codegen-template patch that rebuilt the
//  dictionary dynamically and skipped nil classes. That patch lives in the
//  build process (it rewrites a codegen template and is pinned to one exact
//  react-native-macos version, so a version bump silently drops it). This
//  installs the same "skip the nil entries" behaviour at runtime instead, with
//  no patch and no version pin.
//
//  How it works
//  ------------
//  The only operation that actually throws is the dictionary literal, i.e.
//  `+[NSDictionary dictionaryWithObjects:forKeys:count:]` (the method a `@{...}`
//  literal lowers to). We install two swizzles at load:
//
//    1. `+[RCTThirdPartyComponentsProvider thirdPartyFabricComponents]` — our
//       wrapper sets a thread-local flag, calls the original (whose
//       `dispatch_once` body builds the literal), then clears the flag.
//    2. `+[NSDictionary dictionaryWithObjects:forKeys:count:]` — our wrapper is
//       a pure pass-through UNLESS that thread-local flag is set, in which case
//       it drops any object/key pair whose object is nil before constructing
//       the dictionary.
//
//  So the nil-tolerant behaviour is confined to the single provider call on the
//  single thread that builds the registry (once, during Fabric setup). Every
//  other dictionary literal in the app keeps its normal throw-on-nil semantics.
//  The provider caches its result in a `static` behind `dispatch_once`, so the
//  literal is built exactly once and later calls never re-enter this path.
//
//  `+load` runs automatically at image load because every app links this pod
//  with `-ObjC` in OTHER_LDFLAGS. The install is deferred to the first
//  main-runloop tick (as in this package's RNSForceCompactTabBar), by which
//  point every image's classes are registered — still long before Fabric first
//  asks for the component registry, which waits on the JS bundle. If the
//  generated provider class is absent (old architecture, or a future RN
//  rename), the install is a harmless no-op and the app is untouched. It never
//  crashes.
//
//  Note on the old patch's scroll-view hunk
//  ----------------------------------------
//  The same react-native-macos patch also set `copiesOnScroll = NO` on the
//  macOS scroll view's clip view. That property is deprecated as of macOS 11
//  and, per AppKit, "Setting this property has no effect" — NSClipView already
//  minimizes the invalidated area. So that hunk is inert on every macOS this
//  app runs on and is deliberately not ported here. If blank-on-scroll content
//  is ever observed, the remedy is invalidation-on-scroll (NSView
//  setNeedsDisplayInRect:), not this property.
//

#import <TargetConditionals.h>

#if TARGET_OS_OSX || TARGET_OS_IOS

#import <Foundation/Foundation.h>
#import <objc/message.h>
#import <objc/runtime.h>

// Thread-local: only the provider's own dictionary build, on its own thread,
// asks the dictionary swizzle to drop nil entries. `_Thread_local` needs no
// allocation and cannot re-enter the dictionary machinery (unlike reading
// NSThread's threadDictionary from inside a dictionary constructor).
static _Thread_local BOOL MoosiacSkipNilDictionaryValues = NO;

// Replacement for +[NSDictionary dictionaryWithObjects:forKeys:count:].
// After the swizzle, the selector `moosiac_dictionaryWithObjects:forKeys:count:`
// reaches the original implementation.
static id MoosiacDictionaryWithObjectsForKeysCount(
    id self, SEL _cmd, const id *objects, const id *keys, NSUInteger count)
{
  SEL originalSel = @selector(moosiac_dictionaryWithObjects:forKeys:count:);
  id (*callOriginal)(id, SEL, const id *, const id *, NSUInteger) =
      (id (*)(id, SEL, const id *, const id *, NSUInteger))objc_msgSend;

  if (!MoosiacSkipNilDictionaryValues) {
    return callOriginal(self, originalSel, objects, keys, count);
  }

  // Build the pair list without the nil classes, then hand the compacted
  // arrays to the real constructor. These never outlive the call and the
  // caller owns the originals, so unretained storage is correct here (and
  // avoids an ARC-managed variable-length array).
  __unsafe_unretained id filteredObjects[count];
  __unsafe_unretained id filteredKeys[count];
  NSUInteger kept = 0;
  for (NSUInteger i = 0; i < count; i++) {
    if (objects[i] != nil && keys[i] != nil) {
      filteredObjects[kept] = objects[i];
      filteredKeys[kept] = keys[i];
      kept++;
    }
  }
  return callOriginal(self, originalSel, filteredObjects, filteredKeys, kept);
}

// Replacement for +[RCTThirdPartyComponentsProvider thirdPartyFabricComponents].
// After the swizzle, the selector `moosiac_thirdPartyFabricComponents` reaches
// the original implementation.
static id MoosiacThirdPartyFabricComponents(id self, SEL _cmd)
{
  MoosiacSkipNilDictionaryValues = YES;
  id result = nil;
  @try {
    result = ((id (*)(id, SEL))objc_msgSend)(
        self, @selector(moosiac_thirdPartyFabricComponents));
  } @finally {
    MoosiacSkipNilDictionaryValues = NO;
  }
  return result;
}

@interface MoosiacThirdPartyComponentsFix : NSObject
+ (void)moosiac_install;
@end

@implementation MoosiacThirdPartyComponentsFix

// Adds `replacement` as a class method of `cls` carrying `imp` (reusing the
// original's type encoding), then exchanges it with `original`. Afterwards the
// `original` selector runs `imp`, and the `replacement` selector runs the
// implementation that was originally behind `original`. A no-op if `original`
// is absent or the swizzle was already installed.
static void MoosiacSwizzleClassMethod(Class cls, SEL original, SEL replacement,
                                       IMP imp)
{
  if (cls == Nil) {
    return;
  }
  Method originalMethod = class_getClassMethod(cls, original);
  if (originalMethod == NULL) {
    return;
  }
  Class meta = object_getClass(cls);
  if (!class_addMethod(meta, replacement, imp,
                       method_getTypeEncoding(originalMethod))) {
    // Already installed (e.g. +load ran twice); leave the existing pair alone.
    return;
  }
  Method replacementMethod = class_getClassMethod(cls, replacement);
  if (replacementMethod != NULL) {
    method_exchangeImplementations(originalMethod, replacementMethod);
  }
}

+ (void)load
{
  // Defer to the first main-runloop tick: at raw +load time link order across
  // images is not guaranteed, so the generated provider class may not be
  // registered yet. By the first tick every class is registered, and this is
  // still well before Fabric asks for the component registry.
  dispatch_async(dispatch_get_main_queue(), ^{
    [self moosiac_install];
  });
}

+ (void)moosiac_install
{
  Class provider = NSClassFromString(@"RCTThirdPartyComponentsProvider");
  if (provider == Nil) {
    // Old architecture or a renamed provider: nothing to protect.
    return;
  }

  // Order matters: the dictionary pass-through must be in place before the
  // provider wrapper can switch on the thread-local flag.
  MoosiacSwizzleClassMethod(
      [NSDictionary class],
      @selector(dictionaryWithObjects:forKeys:count:),
      @selector(moosiac_dictionaryWithObjects:forKeys:count:),
      (IMP)MoosiacDictionaryWithObjectsForKeysCount);

  MoosiacSwizzleClassMethod(
      provider,
      @selector(thirdPartyFabricComponents),
      @selector(moosiac_thirdPartyFabricComponents),
      (IMP)MoosiacThirdPartyFabricComponents);
}

@end

#endif // TARGET_OS_OSX || TARGET_OS_IOS
