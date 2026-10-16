import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface InterviewSchedulerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * InterviewScheduler (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scheduling-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='InterviewScheduler'
      {...props}
    >
      {children ?? <Text className='text-base'>{'InterviewScheduler'}</Text>}
    </View>
  );
};
