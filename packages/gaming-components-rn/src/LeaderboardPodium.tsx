import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface LeaderboardPodiumProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * LeaderboardPodium (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='LeaderboardPodium'
      {...props}
    >
      {children ?? <Text className='text-base'>{'LeaderboardPodium'}</Text>}
    </View>
  );
};
