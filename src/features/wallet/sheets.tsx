import { StyleSheet } from 'react-native';

import { Button, Card, EmptyState, Icon, ListGroup, ListRow, PressableScale, Text } from '@/components/ui';
import { useAppData } from '@/store/appData';
import { useTheme } from '@/theme';

/** Which wallet sheet is open (if any). */
export type WalletSheet = 'options' | 'addCard' | 'favourites' | 'about' | null;

export const WALLET_SHEET_TITLES: Record<Exclude<WalletSheet, null>, string> = {
  options: 'Wallet',
  addCard: 'Add a demo card',
  favourites: 'Favourites',
  about: 'About demo cards',
};

/** ⋯ menu: links to the other sheets. */
export function OptionsSheet({ onPick }: { onPick: (sheet: WalletSheet) => void }) {
  return (
    <ListGroup>
      <ListRow icon="star" iconTone="accent" title="Manage favourites" onPress={() => onPick('favourites')} />
      <ListRow icon="plus" title="Add a demo card" onPress={() => onPick('addCard')} />
      <ListRow icon="info" iconTone="info" title="About demo cards" onPress={() => onPick('about')} />
    </ListGroup>
  );
}

/** Star / unstar the wallet's cards. Starred cards appear on Home. */
export function ManageFavouritesSheet() {
  const { colors } = useTheme();
  // Select the stable array and filter in render — filtering inside the
  // selector would return a new array each call and loop the store subscription.
  const credentials = useAppData((s) => s.credentials);
  const cards = credentials.filter((c) => c.inWallet);
  const toggleFavourite = useAppData((s) => s.toggleFavourite);

  if (cards.length === 0) {
    return <EmptyState icon="wallet" title="No cards yet" body="Add a demo card to your wallet first." />;
  }

  return (
    <>
      <Text variant="body" tone="secondary" style={{ marginBottom: 12 }}>
        Starred cards appear at the top of Home.
      </Text>
      <ListGroup>
        {cards.map((c) => (
          <ListRow
            key={c.id}
            title={c.title}
            subtitle={c.kind}
            trailing={
              <PressableScale
                onPress={() => toggleFavourite(c.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: c.fav }}
                accessibilityLabel={`${c.fav ? 'Unstar' : 'Star'} ${c.title}`}
                style={styles.starBtn}
                hitSlop={6}
              >
                <Icon name="star" size={24} color={c.fav ? colors.accent : colors.text3} filled={c.fav} />
              </PressableScale>
            }
          />
        ))}
      </ListGroup>
    </>
  );
}

/** Add a demo card the wallet doesn't already hold. */
export function AddCardSheet() {
  const credentials = useAppData((s) => s.credentials);
  const addable = credentials.filter((c) => !c.inWallet);
  const setInWallet = useAppData((s) => s.setInWallet);

  if (addable.length === 0) {
    return <EmptyState icon="checkCircle" title="You’ve added every demo card" body="Remove a card from its details page to add it again here." />;
  }

  return (
    <>
      <ListGroup>
        {addable.map((c) => (
          <ListRow key={c.id} title={c.title} subtitle={c.kind} trailing={<Button label="Add" size="sm" fullWidth={false} onPress={() => setInWallet(c.id, true)} />} />
        ))}
      </ListGroup>
      <Text variant="caption" tone="tertiary" align="center" style={{ marginTop: 24 }}>
        Every card is a fictional demonstration and is clearly marked as such.
      </Text>
    </>
  );
}

export function AboutCardsSheet() {
  return (
    <Card style={{ gap: 12 }}>
      <Text variant="body" tone="secondary">
        The cards in your wallet are demonstrations only. Every name, number and date is fictional.
      </Text>
      <Text variant="body" tone="secondary">
        They are not licences or identity documents, cannot be scanned or verified, and must never be shown as proof of anything.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  starBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
