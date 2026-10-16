import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface GasTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * GasTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/monitoring-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const GasTracker: React.FC<GasTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='GasTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'GasTracker'}</Text>}
    </View>
  );
};
