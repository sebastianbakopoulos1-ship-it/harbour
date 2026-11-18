import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui';
import { useTheme } from '@/theme';

/** A rounded search input with a leading magnifier, used on list screens. */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  accessibilityLabel: string;
}) {
  const { colors, radii, typography } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }]}>
      <Icon name="search" size={20} color={colors.text3} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text3}
        accessibilityLabel={accessibilityLabel}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={[typography.body, { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 16, borderWidth: 1 },
});
