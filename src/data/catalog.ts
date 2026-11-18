import type { IconName } from '@/components/ui';

/**
 * The services directory and featured cards. These are static content (not
 * user data), written as original examples for the prototype. Each item either
 * opens a real screen in the app (`route`) or is a labelled placeholder.
 */

export interface ServiceItem {
  label: string;
  /** An in-app route path, or null for a placeholder not built in this demo. */
  route: string | null;
}

export interface ServiceCategory {
  id: string;
  title: string;
  blurb: string;
  /** Gradient hue for the generated header art. */
  hue: number;
  icon: IconName;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  { id: 'all', title: 'Browse everything', blurb: 'Every demo service in one A–Z list.', hue: 210, icon: 'grid', items: [] },
  { id: 'driving', title: 'Cars, bikes and boats', blurb: 'Registration, fines, demerits and the demo licences in your wallet.', hue: 350, icon: 'car', items: [
    { label: 'Check or renew registration', route: '/vehicles' }, { label: 'Pay a penalty notice', route: '/fines' }, { label: 'See demerit points', route: '/fines' }, { label: 'Your driver licence', route: '/credential/c1' },
  ] },
  { id: 'savings', title: 'Save on the everyday', blurb: 'Find discounts and rebates you might be missing.', hue: 30, icon: 'piggy', items: [
    { label: 'Savings checklist', route: null }, { label: 'Energy bill rebates', route: null }, { label: 'Transport cost relief', route: null },
  ] },
  { id: 'work', title: 'Work and trades', blurb: 'Licences, tickets and checks for the job you do.', hue: 220, icon: 'briefcase', items: [
    { label: 'Trade licence lookup', route: null }, { label: 'Workplace safety tickets', route: null }, { label: 'Background checks', route: null },
  ] },
  { id: 'learning', title: 'Learning and childcare', blurb: 'From first playgroup to finishing an apprenticeship.', hue: 280, icon: 'book', items: [
    { label: 'Childcare finder', route: null }, { label: 'School enrolment', route: null }, { label: 'Apprenticeship support', route: null },
  ] },
  { id: 'home', title: 'Renting and owning', blurb: 'Bonds, building, buying and help finding a place to stay.', hue: 150, icon: 'house', items: [
    { label: 'Rental bond', route: null }, { label: 'Building approvals', route: null }, { label: 'Housing support', route: null },
  ] },
  { id: 'outdoors', title: 'Outdoors and on the water', blurb: 'Fishing and boating licences, park passes and campsites.', hue: 175, icon: 'fish', items: [
    { label: 'Fishing licences', route: null }, { label: 'Boat licences', route: null }, { label: 'Park passes', route: null }, { label: 'Book a campsite', route: null },
  ] },
  { id: 'health', title: 'Health and wellbeing', blurb: 'Where to start when you or someone you care for needs support.', hue: 345, icon: 'heart', items: [
    { label: 'Find a clinic', route: null }, { label: 'Mental health support', route: null }, { label: 'Carer resources', route: null },
  ] },
  { id: 'business', title: 'Running a business', blurb: 'Start, grow and stay compliant, with help along the way.', hue: 245, icon: 'briefcase', items: [
    { label: 'Register a business name', route: null }, { label: 'Business grants', route: null }, { label: 'Supplier registration', route: null },
  ] },
  { id: 'emergency', title: 'Emergencies and recovery', blurb: 'Get ready for storms, fires and floods, and find help afterwards.', hue: 15, icon: 'alert', items: [
    { label: 'Make an emergency plan', route: null }, { label: 'Recovery grants', route: null }, { label: 'Replace lost documents', route: null },
  ] },
  { id: 'life', title: 'Life events', blurb: 'New babies, new names, marriages and saying goodbye.', hue: 300, icon: 'sparkle', items: [
    { label: 'Register a birth', route: null }, { label: 'Change your name', route: null }, { label: 'Certificates', route: null },
  ] },
  { id: 'community', title: 'Community and safety', blurb: 'Find a JP, sign a statutory declaration, or register a defibrillator.', hue: 130, icon: 'shield', items: [
    { label: 'Find a JP', route: null }, { label: 'Statutory declarations', route: null }, { label: 'Register a defibrillator', route: null },
  ] },
];

export interface Featured {
  id: string;
  title: string;
  hue: number;
  icon: IconName;
  route: string;
}

export const featuredItems: Featured[] = [
  { id: 'ft1', title: 'Rego due? Renew in a tap', hue: 350, icon: 'car', route: '/vehicles' },
  { id: 'ft2', title: 'Star cards for your home screen', hue: 175, icon: 'star', route: '/(tabs)/wallet' },
  { id: 'ft3', title: 'Set reminders your way', hue: 30, icon: 'bell', route: '/notifications' },
  { id: 'ft4', title: 'Tell us how we’re doing', hue: 245, icon: 'message', route: '/help' },
];

/** The deduplicated A–Z list for the "Browse everything" category. */
export function allServiceItems(): { label: string; route: string | null; from: string }[] {
  const seen = new Map<string, { label: string; route: string | null; from: string }>();
  for (const cat of serviceCategories) {
    for (const item of cat.items) {
      if (!seen.has(item.label)) seen.set(item.label, { ...item, from: cat.title });
    }
  }
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}
