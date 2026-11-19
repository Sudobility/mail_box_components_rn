import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { EntityRole } from '@sudobility/types';
import { InvitationForm } from '../InvitationForm';

const type = (text: string) =>
  fireEvent.changeText(screen.getByLabelText('Email address'), text);
const submit = () => fireEvent.press(screen.getByLabelText('Send invitation'));

describe('InvitationForm', () => {
  it('renders the email field, the role and the invite button', () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText('Enter email address')).toBeTruthy();
    expect(screen.getByLabelText('Role: Member')).toBeTruthy();
    expect(screen.getByText('Invite')).toBeTruthy();
  });

  it('starts from the default role it is given', () => {
    render(
      <InvitationForm onSubmit={jest.fn()} defaultRole={EntityRole.MANAGER} />
    );
    expect(screen.getByLabelText('Role: Manager')).toBeTruthy();
  });

  it('disables the button until an email is typed', () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    expect(
      screen.getByLabelText('Send invitation').props.accessibilityState
    ).toEqual(expect.objectContaining({ disabled: true }));
    type('a@b.co');
    expect(
      screen.getByLabelText('Send invitation').props.accessibilityState
    ).toEqual(expect.objectContaining({ disabled: false }));
  });

  it('rejects a malformed email without submitting', async () => {
    const onSubmit = jest.fn();
    const onTrack = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} onTrack={onTrack} />);
    type('not-an-email');
    submit();
    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeTruthy()
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onTrack).not.toHaveBeenCalled();
  });

  it('submits the trimmed email with the chosen role, then resets', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onTrack = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} onTrack={onTrack} />);
    type('  new@example.com ');
    fireEvent.press(screen.getByLabelText('Role: Member'));
    fireEvent.press(
      screen.getByLabelText('Manager: Can manage projects and API keys')
    );
    submit();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'new@example.com',
        role: EntityRole.MANAGER,
      })
    );
    expect(onTrack).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'submit' })
    );
    await waitFor(() =>
      expect(screen.getByLabelText('Email address').props.value).toBe('')
    );
    expect(screen.getByLabelText('Role: Member')).toBeTruthy();
  });

  it('shows why a send failed and keeps what was typed', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Already a member'));
    render(<InvitationForm onSubmit={onSubmit} />);
    type('bob@example.com');
    submit();
    await waitFor(() =>
      expect(screen.getByText('Already a member')).toBeTruthy()
    );
    expect(screen.getByLabelText('Email address').props.value).toBe(
      'bob@example.com'
    );
  });

  it('falls back to a generic message when the failure has none', async () => {
    const onSubmit = jest.fn().mockRejectedValue({});
    render(<InvitationForm onSubmit={onSubmit} />);
    type('bob@example.com');
    submit();
    await waitFor(() =>
      expect(screen.getByText('Failed to send invitation')).toBeTruthy()
    );
  });

  it('locks the form while a send is in progress', () => {
    render(<InvitationForm onSubmit={jest.fn()} isSubmitting />);
    expect(screen.getByLabelText('Email address').props.editable).toBe(false);
    expect(
      screen.getByLabelText('Send invitation').props.accessibilityState
    ).toEqual(expect.objectContaining({ disabled: true, busy: true }));
  });
});
