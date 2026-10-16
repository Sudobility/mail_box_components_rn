import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FlashcardProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Flashcard (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/automotive-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const Flashcard: React.FC<FlashcardProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='Flashcard'
      {...props}
    >
      {children ?? <Text className='text-base'>{'Flashcard'}</Text>}
    </View>
  );
};
