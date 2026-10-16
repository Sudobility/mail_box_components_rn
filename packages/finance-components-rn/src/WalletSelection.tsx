import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  type ViewProps,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors, textVariants, designTokens } from '@sudobility/design';
import { pressProps } from '@sudobility/components-rn';
import { WalletIcon } from './WalletIcon';

/** Tracking data for WalletSelection actions */
export interface WalletSelectionTrackingData {
  action: 'click';
  trackingLabel?: string;
  componentName?: string;
}

export interface WalletOption {
  id: string;
  name: string;
  icon?: string;
  available: boolean;
  connecting?: boolean;
  chainType: 'evm' | 'solana';
  connector?: unknown;
  onClick: () => void;
}

export interface WalletSelectionButtonProps {
  wallet: WalletOption;
  disabled?: boolean;
  className?: string;
  statusLabels?: {
    available: string;
    notAvailable: string;
  };
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

const WalletSelectionButton: React.FC<WalletSelectionButtonProps> = ({
  wallet,
  disabled = false,
  className = '',
  statusLabels = { available: 'Available', notAvailable: 'Not Available' },
  onTrack,
  trackingLabel,
  componentName = 'WalletSelectionButton',
}) => {
  const handleClick = () => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    wallet.onClick();
  };

  const isDisabled = disabled || !wallet.available;

  return (
    <Pressable
      {...pressProps(handleClick, isDisabled)}
      disabled={isDisabled}
      accessibilityRole='button'
      accessibilityLabel={`Connect ${wallet.name} wallet for ${wallet.chainType === 'solana' ? 'Solana' : 'Ethereum'} network`}
      accessibilityState={{ disabled: isDisabled }}
      className={cn(
        'w-full flex-row items-center justify-between p-4 py-5',
        'border',
        'border-border',
        designTokens.radius.lg,
        isDisabled && 'opacity-50',
        className
      )}
    >
      <View className='flex-row items-center gap-3'>
        <WalletIcon
          wallet={wallet.name.toLowerCase()}
          connector={wallet.connector as { icon?: string } | undefined}
        />
        <View>
          <Text className={textVariants.label.default()}>{wallet.name}</Text>
          <Text
            className={cn(
              'text-xs',
              wallet.available ? 'text-success' : 'text-destructive'
            )}
          >
            {wallet.available
              ? statusLabels.available
              : statusLabels.notAvailable}
          </Text>
        </View>
      </View>

      {wallet.connecting && (
        <ActivityIndicator
          size='small'
          color={
            wallet.chainType === 'solana'
              ? colors.raw.purple[600]
              : colors.raw.blue[600]
          }
        />
      )}
    </Pressable>
  );
};

export interface WalletTabProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: 'blue' | 'purple';
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

const WalletTab: React.FC<WalletTabProps> = ({
  active,
  onClick,
  icon,
  label,
  color,
  onTrack,
  trackingLabel,
  componentName = 'WalletTab',
}) => {
  const handleClick = () => {
    onTrack?.({ action: 'click', trackingLabel, componentName });
    onClick();
  };

  const colorClasses = {
    blue: active
      ? cn('bg-card', 'text-primary', designTokens.shadow.sm)
      : 'text-muted-foreground',
    purple: active
      ? cn('bg-card', 'text-accent-foreground', designTokens.shadow.sm)
      : 'text-muted-foreground',
  };

  return (
    <Pressable
      {...pressProps(handleClick)}
      accessibilityRole='tab'
      accessibilityState={{ selected: active }}
      className={cn(
        'flex-1 py-2 px-4 font-medium',
        designTokens.radius.md,
        colorClasses[color]
      )}
    >
      <View className='flex-row items-center justify-center gap-2'>
        <Text className={colorClasses[color]}>{icon}</Text>
        <Text className={cn('font-medium', colorClasses[color])}>{label}</Text>
      </View>
    </Pressable>
  );
};

export interface WalletSelectionGridProps extends ViewProps {
  evmWallets: WalletOption[];
  solanaWallets: WalletOption[];
  activeTab: 'ethereum' | 'solana';
  onTabChange: (tab: 'ethereum' | 'solana') => void;
  connectingWallet?: string | null;
  className?: string;
  labels?: {
    ethereum?: string;
    solana?: string;
    available?: string;
    notAvailable?: string;
    noWalletText?: string;
    installMetaMask?: string;
    installPhantom?: string;
  };
  /** Optional tracking callback */
  onTrack?: (data: WalletSelectionTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

export const WalletSelectionGrid: React.FC<WalletSelectionGridProps> = ({
  evmWallets,
  solanaWallets,
  activeTab,
  onTabChange,
  connectingWallet,
  className = '',
  labels = {},
  onTrack,
  trackingLabel,
  ...props
}) => {
  const defaultLabels = {
    ethereum: 'Ethereum',
    solana: 'Solana',
    available: 'Available',
    notAvailable: 'Not Available',
    noWalletText: "Don't have a wallet?",
    installMetaMask: 'Install MetaMask',
    installPhantom: 'Install Phantom',
  };

  const finalLabels = { ...defaultLabels, ...labels };
  const currentWallets = activeTab === 'ethereum' ? evmWallets : solanaWallets;

  const handleInstallPress = () => {
    const url =
      activeTab === 'ethereum'
        ? 'https://metamask.io/download/'
        : 'https://phantom.app/download';
    Linking.openURL(url);
  };

  return (
    <View className={cn('gap-6', className)} {...props}>
      {/* Tab Navigation */}
      <View
        className={cn(
          'flex-row gap-1 p-1',
          'bg-muted',
          designTokens.radius.lg
        )}
      >
        <WalletTab
          active={activeTab === 'ethereum'}
          onClick={() => onTabChange('ethereum')}
          icon='⟠'
          label={finalLabels.ethereum}
          color='blue'
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
        <WalletTab
          active={activeTab === 'solana'}
          onClick={() => onTabChange('solana')}
          icon='◎'
          label={finalLabels.solana}
          color='purple'
          onTrack={onTrack}
          trackingLabel={trackingLabel}
        />
      </View>

      {/* Wallet Grid */}
      <View className='gap-3'>
        {currentWallets.map(wallet => (
          <WalletSelectionButton
            key={wallet.id}
            wallet={{
              ...wallet,
              connecting: connectingWallet === wallet.name,
            }}
            disabled={!!connectingWallet}
            statusLabels={{
              available: finalLabels.available,
              notAvailable: finalLabels.notAvailable,
            }}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
          />
        ))}
      </View>

      {/* Help Text */}
      <View className='items-center pt-2'>
        <Text className={textVariants.body.sm()}>
          {finalLabels.noWalletText}{' '}
        </Text>
        <Pressable {...pressProps(handleInstallPress)} accessibilityRole='link'>
          <Text
            className={cn(
              activeTab === 'ethereum'
                ? 'text-primary'
                : 'text-accent-foreground'
            )}
          >
            {activeTab === 'ethereum'
              ? finalLabels.installMetaMask
              : finalLabels.installPhantom}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
