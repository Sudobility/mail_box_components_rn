import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ThemeSwitcherProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ThemeSwitcher (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/design-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ThemeSwitcher'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ThemeSwitcher'}</Text>}
    </View>
  );
};
