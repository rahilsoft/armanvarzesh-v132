import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DebouncedButton } from '@arman/ui';

describe('DebouncedButton', () => {
  beforeAll(() => { jest.useFakeTimers(); });
  afterAll(() => { jest.useRealTimers(); });

  it('prevents double presses within debounce window', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<DebouncedButton accessibilityRole="button" onPress={onPress} debounceMs={500} />);

    const btn = getByRole('button');
    fireEvent.press(btn);
    fireEvent.press(btn); // within 0ms

    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(600);
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});
