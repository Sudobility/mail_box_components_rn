import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ConnectionStatusProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ConnectionStatus (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/communication-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ConnectionStatus'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ConnectionStatus'}</Text>}
    </View>
  );
};
