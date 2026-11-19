import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { EntityWithRole } from '@sudobility/types';
import { cn, pressProps } from '../index';
import {
  BuildingOffice2Icon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  UserIcon,
} from './icons';

/** Tracking data for EntitySelector actions */
export interface EntitySelectorTrackingData {
  action: 'toggle' | 'select' | 'create_new';
  trackingLabel?: string;
  componentName?: string;
}

export interface EntitySelectorProps {
  /** Available entities */
  entities: EntityWithRole[];
  /** Currently selected entity */
  currentEntity: EntityWithRole | null;
  /** Selection handler */
  onSelect: (entity: EntityWithRole) => void;
  /** Handler for creating a new organization */
  onCreateNew?: () => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: EntitySelectorTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * EntitySelector - Selector for switching between entities: the personal
 * workspace, then the organizations, then "Create organization".
 *
 * RN counterpart of the web's `EntitySelector` dropdown; the menu is a modal
 * here.
 */
export const EntitySelector: React.FC<EntitySelectorProps> = ({
  entities,
  currentEntity,
  onSelect,
  onCreateNew,
  isLoading = false,
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'EntitySelector',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const personalEntities = entities.filter(e => e.entityType === 'personal');
  const organizationEntities = entities.filter(
    e => e.entityType === 'organization'
  );

  const handleToggle = () => {
    onTrack?.({ action: 'toggle', trackingLabel, componentName });
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (entity: EntityWithRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onSelect(entity);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onTrack?.({ action: 'create_new', trackingLabel, componentName });
    onCreateNew?.();
    setIsOpen(false);
  };

  const renderItem = (entity: EntityWithRole) => {
    const isPersonal = entity.entityType === 'personal';
    const Icon = isPersonal ? UserIcon : BuildingOffice2Icon;
    const isSelected = entity.id === currentEntity?.id;
    return (
      <Pressable
        key={entity.id}
        {...pressProps(() => handleSelect(entity))}
        className={cn(
          'flex-row items-center gap-2 rounded px-2 py-2.5',
          isSelected ? 'bg-primary/10' : 'active:bg-muted'
        )}
        accessibilityRole='button'
        accessibilityLabel={`Select ${entity.displayName}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Icon
          size={16}
          className={isPersonal ? 'text-primary' : 'text-accent-foreground'}
        />
        <Text
          className={cn(
            'flex-1 text-sm',
            isSelected ? 'text-primary' : 'text-foreground'
          )}
          numberOfLines={1}
        >
          {entity.displayName}
        </Text>
        {isSelected ? <CheckIcon size={16} className='text-primary' /> : null}
      </Pressable>
    );
  };

  return (
    <View className={className} style={style} testID={testID}>
      {/* Trigger Button */}
      <Pressable
        {...pressProps(handleToggle, isLoading)}
        disabled={isLoading}
        className={cn(
          'flex-row items-center gap-2 self-start rounded-lg border border-border bg-background px-3 py-2',
          isLoading ? 'opacity-50' : 'active:bg-muted'
        )}
        accessibilityRole='button'
        accessibilityLabel={
          currentEntity
            ? `Workspace: ${currentEntity.displayName}`
            : 'Select workspace'
        }
        accessibilityState={{ disabled: isLoading, expanded: isOpen }}
      >
        {currentEntity ? (
          <>
            {currentEntity.entityType === 'personal' ? (
              <UserIcon size={16} className='text-primary' />
            ) : (
              <BuildingOffice2Icon
                size={16}
                className='text-accent-foreground'
              />
            )}
            <Text
              className='max-w-[150px] text-sm font-medium text-foreground'
              numberOfLines={1}
            >
              {currentEntity.displayName}
            </Text>
          </>
        ) : (
          <Text className='text-sm text-muted-foreground'>
            Select workspace
          </Text>
        )}
        <ChevronDownIcon size={16} className='text-muted-foreground' />
      </Pressable>

      {/* Menu */}
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
            className='max-h-96 overflow-hidden rounded-lg border border-border bg-popover'
          >
            <ScrollView bounces={false}>
              <View className='p-1'>
                {/* Personal entities */}
                {personalEntities.map(renderItem)}

                {/* Divider */}
                {personalEntities.length > 0 &&
                  organizationEntities.length > 0 && (
                    <View className='my-1 h-px bg-border' />
                  )}

                {/* Organization entities */}
                {organizationEntities.map(renderItem)}

                {/* Create new */}
                {onCreateNew && (
                  <>
                    <View className='my-1 h-px bg-border' />
                    <Pressable
                      {...pressProps(handleCreateNew)}
                      className='flex-row items-center gap-2 rounded px-2 py-2.5 active:bg-muted'
                      accessibilityRole='button'
                    >
                      <PlusIcon size={16} className='text-primary' />
                      <Text className='text-sm text-primary'>
                        Create organization
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            </ScrollView>

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

export default EntitySelector;
