import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface KnowledgeBaseProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * KnowledgeBase (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/education-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='KnowledgeBase'
      {...props}
    >
      {children ?? <Text className='text-base'>{'KnowledgeBase'}</Text>}
    </View>
  );
};
