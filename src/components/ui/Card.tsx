import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, type SpacingKey } from '@/theme';

import { PressableScale } from './PressableScale';

export interface CardProps {
  children: ReactNode;
  /** Inner padding from the spacing scale. Use 0 for edge-to-edge content (lists, images). */
  padding?: SpacingKey;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Surface container: rounded, hairline border, subtle shadow. Becomes pressable when given `onPress`. */
export function Card({ children, padding = 4, onPress, accessibilityLabel, style, testID }: CardProps) {
  const { colors, radii, spacing, shadows } = useTheme();
  const surface: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[padding],
    boxShadow: shadows.sm,
    overflow: 'hidden',
  };
  if (onPress) {
    return (
      <PressableScale
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        scaleTo={0.985}
        style={[surface, style]}
      >
        {children}
      </PressableScale>
    );
  }
  return (
    <View testID={testID} style={[surface, style]}>
      {children}
    </View>
  );
}
