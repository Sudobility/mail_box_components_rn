import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SustainabilityScoreProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SustainabilityScore (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SustainabilityScore'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SustainabilityScore'}</Text>}
    </View>
  );
};
