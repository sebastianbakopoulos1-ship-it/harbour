import type { AppData } from '@/types';
import { isoFromToday } from '@/utils/dates';

/**
 * The original fictional data set.
 *
 * Every person, number, vehicle, notice and credential here is invented.
 * Dates are generated relative to "today" so statuses (due soon, overdue,
 * expiring) stay meaningful whenever the app is opened. Built as a function so
 * "Reset demo data" can get a fresh copy.
 */
export function createSeedData(): AppData {
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

  return {
    profile: {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@example.com',
      phone: '0400 000 000',
      address: '12 Example Street, Sampleton NSW 2000',
      dob: '1994-03-14',
    },
    settings: {
      appLock: true,
      biometrics: true,
      analytics: false,
      personalised: true,
      prefs: { registration: true, expiry: true, fines: true, announcements: false },
      homeOrder: ['vehicles', 'fines', 'notifications', 'wallet', 'account'],
    },
    demeritLimit: 13,
    credentials: [
      { id: 'c1', kind: 'Demo driver card', title: 'Driver Card', style: 'teal', fav: true, inWallet: true,
        number: 'DEMO-DC-4821 0193', expiry: isoFromToday(612), issued: isoFromToday(-483),
        fields: [['Class', 'C · Car'], ['Conditions', 'None'], ['Status', 'Demo — not valid'], ['Card type', 'Demonstration']], photo: true },
      { id: 'c2', kind: 'Demo photo card', title: 'Photo Card', style: 'slate', fav: false, inWallet: true,
        number: 'DEMO-PC-7730 5512', expiry: isoFromToday(1420), issued: isoFromToday(-405),
        fields: [['Purpose', 'Demo proof of age'], ['Status', 'Demo — not valid']], photo: true },
      { id: 'c3', kind: 'Demo recreational licence', title: 'Fishing Licence', style: 'kelp', fav: true, inWallet: true,
        number: 'DEMO-RF-0042 8810', expiry: isoFromToday(48), issued: isoFromToday(-317),
        fields: [['Type', 'Recreational · 1 year'], ['Waters', 'Fictional — all'], ['Status', 'Demo — not valid']], photo: false },
      { id: 'c4', kind: 'Demo membership', title: 'Harbourside Library', style: 'sand', fav: false, inWallet: true,
        number: 'DEMO-LIB-118 204', expiry: isoFromToday(905), issued: isoFromToday(-900),
        fields: [['Tier', 'Standard'], ['Branch', 'Fictional Central']], photo: false },
      { id: 'c5', kind: 'Demo membership', title: 'Coastal Swim Club', style: 'ink', fav: false, inWallet: true,
        number: 'DEMO-SWM-55 019', expiry: isoFromToday(210), issued: isoFromToday(-155),
        fields: [['Tier', 'Adult'], ['Lanes', 'Unlimited (fictional)']], photo: false },
      { id: 'c6', kind: 'Demo vessel licence', title: 'Boat Licence', style: 'ocean', fav: false, inWallet: false,
        number: 'DEMO-BL-6021 7745', expiry: isoFromToday(1004), issued: isoFromToday(-91),
        fields: [['Type', 'General · Demo'], ['Status', 'Demo — not valid']], photo: true },
      { id: 'c7', kind: 'Demo membership', title: 'Eastside Climbing Gym', style: 'plum', fav: false, inWallet: false,
        number: 'DEMO-GYM-30 118', expiry: isoFromToday(330), issued: isoFromToday(-35),
        fields: [['Tier', 'Casual'], ['Visits', '10-pass (fictional)']], photo: false },
    ],
    vehicles: [
      { id: 'v1', plate: 'DEM 01A', make: 'Toyota', model: 'Corolla Hatch', year: 2021, colour: 'Silver', body: 'Hatchback', expiry: isoFromToday(19), ctp: 'Demo Insurer A' },
      { id: 'v2', plate: 'XMP 42', make: 'Mazda', model: 'CX-5', year: 2019, colour: 'Soul Red', body: 'SUV', expiry: isoFromToday(204), ctp: 'Demo Insurer B' },
      { id: 'v3', plate: 'TST 99Z', make: 'Honda', model: 'CB500X', year: 2017, colour: 'Black', body: 'Motorcycle', expiry: isoFromToday(-6), ctp: 'Demo Insurer A' },
    ],
    fines: [
      { id: 'f1', ref: 'DEMO-PN-30418', offence: 'Exceed speed limit by 10 km/h or less', place: 'Example Road, Sampleton', date: isoFromToday(-12), due: isoFromToday(16), amount: 145, points: 1, status: 'unpaid', plate: 'DEM 01A' },
      { id: 'f2', ref: 'DEMO-PN-29871', offence: 'Stop in a no stopping zone', place: 'Fiction Lane, Demoville', date: isoFromToday(-44), due: isoFromToday(-2), amount: 228, points: 0, status: 'overdue', plate: 'XMP 42' },
      { id: 'f3', ref: 'DEMO-PN-27002', offence: 'Use mobile phone while driving', place: 'Placeholder Highway', date: isoFromToday(-210), due: isoFromToday(-182), amount: 410, points: 5, status: 'paid', plate: 'DEM 01A', paidOn: isoFromToday(-200) },
      { id: 'f4', ref: 'DEMO-PN-25540', offence: 'Parking meter expired', place: 'Sample Street, Testbury', date: isoFromToday(-330), due: isoFromToday(-302), amount: 98, points: 0, status: 'paid', plate: 'XMP 42', paidOn: isoFromToday(-320) },
    ],
    notifications: [
      { id: 'n1', type: 'registration', title: 'Registration due soon', body: 'DEM 01A expires in 19 days. Renew now to avoid a late fee (simulated).', at: minutesAgo(42), read: false, link: { screen: 'vehicle', id: 'v1' } },
      { id: 'n2', type: 'fines', title: 'Penalty notice overdue', body: 'DEMO-PN-29871 is past its due date. This is fictional demo data.', at: minutesAgo(60 * 5), read: false, link: { screen: 'fine', id: 'f2' } },
      { id: 'n3', type: 'expiry', title: 'Fishing licence expiring', body: 'Your demo recreational licence expires in 48 days.', at: minutesAgo(60 * 26), read: false, link: { screen: 'cred', id: 'c3' } },
      { id: 'n4', type: 'announcements', title: 'New: Services directory', body: 'Browse every demo service by topic from the Services tab.', at: minutesAgo(60 * 24 * 4), read: true },
      { id: 'n5', type: 'registration', title: 'Registration expired', body: 'TST 99Z expired 6 days ago. Driving an unregistered vehicle is an offence.', at: minutesAgo(60 * 24 * 6), read: true, link: { screen: 'vehicle', id: 'v3' } },
      { id: 'n6', type: 'announcements', title: 'Welcome to Harbour', body: 'Everything in this app is fictional demonstration data.', at: minutesAgo(60 * 24 * 30), read: true },
    ],
  };
}
