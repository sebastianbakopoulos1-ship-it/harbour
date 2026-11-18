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
      {
        id: 'c1',
        kind: 'Driver licence',
        title: 'Provisional Driver Licence',
        style: 'teal',
        fav: true,
        inWallet: true,
        number: '0000 0000',
        expiry: isoFromToday(612),
        issued: isoFromToday(-483),
        fields: [
          ['Class', 'C'],
          ['Conditions', 'None'],
          ['Card number', '0000 0000 0000'],
        ],
        photo: true,
      },
    ],
    vehicles: [],
    fines: [],
    notifications: [],
  };
}
