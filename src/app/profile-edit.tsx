import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Banner, Button, PressableScale, Screen, ScreenHeader, Text, TextField } from '@/components/ui';
import { useAppData } from '@/store/appData';
import { useTheme } from '@/theme';
import type { Profile } from '@/types';
import { initials } from '@/utils/format';
import { formatAuMobile, validateAuMobile, validateEmail } from '@/utils/validation';

type Errors = Partial<Record<keyof Profile, string>>;

/**
 * Edit the holder's details and photo. Everything here is saved on this device
 * only (the photo is kept as a local data URL in the app's own storage) and is
 * never uploaded anywhere.
 */
export default function ProfileEditScreen() {
  const { colors, spacing, radii } = useTheme();
  const profile = useAppData((s) => s.profile);
  const updateProfile = useAppData((s) => s.updateProfile);

  const [draft, setDraft] = useState<Profile>(profile);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickPhoto = async () => {
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Photo access needed', 'Allow photo access to choose a picture.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    // Store as a self-contained data URL so it persists on device without a file path.
    const uri = asset.base64 ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}` : asset.uri;
    set('photoUri', uri);
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!draft.firstName.trim()) e.firstName = 'Required';
    if (!draft.lastName.trim()) e.lastName = 'Required';
    const emailErr = validateEmail(draft.email);
    if (emailErr) e.email = emailErr;
    const phoneErr = validateAuMobile(draft.phone);
    if (phoneErr) e.phone = phoneErr;
    if (draft.address.trim().length < 6) e.address = 'Enter a full address';
    if (!draft.dob.trim()) e.dob = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    updateProfile({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: formatAuMobile(draft.phone),
      address: draft.address.trim(),
    });
    router.back();
  };

  return (
    <Screen header={<ScreenHeader title="Edit details" back />}>
      <View style={styles.photoRow}>
        <PressableScale onPress={pickPhoto} accessibilityRole="button" accessibilityLabel="Change photo">
          {draft.photoUri ? (
            <Image source={{ uri: draft.photoUri }} style={[styles.avatar, { borderColor: colors.border }]} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.brand }]}>
              <Text variant="title" style={{ color: colors.onBrand }}>
                {initials(draft.firstName || '?', draft.lastName || '')}
              </Text>
            </View>
          )}
        </PressableScale>
        <View style={{ gap: 6 }}>
          <Button label={draft.photoUri ? 'Change photo' : 'Add photo'} icon="pencil" variant="secondary" size="sm" fullWidth={false} onPress={pickPhoto} />
          {draft.photoUri ? (
            <PressableScale onPress={() => set('photoUri', undefined)} accessibilityRole="button" accessibilityLabel="Remove photo" hitSlop={6}>
              <Text variant="callout" tone="danger" style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }}>
                Remove photo
              </Text>
            </PressableScale>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <TextField label="First name" value={draft.firstName} onChangeText={(t) => set('firstName', t)} error={errors.firstName} autoCapitalize="words" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Last name" value={draft.lastName} onChangeText={(t) => set('lastName', t)} error={errors.lastName} autoCapitalize="words" />
        </View>
      </View>
      <TextField label="Email" value={draft.email} onChangeText={(t) => set('email', t)} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="off" />
      <TextField label="Mobile" value={draft.phone} onChangeText={(t) => set('phone', t)} error={errors.phone} keyboardType="phone-pad" hint="Australian mobile, e.g. 0400 000 000" />
      <TextField label="Residential address" value={draft.address} onChangeText={(t) => set('address', t)} error={errors.address} />
      <TextField label="Date of birth" value={draft.dob} onChangeText={(t) => set('dob', t)} error={errors.dob} hint="YYYY-MM-DD" autoCapitalize="none" />

      <View style={{ marginTop: spacing[2], marginBottom: spacing[4] }}>
        <Banner tone="info">Your details and photo are saved on this device only and are never uploaded.</Banner>
      </View>

      <Button label="Save changes" onPress={save} />
      <View style={{ height: spacing[8], borderRadius: radii.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 88, height: 110, borderRadius: 14, borderWidth: 1 },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
});
