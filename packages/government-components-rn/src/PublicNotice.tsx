import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface PublicNoticeProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * PublicNotice (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/government-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const PublicNotice: React.FC<PublicNoticeProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='PublicNotice'
      {...props}
    >
      {children ?? <Text className='text-base'>{'PublicNotice'}</Text>}
    </View>
  );
};
