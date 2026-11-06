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

  it('opens the drill-in on the master by default', () => {
    render(<MasterDetailLayout master={<Master />} detail={<Detail />} />);
    layout(390);
    expect(screen.getByText('narrow')).toBeTruthy();
    expect(screen.queryByText('detail-body')).toBeNull();
  });

  it('opens the drill-in on the detail when it was the focused column, Back returning to the master', () => {
    render(
      <MasterDetailLayout
        master={<Master />}
        detail={<Detail />}
        detailFocused
      />
    );
    // Collapsing to one column lands on the detail, not the list: the reader
    // who was reading it in the wide layout stays on it (a rotation to
    // portrait, the iPhone Duo folded).
    layout(390);
    expect(screen.getByText('detail-body')).toBeTruthy();
    // The master is still beneath it, so Back returns to the list.
    fireEvent.press(screen.getByText('detail-body'));
    expect(screen.queryByText('detail-body')).toBeNull();
    expect(screen.getByText('narrow')).toBeTruthy();
  });

  it('reports drilling in and back, but not the initial mount', () => {
    const calls: boolean[] = [];
    render(
      <MasterDetailLayout
        master={<Master />}
        detail={<Detail />}
        onDetailFocusedChange={focused => calls.push(focused)}
      />
    );
    layout(390);
    // The initial mount is not reported — the parent already knows from
    // `detailFocused` what it seeded.
    expect(calls).toEqual([]);
    // A drill-in reports the detail is focused...
    fireEvent.press(screen.getByText('open'));
    expect(calls[calls.length - 1]).toBe(true);
    // ...and the way back reports the master.
    fireEvent.press(screen.getByText('detail-body'));
    expect(calls[calls.length - 1]).toBe(false);
  });
});
