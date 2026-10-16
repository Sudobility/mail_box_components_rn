import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FeedbackFormProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * FeedbackForm (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/social-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='FeedbackForm'
      {...props}
    >
      {children ?? <Text className='text-base'>{'FeedbackForm'}</Text>}
    </View>
  );
};
