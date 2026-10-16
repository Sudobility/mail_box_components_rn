import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import {
  cn,
  Dropdown,
  Avatar,
  Badge,
  ChainBadge,
  type DropdownItem,
  type ChainType,
} from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

/** Authentication status used to drive the status badge. */
export type WalletAuthStatus = 'verified' | 'connected' | 'disconnected';

export interface WalletMenuItem {
  id: string;
  label: string;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface WalletDropdownMenuProps extends Omit<ViewProps, 'children'> {
  /** Wallet address to display */
  walletAddress: string;
  /** Authentication status for status badge */
  authStatus: WalletAuthStatus;
  /** Chain type for chain badge */
  chainType: ChainType | 'unknown';
  /** Menu items provided by consumer */
  menuItems: WalletMenuItem[];
  /** Optional user avatar URL */
  avatar?: string;
  /** Optional display name (falls back to formatted address) */
  displayName?: string;
  /** Optional custom address formatter */
  formatAddress?: (address: string) => string;
  /** Optional custom labels for status badge */
  statusLabels?: {
    verified?: string;
    connected?: string;
    disconnected?: string;
  };
  /** Optional className for the trigger button */
  className?: string;
  /** Dropdown alignment */
  align?: 'left' | 'right';
}

const defaultFormatAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const statusVariant: Record<
  WalletAuthStatus,
  'success' | 'primary' | 'default'
> = {
  verified: 'success',
  connected: 'primary',
  disconnected: 'default',
};

const defaultStatusLabel: Record<WalletAuthStatus, string> = {
  verified: 'Verified',
  connected: 'Connected',
  disconnected: 'Disconnected',
};

/**
 * WalletDropdownMenu - A connected wallet dropdown menu component (React Native)
 *
 * Displays wallet address, status badges, and a customizable dropdown menu.
 * All menu items and actions are provided by the consumer for maximum
 * flexibility.
 */
export const WalletDropdownMenu: React.FC<WalletDropdownMenuProps> = ({
  walletAddress,
  authStatus,
  chainType,
  menuItems,
  avatar,
  displayName,
  formatAddress = defaultFormatAddress,
  statusLabels,
  className,
  align = 'right',
  ...props
}) => {
  const getStatusLabel = (status: WalletAuthStatus): string =>
    statusLabels?.[status] ?? defaultStatusLabel[status];

  const formattedAddress = formatAddress(walletAddress);
  const display = displayName || formattedAddress;

  const items: DropdownItem[] = menuItems.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    onPress: item.onPress,
    disabled: item.disabled,
    separator: item.separator,
  }));

  return (
    <Dropdown
      items={items}
      align={align}
      trigger={
        // The kit's Dropdown wraps `trigger` in its own Pressable that opens
        // the menu, so this is a plain layout container.
        <View
          accessibilityLabel='Wallet menu'
          className={cn(
            'flex-row items-center gap-2 px-3 py-2 rounded-lg',
            className
          )}
          {...props}
        >
          {avatar ? (
            <Avatar src={avatar} alt={display} size='sm' />
          ) : null}
          <View className='items-start'>
            <Text className={textVariants.label.default()}>{display}</Text>
            <View className='flex-row items-center gap-1'>
              <Badge variant={statusVariant[authStatus]} size='sm'>
                {getStatusLabel(authStatus)}
              </Badge>
              {chainType !== 'unknown' ? (
                <ChainBadge chainType={chainType} size='sm' />
              ) : null}
            </View>
          </View>
          {/* TODO: web used a Heroicons chevron; RN substitutes a text glyph to
              avoid adding an icon dependency. */}
          <Text className='text-base text-muted-foreground'>▾</Text>
        </View>
      }
    />
  );
};
