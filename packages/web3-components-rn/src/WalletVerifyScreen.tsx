import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type ViewProps,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { pressProps } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';
import { WalletIcon, type WalletProvider } from './WalletIcon';

export interface WalletVerifyScreenLabels {
  // Header
  pageTitle: string;
  pageDescription: string;
  // Wallet info
  connectedWalletLabel: string;
  ethereumChainLabel: string;
  solanaChainLabel: string;
  // Sign section
  signInEthereumTitle: string;
  signInEthereumDescription: string;
  signInSolanaTitle: string;
  signInSolanaDescription: string;
  // Buttons
  signMessageButton: string;
  signingButton: string;
  useDifferentWallet: string;
}

export interface WalletVerifyScreenProps extends Omit<ViewProps, 'children'> {
  /** Connected wallet address */
  walletAddress: string;
  /** Chain type (evm or solana) */
  chainType: 'evm' | 'solana';
  /** Name of the connected wallet provider (e.g., "MetaMask", "Phantom") */
  walletProvider?: string;
  /** Connector object for WalletIcon (optional, for EVM wallets) */
  walletConnector?: { icon?: string };
  /** Whether currently signing */
  isSigning: boolean;
  /** Error message to display */
  error?: string | null;
  /** Callback when sign button is pressed */
  onSign: () => void;
  /** Callback when "use different wallet" is pressed */
  onUseDifferentWallet: () => void;
  /** All UI labels */
  labels: WalletVerifyScreenLabels;
  /** Optional className */
  className?: string;
  /** Optional content to render after the sign button (e.g., footer links) */
  children?: React.ReactNode;
}

const getProviderFromName = (name: string): WalletProvider => {
  const lower = name.toLowerCase();
  if (lower.includes('metamask')) return 'metamask';
  if (lower.includes('walletconnect')) return 'walletconnect';
  if (lower.includes('coinbase')) return 'coinbase';
  if (lower.includes('rainbow')) return 'rainbow';
  if (lower.includes('phantom')) return 'phantom';
  if (lower.includes('trust')) return 'trust';
  return 'generic';
};

/**
 * WalletVerifyScreen - "Verify Your Wallet" signing UI (React Native)
 *
 * A presentational component for the wallet verification/signing step.
 * Shows connected wallet info and a sign message button.
 */
export const WalletVerifyScreen: React.FC<WalletVerifyScreenProps> = ({
  walletAddress,
  chainType,
  walletProvider,
  // walletConnector is accepted for API parity with the web source; the RN
  // WalletIcon derives its glyph from the provider name instead of a URL icon.
  walletConnector: _walletConnector,
  isSigning,
  error,
  onSign,
  onUseDifferentWallet,
  labels,
  className,
  children,
  ...props
}) => {
  const isSolana = chainType === 'solana';
  const chainLabel = isSolana
    ? labels.solanaChainLabel
    : labels.ethereumChainLabel;
  const signTitle = isSolana
    ? labels.signInSolanaTitle
    : labels.signInEthereumTitle;
  const signDescription = isSolana
    ? labels.signInSolanaDescription
    : labels.signInEthereumDescription;

  const chainBadgeClasses = isSolana
    ? cn(
        colors.component.badge.solana.base,
        colors.component.badge.solana.dark
      )
    : cn(
        colors.component.badge.ethereum.base,
        colors.component.badge.ethereum.dark
      );

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
          <Text className={cn('text-sm', colors.component.alert.error.icon)}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* Connected wallet info */}
      <View className='bg-muted rounded-lg p-4'>
        <View className='flex-row justify-between items-start mb-2'>
          <Text className={textVariants.body.sm()}>
            {labels.connectedWalletLabel}
          </Text>
          <Text
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              chainBadgeClasses
            )}
          >
            {chainLabel}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          {walletProvider ? (
            <WalletIcon
              provider={getProviderFromName(walletProvider)}
              size='sm'
            />
          ) : null}
          <Text className={textVariants.web3.address()}>{walletAddress}</Text>
        </View>
      </View>

      {/* Sign message section */}
      <View
        className={cn(
          'border rounded-lg p-4',
          isSolana ? 'bg-accent/50 border-accent' : 'bg-primary/10 border-primary/20'
        )}
      >
        <Text
          className={cn(
            'font-semibold mb-2',
            isSolana ? 'text-accent-foreground' : 'text-primary'
          )}
        >
          {signTitle}
        </Text>
        <Text
          className={cn(
            'text-sm',
            isSolana ? 'text-accent-foreground' : 'text-primary'
          )}
        >
          {signDescription}
        </Text>
      </View>

      {/* Sign button */}
      {/* TODO: web used a chain-brand gradient surface; RN substitutes a solid
          chain-accent background since gradients require an extra dependency. */}
      <Pressable
        {...pressProps(isSigning ? undefined : onSign, isSigning)}
        disabled={isSigning}
        accessibilityRole='button'
        accessibilityLabel={labels.signMessageButton}
        accessibilityState={{ disabled: isSigning }}
        className={cn(
          'w-full py-4 rounded-lg items-center justify-center',
          isSolana ? 'bg-purple-600 active:bg-purple-700' : 'bg-blue-600 active:bg-blue-700',
          isSigning && 'opacity-50'
        )}
      >
        {isSigning ? (
          <View className='flex-row items-center justify-center gap-2'>
            <ActivityIndicator size='small' color={colors.raw.neutral[0]} />
            <Text className='text-lg font-medium text-white'>
              {labels.signingButton}
            </Text>
          </View>
        ) : (
          <Text className='text-lg font-medium text-white'>
            {labels.signMessageButton}
          </Text>
        )}
      </Pressable>

      {/* Use different wallet link */}
      <Pressable
        {...pressProps(onUseDifferentWallet)}
        accessibilityRole='button'
        accessibilityLabel={labels.useDifferentWallet}
        className='w-full items-center'
      >
        <Text className={textVariants.body.sm()}>
          {labels.useDifferentWallet}
        </Text>
      </Pressable>

      {/* Optional children (e.g., footer) */}
      {children}
    </View>
  );
};
