import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface OrderCartProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * OrderCart (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/ecommerce-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const OrderCart: React.FC<OrderCartProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='OrderCart'
      {...props}
    >
      {children ?? <Text className='text-base'>{'OrderCart'}</Text>}
    </View>
  );
};
