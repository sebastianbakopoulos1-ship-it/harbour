import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtHeader } from '@/components/ArtHeader';
import { SearchField } from '@/components/SearchField';
import { Card, EmptyState, Icon, Screen, Text } from '@/components/ui';
import { serviceCategories } from '@/data/catalog';
import { useTheme } from '@/theme';

/** Services directory: a searchable grid of category cards with generated artwork. */
export default function ServicesTab() {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return serviceCategories;
    return serviceCategories.filter((c) => {
      const hay = `${c.title} ${c.blurb} ${c.items.map((i) => i.label).join(' ')}`.toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [query]);

  return (
    <Screen header={<Header />}>
      <View style={{ marginTop: spacing[4] }}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search services and topics" accessibilityLabel="Search services" />
      </View>

      {filtered.length === 0 ? (
        <View style={{ marginTop: spacing[6] }}>
          <EmptyState icon="search" title="Nothing matches" body="Try a topic like “boat”, “rent” or “childcare”." />
        </View>
      ) : (
        <View style={{ gap: spacing[4], marginTop: spacing[4] }}>
          {filtered.map((c) => (
            <Card key={c.id} onPress={() => router.push(`/category/${c.id}`)} accessibilityLabel={c.title} padding={0}>
              <ArtHeader hue={c.hue} icon={c.icon} height={112} photo={`cat-${c.id}`} />
              <View style={{ padding: 18 }}>
                <Text variant="headline" style={{ fontSize: 18 }}>
                  {c.title}
                </Text>
                <Text variant="body" tone="secondary" style={{ marginTop: 6 }}>
                  {c.blurb}
                </Text>
                <View style={{ marginTop: 12 }}>
                  <Icon name="arrowRight" size={22} color={colors.brand} strokeWidth={2} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: spacing[6] }}>
        Topics and services are fictional examples for this prototype.
      </Text>
    </Screen>
  );
}

function Header() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={[styles.bar, { borderBottomColor: colors.border }]}>
        <Text variant="headline" accessibilityRole="header">
          Services
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
});
