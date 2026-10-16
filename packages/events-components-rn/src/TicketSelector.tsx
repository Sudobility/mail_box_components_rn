import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TicketSelectorProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TicketSelector (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/events-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TicketSelector: React.FC<TicketSelectorProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TicketSelector'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TicketSelector'}</Text>}
    </View>
  );
};
