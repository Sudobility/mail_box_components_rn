import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface LandingBuilderProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * LandingBuilder (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/marketing-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const LandingBuilder: React.FC<LandingBuilderProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='LandingBuilder'
      {...props}
    >
      {children ?? <Text className='text-base'>{'LandingBuilder'}</Text>}
    </View>
  );
};
