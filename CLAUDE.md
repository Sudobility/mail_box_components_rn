# mail_box_components_rn (`@sudobility/components-rn`)

> **Git policy — never auto-commit or auto-push.** Leave your work in the
> working tree. Run `git commit`, `git push`, `gh pr create` or
> `scripts/push_all.sh` **only when the user explicitly asks in that turn.**
> Stay on the current branch; do not open feature branches.

The React Native port of the web `@sudobility/components` library — 90+ UI
primitives under `src/ui/`, with design tokens, colors, typography and variant
functions imported from `@sudobility/design`. Built with TypeScript, Vite
(library mode) and NativeWind v4; ships ESM + CJS. BUSL-1.1. Always use `bun`.

**Domain bundles live under `src/<domain>/`** (email, web3, devops, entity,
marketing, subscription, ratelimit, social, finance, … 40-odd) and are
published as subpath exports — `@sudobility/components-rn/email`,
`/web3`, etc., each resolving to `src/<domain>/index.ts`. Core UI is the root
export (`src/index.ts`). This is one library, not a monorepo of sub-packages.

## Commands

- `bun install`
- `bun run build` — `tsc` + `vite build` + `scripts/fix-esm-imports.mjs`
- `bun run type-check` — `tsc --noEmit`
- `bun run lint` — eslint, `--max-warnings 0`
- `bun run format` / `format:check` — prettier
- `bun run test:unit` — jest (react-native preset); `test:watch`, `test:coverage`
- `bun run dev` — vite watch

## Boundaries

- **Types and vocabulary are `@sudobility/types`; design tokens are
  `@sudobility/design`** (`variants`/`v`, `textVariants`, `designTokens`,
  `colors`), re-exported from `src/index.ts`. Do not restate either here.
- **This is the port target.** A control that exists on the web and not in RN
  is ported into this library, never reimplemented in a consumer app.
- **Each component is `src/ui/ComponentName/{ComponentName.tsx, index.ts}`**,
  re-exported from `src/index.ts`; cross-platform logic in a `*.shared.ts`.
  Every component takes `className?`, extends the matching RN base props, and
  exports its `*Props`. Use `Pressable` (not `TouchableOpacity`), `onPress`
  (not `onClick`), RN accessibility props (not ARIA).

## Cross-cutting rules (each pinned by a test; do not relearn them)

- **A touchable wires `onPress` AND `onAccessibilityTap` — spread
  `pressProps(handler, disabled)` from `lib/a11y`, never write `onPress`
  alone.** On react-native-macos an assistive activation arrives *only* as
  `onAccessibilityTap` (no synthesized press), so a press-only control focuses,
  announces, and does nothing; iOS hides the gap by falling back to a press.
  `pressProps` withholds the tap when `disabled`, and `accessibilityState` must
  report `disabled`/`selected`/`checked` too. Exemption: a
  `/* no-a11y-tap: <reason> */` comment inside the tag (used by a few scrim-
  swallowing modal panels); a bare one with no reason is not an exemption.
  `__tests__/accessibility-tap-guard.test.ts` fails on any violation via the
  parsing scanner `jest.touchable-scan.cjs` (it parses, not pattern-matches —
  a hand-written blanker once ate a file at a JSX apostrophe and hid real bugs).
- **Every colour is a semantic token, and a class wherever NativeWind can carry
  it** — a class resolves against the host's runtime `vars()`, so a host can
  pick Dark on a light-OS device; `useColorScheme()` / `colors.raw` get that
  wrong. Props that look like strings often take a class: `ActivityIndicator`
  (`className='text-primary'`), `TextInput` placeholder, an `Svg` made in this
  package's JSX (via `lib/svg-interop`, `fill='currentColor'`). What cannot take
  a class (`Switch` `trackColor`, icon `color`) uses `useThemeColor`
  (`lib/theme-color`); an icon slot via `resolveIconColor` (`lib/icon-color`);
  cache per theme with `themeCached` (`lib/theme-cache`), never at module load.
  RN `Text` inherits no colour — put the `text-*` class on the `Text`.
  `__tests__/theme-color-scan.test.ts` refuses `colors.raw`, hex, palette
  classes and `color=` on `ActivityIndicator` (allow-list with a reason each;
  `bg-black/NN` scrims exempt).
