import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ContentContainerProps extends ViewProps {
  /** Content to lay out */
  children: React.ReactNode;
  /** Max-width size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'prose';
  /** Vertical spacing variant */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Additional className */
  className?: string;
}

const sizeClasses: Record<NonNullable<ContentContainerProps['size']>, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl lg:px-8',
  full: 'max-w-full',
  prose: 'max-w-prose',
};

const spacingClasses: Record<
  NonNullable<ContentContainerProps['spacing']>,
  string
> = {
  none: '',
  xs: 'py-2',
  sm: 'py-3',
  md: 'py-4',
  lg: 'py-6',
  xl: 'py-8',
  '2xl': 'py-12',
  '3xl': 'py-16',
};

const alignClasses: Record<
  NonNullable<ContentContainerProps['align']>,
  string
> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * ContentContainer Component
 *
 * Centered, max-width layout wrapper with configurable size, vertical
 * spacing, and text alignment.
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  size = 'xl',
  spacing = 'md',
  align = 'left',
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        'mx-auto w-full px-4 sm:px-6',
        sizeClasses[size],
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};
