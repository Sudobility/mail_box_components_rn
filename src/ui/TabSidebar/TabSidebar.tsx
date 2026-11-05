import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../../lib/theme-color';
import { pressProps } from '../../lib/a11y';
import { Text } from '../Text';

/** The icon's size in a sidebar item, in points — the family's. */
const ICON_SIZE = 22;

export interface TabSidebarItem {
  /** A stable key, and the name handed back to `onTabPress`. */
  name: string;
  /** The label under the icon, and the item's accessibility label. */
  label: string;
  /**
   * Draws the icon at the colour and size the sidebar decides — the selected
   * tab's is the primary colour, the rest the muted one, so the consumer passes
   * `color` straight to its glyph rather than choosing a colour of its own.
   */
  renderIcon: (props: {
    focused: boolean;
    color: string | undefined;
    size: number;
  }) => React.ReactNode;
}

export interface TabSidebarProps {
  /** The tabs, top to bottom. */
  tabs: readonly TabSidebarItem[];
  /** The `name` of the tab currently showing. */
  activeName: string;
  /** A tab was chosen; its `name` is passed. */
  onTabPress: (name: string) => void;
}

/**
 * A vertical sidebar of icon-and-label tabs for a desktop window — macOS and
 * Windows, which have no system tab bar. One component for the whole family, in
 * `sudojo_app_rn`'s shape: a fixed-width column, each tab a wide item with its
 * icon above a small label, the selected one on a rounded highlight and in the
 * primary colour.
 *
 * **Its colours and its font are the design theme's**, so it stays consistent
 * with the app around it: the surfaces, the border and the icon colour come
 * from {@link useThemeColor}, and the label from the library's own {@link Text}
 * (its `color`/`size`/`weight` are theme tokens, and it carries the app font).
 *
 * The layout is explicit `StyleSheet`, not NativeWind className — a sidebar is
 * drawn only on a desktop, and react-native-macos / windows are where NativeWind
 * is least reliable, so the geometry is stated outright.
 */
export function TabSidebar({ tabs, activeName, onTabPress }: TabSidebarProps) {
  const card = useThemeColor('card');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const mutedForeground = useThemeColor('mutedForeground');
  const surfaceMuted = useThemeColor('muted');
  return (
    <View
      testID='tab-sidebar'
      style={[
        styles.sidebar,
        { backgroundColor: card, borderRightColor: border },
      ]}
    >
      <View style={styles.logoSpacer} />
      {tabs.map(tab => {
        const focused = activeName === tab.name;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole='button'
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: focused }}
            {...pressProps(() => onTabPress(tab.name))}
            style={styles.tabItem}
          >
            {/*
              The highlight is a sibling behind the icon, not the item's own
              background: on Windows an SVG whose parent view has a background or
              a corner radius is not drawn, so the selected icon vanished.
            */}
            {focused ? (
              <View
                pointerEvents='none'
                style={[styles.tabHighlight, { backgroundColor: surfaceMuted }]}
              />
            ) : null}
            {tab.renderIcon({
              focused,
              color: focused ? primary : mutedForeground,
              size: ICON_SIZE,
            })}
            <View style={styles.labelRow}>
              <Text
                size='xs'
                weight='medium'
                color={focused ? 'primary' : 'muted'}
                align='center'
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    alignItems: 'center',
  },
  logoSpacer: {
    height: 8,
  },
  tabItem: {
    width: 64,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  tabHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  labelRow: {
    marginTop: 4,
  },
});
