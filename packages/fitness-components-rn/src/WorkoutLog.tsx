import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface WorkoutLogProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * WorkoutLog (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/fitness-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const WorkoutLog: React.FC<WorkoutLogProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='WorkoutLog'
      {...props}
    >
      {children ?? <Text className='text-base'>{'WorkoutLog'}</Text>}
    </View>
  );
};
