import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface BudgetTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * BudgetTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/finance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='BudgetTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'BudgetTracker'}</Text>}
    </View>
  );
};
