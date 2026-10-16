import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VolunteerScheduleProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VolunteerSchedule (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/nonprofit-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VolunteerSchedule: React.FC<VolunteerScheduleProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VolunteerSchedule'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VolunteerSchedule'}</Text>}
    </View>
  );
};
