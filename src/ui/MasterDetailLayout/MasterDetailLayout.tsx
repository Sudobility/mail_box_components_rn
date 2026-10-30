import * as React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { cn } from '../../lib/utils';
import { resolveIconColor, useIconColor } from '../../lib/icon-color';
import { pressProps } from '../../lib/a11y';

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
}: MasterDetailLayoutProps) {
  const [width, setWidth] = React.useState<number | null>(null);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);
  // Two columns until measured, and wherever there is room or no way to drill in.
  const twoColumn = !CAN_DRILL_IN || width === null || width >= breakpoint;
  return (
    <View testID='master-detail' style={styles.fill} onLayout={onLayout}>
      {twoColumn ? (
        <TwoColumn master={master} detail={detail} masterWidth={masterWidth} />
      ) : (
        <DrillIn
          master={master}
          detail={detail}
          onBack={onBack}
          masterTitle={masterTitle}
          detailTitle={detailTitle}
          headerShown={headerShown}
        />
      )}
    </View>
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

function DrillIn({
  master,
  detail,
  onBack,
  masterTitle,
  detailTitle,
  headerShown,
}: {
  master: React.ReactNode;
  detail: React.ReactNode;
  onBack?: () => void;
  masterTitle?: string;
  detailTitle?: string;
  headerShown: boolean;
}) {
  const { native, Stack } = loadNav();
  const { NavigationContainer, NavigationIndependentTree } = native;
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown }}>
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
});
