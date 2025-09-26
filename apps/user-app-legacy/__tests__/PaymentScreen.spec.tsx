import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import PaymentScreen from '../src/screens/PaymentScreen';
import { Alert } from 'react-native';

jest.mock('../src/services/payments', () => ({
  createPayment: jest.fn().mockResolvedValue({ ok: true, data: { status: 'CREATED' } }),
}));

describe('PaymentScreen', () => {
  it('submits payment with default values', async () => {
    const { createPayment } = require('../src/services/payments');
    render(<PaymentScreen />);

    const payBtn = await screen.findByText('Pay');
    fireEvent.press(payBtn);

    expect(createPayment).toHaveBeenCalledWith(10000, 'IRR');
    // optional: alert called
    expect((Alert as any).alert).toHaveBeenCalled();
  });
});
