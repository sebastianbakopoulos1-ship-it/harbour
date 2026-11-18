import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hitTarget, useTheme } from '@/theme';

import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

/**
 * Screen scaffold: theme background, safe-area top inset, optional header,
 * and a scrolling body with the standard 20pt side gutter.
 */
export function Screen({
  header,
  children,
  scroll = true,
  contentContainerStyle,
  ...scrollProps
}: { header?: ReactNode; children: ReactNode; scroll?: boolean } & ScrollViewProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.fill, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {header}
      {scroll ? (
        <ScrollView
          {...scrollProps}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            { paddingHorizontal: spacing[5], paddingBottom: spacing[8] + insets.bottom },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, { paddingHorizontal: spacing[5] }]}>{children}</View>
      )}
    </View>
  );
}

/**
 * Top bar: optional back button, centred title, optional trailing action.
 * With `large`, the title sits left-aligned and big under the bar (iOS style).
 */
export function ScreenHeader({
  title,
  back = false,
  onBack,
  trailing,
  large = false,
}: {
  title: string;
  back?: boolean;
  onBack?: () => void;
  trailing?: ReactNode;
  large?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.bar}>
        <View style={styles.side}>
          {back ? (
            <PressableScale
              onPress={onBack ?? (() => router.back())}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={6}
              style={styles.iconBtn}
            >
              <Icon name="chevronLeft" size={24} color={colors.text} strokeWidth={2.2} />
            </PressableScale>
          ) : null}
        </View>
        {!large ? (
          <Text variant="headline" numberOfLines={1} style={styles.title} accessibilityRole="header">
            {title}
          </Text>
        ) : (
          <View style={styles.title} />
        )}
        <View style={[styles.side, styles.right]}>{trailing}</View>
      </View>
      {large ? (
        <Text variant="display" accessibilityRole="header" style={styles.large}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}

/** Section title with an optional trailing text action (e.g. "See all"). */
export function SectionHeader({ title, action }: { title: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.section}>
      <Text variant="headline" accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <PressableScale onPress={action.onPress} accessibilityRole="button" accessibilityLabel={action.label} hitSlop={10}>
          <Text variant="callout" tone="brand" style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>
            {action.label}
          </Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', minHeight: hitTarget + 4, paddingHorizontal: 8 },
  side: { width: 72, flexDirection: 'row' },
  right: { justifyContent: 'flex-end' },
  iconBtn: { width: hitTarget, height: hitTarget, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  title: { flex: 1, textAlign: 'center' },
  large: { paddingHorizontal: 20, marginTop: 4, marginBottom: 12 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 28, marginBottom: 12 },
});
