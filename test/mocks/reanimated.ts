/**
 * Minimal Reanimated stand-in for Jest.
 *
 * Why not the package's own `react-native-reanimated/mock`? In Reanimated 4.7
 * that mock imports the real entry point, which initialises the native CSS
 * animation module and throws under Jest. Our components use only a handful
 * of Reanimated APIs, so we mock exactly those: animations resolve
 * instantly to their target value, and animated components render as plain
 * React Native components. If a component starts using an API that isn't
 * listed here, its test will fail loudly rather than pass silently.
 */
import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';

type Updater<T> = T | ((prev: T) => T);

function makeSharedValue<T>(initial: T) {
  let current = initial;
  return {
    get value() {
      return current;
    },
    set value(v: T) {
      current = v;
    },
    get: () => current,
    set: (v: Updater<T>) => {
      current = typeof v === 'function' ? (v as (p: T) => T)(current) : v;
    },
  };
}

const identityAnimation = <T>(toValue: T) => toValue;

// Keep `Pressable` referenced so createAnimatedComponent(Pressable) stays a real pressable.
void Pressable;

const Animated = {
  View,
  Text,
  createAnimatedComponent: <P extends object>(c: ComponentType<P>) => c,
};

export default Animated;
export const { View: AnimatedView, Text: AnimatedText, createAnimatedComponent } = Animated;
export const useSharedValue = <T>(initial: T) => makeSharedValue(initial);
export const useAnimatedStyle = (fn: () => object) => fn();
export const withTiming = identityAnimation;
export const withSpring = identityAnimation;
export const withRepeat = identityAnimation;
export const interpolateColor = (_p: number, _input: number[], output: string[]) => output[0];
export const runOnJS = <A extends unknown[]>(fn: (...args: A) => void) => fn;
export const Easing = { inOut: (e: unknown) => e, ease: (t: number) => t, linear: (t: number) => t };
// Common Reanimated entering/exiting animations used in the app; harmless no-ops in tests.
const anim = () => ({ duration: () => anim() });
export const FadeIn = anim();
export const FadeOut = anim();
export const ZoomIn = anim();
