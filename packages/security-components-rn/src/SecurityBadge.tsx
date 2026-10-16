import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SecurityBadgeProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SecurityBadge (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/security-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SecurityBadge'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SecurityBadge'}</Text>}
    </View>
  );
};
