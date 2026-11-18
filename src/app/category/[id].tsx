import { router, useLocalSearchParams } from 'expo-router';

import { ArtHeader } from '@/components/ArtHeader';
import { Card, EmptyState, Icon, ListGroup, ListRow, Screen, ScreenHeader, SectionHeader, Text } from '@/components/ui';
import { allServiceItems, serviceCategories } from '@/data/catalog';
import { useTheme } from '@/theme';

/** A services category: a header, its blurb, and a list of items that open real screens or read as placeholders. */
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const category = serviceCategories.find((c) => c.id === id);

  if (!category) {
    return (
      <Screen header={<ScreenHeader title="Topic" back />}>
        <EmptyState icon="alert" title="Topic not found" body="It may have been removed." action={{ label: 'Go back', onPress: () => router.back() }} />
      </Screen>
    );
  }

  const items =
    category.id === 'all'
      ? allServiceItems().map((i) => ({ label: i.label, route: i.route, from: i.from as string | null }))
      : category.items.map((i) => ({ label: i.label, route: i.route, from: null as string | null }));

  return (
    <Screen header={<ScreenHeader title={category.title} back />}>
      <Card padding={0}>
        <ArtHeader hue={category.hue} icon={category.icon} height={128} photo={`cat-${category.id}`} />
        <Text variant="body" tone="secondary" style={{ padding: 18 }}>
          {category.blurb}
        </Text>
      </Card>

      <SectionHeader title={category.id === 'all' ? `${items.length} services, A–Z` : 'In this topic'} />
      <ListGroup>
        {items.map((item) => (
          <ListRow
            key={item.label}
            title={item.label}
            subtitle={item.route ? 'Open in Harbour' : `Placeholder · not in this demo${item.from ? ` · ${item.from}` : ''}`}
            trailing={item.route ? undefined : <Icon name="info" size={18} color={colors.text3} strokeWidth={2} />}
            onPress={item.route ? () => router.push(item.route as never) : undefined}
          />
        ))}
      </ListGroup>
      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: spacing[6] }}>
        Topics and services are fictional examples for this prototype.
      </Text>
    </Screen>
  );
}
