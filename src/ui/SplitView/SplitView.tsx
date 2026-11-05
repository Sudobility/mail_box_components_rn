/**
 * SplitView — the family's Settings-style master/detail, in `music_app_rn`'s
 * shape, as one shared component.
 *
 * `SplitViewContainer` wraps {@link MasterDetailLayout}: two columns on a wide
 * device (an iPad, a phone in landscape, the iPhone Duo's unfolded screen) and
 * a drill-in on a narrow phone.
 *
 * **The drill-in is the platform's own navigation controller.** Below the
 * breakpoint a row press pushes the detail on a real `@react-navigation`
 * native stack, and that stack draws the header — the system navigation bar,
 * with its own **built-in back button**: UINavigationController's chevron on
 * iOS, the Material up-arrow on Android. Nothing here draws a back control. In
 * the two-column layout there is no stack and so no system bar, so each column
 * is given a plain titled bar of its own; those two bars are the only chrome
 * this component draws.
 *
 * So a host hides its own navigator's header (`headerShown: false`) and lets
 * this own the screen: on a phone the system bar titles the list and the pushed
 * detail; on a tablet the two titled bars sit side by side. That is what
 * removes the doubled bar that nesting a split inside a titled stack screen
 * produced.
 *
 * Insets: every bar is the platform's own navigation bar, which reserves the
 * status-bar space above itself — in both modes, so the top is handled by the
 * system and never computed here. The whole surface is painted the bar's own
 * colour (the theme's `card`), so the strip the native bar leaves above its
 * opaque background reads as one continuous bar rather than the app background
 * showing through as a band. The master list clears the left notch and the
 * bottom (tab bar / home indicator); the detail's own content clears the
 * bottom, and the right notch is cleared here when it sits beside the list.
 * Everything is a theme token, so it follows light/dark with no host wiring,
 * and the layout measures its own width (never `useWindowDimensions`), so it is
 * right in a Split View and on macOS alike.
 */
import * as React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { Theme } from '@react-navigation/native';
import { cn } from '../../lib/utils';
import { MIN_TOUCH_TARGET } from '../../lib/touch-target';
import { useIconColor } from '../../lib/icon-color';
import type { ThemeColorToken } from '../../lib/theme-color';
import { Text } from '../Text';
import { MasterDetailLayout, useMasterDetail } from '../MasterDetailLayout';

/**
 * The detail's default minimum width, in points. Both columns show only while
 * the master and a detail at least this wide both fit the measured width
 * (`masterWidth + detailMinWidth <= width`); narrower than that the master is
 * hidden and the detail drills in full-width. A caller states the width its own
 * detail needs (`detailMinWidth`) — a reading column, a form, an editor that
 * wants the whole screen — so the collapse point follows the content rather
 * than a device guess.
 */
export const SPLIT_DETAIL_MIN_WIDTH = 400;

/** The master column's width beside the detail, in points — `music_app_rn`'s. */
export const SPLIT_PRIMARY_PANEL_WIDTH = 320;

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

export interface SplitViewContainerProps {
  /** The master list content (typically a {@link SplitMenuList}). */
  master: React.ReactNode;
  /** The detail content for the current selection. */
  detail: React.ReactNode;
  /**
   * The master's title: the system bar's title on a phone, the left bar's title
   * on a tablet. Usually the screen's name (e.g. "Settings").
   */
  masterTitle?: string;
  /**
   * The chosen section's title: the pushed detail's system-bar title on a
   * phone, the right bar's title on a tablet. Changes with the selection.
   */
  detailTitle?: string;
  /**
   * Drill in (a native-stack push) where there is room for only one column. On
   * by default — the common case, a phone showing one pane at a time. Pass
   * `false` for a surface that is only ever wide (a landscape-only app, a
   * desktop window), which then always shows both columns.
   */
  collapsible?: boolean;
  /** The two-column master width, in points (default 320). */
  masterWidth?: number;
  /**
   * The minimum width the detail needs to sit beside the master. Both columns
   * show only while `masterWidth + detailMinWidth` fits the measured width;
   * narrower than that the master is hidden and the detail drills in full-width.
   * So a detail that wants the whole screen (a large editor) states a large
   * value and is always full-width, while a reading column states a small one
   * and shares the screen whenever there is room. Default
   * {@link SPLIT_DETAIL_MIN_WIDTH}. Honoured only when `collapsible`.
   */
  detailMinWidth?: number;
  /**
   * Cap the detail's content to this width and centre it past it — the web's
   * master/detail, so a line never runs the full width of a wide window.
   * Omitted, the detail fills its pane.
   */
  detailMaxWidth?: number;
  /**
   * The React Navigation theme the bars follow: the drill-in's native system
   * header (its `card` is the background, its `text` the title and back
   * control) and the two-column layout's own title bars. Omitted, the bars are
   * the neutral background token. Pass the app's theme so the bars match it —
   * e.g. a design theme whose nav colour is red.
   */
  navigationTheme?: Theme;
}

