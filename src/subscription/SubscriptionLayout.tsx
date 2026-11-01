import type { ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { cn, pressProps } from '../index';
import { SubscriptionTile } from './SubscriptionTile';
import { PlatformIcon, platformDisplayName } from './PlatformIcon';
import type {
  FreeTileConfig,
  SubscriptionLayoutTrackingData,
  SubscriptionStatusConfig,
  ActionButtonConfig,
} from './types';

export type { SubscriptionStatusConfig, ActionButtonConfig } from './types';

/**
 * Layout variant:
 * - 'selection': User selects a tile, then presses a shared CTA button (default)
 * - 'cta': Each tile has its own CTA button, no shared action buttons
 */
export type SubscriptionLayoutVariant = 'selection' | 'cta';

export interface SubscriptionLayoutProps {
  /** Section title (accepted for API compatibility; not rendered as a heading) */
  title: string;
  /** Subscription tiles to render */
  children: ReactNode;
  /** Error message to display */
  error?: string | null;
  /**
   * Layout variant
   * - 'selection': User selects a tile, then presses primary action button
   * - 'cta': Each tile has its own CTA button (use ctaButton prop on tiles)
   * @default 'selection'
   */
  variant?: SubscriptionLayoutVariant;
  /** Current subscription status configuration */
  currentStatus?: SubscriptionStatusConfig;
  /** Primary action button (e.g., "Subscribe Now") - only shown in 'selection' variant */
  primaryAction?: ActionButtonConfig;
  /** Secondary action button (e.g., "Restore Purchase") - only shown in 'selection' variant */
  secondaryAction?: ActionButtonConfig;
  /** Minimum tile width in pixels (default: 240) */
  minTileWidth?: number;
  /** Additional NativeWind classes */
  className?: string;
  /** Custom header content */
  headerContent?: ReactNode;
  /** Content to render above the product tiles (e.g., billing period selector) */
  aboveProducts?: ReactNode;
  /** Custom footer content (rendered above action buttons) */
  footerContent?: ReactNode;
  /** Label for "Current Status" section - for localization */
  currentStatusLabel?: string;
  /**
   * Configuration for the free tile - only used when variant is 'cta'
   * When provided, a "Free" subscription tile will be shown at the start of the grid
   */
  freeTileConfig?: FreeTileConfig;
  /** Optional tracking callback */
  onTrack?: (data: SubscriptionLayoutTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * SubscriptionLayout - Container component for subscription selection UI
 *
 * Mirrors @sudobility/components/subscription' SubscriptionLayout (web):
 * - Optional current status display
 * - A segmented control (`aboveProducts`) pinned at the top
 * - A scrolling region with the subscription tiles / content
 * - Error message display
 * - Primary and optional secondary action buttons (selection variant)
 *
 * The subscription surface owns its own scroll (the segmented control stays
 * fixed while the tiles scroll), so a surrounding pane need not scroll. All
 * labels are passed by the consumer for full localization control.
 */
export function SubscriptionLayout({
  // `title` is accepted for API parity with the web component but is not
  // rendered as a heading — the surface shows no title above the controls.
  children,
  error,
  variant = 'selection',
  currentStatus,
  primaryAction,
  secondaryAction,
  minTileWidth: _minTileWidth = 240,
  className,
  headerContent,
  aboveProducts,
  footerContent,
  currentStatusLabel = 'Current Status',
  freeTileConfig,
  onTrack,
  trackingLabel,
  componentName = 'SubscriptionLayout',
}: SubscriptionLayoutProps) {
  const showActionButtons = variant === 'selection' && primaryAction;
  // Free tile is only valid in 'cta' variant
  const shouldShowFreeTile = variant === 'cta' && freeTileConfig;

  const handlePrimaryPress = () => {
    onTrack?.({ action: 'primary_action', trackingLabel, componentName });
    primaryAction?.onClick();
  };

  const handleSecondaryPress = () => {
    onTrack?.({ action: 'secondary_action', trackingLabel, componentName });
    secondaryAction?.onClick();
  };

  return (
    <View className={cn('flex-1', className)}>
      {/* Custom Header Content */}
      {headerContent}

      {/* Segmented control: stays fixed at the top; the content below scrolls. */}
      {aboveProducts}

      {/* Scrolling region — the subscription surface owns its own scroll, so
          the pane around it need not scroll. `pt-1 px-0.5` leaves room for a
          tile's top badge (e.g. "Current"), which overflows the tile's top. */}
      <ScrollView
        className='flex-1'
        contentContainerClassName='pt-4'
        showsVerticalScrollIndicator={false}
      >
        {/* Current Status Section */}
        {currentStatus && (
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-foreground mb-4'>
              {currentStatusLabel}
            </Text>

            {currentStatus.isActive ? (
              <View className='bg-card/30 border border-border rounded-lg p-4'>
                <View className='flex-row items-center mb-2'>
                  <View className='w-3 h-3 bg-success rounded-full mr-3' />
                  <Text className='font-semibold text-foreground'>
                    {currentStatus.activeContent?.title ||
                      'Active Subscription'}
                  </Text>
                </View>
                {currentStatus.activeContent?.fields &&
                  currentStatus.activeContent.fields.length > 0 && (
                    <View className='mt-4 gap-4'>
                      {currentStatus.activeContent.fields.map(
                        (field, index) => (
                          <View key={index}>
                            <Text className='text-sm text-muted-foreground'>
                              {field.label}
                            </Text>
                            <Text className='font-semibold text-muted-foreground'>
                              {field.value}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                {currentStatus.activeContent?.platform && (
                  <View className='mt-4'>
                    <Text className='text-sm text-muted-foreground'>
                      {currentStatus.activeContent.platform.label}
                    </Text>
                    <View className='flex-row items-center gap-1.5 mt-0.5'>
                      <PlatformIcon
                        platform={currentStatus.activeContent.platform.value}
                        className='text-muted-foreground'
                      />
                      <Text className='font-semibold text-muted-foreground'>
                        {platformDisplayName(
                          currentStatus.activeContent.platform.value
                        )}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className='bg-warning/10 border border-warning/20 rounded-lg p-4'>
                <View className='flex-row items-center mb-2'>
                  <View className='w-3 h-3 bg-warning rounded-full mr-3' />
                  <Text className='font-semibold text-warning'>
                    {currentStatus.inactiveContent?.title ||
                      'No Active Subscription'}
                  </Text>
                </View>
                {currentStatus.inactiveContent?.message && (
                  <Text className='text-warning'>
                    {currentStatus.inactiveContent.message}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Subscription tiles (features + options). Single-column stack: the
            web uses an auto-fit grid, but the subscription pages render
            full-width content (offering card + duration list), so a column
            matches that layout on RN. */}
        <View className='gap-6'>
          {/* Free Tile - only shown in 'cta' variant when enabled */}
          {shouldShowFreeTile && (
            <SubscriptionTile
              id='free'
              title={freeTileConfig.title}
              price={freeTileConfig.price}
              periodLabel={freeTileConfig.periodLabel}
              features={freeTileConfig.features}
              isSelected={false}
              onSelect={() => {}}
              topBadge={freeTileConfig.topBadge}
              ctaButton={freeTileConfig.ctaButton}
            />
          )}
          {children}
        </View>

        {/* Custom Footer Content */}
        {footerContent}

        {/* Error Message */}
        {error && (
          <View className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-6'>
            <Text className='text-destructive'>{error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons - only shown in 'selection' variant */}
      {showActionButtons && (
        <View className='gap-3 pt-3 border-t border-border'>
          {secondaryAction && (
            <Pressable
              {...pressProps(
                handleSecondaryPress,
                secondaryAction.disabled || secondaryAction.loading
              )}
              disabled={secondaryAction.disabled || secondaryAction.loading}
              accessibilityRole='button'
              accessibilityLabel={secondaryAction.label}
              accessibilityState={{
                disabled: secondaryAction.disabled || secondaryAction.loading,
                busy: secondaryAction.loading,
              }}
              className={cn(
                'py-3 rounded-lg border border-border items-center',
                (secondaryAction.disabled || secondaryAction.loading) &&
                  'opacity-50'
              )}
            >
              {secondaryAction.loading ? (
                <ActivityIndicator size='small' />
              ) : (
                <Text className='font-semibold text-foreground'>
                  {secondaryAction.label}
                </Text>
              )}
            </Pressable>
          )}

          <Pressable
            {...pressProps(
              handlePrimaryPress,
              primaryAction.disabled || primaryAction.loading
            )}
            disabled={primaryAction.disabled || primaryAction.loading}
            accessibilityRole='button'
            accessibilityLabel={primaryAction.label}
            accessibilityState={{
              disabled: primaryAction.disabled || primaryAction.loading,
              busy: primaryAction.loading,
            }}
            className={cn(
              'py-3 rounded-lg bg-primary items-center',
              (primaryAction.disabled || primaryAction.loading) && 'opacity-50'
            )}
          >
            {primaryAction.loading ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Text className='font-semibold text-primary-foreground'>
                {primaryAction.label}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default SubscriptionLayout;
