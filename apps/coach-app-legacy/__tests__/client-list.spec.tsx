import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ClientList from '../components/Clients/ClientList';
describe('ClientList', () => {
  it('renders provided clients', () => {
    render(<ClientList />);
    expect(screen.getByText('Ali Ahmadi')).toBeTruthy();
    expect(screen.getByText(/Level:/)).toBeTruthy();
  });
});
