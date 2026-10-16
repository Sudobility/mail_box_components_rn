import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TelemetryChartProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TelemetryChart (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/iot-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TelemetryChart'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TelemetryChart'}</Text>}
    </View>
  );
};
