import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TripMeterProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TripMeter (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/energy-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TripMeter: React.FC<TripMeterProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TripMeter'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TripMeter'}</Text>}
    </View>
  );
};
