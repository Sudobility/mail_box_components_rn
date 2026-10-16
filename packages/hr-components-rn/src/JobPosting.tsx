import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface JobPostingProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * JobPosting (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/hr-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const JobPosting: React.FC<JobPostingProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='JobPosting'
      {...props}
    >
      {children ?? <Text className='text-base'>{'JobPosting'}</Text>}
    </View>
  );
};
