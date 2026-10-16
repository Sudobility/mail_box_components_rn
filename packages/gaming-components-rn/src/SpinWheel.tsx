import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SpinWheelProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SpinWheel (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SpinWheel: React.FC<SpinWheelProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SpinWheel'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SpinWheel'}</Text>}
    </View>
  );
};
