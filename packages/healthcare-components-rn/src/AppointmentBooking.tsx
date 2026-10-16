import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AppointmentBookingProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AppointmentBooking (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/healthcare-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AppointmentBooking'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AppointmentBooking'}</Text>}
    </View>
  );
};
