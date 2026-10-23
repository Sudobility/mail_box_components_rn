import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ComparisonItem {
  text: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  subtext?: string;
}

export interface ComparisonData {
  title: string;
  icon?: React.ReactNode;
  items: ComparisonItem[];
  variant: 'traditional' | 'web3' | 'neutral' | 'elevated';
  badge?: {
    text: string;
    color?: 'red' | 'green' | 'blue' | 'gray';
  };
}

export interface ComparisonSectionProps {
  className?: string;

  /** Layout of the comparison cards */
  layout?: 'grid' | 'stacked' | 'cards';
  /** Spacing between cards */
  spacing?: 'sm' | 'md' | 'lg';

  // Content
  title?: string;
  subtitle?: string;
  traditional: ComparisonData;
  web3: ComparisonData;

  // Styling
  cardAnimation?: 'none' | 'hover' | 'float';

  // Animation
  animate?: boolean;
  animationDelay?: number;

  // Custom icons
  traditionalIcon?: React.ReactNode;
  web3Icon?: React.ReactNode;
}

// NativeWind lacks CSS grid; layouts map to vertical flex stacks (gap by spacing).
const spacingStyles: Record<
  NonNullable<ComparisonSectionProps['spacing']>,
  string
> = {
  sm: 'gap-4',
  md: 'gap-8',
  lg: 'gap-12',
};

// hover:/transition-* classes dropped (no equivalent in RN).
const cardVariantStyles: Record<ComparisonData['variant'], string> = {
  traditional: 'bg-destructive/10 border-2 border-destructive/20',
  web3: 'bg-success/10 border-2 border-success/20',
  neutral: 'bg-card/50 border-2 border-border/30',
  elevated: 'bg-card shadow-lg border border-border',
};

const headerTextStyles: Record<ComparisonData['variant'], string> = {
  traditional: 'text-destructive',
  web3: 'text-success',
  neutral: 'text-foreground',
  elevated: 'text-foreground',
};

const defaultIcons: Record<ComparisonData['variant'], string> = {
  traditional: '❌',
  web3: '✅',
  neutral: 'ℹ️',
  elevated: '⭐',
};

const badgeBgColors = {
  red: 'bg-destructive/10',
  green: 'bg-success/10',
  blue: 'bg-primary/10',
  gray: 'bg-muted',
};

const badgeTextColors = {
  red: 'text-destructive',
  green: 'text-success',
  blue: 'text-primary',
  gray: 'text-muted-foreground',
};

/** Render a ReactNode icon, wrapping bare strings (e.g. emoji) in <Text>. */
const renderIcon = (
  icon: React.ReactNode,
  className?: string
): React.ReactNode =>
  typeof icon === 'string' || typeof icon === 'number' ? (
    <Text className={className}>{icon}</Text>
  ) : (
    icon
  );

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  className,
  layout: _layout = 'grid',
  spacing = 'md',

  title,
  subtitle,
  traditional,
  web3,

  cardAnimation: _cardAnimation = 'hover',

  animate: _animate = true,
  animationDelay: _animationDelay = 0,

  traditionalIcon,
  web3Icon,
}) => {
  const renderComparisonCard = (data: ComparisonData, index: number) => {
    const headerColor = headerTextStyles[data.variant];
    const icon =
      data.icon ??
      (index === 0 ? traditionalIcon : web3Icon) ??
      defaultIcons[data.variant];

    return (
      <View
        key={data.title}
        className={cn('rounded-xl p-6', cardVariantStyles[data.variant])}
      >
        {/* Header */}
        <View className='flex-row items-center gap-3 mb-4'>
          {renderIcon(icon, 'text-2xl')}
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className={cn('text-lg font-bold', headerColor)}>
                {data.title}
              </Text>
              {data.badge && (
                <View
                  className={cn(
                    'px-2 py-1 rounded-full',
                    badgeBgColors[data.badge.color || 'gray']
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs font-medium',
                      badgeTextColors[data.badge.color || 'gray']
                    )}
                  >
                    {data.badge.text}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Items */}
        <View className='gap-3'>
          {data.items.map((item, itemIndex) => (
            <View key={itemIndex} className='flex-row items-start gap-3'>
              {item.icon && renderIcon(item.icon, 'mt-0.5 text-base')}
              <View className='flex-1'>
                <Text
                  className={cn(
                    'text-sm leading-relaxed text-muted-foreground',
                    item.highlight && 'font-medium'
                  )}
                >
                  {item.text}
                </Text>
                {item.subtext && (
                  <Text className='text-xs text-muted-foreground mt-1'>
                    {item.subtext}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className={cn('gap-8', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <View className='items-center gap-4'>
          {title && (
            <Text className='text-2xl font-bold text-foreground text-center'>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className='text-lg text-muted-foreground text-center'>
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Comparison cards (stacked vertically on native) */}
      <View className={cn(spacingStyles[spacing])}>
        {renderComparisonCard(traditional, 0)}
        {renderComparisonCard(web3, 1)}
      </View>
    </View>
  );
};

// Helper function to create comparison data
export const createComparisonData = (
  title: string,
  items: (string | ComparisonItem)[],
  variant: 'traditional' | 'web3' | 'neutral' | 'elevated',
  options?: {
    icon?: React.ReactNode;
    badge?: ComparisonData['badge'];
  }
): ComparisonData => ({
  title,
  variant,
  items: items.map(item => (typeof item === 'string' ? { text: item } : item)),
  ...options,
});

// Predefined comparison examples - for backward compatibility
// Note: These should be moved to consuming application with proper localization
export const createEmailComparisonData = (labels?: {
  traditionalTitle?: string;
  web3Title?: string;
  traditionalItems?: { text: string; icon: string }[];
  web3Items?: { text: string; icon: string }[];
  traditionalBadge?: string;
  web3Badge?: string;
}) => {
  const defaultTraditionalItems = [
    { text: 'Create account with email/password', icon: '🔑' },
    { text: 'Remember multiple passwords', icon: '🧠' },
    { text: 'Verify email address', icon: '📧' },
    { text: 'Risk of password theft', icon: '⚠️' },
    { text: 'Data stored on company servers', icon: '🏢' },
    { text: 'Account can be locked/suspended', icon: '🔒' },
  ];

  const defaultWeb3Items = [
    { text: 'Connect your wallet', icon: '🔗' },
    { text: 'No passwords needed', icon: '🚫' },
    { text: 'Instant authentication', icon: '⚡' },
    { text: 'Cryptographically secure', icon: '🔐' },
    { text: 'You own your data', icon: '👑' },
    { text: 'Censorship resistant', icon: '🛡️' },
  ];

  return {
    traditional: createComparisonData(
      labels?.traditionalTitle || 'Traditional Email',
      labels?.traditionalItems || defaultTraditionalItems,
      'traditional',
      { badge: { text: labels?.traditionalBadge || 'Old Way', color: 'red' } }
    ),

    web3: createComparisonData(
      labels?.web3Title || 'Web3 Email',
      labels?.web3Items || defaultWeb3Items,
      'web3',
      { badge: { text: labels?.web3Badge || 'New Way', color: 'green' } }
    ),
  };
};
