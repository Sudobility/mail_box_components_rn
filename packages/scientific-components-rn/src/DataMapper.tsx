import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DataMapperProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * DataMapper (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scientific-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const DataMapper: React.FC<DataMapperProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='DataMapper'
      {...props}
    >
      {children ?? <Text className='text-base'>{'DataMapper'}</Text>}
    </View>
  );
};
