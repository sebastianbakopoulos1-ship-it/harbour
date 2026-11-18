import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Text } from '@/components/ui';

/**
 * A QR-like pattern that is deliberately NOT a scannable code: it has no format
 * or version information and its modules are random. It exists to show how a
 * credential screen would look, and carries a "DEMO" label, so it can never be
 * used for verification.
 */
export function DemoQR({ seed, size = 172 }: { seed: string; size?: number }) {
  const modules = useMemo(() => buildModules(seed), [seed]);
  const N = 25;
  const cell = size / N;

  return (
    <View style={[styles.wrap, { width: size + 24, height: size + 24 }]} accessible accessibilityRole="image" accessibilityLabel="Non-functional demo QR pattern">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {modules.map(([x, y], i) => (
          <Rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill="#0F1E21" />
        ))}
        {[[0, 0], [N - 7, 0], [0, N - 7]].map(([fx, fy], i) => (
          <Finder key={`f${i}`} x={fx} y={fy} cell={cell} />
        ))}
      </Svg>
      <View style={[styles.void, { left: size / 2 + 12 - 22, top: size / 2 + 12 - 12 }]}>
        <Text variant="label" style={styles.voidText}>
          DEMO
        </Text>
      </View>
    </View>
  );
}

function Finder({ x, y, cell }: { x: number; y: number; cell: number }) {
  return (
    <>
      <Rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} rx={cell} fill="#0F1E21" />
      <Rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} rx={cell * 0.6} fill="#FFFFFF" />
      <Rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} rx={cell * 0.5} fill="#0F1E21" />
    </>
  );
}

function buildModules(seed: string): [number, number][] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
  const N = 25;
  const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const out: [number, number][] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y) || (x > 8 && x < 16 && y > 9 && y < 15)) continue;
      if (rnd() > 0.52) out.push([x, y]);
    }
  }
  return out;
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' },
  void: { position: 'absolute', backgroundColor: '#FFFFFF', borderColor: '#8A1F14', borderWidth: 2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  voidText: { color: '#8A1F14', fontSize: 12, letterSpacing: 1 },
});
