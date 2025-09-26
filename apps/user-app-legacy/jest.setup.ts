import '@testing-library/jest-native/extend-expect';

// RN Alert mock
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
