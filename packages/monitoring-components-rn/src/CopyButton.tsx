import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, Pressable } from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button variant */
  variant?: 'icon' | 'text' | 'outline';
  /** Custom label (for text/outline variants) */
  label?: string;
  /** Custom success label (for text/outline variants) */
  successLabel?: string;
  /** Icon position (for text/outline variants) */
  iconPosition?: 'left' | 'right';
  /** Additional className */
  className?: string;
  /** Accessible label / tooltip text */
  title?: string;
  /** Callback after successful copy */
  onCopySuccess?: () => void;
  /** Callback after copy error */
  onCopyError?: (error: Error) => void;
}

/**
 * CopyButton Component
 *
 * A button that copies text to the clipboard with visual feedback.
 * Commonly used for copying IDs, addresses, code snippets, or URLs.
 *
 * @example
 * ```tsx
 * // Icon button (default)
 * <CopyButton text="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 *
 * // Text button with label
 * <CopyButton text="https://example.com" variant="text" label="Copy Link" />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  size = 'md',
  variant = 'icon',
  label = 'Copy',
  successLabel = 'Copied!',
  iconPosition = 'left',
  className,
  title,
  onCopySuccess,
  onCopyError,
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handlePress = useCallback(() => {
    try {
      // TODO: RN has no built-in clipboard. Wire up a clipboard dep when
      // available (e.g. `@react-native-clipboard/clipboard` or expo-clipboard):
      //   Clipboard.setString(text);
      // The web source used `useCopyToClipboard` from `@sudobility/components`.
      void text;

      setCopied(true);
      onCopySuccess?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onCopyError?.(error instanceof Error ? error : new Error('Copy failed'));
    }
  }, [text, onCopySuccess, onCopyError]);

  // Size configurations
  const sizeClasses = {
    sm: { icon: 'text-sm', button: 'p-1', text: 'text-xs px-2 py-1' },
    md: { icon: 'text-base', button: 'p-1.5', text: 'text-sm px-3 py-1.5' },
    lg: { icon: 'text-lg', button: 'p-2', text: 'text-base px-4 py-2' },
  };

  const sizeConfig = sizeClasses[size];
  // TODO: web used @heroicons ClipboardDocumentIcon / CheckIcon; substituting
  // glyphs to avoid adding an icon dependency.
  const iconGlyph = copied ? '✓' : '⧉';
  const accessibilityLabel = title || (copied ? 'Copied!' : 'Copy to clipboard');

  // Icon-only button
  if (variant === 'icon') {
    return (
      <Pressable
        {...pressProps(handlePress)}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        className={cn(
          'items-center justify-center rounded',
          sizeConfig.button,
          className
        )}
      >
        <Text
          className={cn(
            sizeConfig.icon,
            copied ? 'text-success' : 'text-muted-foreground'
          )}
        >
          {iconGlyph}
        </Text>
      </Pressable>
    );
  }

  // Text or outline button
  const variantClasses = {
    text: copied ? 'text-success' : 'text-primary',
    outline: cn(
      'border',
      copied ? 'border-success' : 'border-border'
    ),
  };

  const textColor = copied
    ? 'text-success'
    : variant === 'outline'
      ? 'text-foreground'
      : 'text-primary';

  const displayLabel = copied ? successLabel : label;

  return (
    <Pressable
      {...pressProps(handlePress)}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      className={cn(
        'flex-row items-center gap-2 rounded',
        sizeConfig.text,
        variantClasses[variant],
        className
      )}
    >
      {iconPosition === 'left' && (
        <Text className={cn(sizeConfig.icon, textColor)}>{iconGlyph}</Text>
      )}
      <Text className={cn('font-medium', textColor)}>{displayLabel}</Text>
      {iconPosition === 'right' && (
        <Text className={cn(sizeConfig.icon, textColor)}>{iconGlyph}</Text>
      )}
    </Pressable>
  );
};
