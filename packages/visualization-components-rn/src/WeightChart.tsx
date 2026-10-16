import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface WeightChartProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * WeightChart (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/visualization-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const WeightChart: React.FC<WeightChartProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='WeightChart'
      {...props}
    >
      {children ?? <Text className='text-base'>{'WeightChart'}</Text>}
    </View>
  );
};
