import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ViewProps,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { pressProps } from '@sudobility/components-rn';

export interface CarouselProps extends Omit<ViewProps, 'children'> {
  /** Carousel items */
  children: React.ReactNode[];
  /** Auto-play interval (ms) */
  autoPlay?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show indicators */
  showIndicators?: boolean;
  /** Loop slides */
  loop?: boolean;
  /** Additional className */
  className?: string;
  /** Optional tracking callback for navigation actions */
  onTrack?: (action: string) => void;
}

/**
 * Carousel Component (React Native)
 *
 * Image/content carousel with auto-play and navigation. Backed by a horizontal
 * paging ScrollView. Supports arrows, indicators, and looping.
 *
 * @example
 * ```tsx
 * <Carousel autoPlay={3000} loop>
 *   <Image source={{ uri: 'slide1.jpg' }} />
 *   <Image source={{ uri: 'slide2.jpg' }} />
 * </Carousel>
 * ```
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay,
  showArrows = true,
  showIndicators = true,
  loop = true,
  className,
  onTrack,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const scrollToIndex = useCallback(
    (index: number) => {
      if (width > 0) {
        scrollRef.current?.scrollTo({ x: index * width, animated: true });
      }
    },
    [width]
  );

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev === 0 ? (loop ? totalSlides - 1 : prev) : prev - 1;
      scrollToIndex(next);
      return next;
    });
  }, [loop, totalSlides, scrollToIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev === totalSlides - 1 ? (loop ? 0 : prev) : prev + 1;
      scrollToIndex(next);
      return next;
    });
  }, [loop, totalSlides, scrollToIndex]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlay);

    return () => clearInterval(interval);
  }, [autoPlay, totalSlides, goToNext]);

  const goToSlide = (index: number) => {
    onTrack?.('slide_select');
    setCurrentIndex(index);
    scrollToIndex(index);
  };

  const handlePrevious = () => {
    onTrack?.('previous_slide');
    goToPrevious();
  };

  const handleNext = () => {
    onTrack?.('next_slide');
    goToNext();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (width > 0) {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentIndex(index);
    }
  };

  if (totalSlides === 0) {
    return null;
  }

  return (
    <View
      className={cn('relative overflow-hidden rounded-lg', className)}
      onLayout={handleLayout}
      {...props}
    >
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width }}>
            {slide}
          </View>
        ))}
      </ScrollView>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <Pressable
            {...pressProps(handlePrevious, !loop && currentIndex === 0)}
            disabled={!loop && currentIndex === 0}
            accessibilityRole='button'
            accessibilityLabel='Previous slide'
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full bg-background/80',
              'items-center justify-center shadow-lg',
              !loop && currentIndex === 0 && 'opacity-50'
            )}
          >
            <Text className='text-lg text-foreground'>‹</Text>
          </Pressable>

          <Pressable
            {...pressProps(
              handleNext,
              !loop && currentIndex === totalSlides - 1
            )}
            disabled={!loop && currentIndex === totalSlides - 1}
            accessibilityRole='button'
            accessibilityLabel='Next slide'
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full bg-background/80',
              'items-center justify-center shadow-lg',
              !loop && currentIndex === totalSlides - 1 && 'opacity-50'
            )}
          >
            <Text className='text-lg text-foreground'>›</Text>
          </Pressable>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <View className='absolute bottom-4 left-0 right-0 flex-row justify-center gap-2'>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              {...pressProps(() => goToSlide(index))}
              accessibilityRole='button'
              accessibilityLabel={`Go to slide ${index + 1}`}
              accessibilityState={{ selected: index === currentIndex }}
              className={cn(
                'h-2 rounded-full',
                index === currentIndex
                  ? 'w-8 bg-foreground'
                  : 'w-2 bg-foreground/50'
              )}
            />
          ))}
        </View>
      )}
    </View>
  );
};
