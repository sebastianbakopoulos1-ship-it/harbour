import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

import { Text } from './Text';

/**
 * Harbour's original mark: an arch over water.
 * Deliberately not based on any government emblem or existing logo.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="Harbour logo">
      <Rect width={32} height={32} rx={9} fill={colors.brand} />
      <Path d="M7 19.5C7 13.2 11 9 16 9s9 4.2 9 10.5" fill="none" stroke={colors.onBrand} strokeWidth={2.6} strokeLinecap="round" />
      <Path
        d="M6 23.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"
        fill="none"
        stroke={colors.accent}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function Wordmark({ size = 32 }: { size?: number }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Harbour">
      <LogoMark size={size} />
      <Text variant="headline" style={{ fontSize: size * 0.6, lineHeight: size * 0.75 }}>
        Harbour
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
