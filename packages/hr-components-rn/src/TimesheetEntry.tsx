import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TimesheetEntryProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TimesheetEntry (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/hr-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TimesheetEntry: React.FC<TimesheetEntryProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TimesheetEntry'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TimesheetEntry'}</Text>}
    </View>
  );
};
