import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  Glyph,
  Icon,
  iconNames,
  ListGroup,
  ListRow,
  Pill,
  Screen,
  SectionHeader,
  SegmentedControl,
  Skeleton,
  Text,
  TextField,
  Toggle,
  Wordmark,
} from '@/components/ui';
import { usePreferences, type ThemePreference } from '@/store/preferences';
import { radii, spacing, useTheme } from '@/theme';
import { validateEmail } from '@/utils/validation';

/**
 * Phase 1 — Design system gallery.
 *
 * Every component in the system, in every state, with every control wired up.
 * This screen is the visual test bench for the design system. In Phase 2 it
 * moves to a hidden developer route and the real tabs take over `/`.
 */
export default function GalleryScreen() {
  const { colors, scheme } = useTheme();
  const themePreference = usePreferences((s) => s.themePreference);
  const setThemePreference = usePreferences((s) => s.setThemePreference);

  const [taps, setTaps] = useState(0);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [emailSaved, setEmailSaved] = useState<string>();
  const [notify, setNotify] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'paid'>('all');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [rowTapped, setRowTapped] = useState<string>();

  const simulateSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };
  const submitEmail = () => {
    const err = validateEmail(email);
    setEmailError(err);
    setEmailSaved(err ? undefined : email.trim());
  };
  const retry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setFailed(false);
    }, 900);
  };
  const showLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <Screen>
      <View style={styles.top}>
        <Wordmark size={34} />
        <Pill label={scheme === 'dark' ? 'Dark' : 'Light'} tone="brand" />
      </View>
      <Text variant="display" style={{ marginTop: spacing[4] }}>
        Design system
      </Text>
      <Text variant="body" tone="secondary" style={{ marginTop: 4 }}>
        Phase 1 · every component in every state. Fictional demo data only.
      </Text>

      <SectionHeader title="Appearance" />
      <Card>
        <SegmentedControl<ThemePreference>
          accessibilityLabel="Appearance"
          value={themePreference}
          onChange={setThemePreference}
          options={[
            { value: 'system', label: 'Match phone' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <Text variant="caption" tone="tertiary" style={{ marginTop: 10 }}>
          “Match phone” follows your device setting. Your choice is saved.
        </Text>
      </Card>

      <SectionHeader title="Typography" />
      <Card>
        <Text variant="label" tone="tertiary" uppercase>
          Label / eyebrow
        </Text>
        <Text variant="display">Display 30</Text>
        <Text variant="title">Title 24</Text>
        <Text variant="headline">Headline 18</Text>
        <Text variant="bodyStrong">Body strong 15</Text>
        <Text variant="body">Body 15 — the quick brown fox jumps over the lazy dog.</Text>
        <Text variant="callout" tone="secondary">
          Callout 14, secondary
        </Text>
        <Text variant="caption" tone="tertiary">
          Caption 13, tertiary
        </Text>
      </Card>

      <SectionHeader title="Colour" />
      <View style={styles.swatches}>
        {(
          [
            ['brand', colors.brand],
            ['accent', colors.accent],
            ['success', colors.success],
            ['warning', colors.warning],
            ['danger', colors.danger],
            ['info', colors.info],
            ['surface', colors.surface],
            ['surface2', colors.surface2],
          ] as const
        ).map(([name, hex]) => (
          <View key={name} style={styles.swatch} accessible accessibilityLabel={`${name} colour`}>
            <View style={[styles.swatchChip, { backgroundColor: hex, borderColor: colors.border }]} />
            <Text variant="caption" tone="secondary">
              {name}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Buttons" />
      <Card style={{ gap: spacing[3] }}>
        <Button label={`Primary · tapped ${taps}×`} onPress={() => setTaps((n) => n + 1)} testID="btn-primary" />
        <Button label="Save" icon="check" onPress={simulateSave} loading={saving} variant="secondary" />
        <View style={styles.row}>
          <Button label="Outline" variant="outline" size="sm" onPress={() => setTaps((n) => n + 1)} fullWidth={false} />
          <Button label="Ghost" variant="ghost" size="sm" onPress={() => setTaps((n) => n + 1)} fullWidth={false} />
          <Button label="Disabled" size="sm" onPress={() => undefined} disabled fullWidth={false} />
        </View>
        <Button label="Remove" icon="trash" variant="danger" onPress={() => setTaps(0)} accessibilityHint="Resets the tap counter" />
      </Card>

      <SectionHeader title="Status" />
      <Card style={styles.wrap}>
        <Pill label="Current" tone="success" />
        <Pill label="Due soon" tone="warning" />
        <Pill label="Expired" tone="danger" />
        <Pill label="Info" tone="info" />
        <Pill label="Draft" tone="neutral" />
      </Card>

      <SectionHeader title="Lists" />
      <ListGroup>
        <ListRow
          icon="car"
          title="DEM 01A · Toyota Corolla"
          subtitle="Expires in 19 days"
          trailing={<Pill label="Due soon" tone="warning" />}
          onPress={() => setRowTapped('DEM 01A')}
        />
        <ListRow icon="receipt" iconTone="danger" title="Penalty notice" subtitle="DEMO-PN-29871 · overdue" onPress={() => setRowTapped('Penalty notice')} />
        <ListRow icon="bell" iconTone="accent" title="Renewal reminders" subtitle="30 and 7 days before expiry" trailing={<Toggle label="Renewal reminders" value={notify} onValueChange={setNotify} />} />
        <ListRow icon="eye" iconTone="info" title="Share usage analytics" subtitle="Off by default" trailing={<Toggle label="Share usage analytics" value={analytics} onValueChange={setAnalytics} />} />
      </ListGroup>
      <Text variant="caption" tone="tertiary" style={{ marginTop: 8 }} accessibilityLiveRegion="polite">
        {rowTapped ? `Last row tapped: ${rowTapped}` : 'Tap a row — detail screens arrive in Phase 2.'} · Reminders {notify ? 'on' : 'off'} · Analytics {analytics ? 'on' : 'off'}
      </Text>

      <SectionHeader title="Filters" />
      <ChipGroup
        accessibilityLabel="Notice filter"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'open', label: 'To pay' },
          { value: 'paid', label: 'Paid' },
        ]}
      />
      <Text variant="caption" tone="tertiary" style={{ marginTop: 8 }}>
        Selected filter: {filter}
      </Text>

      <SectionHeader title="Form fields" />
      <Card>
        <TextField
          label="Email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (emailError) setEmailError(undefined);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          hint="Use a made-up address — this is a demo"
          error={emailError}
          returnKeyType="done"
          onSubmitEditing={submitEmail}
          testID="email-field"
        />
        <Button label="Check email" onPress={submitEmail} variant="secondary" testID="check-email" />
        {emailSaved ? (
          <View style={{ marginTop: spacing[3] }}>
            <Banner tone="success">{`Looks good: ${emailSaved}`}</Banner>
          </View>
        ) : null}
      </Card>

      <SectionHeader title="Banners" />
      <View style={{ gap: spacing[2] }}>
        <Banner tone="info">Harbour is a demo. All data is fictional.</Banner>
        <Banner tone="warning">Registration for DEM 01A is due in 19 days.</Banner>
        <Banner tone="danger">Your registration has expired. Renew to avoid a fine.</Banner>
      </View>

      <SectionHeader title="Loading" action={{ label: loading ? 'Loading…' : 'Replay', onPress: showLoading }} />
      <Card>
        {loading ? (
          <View style={{ gap: spacing[3] }}>
            <View style={styles.row}>
              <Skeleton width={36} height={36} />
              <View style={{ flex: 1, gap: 6 }}>
                <Skeleton width="70%" height={14} />
                <Skeleton width="45%" height={12} />
              </View>
            </View>
            <Skeleton height={120} radius={radii.lg} />
          </View>
        ) : (
          <View style={styles.row}>
            <Glyph icon="car" />
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">Content loaded</Text>
              <Text variant="caption" tone="secondary">
                Skeletons match this layout so nothing jumps.
              </Text>
            </View>
          </View>
        )}
      </Card>

      <SectionHeader title="Empty and error states" />
      <Card padding={0}>
        <EmptyState icon="car" title="No vehicles yet" body="Add a demo vehicle to track its registration." action={{ label: 'Add vehicle', onPress: () => setTaps((n) => n + 1) }} />
      </Card>
      <View style={{ height: spacing[3] }} />
      <Card padding={0}>
        {failed ? (
          <ErrorState body="We couldn’t load your notices (simulated). Check your connection and try again." onRetry={retry} retrying={retrying} />
        ) : (
          <View style={{ padding: spacing[4], gap: spacing[3] }}>
            <Banner tone="success">Loaded after retry.</Banner>
            <Button label="Simulate failure again" variant="secondary" onPress={() => setFailed(true)} />
          </View>
        )}
      </Card>

      <SectionHeader title={`Icons (${iconNames.length})`} />
      <Card style={styles.icons}>
        {iconNames.map((n) => (
          <View key={n} style={styles.iconCell} accessible accessibilityLabel={`${n} icon`}>
            <Icon name={n} color={colors.text} />
          </View>
        ))}
      </Card>

      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: spacing[8] }}>
        Harbour · original design · fictional data only{'\n'}Not affiliated with any government.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: '22%', alignItems: 'center', gap: 6 },
  swatchChip: { width: '100%', aspectRatio: 1.4, borderRadius: 12, borderWidth: 1 },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  iconCell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
