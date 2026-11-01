import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '../index';

export interface SegmentedControlOption<T extends string = string> {
  /** Value for this option */
  value: T;
  /** Display label */
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Available options */
  options: SegmentedControlOption<T>[];
  /** Currently selected value */
  value: T;
  /** Selection change handler */
  onChange: (value: T) => void;
  /** Additional NativeWind classes for the container */
  className?: string;
  /** Whether the control is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SegmentedControl - A toggle control for switching between options
 *
 * Commonly used for billing period selection (Monthly/Yearly).
 * All labels are passed by the consumer for full localization control.
 *
 * Mirrors @sudobility/components/subscription' SegmentedControl (web).
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: 'monthly', label: t('billing.monthly') },
 *     { value: 'yearly', label: t('billing.yearly') },
 *   ]}
 *   value={billingPeriod}
 *   onChange={setBillingPeriod}
 * />
 * ```
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  disabled = false,
  size = 'md',
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={cn(
        // Mirrors web's `inline-flex`: a row that shrink-wraps its segments.
        // The consumer positions it (the pages center it in an `items-center`
        // wrapper); `self-start` is intentionally omitted so that wrapper wins.
        'flex-row rounded-lg p-1 bg-muted',
        disabled && 'opacity-50',
        className
      )}
      accessibilityRole='radiogroup'
    >
      {options.map(option => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={option.value}
            {...pressProps(() => !disabled && onChange(option.value), disabled)}
            disabled={disabled}
            accessibilityRole='radio'
            accessibilityState={{ selected: isSelected, disabled }}
            className={cn(
              sizeClasses[size],
              'rounded-md items-center justify-center',
              isSelected ? 'bg-card shadow-sm' : ''
            )}
          >
            <Text
              className={cn(
                textSizeClasses[size],
                'font-medium',
                isSelected ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
