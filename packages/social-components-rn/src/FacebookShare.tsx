import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FacebookShareProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * FacebookShare (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/social-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const FacebookShare: React.FC<FacebookShareProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='FacebookShare'
      {...props}
    >
      {children ?? <Text className='text-base'>{'FacebookShare'}</Text>}
    </View>
  );
};
