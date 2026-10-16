import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SentimentIndicatorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SentimentIndicator (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/scheduling-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SentimentIndicator'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SentimentIndicator'}</Text>}
    </View>
  );
};
