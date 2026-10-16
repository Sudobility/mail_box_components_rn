import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ContractViewerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ContractViewer (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/legal-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ContractViewer: React.FC<ContractViewerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ContractViewer'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ContractViewer'}</Text>}
    </View>
  );
};
