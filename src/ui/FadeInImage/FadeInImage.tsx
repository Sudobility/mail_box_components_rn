import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageProps,
  ImageSourcePropType,
  View,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface FadeInImageProps extends Omit<
  ImageProps,
  'source' | 'onLoad'
> {
  /**
   * Image source. May be `null`/`undefined` while a URL is still being
   * prepared (e.g. an authenticated fetch) — the skeleton shows until a source
   * is set and the image reports loaded.
   */
  source?: ImageSourcePropType | null;
  /** Fade duration in milliseconds. Default 400. */
  durationMs?: number;
  /** Show a pulsing skeleton behind the image until it has loaded. Default true. */
  showSkeleton?: boolean;
  /** Class for the positioning wrapper (defaults to filling its parent). */
  wrapperClassName?: string;
  /** Class for the skeleton placeholder. */
  skeletonClassName?: string;
  /** Class for the image element. */
  className?: string;
  /** Called once the image has loaded and the fade has been triggered. */
  onLoaded?: () => void;
}

/**
 * FadeInImage
 *
 * An image that fades in once it has loaded, with an optional pulsing skeleton
 * underneath while it loads. Built for images whose source resolves
 * asynchronously (authenticated fetches, lazily mounted tiles) so the swap
 * from "loading" to "loaded" is smooth rather than a hard pop.
 *
 * @example
 * ```tsx
 * <FadeInImage source={{ uri }} className="h-full w-full" resizeMode="cover" />
 * ```
 */
export const FadeInImage: React.FC<FadeInImageProps> = ({
  source,
  durationMs = 400,
  showSkeleton = true,
  wrapperClassName,
  skeletonClassName,
  className,
  onLoaded,
  ...imageProps
}) => {
  const [loaded, setLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.5)).current;

  // Reset the fade whenever the source changes.
  const sourceKey = JSON.stringify(source ?? null);
  useEffect(() => {
    setLoaded(false);
    opacity.setValue(0);
  }, [sourceKey, opacity]);

  // Pulse the skeleton while the image is loading.
  useEffect(() => {
    if (loaded || !showSkeleton) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [loaded, showSkeleton, pulse]);

  const handleLoad = () => {
    setLoaded(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: true,
    }).start();
    onLoaded?.();
  };

  return (
    <View
      className={cn('relative h-full w-full overflow-hidden', wrapperClassName)}
    >
      {showSkeleton && !loaded && (
        <Animated.View
          pointerEvents='none'
          style={{ opacity: pulse }}
          className={cn('absolute inset-0 bg-muted', skeletonClassName)}
        />
      )}
      {source != null && (
        <Animated.View style={{ opacity }} className='h-full w-full'>
          <Image
            source={source}
            onLoad={handleLoad}
            className={cn('h-full w-full', className)}
            {...imageProps}
          />
        </Animated.View>
      )}
    </View>
  );
};
