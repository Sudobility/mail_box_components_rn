import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface GeofenceEditorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * GeofenceEditor (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scientific-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const GeofenceEditor: React.FC<GeofenceEditorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='GeofenceEditor'
      {...props}
    >
      {children ?? <Text className='text-base'>{'GeofenceEditor'}</Text>}
    </View>
  );
};
