import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCalloutVariantColors } from '@sudobility/design';

export type CalloutVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'purple';

export interface CalloutProps {
  /**
   * Visual variant with different gradient colors
   */
  variant?: CalloutVariant;

  /**
   * Optional icon or emoji to display before text
   */
  icon?: React.ReactNode;

  /**
   * Content to display (can be text or React nodes)
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Callout Component
 *
 * A simple highlight box for important messages, benefits, or key points.
 * Perfect for drawing attention to specific content with visual emphasis.
 *
 * @example
 * ```tsx
 * <Callout variant="primary">
 *   🔐 Cryptographic security meets user convenience
 * </Callout>
 *
 * <Callout variant="success" icon="✨">
 *   Your changes have been saved successfully
 * </Callout>
 * ```
 */
export const Callout: React.FC<CalloutProps> = ({
  variant = 'primary',
  icon,
  children,
  className,
}) => {
  const { background, text } = getCalloutVariantColors(variant);

  // Check if children is a string to apply proper styling
  const isTextContent = typeof children === 'string';

  const renderIcon = (extraClass?: string) =>
    icon == null ? null : typeof icon === 'string' ? (
      <Text className={cn('mr-2', text, extraClass)}>{icon}</Text>
    ) : (
      icon
    );

  return (
    <View className={cn('rounded-xl p-6', background, className)}>
      {isTextContent ? (
        <Text className={cn('text-lg font-semibold', text)}>
          {typeof icon === 'string' ? `${icon} ` : null}
          {children}
        </Text>
      ) : (
        <View className='flex-row items-center'>
          {renderIcon()}
          <View className='flex-1'>{children}</View>
        </View>
      )}
    </View>
  );
};
