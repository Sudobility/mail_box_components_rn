import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ConfidenceMeterProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ConfidenceMeter (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/energy-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ConfidenceMeter'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ConfidenceMeter'}</Text>}
    </View>
  );
};
