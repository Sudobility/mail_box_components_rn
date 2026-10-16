import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ExerciseTimerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ExerciseTimer (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/fitness-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ExerciseTimer'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ExerciseTimer'}</Text>}
    </View>
  );
};
