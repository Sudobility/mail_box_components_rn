import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VacationPlannerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VacationPlanner (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/travel-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VacationPlanner: React.FC<VacationPlannerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VacationPlanner'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VacationPlanner'}</Text>}
    </View>
  );
};
