import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SkillProgressProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SkillProgress (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/hr-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SkillProgress: React.FC<SkillProgressProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SkillProgress'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SkillProgress'}</Text>}
    </View>
  );
};
