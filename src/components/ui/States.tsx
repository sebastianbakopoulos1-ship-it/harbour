import { StyleSheet, View } from 'react-native';

import { toneColors, useTheme, type Tone } from '@/theme';

import { Button } from './Button';
import { Glyph } from './Glyph';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

interface StateAction {
  label: string;
  onPress: () => void;
}

/** Shown when a list or screen has nothing in it yet. Always explains why and, where possible, what to do next. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: StateAction;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <Glyph icon={icon} size={56} round />
      <Text variant="headline" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" tone="secondary" align="center" style={styles.body}>
        {body}
      </Text>
      {action ? <Button label={action.label} onPress={action.onPress} fullWidth={false} /> : null}
    </View>
  );
}

/** Shown when loading failed. Says what happened in plain words and offers a retry. */
export function ErrorState({
  title = 'Something went wrong',
  body,
  onRetry,
  retrying = false,
}: {
  title?: string;
  body: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Glyph icon="wifiOff" tone="danger" size={56} round />
      <Text variant="headline" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" tone="secondary" align="center" style={styles.body}>
        {body}
      </Text>
      {onRetry ? <Button label="Try again" icon="refresh" variant="secondary" onPress={onRetry} loading={retrying} fullWidth={false} /> : null}
    </View>
  );
}

/** Inline message block: info, warning, success or danger. */
export function Banner({ tone = 'info', icon, children }: { tone?: Tone; icon?: IconName; children: string }) {
  const { colors, radii } = useTheme();
  const { fg, bg } = toneColors(colors, tone);
  const fallback: IconName = tone === 'danger' || tone === 'warning' ? 'alert' : tone === 'success' ? 'checkCircle' : 'info';
  return (
    <View style={[styles.banner, { backgroundColor: bg, borderRadius: radii.md }]} accessibilityRole={tone === 'danger' ? 'alert' : 'text'}>
      <Icon name={icon ?? fallback} size={18} color={fg} />
      <Text variant="callout" style={{ color: fg, flex: 1, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24, gap: 8 },
  title: { marginTop: 8 },
  body: { maxWidth: 280, marginBottom: 12 },
  banner: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 16 },
});
