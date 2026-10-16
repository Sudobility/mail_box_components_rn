import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface KanbanCard {
  id: string;
  title: string;
  content?: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

export interface KanbanProps {
  /** Columns data */
  columns: KanbanColumn[];
  /** Card click handler */
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  /** Column header click handler */
  onColumnClick?: (column: KanbanColumn) => void;
  /** Additional className */
  className?: string;
}

/**
 * Kanban Component (React Native)
 *
 * Kanban board with columns and cards.
 * Displays tasks/items organized in vertical columns.
 *
 * @example
 * ```tsx
 * <Kanban
 *   columns={[
 *     { id: 'todo', title: 'To Do', cards: [...] },
 *     { id: 'progress', title: 'In Progress', cards: [...] },
 *     { id: 'done', title: 'Done', cards: [...] }
 *   ]}
 *   onCardClick={(card, col) => openCard(card)}
 * />
 * ```
 */
export const Kanban: React.FC<KanbanProps> = ({
  columns,
  onCardClick,
  onColumnClick,
  className,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('pb-4', className)}
    >
      <View className='flex-row gap-4'>
        {columns.map(column => {
          const header = (
            <View className='flex-row items-center justify-between mb-4'>
              <View className='flex-row items-center gap-2'>
                {column.color && (
                  <View
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: column.color }}
                  />
                )}
                <Text className='font-semibold text-foreground'>
                  {column.title}
                </Text>
              </View>
              <Text className='text-sm text-muted-foreground'>
                {column.cards.length}
              </Text>
            </View>
          );

          return (
            <View
              key={column.id}
              className='w-80 rounded-lg p-4 bg-muted'
            >
              {/* Column header */}
              {onColumnClick ? (
                <Pressable
                  {...pressProps(() => onColumnClick(column))}
                  accessibilityRole='button'
                  accessibilityLabel={`Column ${column.title}`}
                >
                  {header}
                </Pressable>
              ) : (
                header
              )}

              {/* Cards */}
              <View className='gap-3'>
                {column.cards.map(card => {
                  const cardBody = (
                    <>
                      <Text className='font-medium text-sm mb-1 text-foreground'>
                        {card.title}
                      </Text>
                      {card.content &&
                        (typeof card.content === 'string' ||
                        typeof card.content === 'number' ? (
                          <Text className='text-sm text-muted-foreground'>
                            {card.content}
                          </Text>
                        ) : (
                          card.content
                        ))}
                    </>
                  );

                  const cardClassName = cn(
                    'rounded-lg p-3 border',
                    colors.component.card.default.base,
                    colors.component.card.default.dark
                  );

                  return onCardClick ? (
                    <Pressable
                      key={card.id}
                      {...pressProps(() => onCardClick(card, column.id))}
                      accessibilityRole='button'
                      accessibilityLabel={card.title}
                      className={cn(cardClassName, 'active:opacity-80')}
                    >
                      {cardBody}
                    </Pressable>
                  ) : (
                    <View key={card.id} className={cardClassName}>
                      {cardBody}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
