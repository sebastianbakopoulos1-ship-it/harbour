import { View } from 'react-native';

import { Banner, ListGroup, ListRow, Screen, ScreenHeader, Text } from '@/components/ui';
import { useTheme } from '@/theme';

/** Help and support: entry points for feedback and reporting a problem. Forms arrive in a later phase. */
export default function HelpScreen() {
  const { spacing } = useTheme();
  return (
    <Screen header={<ScreenHeader title="Help and support" back />}>
      <Text variant="display" style={{ marginTop: spacing[2], marginBottom: spacing[2] }}>
        Want to share feedback or tell us about a problem?
      </Text>
      <Text variant="body" tone="secondary" style={{ marginBottom: spacing[4] }}>
        Choose what you’d like to do
      </Text>

      <ListGroup>
        <ListRow icon="message" title="Share feedback" subtitle="Ideas, praise or things to improve" onPress={() => undefined} />
        <ListRow icon="alert" iconTone="warning" title="Report a problem" subtitle="Something in the app isn’t working" onPress={() => undefined} />
        <ListRow icon="alertCircle" iconTone="danger" title="Make a formal complaint" subtitle="Placeholder · not in this demo" />
      </ListGroup>

      <View style={{ marginTop: spacing[6] }}>
        <Banner tone="info">
          Harbour is a demo. There’s no phone line or support team — anything you send stays on this device.
        </Banner>
      </View>
    </Screen>
  );
}
