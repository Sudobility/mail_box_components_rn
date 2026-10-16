import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ContainerStatsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ContainerStats (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/analytics-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ContainerStats: React.FC<ContainerStatsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ContainerStats'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ContainerStats'}</Text>}
    </View>
  );
};
