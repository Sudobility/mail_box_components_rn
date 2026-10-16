import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface EmojiReaction {
  emoji: string;
  count: number;
  users?: string[];
  reacted?: boolean;
}

/** Tracking data for Reaction actions */
export interface ReactionTrackingData {
  action: 'react' | 'toggle_picker';
  trackingLabel?: string;
  componentName?: string;
}

export interface ReactionProps {
  /** Available reactions */
  reactions: EmojiReaction[];
  /** Reaction click handler */
  onReact?: (emoji: string) => void;
  /** Show picker */
  showPicker?: boolean;
  /** Available emojis for picker */
  availableEmojis?: string[];
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: ReactionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Reaction Component
 *
 * Emoji reaction picker and display.
 * Shows reaction counts and allows users to add reactions.
 *
 * @example
 * ```tsx
 * <Reaction
 *   reactions={[
 *     { emoji: '👍', count: 5, reacted: true },
 *     { emoji: '❤️', count: 3 },
 *     { emoji: '😊', count: 2 }
 *   ]}
 *   availableEmojis={['👍', '❤️', '😊', '🎉', '🔥', '👏']}
 *   onReact={(emoji) => handleReaction(emoji)}
 *   showPicker
 * />
 * ```
 */
export const Reaction: React.FC<ReactionProps> = ({
  reactions,
  onReact,
  showPicker = true,
  availableEmojis = ['👍', '❤️', '😊', '🎉', '🔥', '👏', '👀', '🚀'],
  className,
  onTrack,
  trackingLabel,
  componentName = 'Reaction',
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleReactionClick = (emoji: string) => {
    onTrack?.({ action: 'react', trackingLabel, componentName });
    if (onReact) {
      onReact(emoji);
    }
  };

  const handleTogglePicker = () => {
    onTrack?.({ action: 'toggle_picker', trackingLabel, componentName });
    setIsPickerOpen(!isPickerOpen);
  };

  return (
    <View className={cn('relative flex-row flex-wrap items-center gap-2', className)}>
      {/* Existing reactions */}
      {reactions.map(reaction => (
        <Pressable
          key={reaction.emoji}
          {...pressProps(() => handleReactionClick(reaction.emoji))}
          accessibilityRole='button'
          accessibilityLabel={`React with ${reaction.emoji}`}
          className={cn(
            'flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border-2',
            reaction.reacted
              ? cn(
                  colors.component.badge.primary.base,
                  colors.component.badge.primary.dark,
                  'border-primary'
                )
              : cn(
                  colors.component.button.secondary.base,
                  colors.component.button.secondary.dark,
                  'border-transparent'
                )
          )}
        >
          <Text className='text-lg leading-none'>{reaction.emoji}</Text>
          <Text
            className={cn(
              'text-sm font-medium',
              reaction.reacted ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {reaction.count}
          </Text>
        </Pressable>
      ))}

      {/* Add reaction button */}
      {showPicker && (
        <View className='relative'>
          <Pressable
            {...pressProps(handleTogglePicker)}
            accessibilityRole='button'
            accessibilityLabel='Add reaction'
            className={cn(
              'items-center justify-center w-8 h-8 rounded-full',
              colors.component.button.ghost.base,
              colors.component.button.ghost.dark
            )}
          >
            {/* TODO: web used an inline plus SVG; substituting a glyph to avoid a new dep. */}
            <Text className='text-lg leading-none text-muted-foreground'>+</Text>
          </Pressable>

          {/* Emoji picker */}
          {isPickerOpen && (
            <>
              {/* Backdrop */}
              <Pressable
                {...pressProps(() => setIsPickerOpen(false))}
                accessibilityLabel='Close reaction picker'
                className='absolute inset-0'
                style={{ zIndex: 10 }}
              />

              {/* Picker */}
              <View
                className={cn(
                  'absolute right-0 border p-2 bg-card border-border rounded-lg shadow-lg'
                )}
                style={{ bottom: '100%', marginBottom: 8, zIndex: 20 }}
              >
                <View className='flex-row flex-wrap w-44'>
                  {availableEmojis.map(emoji => (
                    <Pressable
                      key={emoji}
                      {...pressProps(() => {
                        handleReactionClick(emoji);
                        setIsPickerOpen(false);
                      })}
                      accessibilityRole='button'
                      accessibilityLabel={`React with ${emoji}`}
                      className={cn(
                        'w-10 h-10 items-center justify-center rounded',
                        colors.component.button.ghost.base,
                        colors.component.button.ghost.dark
                      )}
                    >
                      <Text className='text-2xl'>{emoji}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};
