import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CpuMeterProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * CpuMeter (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/energy-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const CpuMeter: React.FC<CpuMeterProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='CpuMeter'
      {...props}
    >
      {children ?? <Text className='text-base'>{'CpuMeter'}</Text>}
    </View>
  );
};
