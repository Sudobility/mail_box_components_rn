import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { EntityMember, EntityRole } from '@sudobility/types';
import { cn, pressProps } from '../index';
import { MemberRoleSelector } from './MemberRoleSelector';
import { RoleBadge } from './RoleBadge';
import { TrashIcon, UserIcon } from './icons';

/** Tracking data for MemberList actions */
export interface MemberListTrackingData {
  action: 'role_change' | 'remove';
  trackingLabel?: string;
  componentName?: string;
}

export interface MemberListProps {
  /** Members to display */
  members: EntityMember[];
  /** Current user's ID (to identify self) */
  currentUserId?: string;
  /** Whether current user can manage members */
  canManage?: boolean;
  /**
   * Role change handler. As on the web, `memberId` is the member's **user id**
   * (`member.userId`) — the API keys members by user.
   */
  onRoleChange?: (memberId: string, role: EntityRole) => void;
  /** Remove member handler; `memberId` is the member's user id, as above */
  onRemove?: (memberId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class names */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Optional tracking callback */
  onTrack?: (data: MemberListTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * MemberList - The members of an entity as one bordered, divided list: avatar,
 * name and email, then the role — a selector for someone who can manage it, a
 * badge otherwise — and a remove control.
 *
 * RN counterpart of the web's `MemberList`. A plain column, not a scroller:
 * the host page scrolls, as on the web.
 */
export const MemberList: React.FC<MemberListProps> = ({
  members,
  currentUserId,
  canManage = false,
  onRoleChange,
  onRemove,
  isLoading = false,
  emptyMessage = 'No members found',
  className,
  style,
  testID,
  onTrack,
  trackingLabel,
  componentName = 'MemberList',
}) => {
  if (isLoading) {
    return (
      <View
        className={cn('gap-2', className)}
        style={style}
        testID={testID}
        accessible
        accessibilityRole='progressbar'
        accessibilityLabel='Loading members'
      >
        {[1, 2, 3].map(i => (
          <View
            key={i}
            className='h-16 rounded-lg border border-border bg-muted'
          />
        ))}
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View className={cn('py-8', className)} style={style} testID={testID}>
        <Text className='text-center text-base text-muted-foreground'>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  const handleRoleChange = (memberId: string, role: EntityRole) => {
    onTrack?.({ action: 'role_change', trackingLabel, componentName });
    onRoleChange?.(memberId, role);
  };

  const handleRemove = (memberId: string) => {
    onTrack?.({ action: 'remove', trackingLabel, componentName });
    onRemove?.(memberId);
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
      {members.map((member, index) => (
        <MemberRow
          key={member.id}
          member={member}
          first={index === 0}
          isSelf={member.userId === currentUserId}
          canManage={canManage}
          onRoleChange={onRoleChange ? handleRoleChange : undefined}
          onRemove={onRemove ? handleRemove : undefined}
        />
      ))}
    </View>
  );
};

interface MemberRowProps {
  member: EntityMember;
  first: boolean;
  isSelf: boolean;
  canManage: boolean;
  onRoleChange?: (memberId: string, role: EntityRole) => void;
  onRemove?: (memberId: string) => void;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  first,
  isSelf,
  canManage,
  onRoleChange,
  onRemove,
}) => {
  const displayName =
    member.user?.displayName || member.user?.email || 'Unknown user';
  const email = member.user?.email;

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 p-3',
        !first && 'border-t border-border'
      )}
    >
      {/* Avatar */}
      <View className='h-10 w-10 items-center justify-center rounded-full bg-muted'>
        <UserIcon size={20} className='text-muted-foreground' />
      </View>

      {/* Info */}
      <View className='min-w-0 flex-1'>
        <View className='flex-row items-center gap-2'>
          <Text
            className='shrink text-base font-medium text-foreground'
            numberOfLines={1}
          >
            {displayName}
          </Text>
          {isSelf ? (
            <Text className='text-xs text-muted-foreground'>(you)</Text>
          ) : null}
        </View>
        {email ? (
          <Text className='text-sm text-muted-foreground' numberOfLines={1}>
            {email}
          </Text>
        ) : null}
      </View>

      {/* Role */}
      {canManage && onRoleChange && !isSelf ? (
        <MemberRoleSelector
          value={member.role}
          onChange={role => onRoleChange(member.userId, role)}
        />
      ) : (
        <RoleBadge role={member.role} className='py-1' />
      )}

      {/* Actions */}
      {canManage && onRemove && !isSelf ? (
        <Pressable
          {...pressProps(() => onRemove(member.userId))}
          accessibilityRole='button'
          accessibilityLabel={`Remove ${displayName}`}
          hitSlop={8}
          className='rounded p-1.5 active:bg-destructive/10'
        >
          <TrashIcon size={18} className='text-muted-foreground' />
        </Pressable>
      ) : null}
    </View>
  );
};

export default MemberList;
