import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '../index';
import { getCardVariantColors } from '@sudobility/design';
import { pressProps } from '../index';

export interface ApiPlaygroundProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => (
  <Pressable
    {...pressProps(disabled ? undefined : onPress, disabled)}
    disabled={disabled}
    accessibilityRole='button'
    accessibilityLabel='API Playground'
    accessibilityState={{ disabled }}
    className={cn(
      'p-4 rounded-lg',
      getCardVariantColors('bordered'),
      disabled && 'opacity-50',
      className
    )}
    {...props}
  >
    {children || (
      <Text className='text-foreground'>ApiPlayground Component</Text>
    )}
  </Pressable>
);
