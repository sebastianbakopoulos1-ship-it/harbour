import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ConfirmDialog, type ConfirmState } from '@/components/ConfirmDialog';
import { Button, Card, Icon, ListGroup, ListRow, Screen, ScreenHeader, SectionHeader, SegmentedControl, Text, Toggle } from '@/components/ui';
import { useAppData,useAppDataSnapshot } from '@/store/appData';
import { usePreferences } from '@/store/preferences';
import { useTheme } from '@/theme';
import type { ThemePreference } from '@/types';
import { formatDate } from '@/utils/dates';
import { initials } from '@/utils/format';

export default function AccountScreen() {
  const { colors, spacing } = useTheme();
  const data = useAppDataSnapshot();
  const togglePref = useAppData((s) => s.togglePref);
  const resetDemoData = useAppData((s) => s.resetDemoData);
  const themePreference = usePreferences((s) => s.themePreference);
  const setThemePreference = usePreferences((s) => s.setThemePreference);
  const [dialog, setDialog] = useState<ConfirmState | null>(null);

  const { profile, settings } = data;

  return (
    <Screen header={<ScreenHeader title="Profile and settings" back />}>
      <Card onPress={() => router.push('/profile-edit')} accessibilityLabel="Edit your details" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {profile.photoUri ? (
          <Image source={{ uri: profile.photoUri }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.brand }]}>
            <Text variant="headline" style={{ color: colors.onBrand, fontSize: 24 }}>
              {initials(profile.firstName, profile.lastName)}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text variant="headline">
            {profile.firstName} {profile.lastName}
          </Text>
          <Text variant="caption" tone="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
            {profile.email}
          </Text>
        </View>
        <Icon name="pencil" size={20} color={colors.text3} />
      </Card>

      <SectionHeader title="Personal details" action={{ label: 'Edit', onPress: () => router.push('/profile-edit') }} />
      <Card>
        <View style={styles.grid}>
          <KeyValue label="Phone" value={profile.phone} />
          <KeyValue label="Date of birth" value={formatDate(profile.dob)} />
          <KeyValue label="Address" value={profile.address} full />
        </View>
      </Card>

      <SectionHeader title="Appearance" />
      <Card>
        <SegmentedControl<ThemePreference>
          accessibilityLabel="Theme"
          value={themePreference}
          onChange={setThemePreference}
          options={[
            { value: 'system', label: 'Match phone' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <Text variant="caption" tone="secondary" style={{ marginTop: 10 }}>
          “Match phone” follows your device’s light or dark setting automatically.
        </Text>
      </Card>

      <SectionHeader title="Notifications" />
      <ListGroup>
        <ListRow icon="car" title="Registration reminders" subtitle="Before your rego expires" trailing={<Toggle label="Registration reminders" value={settings.prefs.registration} onValueChange={() => togglePref('registration')} />} />
        <ListRow icon="calendar" iconTone="info" title="Credential expiry" subtitle="Licences and cards nearing expiry" trailing={<Toggle label="Credential expiry" value={settings.prefs.expiry} onValueChange={() => togglePref('expiry')} />} />
        <ListRow icon="receipt" iconTone="warning" title="Penalty notices" subtitle="New and overdue notices" trailing={<Toggle label="Penalty notices" value={settings.prefs.fines} onValueChange={() => togglePref('fines')} />} />
        <ListRow icon="megaphone" iconTone="accent" title="Announcements" subtitle="New features and news" trailing={<Toggle label="Announcements" value={settings.prefs.announcements} onValueChange={() => togglePref('announcements')} />} />
      </ListGroup>

      <SectionHeader title="Demo" />
      <ListGroup>
        <ListRow
          icon="refresh"
          iconTone="danger"
          title="Reset demo data"
          subtitle="Restore the original fictional data"
          onPress={() =>
            setDialog({
              title: 'Reset demo data?',
              body: 'All your changes in this prototype will be replaced with the original fictional data.',
              confirmLabel: 'Reset',
              danger: true,
              icon: 'refresh',
              onConfirm: resetDemoData,
            })
          }
        />
        <ListRow icon="help" title="About this prototype" subtitle="Harbour v0.2 · fictional data only" onPress={() => router.push('/help')} />
      </ListGroup>

      <View style={{ marginTop: spacing[6] }}>
        <Button label="View design system" icon="grid" variant="secondary" onPress={() => router.push('/gallery')} />
      </View>

      <ConfirmDialog state={dialog} onDismiss={() => setDialog(null)} />
    </Screen>
  );
}

function KeyValue({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={full ? styles.full : styles.cell}>
      <Text variant="label" tone="tertiary" style={{ letterSpacing: 0 }}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', marginBottom: 16 },
  full: { width: '100%' },
});
