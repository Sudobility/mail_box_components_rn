import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FarmEquipmentProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * FarmEquipment (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/agriculture-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const FarmEquipment: React.FC<FarmEquipmentProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='FarmEquipment'
      {...props}
    >
      {children ?? <Text className='text-base'>{'FarmEquipment'}</Text>}
    </View>
  );
};
