/**
 * The Settings-style master list and empty-detail helpers that pair with
 * {@link MasterDetailLayout}.
 *
 * The master/detail *layout* itself — responsive two-column vs drill-in, the
 * platform's titled bars, the deep-link mode — is the one shared component,
 * `MasterDetailLayout`. These are just the list building blocks a Settings-style
 * screen hands it: `SplitMenuList` (the master column's selectable list, which
 * drives the layout's drill-in through `useMasterDetail()`) and
 * `EmptySecondaryPanel` (a wide screen's empty detail). They draw no layout of
 * their own, so there is still exactly one way to do master/detail.
 */
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSurfaceInsets } from '../../lib/safe-area-edges';
import { cn } from '../../lib/utils';
import { MIN_TOUCH_TARGET } from '../../lib/touch-target';
import { useIconColor } from '../../lib/icon-color';
import type { ThemeColorToken } from '../../lib/theme-color';
import { Text } from '../Text';
import { useMasterDetail } from '../MasterDetailLayout';

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
  const insets = useSurfaceInsets();
  const { isWide, showDetail } = useMasterDetail();
  return (
    <FlatList
      className='flex-1 bg-background'
      accessibilityLabel={label}
      // A vertically-scrollable list: it renders full-bleed and the system
      // insets its ends past the top bar and the bottom tab bar / home
      // indicator as a scroll inset (`contentInsetAdjustmentBehavior`), so the
      // list scrolls edge to edge while its first and last rows stop clear.
      contentInsetAdjustmentBehavior='automatic'
      // Horizontally it does not scroll, so its sides are padded by the safe
      // area (`useSurfaceInsets`, the app's edge rule): the left notch, and the
      // right only when drilled in full-width — beside the detail its right is
      // the divider, not a screen edge.
      contentContainerStyle={{
        paddingLeft: insets.left,
        paddingRight: isWide ? 0 : insets.right,
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
