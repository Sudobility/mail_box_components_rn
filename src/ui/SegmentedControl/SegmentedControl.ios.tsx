/**
 * A one-of-N picker — the real `UISegmentedControl` iOS/iPadOS uses for this
 * job: the sliding selected segment, the press-and-hold drag, equal-width
 * division, the VoiceOver phrasing ("Track, tab, 1 of 4"). None of that comes
 * out of a row of pressables.
 *
 * `SegmentedControl.tsx` is the tab-row fallback other platforms resolve — the
 * segmented-control package's own non-iOS build draws an iOS control on
 * Android, so it is deliberately not used.
 *
 * The tint is literal, from `useThemeColor`, because this is a native view and
 * a NativeWind class never reaches it.
 */
import NativeSegmentedControl from '@react-native-segmented-control/segmented-control';
import { View } from 'react-native';
import { useThemeColor } from '../../lib/theme-color';
import type { SegmentedControlProps } from './SegmentedControl';

export type { SegmentedOption, SegmentedControlProps } from './SegmentedControl';

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  testID,
  containerClassName = 'px-1 py-2',
}: SegmentedControlProps) {
  const tint = useThemeColor('primary');
  const fg = useThemeColor('foreground');
  const onPrimary = useThemeColor('primaryForeground');
  const selected = options.findIndex(option => option.value === value);

  return (
    <View className={containerClassName} accessibilityLabel={label}>
      <NativeSegmentedControl
        {...(testID ? { testID } : {})}
        values={options.map(option => option.label)}
        selectedIndex={selected < 0 ? 0 : selected}
        onChange={event => {
          const next = options[event.nativeEvent.selectedSegmentIndex];
          if (next) onChange(next.value);
        }}
        {...(tint ? { tintColor: tint } : {})}
        {...(fg ? { fontStyle: { color: fg } } : {})}
        {...(onPrimary ? { activeFontStyle: { color: onPrimary } } : {})}
      />
    </View>
  );
}
