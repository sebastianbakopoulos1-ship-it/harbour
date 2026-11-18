import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import { Button, EmptyState, ErrorState, TextField, Toggle } from '@/components/ui';

describe('<Button />', () => {
  test('calls onPress and exposes a button role with its label', async () => {
    const onPress = jest.fn();
    await render(<Button label="Renew" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Renew' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does nothing while disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Renew" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole('button', { name: 'Renew' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('is busy and inert while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} loading />);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeBusy();
    expect(btn).toBeDisabled();
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('<TextField />', () => {
  test('shows the hint, then replaces it with an error', async () => {
    const { rerender } = await render(<TextField label="Email" value="" onChangeText={() => undefined} hint="Demo only" />);
    expect(screen.getByText('Demo only')).toBeTruthy();
    await rerender(<TextField label="Email" value="x" onChangeText={() => undefined} hint="Demo only" error="Enter a valid email" />);
    expect(screen.queryByText('Demo only')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent(/Enter a valid email/);
  });

  test('reports typed text', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Email" value="" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.co');
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
  });
});

describe('<Toggle />', () => {
  function Harness() {
    const [on, setOn] = useState(false);
    return <Toggle label="Reminders" value={on} onValueChange={setOn} />;
  }
  test('is a switch that flips its checked state', async () => {
    await render(<Harness />);
    const sw = screen.getByRole('switch', { name: 'Reminders' });
    expect(sw).not.toBeChecked();
    await fireEvent.press(sw);
    expect(screen.getByRole('switch', { name: 'Reminders' })).toBeChecked();
  });
});

describe('states', () => {
  test('EmptyState action is pressable', async () => {
    const onPress = jest.fn();
    await render(<EmptyState icon="car" title="No vehicles" body="Add one" action={{ label: 'Add vehicle', onPress }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Add vehicle' }));
    expect(onPress).toHaveBeenCalled();
  });
  test('ErrorState offers a retry', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState body="Couldn’t load" onRetry={onRetry} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });
});
