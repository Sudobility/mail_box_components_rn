import React, { useState, useEffect } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface CountdownTimerProps extends ViewProps {
  /** Target date/time */
  targetDate: Date;
  /** Completion callback */
  onComplete?: () => void;
  /** Show labels */
  showLabels?: boolean;
  /** Show days */
  showDays?: boolean;
  /** Show hours */
  showHours?: boolean;
  /** Show minutes */
  showMinutes?: boolean;
  /** Show seconds */
  showSeconds?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * CountdownTimer Component
 *
 * Countdown timer displaying days, hours, minutes, and seconds.
 * Auto-updates every second until target date is reached.
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  showLabels = true,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  compact = false,
  className,
  ...props
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  // Render time unit
  const renderTimeUnit = (value: number, label: string, show: boolean) => {
    if (!show) return null;

    if (compact) {
      return (
        <View className='flex-row items-baseline'>
          <Text className={cn('text-2xl font-bold tabular-nums', 'text-foreground font-semibold')}>
            {value.toString().padStart(2, '0')}
          </Text>
          {showLabels && (
            <Text className={cn('text-xs ml-0.5', 'text-muted-foreground')}>
              {label[0].toLowerCase()}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View className='flex-col items-center'>
        <View
          className={cn(
            'min-w-[60px] px-4 py-3 rounded-lg',
            // TODO: web used GRADIENTS.buttons.primaryBlue; RN has no CSS
            // gradient without expo-linear-gradient, so a solid primary fill is
            // substituted to avoid adding a dependency.
            colors.component.button.primary.base,
            colors.component.button.primary.dark,
            'shadow-lg'
          )}
        >
          <Text className='text-3xl font-bold text-white tabular-nums'>
            {value.toString().padStart(2, '0')}
          </Text>
        </View>
        {showLabels && (
          <Text className={cn('text-xs font-medium mt-2', 'uppercase text-muted-foreground')}>
            {label}
          </Text>
        )}
      </View>
    );
  };

  if (timeLeft.isExpired) {
    return (
      <View className={cn('items-center', className)} {...props}>
        <Text className={cn('text-2xl font-bold', 'text-foreground font-semibold')}>
          Time&apos;s Up!
        </Text>
        <Text className={cn('text-sm mt-2', 'text-muted-foreground')}>
          The countdown has ended
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('w-full', className)} {...props}>
      <View
        className={cn(
          'flex-row items-center justify-center',
          compact ? 'gap-2' : 'gap-4'
        )}
      >
        {renderTimeUnit(timeLeft.days, 'Days', showDays)}
        {!compact && showDays && showHours && (
          <Text className={cn('text-3xl font-bold', 'text-muted-foreground')}>:</Text>
        )}
        {renderTimeUnit(timeLeft.hours, 'Hours', showHours)}
        {!compact && showHours && showMinutes && (
          <Text className={cn('text-3xl font-bold', 'text-muted-foreground')}>:</Text>
        )}
        {renderTimeUnit(timeLeft.minutes, 'Minutes', showMinutes)}
        {!compact && showMinutes && showSeconds && (
          <Text className={cn('text-3xl font-bold', 'text-muted-foreground')}>:</Text>
        )}
        {renderTimeUnit(timeLeft.seconds, 'Seconds', showSeconds)}
      </View>
    </View>
  );
};
