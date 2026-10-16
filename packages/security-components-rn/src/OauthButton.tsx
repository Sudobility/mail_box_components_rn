import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface OauthButtonProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * OauthButton (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/security-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const OauthButton: React.FC<OauthButtonProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='OauthButton'
      {...props}
    >
      {children ?? <Text className='text-base'>{'OauthButton'}</Text>}
    </View>
  );
};
