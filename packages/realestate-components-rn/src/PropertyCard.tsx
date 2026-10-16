import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PropertyCardProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PropertyCard (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/realestate-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PropertyCard'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PropertyCard'}</Text>}
    </View>
  );
};
