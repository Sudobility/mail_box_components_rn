import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface LazyFlatListProps<T> {
  /** List items. */
  items: T[];
  /** Renders a single item. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key per item. */
  keyExtractor: (item: T, index: number) => string;
  /** Number of columns for a grid layout. Default 1. */
  numColumns?: number;
  /** Fixed item height (enables `getItemLayout` for smoother scrolling). */
  itemHeight?: number;
  /** Called when the end of the list is approached — a hook for cursor pagination. */
  onEndReached?: () => void;
  /** 0–1 fraction of the visible length from the end at which `onEndReached` fires. Default 0.5. */
  onEndReachedThreshold?: number;
  /** Whether more data is currently being fetched (shows a footer spinner). */
  loadingMore?: boolean;
  /** Pull-to-refresh handler. */
  onRefresh?: () => void;
  /** Whether a refresh is in progress. */
  refreshing?: boolean;
  /** Rendered when the list is empty. */
  empty?: React.ReactNode;
  /** Rendered above the list. */
  header?: React.ReactNode;
  /** Rendered below the list (in addition to the load-more spinner). */
  footer?: React.ReactNode;
  /** Horizontal list. */
  horizontal?: boolean;
  /** Class for the outer container. */
  className?: string;
  /** Style for the content container. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Overscan used to tune windowing. Default 5. */
  overscan?: number;
}

/**
 * LazyFlatList
 *
 * A thin wrapper over React Native's `FlatList` with lazy-friendly defaults:
 * it windows its content (only on-screen rows are rendered), clips offscreen
 * views, and exposes `onEndReached` for cursor pagination plus pull-to-refresh,
 * empty and footer slots. The web counterpart in `@sudobility/components`
 * provides the same `LazyFlatList` concept for the DOM.
 *
 * @example
 * ```tsx
 * <LazyFlatList
 *   items={images}
 *   numColumns={3}
 *   keyExtractor={(img) => img.id}
 *   renderItem={(img) => <FadeInImage source={{ uri: img.uri }} />}
 *   onEndReached={loadMore}
 * />
 * ```
 */
export function LazyFlatList<T>({
  items,
  renderItem,
  keyExtractor,
  numColumns = 1,
  itemHeight,
  onEndReached,
  onEndReachedThreshold = 0.5,
  loadingMore = false,
  onRefresh,
  refreshing = false,
  empty,
  header,
  footer,
  horizontal = false,
  className,
  contentContainerStyle,
  overscan = 5,
}: LazyFlatListProps<T>) {
  const renderRow = React.useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => <>{renderItem(item, index)}</>,
    [renderItem]
  );

  const getItemLayout = React.useMemo(() => {
    if (!itemHeight || horizontal || numColumns !== 1) return undefined;
    return (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight, horizontal, numColumns]);

  const ListFooter = React.useCallback(() => {
    if (loadingMore) {
      return (
        <View className='items-center justify-center py-4'>
          <ActivityIndicator />
        </View>
      );
    }
    return footer ? <>{footer}</> : null;
  }, [loadingMore, footer]);

  const ListEmpty = React.useCallback(
    () => (empty ? <>{empty}</> : null),
    [empty]
  );

  return (
    <View className={cn('flex-1', className)}>
      <FlatList
        data={items}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        numColumns={numColumns > 1 ? numColumns : undefined}
        horizontal={horizontal}
        onEndReached={onEndReached ? () => onEndReached() : undefined}
        onEndReachedThreshold={onEndReachedThreshold}
        ListHeaderComponent={header ? <>{header}</> : undefined}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        getItemLayout={getItemLayout}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={!horizontal}
        showsHorizontalScrollIndicator={horizontal}
        // Lazy-rendering defaults: render a screenful first, fill in the rest
        // in small batches, and drop views that scroll far offscreen.
        initialNumToRender={overscan * 2}
        maxToRenderPerBatch={overscan * 2}
        windowSize={overscan * 2 + 1}
        removeClippedSubviews
      />
    </View>
  );
}
