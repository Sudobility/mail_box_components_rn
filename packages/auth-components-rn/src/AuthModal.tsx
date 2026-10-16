/**
 * AuthModal - Modal dialog for authentication (React Native)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';
import type { AuthMode, AuthProviderType, AuthTrackingData } from './types';
import { useAuthStatus } from './AuthProvider';
import { AuthContent } from './AuthContent';
import { pressProps } from '@sudobility/components-rn';

export interface AuthModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Initial mode to show */
  initialMode?: AuthMode;
  /** Custom class name for modal container */
  className?: string;
  /** Custom class name for backdrop */
  backdropClassName?: string;
  /** Custom class name for content */
  contentClassName?: string;
  /** Close on backdrop press (default: true) */
  closeOnBackdropClick?: boolean;
  /** Close on hardware/escape (default: true) */
  closeOnEscape?: boolean;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Override which providers to show */
  providers?: AuthProviderType[];
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * AuthModal - Modal dialog for authentication.
 *
 * Note: unlike the web component, the RN context does not expose modal state,
 * so this is controlled-only via `open`/`onClose`.
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  initialMode = 'select',
  className,
  backdropClassName,
  contentClassName,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  headerContent,
  footerContent,
  providers,
  onTrack,
  trackingLabel,
  componentName = 'AuthModal',
}) => {
  const { texts, isAuthenticated, isAnonymous } = useAuthStatus();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const isOpen = open ?? false;

  const handleClose = useCallback(() => {
    // TODO: web emitted onTrack({ action: 'modal_close' }); 'modal_close' is not
    // part of the RN AuthTrackingData union, so close tracking is omitted here.
    onClose?.();
  }, [onClose]);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSuccess = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Don't show modal if already authenticated (non-anonymous)
  if (isAuthenticated && !isAnonymous) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={closeOnEscape ? handleClose : undefined}
    >
      <Pressable
        {...pressProps(closeOnBackdropClick ? handleClose : undefined)}
        className={cn(
          'flex-1 items-center justify-center px-4',
          // intentional: modal backdrop scrim
          'bg-black/50',
          backdropClassName
        )}
        accessibilityRole='button'
        accessibilityLabel={texts.close}
      >
        {/* Stop backdrop press from firing when pressing the content */}
        <Pressable
          onPress={() => {}}
          className={cn(
            'relative w-full max-w-md rounded-xl bg-background shadow-2xl',
            className
          )}
          accessibilityViewIsModal
        >
          {/* Close button */}
          <Pressable
            {...pressProps(handleClose)}
            className={cn('absolute top-4 right-4 p-1 rounded z-10 active:opacity-80')}
            accessibilityRole='button'
            accessibilityLabel={texts.close}
          >
            {/* TODO: web used an inline SVG X icon; RN renders a glyph substitute. */}
            <Text className={cn('text-lg text-muted-foreground', colors.component.alert.info.icon)}>
              {'✕'}
            </Text>
          </Pressable>

          <ScrollView keyboardShouldPersistTaps='handled'>
            {/* Header content */}
            {headerContent && <View className='px-6 pt-6'>{headerContent}</View>}

            {/* Auth content */}
            <View className={cn('p-6', contentClassName)}>
              <AuthContent
                mode={mode}
                onModeChange={setMode}
                providers={providers}
                onSuccess={handleSuccess}
                onTrack={onTrack}
                trackingLabel={trackingLabel}
                componentName={componentName}
              />
            </View>

            {/* Footer content */}
            {footerContent && <View className='px-6 pb-6'>{footerContent}</View>}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
