import React from 'react';
import { View, Text, Image, Pressable, type ViewProps } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors, textVariants, designTokens } from '@sudobility/design';

/** Tracking data for ProductCard actions */
export interface ProductCardTrackingData {
  action: 'click' | 'add_to_cart';
  trackingLabel?: string;
  componentName?: string;
}

export interface ProductCardProps extends Omit<ViewProps, 'children'> {
  /** Product image URL */
  image: string;
  /** Product name */
  name: string;
  /** Product price */
  price: number;
  /** Original price (for discounts) */
  originalPrice?: number;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Badge text */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'sale' | 'new' | 'featured';
  /** Press handler */
  onPress?: () => void;
  /** Add to cart handler */
  onAddToCart?: () => void;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: ProductCardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * ProductCard Component
 *
 * Product display card for e-commerce.
 * Shows image, name, price, rating, and actions.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  badgeVariant = 'new',
  onPress,
  onAddToCart,
  className,
  onTrack,
  trackingLabel,
  componentName = 'ProductCard',
  ...props
}) => {
  const badgeStyles = {
    sale: 'bg-destructive text-destructive-foreground',
    new: 'bg-success text-success-foreground',
    featured: 'bg-primary text-primary-foreground',
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handlePress = () => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onPress?.();
  };

  const handleAddToCart = () => {
    onTrack?.({ action: 'add_to_cart', trackingLabel, componentName });
    onAddToCart?.();
  };

  const content = (
    <>
      {/* Image */}
      <View className={cn('relative aspect-square overflow-hidden', 'bg-muted')}>
        <Image
          source={{ uri: image }}
          className='w-full h-full'
          resizeMode='cover'
          accessibilityLabel={name}
        />

        {/* Badge */}
        {badge && (
          <View className='absolute top-2 left-2'>
            <Text
              className={cn(
                'px-2 py-1 rounded text-xs font-semibold',
                badgeStyles[badgeVariant]
              )}
            >
              {badge}
            </Text>
          </View>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <View className='absolute top-2 right-2'>
            <Text className='px-2 py-1 rounded bg-warning text-warning-foreground text-xs font-semibold'>
              -{discount}%
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className='p-4'>
        {/* Name */}
        <Text
          className={cn(textVariants.heading.h6(), 'mb-2')}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Rating */}
        {rating !== undefined && (
          <View className='flex-row items-center gap-2 mb-2'>
            <View className='flex-row items-center'>
              {/* TODO: web used inline SVG stars; substituted with a glyph. */}
              {[1, 2, 3, 4, 5].map(star => (
                <Text
                  key={star}
                  className={cn(
                    'text-base',
                    star <= rating ? 'text-warning' : 'text-muted-foreground/40'
                  )}
                >
                  ★
                </Text>
              ))}
            </View>
            {reviewCount !== undefined && (
              <Text className={textVariants.body.sm()}>({reviewCount})</Text>
            )}
          </View>
        )}

        {/* Price */}
        <View className='flex-row items-center gap-2 mb-3'>
          <Text className={textVariants.heading.h4()}>${price.toFixed(2)}</Text>
          {originalPrice && (
            <Text className={cn(textVariants.body.muted.sm(), 'line-through')}>
              ${originalPrice.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Add to cart button */}
        {onAddToCart && (
          <Pressable
            {...pressProps(handleAddToCart)}
            accessibilityRole='button'
            accessibilityLabel='Add to Cart'
            className={cn(
              'w-full py-2 items-center active:opacity-80',
              colors.component.button.primary.base,
              colors.component.button.primary.dark,
              designTokens.radius.lg
            )}
          >
            <Text className='text-white font-medium'>Add to Cart</Text>
          </Pressable>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        {...pressProps(handlePress)}
        accessibilityRole='button'
        accessibilityLabel={name}
        className={cn(
          colors.component.card.default.base,
          colors.component.card.default.dark,
          designTokens.radius.lg,
          designTokens.shadow.md,
          'overflow-hidden active:opacity-90',
          className
        )}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className={cn(
        colors.component.card.default.base,
        colors.component.card.default.dark,
        designTokens.radius.lg,
        designTokens.shadow.md,
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {content}
    </View>
  );
};
