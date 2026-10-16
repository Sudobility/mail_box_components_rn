import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface QuoteGeneratorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * QuoteGenerator (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/workflow-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='QuoteGenerator'
      {...props}
    >
      {children ?? <Text className='text-base'>{'QuoteGenerator'}</Text>}
    </View>
  );
};
