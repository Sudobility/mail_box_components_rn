import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AttendanceCalendarProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AttendanceCalendar (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/hr-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AttendanceCalendar'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AttendanceCalendar'}</Text>}
    </View>
  );
};
