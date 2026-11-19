import {
  EntityRole,
  EntityType,
  InvitationStatus,
  type EntityInvitation,
  type EntityMember,
  type EntityWithRole,
} from '@sudobility/types';

const STAMP = '2026-01-01T00:00:00.000Z';
const DAY = 24 * 60 * 60 * 1000;

export const personal: EntityWithRole = {
  id: 'p1',
  entitySlug: 'ada',
  entityType: EntityType.PERSONAL,
  displayName: 'Ada',
  description: null,
  avatarUrl: null,
  createdAt: STAMP,
  updatedAt: STAMP,
  userRole: EntityRole.OWNER,
};

export const organization: EntityWithRole = {
  id: 'o1',
  entitySlug: 'acme',
  entityType: EntityType.ORGANIZATION,
  displayName: 'Acme Corp',
  description: 'A test organization',
  avatarUrl: null,
  createdAt: STAMP,
  updatedAt: STAMP,
  userRole: EntityRole.MANAGER,
};

export const ada: EntityMember = {
  id: 'm1',
  entityId: 'o1',
  userId: 'u1',
  role: EntityRole.OWNER,
  isActive: true,
  joinedAt: STAMP,
  createdAt: STAMP,
  updatedAt: STAMP,
  user: { id: 'u1', email: 'ada@example.com', displayName: 'Ada Lovelace' },
};

export const bob: EntityMember = {
  id: 'm2',
  entityId: 'o1',
  userId: 'u2',
  role: EntityRole.MEMBER,
  isActive: true,
  joinedAt: STAMP,
  createdAt: STAMP,
  updatedAt: STAMP,
  user: { id: 'u2', email: 'bob@example.com', displayName: 'Bob' },
};

/** A pending invitation that expires in three days, unless overridden. */
export function invitation(
  over: Partial<EntityInvitation> = {}
): EntityInvitation {
  return {
    id: 'inv-1',
    entityId: 'o1',
    email: 'new@example.com',
    role: EntityRole.MANAGER,
    status: InvitationStatus.PENDING,
    invitedByUserId: 'u1',
    token: 'tok-1',
    expiresAt: new Date(Date.now() + 3 * DAY - 1000).toISOString(),
    acceptedAt: null,
    createdAt: STAMP,
    updatedAt: STAMP,
    entity: organization,
    ...over,
  };
}

export const expired = () =>
  invitation({ expiresAt: new Date(Date.now() - DAY).toISOString() });
