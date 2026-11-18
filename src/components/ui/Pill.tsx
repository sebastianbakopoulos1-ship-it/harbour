import { StyleSheet, View } from 'react-native';

import { toneColors, useTheme, type Tone } from '@/theme';

import { Text } from './Text';

/** Compact status label with a leading dot, e.g. "Due soon" or "Paid". */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { colors, radii } = useTheme();
  const { fg, bg } = toneColors(colors, tone);
  return (
    <View
      style={[styles.pill, { backgroundColor: bg, borderRadius: radii.pill }]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
    >
      <View style={[styles.dot, { backgroundColor: fg }]} />
      <Text variant="label" style={{ color: fg, letterSpacing: 0 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 24, paddingHorizontal: 10, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
