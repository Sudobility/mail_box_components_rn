import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface BodyMetricsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * BodyMetrics (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/fitness-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const BodyMetrics: React.FC<BodyMetricsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='BodyMetrics'
      {...props}
    >
      {children ?? <Text className='text-base'>{'BodyMetrics'}</Text>}
    </View>
  );
};
