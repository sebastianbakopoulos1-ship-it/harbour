import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferences } from '@/store/preferences';

import {
  darkColors,
  lightColors,
  motion,
  radii,
  shadows,
  spacing,
  typography,
  type ColorPalette,
} from './tokens';

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  colors: ColorPalette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: (typeof shadows)[ColorScheme];
  motion: typeof motion;
}

export function buildTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radii,
    typography,
    shadows: shadows[scheme],
    motion,
  };
}

/**
 * Resolve the scheme to render: an explicit user choice wins; otherwise follow
 * the phone. `null`/`undefined` from the OS (unknown) falls back to light.
 */
export function resolveScheme(
  preference: 'system' | 'light' | 'dark',
  system: string | null | undefined,
): ColorScheme {
  if (preference !== 'system') return preference;
  return system === 'dark' ? 'dark' : 'light';
}

const ThemeContext = createContext<Theme>(buildTheme('light'));

/**
 * Provides the resolved theme to the whole app.
 *
 * We resolve the scheme in JS (instead of forcing the OS appearance) so the
 * "Match phone / Light / Dark" choice behaves identically on iOS, Android and
 * web, and updates instantly when the phone's setting changes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const preference = usePreferences((s) => s.themePreference);
  const scheme = resolveScheme(preference, system);
  const theme = useMemo(() => buildTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