- **Full-screen / edge-anchored surfaces pad all four insets — spread
  `safeAreaPadding(insets, edges?)` from `lib/safe-area`, not hand paddings.**
  The bug is always `left`/`right` forgotten: a portrait phone reports both as
  **0**, so it looks fine everywhere until a landscape cutout takes a whole
  column (a modal's close button landed entirely inside it). Padding not margin,
  applied inside the surface; a centred card is centred in the *safe area* and
  capped at the safe width; `edges` only for a surface that truly touches some
  (a bottom sheet skips top — see `SHEET_EDGES`). `SafeAreaView` from
  `react-native-safe-area-context` already does all four — don't narrow it with
  `edges` without the same reasoning. `__tests__/safe-area-insets.test.tsx`
  pins it against asymmetric insets (159 left, 0 right).
- **A picker trigger's label uses `selectTriggerLabelStyle` from
  `lib/select-trigger`, never `flex: 1`.** `flex:1` sets `flexBasis:0` (text
  needs no width); in a content-sized parent (a toolbar/settings row) the
  trigger collapses to a bare chevron. Needs `flexBasis:'auto'` + `flexGrow:1`
  + `flexShrink:1` with `numberOfLines={1}`.
- **Every `TextInput` spreads `textInputDefaults` from `lib/text-input`**
  (carries `disableFullscreenUI: true`, or Android replaces the app with a
  full-screen editor in landscape). Spread it *before* a caller's props so a
  caller can opt back in; components taking no props spread declare their own
  defaulted `disableFullscreenUI?`. `__tests__/text-input-defaults.test.tsx`
  fails on a bare `<TextInput>` in `src/ui`. Domain bundles write the prop
  literally (they resolve this package from npm, not source).

## Build / packaging

- **Vite library mode**, ESM + CJS, declarations with source maps, not
  minified. `@/` → `src/`. Externals: React, React Native, NativeWind,
  `@sudobility/design`, clsx, CVA. **The `react-native` field (and each export's
  `react-native` condition) points at `src/`**, so Metro consumers run source,
  not `dist` — a locally built copy must have its `src/` synced in too, or the
  app runs source while tests (reading `dist`) pass against the new code.
- **Native slider:** `MoosiacNativeSlider` is a Fabric component — AppKit
  `NSSlider` on macOS (`macos/*.mm`), Composition on Windows (`windows/`,
  `windows/codegen`) — declared in `package.json` `codegenConfig` and shipped
  via `mail_box_components_rn.podspec` (iOS/macOS source under `macos/`,
  guarded by `TARGET_OS_OSX`). iOS uses `@react-native-community/slider`.
- **Jest** uses the react-native preset; `transformIgnorePatterns` must name
  every ESM dep by hand *and* allow bun's `.bun/<pkg>@<ver>/node_modules/<pkg>`
  layout. `jest.mocks.cjs` mocks native modules that throw at import.
- **styling:** `cn()` (`lib/utils`) wraps clsx. Variant maps are plain objects
  in each component; core components (Button, Input, Alert, Card) call
  `@sudobility/design` variant functions. Dark mode via `dark:` classes.

## Structure

- `src/index.ts` — root export (core UI). `src/<domain>/index.ts` — subpath
  exports.
- `src/ui/*` — 90+ component dirs.
- `src/lib/*` — the shared rules above: `a11y`, `theme-color`/`icon-color`/
  `text-color`/`theme-cache`/`svg-interop`, `safe-area`/`safe-area-edges`,
  `select-trigger`/`select-popover`, `text-input`, `touch-target`,
  `form-factor`/`large-screen`, `platform-stack`, `utils` (`cn`).
- `src/__tests__/*` — the guard tests named above; `jest.touchable-scan.cjs`
  (repo root) is the one shared touchable scanner.
- `macos/`, `windows/` — native slider.

## Screen rendering — safe area (per axis, by whether it scrolls)

Pad by the actual inset value, never a magic number. **Not scrollable on an
axis** → pad that axis's insets (content stops clear of status bar / notch /
home indicator / cutout). **Scrollable on an axis** → render full-bleed and
give that axis *scroll* insets (`contentInset` + `scrollIndicatorInsets`, or
`contentInsetAdjustmentBehavior="automatic"`). **Bottom CTA under a tab bar:**
`insets.bottom` already includes the tab-bar height — pad by `insets.bottom`
and nothing more; never add the tab-bar height on top, re-reserve it on the
root, or swap the inset for a flat gap. Canonical fixed screen: flex-column
root → content/scroll region → bottom action bar as last child padding
`insets.bottom`.
