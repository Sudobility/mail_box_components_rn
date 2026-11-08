/**
 * A labelled slider — the platform's own control, themed.
 *
 * `@react-native-community/slider` is a thin wrapper over `UISlider`/`SeekBar`,
 * so a fader has the system's track, thumb, press-and-grow, haptics and
 * VoiceOver/TalkBack. macOS and Windows use the shared AppKit/painted `Slider`
 * (see the `.macos`/`.windows` variants). Callers use the same two names
 * everywhere.
 *
 * `LevelSlider` is an amount (track fills from the left in the accent);
 * `PositionSlider` is a position on a range (no fill — a bar growing from the
 * left would misread for pan). Colours are literal from `useThemeColor`, since
 * these are native views a NativeWind class never reaches.
 */
import NativeSlider from '@react-native-community/slider';
import { View } from 'react-native';
import { useThemeColor } from '../../lib/theme-color';

export type LevelSliderProps = {
  /** The accessible name — what property this controls. */
  label: string;
  value: number;
  min?: number;
  max?: number;
  /** Quantum. 0 means continuous. */
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  /** Fired once on release, for work too expensive to do per frame. */
  onSlidingComplete?: (value: number) => void;
  className?: string;
};

function BaseSlider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0,
  disabled = false,
  onChange,
  onSlidingComplete,
  className,
  filled,
}: LevelSliderProps & { filled: boolean }) {
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  return (
    <View className={className}>
      <NativeSlider
        accessibilityLabel={label}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        onValueChange={onChange}
        {...(onSlidingComplete ? { onSlidingComplete } : {})}
        minimumTrackTintColor={filled ? primary : border}
        maximumTrackTintColor={border}
        thumbTintColor={primary}
        style={{ opacity: disabled ? 0.5 : 1 }}
      />
    </View>
  );
}

/** An amount: the track fills from the left as the value grows. */
export function LevelSlider(props: LevelSliderProps) {
  return <BaseSlider {...props} filled />;
}

/**
 * A position on a range rather than an amount of one (pan: -1..1, default
 * centre). The track is not filled; the value is stated in words by the row
 * that owns the control.
 */
export function PositionSlider(props: LevelSliderProps) {
  return <BaseSlider {...props} filled={false} />;
}
