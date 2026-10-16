import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PrivacyToggleProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PrivacyToggle (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/security-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PrivacyToggle'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PrivacyToggle'}</Text>}
    </View>
  );
};
