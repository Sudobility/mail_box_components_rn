import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getStatusIndicatorColor } from '@sudobility/design';

export interface TimelineItem {
  /** Item ID */
  id: string;
  /** Item title */
  title: React.ReactNode;
  /** Item description */
  description?: React.ReactNode;
  /** Item timestamp */
  timestamp?: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Item status */
  status?: 'completed' | 'active' | 'pending' | 'error';
}

export interface TimelineProps {
  /** Timeline items */
  items: TimelineItem[];
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Additional className */
  className?: string;
}

/**
 * Timeline Component (React Native)
 *
 * Chronological timeline for events and activities.
 * Supports vertical and horizontal orientations.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { id: '1', title: 'Project Started', timestamp: '2024-01-01', status: 'completed' },
 *     { id: '2', title: 'In Progress', description: 'Working on features', status: 'active' },
 *     { id: '3', title: 'Pending Review', status: 'pending' }
 *   ]}
 * />
 * ```
 */
export const Timeline: React.FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
  className,
}) => {
  // Status color configurations using design system
  const statusColors = {
    completed: `${getStatusIndicatorColor('success')} border-success`,
    active: `${getStatusIndicatorColor('info')} border-primary`,
    pending: 'bg-muted border-border',
    error: `${getStatusIndicatorColor('error')} border-destructive`,
  };

  const renderNode = (
    node: React.ReactNode,
    textClassName: string
  ): React.ReactNode =>
    typeof node === 'string' || typeof node === 'number' ? (
      <Text className={textClassName}>{node}</Text>
    ) : (
      node
    );

  if (orientation === 'horizontal') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={cn('w-full', className)}
      >
        <View className='flex-row items-start px-4'>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const status = item.status || 'pending';

            return (
              <React.Fragment key={item.id}>
                {/* Item */}
                <View className='items-center'>
                  {/* Icon/Dot */}
                  <View
                    className={cn(
                      'w-10 h-10 rounded-full items-center justify-center border-2',
                      statusColors[status]
                    )}
                  >
                    {item.icon ? (
                      <View className='w-5 h-5'>{item.icon}</View>
                    ) : status === 'completed' ? (
                      // TODO: substitute for inline SVG checkmark
                      <Text className='text-success-foreground'>✓</Text>
                    ) : null}
                  </View>

                  {/* Content */}
                  <View className='mt-4 items-center max-w-[200px]'>
                    {renderNode(item.title, 'text-sm text-foreground font-medium')}
                    {item.description &&
                      renderNode(
                        item.description,
                        'text-xs mt-1 text-muted-foreground'
                      )}
                    {item.timestamp && (
                      <Text className='text-xs mt-1 text-muted-foreground'>
                        {item.timestamp}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Connector Line */}
                {!isLast && (
                  <View className='w-16 h-0.5 mt-5 mx-2'>
                    <View
                      className={cn(
                        'h-full',
                        status === 'completed'
                          ? 'w-full bg-success'
                          : 'w-full bg-muted'
                      )}
                    />
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // Vertical orientation
  return (
    <View className={cn('w-full gap-4', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const status = item.status || 'pending';

        return (
          <View key={item.id} className='flex-row gap-4'>
            {/* Icon/Dot column */}
            <View className='items-center'>
              <View
                className={cn(
                  'w-10 h-10 rounded-full items-center justify-center border-2',
                  statusColors[status]
                )}
              >
                {item.icon ? (
                  <View className='w-5 h-5'>{item.icon}</View>
                ) : status === 'completed' ? (
                  // TODO: substitute for inline SVG checkmark
                  <Text className='text-success-foreground'>✓</Text>
                ) : null}
              </View>

              {/* Connector Line */}
              {!isLast && (
                <View className='w-0.5 flex-1 min-h-[32px] mt-2'>
                  <View
                    className={cn(
                      'w-full',
                      status === 'completed' ? 'h-full bg-success' : 'h-full bg-muted'
                    )}
                  />
                </View>
              )}
            </View>

            {/* Content column */}
            <View className='flex-1 pb-4'>
              <View className='flex-row items-start justify-between'>
                <View className='flex-1'>
                  {renderNode(item.title, 'text-sm text-foreground font-medium')}
                  {item.description &&
                    renderNode(
                      item.description,
                      'text-sm mt-1 text-muted-foreground'
                    )}
                </View>
                {item.timestamp && (
                  <Text className='text-xs ml-4 text-muted-foreground'>
                    {item.timestamp}
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
