/**
 * A one-of-N picker across the top of a panel.
 *
 * On iOS/iPadOS this is a real `UISegmentedControl` (`SegmentedControl.ios.tsx`);
 * on macOS a hand-drawn `NSSegmentedControl`-style strip (`.macos.tsx`). This
 * file is what every other platform resolves — deliberately *not* the
 * segmented-control package's own JS fallback, which draws an iOS control on
 * Android (the wrong idiom there). Android's control for a small set of panel
 * sections is a tab row, which is what this draws.
 *
 * All variants export one component with one signature; a caller never learns
 * which it got. The two padding knobs exist because a native segmented control
 * divides its width equally and elides a label that does not fit, so a caller
 * with tight space tunes `containerClassName` (ios/macos) and `triggerClassName`
 * (the tab-row fallback).
 */
import { Tabs, TabsList, TabsTrigger } from '../Tabs';
import { Text } from '../Text';

export type SegmentedOption = {
  value: string;
  label: string;
};

export type SegmentedControlProps = {
  /** The accessible name of the group — what these sections belong to. */
  label: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /**
   * Names the control for a test. The variants render entirely different things
   * (a native view whose labels are a `values` prop vs. a row of pressables),
   * so a shared handle lets a test drive whichever it got.
   */
  testID?: string;
  /** Wrapper padding for the native (ios/macos) variants. Default `px-1 py-2`. */
  containerClassName?: string;
  /** Trigger padding for the tab-row fallback. */
  triggerClassName?: string;
};

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  testID,
  triggerClassName,
}: SegmentedControlProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      {...(testID ? { testID } : {})}
    >
      <TabsList>
        {options.map(option => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            {...(triggerClassName ? { className: triggerClassName } : {})}
          >
            <Text
              className={
                value === option.value
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }
            >
              {option.label}
            </Text>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
