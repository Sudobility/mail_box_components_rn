import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CursorTrackerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * CursorTracker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/monitoring-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const CursorTracker: React.FC<CursorTrackerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='CursorTracker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'CursorTracker'}</Text>}
    </View>
  );
};
