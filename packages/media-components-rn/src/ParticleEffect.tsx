import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ParticleEffectProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ParticleEffect (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/media-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ParticleEffect'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ParticleEffect'}</Text>}
    </View>
  );
};
