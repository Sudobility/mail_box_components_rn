import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AchievementBadgeProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AchievementBadge (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/gaming-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AchievementBadge'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AchievementBadge'}</Text>}
    </View>
  );
};
