import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VitalSignsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VitalSigns (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/healthcare-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VitalSigns: React.FC<VitalSignsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VitalSigns'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VitalSigns'}</Text>}
    </View>
  );
};
