import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ProjectTimelineProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ProjectTimeline (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/construction-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='ProjectTimeline'
      {...props}
    >
      {children ?? <Text className='text-base'>{'ProjectTimeline'}</Text>}
    </View>
  );
};
