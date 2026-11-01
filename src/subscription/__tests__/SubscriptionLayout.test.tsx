import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SubscriptionLayout } from '../SubscriptionLayout';

describe('SubscriptionLayout', () => {
  it('renders children (title is accepted but not rendered as a heading)', () => {
    render(
      <SubscriptionLayout title='Choose a Plan'>
        <Text>Child content</Text>
      </SubscriptionLayout>
    );

    // The web-mirrored layout does not render the title as a heading.
    expect(screen.queryByText('Choose a Plan')).toBeNull();
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <SubscriptionLayout title='Plans' error='Something went wrong'>
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('does not display error section when error is null', () => {
    render(
      <SubscriptionLayout title='Plans' error={null}>
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('renders primary and secondary action buttons in selection variant', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        primaryAction={{ label: 'Subscribe Now', onClick: onPrimary }}
        secondaryAction={{ label: 'Restore', onClick: onSecondary }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Subscribe Now')).toBeTruthy();
    expect(screen.getByText('Restore')).toBeTruthy();

    fireEvent.press(screen.getByText('Subscribe Now'));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText('Restore'));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('does not render action buttons in cta variant', () => {
    const onPrimary = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='cta'
        primaryAction={{ label: 'Subscribe Now', onClick: onPrimary }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.queryByText('Subscribe Now')).toBeNull();
  });

  it('renders active subscription status', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{
          isActive: true,
          activeContent: {
            title: 'Pro Subscription',
            fields: [
              { label: 'Plan', value: 'Pro' },
              { label: 'Expires', value: 'Jan 1, 2027' },
            ],
          },
        }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Pro Subscription')).toBeTruthy();
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Pro')).toBeTruthy();
    expect(screen.getByText('Expires')).toBeTruthy();
    expect(screen.getByText('Jan 1, 2027')).toBeTruthy();
  });

  it('renders inactive subscription status', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{
          isActive: false,
          inactiveContent: {
            title: 'No Subscription',
            message: 'Subscribe to unlock features',
          },
        }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('No Subscription')).toBeTruthy();
    expect(screen.getByText('Subscribe to unlock features')).toBeTruthy();
  });

  it('renders custom currentStatusLabel', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{ isActive: false }}
        currentStatusLabel='Your Status'
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Your Status')).toBeTruthy();
  });

  it('renders free tile in cta variant when freeTileConfig is provided', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        variant='cta'
        freeTileConfig={{
          title: 'Free',
          price: '$0',
          features: ['Basic access'],
          ctaButton: { label: 'Get Started', onClick: jest.fn() },
        }}
      >
        <Text>Paid tiles</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('$0')).toBeTruthy();
    expect(screen.getByText('Basic access')).toBeTruthy();
    expect(screen.getByText('Get Started')).toBeTruthy();
  });

  it('does not render free tile in selection variant', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        freeTileConfig={{
          title: 'Free',
          price: '$0',
          features: ['Basic access'],
          ctaButton: { label: 'Get Started', onClick: jest.fn() },
        }}
      >
        <Text>Paid tiles</Text>
      </SubscriptionLayout>
    );

    // The free tile won't appear since it's selection variant
    expect(screen.queryByText('$0')).toBeNull();
  });

  it('renders header and footer content', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        headerContent={<Text>Header info</Text>}
        footerContent={<Text>Footer info</Text>}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Header info')).toBeTruthy();
    expect(screen.getByText('Footer info')).toBeTruthy();
  });

  it('renders aboveProducts content', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        aboveProducts={<Text>Billing period selector</Text>}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Billing period selector')).toBeTruthy();
  });

  it('calls onTrack when primary action is pressed', () => {
    const onTrack = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        primaryAction={{ label: 'Go', onClick: jest.fn() }}
        onTrack={onTrack}
        trackingLabel='sub_layout'
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    fireEvent.press(screen.getByText('Go'));
    expect(onTrack).toHaveBeenCalledWith({
      action: 'primary_action',
      trackingLabel: 'sub_layout',
      componentName: 'SubscriptionLayout',
    });
  });
});
