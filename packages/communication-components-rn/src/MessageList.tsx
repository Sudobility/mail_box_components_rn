import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface MessageListProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * MessageList (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/communication-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const MessageList: React.FC<MessageListProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='MessageList'
      {...props}
    >
      {children ?? <Text className='text-base'>{'MessageList'}</Text>}
    </View>
  );
};
