import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SettingsGroupProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SettingsGroup (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/social-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SettingsGroup'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SettingsGroup'}</Text>}
    </View>
  );
};
