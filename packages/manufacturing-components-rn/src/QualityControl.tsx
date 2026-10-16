import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface QualityControlProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * QualityControl (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/manufacturing-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const QualityControl: React.FC<QualityControlProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='QualityControl'
      {...props}
    >
      {children ?? <Text className='text-base'>{'QualityControl'}</Text>}
    </View>
  );
};
