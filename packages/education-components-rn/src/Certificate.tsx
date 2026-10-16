import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CertificateProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Certificate (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/education-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const Certificate: React.FC<CertificateProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='Certificate'
      {...props}
    >
      {children ?? <Text className='text-base'>{'Certificate'}</Text>}
    </View>
  );
};
