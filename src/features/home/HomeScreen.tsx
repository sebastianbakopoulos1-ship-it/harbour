import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtHeader } from '@/components/ArtHeader';
import { CredentialCard } from '@/components/CredentialCard';
import { Card, Icon, PressableScale, SectionHeader, Text, Wordmark, type IconName } from '@/components/ui';
import { featuredItems } from '@/data/catalog';
import { favouriteCredentials, unreadCount } from '@/domain/selectors';
import { useAppDataSnapshot } from '@/store/appData';
import { hitTarget, useTheme } from '@/theme';
import type { HomeServiceKey } from '@/types';
import { greeting, initials } from '@/utils/format';

import { HomeServiceList } from './components/HomeServiceList';

const FAV_CARD_WIDTH_RATIO = 0.78;

export function HomeScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const data = useAppDataSnapshot();
  const unread = unreadCount(data);
  const favourites = favouriteCredentials(data);

  return (
    <View style={[styles.fill, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Wordmark size={34} />
        </View>
        <PressableScale
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel={`Notifications, ${unread} unread`}
          style={styles.iconBtn}
          hitSlop={6}
        >
          <Icon name="bell" size={24} color={colors.text} />
          {unread > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.bg }]}>
              <Text variant="label" style={styles.badgeText}>
                {unread}
              </Text>
            </View>
          ) : null}
        </PressableScale>
        <PressableScale onPress={() => router.push('/account')} accessibilityRole="button" accessibilityLabel="Profile and settings" style={styles.iconBtn} hitSlop={6}>
          <View style={[styles.avatar, { backgroundColor: colors.brand }]}>
            <Text variant="label" style={{ color: colors.onBrand, letterSpacing: 0 }}>
              {initials(data.profile.firstName, data.profile.lastName)}
            </Text>
          </View>
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing[5], paddingBottom: spacing[8] + insets.bottom }} showsVerticalScrollIndicator={false}>
        <Text variant="title" tone="secondary" style={styles.greeting}>
          {greeting()}, <Text variant="title">{data.profile.firstName}</Text>
        </Text>

        {/* Favourites */}
        <SectionHeader title="Favourites" action={{ label: 'Manage', onPress: () => router.push('/(tabs)/wallet?sheet=favourites') }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={undefined}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          style={styles.carouselOuter}
        >
          {favourites.map((c) => (
            <PressableScale
              key={c.id}
              onPress={() => router.push(`/credential/${c.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${c.title}`}
              style={styles.favItem}
            >
              <CredentialCard credential={c} holderName={`${data.profile.firstName} ${data.profile.lastName}`} mini />
            </PressableScale>
          ))}
          <PressableScale
            onPress={() => router.push('/(tabs)/wallet?sheet=favourites')}
            accessibilityRole="button"
            accessibilityLabel="Manage favourites"
            style={[styles.favItem, styles.favAdd, { borderColor: colors.border }]}
          >
            <Icon name="star" size={30} color={colors.brand} />
            <Text variant="callout" tone="secondary" align="center" style={{ marginTop: 10, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
              Tap to manage favourites
            </Text>
          </PressableScale>
        </ScrollView>

        {/* Featured */}
        <SectionHeader title="Featured" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} style={styles.carouselOuter}>
          {featuredItems.map((f) => (
            <FeaturedCard key={f.id} title={f.title} hue={f.hue} icon={f.icon} photo={`ft-${f.id}`} onPress={() => router.push(f.route as never)} />
          ))}
        </ScrollView>

        {/* Services shortcuts */}
        <HomeServiceList />

        {/* Help */}
        <PressableScale
          onPress={() => router.push('/help')}
          accessibilityRole="button"
          accessibilityLabel="Help and support"
          style={[styles.help, { backgroundColor: colors.surface2 }]}
        >
          <Icon name="help" size={22} color={colors.brand} />
          <Text variant="bodyStrong" tone="brand">
            Help and support
          </Text>
        </PressableScale>

        <View style={{ height: spacing[6] }} />
      </ScrollView>
    </View>
  );
}

function FeaturedCard({ title, hue, icon, photo, onPress }: { title: string; hue: number; icon: IconName; photo: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Card onPress={onPress} accessibilityLabel={title} padding={0} style={styles.featured}>
      <ArtHeader hue={hue} icon={icon} height={84} photo={photo} />
      <View style={styles.featuredBody}>
        <Text variant="callout" style={{ flex: 1, fontFamily: 'PlusJakartaSans_700Bold' }}>
          {title}
        </Text>
        <Icon name="arrowRight" size={20} color={colors.brand} strokeWidth={2} />
      </View>
    </Card>
  );
}

/** Keep the key→route mapping used by Home and its service list in one place. */
export function homeServiceRoute(key: HomeServiceKey): string {
  return key === 'wallet' ? '/(tabs)/wallet' : `/${key}`;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 20, paddingVertical: 10 },
  iconBtn: { width: hitTarget, height: hitTarget, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 6, right: 4, minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 11, letterSpacing: 0 },
  greeting: { marginTop: 4 },
  carouselOuter: { marginHorizontal: -20 },
  carousel: { gap: 14, paddingHorizontal: 20, paddingVertical: 2 },
  favItem: { width: 300 * FAV_CARD_WIDTH_RATIO },
  favAdd: { aspectRatio: 1.586, borderWidth: 2, borderStyle: 'dashed', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 16 },
  featured: { width: 200 },
  featuredBody: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 14, flex: 1 },
  help: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, padding: 16, borderRadius: 16 },
});
