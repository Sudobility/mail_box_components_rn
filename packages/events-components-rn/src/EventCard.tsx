import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface EventCardProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * EventCard (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/events-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const EventCard: React.FC<EventCardProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='EventCard'
      {...props}
    >
      {children ?? <Text className='text-base'>{'EventCard'}</Text>}
    </View>
  );
};
