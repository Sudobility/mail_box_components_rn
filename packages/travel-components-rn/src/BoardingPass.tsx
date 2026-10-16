import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface BoardingPassProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * BoardingPass (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/travel-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const BoardingPass: React.FC<BoardingPassProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='BoardingPass'
      {...props}
    >
      {children ?? <Text className='text-base'>{'BoardingPass'}</Text>}
    </View>
  );
};
