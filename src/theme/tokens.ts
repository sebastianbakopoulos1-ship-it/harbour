/**
 * Harbour design tokens.
 *
 * Every visual value used in the app comes from here. Screens and components
 * never hard-code colours, sizes or durations — they read them from the theme
 * (see ThemeProvider). This keeps spacing, radii and type consistent, and
 * makes light/dark mode a data change rather than a code change.
 */

/** 4-point spacing scale. Use `spacing[4]` (16) rather than `16`. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;
export type SpacingKey = keyof typeof spacing;

/** Corner radii. `pill` is for fully rounded shapes. */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;
export type RadiusKey = keyof typeof radii;

/**
 * Font families. With `useFonts`, the key we load each font under becomes its
 * family name on iOS, Android and web, so these strings must match
 * the keys passed to `useFonts` in the root layout.
 */
export const fontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/**
 * Type scale. Each variant fixes size, line height, family and tracking.
 * We set the weight through the font family (not `fontWeight`) because
 * Android ignores `fontWeight` for custom fonts.
 */
export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontFamily: fontFamilies.extrabold, letterSpacing: -0.6 },
  title: { fontSize: 24, lineHeight: 30, fontFamily: fontFamilies.extrabold, letterSpacing: -0.4 },
  headline: { fontSize: 18, lineHeight: 24, fontFamily: fontFamilies.bold, letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontFamily: fontFamilies.regular, letterSpacing: 0 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontFamily: fontFamilies.semibold, letterSpacing: 0 },
  callout: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.medium, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fontFamilies.regular, letterSpacing: 0 },
  label: { fontSize: 12, lineHeight: 16, fontFamily: fontFamilies.bold, letterSpacing: 0.96 },
  button: { fontSize: 15, lineHeight: 20, fontFamily: fontFamilies.bold, letterSpacing: 0 },
} as const;
export type TypographyVariant = keyof typeof typography;

/** Animation timings (ms) and spring presets, shared by Reanimated animations. */
export const motion = {
  fast: 150,
  base: 250,
  slow: 400,
  spring: { damping: 18, stiffness: 260, mass: 0.6 },
  pressScale: 0.97,
} as const;

/** Minimum touch target (Apple HIG: 44pt). */
export const hitTarget = 44;

/* ---------------------------------------------------------------------------
 * Colour
 * ------------------------------------------------------------------------- */

/** Semantic colour roles. Components ask for a role, never a raw hex. */
export interface ColorPalette {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  text: string;
  text2: string;
  text3: string;
  border: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  onBrand: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;
  scrim: string;
}

// Harbour's palette: a red primary with a navy ink, the familiar look of an
// Australian government services app, in Harbour's own original colours.
export const lightColors: ColorPalette = {
  bg: '#F4F5F7',
  surface: '#FFFFFF',
  surface2: '#EEF0F4',
  surface3: '#E1E4EB',
  text: '#15213B',
  text2: '#555E70',
  text3: '#6E7787',
  border: '#DADEE7',
  brand: '#D7153A',
  brandStrong: '#002664',
  brandSoft: '#FCE3E8',
  onBrand: '#FFFFFF',
  accent: '#00519C',
  accentSoft: '#E2ECF8',
  success: '#1F7A4D',
  successSoft: '#DDF2E6',
  warning: '#9A5800',
  warningSoft: '#FDEBD3',
  danger: '#B3261E',
  dangerSoft: '#FBE1DE',
  info: '#1B5FA8',
  infoSoft: '#E0E9F8',
  scrim: 'rgba(10, 16, 30, 0.45)',
};

export const darkColors: ColorPalette = {
  bg: '#0D111A',
  surface: '#161C28',
  surface2: '#1D2432',
  surface3: '#27303F',
  text: '#ECEEF3',
  text2: '#AAB2C0',
  text3: '#838D9C',
  border: '#2A3340',
  brand: '#FF6B84',
  brandStrong: '#9DBEF2',
  brandSoft: '#3C1620',
  onBrand: '#2A0810',
  accent: '#7FB0E8',
  accentSoft: '#152840',
  success: '#5CC98F',
  successSoft: '#133325',
  warning: '#F0B15E',
  warningSoft: '#3A2A12',
  danger: '#F0857C',
  dangerSoft: '#3D1A17',
  info: '#8DB2EE',
  infoSoft: '#172741',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

/** Status tones shared by pills, glyphs, banners and list rows. */
export type Tone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Foreground + soft background for a tone in the given palette. */
export function toneColors(c: ColorPalette, tone: Tone): { fg: string; bg: string } {
  switch (tone) {
    case 'brand':
      return { fg: c.brand, bg: c.brandSoft };
    case 'accent':
      return { fg: c.accent, bg: c.accentSoft };
    case 'success':
      return { fg: c.success, bg: c.successSoft };
    case 'warning':
      return { fg: c.warning, bg: c.warningSoft };
    case 'danger':
      return { fg: c.danger, bg: c.dangerSoft };
    case 'info':
      return { fg: c.info, bg: c.infoSoft };
    case 'neutral':
      return { fg: c.text2, bg: c.surface2 };
  }
}

/**
 * Elevation. React Native 0.76+ supports the CSS `boxShadow` style on iOS,
 * Android and web, so one definition works everywhere.
 */
export const shadows = {
  light: {
    none: undefined,
    sm: '0px 1px 2px rgba(15, 30, 33, 0.06), 0px 1px 1px rgba(15, 30, 33, 0.04)',
    md: '0px 6px 18px rgba(15, 30, 33, 0.08), 0px 2px 4px rgba(15, 30, 33, 0.05)',
    lg: '0px 18px 40px rgba(15, 30, 33, 0.18)',
  },
  dark: {
    none: undefined,
    sm: '0px 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0px 6px 18px rgba(0, 0, 0, 0.35)',
    lg: '0px 18px 40px rgba(0, 0, 0, 0.55)',
  },
} as const;
export type ShadowKey = keyof typeof shadows.light;
