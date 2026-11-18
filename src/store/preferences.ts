import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * User preferences that should survive app restarts.
 *
 * Why Zustand + AsyncStorage:
 *  - Zustand is a small, typed store with no provider boilerplate.
 *  - `persist` saves the store to AsyncStorage (non-sensitive key/value storage).
 *  - Secrets (PIN, auth tokens) never go here — they go in SecureStore (Phase 7/8).
 *
 * `version` + `migrate` let us change the shape later without wiping or
 * corrupting what's already saved on a device.
 */

export type ThemePreference = 'system' | 'light' | 'dark';

interface PreferencesState {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
}

export const PREFERENCES_STORAGE_KEY = 'harbour.preferences';

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist data, never functions.
      partialize: (s) => ({ themePreference: s.themePreference }),
      migrate: (persisted) => persisted as PreferencesState,
    },
  ),
);
