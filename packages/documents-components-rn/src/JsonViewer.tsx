import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface JsonViewerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * JsonViewer (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/documents-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const JsonViewer: React.FC<JsonViewerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='JsonViewer'
      {...props}
    >
      {children ?? <Text className='text-base'>{'JsonViewer'}</Text>}
    </View>
  );
};
