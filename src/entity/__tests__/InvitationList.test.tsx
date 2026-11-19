import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { InvitationStatus } from '@sudobility/types';
import { InvitationList } from '../InvitationList';
import { expired, invitation } from './fixtures';

describe('InvitationList', () => {
  it('shows only pending invitations', () => {
    render(
      <InvitationList
        invitations={[
          invitation(),
          invitation({
            id: 'inv-2',
            email: 'old@example.com',
            status: InvitationStatus.ACCEPTED,
          }),
        ]}
      />
    );
    expect(screen.getByText('new@example.com')).toBeTruthy();
    expect(screen.queryByText('old@example.com')).toBeNull();
  });

  it('shows the empty message when nothing is pending', () => {
    render(
      <InvitationList
        invitations={[invitation({ status: InvitationStatus.DECLINED })]}
      />
    );
    expect(screen.getByText('No pending invitations')).toBeTruthy();
  });

  it('shows placeholders while loading', () => {
    render(<InvitationList invitations={[invitation()]} isLoading />);
    expect(screen.getByLabelText('Loading invitations')).toBeTruthy();
    expect(screen.queryByText('new@example.com')).toBeNull();
  });

  it('shows the role and when the invitation expires', () => {
    render(<InvitationList invitations={[invitation()]} />);
    expect(screen.getByText('manager')).toBeTruthy();
    expect(screen.getByText('Expires in 3 days')).toBeTruthy();
  });

  describe('admin mode (the default)', () => {
    it('names the invited email and cancels by invitation id', () => {
      const onCancel = jest.fn();
      const onTrack = jest.fn();
      render(
        <InvitationList
          invitations={[invitation()]}
          onCancel={onCancel}
          onTrack={onTrack}
        />
      );
      expect(screen.getByText('new@example.com')).toBeTruthy();
      fireEvent.press(
        screen.getByLabelText('Cancel invitation to new@example.com')
      );
      expect(onCancel).toHaveBeenCalledWith('inv-1');
      expect(onTrack).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'cancel' })
      );
    });

    it('offers no accept or decline', () => {
      render(
        <InvitationList
          invitations={[invitation()]}
          onAccept={jest.fn()}
          onDecline={jest.fn()}
        />
      );
      expect(screen.queryByText('Accept')).toBeNull();
      expect(screen.queryByText('Decline')).toBeNull();
    });
  });

  describe('user mode', () => {
    it('names the organization and accepts or declines by token', () => {
      const onAccept = jest.fn();
      const onDecline = jest.fn();
      const onTrack = jest.fn();
      render(
        <InvitationList
          invitations={[invitation()]}
          mode='user'
          onAccept={onAccept}
          onDecline={onDecline}
          onTrack={onTrack}
        />
      );
      expect(screen.getByText('Acme Corp')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Accept invitation to Acme Corp'));
      expect(onAccept).toHaveBeenCalledWith('tok-1');
      fireEvent.press(screen.getByLabelText('Decline invitation to Acme Corp'));
      expect(onDecline).toHaveBeenCalledWith('tok-1');
      expect(onTrack.mock.calls.map(call => call[0].action)).toEqual([
        'accept',
        'decline',
      ]);
    });

    it('falls back to the email when the invitation carries no entity', () => {
      render(
        <InvitationList
          invitations={[invitation({ entity: undefined })]}
          mode='user'
          onAccept={jest.fn()}
        />
      );
      expect(screen.getByText('new@example.com')).toBeTruthy();
    });

    it('marks an expired invitation and does not let it be accepted', () => {
      const onAccept = jest.fn();
      const onDecline = jest.fn();
      render(
        <InvitationList
          invitations={[expired()]}
          mode='user'
          onAccept={onAccept}
          onDecline={onDecline}
        />
      );
      expect(screen.getByText('Expired')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Accept invitation to Acme Corp'));
      expect(onAccept).not.toHaveBeenCalled();
      // It can still be declined.
      fireEvent.press(screen.getByLabelText('Decline invitation to Acme Corp'));
      expect(onDecline).toHaveBeenCalledWith('tok-1');
    });

    it('offers no cancel', () => {
      render(
        <InvitationList
          invitations={[invitation()]}
          mode='user'
          onCancel={jest.fn()}
        />
      );
      expect(
        screen.queryByLabelText('Cancel invitation to new@example.com')
      ).toBeNull();
    });
  });
});
