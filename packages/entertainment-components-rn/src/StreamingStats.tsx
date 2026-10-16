import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface StreamingStatsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * StreamingStats (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/entertainment-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const StreamingStats: React.FC<StreamingStatsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='StreamingStats'
      {...props}
    >
      {children ?? <Text className='text-base'>{'StreamingStats'}</Text>}
    </View>
  );
};
