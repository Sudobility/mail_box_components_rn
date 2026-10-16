import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AuditTrailProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * AuditTrail (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/finance-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const AuditTrail: React.FC<AuditTrailProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='AuditTrail'
      {...props}
    >
      {children ?? <Text className='text-base'>{'AuditTrail'}</Text>}
    </View>
  );
};
