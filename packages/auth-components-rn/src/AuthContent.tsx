/**
 * AuthContent - shared auth UI logic used by both Modal and Inline components
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants, colors } from '@sudobility/design';
import type { AuthContentProps, AuthMode, AuthTrackingData } from './types';
import { useAuthStatus } from './AuthProvider';
import { ProviderButtons } from './ProviderButtons';
import { EmailSignInForm } from './EmailSignInForm';
import { EmailSignUpForm } from './EmailSignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { pressProps } from '@sudobility/components-rn';

/** Extended props with tracking */
interface AuthContentPropsWithTracking extends AuthContentProps {
  /** Compact layout (less spacing) */
  compact?: boolean;
  /** Optional tracking callback */
  onTrack?: (data: AuthTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * Get title for current auth mode
 */
function getTitle(
  mode: AuthMode,
  texts: {
    signInTitle: string;
    signInWithEmail: string;
    createAccount: string;
    resetPassword: string;
  }
): string {
  switch (mode) {
    case 'select':
      return texts.signInTitle;
    case 'email-signin':
      return texts.signInWithEmail;
    case 'email-signup':
      return texts.createAccount;
    case 'forgot-password':
      return texts.resetPassword;
    default:
      return texts.signInTitle;
  }
}

/**
 * Back button with a glyph substitute for the web inline SVG chevron.
 */
const BackButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  // TODO: web used an inline SVG chevron; RN renders a glyph substitute.
  <Pressable
    {...pressProps(onPress)}
    className={cn('p-1 rounded active:opacity-80')}
    accessibilityRole='button'
    accessibilityLabel='Back'
  >
    <Text className={cn('text-xl text-muted-foreground', colors.component.alert.info.icon)}>
      {'‹'}
    </Text>
  </Pressable>
);

/**
 * AuthContent - shared auth UI logic used by both Modal and Inline components
 */
export const AuthContent: React.FC<AuthContentPropsWithTracking> = ({
  mode,
  onModeChange,
  providers,
  onSuccess,
  compact,
  onTrack,
  trackingLabel,
  componentName = 'AuthContent',
}) => {
  const { providerConfig, texts } = useAuthStatus();

  const handleModeChange = (newMode: AuthMode) => {
    onTrack?.({ action: 'switch_mode', trackingLabel, componentName });
    onModeChange(newMode);
  };

  const activeProviders = providers ?? providerConfig.providers;
  const title = getTitle(mode, texts);
  const spacing = compact ? 'gap-4' : 'gap-6';
  const titleClass = `${compact ? textVariants.heading.h5() : textVariants.heading.h4()}`;

  const header = (onBackPress?: () => void) =>
    onBackPress ? (
      <View className='flex-row items-center'>
        <BackButton onPress={onBackPress} />
        <Text className={cn(titleClass, 'flex-1 text-center mr-6')}>{title}</Text>
      </View>
    ) : (
      <Text className={cn(titleClass, 'text-center')}>{title}</Text>
    );

  // Provider selection view
  if (mode === 'select') {
    return (
      <View className={spacing}>
        {header()}
        <ProviderButtons
          providers={activeProviders}
          onEmailPress={() => handleModeChange('email-signin')}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </View>
    );
  }

  // Email sign-in form
  if (mode === 'email-signin') {
    return (
      <View className={spacing}>
        {header(() => handleModeChange('select'))}
        <EmailSignInForm
          onSwitchToSignUp={() => handleModeChange('email-signup')}
          onSwitchToForgotPassword={() => handleModeChange('forgot-password')}
          onSuccess={onSuccess}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </View>
    );
  }

  // Email sign-up form
  if (mode === 'email-signup') {
    return (
      <View className={spacing}>
        {header(() => handleModeChange('email-signin'))}
        <EmailSignUpForm
          onSwitchToSignIn={() => handleModeChange('email-signin')}
          onSuccess={onSuccess}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </View>
    );
  }

  // Forgot password form
  if (mode === 'forgot-password') {
    return (
      <View className={spacing}>
        {header(() => handleModeChange('email-signin'))}
        <ForgotPasswordForm
          onSwitchToSignIn={() => handleModeChange('email-signin')}
          onTrack={onTrack}
          trackingLabel={trackingLabel}
          componentName={componentName}
        />
      </View>
    );
  }

  return null;
};
