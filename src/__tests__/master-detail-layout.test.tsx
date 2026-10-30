import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { MasterDetailLayout, useMasterDetail } from '../ui/MasterDetailLayout';

// A master list whose row drives the layout's drill-in, and reports the mode.
function Master() {
  const { isWide, showDetail } = useMasterDetail();
  return (
    <>
      <Text>{isWide ? 'wide' : 'narrow'}</Text>
      <Pressable accessibilityRole='button' onPress={showDetail}>
        <Text>open</Text>
      </Pressable>
    </>
  );
}

function Detail() {
  const { showMaster } = useMasterDetail();
  return (
    <Pressable accessibilityRole='button' onPress={showMaster}>
      <Text>detail-body</Text>
    </Pressable>
  );
}

const layout = (width: number) =>
  fireEvent(screen.getByTestId('master-detail'), 'layout', {
    nativeEvent: { layout: { width, height: 800, x: 0, y: 0 } },
  });

describe('MasterDetailLayout', () => {
  it('shows both columns before it is measured, with the master in wide mode', () => {
    render(<MasterDetailLayout master={<Master />} detail={<Detail />} />);
    // Two columns until measured: both panels on screen, selection not a drill-in.
    expect(screen.getByText('wide')).toBeTruthy();
    expect(screen.getByText('detail-body')).toBeTruthy();
  });

  it('keeps both columns when it is wider than the breakpoint', () => {
    render(<MasterDetailLayout master={<Master />} detail={<Detail />} />);
    layout(1024);
    expect(screen.getByText('wide')).toBeTruthy();
    expect(screen.getByText('detail-body')).toBeTruthy();
  });

  it('drills in when narrow: the master alone, the detail pushed on a row press, then back', () => {
    render(<MasterDetailLayout master={<Master />} detail={<Detail />} />);
    layout(390);
    // One column: the master, in narrow mode, and the detail not beside it.
    expect(screen.getByText('narrow')).toBeTruthy();
    expect(screen.queryByText('detail-body')).toBeNull();
    // A row press pushes the detail over the master.
    fireEvent.press(screen.getByText('open'));
    expect(screen.getByText('detail-body')).toBeTruthy();
    // Back returns to the master.
    fireEvent.press(screen.getByText('detail-body'));
    expect(screen.queryByText('detail-body')).toBeNull();
    expect(screen.getByText('narrow')).toBeTruthy();
  });
});
