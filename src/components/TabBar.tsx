import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text, type IconName } from '@/components/ui';
import { useTheme } from '@/theme';

/**
 * The subset of expo-router's tab-bar props the bar actually uses. Typed
 * locally (it structurally matches the `BottomTabBarProps` expo-router passes
 * to `tabBar`) so the component needn't import deep navigator types.
 */
interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
}

const TAB_ICONS: Record<string, { icon: IconName; label: string }> = {
  index: { icon: 'home', label: 'Home' },
  services: { icon: 'store', label: 'Services' },
  wallet: { icon: 'wallet', label: 'Wallet' },
};

/**
 * Harbour's bottom tab bar. Custom (rather than the OS default) so it matches
 * the design on iOS, Android and web: a translucent bar, a tinted active icon
 * and a short top indicator on the selected tab.
 */
export function TabBar({ state, navigateToTab }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const meta = TAB_ICONS[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const color = focused ? colors.brand : colors.text3;

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              if (!focused) navigateToTab(route.key);
            }}
            accessibilityRole={Platform.OS === 'web' ? 'tab' : 'button'}
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            style={styles.tab}
          >
            {focused ? <View style={[styles.indicator, { backgroundColor: colors.brand }]} /> : null}
            <Icon name={meta.icon} size={25} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            <Text variant="label" style={{ color, letterSpacing: 0, fontSize: 11 }}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 4 },
  indicator: { position: 'absolute', top: -8, width: 28, height: 3, borderRadius: 2 },
});
