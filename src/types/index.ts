/**
 * Harbour domain types.
 *
 * These describe the shape of everything the app works with. They live apart
 * from the UI and the data source on purpose: screens and the repository layer
 * both depend on these types, not on each other. In Phase 8 the Supabase
 * repository returns these same shapes, so no screen has to change.
 *
 * All data in this app is fictional and clearly marked as a demonstration.
 */

/** ISO date string, `YYYY-MM-DD` (a calendar day, no time zone). */
export type IsoDate = string;
/** ISO timestamp string (with time), e.g. from `new Date().toISOString()`. */
export type IsoTimestamp = string;

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: IsoDate;
}

/** A demonstration wallet credential (never a real licence or ID). */
export interface Credential {
  id: string;
  /** e.g. "Demo driver card" — the kind shown as an eyebrow on the card. */
  kind: string;
  /** e.g. "Driver Card" — the card's name. */
  title: string;
  /** Gradient palette key (see theme credential palettes). */
  style: CredentialStyle;
  /** Starred to the Home favourites carousel. */
  fav: boolean;
  /** Present in the wallet (vs. available to add). */
  inWallet: boolean;
  /** Fictional demo number, clearly prefixed `DEMO-`. */
  number: string;
  expiry: IsoDate;
  issued: IsoDate;
  /** Extra label/value rows shown on the detail screen. */
  fields: [label: string, value: string][];
  /** Whether the card shows a photo placeholder. */
  photo: boolean;
}

export type CredentialStyle = 'teal' | 'slate' | 'kelp' | 'sand' | 'ink' | 'ocean' | 'plum';

export type VehicleBody = 'Sedan' | 'Hatchback' | 'SUV' | 'Ute' | 'Wagon' | 'Van' | 'Motorcycle';

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  body: VehicleBody;
  expiry: IsoDate;
  ctp: string;
}

export type FineStatus = 'unpaid' | 'overdue' | 'paid';

export interface Fine {
  id: string;
  ref: string;
  offence: string;
  place: string;
  date: IsoDate;
  due: IsoDate;
  amount: number;
  points: number;
  status: FineStatus;
  plate: string;
  paidOn?: IsoDate;
}

export type NotificationType = 'registration' | 'expiry' | 'fines' | 'announcements';

/** Where a notification sends you when tapped. */
export interface NotificationLink {
  screen: 'vehicle' | 'fine' | 'cred';
  id: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  at: IsoTimestamp;
  read: boolean;
  link?: NotificationLink;
}

export type ThemePreference = 'system' | 'light' | 'dark';

export interface NotificationPrefs {
  registration: boolean;
  expiry: boolean;
  fines: boolean;
  announcements: boolean;
}

export interface Settings {
  appLock: boolean;
  biometrics: boolean;
  analytics: boolean;
  personalised: boolean;
  prefs: NotificationPrefs;
  /** Order of the Home screen's service shortcuts. */
  homeOrder: HomeServiceKey[];
}

export type HomeServiceKey = 'vehicles' | 'fines' | 'notifications' | 'wallet' | 'account';

/** The full app data set — what the repository loads and persists. */
export interface AppData {
  profile: Profile;
  credentials: Credential[];
  vehicles: Vehicle[];
  fines: Fine[];
  notifications: AppNotification[];
  settings: Settings;
  /** Demerit-point ceiling for the simulated balance. */
  demeritLimit: number;
}
