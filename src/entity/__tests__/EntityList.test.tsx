import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntityList } from '../EntityList';
import { organization, personal } from './fixtures';

describe('EntityList', () => {
  it('renders a card per entity', () => {
    render(<EntityList entities={[personal, organization]} />);
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(screen.getByText('Acme Corp')).toBeTruthy();
  });

  it('shows the default empty message', () => {
    render(<EntityList entities={[]} />);
    expect(screen.getByText('No workspaces found')).toBeTruthy();
  });

  it('shows a custom empty message', () => {
    render(<EntityList entities={[]} emptyMessage='Nothing here' />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  it('shows placeholders instead of the entities while loading', () => {
    render(<EntityList entities={[organization]} isLoading />);
    expect(screen.getByLabelText('Loading workspaces')).toBeTruthy();
    expect(screen.queryByText('Acme Corp')).toBeNull();
  });

  it('selects an entity and tracks the selection', () => {
    const onSelect = jest.fn();
    const onTrack = jest.fn();
    render(
      <EntityList
        entities={[organization]}
        onSelect={onSelect}
        onTrack={onTrack}
      />
    );
    fireEvent.press(screen.getByLabelText('Acme Corp, manager'));
    expect(onSelect).toHaveBeenCalledWith(organization);
    expect(onTrack).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'select', componentName: 'EntityList' })
    );
  });

  it('marks the entity whose slug is selected', () => {
    render(
      <EntityList
        entities={[personal, organization]}
        selectedSlug='acme'
        onSelect={jest.fn()}
      />
    );
    expect(
      screen.getByLabelText('Acme Corp, manager').props.accessibilityState
        .selected
    ).toBe(true);
    expect(
      screen.getByLabelText('Ada, owner').props.accessibilityState.selected
    ).toBe(false);
  });
});
