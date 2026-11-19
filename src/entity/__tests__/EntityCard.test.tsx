import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntityCard } from '../EntityCard';
import { organization, personal } from './fixtures';

describe('EntityCard', () => {
  it('renders the name, the role and the workspace type', () => {
    render(<EntityCard entity={organization} />);
    expect(screen.getByText('Acme Corp')).toBeTruthy();
    expect(screen.getByText('manager')).toBeTruthy();
    expect(screen.getByText('Organization')).toBeTruthy();
  });

  it('labels a personal entity as a personal workspace', () => {
    render(<EntityCard entity={personal} />);
    expect(screen.getByText('Personal workspace')).toBeTruthy();
    expect(screen.getByText('owner')).toBeTruthy();
  });

  it('renders the description when there is one', () => {
    render(<EntityCard entity={organization} />);
    expect(screen.getByText('A test organization')).toBeTruthy();
  });

  it('renders no description line when there is none', () => {
    render(<EntityCard entity={personal} />);
    expect(screen.queryByText('A test organization')).toBeNull();
  });

  it('calls onPress and reports the click to onTrack', () => {
    const onPress = jest.fn();
    const onTrack = jest.fn();
    render(
      <EntityCard
        entity={organization}
        onPress={onPress}
        onTrack={onTrack}
        trackingLabel='list'
      />
    );
    fireEvent.press(screen.getByLabelText('Acme Corp, manager'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onTrack).toHaveBeenCalledWith({
      action: 'click',
      trackingLabel: 'list',
      componentName: 'EntityCard',
    });
  });

  it('is not a button, and tracks nothing, without onPress', () => {
    const onTrack = jest.fn();
    render(<EntityCard entity={organization} onTrack={onTrack} />);
    const card = screen.getByLabelText('Acme Corp, manager');
    expect(card.props.accessibilityRole).toBeUndefined();
    expect(card.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
    fireEvent.press(card);
    expect(onTrack).not.toHaveBeenCalled();
  });

  it('reports itself selected', () => {
    render(<EntityCard entity={organization} isSelected onPress={jest.fn()} />);
    expect(
      screen.getByLabelText('Acme Corp, manager').props.accessibilityState
    ).toEqual(expect.objectContaining({ selected: true }));
  });
});
