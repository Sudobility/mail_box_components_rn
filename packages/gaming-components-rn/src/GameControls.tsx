import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface GameControlsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * GameControls (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const GameControls: React.FC<GameControlsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='GameControls'
      {...props}
    >
      {children ?? <Text className='text-base'>{'GameControls'}</Text>}
    </View>
  );
};
