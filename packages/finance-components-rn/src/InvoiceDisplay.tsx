import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface InvoiceDisplayProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * InvoiceDisplay (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/finance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='InvoiceDisplay'
      {...props}
    >
      {children ?? <Text className='text-base'>{'InvoiceDisplay'}</Text>}
    </View>
  );
};
