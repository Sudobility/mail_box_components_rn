import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface QuizCardProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * QuizCard (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/education-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const QuizCard: React.FC<QuizCardProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='QuizCard'
      {...props}
    >
      {children ?? <Text className='text-base'>{'QuizCard'}</Text>}
    </View>
  );
};
