import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { LogoMark, Text } from '@/components/ui';
import { credentialPalettes } from '@/theme';
import type { Credential } from '@/types';
import { formatDate } from '@/utils/dates';

/**
 * A wallet card. Uses Harbour's own branding and fictional data.
 *
 * Two original looks, chosen from the credential kind:
 *  - "licence"  — a dark charcoal card with a red accent wave (driver/photo/
 *                 licence cards), the official-feeling style.
 *  - "membership" — a colourful gradient card (library, gym, club passes).
 *
 * `mini` is the compact version shown in carousels.
 */
export function CredentialCard({ credential: c, holderName, photoUri, mini = false }: { credential: Credential; holderName: string; photoUri?: string; mini?: boolean }) {
  const isLicence = /licence|card/i.test(c.kind);
  return isLicence ? (
    <LicenceCard credential={c} holderName={holderName} photoUri={photoUri} mini={mini} />
  ) : (
    <MembershipCard credential={c} holderName={holderName} mini={mini} />
  );
}

/* ---------------------------------------------------------------------------
 * Licence style — dark card, red accent wave, Harbour mark, holder photo.
 * ------------------------------------------------------------------------- */
function LicenceCard({ credential: c, holderName, photoUri, mini }: { credential: Credential; holderName: string; photoUri?: string; mini: boolean }) {
  const red = '#D7153A';
  const redDark = '#9E0F2B';
  const bg = '#272C36';
  const showPhoto = c.photo && !!photoUri;

  return (
    <View style={[styles.card, mini && styles.mini, { backgroundColor: bg }]} accessible accessibilityRole="image" accessibilityLabel={c.title}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="none">
        <Path d="M0 182 Q 90 160 180 180 T 320 172 V200 H0 Z" fill={redDark} />
        <Path d="M0 192 Q 80 170 170 188 T 320 182 V200 H0 Z" fill={red} />
      </Svg>

      <View style={styles.licenceRow}>
        <View style={{ flex: 1 }}>
          <Text variant="label" style={styles.kindDark} numberOfLines={1}>
            {c.kind}
          </Text>
          <Text variant={mini ? 'headline' : 'title'} style={styles.nameDark} numberOfLines={2}>
            {c.title}
          </Text>
          <View style={styles.licenceBottom}>
            {!mini ? (
              <View>
                <Text variant="label" style={styles.fieldLabelDark}>
                  Holder
                </Text>
                <Text variant="bodyStrong" style={styles.fieldValueDark} numberOfLines={1}>
                  {holderName}
                </Text>
              </View>
            ) : null}
            <Text variant="bodyStrong" style={[styles.fieldValueDark, { marginTop: mini ? 0 : 8 }]}>
              Expiry: {formatDate(c.expiry)}
            </Text>
          </View>
        </View>

        <View style={styles.licenceRight}>
          {showPhoto ? (
            <Image source={{ uri: photoUri }} style={[styles.photo, mini && styles.photoMini]} contentFit="cover" />
          ) : null}
          <LogoMark size={mini ? 22 : 28} />
        </View>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------------------------
 * Membership style — colourful gradient.
 * ------------------------------------------------------------------------- */
function MembershipCard({ credential: c, holderName, mini }: { credential: Credential; holderName: string; mini: boolean }) {
  const [from, to, accent] = credentialPalettes[c.style];
  const gradId = `cred-${c.id}`;

  return (
    <View style={[styles.card, mini && styles.mini]} accessible accessibilityRole="image" accessibilityLabel={c.title}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect width={320} height={200} fill={`url(#${gradId})`} />
        <Circle cx={290} cy={-10} r={120} fill={accent} opacity={0.35} />
        <Circle cx={300} cy={10} r={70} fill={accent} opacity={0.35} />
        <Path d="M0 170 Q 40 155 80 170 T 160 170 T 240 170 T 320 170 V200 H0Z" fill="#FFFFFF" opacity={0.06} />
      </Svg>

      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text variant="label" style={styles.kind} numberOfLines={1}>
            {c.kind}
          </Text>
          <Text variant={mini ? 'headline' : 'title'} style={styles.name} numberOfLines={2}>
            {c.title}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={{ flex: 1 }}>
          {!mini ? (
            <>
              <Text variant="label" style={styles.fieldLabel}>
                Member
              </Text>
              <Text variant="bodyStrong" style={styles.fieldValue} numberOfLines={1}>
                {holderName}
              </Text>
            </>
          ) : null}
          <Text variant="label" style={[styles.fieldLabel, !mini && { marginTop: 10 }]}>
            Expires
          </Text>
          <Text variant="bodyStrong" style={styles.fieldValue}>
            {formatDate(c.expiry)}
          </Text>
        </View>
        <LogoMark size={mini ? 24 : 28} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', aspectRatio: 1.586, borderRadius: 20, overflow: 'hidden', padding: 20, justifyContent: 'space-between', boxShadow: '0px 6px 18px rgba(15,30,33,0.18)' },
  mini: { padding: 16, borderRadius: 18 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  // Membership (on gradient)
  kind: { color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  name: { color: '#FFFFFF', marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  fieldLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 0.8 },
  fieldValue: { color: '#FFFFFF', marginTop: 2 },
  // Licence (on dark)
  licenceRow: { flex: 1, flexDirection: 'row', gap: 14 },
  licenceRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  photo: { width: 64, height: 80, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
  photoMini: { width: 46, height: 58, borderRadius: 6 },
  kindDark: { color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  nameDark: { color: '#FFFFFF', marginTop: 2 },
  licenceBottom: { marginTop: 'auto', paddingTop: 10 },
  fieldLabelDark: { color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 0.8 },
  fieldValueDark: { color: '#FFFFFF', marginTop: 2 },
});
