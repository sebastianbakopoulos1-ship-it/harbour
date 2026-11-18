import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { CredentialCard } from '@/components/CredentialCard';
import { Button, EmptyState, Icon, PressableScale, Screen, Text } from '@/components/ui';
import { favouriteCredentials, walletCredentials } from '@/domain/selectors';
import {
  AboutCardsSheet,
  AddCardSheet,
  ManageFavouritesSheet,
  OptionsSheet,
  WALLET_SHEET_TITLES,
  type WalletSheet,
} from '@/features/wallet/sheets';
import { useAppDataSnapshot } from '@/store/appData';
import { useTheme } from '@/theme';

type Filter = 'all' | 'fav';

/** The digital wallet: filters, the card stack, an Add button, and the manage/add/about sheets. */
export default function WalletTab() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const data = useAppDataSnapshot();
  const [filter, setFilter] = useState<Filter>('all');
  const [sheet, setSheet] = useState<WalletSheet>(null);

  // Home's "Manage favourites" deep-links here with ?sheet=favourites. Syncing
  // that navigation param into local sheet state is a valid effect (the lint
  // rule's heuristic doesn't cover external-system sync), so it's opted out here.
  const params = useLocalSearchParams<{ sheet?: string }>();
  useEffect(() => {
    const target: WalletSheet = params.sheet === 'favourites' ? 'favourites' : params.sheet === 'add' ? 'addCard' : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) setSheet(target);
  }, [params.sheet]);

  const all = walletCredentials(data);
  const favs = favouriteCredentials(data);
  const list = filter === 'fav' ? favs : all;
  const holderName = `${data.profile.firstName} ${data.profile.lastName}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Screen header={<Header onOptions={() => setSheet('options')} />} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        <View style={[styles.chips, { marginTop: spacing[4] }]}>
          <FilterChip label={`All (${all.length})`} on={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label={`Favourites (${favs.length})`} on={filter === 'fav'} onPress={() => setFilter('fav')} />
        </View>

        {list.length > 0 ? (
          <>
            <View style={{ gap: spacing[4] }}>
              {list.map((c) => (
                <PressableScale key={c.id} onPress={() => router.push(`/credential/${c.id}`)} accessibilityRole="button" accessibilityLabel={`Open ${c.title}`} scaleTo={0.985}>
                  <CredentialCard credential={c} holderName={holderName} />
                </PressableScale>
              ))}
            </View>
          </>
        ) : filter === 'fav' ? (
          <EmptyState icon="star" title="No favourites yet" body="Open a card and tap the star to pin it to your Home screen." action={{ label: 'Choose favourites', onPress: () => setSheet('favourites') }} />
        ) : (
          <EmptyState icon="wallet" title="Your wallet is empty" body="Add a demo credential to see how cards look and work." action={{ label: 'Add a card', onPress: () => setSheet('addCard') }} />
        )}
      </Screen>

      <View style={[styles.fabWrap, { bottom: 24 + insets.bottom }]} pointerEvents="box-none">
        <Button label="Add" icon="plusCircle" onPress={() => setSheet('addCard')} fullWidth={false} style={styles.fab} />
      </View>

      <BottomSheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet ? WALLET_SHEET_TITLES[sheet] : ''}>
        {sheet === 'options' ? <OptionsSheet onPick={setSheet} /> : null}
        {sheet === 'addCard' ? <AddCardSheet /> : null}
        {sheet === 'favourites' ? <ManageFavouritesSheet /> : null}
        {sheet === 'about' ? <AboutCardsSheet /> : null}
      </BottomSheet>
    </View>
  );
}

function Header({ onOptions }: { onOptions: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={[styles.bar, { borderBottomColor: colors.border }]}>
        <View style={{ width: 40 }} />
        <Text variant="headline" accessibilityRole="header" style={{ flex: 1, textAlign: 'center' }}>
          Wallet
        </Text>
        <PressableScale onPress={onOptions} accessibilityRole="button" accessibilityLabel="Wallet options" style={styles.headerBtn} hitSlop={6}>
          <Icon name="more" size={24} color={colors.text} />
        </PressableScale>
      </View>
    </View>
  );
}

function FilterChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const { colors, radii } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
      style={[styles.chip, { borderRadius: radii.pill, backgroundColor: on ? colors.brandSoft : colors.surface, borderColor: on ? colors.brand : colors.border }]}
    >
      <Text variant="callout" style={{ color: on ? colors.brand : colors.text2, fontFamily: 'PlusJakartaSans_700Bold' }}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  chips: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  chip: { height: 40, paddingHorizontal: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  fabWrap: { position: 'absolute', right: 20, alignItems: 'flex-end' },
  fab: { boxShadow: '0px 18px 40px rgba(15,30,33,0.18)', paddingHorizontal: 22 },
});
