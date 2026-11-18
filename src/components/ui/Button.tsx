import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { hitTarget, useTheme } from '@/theme';

import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to the container width (default) or hug the label. */
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const { colors, radii } = useTheme();
  const palette = {
    primary: { bg: colors.brand, fg: colors.onBrand, border: 'transparent' },
    secondary: { bg: colors.surface2, fg: colors.text, border: 'transparent' },
    outline: { bg: 'transparent', fg: colors.brand, border: colors.brand },
    ghost: { bg: 'transparent', fg: colors.brand, border: 'transparent' },
    danger: { bg: colors.dangerSoft, fg: colors.danger, border: 'transparent' },
  }[variant];
  const inactive = disabled || loading;

  return (
    <PressableScale
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      haptic={variant === 'primary' || variant === 'danger'}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        styles.base,
        {
          height: size === 'md' ? 50 : 38,
          minHeight: size === 'md' ? 50 : hitTarget - 6,
          paddingHorizontal: size === 'md' ? 20 : 16,
          borderRadius: variant === 'outline' || size === 'sm' ? radii.pill : radii.md,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.fg} size="small" />
        ) : icon ? (
          <Icon name={icon} size={18} color={palette.fg} strokeWidth={2.2} />
        ) : null}
        <Text variant="button" style={{ color: palette.fg, fontSize: size === 'md' ? 15 : 14 }} numberOfLines={1}>
          {loading ? `${label}…` : label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { justifyContent: 'center', alignItems: 'center' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
