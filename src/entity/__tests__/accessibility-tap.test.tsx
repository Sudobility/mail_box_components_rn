/**
 * Every control here is reachable by assistive technology, not only by a press.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a
 * touchable wired with `onPress` alone announces itself, takes focus, and then
 * does nothing. Every touchable in this package spreads `pressProps` from
 * `@sudobility/components-rn`, which returns both routes from one handler.
 *
 * The two exceptions are the panels inside `EntitySelector` and
 * `MemberRoleSelector`, which swallow a press so it does not reach the scrim
 * behind them. Those need the gesture an assistive activation does not carry,
 * and they are marked `no-a11y-tap` in the source.
 *
 * `accessibility-tap-guard.test.ts` is the structural half: it parses the
 * source, so a component added tomorrow is covered without a case here.
 */
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { EntityRole } from '@sudobility/types';
import { pressProps } from '../../index';
import { EntityCard } from '../EntityCard';
import { EntitySelector } from '../EntitySelector';
import { InvitationForm } from '../InvitationForm';
import { InvitationList } from '../InvitationList';
import { MemberList } from '../MemberList';
import { MemberRoleSelector } from '../MemberRoleSelector';
import {
  ada,
  bob,
  expired,
  invitation,
  organization,
  personal,
} from './fixtures';

/*
  Mocked the way this repo's other package suites mock it: jest's rootDir is
  this package, so the real library's own imports resolve outside the haste map
  and it cannot be loaded here. `pressProps` is written out rather than stubbed
  — a stub would let every wiring assertion below pass while nothing worked on
  a Mac — and the two tests under `pressProps` are what stop it drifting. The
  real implementation is proven in components-rn's own `a11y.test.ts`.
*/
jest.mock('../../index', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  pressProps: (onPress?: (e?: unknown) => unknown, disabled?: boolean) => ({
    onPress,
    onAccessibilityTap:
      !onPress || disabled ? undefined : () => onPress(undefined),
  }),
}));

/** See the note in components-rn's own accessibility-tap test. */
function touchableFor(element: ReactTestInstance): ReactTestInstance {
  let node: ReactTestInstance | null = element;
  while (node) {
    if (
      typeof node.type === 'string' &&
      typeof node.props.onStartShouldSetResponder === 'function'
    ) {
      return node;
    }
    node = node.parent;
  }
  throw new Error('no touchable found for the element under test');
}

/** Each control is exercised through both routes. */
const ROUTES: [string, (element: ReactTestInstance) => void][] = [
  ['a press', element => fireEvent.press(element)],
  ['an accessibility tap', element => fireEvent(element, 'accessibilityTap')],
];

describe('pressProps, as this package receives it', () => {
  it('returns both activation routes', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress);
    expect(props.onPress).toBe(onPress);
    props.onAccessibilityTap?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('withholds the tap when disabled', () => {
    expect(pressProps(jest.fn(), true).onAccessibilityTap).toBeUndefined();
  });
});

