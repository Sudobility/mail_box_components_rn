import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PermitApplicationProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PermitApplication (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/government-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PermitApplication: React.FC<PermitApplicationProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PermitApplication'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PermitApplication'}</Text>}
    </View>
  );
};
