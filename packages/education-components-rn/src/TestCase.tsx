import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TestCaseProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TestCase (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/education-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TestCase: React.FC<TestCaseProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TestCase'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TestCase'}</Text>}
    </View>
  );
};
