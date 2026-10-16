import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface RecipeRatingProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * RecipeRating (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/food-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const RecipeRating: React.FC<RecipeRatingProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='RecipeRating'
      {...props}
    >
      {children ?? <Text className='text-base'>{'RecipeRating'}</Text>}
    </View>
  );
};
