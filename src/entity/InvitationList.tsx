import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { EntityInvitation } from '@sudobility/types';
import { cn, pressProps } from '../index';
import { RoleBadge } from './RoleBadge';
import {
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  XCircleIcon,
  XMarkIcon,
} from './icons';

/** Tracking data for InvitationList actions */
export interface InvitationListTrackingData {
  action: 'cancel' | 'accept' | 'decline';
  trackingLabel?: string;
  componentName?: string;
}

export interface InvitationListProps {
  /** Invitations to display; only pending ones are shown */
  invitations: EntityInvitation[];
  /** Mode: 'admin' for managing sent invitations, 'user' for viewing received */
  mode?: 'admin' | 'user';
  /** Cancel invitation handler (admin mode); receives the invitation id */
  onCancel?: (invitationId: string) => void;
  /** Accept invitation handler (user mode); receives the token */
  onAccept?: (token: string) => void;
  /** Decline invitation handler (user mode); receives the token */
  onDecline?: (token: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: InvitationListTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * InvitationList - Pending invitations as one bordered, divided list. In
 * `user` mode each row names the organization and offers Accept / Decline; in
 * `admin` mode it names the invited email and offers a cancel.
 *
 * RN counterpart of the web's `InvitationList`. A plain column, not a
 * scroller: the host page scrolls, as on the web.
 */
export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  mode = 'admin',
  onCancel,
  onAccept,
  onDecline,
  isLoading = false,
  emptyMessage = 'No pending invitations',
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'InvitationList',
}) => {
  // Filter to only pending invitations
  const pendingInvitations = invitations.filter(
    inv => inv.status === 'pending'
  );

  if (isLoading) {
    return (
      <View
        className={cn('gap-2', className)}
        style={style}
        testID={testID}
        accessible
        accessibilityRole='progressbar'
        accessibilityLabel='Loading invitations'
      >
        {[1, 2].map(i => (
          <View
            key={i}
            className='h-16 rounded-lg border border-border bg-muted'
          />
        ))}
      </View>
    );
  }

  if (pendingInvitations.length === 0) {
    return (
      <View className={cn('py-8', className)} style={style} testID={testID}>
        <Text className='text-center text-base text-muted-foreground'>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  const handleCancel = (invitationId: string) => {
    onTrack?.({ action: 'cancel', trackingLabel, componentName });
    onCancel?.(invitationId);
  };

  const handleAccept = (token: string) => {
    onTrack?.({ action: 'accept', trackingLabel, componentName });
    onAccept?.(token);
  };

  const handleDecline = (token: string) => {
    onTrack?.({ action: 'decline', trackingLabel, componentName });
    onDecline?.(token);
  };

  return (
    <View
      className={cn(
        'overflow-hidden rounded-lg border border-border',
        className
      )}
      style={style}
      testID={testID}
    >
      {pendingInvitations.map((invitation, index) => (
        <InvitationRow
          key={invitation.id}
          invitation={invitation}
          first={index === 0}
          mode={mode}
          onCancel={onCancel ? handleCancel : undefined}
          onAccept={onAccept ? handleAccept : undefined}
          onDecline={onDecline ? handleDecline : undefined}
        />
      ))}
    </View>
  );
};

interface InvitationRowProps {
  invitation: EntityInvitation;
  first: boolean;
  mode: 'admin' | 'user';
  onCancel?: (invitationId: string) => void;
  onAccept?: (token: string) => void;
  onDecline?: (token: string) => void;
}

const InvitationRow: React.FC<InvitationRowProps> = ({
  invitation,
  first,
  mode,
  onCancel,
  onAccept,
  onDecline,
}) => {
  const expiresAt = new Date(invitation.expiresAt);
  const isExpired = expiresAt.getTime() < Date.now();
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const name =
    mode === 'user' && invitation.entity
      ? invitation.entity.displayName
      : invitation.email;

  return (
    <View className={cn('gap-3 p-3', !first && 'border-t border-border')}>
      <View className='flex-row items-center gap-3'>
        {/* Icon */}
        <View className='h-10 w-10 items-center justify-center rounded-full bg-muted'>
          <EnvelopeIcon size={20} className='text-muted-foreground' />
        </View>

        {/* Info */}
        <View className='min-w-0 flex-1'>
          <View className='flex-row items-center gap-2'>
            <Text
              className='shrink text-base font-medium text-foreground'
              numberOfLines={1}
            >
              {name}
            </Text>
            <RoleBadge role={invitation.role} />
          </View>
          <View className='flex-row items-center gap-1.5'>
            <ClockIcon size={14} className='text-muted-foreground' />
            {isExpired ? (
              <Text className='text-sm text-destructive'>Expired</Text>
            ) : (
              <Text className='text-sm text-muted-foreground'>
                Expires in {daysUntilExpiry} days
              </Text>
            )}
          </View>
        </View>

        {/* Admin action */}
        {mode === 'admin' && onCancel ? (
          <Pressable
            {...pressProps(() => onCancel(invitation.id))}
            accessibilityRole='button'
            accessibilityLabel={`Cancel invitation to ${invitation.email}`}
            hitSlop={8}
            className='rounded p-1.5 active:bg-destructive/10'
          >
            <XCircleIcon size={18} className='text-muted-foreground' />
          </Pressable>
        ) : null}
      </View>

      {/* User actions: on a line of their own, so a long name keeps its room */}
      {mode === 'user' && (onDecline || onAccept) ? (
        <View className='flex-row items-center justify-end gap-2'>
          {onDecline ? (
            <Pressable
              {...pressProps(() => onDecline(invitation.token))}
              accessibilityRole='button'
              accessibilityLabel={`Decline invitation to ${name}`}
              className='flex-row items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 active:bg-muted'
            >
              <XMarkIcon size={16} className='text-foreground' />
              <Text className='text-sm text-foreground'>Decline</Text>
            </Pressable>
          ) : null}
          {onAccept ? (
            <Pressable
              {...pressProps(() => onAccept(invitation.token), isExpired)}
              disabled={isExpired}
              accessibilityRole='button'
              accessibilityLabel={`Accept invitation to ${name}`}
              accessibilityState={{ disabled: isExpired }}
              className={cn(
                'flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 active:opacity-80',
                isExpired && 'opacity-50'
              )}
            >
              <CheckIcon size={16} className='text-primary-foreground' />
              <Text className='text-sm text-primary-foreground'>Accept</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default InvitationList;
