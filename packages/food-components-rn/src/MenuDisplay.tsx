import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface MenuDisplayProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * MenuDisplay (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/food-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const MenuDisplay: React.FC<MenuDisplayProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='MenuDisplay'
      {...props}
    >
      {children ?? <Text className='text-base'>{'MenuDisplay'}</Text>}
    </View>
  );
};
