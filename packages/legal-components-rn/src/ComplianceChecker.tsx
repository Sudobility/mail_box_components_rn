import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ComplianceCheckerProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ComplianceChecker (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/legal-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ComplianceChecker'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ComplianceChecker'}</Text>}
    </View>
  );
};
