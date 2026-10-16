import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface TypingIndicatorProps {
  /** Show indicator */
  show?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * TypingIndicator Component
 *
 * Animated typing indicator for chat interfaces.
 * Shows three bouncing dots to indicate someone is typing.
 *
 * @example
 * ```tsx
 * <TypingIndicator show={isTyping} size="md" />
 * ```
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  show = true,
  size = 'md',
  className,
}) => {
  // One Animated.Value per dot; the web used a CSS `typing-bounce` keyframe
  // with staggered `animationDelay`, reproduced here with the Animated API.
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (!show) return;

    const animations = dots.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(value, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 420,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((2 - i) * 200),
        ])
      )
    );

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
      dots.forEach(value => value.setValue(0));
    };
  }, [show, dots]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const containerSizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-2.5',
    lg: 'px-5 py-3',
  };

  return (
    <View
      accessibilityLabel='Typing'
      className={cn(
        'self-start flex-row items-center gap-1 rounded-2xl bg-muted',
        containerSizes[size],
        className
      )}
    >
      {dots.map((value, i) => (
        <Animated.View
          key={i}
          className={cn('rounded-full bg-muted-foreground', sizeClasses[size])}
          style={{
            transform: [
              {
                translateY: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};
