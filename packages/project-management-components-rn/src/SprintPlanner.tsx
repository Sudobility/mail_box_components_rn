import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SprintPlannerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SprintPlanner (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/project-management-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SprintPlanner: React.FC<SprintPlannerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SprintPlanner'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SprintPlanner'}</Text>}
    </View>
  );
};
