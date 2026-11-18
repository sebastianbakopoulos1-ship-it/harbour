import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { motion, useTheme } from '@/theme';

const OFFSCREEN = 900;

/**
 * A bottom sheet that slides up over the screen with a tappable scrim.
 * The content scrolls, and the sheet animates out before unmounting so the
 * close feels as smooth as the open. Used for the wallet's manage/add flows.
 */
export function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(OFFSCREEN);
  const scrim = useSharedValue(0);

  useEffect(() => {
    if (open) {
      translateY.set(withTiming(0, { duration: motion.base }));
      scrim.set(withTiming(1, { duration: motion.fast }));
    }
  }, [open, translateY, scrim]);

  const close = () => {
    scrim.set(withTiming(0, { duration: motion.fast }));
    translateY.set(withTiming(OFFSCREEN, { duration: motion.fast }, (finished) => {
      if (finished) runOnJS(onClose)();
    }));
  };

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.get() }));

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={close} accessibilityViewIsModal>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, scrimStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" accessibilityLabel="Close" />
        </Animated.View>

        <Animated.View style={[styles.sheet, { backgroundColor: colors.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingBottom: insets.bottom + 24 }, sheetStyle]}>
          <View style={[styles.grab, { backgroundColor: colors.surface3 }]} />
          <View style={styles.header}>
            <Text variant="headline" style={{ flex: 1 }} accessibilityRole="header">
              {title}
            </Text>
            <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Close" style={styles.closeBtn} hitSlop={6}>
              <Icon name="x" size={20} color={colors.text} strokeWidth={2.2} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: { maxHeight: '92%', boxShadow: '0px -8px 40px rgba(0,0,0,0.3)' },
  grab: { width: 36, height: 5, borderRadius: 3, alignSelf: 'center', marginTop: 8, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  body: { paddingHorizontal: 20, paddingTop: 8 },
});
