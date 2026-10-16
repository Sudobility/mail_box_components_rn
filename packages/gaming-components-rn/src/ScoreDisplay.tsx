import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ScoreDisplayProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ScoreDisplay (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ScoreDisplay'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ScoreDisplay'}</Text>}
    </View>
  );
};
