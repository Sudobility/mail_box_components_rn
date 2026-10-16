import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PortScheduleProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PortSchedule (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scheduling-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PortSchedule: React.FC<PortScheduleProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PortSchedule'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PortSchedule'}</Text>}
    </View>
  );
};
