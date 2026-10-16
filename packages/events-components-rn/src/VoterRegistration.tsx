import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface VoterRegistrationProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * VoterRegistration (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/events-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const VoterRegistration: React.FC<VoterRegistrationProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='VoterRegistration'
      {...props}
    >
      {children ?? <Text className='text-base'>{'VoterRegistration'}</Text>}
    </View>
  );
};
