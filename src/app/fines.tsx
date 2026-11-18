import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Card, ChipGroup, EmptyState, ListGroup, ListRow, Pill, Screen, ScreenHeader, SectionHeader, Text, type ChipOption } from '@/components/ui';
import { demeritBalance, fineStatus, isOpenFine } from '@/domain/selectors';
import { useAppDataSnapshot } from '@/store/appData';
import { useTheme } from '@/theme';
import { formatDate } from '@/utils/dates';
import { formatMoney, plural } from '@/utils/format';

type Filter = 'all' | 'open' | 'overdue' | 'paid';
const FILTERS: ChipOption<Filter>[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'To pay' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
];

export default function FinesScreen() {
  const { colors, spacing } = useTheme();
  const data = useAppDataSnapshot();
  const [filter, setFilter] = useState<Filter>('all');

  const balance = demeritBalance(data);
  const limit = data.demeritLimit;
  const open = data.fines.filter(isOpenFine);
  const owing = open.reduce((sum, f) => sum + f.amount, 0);
  const tone = balance >= limit - 3 ? 'danger' : balance >= limit / 2 ? 'warning' : 'brand';

  const list = useMemo(
    () =>
      data.fines
        .filter((f) => (filter === 'all' ? true : filter === 'open' ? isOpenFine(f) : filter === 'paid' ? f.status === 'paid' : fineStatus(f).label === 'Overdue'))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.fines, filter],
  );

  return (
    <Screen header={<ScreenHeader title="Fines and demerits" back />}>
      <Card style={styles.meter}>
        <Ring value={balance} limit={limit} color={colors[tone]} track={colors.surface3} text={colors.text} sub={colors.text3} />
        <View style={{ flex: 1 }}>
          <Text variant="label" tone="tertiary" uppercase>
            Demo demerit points
          </Text>
          <Text variant="bodyStrong" style={{ marginTop: 6, fontSize: 16 }}>
            {limit - balance} points left before a demo suspension
          </Text>
          <Text variant="caption" tone="secondary" style={{ marginTop: 6 }}>
            Counted over 3 years · fictional
          </Text>
        </View>
      </Card>

      <View style={styles.stats}>
        <Card style={{ flex: 1 }}>
          <Text variant="label" tone="tertiary" style={{ letterSpacing: 0 }}>
            Amount owing
          </Text>
          <Text variant="title" style={{ marginTop: 4 }}>
            {formatMoney(owing)}
          </Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text variant="label" tone="tertiary" style={{ letterSpacing: 0 }}>
            Open notices
          </Text>
          <Text variant="title" style={{ marginTop: 4 }}>
            {open.length}
          </Text>
        </Card>
      </View>

      <SectionHeader title="Notice history" />
      <View style={{ marginBottom: spacing[3] }}>
        <ChipGroup options={FILTERS} value={filter} onChange={setFilter} accessibilityLabel="Notice filter" />
      </View>
      {list.length > 0 ? (
        <ListGroup>
          {list.map((f) => {
            const st = fineStatus(f);
            return (
              <ListRow
                key={f.id}
                icon="receipt"
                iconTone={st.tone}
                title={f.offence}
                subtitle={`${formatDate(f.date)} · ${f.plate}${f.points ? ` · ${plural(f.points, 'pt')}` : ''}`}
                trailing={
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text variant="bodyStrong">{formatMoney(f.amount)}</Text>
                    <Pill label={st.label} tone={st.tone} />
                  </View>
                }
                onPress={() => router.push(`/fine/${f.id}`)}
              />
            );
          })}
        </ListGroup>
      ) : (
        <Card padding={0}>
          <EmptyState icon="checkCircle" title="Nothing here" body={filter === 'all' ? 'You have no demo penalty notices.' : 'No notices match this filter.'} />
        </Card>
      )}
      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: spacing[6] }}>
        Simulated data. Not connected to any penalty or licensing system.
      </Text>
    </Screen>
  );
}

function Ring({ value, limit, color, track, text, sub }: { value: number; limit: number; color: string; track: string; text: string; sub: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / limit);
  return (
    <View style={{ width: 108, height: 108 }}>
      <Svg width={108} height={108} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={54} cy={54} r={r} fill="none" stroke={track} strokeWidth={10} />
        <Circle cx={54} cy={54} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </Svg>
      <View style={styles.ringLabel}>
        <Text variant="title" style={{ color: text, fontSize: 30 }}>
          {value}
        </Text>
        <Text variant="caption" style={{ color: sub }}>
          of {limit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ringLabel: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
