import { useEffect } from 'react';
import { Platform, type DimensionValue } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme';

// Hide decorative content from assistive tech with the right prop per platform
// (web uses aria-hidden; native uses importantForAccessibility).
const decorative = Platform.OS === 'web' ? { 'aria-hidden': true } : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };

/**
 * Loading placeholder that gently pulses. Shape it like the content it stands
 * in for so the layout doesn't jump when real data arrives.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius,
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
}) {
  const { colors, radii } = useTheme();
  const pulse = useSharedValue(0.55);

  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [pulse]);

  const animated = useAnimatedStyle(() => ({ opacity: pulse.get() }));

  return (
    <Animated.View {...decorative} style={[{ width, height, borderRadius: radius ?? radii.md, backgroundColor: colors.surface3 }, animated]} />
  );
}
