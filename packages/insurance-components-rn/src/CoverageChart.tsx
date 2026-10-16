import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CoverageChartProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * CoverageChart (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/insurance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const CoverageChart: React.FC<CoverageChartProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='CoverageChart'
      {...props}
    >
      {children ?? <Text className='text-base'>{'CoverageChart'}</Text>}
    </View>
  );
};
