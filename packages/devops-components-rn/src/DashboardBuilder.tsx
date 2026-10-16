import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DashboardBuilderProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * DashboardBuilder (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/devops-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='DashboardBuilder'
      {...props}
    >
      {children ?? <Text className='text-base'>{'DashboardBuilder'}</Text>}
    </View>
  );
};
