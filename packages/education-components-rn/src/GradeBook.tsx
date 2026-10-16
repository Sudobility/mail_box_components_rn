import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface GradeBookProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * GradeBook (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/education-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const GradeBook: React.FC<GradeBookProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='GradeBook'
      {...props}
    >
      {children ?? <Text className='text-base'>{'GradeBook'}</Text>}
    </View>
  );
};
