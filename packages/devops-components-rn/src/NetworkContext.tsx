/**
 * Network connectivity context for React Native applications
 *
 * Provides real-time network status updates. Uses dependency injection to
 * receive a platform-specific network service implementation.
 *
 * @example
 * ```tsx
 * import { NetworkProvider, useNetwork } from '@sudobility/devops-components-rn';
 *
 * function App() {
 *   return (
 *     <NetworkProvider networkService={networkService}>
 *       <YourApp />
 *     </NetworkProvider>
 *   );
 * }
 *
 * function YourComponent() {
 *   const { isOnline, isOffline } = useNetwork();
 *   return <Text>{isOnline ? 'Connected' : 'No internet connection'}</Text>;
 * }
 * ```
 */

import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * Minimal platform network service contract.
 *
 * Mirrors the `PlatformNetwork` interface from `@sudobility/di` used by the web
 * source. It is declared locally because `@sudobility/di` is not a dependency
 * of the RN component packages; any service with this shape can be injected.
 */
export interface PlatformNetwork {
  /** Returns the current online status synchronously. */
  isOnline(): boolean;
  /**
   * Subscribes to network status changes.
   * @returns An unsubscribe function.
   */
  watchNetworkStatus(callback: (online: boolean) => void): () => void;
}

/**
 * Network context value interface
 */
export interface NetworkContextValue {
  /** Whether the device is currently online */
  isOnline: boolean;
  /** Whether the device is currently offline */
  isOffline: boolean;
}

/**
 * Network provider props
 */
export interface NetworkProviderProps {
  /** Platform-specific network service implementation */
  networkService: PlatformNetwork;
  /** Child components */
  children: ReactNode;
}

// Create the context with undefined default (must use provider)
const NetworkContext = createContext<NetworkContextValue | undefined>(
  undefined
);

/**
 * Network provider component
 *
 * Wraps your application to provide network status to all child components.
 * Uses the injected PlatformNetwork service to monitor connectivity.
 *
 * @param props - Provider props with network service and children
 */
export function NetworkProvider({
  networkService,
  children,
}: NetworkProviderProps): React.ReactElement {
  // Initialize with current network status
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return networkService.isOnline();
  });

  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = networkService.watchNetworkStatus(online => {
      setIsOnline(online);
    });

    // Update initial state in case it changed during render
    const currentStatus = networkService.isOnline();
    setIsOnline(currentStatus);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [networkService]);

  const value: NetworkContextValue = {
    isOnline,
    isOffline: !isOnline,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

/**
 * Hook to access network status
 *
 * Must be used within a NetworkProvider.
 *
 * @returns Network status information
 * @throws Error if used outside NetworkProvider
 */
export function useNetwork(): NetworkContextValue {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error(
      'useNetwork must be used within a NetworkProvider. ' +
        'Wrap your app with <NetworkProvider networkService={...}> first.'
    );
  }

  return context;
}