export function SplitViewContainer({
  master,
  detail,
  masterTitle,
  detailTitle,
  collapsible = true,
  masterWidth = SPLIT_PRIMARY_PANEL_WIDTH,
  detailMinWidth = SPLIT_DETAIL_MIN_WIDTH,
  detailMaxWidth,
  navigationTheme,
}: SplitViewContainerProps) {
  // The whole surface is painted the navigation bar's own colour (the theme's
  // `card`), so the status-bar strip the native header leaves above itself —
  // which an opaque header background does not fill — is the same colour as the
  // bar rather than the neutral app background showing through as a band. Each
  // panel paints `bg-background` over its body (and its own side-notch padding),
  // so the bar colour is seen only in that top strip, never down a pane's side.
  const barColor = navigationTheme?.colors.card;
  return (
    <View
      testID='split-container'
      className='flex-1 bg-background'
      style={barColor ? { backgroundColor: barColor } : undefined}
    >
      <MasterDetailLayout
        master={
          <Panel title={masterTitle} navTheme={navigationTheme}>
            {master}
          </Panel>
        }
        detail={
          <Panel
            secondary
            title={detailTitle}
            detailMaxWidth={detailMaxWidth}
            navTheme={navigationTheme}
          >
            {detail}
          </Panel>
        }
        masterWidth={masterWidth}
        // Both columns only while the master and a detail at least its minimum
        // width both fit; below that the master hides and the detail drills in
        // full-width. `collapsible` false forces two columns (a desktop window).
        breakpoint={collapsible ? masterWidth + detailMinWidth : 0}
        // Drill-in uses the platform's own navigation controller: its system bar
        // titles each screen and draws the built-in back button, themed by the
        // navigation theme below, with the title centred as iOS's own bar has it.
        headerShown
        headerTitleAlign='center'
        masterTitle={masterTitle}
        detailTitle={detailTitle}
        theme={navigationTheme}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// A column: under the two-column layout each column draws the platform's own
// navigation bar, through a one-screen navigator of its own; in the drill-in
// the shared drill-in stack's system bar titles the pane instead, so the column
// is bare content there.
// ---------------------------------------------------------------------------

// React Navigation, required only when a titled panel actually renders — never
// at module load — so importing this component pulls in no navigator.
type NativeModule = typeof import('@react-navigation/native');
type StackModule = typeof import('@react-navigation/native-stack');
type LazyNav = {
  native: NativeModule;
  Stack: ReturnType<StackModule['createNativeStackNavigator']>;
};
let lazyNav: LazyNav | null = null;
function loadNav(): LazyNav {
  if (!lazyNav) {
    const native = require('@react-navigation/native') as NativeModule;
    const stack = require('@react-navigation/native-stack') as StackModule;
    lazyNav = { native, Stack: stack.createNativeStackNavigator() };
  }
  return lazyNav;
}

function Panel({
  title,
  secondary = false,
  detailMaxWidth,
  navTheme,
  children,
}: {
  title?: string;
  secondary?: boolean;
  detailMaxWidth?: number;
  navTheme?: Theme;
  children: React.ReactNode;
}) {
  const { isWide } = useMasterDetail();
  const insets = useSafeAreaInsets();
  const capped =
    secondary && detailMaxWidth !== undefined ? (
      <View className='flex-1 items-center'>
        <View className='w-full flex-1' style={{ maxWidth: detailMaxWidth }}>
          {children}
        </View>
      </View>
    ) : (
      children
    );
  // The split owns only the detail's side safe area, because only it knows which
  // side is a screen edge and which is the divider: drilled in the detail is
  // full width and clears both notches, while beside the master only its right
  // is the screen's (its left is the divider). The master's own list clears its
  // left (see SplitMenuList), so the master pane adds nothing. Everything else —
  // the top, the bottom — is the platform's header or the content's own rule.
  if (!isWide) {
    const sides = secondary
      ? { paddingLeft: insets.left, paddingRight: insets.right }
      : undefined;
    return (
      <View className='min-h-0 flex-1 bg-background' style={sides}>
        {capped}
      </View>
    );
  }
  const sides = secondary ? { paddingRight: insets.right } : undefined;
  return (
    <NativeHeaderPanel title={title ?? ''} theme={navTheme}>
      <View className='min-h-0 flex-1 bg-background' style={sides}>
        {capped}
      </View>
    </NativeHeaderPanel>
  );
}

/**
 * One panel under the platform's own navigation bar: an independent one-screen
 * native stack, so the system draws the header — its height, the status-bar
 * space above it and the centred title — and nothing here computes them. Themed
 * by `theme` (its `card` is the bar, its `text` the title). Only in the
 * two-column layout; the drill-in's own stack titles the panes there.
 */
function NativeHeaderPanel({
  title,
  theme,
  children,
}: {
  title: string;
  theme?: Theme;
  children: React.ReactNode;
}) {
  const { native, Stack } = loadNav();
  const { NavigationContainer, NavigationIndependentTree } = native;
  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name='Panel' options={{ title, headerShown: true }}>
            {() => children}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

// ---------------------------------------------------------------------------
// Master list
// ---------------------------------------------------------------------------

export interface SplitMenuEntry {
  id: string;
  label: string;
  /** A trailing value shown muted at the end of the row (e.g. a current pick). */
  value?: string;
  /** A heading, not a choice: it names the entries under it. */
  heading?: boolean;
}

export interface SplitMenuListProps {
  /** What the list is a list of, for a screen reader. */
  label: string;
  entries: readonly SplitMenuEntry[];
  /** The chosen entry's id, marked beside the detail. */
  selected: string | null;
  onSelect: (id: string) => void;
}

/** The master panel's list, with the chosen entry marked as the web marks it. */
export function SplitMenuList({
  label,
  entries,
  selected,
  onSelect,
}: SplitMenuListProps) {
  const insets = useSafeAreaInsets();
  const { isWide, showDetail } = useMasterDetail();
  return (
    <FlatList
      className='flex-1 bg-background'
      accessibilityLabel={label}
      // Beside the detail only the left is cleared (the container widened the
      // panel for the left notch); drilled in, the list is full width and meets
      // the right edge too. The bottom clears the tab bar / home indicator.
      contentContainerStyle={{
        paddingLeft: insets.left,
        paddingRight: isWide ? 0 : insets.right,
        paddingBottom: insets.bottom,
      }}
      data={entries}
      // Every entry from the first frame: a menu of a couple of dozen rows at
      // most, and one drawn a screenful at a time hides rows from a screen
      // reader until somebody scrolls to them.
      initialNumToRender={entries.length}
      keyExtractor={(entry: SplitMenuEntry) => entry.id}
      renderItem={({ item }: { item: SplitMenuEntry }) => {
        if (item.heading) {
          return (
            <Text className='px-4 pb-1 pt-4 text-sm font-semibold uppercase text-muted-foreground'>
              {item.label}
            </Text>
          );
        }
        const isSelected = item.id === selected;
        const choose = () => {
          onSelect(item.id);
          // Drills into the detail where the view is one column; inert when both
          // columns are on screen.
          showDetail();
        };
        return (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isSelected }}
            onPress={choose}
            onAccessibilityTap={choose}
            className={cn(
              'flex-row items-center justify-between border-b border-border px-4',
              isSelected
                ? 'border-l-primary bg-primary/10'
                : 'border-l-transparent'
            )}
            style={styles.entry}
          >
            <Text className='flex-1 text-base text-foreground'>
              {item.label}
            </Text>
            {item.value ? (
              <Text className='ml-3 text-sm text-muted-foreground'>
                {item.value}
              </Text>
            ) : (
              <Chevron size={16} token='mutedForeground' />
            )}
          </Pressable>
        );
      }}
    />
  );
}

/** The secondary panel with nothing chosen (a wide screen's empty state). */
export function EmptySecondaryPanel({ message }: { message: string }) {
  return (
    <View className='flex-1 items-center justify-center bg-background p-8'>
      <Text className='text-center text-base text-muted-foreground'>
        {message}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Row disclosure chevron (a list affordance, not a nav control). Inline, so the
// library pulls in no icon set.
// ---------------------------------------------------------------------------

function Chevron({ size, token }: { size: number; token: ThemeColorToken }) {
  const color = useIconColor(token);
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M9 5l7 7-7 7'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  // The selection's bar on the left, present and clear when not selected so that
  // choosing an entry does not shift its words.
  entry: {
    minHeight: MIN_TOUCH_TARGET,
    borderLeftWidth: 3,
  },
});
