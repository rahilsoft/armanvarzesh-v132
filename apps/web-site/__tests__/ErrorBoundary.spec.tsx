/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

function Boom() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders fallback on error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(getByText(/خطایی رخ داد/)).toBeInTheDocument();
  });
});