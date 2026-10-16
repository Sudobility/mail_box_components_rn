import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PresenceIndicatorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PresenceIndicator (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/communication-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PresenceIndicator'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PresenceIndicator'}</Text>}
    </View>
  );
};
