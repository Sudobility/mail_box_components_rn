import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface InstagramWidgetProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * InstagramWidget (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/media-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const InstagramWidget: React.FC<InstagramWidgetProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='InstagramWidget'
      {...props}
    >
      {children ?? <Text className='text-base'>{'InstagramWidget'}</Text>}
    </View>
  );
};
