import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface OpenHouseProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * OpenHouse (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/realestate-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const OpenHouse: React.FC<OpenHouseProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='OpenHouse'
      {...props}
    >
      {children ?? <Text className='text-base'>{'OpenHouse'}</Text>}
    </View>
  );
};
