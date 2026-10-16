import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface InvoiceTemplateProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * InvoiceTemplate (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/finance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='InvoiceTemplate'
      {...props}
    >
      {children ?? <Text className='text-base'>{'InvoiceTemplate'}</Text>}
    </View>
  );
};
