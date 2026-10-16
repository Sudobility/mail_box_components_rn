import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface UploadProgressProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * UploadProgress (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/documents-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const UploadProgress: React.FC<UploadProgressProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='UploadProgress'
      {...props}
    >
      {children ?? <Text className='text-base'>{'UploadProgress'}</Text>}
    </View>
  );
};
