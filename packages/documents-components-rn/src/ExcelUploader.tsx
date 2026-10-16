import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ExcelUploaderProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ExcelUploader (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/documents-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ExcelUploader'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ExcelUploader'}</Text>}
    </View>
  );
};
