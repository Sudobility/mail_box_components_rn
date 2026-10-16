import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface BillingCycleProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * BillingCycle (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/finance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const BillingCycle: React.FC<BillingCycleProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='BillingCycle'
      {...props}
    >
      {children ?? <Text className='text-base'>{'BillingCycle'}</Text>}
    </View>
  );
};
