import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AchievementUnlockProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AchievementUnlock (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AchievementUnlock'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AchievementUnlock'}</Text>}
    </View>
  );
};
