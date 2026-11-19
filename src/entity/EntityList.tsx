import React from 'react';
import { View, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { EntityWithRole } from '@sudobility/types';
import { cn } from '../index';
import { EntityCard, type EntityCardTrackingData } from './EntityCard';

/** Tracking data for EntityList actions */
export interface EntityListTrackingData {
  action: 'select';
  trackingLabel?: string;
  componentName?: string;
}

export interface EntityListProps {
  /** Entities to display */
  entities: EntityWithRole[];
  /** Currently selected entity slug */
  selectedSlug?: string | null;
  /** Selection handler */
  onSelect?: (entity: EntityWithRole) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: EntityListTrackingData | EntityCardTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * EntityList - A column of EntityCards.
 *
 * RN counterpart of the web's `EntityList`. It is a plain column, not a
 * scroller: the host page scrolls, as on the web.
 */
export const EntityList: React.FC<EntityListProps> = ({
  entities,
  selectedSlug,
  onSelect,
  isLoading = false,
  emptyMessage = 'No workspaces found',
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'EntityList',
}) => {
  if (isLoading) {
    return (
      <View
        className={cn('gap-3', className)}
        style={style}
        testID={testID}
        accessible
        accessibilityRole='progressbar'
        accessibilityLabel='Loading workspaces'
      >
        {[1, 2, 3].map(i => (
          <View
            key={i}
            className='h-24 rounded-lg border border-border bg-muted'
          />
        ))}
      </View>
    );
  }

  if (entities.length === 0) {
    return (
      <View className={cn('py-8', className)} style={style} testID={testID}>
        <Text className='text-center text-base text-muted-foreground'>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  const handleSelect = (entity: EntityWithRole) => {
    onTrack?.({ action: 'select', trackingLabel, componentName });
    onSelect?.(entity);
  };

  return (
    <View className={cn('gap-3', className)} style={style} testID={testID}>
      {entities.map(entity => (
        <EntityCard
          key={entity.id}
          entity={entity}
          isSelected={entity.entitySlug === selectedSlug}
          onPress={onSelect ? () => handleSelect(entity) : undefined}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      ))}
    </View>
  );
};

export default EntityList;
