import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors } from '@sudobility/design';
import { EntityRole, type InviteMemberRequest } from '@sudobility/types';
import { cn, pressProps } from '../index';
import { MemberRoleSelector } from './MemberRoleSelector';
import { EnvelopeIcon, PaperAirplaneIcon } from './icons';

/** Tracking data for InvitationForm actions */
export interface InvitationFormTrackingData {
  action: 'submit';
  trackingLabel?: string;
  componentName?: string;
}

export interface InvitationFormProps {
  /** Submit handler; a rejection is shown as the form's error */
  onSubmit: (request: InviteMemberRequest) => Promise<void>;
  /** Whether submission is in progress */
  isSubmitting?: boolean;
  /** Default role for new invitations */
  defaultRole?: EntityRole;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: InvitationFormTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/** Validate email format */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * InvitationForm - Email, role and a send button, for inviting a member.
 *
 * RN counterpart of the web's `InvitationForm`: the same validation and the
 * same messages, with a failed send shown inline under the fields. The web
 * lays the three controls out in one row; a phone has no room for that, so the
 * email field takes a row of its own.
 */
export const InvitationForm: React.FC<InvitationFormProps> = ({
  onSubmit,
  isSubmitting = false,
  defaultRole = EntityRole.MEMBER,
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'InvitationForm',
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<EntityRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);

  const cannotSubmit = isSubmitting || !email.trim();

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    onTrack?.({ action: 'submit', trackingLabel, componentName });

    try {
      await onSubmit({ email: email.trim(), role });
      setEmail('');
      setRole(defaultRole);
    } catch (err) {
      setError(
        (err as { message?: string } | null)?.message ||
          'Failed to send invitation'
      );
    }
  };

  return (
    <View className={cn('gap-3', className)} style={style} testID={testID}>
      {/* Email Input */}
      <View
        className={cn(
          'flex-row items-center gap-2 rounded-lg border bg-background px-3',
          error ? 'border-destructive' : 'border-border',
          isSubmitting && 'opacity-50'
        )}
      >
        <EnvelopeIcon size={16} className='text-muted-foreground' />
        <TextInput
          value={email}
          /* Android's fullscreen extract mode off — the package rule; see
             `lib/text-input.ts`. */
          disableFullscreenUI
          onChangeText={setEmail}
          placeholder='Enter email address'
          placeholderTextColor={colors.raw.neutral[400]}
          editable={!isSubmitting}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='email'
          returnKeyType='send'
          onSubmitEditing={handleSubmit}
          className='flex-1 py-2 text-sm text-foreground'
          accessibilityLabel='Email address'
        />
      </View>

      <View className='flex-row items-center justify-between gap-2'>
        {/* Role Selector */}
        <MemberRoleSelector
          value={role}
          onChange={setRole}
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <Pressable
          {...pressProps(handleSubmit, cannotSubmit)}
          disabled={cannotSubmit}
          className={cn(
            'flex-row items-center gap-2 rounded-lg bg-primary px-4 py-2 active:opacity-80',
            cannotSubmit && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Send invitation'
          accessibilityState={{ disabled: cannotSubmit, busy: isSubmitting }}
        >
          {isSubmitting ? (
            <ActivityIndicator size='small' />
          ) : (
            <PaperAirplaneIcon size={16} className='text-primary-foreground' />
          )}
          <Text className='text-sm font-medium text-primary-foreground'>
            Invite
          </Text>
        </Pressable>
      </View>

      {/* Error Message */}
      {error ? (
        <Text className='text-sm text-destructive' accessibilityRole='alert'>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default InvitationForm;
