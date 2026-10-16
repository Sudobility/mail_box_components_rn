import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  type ViewProps,
} from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors, textVariants, designTokens } from '@sudobility/design';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/** Tracking data for CartSummary actions */
export interface CartSummaryTrackingData {
  action: 'checkout';
  trackingLabel?: string;
  componentName?: string;
}

export interface CartSummaryProps extends Omit<ViewProps, 'children'> {
  /** Cart items */
  items: CartItem[];
  /** Shipping cost */
  shipping?: number;
  /** Tax amount */
  tax?: number;
  /** Discount amount */
  discount?: number;
  /** Currency symbol */
  currency?: string;
  /** Checkout handler */
  onCheckout?: () => void;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: CartSummaryTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * CartSummary Component
 *
 * Shopping cart summary with totals.
 * Shows items, subtotal, shipping, tax, and final total.
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  shipping = 0,
  tax = 0,
  discount = 0,
  currency = '$',
  onCheckout,
  className,
  onTrack,
  trackingLabel,
  componentName = 'CartSummary',
  ...props
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping + tax - discount;

  const handleCheckout = () => {
    onTrack?.({ action: 'checkout', trackingLabel, componentName });
    onCheckout?.();
  };

  return (
    <View
      className={cn(
        colors.component.card.default.base,
        colors.component.card.default.dark,
        designTokens.radius.lg,
        'border p-6',
        className
      )}
      {...props}
    >
      <Text className={cn(textVariants.heading.h4(), 'mb-4')}>
        Order Summary
      </Text>

      {/* Items */}
      <ScrollView className='max-h-64 mb-4'>
        <View className='gap-3'>
          {items.map(item => (
            <View key={item.id} className='flex-row gap-3'>
              {item.image && (
                <View
                  className={cn(
                    'w-16 h-16 overflow-hidden',
                    designTokens.radius.md,
                    'bg-muted'
                  )}
                >
                  <Image
                    source={{ uri: item.image }}
                    className='w-full h-full'
                    resizeMode='cover'
                    accessibilityLabel={item.name}
                  />
                </View>
              )}
              <View className='flex-1'>
                <Text className={textVariants.label.default()} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className={textVariants.body.sm()}>
                  Qty: {item.quantity}
                </Text>
              </View>
              <View className='items-end'>
                <Text className={textVariants.body.strong.md()}>
                  {currency}
                  {(item.price * item.quantity).toFixed(2)}
                </Text>
                <Text className={textVariants.body.sm()}>
                  {currency}
                  {item.price.toFixed(2)} each
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Divider */}
      <View className={cn('border-t my-4', 'border-border')} />

      {/* Summary lines */}
      <View className='gap-2 mb-4'>
        <View className='flex-row justify-between'>
          <Text className={textVariants.body.md()}>Subtotal</Text>
          <Text className={textVariants.body.md()}>
            {currency}
            {subtotal.toFixed(2)}
          </Text>
        </View>

        {shipping > 0 && (
          <View className='flex-row justify-between'>
            <Text className={textVariants.body.md()}>Shipping</Text>
            <Text className={textVariants.body.md()}>
              {currency}
              {shipping.toFixed(2)}
            </Text>
          </View>
        )}

        {tax > 0 && (
          <View className='flex-row justify-between'>
            <Text className={textVariants.body.md()}>Tax</Text>
            <Text className={textVariants.body.md()}>
              {currency}
              {tax.toFixed(2)}
            </Text>
          </View>
        )}

        {discount > 0 && (
          <View className='flex-row justify-between'>
            <Text className={colors.component.alert.success.icon}>Discount</Text>
            <Text className={colors.component.alert.success.icon}>
              -{currency}
              {discount.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View className={cn('border-t my-4', 'border-border')} />

      {/* Total */}
      <View className='flex-row justify-between items-center mb-4'>
        <Text className={textVariants.heading.h5()}>Total</Text>
        <Text className={textVariants.heading.h3()}>
          {currency}
          {total.toFixed(2)}
        </Text>
      </View>

      {/* Checkout button */}
      {onCheckout && (
        <Pressable
          {...pressProps(handleCheckout)}
          accessibilityRole='button'
          accessibilityLabel='Proceed to Checkout'
          className={cn(
            'w-full py-3 items-center active:opacity-80',
            colors.component.button.primary.base,
            colors.component.button.primary.dark,
            designTokens.radius.lg
          )}
        >
          <Text className='text-white font-semibold'>Proceed to Checkout</Text>
        </Pressable>
      )}
    </View>
  );
};
