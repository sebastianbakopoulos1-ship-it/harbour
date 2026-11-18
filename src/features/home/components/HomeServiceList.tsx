import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, PressableScale, SectionHeader, Text, type IconName } from '@/components/ui';
import { demeritBalance, isOpenFine, regoStatus, unreadCount, walletCredentials } from '@/domain/selectors';
import { appDataSnapshot,useAppData,useAppDataSnapshot } from '@/store/appData';
import { hitTarget, useTheme } from '@/theme';
import type { HomeServiceKey } from '@/types';
import { plural } from '@/utils/format';

import { homeServiceRoute } from '../HomeScreen';

type Meta = { icon: IconName; title: string; subtitle: (d: ReturnType<typeof appDataSnapshot>) => string };

/** Title + live subtitle for each Home service shortcut. */
const META: Record<HomeServiceKey, Meta> = {
  vehicles: {
    icon: 'car',
    title: 'Vehicle registrations',
    subtitle: (d) => {
      const statuses = d.vehicles.map(regoStatus);
      const expired = statuses.filter((r) => r.key === 'expired').length;
      const due = statuses.filter((r) => r.key === 'due').length;
      if (expired || due) return [due && `${due} due soon`, expired && `${expired} expired`].filter(Boolean).join(' · ');
      return plural(d.vehicles.length, 'vehicle');
    },
  },
  fines: {
    icon: 'receipt',
    title: 'Fines and demerits',
    subtitle: (d) => {
      const open = d.fines.filter(isOpenFine).length;
      return open ? `${open} to pay · ${demeritBalance(d)} demerit points` : `Nothing to pay · ${demeritBalance(d)} points`;
    },
  },
  notifications: { icon: 'bell', title: 'Reminders and alerts', subtitle: (d) => (unreadCount(d) ? `${unreadCount(d)} unread` : 'All caught up') },
  wallet: { icon: 'wallet', title: 'Digital wallet', subtitle: (d) => plural(walletCredentials(d).length, 'demo card') },
  account: { icon: 'user', title: 'Profile and settings', subtitle: () => 'Details, security, privacy, appearance' },
};

export function HomeServiceList() {
  const { colors, radii, shadows } = useTheme();
  const data = useAppDataSnapshot();
  const order = useAppData((s) => s.settings.homeOrder);
  const setHomeOrder = useAppData((s) => s.setHomeOrder);
  const [editing, setEditing] = useState(false);

  const move = (key: HomeServiceKey, dir: -1 | 1) => {
    const i = order.indexOf(key);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setHomeOrder(next);
  };

  return (
    <>
      <SectionHeader title="Services" action={{ label: editing ? 'Done' : 'Reorder', onPress: () => setEditing((e) => !e) }} />
      <View style={{ gap: 10 }}>
        {order.map((key, index) => {
          const meta = META[key];
          const rowStyle = [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, boxShadow: shadows.sm, borderStyle: editing ? ('dashed' as const) : ('solid' as const) },
          ];
          const left = (
            <>
              <View style={[styles.glyph, { backgroundColor: colors.brandSoft }]}>
                <Icon name={meta.icon} size={26} color={colors.brand} strokeWidth={1.7} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong" style={{ fontSize: 16 }}>
                  {meta.title}
                </Text>
                {!editing ? (
                  <Text variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                    {meta.subtitle(data)}
                  </Text>
                ) : null}
              </View>
            </>
          );

          if (editing) {
            return (
              <View key={key} style={rowStyle}>
                {left}
                <PressableScale onPress={() => move(key, -1)} disabled={index === 0} accessibilityRole="button" accessibilityLabel={`Move ${meta.title} up`} style={styles.moveBtn}>
                  <Icon name="arrowUp" size={20} color={index === 0 ? colors.text3 : colors.text} strokeWidth={2.2} />
                </PressableScale>
                <PressableScale onPress={() => move(key, 1)} disabled={index === order.length - 1} accessibilityRole="button" accessibilityLabel={`Move ${meta.title} down`} style={styles.moveBtn}>
                  <Icon name="arrowDown" size={20} color={index === order.length - 1 ? colors.text3 : colors.text} strokeWidth={2.2} />
                </PressableScale>
              </View>
            );
          }

          return (
            <PressableScale
              key={key}
              onPress={() => router.push(homeServiceRoute(key) as never)}
              accessibilityRole="button"
              accessibilityLabel={`${meta.title}, ${meta.subtitle(data)}`}
              scaleTo={0.985}
              style={rowStyle}
            >
              {left}
              <Icon name="chevronRight" size={18} color={colors.text3} strokeWidth={2.2} />
            </PressableScale>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderWidth: 1 },
  glyph: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  moveBtn: { width: hitTarget, height: hitTarget, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
