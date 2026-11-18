import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, type Tone } from '@/theme';

import { Glyph } from './Glyph';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconTone?: Tone;
  /** Element on the trailing edge (pill, toggle, amount). Defaults to a chevron when pressable. */
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
  testID?: string;
}

/** One row in a grouped list. Pressable rows get a chevron unless `trailing` is given. */
export function ListRow({ title, subtitle, icon, iconTone = 'brand', trailing, onPress, accessibilityHint, testID }: ListRowProps) {
  const { colors } = useTheme();
  const content = (
    <View style={styles.row}>
      {icon ? <Glyph icon={icon} tone={iconTone} /> : null}
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="secondary" numberOfLines={2} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="chevronRight" size={18} color={colors.text3} strokeWidth={2.2} /> : null)}
    </View>
  );
  if (!onPress) return <View testID={testID}>{content}</View>;
  return (
    <PressableScale
      testID={testID}
      onPress={onPress}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityHint={accessibilityHint}
    >
      {content}
    </PressableScale>
  );
}

/** Groups ListRows on one card with inset hairline separators. */
export function ListGroup({ children }: { children: ReactNode }) {
  const { colors, radii, shadows } = useTheme();
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: shadows.sm,
        overflow: 'hidden',
      }}
    >
      {items.map((child, i) => (
        <Fragment key={child.key ?? i}>
          {i > 0 ? <View style={[styles.separator, { backgroundColor: colors.border }]} /> : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, minHeight: 56 },
  body: { flex: 1, minWidth: 0 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
});
