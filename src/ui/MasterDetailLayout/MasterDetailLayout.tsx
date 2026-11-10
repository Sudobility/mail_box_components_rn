import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  I18nManager,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { InitialState, Theme } from '@react-navigation/native';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  type EdgeInsets,
} from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { resolveIconColor, useIconColor } from '../../lib/icon-color';
import { pressProps } from '../../lib/a11y';
import { useSurfaceInsets } from '../../lib/safe-area-edges';
import {
  createPlatformStackNavigator,
  type PlatformStackNavigator,
} from '../../lib/platform-stack';

/** The master column's width beside the detail, in points. */
export const SPLIT_PRIMARY_PANEL_WIDTH = 320;
/** The detail's default minimum width before the layout collapses to one column. */
export const SPLIT_DETAIL_MIN_WIDTH = 400;

/** A desktop renders no panel navigation bar (react-native-macos/windows draw no
 * stack header); the detail is headed by a title in its own content and the list
 * is left to the window's title. */
const DESKTOP = Platform.OS === 'macos' || Platform.OS === 'windows';
/** Only a phone/tablet drills in; a desktop is always wide. */
const CAN_DRILL_IN = Platform.OS === 'ios' || Platform.OS === 'android';

const ZERO_INSETS: EdgeInsets = { top: 0, bottom: 0, left: 0, right: 0 };

/**
 * MasterListItem - Standardized list item with selection styling
 */
export interface MasterListItemProps {
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Press handler */
  onPress: () => void;
  /** Icon element to display (optional) */
  icon?: React.ReactNode;
  /** Main label text */
  label: string;
  /** Description text (optional) */
  description?: string;
  /** Additional className */
  className?: string;
}

