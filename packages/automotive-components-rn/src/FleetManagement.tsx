import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FleetManagementProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * FleetManagement (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/automotive-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const FleetManagement: React.FC<FleetManagementProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='FleetManagement'
      {...props}
    >
      {children ?? <Text className='text-base'>{'FleetManagement'}</Text>}
    </View>
  );
};
