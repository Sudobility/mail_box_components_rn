import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { EntityRole } from '@sudobility/types';
import { cn, pressProps } from '../index';
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  ShieldCheckIcon,
  type IconProps,
} from './icons';

/** Tracking data for MemberRoleSelector actions */
export interface MemberRoleSelectorTrackingData {
  action: 'toggle' | 'select';
  trackingLabel?: string;
  componentName?: string;
}

export interface MemberRoleSelectorProps {
  /** Current role value */
  value: EntityRole;
  /** Change handler */
  onChange: (role: EntityRole) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: MemberRoleSelectorTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

interface RoleOption {
  value: EntityRole;
  label: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    value: EntityRole.OWNER,
    label: 'Owner',
    description: 'Full access to all settings and members',
    icon: ShieldCheckIcon,
    color: 'text-accent-foreground',
  },
  {
    value: EntityRole.MANAGER,
    label: 'Manager',
    description: 'Can manage projects and API keys',
    icon: BriefcaseIcon,
    color: 'text-primary',
  },
  {
    value: EntityRole.MEMBER,
    label: 'Member',
    description: 'Read-only access',
    icon: EyeIcon,
    color: 'text-muted-foreground',
  },
];

/**
 * MemberRoleSelector - A compact trigger showing the current role; pressing it
 * opens the list of roles, each with its icon and what it grants.
 *
 * RN counterpart of the web's `MemberRoleSelector` dropdown. The menu is a
 * modal here: a popover anchored to a list row has no room on a phone.
 */
export const MemberRoleSelector: React.FC<MemberRoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'MemberRoleSelector',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRole =
    roleOptions.find(r => r.value === value) || roleOptions[2];
  const SelectedIcon = selectedRole.icon;

  const handleToggle = () => {
    if (!disabled) {
      onTrack?.({ action: 'toggle', trackingLabel, componentName });
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (role: EntityRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onChange(role);
    setIsOpen(false);
  };

  return (
    <View className={className} style={style} testID={testID}>
      {/* Trigger Button */}
      <Pressable
        {...pressProps(handleToggle, disabled)}
        disabled={disabled}
        className={cn(
          'flex-row items-center gap-1.5 rounded border border-border bg-background px-2 py-1',
          disabled ? 'opacity-50' : 'active:bg-muted'
        )}
        accessibilityRole='button'
        accessibilityLabel={`Role: ${selectedRole.label}`}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <SelectedIcon size={14} className={selectedRole.color} />
        <Text className='text-sm text-foreground'>{selectedRole.label}</Text>
        <ChevronDownIcon size={14} className='text-muted-foreground' />
      </Pressable>

      {/* Role menu */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <Pressable
          {...pressProps(handleClose)}
          className='flex-1 justify-center bg-black/50 px-4'
        >
          <Pressable
            /* no-a11y-tap: swallows a press on the panel so it does not reach the scrim behind it. Not a control, and there is no gesture behind an assistive activation to stop. */
            onPress={e => e.stopPropagation()}
            className='overflow-hidden rounded-lg border border-border bg-card'
          >
            {/* Header */}
            <View className='border-b border-border px-4 py-3'>
              <Text
                className='text-lg font-semibold text-foreground'
                accessibilityRole='header'
              >
                Roles
              </Text>
            </View>

            {/* Role Options */}
            {roleOptions.map(option => {
              const OptionIcon = option.icon;
              const selected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  {...pressProps(() => handleSelect(option.value))}
                  className={cn(
                    'flex-row items-start gap-2 px-4 py-3 active:bg-muted',
                    selected && 'bg-muted'
                  )}
                  accessibilityRole='button'
                  accessibilityLabel={`${option.label}: ${option.description}`}
                  accessibilityState={{ selected }}
                >
                  <View className='mt-0.5'>
                    <OptionIcon size={16} className={option.color} />
                  </View>
                  <View className='min-w-0 flex-1'>
                    <View className='flex-row items-center gap-2'>
                      <Text className='text-sm font-medium text-foreground'>
                        {option.label}
                      </Text>
                      {selected ? (
                        <CheckIcon size={14} className='text-primary' />
                      ) : null}
                    </View>
                    <Text className='text-xs text-muted-foreground'>
                      {option.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            {/* Cancel Button */}
            <Pressable
              {...pressProps(handleClose)}
              accessibilityRole='button'
              accessibilityLabel='Cancel'
              className='items-center border-t border-border px-4 py-3 active:bg-muted'
            >
              <Text className='text-base font-medium text-primary'>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MemberRoleSelector;
