import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ResourceBookingProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ResourceBooking (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/travel-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ResourceBooking: React.FC<ResourceBookingProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ResourceBooking'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ResourceBooking'}</Text>}
    </View>
  );
};
