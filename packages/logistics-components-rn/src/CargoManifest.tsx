import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CargoManifestProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * CargoManifest (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/logistics-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const CargoManifest: React.FC<CargoManifestProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='CargoManifest'
      {...props}
    >
      {children ?? <Text className='text-base'>{'CargoManifest'}</Text>}
    </View>
  );
};
