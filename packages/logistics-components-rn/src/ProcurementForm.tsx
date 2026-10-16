import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ProcurementFormProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ProcurementForm (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/logistics-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ProcurementForm: React.FC<ProcurementFormProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ProcurementForm'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ProcurementForm'}</Text>}
    </View>
  );
};
