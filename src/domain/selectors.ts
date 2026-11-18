/**
 * Domain selectors: pure functions that derive meaning from raw data
 * (statuses, balances, reminders). They hold no React or storage code, so they
 * are trivial to unit-test and are reused by every screen.
 */
import type { Tone as ThemeTone } from '@/theme';
import type { AppData, Credential, Fine, Vehicle } from '@/types';
import { daysUntil, formatDate } from '@/utils/dates';
import { formatMoney, plural } from '@/utils/format';

export interface StatusResult {
  key: string;
  label: string;
  tone: ThemeTone;
  text: string;
  /** Days until expiry/due (negative = past). */
  days: number;
}

/** Registration standing for a vehicle, from its expiry date. */
export function regoStatus(v: Vehicle): StatusResult {
  const days = daysUntil(v.expiry);
  if (days < 0) return { key: 'expired', label: 'Expired', tone: 'danger', text: `Expired ${plural(-days, 'day')} ago`, days };
  if (days <= 30) return { key: 'due', label: 'Due soon', tone: 'warning', text: `Expires in ${plural(days, 'day')}`, days };
  return { key: 'current', label: 'Current', tone: 'success', text: `Expires ${formatDate(v.expiry)}`, days };
}

export function fineStatus(f: Fine): { label: string; tone: ThemeTone } {
  if (f.status === 'paid') return { label: 'Paid', tone: 'success' };
  if (daysUntil(f.due) < 0) return { label: 'Overdue', tone: 'danger' };
  return { label: 'Unpaid', tone: 'warning' };
}

export const isOpenFine = (f: Fine): boolean => f.status !== 'paid';

/** Demerit points accrued in the last 3 years (the simulated counting window). */
export function demeritBalance(data: AppData): number {
  const cutoff = Date.now() - 3 * 365 * 86_400_000;
  return data.fines.filter((f) => new Date(f.date).getTime() > cutoff).reduce((sum, f) => sum + f.points, 0);
}

export const walletCredentials = (data: AppData): Credential[] => data.credentials.filter((c) => c.inWallet);
export const favouriteCredentials = (data: AppData): Credential[] => walletCredentials(data).filter((c) => c.fav);
export const unreadCount = (data: AppData): number => data.notifications.filter((n) => !n.read).length;

export interface Reminder {
  id: string;
  tone: ThemeTone;
  icon: 'car' | 'receipt' | 'card';
  title: string;
  body: string;
  link: { screen: 'vehicle' | 'fine' | 'cred'; id: string };
}

/** Everything that currently needs attention, most urgent first. */
export function reminders(data: AppData): Reminder[] {
  const out: Reminder[] = [];
  for (const v of data.vehicles) {
    const r = regoStatus(v);
    if (r.key !== 'current') {
      out.push({ id: `rem-${v.id}`, tone: r.tone, icon: 'car', title: `${v.plate} registration ${r.key === 'expired' ? 'expired' : 'due'}`, body: r.text, link: { screen: 'vehicle', id: v.id } });
    }
  }
  for (const f of data.fines.filter(isOpenFine)) {
    const st = fineStatus(f);
    out.push({ id: `rem-${f.id}`, tone: st.tone, icon: 'receipt', title: `${formatMoney(f.amount)} notice ${st.label.toLowerCase()}`, body: `${f.ref} · due ${formatDate(f.due)}`, link: { screen: 'fine', id: f.id } });
  }
  for (const c of walletCredentials(data)) {
    const d = daysUntil(c.expiry);
    if (d >= 0 && d <= 60) {
      out.push({ id: `rem-${c.id}`, tone: 'info', icon: 'card', title: `${c.title} expires in ${d} days`, body: 'Demo credential renewal reminder', link: { screen: 'cred', id: c.id } });
    }
  }
  const order: Record<string, number> = { danger: 0, warning: 1, info: 2, success: 3, brand: 4, accent: 5, neutral: 6 };
  return out.sort((a, b) => (order[a.tone] ?? 9) - (order[b.tone] ?? 9));
}
