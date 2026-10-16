import React from 'react';
import { View, Text, Image } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  avatar?: string;
  icon?: React.ReactNode;
}

export interface ActivityFeedProps {
  /** Activity items */
  items: ActivityItem[];
  /** Max items to show */
  maxItems?: number;
  /** Show avatars */
  showAvatars?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ActivityFeed Component
 *
 * Activity feed widget for dashboards.
 * Displays recent user actions and events.
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  maxItems = 10,
  showAvatars = true,
  className,
}) => {
  const displayItems = items.slice(0, maxItems);

  return (
    <View
      className={cn(
        'rounded-lg border p-6',
        colors.component.card.default.base,
        colors.component.card.default.dark,
        className
      )}
    >
      <Text className={cn('text-lg font-semibold text-foreground', 'mb-4')}>Recent Activity</Text>

      <View className='gap-4'>
        {displayItems.map(item => (
          <View key={item.id} className='flex-row gap-3'>
            {showAvatars && (
              <View className='flex-shrink-0'>
                {item.avatar ? (
                  <Image
                    source={{ uri: item.avatar }}
                    accessibilityLabel={item.user}
                    className='w-10 h-10 rounded-full'
                  />
                ) : (
                  <View
                    className={cn(
                      'w-10 h-10 rounded-full items-center justify-center',
                      'bg-muted'
                    )}
                  >
                    <Text className='text-muted-foreground font-semibold'>
                      {item.user.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View className='flex-1 min-w-0'>
              <Text className={cn('text-sm', 'text-foreground font-medium')}>
                <Text className='font-semibold'>{item.user}</Text>{' '}
                <Text className={'text-muted-foreground'}>{item.action}</Text>{' '}
                {item.target && (
                  <Text className='font-medium'>{item.target}</Text>
                )}
              </Text>
              <Text className={cn('text-xs mt-1', 'text-muted-foreground')}>
                {item.timestamp}
              </Text>
            </View>

            {item.icon && (
              <View className='flex-shrink-0'>{item.icon}</View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
