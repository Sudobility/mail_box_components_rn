import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface NutritionLabelProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * NutritionLabel (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/food-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='NutritionLabel'
      {...props}
    >
      {children ?? <Text className='text-base'>{'NutritionLabel'}</Text>}
    </View>
  );
};
