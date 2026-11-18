import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TypographyVariant } from '@/theme';

export type TextTone =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'brand'
  | 'onBrand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  /** Uppercase eyebrow style (used with the `label` variant). */
  uppercase?: boolean;
}

/**
 * The only text component in the app. Variants come from the type scale,
 * colours from the theme. Dynamic Type is respected (font scaling on) but
 * capped so layouts can't break at the largest accessibility sizes.
 */
export function Text({ variant = 'body', tone = 'default', align, uppercase, style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  const color = {
    default: colors.text,
    secondary: colors.text2,
    tertiary: colors.text3,
    brand: colors.brand,
    onBrand: colors.onBrand,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
  }[tone];
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[
        typography[variant],
        { color },
        align ? { textAlign: align } : null,
        uppercase ? { textTransform: 'uppercase' } : null,
        style,
      ]}
    />
  );
}
