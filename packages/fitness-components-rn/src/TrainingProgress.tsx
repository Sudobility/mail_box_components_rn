import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TrainingProgressProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TrainingProgress (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/fitness-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TrainingProgress'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TrainingProgress'}</Text>}
    </View>
  );
};
