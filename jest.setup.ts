/* Test environment setup (runs before each test file). */

// AsyncStorage has no native module under Jest; the package ships an in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Haptics are a no-op in tests.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

// Reanimated 4 runs animations on a separate worklets runtime that does not exist
// under Jest. See test/mocks/reanimated.ts for why we use our own small mock.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('./test/mocks/reanimated'));
