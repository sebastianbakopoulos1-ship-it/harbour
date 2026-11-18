import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ConfirmDialog, type ConfirmState } from '@/components/ConfirmDialog';
import { Button, Card, EmptyState, Icon, Pill, Screen, ScreenHeader, SectionHeader, Text } from '@/components/ui';
import { fineStatus } from '@/domain/selectors';
import { useAppData } from '@/store/appData';
import { useTheme } from '@/theme';
import { formatDate } from '@/utils/dates';
import { formatMoney } from '@/utils/format';

export default function FineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const fine = useAppData((s) => s.fines.find((f) => f.id === id));
  const payFine = useAppData((s) => s.payFine);
  const [dialog, setDialog] = useState<ConfirmState | null>(null);

  if (!fine) {
    return (
      <Screen header={<ScreenHeader title="Notice" back />}>
        <EmptyState icon="alert" title="Notice not found" body="It may have been removed." action={{ label: 'Go back', onPress: () => router.back() }} />
      </Screen>
    );
  }

  const status = fineStatus(fine);

  return (
    <Screen header={<ScreenHeader title="Penalty notice" back />}>
      <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Pill label={status.label} tone={status.tone} />
        <Text variant="display" style={{ marginTop: 16, fontSize: 36 }}>
          {formatMoney(fine.amount)}
        </Text>
        <Text variant="caption" tone="secondary" style={{ marginTop: 4 }}>
          {fine.status === 'paid' ? `Paid · ${formatDate(fine.paidOn ?? fine.due)}` : `Due ${formatDate(fine.due)}`}
        </Text>
      </Card>

      <SectionHeader title="Offence" />
      <Card>
        <KeyValue label="Description" value={fine.offence} full />
        <KeyValue label="Location" value={fine.place} full />
        <View style={styles.grid}>
          <KeyValue label="Date" value={formatDate(fine.date)} />
          <KeyValue label="Vehicle" value={fine.plate} />
          <KeyValue label="Demerit points" value={String(fine.points)} />
          <KeyValue label="Notice no." value={fine.ref} />
        </View>
      </Card>

      {fine.status !== 'paid' ? (
        <View style={{ marginTop: spacing[6], gap: spacing[3] }}>
          <Button
            label={`Pay ${formatMoney(fine.amount)} (simulated)`}
            icon="dollar"
            onPress={() =>
              setDialog({
                title: `Pay ${formatMoney(fine.amount)}?`,
                body: `Simulated payment for ${fine.ref}. No money will be charged.`,
                confirmLabel: 'Pay (demo)',
                icon: 'dollar',
                onConfirm: () => payFine(fine.id),
              })
            }
          />
        </View>
      ) : (
        <Card style={{ marginTop: spacing[6], flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icon name="checkCircle" size={22} color={colors.success} />
          <Text variant="bodyStrong" tone="success">
            This demo notice has been paid.
          </Text>
        </Card>
      )}
      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: spacing[6] }}>
        Fictional notice for demonstration. No real payment is processed.
      </Text>

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
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', marginBottom: 16 },
  full: { width: '100%', marginBottom: 16 },
});
