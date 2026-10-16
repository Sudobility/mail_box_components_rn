import React from 'react';
import { View, Text, Pressable, Linking, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { pressProps } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';
import {
  WalletSelectionGrid,
  WalletTab,
  type WalletOption,
} from './WalletSelection';

export interface WalletConnectScreenLabels {
  // Tab labels
  ethereum: string;
  solana: string;
  // Wallet status
  available: string;
  notAvailable: string;
  // Help text
  noWalletText: string;
  installMetaMask: string;
  installPhantom: string;
  // Auto-connect
  autoConnectTitle?: string;
  autoConnectDescription?: string;
  // Browser compatibility
  extensionsNotSupported?: string;
  useChromeForSolana?: string;
}

export interface WalletConnectScreenProps extends ViewProps {
  /** EVM wallet options */
  evmWallets: WalletOption[];
  /** Solana wallet options */
  solanaWallets: WalletOption[];
  /** Currently active tab */
  activeTab: 'ethereum' | 'solana';
  /** Callback when tab changes */
  onTabChange: (tab: 'ethereum' | 'solana') => void;
  /** Currently connecting wallet name (shows spinner) */
  connectingWallet?: string | null;
  /** Whether auto-connecting in wallet browser */
  isAutoConnecting?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Whether the environment supports extensions */
  browserSupportsExtensions?: boolean;
  /** All UI labels */
  labels: WalletConnectScreenLabels;
  /** Optional className */
  className?: string;
}

/**
 * WalletConnectScreen - "Connect Your Wallet" UI (React Native)
 *
 * A presentational component for wallet selection with tab navigation.
 * Supports EVM and Solana wallets, auto-connect mode, and extension
 * compatibility messages.
 */
export const WalletConnectScreen: React.FC<WalletConnectScreenProps> = ({
  evmWallets,
  solanaWallets,
  activeTab,
  onTabChange,
  connectingWallet,
  isAutoConnecting = false,
  error,
  browserSupportsExtensions = true,
  labels,
  className,
  ...props
}) => {
  // Auto-connecting state (wallet browser)
  if (isAutoConnecting) {
    return (
      <View className={cn('items-center py-8', className)} {...props}>
        {/* TODO: web rendered an animated spinner ring; RN uses the kit's
            text status until a shared Spinner primitive is wired in. */}
        <Text className='text-4xl mb-4'>⏳</Text>
        <Text className={cn(textVariants.heading.h5(), 'mb-2')}>
          {labels.autoConnectTitle || 'Connecting to Wallet'}
        </Text>
        <Text className={textVariants.body.sm()}>
          {labels.autoConnectDescription ||
            'Please approve the connection in your wallet'}
        </Text>
      </View>
    );
  }

  // Environment doesn't support extensions - show message for Solana tab
  const showExtensionWarning =
    activeTab === 'solana' && !browserSupportsExtensions;

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className={cn('gap-6', className)} {...props}>
      {/* Error message */}
      {error ? (
        <View
          className={cn(
            'p-3 border rounded-lg',
            colors.component.card.error.base,
            colors.component.card.error.dark
          )}
        >
          <Text
            className={cn(
              'text-sm',
              colors.component.badge.error.base,
              colors.component.badge.error.dark
            )}
          >
            {error}
          </Text>
        </View>
      ) : null}

      {showExtensionWarning ? (
        <>
          {/* Tab Navigation - still show tabs */}
          <View className='flex-row gap-1 p-1 bg-muted rounded-lg'>
            {/* In this branch activeTab is always 'solana' (extension warning
                only shows for the Solana tab), mirroring the web source's
                static tab styling. */}
            <WalletTab
              active={false}
              onPress={() => onTabChange('ethereum')}
              icon='⟠'
              label={labels.ethereum}
              color='blue'
            />
            <WalletTab
              active
              onPress={() => onTabChange('solana')}
              icon='◎'
              label={labels.solana}
              color='purple'
            />
          </View>

          {/* Extension warning message */}
          <View className='p-6 border border-border rounded-lg bg-muted/50'>
            <View className='items-center gap-3'>
              <Text className={cn(textVariants.body.sm(), 'font-medium')}>
                {labels.extensionsNotSupported ||
                  'Browser extensions are not supported'}
              </Text>
              <Text className={textVariants.caption.default()}>
                {labels.useChromeForSolana ||
                  'Please use Chrome, Firefox, or Edge for Solana wallets'}
              </Text>
              <View className='flex-row justify-center gap-4 pt-2'>
                <Pressable
                  {...pressProps(() =>
                    openUrl('https://www.google.com/chrome/')
                  )}
                  accessibilityRole='link'
                >
                  <Text className='text-xs text-primary underline'>Chrome</Text>
                </Pressable>
                <Pressable
                  {...pressProps(() =>
                    openUrl('https://www.mozilla.org/firefox/')
                  )}
                  accessibilityRole='link'
                >
                  <Text className='text-xs text-primary underline'>
                    Firefox
                  </Text>
                </Pressable>
                <Pressable
                  {...pressProps(() =>
                    openUrl('https://www.microsoft.com/edge')
                  )}
                  accessibilityRole='link'
                >
                  <Text className='text-xs text-primary underline'>Edge</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      ) : (
        // Normal wallet selection
        <WalletSelectionGrid
          evmWallets={evmWallets}
          solanaWallets={solanaWallets}
          activeTab={activeTab}
          onTabChange={onTabChange}
          connectingWallet={connectingWallet}
          labels={{
            ethereum: labels.ethereum,
            solana: labels.solana,
            available: labels.available,
            notAvailable: labels.notAvailable,
            noWalletText: labels.noWalletText,
            installMetaMask: labels.installMetaMask,
            installPhantom: labels.installPhantom,
          }}
        />
      )}
    </View>
  );
};
