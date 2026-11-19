import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntityRole } from '@sudobility/types';
import { MemberRoleSelector } from '../MemberRoleSelector';

describe('MemberRoleSelector', () => {
  it('shows the current role on the trigger', () => {
    render(
      <MemberRoleSelector value={EntityRole.MANAGER} onChange={jest.fn()} />
    );
    expect(screen.getByLabelText('Role: Manager')).toBeTruthy();
    expect(screen.getByText('Manager')).toBeTruthy();
  });

  it('offers the three roles the platform has, with what each grants', () => {
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    expect(screen.getByText('Roles')).toBeTruthy();
    expect(
      screen.getByLabelText('Owner: Full access to all settings and members')
    ).toBeTruthy();
    expect(
      screen.getByLabelText('Manager: Can manage projects and API keys')
    ).toBeTruthy();
    expect(screen.getByLabelText('Member: Read-only access')).toBeTruthy();
  });

  it('marks the current role as selected in the menu', () => {
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    expect(
      screen.getByLabelText('Member: Read-only access').props.accessibilityState
    ).toEqual(expect.objectContaining({ selected: true }));
    expect(
      screen.getByLabelText('Manager: Can manage projects and API keys').props
        .accessibilityState
    ).toEqual(expect.objectContaining({ selected: false }));
  });

  it('reports the chosen role, tracks it, and closes', () => {
    const onChange = jest.fn();
    const onTrack = jest.fn();
    render(
      <MemberRoleSelector
        value={EntityRole.MEMBER}
        onChange={onChange}
        onTrack={onTrack}
      />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    fireEvent.press(
      screen.getByLabelText('Manager: Can manage projects and API keys')
    );
    expect(onChange).toHaveBeenCalledWith(EntityRole.MANAGER);
    expect(onTrack.mock.calls.map(call => call[0].action)).toEqual([
      'toggle',
      'select',
    ]);
    expect(screen.queryByText('Roles')).toBeNull();
  });

  it('does not open when disabled', () => {
    const onTrack = jest.fn();
    render(
      <MemberRoleSelector
        value={EntityRole.MEMBER}
        onChange={jest.fn()}
        onTrack={onTrack}
        disabled
      />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    expect(screen.queryByText('Roles')).toBeNull();
    expect(onTrack).not.toHaveBeenCalled();
  });

  it('closes on Cancel without changing the role', () => {
    const onChange = jest.fn();
    render(
      <MemberRoleSelector value={EntityRole.MEMBER} onChange={onChange} />
    );
    fireEvent.press(screen.getByLabelText('Role: Member'));
    fireEvent.press(screen.getByLabelText('Cancel'));
    expect(screen.queryByText('Roles')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});
