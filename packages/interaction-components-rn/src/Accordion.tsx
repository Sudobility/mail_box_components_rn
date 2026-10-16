import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';

export interface AccordionItem {
  /** Unique identifier */
  id: string;
  /** Title/trigger content */
  title: React.ReactNode;
  /** Content to show when expanded */
  content: React.ReactNode;
  /** Disabled state for this item */
  disabled?: boolean;
}

/** Tracking data for Accordion actions */
export interface AccordionTrackingData {
  action: 'toggle';
  trackingLabel?: string;
  componentName?: string;
}

export interface AccordionProps {
  /** Array of accordion items */
  items: AccordionItem[];
  /** Allow multiple items open at once */
  allowMultiple?: boolean;
  /** Default open item ID (single) */
  defaultOpenId?: string;
  /** Default open item IDs (multiple) */
  defaultOpenIds?: string[];
  /** Controlled open IDs */
  openIds?: string[];
  /** Callback when open state changes */
  onOpenChange?: (openIds: string[]) => void;
  /** Variant style */
  variant?: 'default' | 'bordered' | 'separated';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (data: AccordionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Accordion Component (React Native)
 *
 * Manages multiple collapsible sections with single or multi-expand support.
 * Provides consistent styling and state management for FAQ lists and similar UIs.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: '1', title: 'What is Web3 Email?', content: 'Description...' },
 *     { id: '2', title: 'How does it work?', content: 'Explanation...' },
 *   ]}
 * />
 * ```
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
  defaultOpenIds = [],
  openIds: controlledOpenIds,
  onOpenChange,
  variant = 'default',
  size = 'md',
  className,
  onTrack,
  trackingLabel,
  componentName = 'Accordion',
}) => {
  const initialOpenIds = defaultOpenId ? [defaultOpenId] : defaultOpenIds;
  const [internalOpenIds, setInternalOpenIds] =
    useState<string[]>(initialOpenIds);

  // Use controlled value if provided, otherwise use internal state
  const openIds =
    controlledOpenIds !== undefined ? controlledOpenIds : internalOpenIds;
  const isControlled = controlledOpenIds !== undefined;

  // Size configurations
  const sizeClasses = {
    sm: { trigger: 'py-2', text: 'text-sm', content: 'py-2 text-sm' },
    md: { trigger: 'py-3', text: 'text-base', content: 'py-3 text-base' },
    lg: { trigger: 'py-4', text: 'text-lg', content: 'py-4 text-lg' },
  };

  const sizeConfig = sizeClasses[size];

  // Variant configurations
  const getItemClasses = (index: number) => {
    switch (variant) {
      case 'bordered':
        return cn('border border-border rounded-lg mb-2 px-4');
      case 'separated':
        return cn(
          'border-b border-border pb-2',
          index < items.length - 1 && 'mb-2'
        );
      case 'default':
      default:
        return cn(
          'border-b border-border',
          index === items.length - 1 && 'border-b-0'
        );
    }
  };

  const handleToggle = (itemId: string) => {
    onTrack?.({ action: 'toggle', trackingLabel, componentName });

    let newOpenIds: string[];

    if (allowMultiple) {
      // Toggle the item in the array
      newOpenIds = openIds.includes(itemId)
        ? openIds.filter(id => id !== itemId)
        : [...openIds, itemId];
    } else {
      // Only allow one item open at a time
      newOpenIds = openIds.includes(itemId) ? [] : [itemId];
    }

    if (!isControlled) {
      setInternalOpenIds(newOpenIds);
    }

    onOpenChange?.(newOpenIds);
  };

  return (
    <View className={cn('w-full', className)}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);

        return (
          <View key={item.id} className={getItemClasses(index)}>
            {/* Title/Trigger */}
            <Pressable
              {...pressProps(
                item.disabled ? undefined : () => handleToggle(item.id),
                item.disabled
              )}
              disabled={item.disabled}
              accessibilityRole='button'
              accessibilityState={{ expanded: isOpen, disabled: item.disabled }}
              className={cn(
                'flex-row items-center justify-between w-full',
                item.disabled && 'opacity-50',
                sizeConfig.trigger
              )}
            >
              <View className='flex-1'>
                {typeof item.title === 'string' ||
                typeof item.title === 'number' ? (
                  <Text
                    className={cn(
                      'text-foreground font-medium',
                      sizeConfig.text
                    )}
                  >
                    {item.title}
                  </Text>
                ) : (
                  item.title
                )}
              </View>
              {/* TODO: substitute for heroicons ChevronDownIcon — glyph swaps
                  instead of rotating, matching the RN kit's chevron pattern */}
              <Text
                className={cn(
                  'text-muted-foreground ml-2',
                  sizeConfig.text
                )}
              >
                {isOpen ? '▲' : '▼'}
              </Text>
            </Pressable>

            {/* Content */}
            {isOpen && (
              <View className={cn('pb-2', sizeConfig.trigger)}>
                {typeof item.content === 'string' ||
                typeof item.content === 'number' ? (
                  <Text
                    className={cn('text-muted-foreground', sizeConfig.text)}
                  >
                    {item.content}
                  </Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
