import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VesselTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VesselTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/logistics-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VesselTracker: React.FC<VesselTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VesselTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VesselTracker'}</Text>}
    </View>
  );
};
