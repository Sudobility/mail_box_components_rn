import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TravelChecklistProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TravelChecklist (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/travel-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const TravelChecklist: React.FC<TravelChecklistProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='TravelChecklist'
      {...props}
    >
      {children ?? <Text className='text-base'>{'TravelChecklist'}</Text>}
    </View>
  );
};
