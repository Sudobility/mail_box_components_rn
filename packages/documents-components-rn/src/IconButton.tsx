import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

/** Tracking data for IconButton actions */
export interface IconButtonTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface IconButtonProps
  extends Omit<PressableProps, 'children' | 'disabled' | 'onPress'> {
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Button label for accessibility (required for screen readers) */
  accessibilityLabel: string;
  /** Press handler */
  onPress?: () => void;
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Button shape */
  shape?: 'circle' | 'square' | 'rounded';
  /** Color variant */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline';
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Tooltip content (optional); surfaced as an accessibility hint on RN */
  title?: string;
  /** Optional tracking callback */
  onTrack?: (data: IconButtonTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * IconButton Component
 *
 * Icon-only button with various sizes, shapes, and variants.
 * Includes proper accessibility attributes for screen readers.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  accessibilityLabel,
  onPress,
  size = 'md',
  shape = 'rounded',
  variant = 'default',
  disabled = false,
  className,
  title,
  onTrack,
  trackingLabel,
  componentName = 'IconButton',
  ...props
}) => {
  const handlePress = () => {
    if (!disabled) {
      onTrack?.({ action: 'click', trackingLabel, componentName });
      onPress?.();
    }
  };

  // Size configurations
  const sizeClasses = {
    xs: {
      button: 'p-1',
      icon: 'h-3 w-3',
    },
    sm: {
      button: 'p-1.5',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
    },
    lg: {
      button: 'p-3',
      icon: 'h-6 w-6',
    },
    xl: {
      button: 'p-4',
      icon: 'h-8 w-8',
    },
  };

  // Shape configurations
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  // Variant configurations using design system tokens
  const variantClasses = {
    default: `${colors.component.button.secondary.base} ${colors.component.button.secondary.dark}`,
    primary: `${colors.component.button.primary.base} ${colors.component.button.primary.dark}`,
    secondary: 'bg-accent text-accent-foreground',
    danger: `${colors.component.button.destructive.base} ${colors.component.button.destructive.dark}`,
    ghost: `${colors.component.button.ghost.base} ${colors.component.button.ghost.dark}`,
    outline: `${colors.component.button.outline.base} ${colors.component.button.outline.dark} border-2`,
  };

  const sizeConfig = sizeClasses[size];

  return (
    <Pressable
      {...pressProps(disabled ? undefined : handlePress, disabled)}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={title}
      accessibilityState={{ disabled }}
      className={cn(
        'items-center justify-center active:opacity-80',
        sizeConfig.button,
        shapeClasses[shape],
        variantClasses[variant],
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {/* TODO: icon color normally comes from the variant's text color via
          currentColor on web; on RN that depends on the supplied icon
          component honoring className. Size classes are passed through. */}
      <Icon className={sizeConfig.icon} />
    </Pressable>
  );
};
