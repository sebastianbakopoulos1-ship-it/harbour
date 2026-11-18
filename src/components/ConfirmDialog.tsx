import { Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { Button, Glyph, Text, type IconName } from '@/components/ui';
import { useTheme } from '@/theme';

/** Describes a confirmation prompt. `null` means no dialog is showing. */
export interface ConfirmState {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  danger?: boolean;
  icon?: IconName;
}

/**
 * A centred confirm/cancel dialog. Driven by a `ConfirmState` so a screen can
 * trigger it from any action, and it dismisses on either choice.
 */
export function ConfirmDialog({ state, onDismiss }: { state: ConfirmState | null; onDismiss: () => void }) {
  const { colors } = useTheme();
  const visible = state !== null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss} accessibilityViewIsModal>
      {state ? (
        <View style={styles.center}>
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} />
          <Animated.View entering={ZoomIn.duration(200)} style={[styles.dialog, { backgroundColor: colors.surface, borderRadius: 20 }]} accessibilityRole="alert">
            <Glyph icon={state.icon ?? (state.danger ? 'alert' : 'info')} tone={state.danger ? 'danger' : 'brand'} size={48} round />
            <Text variant="headline" align="center" style={{ marginTop: 12 }}>
              {state.title}
            </Text>
            <Text variant="body" tone="secondary" align="center" style={{ marginTop: 8, marginBottom: 20 }}>
              {state.body}
            </Text>
            <View style={styles.actions}>
              <Button label="Cancel" variant="secondary" onPress={onDismiss} style={{ flex: 1 }} />
              <Button
                label={state.confirmLabel}
                variant={state.danger ? 'danger' : 'primary'}
                onPress={() => {
                  state.onConfirm();
                  onDismiss();
                }}
                style={{ flex: 1 }}
              />
            </View>
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  dialog: { width: '100%', maxWidth: 360, padding: 24, alignItems: 'center', boxShadow: '0px 18px 40px rgba(0,0,0,0.3)' },
  actions: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
});
