import { View } from 'react-native';

import { toneColors, useTheme, type Tone } from '@/theme';

import { Icon, type IconName } from './Icon';

/** An icon on a soft tinted tile. Used at the start of list rows, empty states and dialogs. */
export function Glyph({
  icon,
  tone = 'brand',
  size = 36,
  round = false,
}: {
  icon: IconName;
  tone?: Tone;
  size?: number;
  round?: boolean;
}) {
  const { colors, radii } = useTheme();
  const { fg, bg } = toneColors(colors, tone);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : radii.md,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.55)} color={fg} />
    </View>
  );
}
