import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PageBuilderProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PageBuilder (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/devops-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PageBuilder: React.FC<PageBuilderProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PageBuilder'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PageBuilder'}</Text>}
    </View>
  );
};
