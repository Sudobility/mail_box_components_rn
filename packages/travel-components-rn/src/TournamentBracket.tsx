import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TournamentBracketProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TournamentBracket (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/travel-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TournamentBracket'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TournamentBracket'}</Text>}
    </View>
  );
};
