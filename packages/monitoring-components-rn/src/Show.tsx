import React from 'react';

export interface ShowProps {
  /** Condition to evaluate */
  when: boolean;
  /** Content to show when condition is true */
  children: React.ReactNode;
  /** Fallback content when condition is false */
  fallback?: React.ReactNode;
}

/**
 * Show Component
 *
 * Conditional rendering component with optional fallback.
 * Provides cleaner syntax than ternary operators for conditional UI.
 *
 * @example
 * ```tsx
 * <Show when={isLoading} fallback={<Content />}>
 *   <Spinner />
 * </Show>
 * ```
 */
export const Show: React.FC<ShowProps> = ({
  when,
  children,
  fallback = null,
}) => {
  return <>{when ? children : fallback}</>;
};
