import React from 'react';
import { Image } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { designTokens } from '@sudobility/design';

export interface WalletIconProps {
  wallet: string;
  connector?: { icon?: string }; // Simplified connector type with optional icon
  className?: string;
  iconBasePath?: string; // Allow customizing the base path for icons
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  wallet,
  connector,
  className = 'w-8 h-8',
  iconBasePath = '/wallet-icons',
}) => {
  const walletName = wallet.toLowerCase();

  const getWalletIconPath = (name: string): string => {
    // Map wallet names to icon filenames
    const iconMap: Record<string, string> = {
      metamask: 'metamask.svg',
      walletconnect: 'walletconnect.svg',
      coinbase: 'coinbase.svg',
      phantom: 'phantom.svg',
      solflare: 'solflare.svg',
      keplr: 'keplr.svg',
      browser: 'browser-wallet.svg',
      injected: 'browser-wallet.svg',
    };

    // Find matching wallet name
    for (const [key, filename] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return `${iconBasePath}/${filename}`;
      }
    }

    // Default fallback
    return `${iconBasePath}/default.svg`;
  };

  const defaultIconPath = `${iconBasePath}/default.svg`;
  const initialSource = connector?.icon
    ? connector.icon
    : getWalletIconPath(walletName);

  // RN Image has no mutable target on error, so track the current source in
  // state and swap to the fallback when loading fails (mirrors the web onError).
  const [source, setSource] = React.useState(initialSource);

  React.useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  const handleError = () => {
    if (connector?.icon && source === connector.icon) {
      // If connector icon fails, fallback to our custom icons
      setSource(getWalletIconPath(walletName));
    } else {
      // Fallback to default icon if image fails to load
      setSource(defaultIconPath);
    }
  };

  return (
    <Image
      source={{ uri: source }}
      accessibilityLabel={`${wallet} wallet`}
      onError={handleError}
      className={cn(className, designTokens.radius.lg)}
    />
  );
};
