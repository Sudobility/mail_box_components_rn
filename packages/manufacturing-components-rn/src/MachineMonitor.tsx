import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface MachineMonitorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * MachineMonitor (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/manufacturing-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const MachineMonitor: React.FC<MachineMonitorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='MachineMonitor'
      {...props}
    >
      {children ?? <Text className='text-base'>{'MachineMonitor'}</Text>}
    </View>
  );
};
