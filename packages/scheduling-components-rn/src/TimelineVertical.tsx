import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface TimelineVerticalProps {
  /** Timeline events */
  events: TimelineEvent[];
  /** Align timeline */
  align?: 'left' | 'center' | 'right';
  /** Show connectors */
  showConnectors?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TimelineVertical Component (React Native)
 *
 * Vertical timeline for displaying chronological events.
 * Shows events with connecting lines and optional icons.
 *
 * @example
 * ```tsx
 * <TimelineVertical
 *   events={[
 *     { id: '1', title: 'Order placed', timestamp: '2 hours ago' },
 *     { id: '2', title: 'Processing', timestamp: '1 hour ago' },
 *     { id: '3', title: 'Shipped', timestamp: '30 min ago' }
 *   ]}
 *   align="left"
 * />
 * ```
 */
export const TimelineVertical: React.FC<TimelineVerticalProps> = ({
  events,
  align = 'left',
  showConnectors = true,
  className,
}) => {
  return (
    <View className={cn('relative', className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const color = event.color || colors.raw.blue[500];

        return (
          <View
            key={event.id}
            className={cn(
              'relative flex-row gap-4 pb-8',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end'
            )}
          >
            {/* Connector line */}
            {showConnectors && !isLast && (
              <View
                className='absolute left-4 top-8 w-0.5 h-full bg-muted'
                style={
                  align === 'center'
                    ? { left: '50%' }
                    : align === 'right'
                      ? { right: 32 }
                      : undefined
                }
              />
            )}

            {/* Icon/Dot */}
            <View className='relative z-10'>
              {event.icon ? (
                <View
                  // intentional: white icon for contrast on dynamic per-event color
                  className='w-8 h-8 rounded-full items-center justify-center'
                  style={{ backgroundColor: color }}
                >
                  {event.icon}
                </View>
              ) : (
                <View
                  className='w-4 h-4 rounded-full border-4 border-background'
                  style={{ backgroundColor: color }}
                />
              )}
            </View>

            {/* Content */}
            <View className='flex-1 min-w-0'>
              <View className='flex-row items-center gap-3 mb-1'>
                <Text className={textVariants.heading.h6()}>{event.title}</Text>
                {event.timestamp && (
                  <Text className='text-xs text-muted-foreground'>
                    {event.timestamp}
                  </Text>
                )}
              </View>
              {event.description && (
                <Text className='text-sm text-muted-foreground'>
                  {event.description}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};
