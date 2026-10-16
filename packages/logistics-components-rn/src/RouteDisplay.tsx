import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface RouteDisplayProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * RouteDisplay (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/logistics-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='RouteDisplay'
      {...props}
    >
      {children ?? <Text className='text-base'>{'RouteDisplay'}</Text>}
    </View>
  );
};
