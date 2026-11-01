import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SegmentedControl } from '../SegmentedControl';

const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

describe('SegmentedControl', () => {
  it('renders all options', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value='monthly' onChange={onChange} />
    );

    expect(screen.getByText('Monthly')).toBeTruthy();
    expect(screen.getByText('Yearly')).toBeTruthy();
  });

  it('marks the selected option with accessibilityState.selected', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value='monthly' onChange={onChange} />
    );

    const tabs = screen.getAllByRole('radio');
    expect(tabs[0].props.accessibilityState.selected).toBe(true);
    expect(tabs[1].props.accessibilityState.selected).toBe(false);
  });

  it('calls onChange when an unselected option is pressed', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value='monthly' onChange={onChange} />
    );

    fireEvent.press(screen.getByText('Yearly'));
    expect(onChange).toHaveBeenCalledWith('yearly');
  });

  it('does not call onChange when the entire control is disabled', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={options}
        value='monthly'
        onChange={onChange}
        disabled
      />
    );

    fireEvent.press(screen.getByText('Yearly'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
