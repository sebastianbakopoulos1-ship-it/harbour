import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CredentialCard } from '@/components/CredentialCard';
import { DemoQR } from '@/components/DemoQR';
import { Button, Card, EmptyState, Icon, Pill, PressableScale, Screen, ScreenHeader, SectionHeader, Text } from '@/components/ui';
import { useAppData,useAppDataSnapshot } from '@/store/appData';
import { useTheme } from '@/theme';
import { daysUntil, formatDate } from '@/utils/dates';

export default function CredentialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const data = useAppDataSnapshot();
  const toggleFavourite = useAppData((s) => s.toggleFavourite);
  const setInWallet = useAppData((s) => s.setInWallet);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const credential = data.credentials.find((c) => c.id === id);
  if (!credential) {
    return (
      <Screen header={<ScreenHeader title="Credential" back />}>
        <EmptyState icon="alert" title="Credential not found" body="It may have been removed." action={{ label: 'Go back', onPress: () => router.back() }} />
      </Screen>
    );
  }

  const holderName = `${data.profile.firstName} ${data.profile.lastName}`;
  const days = daysUntil(credential.expiry);

  return (
    <Screen
      header={
        <ScreenHeader
          title={credential.title}
          back
          trailing={
            credential.inWallet ? (
              <PressableScale onPress={() => toggleFavourite(credential.id)} accessibilityRole="button" accessibilityState={{ selected: credential.fav }} accessibilityLabel={credential.fav ? 'Remove from favourites' : 'Add to favourites'} style={styles.starBtn} hitSlop={6}>
                <Icon name="star" size={23} color={credential.fav ? colors.accent : colors.text3} filled={credential.fav} />
              </PressableScale>
            ) : undefined
          }
        />
      }
    >
      <CredentialCard credential={credential} holderName={holderName} photoUri={data.profile.photoUri} />

      {credential.inWallet ? (
        <Card style={{ marginTop: spacing[4], alignItems: 'center', gap: spacing[3] }}>
          <DemoQR seed={credential.number + (refreshedAt ? refreshedAt.getTime() : '')} />
          <Text variant="caption" tone="secondary" align="center" style={{ maxWidth: 250 }}>
            This pattern is decorative and cannot be scanned or verified.
          </Text>
          <Button label="Refresh" icon="refresh" variant="secondary" onPress={() => setRefreshedAt(new Date())} fullWidth={false} />
          {refreshedAt ? (
            <Text variant="caption" tone="tertiary">
              Refreshed {refreshedAt.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </Text>
          ) : null}
        </Card>
      ) : (
        <Card style={{ marginTop: spacing[4], flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icon name="info" size={20} color={colors.text2} />
          <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
            This demo card isn’t in your wallet yet.
          </Text>
        </Card>
      )}

      <SectionHeader title="Details" />
      <Card>
        <KeyValue label="Holder" value={holderName} full />
        <KeyValue label="Demo number" value={credential.number} full mono />
        <View style={styles.kvGrid}>
          {credential.fields.map(([label, value]) => (
            <KeyValue key={label} label={label} value={value} />
          ))}
          <KeyValue label="Issued" value={formatDate(credential.issued)} />
          <KeyValue label="Expires" value={formatDate(credential.expiry)} />
        </View>
        <View style={{ marginTop: spacing[3] }}>{days <= 60 ? <Pill label={`Expires in ${days} days`} tone="warning" /> : <Pill label="Active" tone="success" />}</View>
      </Card>

      <View style={{ marginTop: spacing[6] }}>
        {credential.inWallet ? (
          <Button label="Remove from wallet" icon="trash" variant="danger" onPress={() => { setInWallet(credential.id, false); router.back(); }} />
        ) : (
          <Button label="Add to wallet" icon="plus" onPress={() => setInWallet(credential.id, true)} />
        )}
      </View>
    </Screen>
  );
}

function KeyValue({ label, value, full, mono }: { label: string; value: string; full?: boolean; mono?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[full ? styles.kvFull : styles.kvCell, !full && styles.kvGridItem]}>
      <Text variant="label" tone="tertiary" style={{ letterSpacing: 0 }}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={[{ marginTop: 2 }, mono ? { fontVariant: ['tabular-nums'], color: colors.text } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  starBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  kvGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  kvGridItem: { width: '50%', marginBottom: 16 },
  kvCell: {},
  kvFull: { width: '100%', marginBottom: 16 },
});
