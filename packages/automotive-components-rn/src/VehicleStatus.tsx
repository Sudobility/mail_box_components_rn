import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VehicleStatusProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VehicleStatus (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/automotive-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VehicleStatus: React.FC<VehicleStatusProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VehicleStatus'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VehicleStatus'}</Text>}
    </View>
  );
};
