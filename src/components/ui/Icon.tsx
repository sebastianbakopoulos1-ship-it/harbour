import { memo } from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

/**
 * Harbour's icon set: 24×24 line icons drawn with SVG paths (stroke-based).
 * Owning the paths means no third-party icon dependency to keep compatible
 * with each React Native release, and every icon shares one visual style.
 */
const paths = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  store: '<path d="M3 9.5 4.5 4h15L21 9.5"/><path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/><path d="M10 20v-5h4v5"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 3.5h10"/>',
  car: '<path d="M5 17h14M5 17a2 2 0 1 1-4 0v-4l2.2-5.2A2 2 0 0 1 5 6.5h14a2 2 0 0 1 1.8 1.3L23 13v4a2 2 0 1 1-4 0"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 13h18"/>',
  receipt: '<path d="M6 2.5h12a1 1 0 0 1 1 1V21l-3-2-2 2-2-2-2 2-2-2-3 2V3.5a1 1 0 0 1 1-1Z"/><path d="M9 7.5h6M9 11.5h6M9 15.5h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  pencil: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 13.5h3"/>',
  wifiOff: '<path d="M2 8.8a15 15 0 0 1 4.2-2.6M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 3.5-2.2M15.6 10.9a10 10 0 0 1 3.4 2M8.5 16.4a5 5 0 0 1 7 0M12 20h.01M3 3l18 18"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  plusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  alertCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  rotate: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/>',
  dollar: '<path d="M12 2v20"/><path d="M17 6.5H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  fingerprint: '<path d="M12 11v3a8 8 0 0 1-1.5 4.5M8.5 7.6A5 5 0 0 1 17 11v1.5M7 11a5 5 0 0 1 .3-1.7M7 14.5a12 12 0 0 1-1 4M15.7 15.5a17 17 0 0 1-1.2 5.5M4 8.5A9 9 0 0 1 20.3 9"/>',
  megaphone: '<path d="m3 11 15-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.5-4.8A8 8 0 1 1 21 12Z"/>',
  more: '<circle cx="12" cy="5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  piggy: '<path d="M19 9.5c1 .8 1.5 2 1.5 3.5h1.5v3h-2l-1.5 2.5V21h-3v-1.5h-5V21h-3v-2.6A6.5 6.5 0 0 1 8 6h4.5L16 4v3.2"/><circle cx="15.5" cy="11" r=".7" fill="currentColor"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h14M9 7h7"/>',
  house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M9.5 20v-5.5h5V20"/>',
  heart: '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 6.3a4.5 4.5 0 0 1 8 3.2C20 15.4 12 20 12 20Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  fish: '<path d="M6.5 12c3-5 10-6 14.5 0-4.5 6-11.5 5-14.5 0Z"/><path d="M6.5 12 2 8v8z"/><circle cx="17" cy="11" r=".6" fill="currentColor"/>',
  thumbUp: '<path d="M7 10v11H3V10z"/><path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.1 21H7"/>',
  thumbDown: '<path d="M17 14V3h4v11z"/><path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 5.9 3H17"/>',
  backspace: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"/><path d="m17 9-6 6M11 9l6 6"/>',
} as const;

export type IconName = keyof typeof paths;
export const iconNames = Object.keys(paths) as IconName[];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Fill the shape with the stroke colour (e.g. a "starred" star). */
  filled?: boolean;
}

/* ---------------------------------------------------------------------------
 * We keep icons as compact SVG markup (easy to read and edit), and parse each
 * one ONCE into element specs. Rendering real <Path>/<Circle>/<Rect>
 * components behaves identically on iOS, Android and web — unlike `SvgXml`,
 * which on web leaks its raw markup and native-only props onto the DOM.
 * ------------------------------------------------------------------------- */
type Shape =
  | { kind: 'path'; d: string; fill?: string }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill?: string }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

function parseShapes(markup: string): Shape[] {
  const shapes: Shape[] = [];
  for (const [, tag, attrText] of markup.matchAll(/<(path|circle|rect)\s([^>]*?)\/>/g)) {
    const a: Record<string, string> = {};
    for (const [, k, v] of attrText.matchAll(/([a-z-]+)="([^"]*)"/g)) a[k] = v;
    if (tag === 'path') shapes.push({ kind: 'path', d: a.d, fill: a.fill });
    else if (tag === 'circle') shapes.push({ kind: 'circle', cx: +a.cx, cy: +a.cy, r: +a.r, fill: a.fill });
    else shapes.push({ kind: 'rect', x: +a.x, y: +a.y, width: +a.width, height: +a.height, rx: a.rx ? +a.rx : undefined });
  }
  return shapes;
}

const shapes = Object.fromEntries(Object.entries(paths).map(([k, v]) => [k, parseShapes(v)])) as Record<IconName, Shape[]>;

/** Native and web hide decorative graphics with different props. */
const decorative = Platform.OS === 'web' ? { 'aria-hidden': true } : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };

function IconBase({ name, size = 22, color, strokeWidth = 1.9, filled = false }: IconProps) {
  const { colors } = useTheme();
  const stroke = color ?? colors.text;
  const baseFill = filled ? stroke : 'none';
  // `fill="currentColor"` in the markup (small dots) means "same as the stroke".
  const fillFor = (f?: string) => (f === 'currentColor' ? stroke : baseFill);
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...decorative}
    >
      {shapes[name].map((s, i) =>
        s.kind === 'path' ? (
          <Path key={i} d={s.d} fill={fillFor(s.fill)} />
        ) : s.kind === 'circle' ? (
          <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={fillFor(s.fill)} />
        ) : (
          <Rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} rx={s.rx} fill={baseFill} />
        ),
      )}
    </Svg>
  );
}

export const Icon = memo(IconBase);
