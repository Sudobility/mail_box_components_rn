import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors, textVariants, designTokens } from '@sudobility/design';

export interface PriceDisplayProps extends ViewProps {
  /** Price amount */
  amount: number;
  /** Currency code */
  currency?: string;
  /** Original price for comparison */
  originalPrice?: number;
  /** Display size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show currency symbol */
  showCurrency?: boolean;
  /** Show decimals */
  showDecimals?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * PriceDisplay Component
 *
 * Formatted price display with currency support.
 * Supports comparison pricing and multiple sizes.
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'USD',
  originalPrice,
  size = 'md',
  showCurrency = true,
  showDecimals = true,
  className,
  ...props
}) => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
  };

  const symbol = currencySymbols[currency] || currency;

  const formatPrice = (price: number): string => {
    if (showDecimals) {
      return price.toFixed(2);
    }
    return Math.round(price).toString();
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - amount) / originalPrice) * 100)
    : 0;

  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props}>
      <Text className={cn(textVariants.body.strong.md(), sizeStyles[size])}>
        {showCurrency && symbol}
        {formatPrice(amount)}
      </Text>

      {originalPrice && (
        <>
          <Text
            className={cn(
              'line-through',
              textVariants.body.muted.sm(),
              size === 'xl'
                ? 'text-xl'
                : size === 'lg'
                  ? 'text-base'
                  : 'text-sm'
            )}
          >
            {showCurrency && symbol}
            {formatPrice(originalPrice)}
          </Text>

          {discount > 0 && (
            <Text
              className={cn(
                'px-2 py-0.5 font-semibold',
                colors.component.badge.error.base,
                colors.component.badge.error.dark,
                designTokens.radius.md,
                size === 'xl'
                  ? 'text-base'
                  : size === 'lg'
                    ? 'text-sm'
                    : 'text-xs'
              )}
            >
              -{discount}%
            </Text>
          )}
        </>
      )}
    </View>
  );
};
