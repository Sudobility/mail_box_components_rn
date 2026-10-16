import React from 'react';
import { View } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface GradientBannerProps {
  /** Main content of the banner */
  children: React.ReactNode;
  /** Gradient color variant */
  variant?:
    | 'blue-purple'
    | 'green-blue'
    | 'orange-red'
    | 'gray'
    | 'light'
    | 'custom';
  /** Custom gradient classes (when variant is 'custom') */
  gradientClasses?: string;
  /** Size/padding variant */
  size?: 'sm' | 'md' | 'lg';
  /** Border radius */
  rounded?: 'md' | 'lg' | 'xl' | '2xl';
  /** Show border */
  bordered?: boolean;
  /** Border color classes (when bordered is true) */
  borderClasses?: string;
  /** Additional className for the container */
  className?: string;
}

/**
 * GradientBanner Component
 *
 * A versatile banner component for highlighting important content, CTAs, or
 * feature sections.
 *
 * @example
 * ```tsx
 * <GradientBanner variant="blue-purple" size="lg">
 *   <Text className={textVariants.heading.h3()}>Special Offer</Text>
 *   <Text>Get started with Web3 Email today!</Text>
 * </GradientBanner>
 * ```
 */
export const GradientBanner: React.FC<GradientBannerProps> = ({
  children,
  variant = 'blue-purple',
  gradientClasses,
  size = 'md',
  rounded = '2xl',
  bordered = false,
  borderClasses = 'border border-white/20',
  className,
}) => {
  // Gradient color variants
  // intentional: decorative gradient color options are a feature of this component;
  // the from-*/to-* palette colors and text-white on them are preserved on purpose.
  const gradientVariants = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    'green-blue': 'bg-gradient-to-r from-green-600 to-blue-600 text-white',
    'orange-red': 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
    gray: 'bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 text-white',
    light:
      'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-foreground',
    custom:
      gradientClasses ||
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
  };

  // TODO: RN/NativeWind cannot render CSS `bg-gradient-to-*` fills. The gradient
  // classes above are kept for API parity (and in case NativeWind gains support),
  // but a solid fallback color is applied so the banner stays visible without
  // pulling in a new dependency (e.g. expo-linear-gradient / react-native-svg).
  const fallbackVariants = {
    'blue-purple': 'bg-blue-600',
    'green-blue': 'bg-green-600',
    'orange-red': 'bg-orange-600',
    gray: 'bg-gray-700 dark:bg-gray-900',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    custom: 'bg-blue-600',
  };

  // Size/padding configurations
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Border radius configurations
  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  return (
    <View
      className={cn(
        gradientVariants[variant],
        fallbackVariants[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        bordered && borderClasses,
        className
      )}
    >
      {children}
    </View>
  );
};
