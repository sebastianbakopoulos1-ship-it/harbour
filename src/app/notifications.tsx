import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, ChipGroup, EmptyState, Glyph, Icon, PressableScale, Screen, ScreenHeader, Text, type ChipOption, type IconName } from '@/components/ui';
import { unreadCount } from '@/domain/selectors';
import { useAppData,useAppDataSnapshot } from '@/store/appData';
import { useTheme, type Tone } from '@/theme';
import type { AppNotification, NotificationType } from '@/types';
import { relativeTime } from '@/utils/dates';

type Filter = 'all' | 'unread' | NotificationType;
const FILTERS: ChipOption<Filter>[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'registration', label: 'Rego' },
  { value: 'expiry', label: 'Expiry' },
  { value: 'fines', label: 'Fines' },
  { value: 'announcements', label: 'News' },
];

const TYPE_META: Record<NotificationType, { icon: IconName; tone: Tone }> = {
  registration: { icon: 'car', tone: 'brand' },
  expiry: { icon: 'calendar', tone: 'info' },
  fines: { icon: 'receipt', tone: 'warning' },
  announcements: { icon: 'megaphone', tone: 'accent' },
};

export default function NotificationsScreen() {
  const { colors, spacing } = useTheme();
  const data = useAppDataSnapshot();
  const markRead = useAppData((s) => s.markNotificationRead);
  const markAll = useAppData((s) => s.markAllNotificationsRead);
  const remove = useAppData((s) => s.deleteNotification);
  const [filter, setFilter] = useState<Filter>('all');
  const unread = unreadCount(data);

  const list = useMemo(
    () =>
      data.notifications
        .filter((n) => (filter === 'all' ? true : filter === 'unread' ? !n.read : n.type === filter))
        .sort((a, b) => b.at.localeCompare(a.at)),
    [data.notifications, filter],
  );

  const open = (n: AppNotification) => {
    markRead(n.id);
    if (n.link) router.push(`/${n.link.screen === 'cred' ? 'credential' : n.link.screen}/${n.link.id}`);
  };

  return (
    <Screen header={<ScreenHeader title="Notifications" back trailing={<HeaderButton />} />}>
      <View style={{ marginBottom: spacing[3] }}>
        <ChipGroup options={FILTERS} value={filter} onChange={setFilter} accessibilityLabel="Notification filter" />
      </View>

      {unread > 0 ? (
        <View style={styles.markRow}>
          <Text variant="caption" tone="secondary">
            {unread} unread
          </Text>
          <PressableScale onPress={markAll} accessibilityRole="button" accessibilityLabel="Mark all as read" hitSlop={8}>
            <Text variant="callout" tone="brand" style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>
              Mark all as read
            </Text>
          </PressableScale>
        </View>
      ) : null}

      {list.length > 0 ? (
        <Card padding={0}>
          {list.map((n, i) => {
            const meta = TYPE_META[n.type];
            return (
              <View key={n.id} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                <PressableScale onPress={() => open(n)} accessibilityRole="button" accessibilityLabel={`${n.title}. ${n.body}`} style={styles.rowMain}>
                  <Glyph icon={meta.icon} tone={meta.tone} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text variant="bodyStrong" style={{ flex: 1, fontFamily: n.read ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_800ExtraBold' }} numberOfLines={1}>
                        {n.title}
                      </Text>
                      <Text variant="caption" tone="tertiary">
                        {relativeTime(n.at)}
                      </Text>
                    </View>
                    <Text variant="caption" tone="secondary" style={{ marginTop: 3 }} numberOfLines={2}>
                      {n.body}
                    </Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => remove(n.id)} accessibilityRole="button" accessibilityLabel="Delete notification" style={styles.del} hitSlop={6}>
                  <Icon name="x" size={16} color={colors.text3} strokeWidth={2.2} />
                </PressableScale>
                {!n.read ? <View style={[styles.unreadDot, { backgroundColor: colors.brand }]} /> : null}
              </View>
            );
          })}
        </Card>
      ) : (
        <Card padding={0}>
          <EmptyState
            icon="bell"
            title={filter === 'unread' ? 'You’re all caught up' : 'No notifications'}
            body={filter === 'all' ? 'Reminders and announcements will appear here.' : 'Nothing matches this filter.'}
          />
        </Card>
      )}
    </Screen>
  );
}

function HeaderButton() {
  const { colors } = useTheme();
  return (
    <PressableScale onPress={() => router.push('/account')} accessibilityRole="button" accessibilityLabel="Notification preferences" style={styles.headerBtn} hitSlop={6}>
      <Icon name="sliders" size={21} color={colors.text} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  markRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  row: { position: 'relative' },
  rowMain: { flexDirection: 'row', gap: 12, padding: 14, paddingLeft: 16, flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  del: { position: 'absolute', right: 8, top: 0, bottom: 0, width: 36, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { position: 'absolute', left: 6, top: 24, width: 7, height: 7, borderRadius: 4 },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
