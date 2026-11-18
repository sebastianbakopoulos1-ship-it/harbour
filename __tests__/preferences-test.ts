import AsyncStorage from '@react-native-async-storage/async-storage';

import { PREFERENCES_STORAGE_KEY, usePreferences } from '@/store/preferences';

describe('preferences store', () => {
  test('defaults to following the phone', () => {
    expect(usePreferences.getState().themePreference).toBe('system');
  });

  test('saves the theme choice to device storage', async () => {
    usePreferences.getState().setThemePreference('dark');
    expect(usePreferences.getState().themePreference).toBe('dark');
    // persist writes asynchronously
    await new Promise((r) => setTimeout(r, 0));
    const raw = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const saved = JSON.parse(raw as string);
    expect(saved.state).toEqual({ themePreference: 'dark' }); // only data, no functions
    expect(saved.version).toBe(1);
  });
});
