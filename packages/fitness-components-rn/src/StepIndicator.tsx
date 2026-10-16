import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { pressProps } from '@sudobility/components-rn';

export interface Step {
  /** Step label */
  label: string;
  /** Optional description */
  description?: string;
  /** Step status */
  status?: 'pending' | 'current' | 'completed';
}

/** Tracking data for StepIndicator actions */
export interface StepIndicatorTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface StepIndicatorProps {
  /** Array of steps */
  steps: Step[];
  /** Current active step index (0-based) */
  currentStep?: number;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'success' | 'purple';
  /** Show connector lines */
  showConnectors?: boolean;
  /** Additional className */
  className?: string;
  /** Click handler for steps */
  onStepClick?: (index: number) => void;
  /** Optional tracking callback */
  onTrack?: (data: StepIndicatorTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * StepIndicator Component
 *
 * Visual indicator for multi-step processes or workflows.
 * Shows numbered steps with optional labels, descriptions, and connecting lines.
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'primary',
  showConnectors = true,
  className,
  onStepClick,
  onTrack,
  trackingLabel,
  componentName = 'StepIndicator',
}) => {
  const handleStepClick = (index: number) => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onStepClick?.(index);
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      circle: 'w-6 h-6 text-xs',
      label: 'text-xs',
      description: 'text-xs',
      connector: orientation === 'vertical' ? 'h-6' : 'h-0.5',
    },
    md: {
      circle: 'w-8 h-8 text-sm',
      label: 'text-sm',
      description: 'text-xs',
      connector: orientation === 'vertical' ? 'h-8' : 'h-0.5',
    },
    lg: {
      circle: 'w-10 h-10 text-base',
      label: 'text-base',
      description: 'text-sm',
      connector: orientation === 'vertical' ? 'h-10' : 'h-0.5',
    },
  };

  // Color variant configurations
  const variantClasses = {
    primary: {
      active: 'bg-primary text-primary-foreground border-primary',
      completed: 'bg-primary text-primary-foreground border-primary',
      pending: 'bg-card text-muted-foreground border-border',
      connector: 'bg-primary',
      connectorPending: 'bg-muted',
    },
    success: {
      active: 'bg-success text-success-foreground border-success',
      completed: 'bg-success text-success-foreground border-success',
      pending: 'bg-card text-muted-foreground border-border',
      connector: 'bg-success',
      connectorPending: 'bg-muted',
    },
    purple: {
      active: 'bg-accent text-accent-foreground border-accent',
      completed: 'bg-accent text-accent-foreground border-accent',
      pending: 'bg-card text-muted-foreground border-border',
      connector: 'bg-accent',
      connectorPending: 'bg-muted',
    },
  };

  const sizeConfig = sizeClasses[size];
  const variantConfig = variantClasses[variant];

  // Determine step status
  const getStepStatus = (
    index: number
  ): 'pending' | 'current' | 'completed' => {
    const step = steps[index];
    if (step.status) return step.status;
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const renderStep = (step: Step, index: number) => {
    const status = getStepStatus(index);
    const isClickable = !!onStepClick && status !== 'pending';

    const stepClasses = cn(
      'items-center justify-center rounded-full border-2 flex-shrink-0',
      sizeConfig.circle,
      status === 'completed' && variantConfig.completed,
      status === 'current' && variantConfig.active,
      status === 'pending' && variantConfig.pending,
      isClickable && 'active:opacity-80'
    );

    // Text color follows the circle's status color classes
    const circleTextClass = cn(
      'font-bold',
      status === 'completed' && variantConfig.completed,
      status === 'current' && variantConfig.active,
      status === 'pending' && variantConfig.pending
    );

    const checkSizeClass =
      size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

    // TODO: web used @heroicons CheckIcon; substituted with a check glyph to
    // avoid adding an icon dependency.
    const circleContent =
      status === 'completed' ? (
        <Text className={cn(circleTextClass, checkSizeClass)}>✓</Text>
      ) : (
        <Text className={circleTextClass}>{index + 1}</Text>
      );

    const circle = isClickable ? (
      <Pressable
        {...pressProps(() => handleStepClick(index))}
        accessibilityRole='button'
        className={stepClasses}
      >
        {circleContent}
      </Pressable>
    ) : (
      <View className={stepClasses}>{circleContent}</View>
    );

    return (
      <View
        key={index}
        className={cn(
          orientation === 'horizontal'
            ? 'flex-col items-center'
            : 'flex items-start'
        )}
      >
        <View
          className={cn(
            orientation === 'horizontal'
              ? 'flex-col items-center'
              : 'flex-row items-start gap-3'
          )}
        >
          {circle}
          <View
            className={cn(
              orientation === 'horizontal' ? 'items-center mt-2' : 'flex-1'
            )}
          >
            <Text
              className={cn(
                'font-medium',
                sizeConfig.label,
                status === 'pending' ? 'text-muted-foreground' : 'text-foreground font-medium'
              )}
            >
              {step.label}
            </Text>
            {step.description && (
              <Text
                className={cn(sizeConfig.description, 'text-muted-foreground', 'mt-0.5')}
              >
                {step.description}
              </Text>
            )}
          </View>
        </View>
        {showConnectors && index < steps.length - 1 && (
          <View
            className={cn(
              orientation === 'vertical' ? 'w-0.5 ml-3.5' : 'flex-1 mx-2',
              sizeConfig.connector,
              status === 'completed'
                ? variantConfig.connector
                : variantConfig.connectorPending
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => renderStep(step, index))}
    </View>
  );
};
