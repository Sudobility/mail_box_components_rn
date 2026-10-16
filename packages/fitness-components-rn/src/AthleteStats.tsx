import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AthleteStatsProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AthleteStats (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/fitness-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AthleteStats: React.FC<AthleteStatsProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AthleteStats'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AthleteStats'}</Text>}
    </View>
  );
};
