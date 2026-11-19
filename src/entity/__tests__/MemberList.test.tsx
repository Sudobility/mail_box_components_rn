import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntityRole } from '@sudobility/types';
import { MemberList } from '../MemberList';
import { ada, bob } from './fixtures';

describe('MemberList', () => {
  it('renders each member by name and email, marking the current user', () => {
    render(<MemberList members={[ada, bob]} currentUserId='u1' />);
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('ada@example.com')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.getAllByText('(you)')).toHaveLength(1);
  });

  it('falls back to the email, then to "Unknown user"', () => {
    render(
      <MemberList
        members={[
          {
            ...bob,
            user: { id: 'u2', email: 'bob@example.com', displayName: null },
          },
          { ...bob, id: 'm3', userId: 'u3', user: undefined },
        ]}
      />
    );
    expect(screen.getAllByText('bob@example.com')).toHaveLength(2);
    expect(screen.getByText('Unknown user')).toBeTruthy();
  });

  it('shows the default empty message', () => {
    render(<MemberList members={[]} />);
    expect(screen.getByText('No members found')).toBeTruthy();
  });

  it('shows placeholders instead of the members while loading', () => {
    render(<MemberList members={[ada]} isLoading />);
    expect(screen.getByLabelText('Loading members')).toBeTruthy();
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
  });

  it('shows role badges and no controls to someone who cannot manage', () => {
    render(
      <MemberList
        members={[ada, bob]}
        currentUserId='u2'
        onRoleChange={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    expect(screen.getByText('owner')).toBeTruthy();
    expect(screen.getByText('member')).toBeTruthy();
    expect(screen.queryByLabelText('Role: Owner')).toBeNull();
    expect(screen.queryByLabelText('Remove Ada Lovelace')).toBeNull();
  });

  it('gives a manager controls for everyone but themselves', () => {
    render(
      <MemberList
        members={[ada, bob]}
        currentUserId='u1'
        canManage
        onRoleChange={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    // Own row: a badge, no remove.
    expect(screen.getByText('owner')).toBeTruthy();
    expect(screen.queryByLabelText('Remove Ada Lovelace')).toBeNull();
    // Bob's row: a role selector and a remove control.
    expect(screen.getByLabelText('Role: Member')).toBeTruthy();
    expect(screen.getByLabelText('Remove Bob')).toBeTruthy();
  });

  it('changes a role by the member’s user id, as the web does', () => {
    const onRoleChange = jest.fn();
    const onTrack = jest.fn();
    render(
      <MemberList
        members={[ada, bob]}
        currentUserId='u1'
        canManage
        onRoleChange={onRoleChange}
        onTrack={onTrack}
      />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    fireEvent.press(
      screen.getByLabelText('Manager: Can manage projects and API keys')
    );
    expect(onRoleChange).toHaveBeenCalledWith('u2', EntityRole.MANAGER);
    expect(onTrack).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'role_change' })
    );
  });

  it('removes by the member’s user id', () => {
    const onRemove = jest.fn();
    const onTrack = jest.fn();
    render(
      <MemberList
        members={[ada, bob]}
        currentUserId='u1'
        canManage
        onRemove={onRemove}
        onTrack={onTrack}
      />
    );
    fireEvent.press(screen.getByLabelText('Remove Bob'));
    expect(onRemove).toHaveBeenCalledWith('u2');
    expect(onTrack).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'remove' })
    );
  });
});
