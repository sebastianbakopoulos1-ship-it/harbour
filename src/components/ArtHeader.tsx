import { Image } from 'expo-image';
import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Icon, type IconName } from '@/components/ui';
import { useTheme } from '@/theme';

/**
 * Header artwork for category and featured cards.
 *
 * With a `photo` seed it shows a real royalty-free photograph (Lorem Picsum,
 * which serves free-licensed Unsplash images), with a soft dark scrim so the
 * title stays legible and the topic icon sits on top. Without one it falls back
 * to a generated hue-based gradient. No copyrighted or third-party-branded
 * imagery is used.
 */
export function ArtHeader({ hue, icon, height = 120, photo, style }: { hue: number; icon: IconName; height?: number; photo?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const from = `hsl(${hue}, 52%, 30%)`;

  const badge = (
    <View style={[styles.badge]}>
      <Icon name={icon} size={Math.round(height / 3.4)} color="#FFFFFF" strokeWidth={1.7} />
    </View>
  );

  if (photo) {
    return (
      <View style={[{ height, overflow: 'hidden', backgroundColor: from }, style]} accessible={false}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${encodeURIComponent(photo)}/720/420` }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
        />
        <View style={styles.scrim} />
        <View style={[styles.accent, { backgroundColor: colors.brand }]} />
        {badge}
      </View>
    );
  }

  return <GeneratedArt hue={hue} icon={icon} height={height} style={style} badge={badge} accent={colors.brand} />;
}

function GeneratedArt({ hue, height, style, badge, accent }: { hue: number; icon: IconName; height: number; style?: StyleProp<ViewStyle>; badge: ReactNode; accent: string }) {
  const id = useMemo(() => `art${Math.round(hue)}`, [hue]);
  const from = `hsl(${hue}, 52%, 30%)`;
  const to = `hsl(${(hue + 28) % 360}, 58%, 46%)`;
  return (
    <View style={[{ height, overflow: 'hidden' }, style]} accessible={false}>
      <Svg width="100%" height={height} viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect width={320} height={120} fill={`url(#${id})`} />
        <Circle cx={285} cy={-5} r={95} fill="#FFFFFF" opacity={0.1} />
        <Circle cx={300} cy={20} r={55} fill="#FFFFFF" opacity={0.1} />
        <Circle cx={30} cy={140} r={70} fill="#000000" opacity={0.1} />
        <Path d="M0 100 Q 40 88 80 100 T 160 100 T 240 100 T 320 100 V120 H0Z" fill="#FFFFFF" opacity={0.08} />
      </Svg>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      {badge}
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,16,30,0.28)' },
  accent: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, opacity: 0.9 },
  badge: { position: 'absolute', right: 16, bottom: 16, padding: 10, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)' },
});
