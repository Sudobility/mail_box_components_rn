/**
 * A navigation stack that is the platform's **native** stack on iOS and Android
 * and the **JS** stack on macOS and Windows.
 *
 * react-native-macos and react-native-windows render no native stack header, so
 * a native stack there leaves a broken short bar with the content drawn behind
 * it. The JS stack (`@react-navigation/stack`) draws its header in views and
 * works on every platform, which is why the host apps' own navigators switch to
 * it on a desktop. This gives the library's own panels the same behaviour from
 * one place.
 *
 * The right module is `require`d lazily, so importing a component that only
 * *might* render a navigator pulls none in until it does — and the JS stack,
 * which only a desktop needs, is resolved from the host app (which already
 * depends on it) at run time rather than being a hard dependency of this
 * library.
 */
import { Platform } from 'react-native';

type NativeStackModule = typeof import('@react-navigation/native-stack');

/** The navigator either stack produces — a `Navigator`/`Screen` pair. */
export type PlatformStackNavigator = ReturnType<
  NativeStackModule['createNativeStackNavigator']
>;

const DESKTOP = Platform.OS === 'macos' || Platform.OS === 'windows';

/**
 * Create the navigator for this platform. A caller writes one set of header
 * options (`title`, `headerShown`, `headerTitleAlign`): the two stacks are
 * structurally the same for those, so the same screen options drive both.
 */
export function createPlatformStackNavigator(): PlatformStackNavigator {
  if (DESKTOP) {
    const mod = require('@react-navigation/stack') as {
      createStackNavigator: NativeStackModule['createNativeStackNavigator'];
    };
    return mod.createStackNavigator();
  }
  const mod = require('@react-navigation/native-stack') as NativeStackModule;
  return mod.createNativeStackNavigator();
}
