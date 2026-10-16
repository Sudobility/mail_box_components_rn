import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ProcessStep {
  step: number | string;
  title: string;
  description: string;
  details?: string[];
  icon?: React.ReactNode;
}

export interface ProcessStepsProps {
  title?: string;
  description?: string;
  steps: ProcessStep[];
  orientation?: 'horizontal' | 'vertical';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title,
  description,
  steps,
  orientation = 'vertical',
  color = 'blue',
  className,
}) => {
  const containerClass = 'max-w-7xl mx-auto px-4';

  const colorClasses = {
    blue: {
      bg: 'bg-primary',
      text: 'text-primary',
      border: 'border-primary/20',
    },
    green: {
      bg: 'bg-success',
      text: 'text-success',
      border: 'border-success/20',
    },
    purple: {
      bg: 'bg-accent',
      text: 'text-accent-foreground',
      border: 'border-accent',
    },
    orange: {
      bg: 'bg-warning',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    pink: {
      bg: 'bg-secondary',
      text: 'text-secondary-foreground',
      border: 'border-secondary',
    },
    gray: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
    },
  };

  const colors = colorClasses[color];

  return (
    <View className={cn('py-16', className)}>
      <View className={containerClass}>
        {(title || description) && (
          <View className='items-center mb-12'>
            {title && (
              <Text className={cn('text-3xl font-bold text-foreground', 'mb-4')}>{title}</Text>
            )}
            {description && (
              <Text className={cn('text-lg text-muted-foreground', 'max-w-3xl mx-auto')}>
                {description}
              </Text>
            )}
          </View>
        )}

        <View
          className={cn(
            orientation === 'horizontal'
              ? 'flex-col lg:flex-row justify-center items-center lg:items-start gap-8'
              : 'gap-8 max-w-4xl mx-auto'
          )}
        >
          {steps.map((step, index) => (
            <View
              key={index}
              className={cn(
                'relative',
                orientation === 'horizontal'
                  ? 'flex-1 items-center lg:items-start'
                  : 'flex-row items-start'
              )}
            >
              {/* Step Number/Icon */}
              <View
                // intentional: text-white is contrast for categorical step colors (colors.bg)
                className={cn(
                  'flex-shrink-0 items-center justify-center rounded-full',
                  colors.bg,
                  orientation === 'horizontal'
                    ? 'w-12 h-12 mb-4'
                    : 'w-10 h-10 mr-4 mt-1'
                )}
              >
                {step.icon ? (
                  step.icon
                ) : (
                  <Text className='text-white font-bold'>{step.step}</Text>
                )}
              </View>

              {/* Connection Line */}
              {index < steps.length - 1 && orientation === 'vertical' && (
                <View
                  className={cn(
                    'absolute left-5 top-12 w-px h-8 -ml-px',
                    colors.bg
                  )}
                />
              )}

              {/* Content */}
              <View
                className={cn(
                  orientation === 'horizontal' ? 'flex-1' : 'flex-1 min-w-0'
                )}
              >
                <Text className={cn('text-xl font-semibold text-foreground', 'mb-2')}>{step.title}</Text>
                <Text className={cn('text-base text-foreground', 'mb-3')}>
                  {step.description}
                </Text>

                {step.details && step.details.length > 0 && (
                  <View className='gap-1'>
                    {step.details.map((detail, detailIndex) => (
                      <View
                        key={detailIndex}
                        className='flex-row items-start'
                      >
                        <View
                          className={cn(
                            'w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0',
                            colors.bg
                          )}
                        />
                        <Text className={'text-sm text-muted-foreground'}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
