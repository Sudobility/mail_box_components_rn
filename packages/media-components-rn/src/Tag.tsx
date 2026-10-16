import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface TagProps {
  /** Tag label */
  children: React.ReactNode;
  /** Color variant */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show close button */
  onRemove?: () => void;
  /** Press handler */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Tag Component
 *
 * Small label or badge with optional remove button.
 * Commonly used for filters, selections, categories, and tags.
 *
 * @example
 * ```tsx
 * <Tag variant="primary">JavaScript</Tag>
 * <Tag variant="success" onRemove={() => removeTag('id')}>
 *   Selected Item
 * </Tag>
 * ```
 */
export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  onPress,
  disabled = false,
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      tag: 'px-2 py-0.5 gap-1',
      text: 'text-xs',
      icon: 'text-xs',
    },
    md: {
      tag: 'px-2.5 py-1 gap-1.5',
      text: 'text-sm',
      icon: 'text-sm',
    },
    lg: {
      tag: 'px-3 py-1.5 gap-2',
      text: 'text-base',
      icon: 'text-base',
    },
  };

  // Color variant configurations using design system tokens
  const badgeColors = colors.component.badge;
  const variantClasses = {
    default: `${badgeColors.default.base} ${badgeColors.default.dark}`,
    primary: `${badgeColors.primary.base} ${badgeColors.primary.dark}`,
    success: `${badgeColors.success.base} ${badgeColors.success.dark}`,
    warning: `${badgeColors.warning.base} ${badgeColors.warning.dark}`,
    danger: `${badgeColors.error.base} ${badgeColors.error.dark}`,
    info: 'bg-info/10 text-info',
    purple: 'bg-accent text-accent-foreground',
  };

  const sizeConfig = sizeClasses[size];
  const isInteractive = Boolean(onPress);

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  const handleRemove = () => {
    if (disabled || !onRemove) return;
    onRemove();
  };

  const content = (
    <>
      <Text className={cn(sizeConfig.text, variantClasses[variant])}>
        {children}
      </Text>
      {onRemove && (
        <Pressable
          {...pressProps(handleRemove, disabled)}
          disabled={disabled}
          accessibilityRole='button'
          accessibilityLabel='Remove'
          accessibilityState={{ disabled }}
          className='items-center justify-center rounded-full active:opacity-70'
        >
          {/* TODO: web used @heroicons XMarkIcon; substituting a glyph to avoid a new dep */}
          <Text className={cn(sizeConfig.icon, variantClasses[variant])}>
            {'×'}
          </Text>
        </Pressable>
      )}
    </>
  );

  const containerClassName = cn(
    'flex-row items-center rounded-full',
    sizeConfig.tag,
    variantClasses[variant],
    disabled && 'opacity-50',
    className
  );

  if (isInteractive) {
    return (
      <Pressable
        {...pressProps(handlePress, disabled)}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        className={cn(containerClassName, !disabled && 'active:opacity-80')}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClassName}>{content}</View>;
};
