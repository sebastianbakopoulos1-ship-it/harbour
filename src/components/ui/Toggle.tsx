import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme';

const TRACK_W = 51;
const TRACK_H = 31;
const THUMB = 27;

/**
 * iOS-style switch with an animated thumb and track colour.
 * Exposed to assistive tech as a `switch` with a checked state.
 */
export function Toggle({
  value,
  onValueChange,
  label,
  disabled = false,
  testID,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  testID?: string;
}) {
  const { colors, motion } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, { duration: motion.base }));
  }, [value, progress, motion.base]);

  const off = colors.surface3;
  const on = colors.success;
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [off, on]),
  }));
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * (TRACK_W - THUMB - 4) }],
  }));

  return (
    <Pressable
      testID={testID}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <Animated.View style={[{ width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, padding: 2 }, track]}>
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
            },
            thumb,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
