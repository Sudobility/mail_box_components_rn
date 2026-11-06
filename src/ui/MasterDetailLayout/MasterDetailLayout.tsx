import * as React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { InitialState, Theme } from '@react-navigation/native';
import { cn } from '../../lib/utils';
import { resolveIconColor, useIconColor } from '../../lib/icon-color';
import { pressProps } from '../../lib/a11y';
import {
  createPlatformStackNavigator,
  type PlatformStackNavigator,
} from '../../lib/platform-stack';

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
 * MasterDetailLayout — the family's one responsive master/detail.
 *
 * Wide enough for two columns, the master list and the detail sit side by side
 * and choosing a row updates the detail in place. Too narrow for two (a phone
 * in portrait), it is one column at a time and choosing a row **pushes** the
 * detail over the master on a real navigation stack — the platform's own slide
 * and interactive back-swipe, not a hand-rolled animation. A back control (the
 * stack's own header, or `useMasterDetail().showMaster()`) returns.
 *
 * The push is a `@react-navigation/native-stack` in a `NavigationIndependentTree`
 * of its own, so a host drops this in without wiring it into its navigator. The
 * stack is created only in the narrow branch, so react-native-screens is never
 * asked for the macOS slice it does not ship — a desktop is always wide.
 *
 * Width is measured with `onLayout`, never `useWindowDimensions`: the view's own
 * frame is right inside a split that is narrower than the window, and on macOS
 * the window dimensions are the display's. Two columns until measured, so a test
 * renderer (which lays nothing out) and the first frame both show two.
 *
 * The list reaches the push through `useMasterDetail()`: `showDetail()` on a row
 * press, and `isWide` to tell a drill-in from a selection the detail beside it
 * already shows.
 */
export interface MasterDetailLayoutProps {
  /** The master list. It calls `useMasterDetail().showDetail()` on a row press. */
  master: React.ReactNode;
  /** The detail for the current selection. */
  detail: React.ReactNode;
  /** The two-column master width, in points (default 320). */
  masterWidth?: number;
  /** At/above this measured width both columns show; below it, drill in (default 768). */
  breakpoint?: number;
  /** Called when the reader returns from the detail to the master (narrow only). */
  onBack?: () => void;
  /** Titles for the pushed screens' own header; used only with `headerShown`. */
  masterTitle?: string;
  detailTitle?: string;
  /**
   * Draw the native stack's own header on the narrow screens. Off by default,
   * so a host that draws its own bar (the common case) does not get a second.
   */
  headerShown?: boolean;
  /**
   * The React Navigation theme for the drill-in stack's own container, so the
   * native header follows the app's colours (its `card` is the bar background,
   * its `text` the title and back control) rather than the library default's
   * white. Only used on the narrow drill-in, which is the only place a
   * navigator exists.
   */
  theme?: Theme;
  /**
   * How the drill-in header's title sits — `'center'` to match iOS's own
   * navigation bar, `'left'` for Material's. Native-stack's platform default
   * when omitted. Only the narrow drill-in has a header to align.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Whether the detail is the focused column — controlled, and read only when
   * the drill-in mounts (the narrow layout). Crossing the breakpoint — a phone
   * rotated between portrait and landscape, the iPhone Duo folded or unfolded,
   * an iPad narrowed in Split View — swaps the whole two-column/drill-in
   * subtree, so the drill-in's navigator is built afresh each time and, left to
   * itself, always starts on the master. With this `true` it starts on the
   * detail instead (the master beneath it, so Back still returns to the list),
   * the way `UISplitViewController` keeps the detail when it collapses: a reader
   * reading the detail in landscape stays on it after rotating to portrait
   * rather than being dropped back to the list.
   *
   * Omitted, the drill-in always begins on the master — the previous behaviour.
   * It is controlled because the parent is the only thing that outlives the
   * remount a breakpoint crossing forces; pair it with `onDetailFocusedChange`
   * so the parent's copy follows the reader's own drilling in and back, and the
   * right value is seeded on the next crossing.
   */
  detailFocused?: boolean;
  /**
   * The focused column changed inside the drill-in: the reader drilled into the
   * detail (`true`) or returned to the master (`false`). Lets the parent keep
   * {@link detailFocused} current across the remount a breakpoint crossing
   * forces. Not called in the two-column layout, which has no drill-in.
   */
  onDetailFocusedChange?: (focused: boolean) => void;
  /**
   * Controlled / deep-link mode — the web component's model, for a host whose
   * own router (React Navigation with a `linking` config, or any route state)
   * owns which item is selected, so a **deep link into a detail works**. When
   * set, the layout creates NO navigator of its own: wide shows both columns;
   * narrow shows the master when `'navigation'` and the detail when `'content'`.
   * The host derives this from a route — e.g. a screen param the `linking`
   * config maps — exactly as the web app derives its `mobileView` from the URL,
   * so RN and web take the same approach. In this mode the master content
   * navigates (updating that route) on a row press rather than calling
   * `showDetail()`, and the detail returns through `onBackToNavigation` (which
   * `useMasterDetail().showMaster()` also calls).
   *
   * Omitted, the layout is uncontrolled: it drills in on its own internal
   * `NavigationIndependentTree` stack — which a deep link cannot reach — the
   * existing behaviour for self-contained screens, and what `detailFocused`
   * tunes.
   */
  mobileView?: 'navigation' | 'content';
  /** Controlled mode: return from the detail to the master (the host clears the route). */
  onBackToNavigation?: () => void;
  /**
   * Controlled mode: the label on the narrow detail's built-in back control
   * (defaults to `masterTitle`, then "Back"). The control is drawn only when
   * `onBackToNavigation` is given — a host whose detail route has its own
   * native header omits it and lets that header carry back.
   */
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
 * `@react-navigation` is required only when the layout actually drills in —
 * never at module load. So importing this component (or anything else from the
 * library's barrel), and rendering its wide two-column layout, pulls in no
 * navigator: a host whose screens are only ever wide, and a test that merely
 * imports from the library, do not need react-navigation present or mocked.
 * Only the narrow push, which genuinely needs a navigator, loads one.
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
    // Native stack on a phone / tablet, JS stack on a desktop — though only a
    // phone/tablet ever drills in (`CAN_DRILL_IN`), so this is the native one in
    // practice. One wrapper either way (`createPlatformStackNavigator`).
    lazyNav = { native, Stack: createPlatformStackNavigator() };
  }
  return lazyNav;
}

/** Only a phone drills in; a desktop is always wide (and has no screens slice). */
const CAN_DRILL_IN = Platform.OS === 'ios' || Platform.OS === 'android';

export function MasterDetailLayout({
  master,
  detail,
  masterWidth = 320,
  breakpoint = 768,
  onBack,
  masterTitle,
  detailTitle,
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
  // Two columns until measured, and wherever there is room or no way to drill in.
  const twoColumn = !CAN_DRILL_IN || width === null || width >= breakpoint;
  // Controlled / deep-link mode: the host owns the selection through a route, so
  // the narrow layout is a plain master-or-detail swap with no navigator of its
  // own (the web component's model) rather than the internal drill-in stack.
  const controlled = mobileView !== undefined;
  return (
    <View testID='master-detail' style={styles.fill} onLayout={onLayout}>
      {twoColumn ? (
        <TwoColumn master={master} detail={detail} masterWidth={masterWidth} />
      ) : controlled ? (
        <ControlledNarrow
          master={master}
          detail={detail}
          mobileView={mobileView}
          onBackToNavigation={onBackToNavigation}
          backLabel={backButtonText ?? masterTitle}
        />
      ) : (
        <DrillIn
          master={master}
          detail={detail}
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
 * swap driven by the host's `mobileView`, with no navigator of its own — so a
 * deep link the host's router resolves lands straight on the detail. Mirrors the
 * web `MasterDetailLayout`'s mobile behaviour. `useMasterDetail()` still answers
 * here (`isWide` false, `showMaster` → `onBackToNavigation`), so a detail that
 * asks the context for its way back keeps working; `showDetail` is inert because
 * the host's master content navigates the route itself.
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
              style={styles.backControl}
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
  return (
    <MasterDetailContext.Provider value={WIDE_CONTEXT}>
      <View style={styles.row}>
        <View style={{ width: masterWidth }}>{master}</View>
        <View className='bg-border' style={styles.divider} />
        <View style={styles.detail}>{detail}</View>
      </View>
    </MasterDetailContext.Provider>
  );
}

/**
 * The drill-in's starting state when the detail is the focused column: the
 * master in the stack with the detail pushed over it (`index: 1`), so the
 * layout opens on the detail and Back still returns to the list. Read by
 * `NavigationContainer` once, when it mounts — which is exactly each time a
 * breakpoint crossing rebuilds this subtree.
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
  return (
    <NavigationIndependentTree>
      <NavigationContainer
        theme={theme}
        // Seed the detail on top when the parent says it was the focused column,
        // so a wide→narrow collapse lands there rather than on the list. Only
        // read at mount, which is when a breakpoint crossing rebuilds this tree.
        initialState={detailFocused ? DETAIL_FOCUSED_STATE : undefined}
        // Report drilling in and back so the parent's `detailFocused` stays
        // current for the next crossing. `index > 0` means the detail is on top;
        // it is not called on the initial mount (the parent already knows that
        // from `detailFocused`), only on a later push or pop.
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
    // Fires on the back gesture and the header back alike, as the detail leaves.
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

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  detail: { flex: 1, minWidth: 0 },
  divider: { width: StyleSheet.hairlineWidth },
  // The controlled narrow detail's built-in back control.
  backControl: { paddingHorizontal: 16, paddingVertical: 12 },
});
