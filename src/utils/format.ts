/** Formatting helpers shared across screens. */

/** Australian dollars, e.g. `formatMoney(145)` → "$145.00". */
export function formatMoney(amount: number): string {
  return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 });
}

/** `plural(1, 'day')` → "1 day"; `plural(3, 'day')` → "3 days". */
export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

/** Time-of-day greeting. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Initials for an avatar, e.g. ("Alex","Morgan") → "AM". */
export function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}
