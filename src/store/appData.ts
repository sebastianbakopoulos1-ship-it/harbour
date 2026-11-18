import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSeedData } from '@/data/seed';
import type { AppData, AppNotification, HomeServiceKey, Profile, Vehicle } from '@/types';
import { addYear, formatDate, toLocalIso } from '@/utils/dates';

/**
 * The app's data store.
 *
 * This is the local implementation of Harbour's repository layer: screens read
 * and mutate domain data through these actions, never by touching storage
 * directly. It persists to AsyncStorage (on-device, non-secret). In Phase 8 a
 * Supabase-backed store with the same action names drops in behind the UI.
 *
 * `version` + `migrate` let the data shape evolve without wiping saved data.
 */
const uid = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

export interface AppDataState extends AppData {
  // --- Vehicles ---
  addVehicle: (v: Omit<Vehicle, 'id' | 'ctp'>) => Vehicle;
  removeVehicle: (id: string) => void;
  renewVehicle: (id: string) => void;
  // --- Fines ---
  payFine: (id: string) => void;
  // --- Credentials ---
  toggleFavourite: (id: string) => void;
  setInWallet: (id: string, inWallet: boolean) => void;
  // --- Notifications ---
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  // --- Profile & settings ---
  updateProfile: (profile: Profile) => void;
  togglePref: (key: keyof AppData['settings']['prefs']) => void;
  setHomeOrder: (order: HomeServiceKey[]) => void;
  // --- Demo ---
  resetDemoData: () => void;
}

export const APP_DATA_STORAGE_KEY = 'harbour.appData';

export const useAppData = create<AppDataState>()(
  persist(
    (set, get) => ({
      ...createSeedData(),

      addVehicle: (input) => {
        const vehicle: Vehicle = { id: uid('v'), ctp: 'Demo Insurer A', ...input };
        set((s) => ({ vehicles: [...s.vehicles, vehicle] }));
        return vehicle;
      },
      removeVehicle: (id) => set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) })),
      renewVehicle: (id) =>
        set((s) => {
          const vehicles = s.vehicles.map((v) => (v.id === id ? { ...v, expiry: addYear(v.expiry) } : v));
          const renewed = vehicles.find((v) => v.id === id);
          if (!renewed) return {};
          const note: AppNotification = {
            id: uid('n'),
            type: 'registration',
            title: 'Registration renewed',
            body: `${renewed.plate} is now registered until ${formatDate(renewed.expiry)} (simulated).`,
            at: new Date().toISOString(),
            read: false,
            link: { screen: 'vehicle', id: renewed.id },
          };
          return { vehicles, notifications: [note, ...s.notifications] };
        }),

      payFine: (id) =>
        set((s) => ({
          fines: s.fines.map((f) => (f.id === id ? { ...f, status: 'paid' as const, paidOn: toLocalIso(new Date()) } : f)),
        })),

      toggleFavourite: (id) =>
        set((s) => ({ credentials: s.credentials.map((c) => (c.id === id ? { ...c, fav: !c.fav } : c)) })),
      setInWallet: (id, inWallet) =>
        set((s) => ({ credentials: s.credentials.map((c) => (c.id === id ? { ...c, inWallet, fav: inWallet ? c.fav : false } : c)) })),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      deleteNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      updateProfile: (profile) => set({ profile }),
      togglePref: (key) => set((s) => ({ settings: { ...s.settings, prefs: { ...s.settings.prefs, [key]: !s.settings.prefs[key] } } })),
      setHomeOrder: (homeOrder) => set((s) => ({ settings: { ...s.settings, homeOrder } })),

      resetDemoData: () => set({ ...createSeedData() }),
    }),
    {
      name: APP_DATA_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Persist data only, never the action functions.
      partialize: (s): AppData => ({
        profile: s.profile,
        credentials: s.credentials,
        vehicles: s.vehicles,
        fines: s.fines,
        notifications: s.notifications,
        settings: s.settings,
        demeritLimit: s.demeritLimit,
      }),
      migrate: (persisted) => persisted as AppData,
    },
  ),
);

/** Snapshot of just the data (no actions) — handy for selectors that take `AppData`. */
export function appDataSnapshot(s: AppDataState): AppData {
  return {
    profile: s.profile,
    credentials: s.credentials,
    vehicles: s.vehicles,
    fines: s.fines,
    notifications: s.notifications,
    settings: s.settings,
    demeritLimit: s.demeritLimit,
  };
}

/**
 * Subscribe to the whole data snapshot. `useShallow` compares the snapshot's
 * fields by reference, so a component re-renders only when one of them actually
 * changes — without it, the fresh object returned each render would loop.
 */
export function useAppDataSnapshot(): AppData {
  return useAppData(useShallow(appDataSnapshot));
}
