/**
 * Entity Components for React Native
 *
 * UI components for entity/organization management — the RN counterparts of
 * the web's `@sudobility/components/entity`, with the same names, the same
 * props (`onPress` for `onClick`) and the same data model: entities, members,
 * invitations and roles are the types in `@sudobility/types`.
 *
 * @example
 * ```tsx
 * import {
 *   EntitySelector,
 *   EntityList,
 *   MemberList,
 *   InvitationForm,
 * } from '@sudobility/components-rn/entity';
 *
 * function WorkspaceSwitcher() {
 *   return (
 *     <EntitySelector
 *       entities={entities}
 *       currentEntity={currentEntity}
 *       onSelect={handleSelect}
 *       onCreateNew={handleCreateNew}
 *     />
 *   );
 * }
 * ```
 */

// Components
export {
  EntityCard,
  type EntityCardProps,
  type EntityCardTrackingData,
} from './EntityCard';
export {
  EntityList,
  type EntityListProps,
  type EntityListTrackingData,
} from './EntityList';
export {
  EntitySelector,
  type EntitySelectorProps,
  type EntitySelectorTrackingData,
} from './EntitySelector';
export {
  MemberList,
  type MemberListProps,
  type MemberListTrackingData,
} from './MemberList';
export {
  MemberRoleSelector,
  type MemberRoleSelectorProps,
  type MemberRoleSelectorTrackingData,
} from './MemberRoleSelector';
export {
  InvitationForm,
  type InvitationFormProps,
  type InvitationFormTrackingData,
} from './InvitationForm';
export {
  InvitationList,
  type InvitationListProps,
  type InvitationListTrackingData,
} from './InvitationList';
export { RoleBadge, type RoleBadgeProps } from './RoleBadge';
