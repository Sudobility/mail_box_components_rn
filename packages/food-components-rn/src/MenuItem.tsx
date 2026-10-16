import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

/** Tracking data for MenuItem actions */
export interface MenuItemTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface MenuItemProps {
  /** Menu item label */
  children: React.ReactNode;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Press handler */
  onPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Danger/destructive action */
  danger?: boolean;
  /** Show as selected/active */
  selected?: boolean;
  /** Additional description text */
  description?: string;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: MenuItemTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * MenuItem Component
 *
 * Reusable menu item for dropdowns, context menus, and navigation menus.
 * Supports icons, descriptions, shortcuts, and states.
 *
 * @example
 * ```tsx
 * <MenuItem icon={CogIcon} onPress={openSettings}>
 *   Settings
 * </MenuItem>
 * <MenuItem icon={TrashIcon} onPress={deleteItem} danger>
 *   Delete
 * </MenuItem>
 * ```
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon: Icon,
  onPress,
  disabled = false,
  danger = false,
  selected = false,
  description,
  shortcut,
  className,
  onTrack,
  trackingLabel,
  componentName = 'MenuItem',
}) => {
  const handlePress = () => {
    if (disabled) return;
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onPress?.();
  };

  return (
    <Pressable
      {...pressProps(handlePress, disabled)}
      disabled={disabled}
      accessibilityRole='menuitem'
      accessibilityState={{ disabled, selected }}
      className={cn(
        'flex-row items-center gap-3 px-3 py-2',
        !disabled && !danger && !selected && 'active:bg-muted',
        !disabled && !danger && selected && 'bg-primary/10',
        !disabled && danger && 'active:bg-destructive/10',
        disabled && 'opacity-50',
        className
      )}
    >
      {/* Icon. TODO: web passed heroicons-style components typed with a
          `className` prop; a real RN icon component must honor NativeWind
          className (or be swapped for an RN icon set). */}
      {Icon && (
        <View className='flex-shrink-0'>
          <Icon
            className={cn(
              'h-5 w-5',
              danger
                ? 'text-destructive'
                : selected
                  ? 'text-primary'
                  : 'text-muted-foreground'
            )}
          />
        </View>
      )}

      {/* Content */}
      <View className='flex-1 min-w-0'>
        <Text
          className={cn(
            textVariants.body.md(),
            danger
              ? 'text-destructive'
              : selected
                ? 'text-primary font-medium'
                : 'text-foreground'
          )}
        >
          {children}
        </Text>
        {description && (
          <Text
            className={cn(
              textVariants.caption.default(),
              'text-muted-foreground mt-0.5'
            )}
          >
            {description}
          </Text>
        )}
      </View>

      {/* Shortcut */}
      {shortcut && (
        <Text
          className={cn(
            textVariants.caption.default(),
            'text-muted-foreground flex-shrink-0'
          )}
        >
          {shortcut}
        </Text>
      )}
    </Pressable>
  );
};
