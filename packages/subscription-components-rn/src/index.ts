/**
 * @sudobility/subscription-components-rn
 *
 * Subscription UI components for React Native with RevenueCat integration.
 * All components support full localization - text labels are passed by the consumer.
 *
 * Faithful mirror of @sudobility/subscription-components (web): same component
 * names, props, properties and behavior — React Native primitives instead of
 * the DOM.
 */

// Components
export {
  SubscriptionTile,
  type SubscriptionTileProps,
} from './SubscriptionTile';
export {
  SubscriptionLayout,
  type SubscriptionLayoutProps,
  type SubscriptionLayoutVariant,
  type SubscriptionStatusConfig,
  type ActionButtonConfig,
} from './SubscriptionLayout';
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlOption,
} from './SegmentedControl';
export {
  SubscriptionProvider,
  useSubscriptionContext,
  clearRevenueCatCheckoutSessions,
  closeRevenueCatInstance,
  type SubscriptionProviderProps,
} from './SubscriptionProvider';

// Types
export type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
  SubscriptionProviderConfig,
  BadgeConfig,
  CtaButtonConfig,
  DiscountBadgeConfig,
  PremiumCalloutConfig,
  FreeTileConfig,
} from './types';

// NOTE: the web package also exports a `SubscriptionService` — a pure
// transformer of @revenuecat/purchases-js `Offerings`/`CustomerInfo`. On React
// Native the same RevenueCat data is produced by @sudobility/subscription_lib
// (the native react-native-purchases adapter), which the pages use, so a
// parallel service here would be unused and SDK-mismatched; it is intentionally
// not mirrored.

// Utilities
export { cn } from './lib/cn';
