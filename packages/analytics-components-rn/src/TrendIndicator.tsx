import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TrendIndicatorProps extends Omit<ViewProps, 'children'> {
  /** Current value */
  value: number;
  /** Previous value for comparison */
  previousValue: number;
  /** Display format */
  format?: 'percentage' | 'number' | 'currency';
  /** Currency symbol */
  currency?: string;
  /** Show arrow icon */
  showArrow?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * TrendIndicator Component
 *
 * Trend indicator showing increase/decrease.
 * Displays change with color coding and optional arrow.
 *
 * @example
 * ```tsx
 * <TrendIndicator
 *   value={125}
 *   previousValue={100}
 *   format="percentage"
 *   showArrow
 *   size="md"
 * />
 * ```
 */
export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  format = 'percentage',
  currency = '$',
  showArrow = true,
  size = 'md',
  className,
  ...props
}) => {
  const change = value - previousValue;
  const percentChange =
    previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  const formatValue = (): string => {
    switch (format) {
      case 'percentage':
        return `${Math.abs(percentChange).toFixed(1)}%`;
      case 'currency':
        return `${currency}${Math.abs(change).toFixed(2)}`;
      case 'number':
        return Math.abs(change).toFixed(0);
      default:
        return '';
    }
  };

  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const colorClass = isPositive ? 'text-success' : 'text-destructive';

  return (
    <View
      className={cn('flex-row items-center gap-1', className)}
      accessibilityRole='text'
      accessibilityLabel={`${isPositive ? 'Increase' : 'Decrease'} ${formatValue()}`}
      {...props}
    >
      {showArrow && (
        // TODO: web used an inline SVG arrow; RN renders a glyph substitute.
        <Text className={cn('font-semibold', sizeStyles[size], colorClass)}>
          {isPositive ? '↑' : '↓'}
        </Text>
      )}
      <Text className={cn('font-semibold', sizeStyles[size], colorClass)}>
        {isPositive ? '+' : '-'}
        {formatValue()}
      </Text>
    </View>
  );
};
