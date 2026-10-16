import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface RestaurantReviewProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * RestaurantReview (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/food-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const RestaurantReview: React.FC<RestaurantReviewProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='RestaurantReview'
      {...props}
    >
      {children ?? <Text className='text-base'>{'RestaurantReview'}</Text>}
    </View>
  );
};
