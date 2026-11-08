/**
 * A one-of-N picker — macOS. A segmented control like iOS (not a tab row), hand
 * drawn rather than via `@react-native-segmented-control` (whose native view is
 * UIKit-only, and whose JS drawing moves its pill with a native-driven
 * animation that never reaches a view on this react-native-macos build — so the
 * pill sat still while the label styling followed the real selection). Drawing
 * it here also lets each segment carry an accessible name, which the package's
 * JS drawing does not on macOS. No animation: a Mac segmented control does not
 * slide either.
 */
import { Pressable, View } from 'react-native';
import { Text } from '../Text';
import { MIN_TOUCH_TARGET, touchSlop } from '../../lib/touch-target';
import type { SegmentedControlProps } from './SegmentedControl';

export type {
  SegmentedOption,
  SegmentedControlProps,
} from './SegmentedControl';

/*
  Whole class strings, never a template with a hole in it: Tailwind extracts
  classes by scanning source text, so an interpolated variant never appears
  whole in the file and is silently never generated.
*/
const SEGMENT = 'flex-1 items-center justify-center rounded px-2 py-1';
const SEGMENT_SELECTED =
  'bg-primary flex-1 items-center justify-center rounded px-2 py-1';
const LABEL = 'text-muted-foreground text-sm';
const LABEL_SELECTED = 'text-primary-foreground text-sm font-medium';

/** `text-sm`'s 20pt line in `py-1`; `hitSlop` closes the gap to the min target vertically only. */
const SEGMENT_HEIGHT = 28;
const SLOP = touchSlop(MIN_TOUCH_TARGET, SEGMENT_HEIGHT);

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  testID,
  containerClassName = 'px-1 py-2',
}: SegmentedControlProps) {
  return (
    <View className={containerClassName}>
      {/*
        `button`, not `tab`, and the group takes no role: this
        react-native-macos build maps neither `tab` nor `tablist` onto an AppKit
        role, so both arrive as `AXUnknown`, which VoiceOver cannot press.
        `accessibilityState.selected` carries which one is on.
      */}
      <View
        accessibilityLabel={label}
        className='bg-muted flex-row rounded-md p-0.5'
        {...(testID ? { testID } : {})}
      >
        {options.map(option => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole='button'
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              // macOS has no synthesized-touch fallback for an assistive press.
              onAccessibilityTap={() => onChange(option.value)}
              hitSlop={SLOP}
              className={selected ? SEGMENT_SELECTED : SEGMENT}
            >
              <Text
                numberOfLines={1}
                className={selected ? LABEL_SELECTED : LABEL}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
