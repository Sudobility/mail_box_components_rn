import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DefectTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * DefectTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/manufacturing-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const DefectTracker: React.FC<DefectTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='DefectTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'DefectTracker'}</Text>}
    </View>
  );
};