describe('EntityCard', () => {
  it.each(ROUTES)('runs its handler on %s', (_route, activate) => {
    const onPress = jest.fn();
    render(<EntityCard entity={organization} onPress={onPress} />);
    activate(screen.getByLabelText('Acme Corp, manager'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('offers neither route when it has no handler at all', () => {
    // A card with nothing to do reports itself disabled rather than pretending
    // to be a button.
    render(<EntityCard entity={organization} />);
    const card = screen.getByLabelText('Acme Corp, manager');
    expect(touchableFor(card).props.onAccessibilityTap).toBeUndefined();
    expect(card.props.accessibilityState.disabled).toBe(true);
  });
});

describe('MemberList remove control', () => {
  it.each(ROUTES)('runs its handler on %s', (_route, activate) => {
    const onRemove = jest.fn();
    render(
      <MemberList
        members={[ada, bob]}
        currentUserId='u1'
        canManage
        onRemove={onRemove}
      />
    );
    activate(screen.getByLabelText('Remove Bob'));
    expect(onRemove).toHaveBeenCalledWith('u2');
  });
});

describe('EntitySelector trigger', () => {
  const renderSelector = (isLoading = false) =>
    render(
      <EntitySelector
        entities={[personal, organization]}
        currentEntity={personal}
        onSelect={jest.fn()}
        isLoading={isLoading}
      />
    );

  it.each(ROUTES)('opens the list on %s', (_route, activate) => {
    renderSelector();
    activate(screen.getByLabelText('Workspace: Ada'));
    expect(screen.getByLabelText('Select Acme Corp')).toBeTruthy();
  });

  it('opens on neither while loading', () => {
    renderSelector(true);
    const trigger = screen.getByLabelText('Workspace: Ada');
    expect(touchableFor(trigger).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(trigger);
    fireEvent(trigger, 'accessibilityTap');
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
  });
});

describe('EntitySelector option', () => {
  it.each(ROUTES)('runs its handler on %s', (_route, activate) => {
    const onSelect = jest.fn();
    render(
      <EntitySelector
        entities={[personal, organization]}
        currentEntity={personal}
        onSelect={onSelect}
      />
    );
    fireEvent.press(screen.getByLabelText('Workspace: Ada'));
    activate(screen.getByLabelText('Select Acme Corp'));
    expect(onSelect).toHaveBeenCalledWith(organization);
  });
});

describe('MemberRoleSelector trigger', () => {
  it.each(ROUTES)('opens on %s', (_route, activate) => {
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={jest.fn()} />
    );
    activate(screen.getByLabelText('Role: Member'));
    expect(screen.getByLabelText('Cancel')).toBeTruthy();
  });

  it('opens on neither when disabled', () => {
    render(
      <MemberRoleSelector
        value={EntityRole.MEMBER}
        onChange={jest.fn()}
        disabled
      />
    );
    const trigger = screen.getByLabelText('Role: Member');
    expect(touchableFor(trigger).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(trigger);
    fireEvent(trigger, 'accessibilityTap');
    expect(screen.queryByLabelText('Cancel')).toBeNull();
  });
});

describe('MemberRoleSelector option', () => {
  it.each(ROUTES)('runs its handler on %s', (_route, activate) => {
    const onChange = jest.fn();
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={onChange} />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    activate(
      screen.getByLabelText('Manager: Can manage projects and API keys')
    );
    expect(onChange).toHaveBeenCalledWith(EntityRole.MANAGER);
  });
});

describe('InvitationList actions', () => {
  it.each(ROUTES)('cancels on %s', (_route, activate) => {
    const onCancel = jest.fn();
    render(<InvitationList invitations={[invitation()]} onCancel={onCancel} />);
    activate(screen.getByLabelText('Cancel invitation to new@example.com'));
    expect(onCancel).toHaveBeenCalledWith('inv-1');
  });

  it.each(ROUTES)('accepts on %s', (_route, activate) => {
    const onAccept = jest.fn();
    render(
      <InvitationList
        invitations={[invitation()]}
        mode='user'
        onAccept={onAccept}
      />
    );
    activate(screen.getByLabelText('Accept invitation to Acme Corp'));
    expect(onAccept).toHaveBeenCalledWith('tok-1');
  });

  it.each(ROUTES)('declines on %s', (_route, activate) => {
    const onDecline = jest.fn();
    render(
      <InvitationList
        invitations={[invitation()]}
        mode='user'
        onDecline={onDecline}
      />
    );
    activate(screen.getByLabelText('Decline invitation to Acme Corp'));
    expect(onDecline).toHaveBeenCalledWith('tok-1');
  });

  it('accepts an expired invitation on neither', () => {
    const onAccept = jest.fn();
    render(
      <InvitationList
        invitations={[expired()]}
        mode='user'
        onAccept={onAccept}
      />
    );
    const accept = screen.getByLabelText('Accept invitation to Acme Corp');
    expect(touchableFor(accept).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(accept);
    fireEvent(accept, 'accessibilityTap');
    expect(onAccept).not.toHaveBeenCalled();
  });
});

describe('InvitationForm submit', () => {
  it.each(ROUTES)('submits on %s', async (_route, activate) => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address'),
      'new@example.com'
    );
    activate(screen.getByLabelText('Send invitation'));
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'new@example.com',
      role: EntityRole.MEMBER,
    });
    // Let the form finish resetting before the test ends.
    await waitFor(() =>
      expect(screen.getByLabelText('Email address').props.value).toBe('')
    );
  });

  it('submits on neither with no email typed', () => {
    const onSubmit = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} />);
    const button = screen.getByLabelText('Send invitation');
    expect(touchableFor(button).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(button);
    fireEvent(button, 'accessibilityTap');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
