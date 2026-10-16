import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';

/** Tracking data for Collapsible actions */
export interface CollapsibleTrackingData {
  action: 'toggle';
  trackingLabel?: string;
  componentName?: string;
}

export interface CollapsibleProps {
  /** Trigger content (can be string or React node) */
  trigger: React.ReactNode;
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Initially open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onToggle?: (open: boolean) => void;
  /** Show chevron icon */
  showIcon?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Visual variant */
  variant?: 'default' | 'outlined';
  /** Enable animations */
  animated?: boolean;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: CollapsibleTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Collapsible Component (React Native)
 *
 * Expandable/collapsible section with customizable trigger and content.
 * Can be controlled or uncontrolled with icon indicators.
 *
 * @example
 * ```tsx
 * <Collapsible trigger="Show More">
 *   <Text>Hidden content goes here...</Text>
 * </Collapsible>
 * ```
 */
export const Collapsible: React.FC<CollapsibleProps> = ({
  trigger,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  showIcon = true,
  disabled = false,
  // transitionDuration/animated are retained for API parity; RN has no CSS
  // transitions so they do not drive animation here.
  transitionDuration = 300,
  variant = 'default',
  animated = false,
  className,
  onTrack,
  trackingLabel,
  componentName = 'Collapsible',
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // Use controlled value if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const isControlled = controlledIsOpen !== undefined;

  // Mark retained-for-parity props as used.
  void transitionDuration;
  void animated;

  const handleToggle = () => {
    if (disabled) return;

    onTrack?.({ action: 'toggle', trackingLabel, componentName });

    const newOpen = !isOpen;

    if (!isControlled) {
      setUncontrolledIsOpen(newOpen);
    }

    onToggle?.(newOpen);
  };

  const variantClasses = {
    default: '',
    outlined: cn('border border-border rounded-lg p-4'),
  };

  return (
    <View className={cn('w-full', variantClasses[variant], className)}>
      {/* Trigger */}
      <Pressable
        {...pressProps(disabled ? undefined : handleToggle, disabled)}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ expanded: isOpen, disabled }}
        className={cn(
          'flex-row items-center justify-between w-full',
          disabled && 'opacity-50',
          variant === 'default' && 'py-2'
        )}
      >
        <View className='flex-1 min-w-0'>
          {typeof trigger === 'string' || typeof trigger === 'number' ? (
            <Text className='text-foreground'>{trigger}</Text>
          ) : (
            trigger
          )}
        </View>
        {showIcon && (
          // TODO: substitute for heroicons ChevronDownIcon — glyph swaps
          // instead of rotating, matching the RN kit's chevron pattern.
          <Text className='text-muted-foreground text-lg ml-2'>
            {isOpen ? '▲' : '▼'}
          </Text>
        )}
      </Pressable>

      {/* Content */}
      {isOpen && (
        <View className='pt-2'>
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text className='text-foreground'>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
};
