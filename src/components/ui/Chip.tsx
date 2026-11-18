import { ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

/** Horizontally scrolling single-select filter chips (e.g. All / To pay / Paid). */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  accessibilityLabel: string;
}) {
  const { colors, radii } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <PressableScale
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={o.label}
            style={[
              styles.chip,
              {
                borderRadius: radii.pill,
                backgroundColor: on ? colors.text : colors.surface,
                borderColor: on ? colors.text : colors.border,
              },
            ]}
          >
            <Text variant="callout" style={{ color: on ? colors.bg : colors.text2, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
              {o.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2 },
  chip: { height: 36, paddingHorizontal: 16, borderWidth: 1, justifyContent: 'center' },
});
