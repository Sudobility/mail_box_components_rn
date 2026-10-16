import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from './utils';
import { pressProps } from './a11y';

export interface RatingProps {
  /** Rating value */
  value: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Maximum rating */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Allow half ratings */
  allowHalf?: boolean;
  /** Allow clearing rating by clicking same star */
  allowClear?: boolean;
  /** Custom icon (ReactNode or icon type) */
  icon?: React.ReactNode | 'star' | 'heart' | 'thumbs';
  /** Empty icon color (color name like 'gray' or Tailwind class) */
  emptyColor?: string;
  /** Filled icon color (color name like 'yellow' or Tailwind class) */
  filledColor?: string;
  /** Show count label */
  showCount?: boolean;
  /** Count value to display */
  count?: number;
  /** Additional className */
  className?: string;
}

// RN substitute for the web's inline SVG icon set: a monochrome text glyph per
// icon type. The star/heart glyphs follow the text color; the thumbs glyph
// falls back to an emoji, which ignores color — acceptable until a vector icon
// set is pulled in. Custom ReactNode icons are rendered verbatim.
const glyphs: Record<'star' | 'heart' | 'thumbs', string> = {
  star: '★',
  heart: '♥',
  thumbs: '👍',
};

const sizeConfig = {
  sm: { glyph: 16, text: 'text-sm', gap: 'gap-0.5' },
  md: { glyph: 24, text: 'text-base', gap: 'gap-1' },
  lg: { glyph: 32, text: 'text-lg', gap: 'gap-1.5' },
};

/**
 * Rating Component
 *
 * Star rating with customizable icons and precision.
 * Supports full and half ratings.
 *
 * RN notes: the web version uses mouse hover to preview a value and arrow-key
 * navigation on the container; neither maps to touch, so both are dropped (the
 * displayed value tracks `value` directly). Inline SVG icons become text
 * glyphs — see `glyphs` above.
 *
 * @example
 * ```tsx
 * <Rating value={4.5} onChange={setRating} allowHalf />
 * ```
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  disabled = false,
  allowHalf = false,
  allowClear = true,
  icon = 'star',
  emptyColor,
  filledColor,
  showCount = false,
  count,
  className,
}) => {
  // Hover-preview has no touch equivalent, so the preview value stays null and
  // the display tracks `value`; the slot is kept for a future gesture.
  const [hoverValue] = useState<number | null>(null);

  const isInteractive = !readOnly && !disabled && !!onChange;

  // Convert color names to Tailwind classes
  const getColorClass = (color: string | undefined, defaultClass: string) => {
    if (!color) return defaultClass;
    if (color.includes('text-')) return color;
    return `text-${color}-400`;
  };

  const handlePress = (index: number, isHalf: boolean) => {
    if (!isInteractive || !onChange) return;
    const newValue = index + (isHalf && allowHalf ? 0.5 : 1);

    // Allow clearing rating by clicking the same star
    if (allowClear && newValue === value) {
      onChange(0);
    } else {
      onChange(newValue);
    }
  };

  const config = sizeConfig[size];
  const starSize = config.glyph;

  const emptyColorClass = getColorClass(emptyColor, 'text-muted-foreground');
  const filledColorClass = getColorClass(filledColor, 'text-warning');

  const displayValue = hoverValue !== null ? hoverValue : value;

  const customIcon = typeof icon !== 'string' ? icon : null;
  const iconType = (typeof icon === 'string' ? icon : 'star') as
    | 'star'
    | 'heart'
    | 'thumbs';

  const renderGlyph = (colorClass: string) => {
    if (customIcon) {
      return (
        <View
          className={colorClass}
          style={{ width: starSize, height: starSize }}
        >
          {customIcon}
        </View>
      );
    }
    return (
      <Text
        className={colorClass}
        style={{ fontSize: starSize, lineHeight: starSize * 1.2 }}
      >
        {glyphs[iconType]}
      </Text>
    );
  };

  const renderIcon = (index: number) => {
    const isFilled = index < Math.floor(displayValue);
    const isHalf =
      index === Math.floor(displayValue) && displayValue % 1 !== 0;

    const starContent = (
      <View className='relative' style={{ width: starSize, height: starSize }}>
        {/* Full/empty icon */}
        {renderGlyph(isFilled ? filledColorClass : emptyColorClass)}

        {/* Half icon overlay */}
        {isHalf && allowHalf && (
          <View
            className='absolute inset-0'
            style={{ overflow: 'hidden', width: starSize / 2 }}
          >
            {renderGlyph(filledColorClass)}
          </View>
        )}
      </View>
    );

    if (!isInteractive) {
      return <View key={index}>{starContent}</View>;
    }

    if (allowHalf) {
      return (
        <View key={index} className='relative'>
          {starContent}
          {/* Split press targets for half / full selection */}
          <View className='absolute inset-0 flex-row'>
            <Pressable
              {...pressProps(() => handlePress(index, true))}
              className='h-full'
              style={{ width: starSize / 2 }}
              accessibilityRole='button'
              accessibilityLabel={`Rate ${index + 0.5} out of ${max}`}
            />
            <Pressable
              {...pressProps(() => handlePress(index, false))}
              className='h-full'
              style={{ width: starSize / 2 }}
              accessibilityRole='button'
              accessibilityLabel={`Rate ${index + 1} out of ${max}`}
            />
          </View>
        </View>
      );
    }

    return (
      <Pressable
        key={index}
        {...pressProps(() => handlePress(index, false), disabled)}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={`Rate ${index + 1} out of ${max}`}
        accessibilityState={{ disabled }}
        style={({ pressed }) => ({
          opacity: pressed && !disabled ? 0.7 : 1,
          transform: [{ scale: pressed && !disabled ? 1.1 : 1 }],
        })}
      >
        {starContent}
      </Pressable>
    );
  };

  return (
    <View
      className={cn(
        'flex-row items-center gap-2',
        disabled && 'opacity-50',
        className
      )}
      accessibilityRole='adjustable'
      accessibilityValue={{ min: 0, max, now: value }}
      accessibilityState={{ disabled }}
    >
      <View className={cn('flex-row items-center', config.gap)}>
        {Array.from({ length: max }, (_, i) => renderIcon(i))}
      </View>
      {showCount && count !== undefined && (
        <Text className={cn('text-muted-foreground', config.text)}>
          ({count})
        </Text>
      )}
    </View>
  );
};
