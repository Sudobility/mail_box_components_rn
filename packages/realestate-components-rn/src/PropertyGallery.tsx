import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PropertyGalleryProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PropertyGallery (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/realestate-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PropertyGallery'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PropertyGallery'}</Text>}
    </View>
  );
};
