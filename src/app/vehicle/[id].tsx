import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, ListGroup, ListRow, Pill, Screen, ScreenHeader, SectionHeader, Text, Toggle } from '@/components/ui';
import { ConfirmDialog, type ConfirmState } from '@/components/ConfirmDialog';
import { fineStatus, regoStatus } from '@/domain/selectors';
import { useAppData,useAppDataSnapshot } from '@/store/appData';
import { toneColors, useTheme } from '@/theme';
import { addYear, formatDate } from '@/utils/dates';
import { formatMoney } from '@/utils/format';

export default function VehicleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const data = useAppDataSnapshot();
  const renewVehicle = useAppData((s) => s.renewVehicle);
  const removeVehicle = useAppData((s) => s.removeVehicle);
  const togglePref = useAppData((s) => s.togglePref);
  const [dialog, setDialog] = useState<ConfirmState | null>(null);

  const vehicle = data.vehicles.find((v) => v.id === id);
  if (!vehicle) {
    return (
      <Screen header={<ScreenHeader title="Vehicle" back />}>
        <EmptyState icon="alert" title="Vehicle not found" body="It may have been removed." action={{ label: 'Go back', onPress: () => router.back() }} />
      </Screen>
    );
  }

  const status = regoStatus(vehicle);
  const fines = data.fines.filter((f) => f.plate === vehicle.plate);
  const progress = status.days < 0 ? 100 : Math.max(4, Math.min(100, (status.days / 365) * 100));

  return (
    <Screen header={<ScreenHeader title={vehicle.plate} back />}>
      <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
        <View style={[styles.plate, { borderColor: colors.text }]}>
          <Text variant="headline" style={{ letterSpacing: 2, fontSize: 20 }}>
            {vehicle.plate}
          </Text>
        </View>
        <Text variant="headline" style={{ marginTop: 14, fontSize: 20 }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 4 }}>
          {vehicle.colour} · {vehicle.body}
        </Text>
        <View style={{ marginTop: 14 }}>
          <Pill label={status.label} tone={status.tone} />
        </View>
      </Card>

      <SectionHeader title="Registration" />
      <Card>
        <View style={styles.kvGrid}>
          <KeyValue label="Expiry date" value={formatDate(vehicle.expiry)} />
          <KeyValue label="Status" value={status.text} valueColor={toneColors(colors, status.tone).fg} />
          <KeyValue label="CTP insurer" value={vehicle.ctp} />
          <KeyValue label="Renewal fee" value={`${formatMoney(vehicle.body === 'Motorcycle' ? 162 : 398)} (demo)`} />
        </View>
        <View style={[styles.track, { backgroundColor: colors.surface3 }]}>
          <View style={{ width: `${progress}%`, height: '100%', borderRadius: 3, backgroundColor: toneColors(colors, status.tone).fg }} />
        </View>
        <View style={{ marginTop: spacing[4] }}>
          <Button
            label="Renew 12 months"
            icon="rotate"
            onPress={() =>
              setDialog({
                title: `Renew ${vehicle.plate}?`,
                body: `This simulates a 12-month renewal. No payment is taken. New expiry: ${formatDate(addYear(vehicle.expiry))}.`,
                confirmLabel: 'Renew',
                onConfirm: () => renewVehicle(vehicle.id),
              })
            }
          />
        </View>
      </Card>

      <SectionHeader title="Reminders" />
      <ListGroup>
        <ListRow
          title="Renewal reminders"
          subtitle="30 and 7 days before expiry"
          trailing={<Toggle label="Renewal reminders" value={data.settings.prefs.registration} onValueChange={() => togglePref('registration')} />}
        />
      </ListGroup>

      <SectionHeader title="Penalty notices" />
      {fines.length > 0 ? (
        <ListGroup>
          {fines.map((f) => {
            const st = fineStatus(f);
            return (
              <ListRow
                key={f.id}
                icon="receipt"
                iconTone={st.tone}
                title={f.offence}
                subtitle={`${formatDate(f.date)} · ${f.plate}`}
                trailing={<Text variant="bodyStrong">{formatMoney(f.amount)}</Text>}
                onPress={() => router.push(`/fine/${f.id}`)}
              />
            );
          })}
        </ListGroup>
      ) : (
        <Card padding={0}>
          <EmptyState icon="checkCircle" title="No notices" body="There are no demo penalty notices for this vehicle." />
        </Card>
      )}

      <View style={{ marginTop: spacing[6] }}>
        <Button
          label="Remove vehicle"
          icon="trash"
          variant="danger"
          onPress={() =>
            setDialog({
              title: `Remove ${vehicle.plate}?`,
              body: 'This removes the demo vehicle and its reminders from this device.',
              confirmLabel: 'Remove',
              danger: true,
              onConfirm: () => {
                removeVehicle(vehicle.id);
                router.back();
              },
            })
          }
        />
      </View>

      <ConfirmDialog state={dialog} onDismiss={() => setDialog(null)} />
    </Screen>
  );
}

function KeyValue({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.kvItem}>
      <Text variant="label" tone="tertiary" style={{ letterSpacing: 0 }}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={[{ marginTop: 2 }, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: { height: 40, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  kvGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  kvItem: { width: '50%', marginBottom: 16 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 4 },
});
