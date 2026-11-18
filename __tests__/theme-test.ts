import { darkColors, lightColors, resolveScheme, type ColorPalette } from '@/theme';

/** WCAG relative luminance of a #RRGGBB colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('resolveScheme', () => {
  test('follows the phone when set to system', () => {
    expect(resolveScheme('system', 'dark')).toBe('dark');
    expect(resolveScheme('system', 'light')).toBe('light');
  });
  test('falls back to light when the phone reports nothing', () => {
    expect(resolveScheme('system', null)).toBe('light');
    expect(resolveScheme('system', undefined)).toBe('light');
  });
  test('an explicit choice overrides the phone', () => {
    expect(resolveScheme('light', 'dark')).toBe('light');
    expect(resolveScheme('dark', 'light')).toBe('dark');
  });
});

describe.each([
  ['light', lightColors],
  ['dark', darkColors],
] as const)('%s palette contrast (WCAG AA)', (_name, c: ColorPalette) => {
  const AA = 4.5; // normal-size text
  test.each([
    ['text on bg', c.text, c.bg],
    ['text on surface', c.text, c.surface],
    ['text2 on bg', c.text2, c.bg],
    ['text2 on surface', c.text2, c.surface],
    ['text3 on surface', c.text3, c.surface],
    ['onBrand on brand', c.onBrand, c.brand],
    ['brand on surface', c.brand, c.surface],
    ['success on successSoft', c.success, c.successSoft],
    ['warning on warningSoft', c.warning, c.warningSoft],
    ['danger on dangerSoft', c.danger, c.dangerSoft],
    ['info on infoSoft', c.info, c.infoSoft],
    ['accent on accentSoft', c.accent, c.accentSoft],
  ])('%s ≥ 4.5:1', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA);
  });
});
