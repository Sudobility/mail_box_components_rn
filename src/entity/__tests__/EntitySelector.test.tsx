import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntitySelector } from '../EntitySelector';
import { organization, personal } from './fixtures';

const entities = [personal, organization];

describe('EntitySelector', () => {
  it('shows the current entity on the trigger', () => {
    render(
      <EntitySelector
        entities={entities}
        currentEntity={organization}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Workspace: Acme Corp')).toBeTruthy();
    expect(screen.getByText('Acme Corp')).toBeTruthy();
  });

  it('asks for a workspace when there is no current entity', () => {
    render(
      <EntitySelector
        entities={entities}
        currentEntity={null}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText('Select workspace')).toBeTruthy();
  });

  it('lists every entity once opened, and selects one', () => {
    const onSelect = jest.fn();
    const onTrack = jest.fn();
    render(
      <EntitySelector
        entities={entities}
        currentEntity={personal}
        onSelect={onSelect}
        onTrack={onTrack}
      />
    );
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
    fireEvent.press(screen.getByLabelText('Workspace: Ada'));
    expect(screen.getByLabelText('Select Ada')).toBeTruthy();
    expect(
      screen.getByLabelText('Select Ada').props.accessibilityState.selected
    ).toBe(true);

    fireEvent.press(screen.getByLabelText('Select Acme Corp'));
    expect(onSelect).toHaveBeenCalledWith(organization);
    expect(onTrack.mock.calls.map(call => call[0].action)).toEqual([
      'toggle',
      'select',
    ]);
    // Selecting closes the menu.
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
  });

  it('offers "Create organization" only when it can create one', () => {
    const onCreateNew = jest.fn();
    const { rerender } = render(
      <EntitySelector
        entities={entities}
        currentEntity={personal}
        onSelect={jest.fn()}
      />
    );
    fireEvent.press(screen.getByLabelText('Workspace: Ada'));
    expect(screen.queryByText('Create organization')).toBeNull();

    rerender(
      <EntitySelector
        entities={entities}
        currentEntity={personal}
        onSelect={jest.fn()}
        onCreateNew={onCreateNew}
      />
    );
    fireEvent.press(screen.getByText('Create organization'));
    expect(onCreateNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Create organization')).toBeNull();
  });

  it('does not open while loading', () => {
    render(
      <EntitySelector
        entities={entities}
        currentEntity={personal}
        onSelect={jest.fn()}
        isLoading
      />
    );
    fireEvent.press(screen.getByLabelText('Workspace: Ada'));
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
  });

  it('closes on Cancel without selecting', () => {
    const onSelect = jest.fn();
    render(
      <EntitySelector
        entities={entities}
        currentEntity={personal}
        onSelect={onSelect}
      />
    );
    fireEvent.press(screen.getByLabelText('Workspace: Ada'));
    fireEvent.press(screen.getByLabelText('Cancel'));
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
