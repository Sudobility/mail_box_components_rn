import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SearchBarProps extends ViewProps {
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * SearchBar (placeholder)
 *
 * Structural placeholder mirroring the web stub in
 * `@sudobility/search-components`. The web source is a generated stub; this keeps
 * the RN package surface in parity until a real implementation lands.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('p-4 rounded-lg', disabled && 'opacity-50', className)}
      accessibilityLabel='SearchBar'
      {...props}
    >
      {children ?? <Text className='text-base'>{'SearchBar'}</Text>}
    </View>
  );
};
