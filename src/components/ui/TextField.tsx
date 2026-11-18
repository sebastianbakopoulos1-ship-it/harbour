import { useState, type ComponentRef, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

/**
 * Labelled text input with focus ring, hint and inline error.
 * The label is tied to the input for screen readers, and errors are
 * announced (live region) as soon as they appear.
 */
export function TextField({ label, error, hint, ref, onFocus, onBlur, multiline, ...rest }: TextFieldProps) {
  const { colors, radii, typography } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.brand : colors.border;

  return (
    <View style={styles.field}>
      <Text variant="callout" tone="secondary" style={styles.label} nativeID={`label-${label}`}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        {...rest}
        multiline={multiline}
        accessibilityLabel={label}
        accessibilityLabelledBy={`label-${label}`}
        accessibilityHint={error ?? hint}
        aria-invalid={!!error}
        placeholderTextColor={colors.text3}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          typography.body,
          {
            fontSize: 16, // 16+ stops iOS Safari zooming on focus (web build)
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor,
            borderWidth: 1.5,
            borderRadius: radii.md,
            paddingHorizontal: 16,
            minHeight: multiline ? 112 : 50,
            paddingVertical: multiline ? 12 : 0,
            textAlignVertical: multiline ? 'top' : 'center',
            boxShadow: focused && !error ? `0px 0px 0px 4px ${colors.brandSoft}` : undefined,
          },
        ]}
      />
      {error ? (
        <View style={styles.msg} accessible accessibilityLiveRegion="polite" accessibilityRole="alert" accessibilityLabel={error}>
          <Icon name="alert" size={13} color={colors.danger} strokeWidth={2.4} />
          <Text variant="caption" tone="danger" style={styles.msgText}>
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="caption" tone="tertiary" style={styles.hint}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { marginBottom: 6, fontFamily: 'PlusJakartaSans_700Bold' },
  msg: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  msgText: { fontFamily: 'PlusJakartaSans_600SemiBold' },
  hint: { marginTop: 6 },
});
