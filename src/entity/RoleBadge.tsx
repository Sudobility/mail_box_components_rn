import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@sudobility/design';
import type { EntityRole } from '@sudobility/types';
import { cn } from '../index';

/**
 * The design system's badge tones, as the web's entity components use them:
 * owner in the warning tone, manager in the primary tone, member in the
 * neutral one.
 */
const badge = colors.component.badge;
const roleBadgeStyles: Record<EntityRole, string> = {
  owner: `${badge.warning.base} ${badge.warning.dark}`,
  manager: `${badge.primary.base} ${badge.primary.dark}`,
  member: `${badge.default.base} ${badge.default.dark}`,
};

/**
 * A badge tone is one class string on the web, where a `<span>` takes both its
 * background and its text colour. Here the background belongs to the `View`
 * and the colour to the `Text`, so the string is split by what each class sets.
 */
export function splitBadgeClasses(classes: string): {
  box: string;
  text: string;
} {
  const tokens = classes.split(/\s+/).filter(Boolean);
  const isText = (token: string) => /^(?:[a-z-]+:)*text-/.test(token);
  return {
    box: tokens.filter(token => !isText(token)).join(' '),
    text: tokens.filter(isText).join(' '),
  };
}

/** The badge tone for a role; an unknown role reads as a member. */
export function roleBadgeClasses(role: EntityRole | string): {
  box: string;
  text: string;
} {
  return splitBadgeClasses(
    roleBadgeStyles[role as EntityRole] ?? roleBadgeStyles.member
  );
}

export interface RoleBadgeProps {
  role: EntityRole | string;
  /** Extra classes for the pill, e.g. its padding. */
  className?: string;
}

/** The pill naming a role. */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const tone = roleBadgeClasses(role);
  return (
    <View className={cn('rounded-full px-2 py-0.5', tone.box, className)}>
      <Text className={cn('text-xs font-medium', tone.text)}>{role}</Text>
    </View>
  );
};
