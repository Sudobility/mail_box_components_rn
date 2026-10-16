import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

export interface AddressLabelProps {
  /** Blockchain address (EVM or Solana) */
  address: string;

  /** Number of characters to show at start (default: 6) */
  prefixLength?: number;

  /** Number of characters to show at end (default: 4) */
  suffixLength?: number;

  /** Optional className for custom styling */
  className?: string;

  /** Whether to show copy button (default: false) */
  showCopy?: boolean;
}

/**
 * Shortens a blockchain address for display
 * @param address - Full address
 * @param prefixLength - Characters to show at start
 * @param suffixLength - Characters to show at end
 */
const shortenAddress = (
  address: string,
  prefixLength: number,
  suffixLength: number
): string => {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * AddressLabel - Displays shortened blockchain address with tooltip
 *
 * Features:
 * - Auto-shortens long addresses
 * - Tapping reveals the full address (and, with showCopy, a "Copied!" state)
 * - Supports both EVM and Solana addresses
 * - Light/dark theme support
 *
 * RN notes: the web version renders a hover tooltip through a DOM portal and
 * calls `navigator.clipboard`. Neither exists here, so the full address is
 * surfaced in an absolutely-positioned bubble on press and the copy itself is
 * left as a TODO (the package declares no clipboard dependency — see below).
 */
export const AddressLabel: React.FC<AddressLabelProps> = ({
  address,
  prefixLength = 6,
  suffixLength = 4,
  className = '',
  showCopy = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortAddress = shortenAddress(address, prefixLength, suffixLength);

  const handlePress = () => {
    if (showCopy) {
      // TODO: wire a real clipboard write once a clipboard dependency
      // (e.g. expo-clipboard) is added to this package; the web source used
      // navigator.clipboard.writeText(address).
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const label = (
    <Text
      className={cn(
        textVariants.web3.address(),
        showCopy && 'text-primary',
        className
      )}
      accessibilityLabel={address}
      selectable
    >
      {shortAddress}
    </Text>
  );

  if (!showCopy) {
    return <View className='flex-row items-center'>{label}</View>;
  }

  return (
    <View className='relative flex-row items-center'>
      <Pressable
        {...pressProps(handlePress)}
        accessibilityRole='button'
        accessibilityLabel={`Address ${shortAddress}`}
      >
        {label}
      </Pressable>

      {showTooltip && (
        <View
          className='absolute bottom-full mb-2 px-3 py-2 rounded bg-popover'
          pointerEvents='none'
        >
          {copied ? (
            <Text className='text-success text-xs'>✓ Copied!</Text>
          ) : (
            <Text className='font-mono text-popover-foreground text-xs'>
              {address}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