export const MasterListItem: React.FC<MasterListItemProps> = ({
  isSelected,
  onPress,
  icon,
  label,
  description,
  className,
}) => {
  // The icon is given the row's colour unless it states its own; see
  // lib/icon-color.
  const iconColor = useIconColor(isSelected ? 'primary' : 'mutedForeground');
  return (
    <Pressable
      {...pressProps(onPress)}
      className={cn('relative p-4 border-b border-border', className)}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {/* Selection overlay */}
      {isSelected && (
        <View className='absolute inset-1 bg-primary/10 rounded-lg' />
      )}

      {/* Content */}
      <View className='relative flex-row items-start'>
        {icon && (
          <View className='mr-3 mt-0.5'>
            {resolveIconColor(icon, iconColor)}
          </View>
        )}
        <View className='flex-1'>
          <Text
            className={cn(
              'font-medium',
              isSelected ? 'text-primary' : 'text-foreground'
            )}
          >
            {label}
          </Text>
          {description && (
            <Text
              className={cn(
                'text-xs mt-0.5',
                isSelected
                  ? 'text-primary dark:text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

/**
 * MasterDetailLayout — the family's ONE responsive master/detail.
 *
 * Wide enough for two columns, the master list and the detail sit side by side
 * and choosing a row updates the detail in place. Too narrow for two (a phone in
 * portrait), it is one column at a time: either an internal drill-in on the
 * platform's own navigation stack (the zero-config default) or — in controlled
 * `mobileView` mode — a plain master/detail swap the host's router drives, so a
 * deep link resolves straight to the detail.
 *
 * **Chrome is `headerShown`, and it governs BOTH layouts.** With it on, the
 * layout owns the screen: each column gets the platform's own titled navigation
 * bar (a one-screen native navigator) when wide, and the drill-in's real stack
 * header when narrow — the Settings/reading shape. With it off, the layout draws
 * no bars, so a host whose panes are themselves navigators (a multi-level detail
 * stack) supplies their headers with no doubling. That single switch is why one
 * component now serves both the Settings case and the content-stack case that
 * used to need two (`SplitViewContainer` was folded in here).
 *
 * The narrow drill-in is a `@react-navigation/native-stack` in a
 * `NavigationIndependentTree` of its own, built only in the narrow branch (so
 * react-native-screens is never asked for the macOS slice it does not ship — a
 * desktop is always wide). Width is measured with `onLayout`, never
 * `useWindowDimensions`, so it is right inside a split and on macOS alike.
 *
 * `SplitMenuList` / `EmptySecondaryPanel` (the Settings master list and its empty
 * detail) are plain list helpers that pair with this; see `../SplitView`.
 */
export interface MasterDetailLayoutProps {
  /** The master list. It calls `useMasterDetail().showDetail()` on a row press. */
  master: React.ReactNode;
  /** The detail for the current selection. */
  detail: React.ReactNode;
  /** The two-column master width, in points (default 320). */
  masterWidth?: number;
  /**
   * Drill in where there is room for only one column (default true). Pass
   * `false` for a surface that is only ever two columns (a desktop window, a
   * landscape-only app).
   */
  collapsible?: boolean;
  /**
   * The minimum width the detail needs beside the master: both columns show only
   * while `masterWidth + detailMinWidth` fits the measured width (default 400).
   * Honoured only when `collapsible` and no explicit `breakpoint` is given.
   */
  detailMinWidth?: number;
  /**
   * Cap the detail's content to this width and centre it past it, so a line
   * never runs the full width of a wide window. Omitted, the detail fills its
   * pane. Only meaningful with `headerShown` (the layout-owned chrome).
   */
  detailMaxWidth?: number;
  /**
   * The measured width at/above which both columns show. An advanced override;
   * normally derived from `collapsible` + `masterWidth` + `detailMinWidth`.
   */
  breakpoint?: number;
  /** Called when the reader returns from the detail to the master (narrow only). */
  onBack?: () => void;
  /** Titles for the columns' / pushed screens' own header; used with `headerShown`. */
  masterTitle?: string;
  detailTitle?: string;
  /**
   * Action buttons for the master column's header (its right side). On a
   * **desktop** the master's title-only bar is redundant chrome — the window
   * titles the app — so the two-column master bar is drawn there **only when it
   * has these actions**; without them the list stands alone (the detail still
   * gets its bar). On a phone/tablet the master bar is always drawn and these
   * sit in it. Ignored unless `headerShown`.
   */
  masterActions?: React.ReactNode;
  /**
   * Draw the platform's own titled navigation bar — on each column when wide and
   * on the drill-in when narrow. Off by default, so a host that draws its own
   * bars (panes that are navigators of their own) does not get a second.
   */
  headerShown?: boolean;
  /**
   * The React Navigation theme the bars follow (its `card` is the bar
   * background, its `text` the title and back control). Used by the two-column
   * column bars and the narrow drill-in's container.
   */
  theme?: Theme;
  /** How the header's title sits — `'center'` (iOS) or `'left'` (Material). */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Whether the detail is the focused column — controlled, read when the
   * drill-in mounts. Crossing the breakpoint rebuilds the drill-in, which left
   * to itself opens on the master; `true` opens it on the detail (Back still
   * returns to the list), so a reader stays on what they were reading across a
   * rotation. Pair with {@link onDetailFocusedChange}.
   */
  detailFocused?: boolean;
  /** The focused column changed inside the drill-in (drilled in `true` / back `false`). */
  onDetailFocusedChange?: (focused: boolean) => void;
  /**
   * Controlled / deep-link mode — for a host whose own router owns which item is
   * selected, so a deep link into a detail works. When set, the layout creates
   * no navigator of its own: wide shows both columns; narrow shows the master
   * when `'navigation'` and the detail when `'content'`. The master content
   * navigates (updating the route) on a row press, and the detail returns
   * through `onBackToNavigation`.
   */
  mobileView?: 'navigation' | 'content';
  /** Controlled mode: return from the detail to the master (the host clears the route). */
  onBackToNavigation?: () => void;
  /** Controlled mode: label on the narrow detail's built-in back control (default `masterTitle`). */
  backButtonText?: string;
}

interface MasterDetailContextValue {
  /** Both columns are on screen; a row press marks a selection, not a drill-in. */
  isWide: boolean;
  /** Push the detail over the master. Inert when wide. */
  showDetail: () => void;
  /** Return to the master. Inert when wide. */
  showMaster: () => void;
}

const MasterDetailContext = React.createContext<MasterDetailContextValue>({
  isWide: true,
  showDetail: () => {},
  showMaster: () => {},
});

/** Read the layout's mode and drive its drill-in from inside the master or detail. */
export function useMasterDetail(): MasterDetailContextValue {
  return React.useContext(MasterDetailContext);
}

type MasterDetailParamList = { Master: undefined; Detail: undefined };
type MasterDetailNavigation = NativeStackNavigationProp<MasterDetailParamList>;

/**
 * `@react-navigation` is required only when the layout actually draws a
 * navigator (the narrow drill-in, or a wide column bar) — never at module load,
 * so importing this component and rendering a bar-less two-column layout pulls
 * in no navigator.
 */
type NativeModule = typeof import('@react-navigation/native');
type LazyNav = {
  native: NativeModule;
  Stack: PlatformStackNavigator;
};
let lazyNav: LazyNav | null = null;
function loadNav(): LazyNav {
  if (!lazyNav) {
    const native = require('@react-navigation/native') as NativeModule;
    lazyNav = { native, Stack: createPlatformStackNavigator() };
  }
  return lazyNav;
}

export function MasterDetailLayout({
  master,
  detail,
  masterWidth = SPLIT_PRIMARY_PANEL_WIDTH,
  collapsible = true,
  detailMinWidth = SPLIT_DETAIL_MIN_WIDTH,
  detailMaxWidth,
  breakpoint,
  onBack,
  masterTitle,
  detailTitle,
  masterActions,
  headerShown = false,
  theme,
  headerTitleAlign,
  detailFocused = false,
  onDetailFocusedChange,
  mobileView,
  onBackToNavigation,
  backButtonText,
}: MasterDetailLayoutProps) {
  const [width, setWidth] = React.useState<number | null>(null);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);
  // The width at/above which both columns show: an explicit override, else
  // master + detail-minimum when collapsible, else 0 (always two columns).
  const effectiveBreakpoint =
    breakpoint !== undefined
      ? breakpoint
      : collapsible
        ? masterWidth + detailMinWidth
        : 0;
  // Two columns until measured, and wherever there is room or no way to drill in.
  const twoColumn =
    !CAN_DRILL_IN || width === null || width >= effectiveBreakpoint;
  // Controlled / deep-link mode: the host owns the selection through a route.
  const controlled = mobileView !== undefined;

  // Chrome: when `headerShown`, each column / pushed screen is dressed in the
  // platform's own titled bar via a `Panel`; otherwise content is passed raw so
  // a host's own navigators draw the bars. The whole surface is painted the
  // bar's colour so the status-bar strip reads as one continuous bar.
  const barColor = headerShown ? theme?.colors.card : undefined;
  const masterNode = headerShown ? (
    <Panel title={masterTitle} navTheme={theme} actions={masterActions}>
      {master}
    </Panel>
  ) : (
    master
  );
  const detailNode = headerShown ? (
    <Panel
      secondary
      title={detailTitle}
      detailMaxWidth={detailMaxWidth}
      navTheme={theme}
    >
      {detail}
    </Panel>
  ) : (
    detail
  );

  return (
    <View
      testID='master-detail'
      style={[styles.fill, barColor ? { backgroundColor: barColor } : null]}
      onLayout={onLayout}
    >
      {twoColumn ? (
        <TwoColumn
          master={masterNode}
          detail={detailNode}
          masterWidth={masterWidth}
        />
      ) : controlled ? (
        <ControlledNarrow
          master={masterNode}
          detail={detailNode}
          mobileView={mobileView}
          onBackToNavigation={onBackToNavigation}
          backLabel={backButtonText ?? masterTitle}
        />
      ) : (
        <DrillIn
          master={masterNode}
          detail={detailNode}
          onBack={onBack}
          masterTitle={masterTitle}
          detailTitle={detailTitle}
          headerShown={headerShown}
          theme={theme}
          headerTitleAlign={headerTitleAlign}
          detailFocused={detailFocused}
          onDetailFocusedChange={onDetailFocusedChange}
        />
      )}
    </View>
  );
}

/**
 * The narrow layout in controlled / deep-link mode: a plain master-or-detail
 * swap driven by the host's `mobileView`, with no navigator of its own.
 */
function ControlledNarrow({
  master,
  detail,
  mobileView,
  onBackToNavigation,
  backLabel,
}: {
  master: React.ReactNode;
  detail: React.ReactNode;
  mobileView: 'navigation' | 'content';
  onBackToNavigation?: () => void;
  backLabel?: string;
}) {
  // The detail here is full-screen with no native header, so the built-in back
  // control must clear the status bar / notch itself — nothing above it does.
  const insets = useSafeAreaInsets();
  const value = React.useMemo<MasterDetailContextValue>(
    () => ({
      isWide: false,
      showDetail: () => {},
      showMaster: () => onBackToNavigation?.(),
    }),
    [onBackToNavigation]
  );
  return (
    <MasterDetailContext.Provider value={value}>
      {mobileView === 'navigation' ? (
        master
      ) : (
        <View style={styles.fill}>
          {onBackToNavigation ? (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel={backLabel ?? 'Back'}
              testID='master-detail-back'
              {...pressProps(onBackToNavigation)}
              style={[styles.backControl, { paddingTop: insets.top + 12 }]}
            >
              <Text className='text-primary text-base font-medium'>
                {`‹ ${backLabel ?? 'Back'}`}
              </Text>
            </Pressable>
          ) : null}
          <View style={styles.fill}>{detail}</View>
        </View>
      )}
    </MasterDetailContext.Provider>
  );
}

const WIDE_CONTEXT: MasterDetailContextValue = {
  isWide: true,
  showDetail: () => {},
  showMaster: () => {},
};

function TwoColumn({
  master,
  detail,
  masterWidth,
}: {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterWidth: number;
}) {
  // Each pane keeps the window insets on its outer edges but zeroes the inner
  // edge it shares with the divider, so content inside a pane (which reads the
  // window insets) does not pad against the divider, and the far pane keeps the
  // real side inset in landscape. The primary pane is leading (left in LTR).
  const insets = React.useContext(SafeAreaInsetsContext) ?? ZERO_INSETS;
  const primaryInsets: EdgeInsets = I18nManager.isRTL
    ? { ...insets, left: 0 }
    : { ...insets, right: 0 };
  const secondaryInsets: EdgeInsets = I18nManager.isRTL
    ? { ...insets, right: 0 }
    : { ...insets, left: 0 };
  return (
    <MasterDetailContext.Provider value={WIDE_CONTEXT}>
      <View style={styles.row}>
        {/* Each column's content gets an explicit `flex-1` parent: a nested
            navigator (a `NativeHeaderPanel`'s, or a host pane that is itself a
            navigation stack) draws its header only inside a sized flex box — a
            column that has only a width is not enough. */}
        <View style={{ width: masterWidth }}>
          <SafeAreaInsetsContext.Provider value={primaryInsets}>
            <View style={styles.fill}>{master}</View>
          </SafeAreaInsetsContext.Provider>
        </View>
        <View className='bg-border' style={styles.divider} />
        <View style={styles.detail}>
          <SafeAreaInsetsContext.Provider value={secondaryInsets}>
            <View style={styles.fill}>{detail}</View>
          </SafeAreaInsetsContext.Provider>
        </View>
      </View>
    </MasterDetailContext.Provider>
  );
}

/**
 * The drill-in's starting state when the detail is the focused column: the
 * master in the stack with the detail pushed over it, so the layout opens on the
 * detail and Back still returns to the list.
 */
const DETAIL_FOCUSED_STATE: InitialState = {
  index: 1,
  routes: [{ name: 'Master' }, { name: 'Detail' }],
};

function DrillIn({
  master,
  detail,
  onBack,
  masterTitle,
  detailTitle,
  headerShown,
  theme,
  headerTitleAlign,
  detailFocused,
  onDetailFocusedChange,
}: {
  master: React.ReactNode;
  detail: React.ReactNode;
  onBack?: () => void;
  masterTitle?: string;
  detailTitle?: string;
  headerShown: boolean;
  theme?: Theme;
  headerTitleAlign?: 'left' | 'center';
  detailFocused: boolean;
  onDetailFocusedChange?: (focused: boolean) => void;
}) {
  const { native, Stack } = loadNav();
  const { NavigationContainer, NavigationIndependentTree } = native;
  // Paint the surface the bar's colour so the status-bar strip the native header
  // leaves above itself reads as part of the bar (not the app background as a
  // white band), the way `TitledScreen` does it. `flex-1` keeps the container
  // sized.
  const barColor = headerShown ? theme?.colors.card : undefined;
  return (
    <View
      style={[styles.fill, barColor ? { backgroundColor: barColor } : null]}
    >
      <NavigationIndependentTree>
        <NavigationContainer
          theme={theme}
          initialState={detailFocused ? DETAIL_FOCUSED_STATE : undefined}
          onStateChange={
            onDetailFocusedChange
              ? state => onDetailFocusedChange((state?.index ?? 0) > 0)
              : undefined
          }
        >
          <Stack.Navigator screenOptions={{ headerShown, headerTitleAlign }}>
            <Stack.Screen name='Master' options={{ title: masterTitle ?? '' }}>
              {() => <MasterPane>{master}</MasterPane>}
            </Stack.Screen>
            <Stack.Screen name='Detail' options={{ title: detailTitle ?? '' }}>
              {() => <DetailPane onBack={onBack}>{detail}</DetailPane>}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </View>
  );
}

function MasterPane({ children }: { children: React.ReactNode }) {
  const navigation = loadNav().native.useNavigation<MasterDetailNavigation>();
  const value = React.useMemo<MasterDetailContextValue>(
    () => ({
      isWide: false,
      showDetail: () => navigation.navigate('Detail'),
      showMaster: () => {},
    }),
    [navigation]
  );
  return (
    <MasterDetailContext.Provider value={value}>
      {children}
    </MasterDetailContext.Provider>
  );
}

function DetailPane({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack?: () => void;
}) {
  const navigation = loadNav().native.useNavigation<MasterDetailNavigation>();
  React.useEffect(() => {
    if (!onBack) return undefined;
    return navigation.addListener('beforeRemove', () => onBack());
  }, [navigation, onBack]);
  const value = React.useMemo<MasterDetailContextValue>(
    () => ({
      isWide: false,
      showDetail: () => {},
      showMaster: () => navigation.goBack(),
    }),
    [navigation]
  );
  return (
    <MasterDetailContext.Provider value={value}>
      {children}
    </MasterDetailContext.Provider>
  );
}

/**
 * A column under a titled bar (when `headerShown`). In the phone/tablet
 * two-column layout each column wears the platform's own navigation bar; in the
 * drill-in / controlled narrow layouts the column is bare content (the stack's
 * own header, or the controlled back control, carries the chrome) with only its
 * side safe-area cleared. On a desktop — where no native stack header draws —
 * each column gets a plain themed title bar instead, but the master's is drawn
 * only when it has action buttons (a title-only sidebar bar is redundant there);
 * the detail always gets one.
 */
function Panel({
  title,
  secondary = false,
  detailMaxWidth,
  navTheme,
  actions,
  children,
}: {
  title?: string;
  secondary?: boolean;
  detailMaxWidth?: number;
  navTheme?: Theme;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isWide } = useMasterDetail();
  const insets = useSurfaceInsets();
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

  // DESKTOP two-column: a plain themed title bar (react-native-macos / windows
  // draw no native stack header). The detail always wears one; the master only
  // when it has action buttons, because a title-only bar over the sidebar list
  // is redundant chrome there — the window already titles the app.
  if (DESKTOP) {
    const showBar = secondary || actions != null;
    return (
      <View className='min-h-0 flex-1 bg-background'>
        {showBar ? (
          <DesktopBar title={title ?? ''} actions={actions} theme={navTheme} />
        ) : null}
        {capped}
      </View>
    );
  }

  // Narrow (drill-in / controlled): the stack's own header, or the controlled
  // back control, carries the chrome; this column is bare content with only its
  // side safe-area cleared.
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

  // Phone / tablet two-column: the platform's own navigation bar via a
  // one-screen native stack, master and detail alike.
  const sides = secondary ? { paddingRight: insets.right } : undefined;
  return (
    <NativeHeaderPanel
      title={title ?? ''}
      theme={navTheme}
      headerRight={actions}
    >
      <View className='min-h-0 flex-1 bg-background' style={sides}>
        {capped}
      </View>
    </NativeHeaderPanel>
  );
}

/**
 * One panel under the platform's own navigation bar: an independent one-screen
 * native stack, so the system draws the header (its height, the status-bar space
 * above it and the centred title) and nothing here computes them. Only in the
 * two-column layout; the drill-in's own stack titles the panes there.
 */
function NativeHeaderPanel({
  title,
  theme,
  headerRight,
  children,
}: {
  title: string;
  theme?: Theme;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { native, Stack } = loadNav();
  const { NavigationContainer, NavigationIndependentTree } = native;
  const barColor = theme?.colors.card;
  return (
    // The bar's own colour behind it, full-bleed and `flex-1`: the `flex-1` is
    // what makes the nested native stack draw its header at all — a bare
    // NavigationContainer in a column that has only a width (not flex) measures
    // to nothing and the header never appears — and the colour fills the strip
    // the native bar leaves above its opaque background, so it reads as one
    // continuous bar rather than the app background showing through (this is what
    // `TitledScreen` does for the plain screens).
    <View
      style={[styles.fill, barColor ? { backgroundColor: barColor } : null]}
    >
      <NavigationIndependentTree>
        <NavigationContainer theme={theme}>
          <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen
              name='Panel'
              options={{
                title,
                headerShown: true,
                headerRight: headerRight ? () => <>{headerRight}</> : undefined,
              }}
            >
              {() => <>{children}</>}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </View>
  );
}

/**
 * A plain themed title bar for the two-column layout on a desktop, where no
 * native stack header draws. Painted the nav theme's bar colour, with the title
 * (and optional action buttons) on it.
 */
function DesktopBar({
  title,
  actions,
  theme,
}: {
  title: string;
  actions?: React.ReactNode;
  theme?: Theme;
}) {
  const barColor = theme?.colors.card;
  const textColor = theme?.colors.text;
  const borderColor = theme?.colors.border;
  return (
    <View
      style={[
        styles.desktopBar,
        barColor ? { backgroundColor: barColor } : null,
        borderColor ? { borderBottomColor: borderColor } : null,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.desktopBarTitle,
          textColor ? { color: textColor } : null,
        ]}
      >
        {title}
      </Text>
      {actions ? <View style={styles.desktopBarActions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  detail: { flex: 1, minWidth: 0 },
  divider: { width: StyleSheet.hairlineWidth },
  // The controlled narrow detail's built-in back control.
  backControl: { paddingHorizontal: 16, paddingVertical: 12 },
  // The two-column desktop title bar (no native stack header on a desktop).
  desktopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  desktopBarTitle: { fontSize: 17, fontWeight: '600' },
  desktopBarActions: { flexDirection: 'row', alignItems: 'center' },
});
