import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface RecyclingTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * RecyclingTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/monitoring-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const RecyclingTracker: React.FC<RecyclingTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='RecyclingTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'RecyclingTracker'}</Text>}
    </View>
  );
};
