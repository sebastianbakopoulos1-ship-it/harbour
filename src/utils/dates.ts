import type { IsoDate, IsoTimestamp } from '@/types';

const DAY = 86_400_000;

/** Today at local midnight (so day comparisons ignore the time of day). */
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format a Date as a local `YYYY-MM-DD` (not UTC — avoids an off-by-one day in AEST/AEDT). */
export function toLocalIso(d: Date): IsoDate {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** A calendar date `offsetDays` from today (negative = past). Used to generate demo data. */
export function isoFromToday(offsetDays: number): IsoDate {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return toLocalIso(d);
}

/** Whole days from today until `date` (negative = in the past). */
export function daysUntil(date: IsoDate): number {
  return Math.round((new Date(date + 'T00:00:00').getTime() - today().getTime()) / DAY);
}

/** One year on from `date`, but never earlier than a year from today (for simulated renewals). */
export function addYear(date: IsoDate): IsoDate {
  const d = new Date(date + 'T00:00:00');
  const base = d < today() ? today() : d;
  base.setFullYear(base.getFullYear() + 1);
  return toLocalIso(base);
}

/** e.g. "5 Jan 2028". */
export function formatDate(date: IsoDate): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Compact relative time: now, 5m, 3h, 2d, then a short date. */
export function relativeTime(ts: IsoTimestamp): string {
  const mins = Math.round((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}
