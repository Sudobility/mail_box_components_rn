import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface MeetingSchedulerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * MeetingScheduler (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scheduling-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='MeetingScheduler'
      {...props}
    >
      {children ?? <Text className='text-base'>{'MeetingScheduler'}</Text>}
    </View>
  );
};
