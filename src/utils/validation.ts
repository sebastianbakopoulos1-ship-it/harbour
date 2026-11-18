/**
 * Small, pure validation helpers shared by forms.
 * Each returns an error message, or `undefined` when the value is valid,
 * so they plug straight into a field's `error` prop.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Enter an email address';
  if (!EMAIL.test(v)) return 'Enter a valid email address, like name@example.com';
  return undefined;
}

/** Australian mobile: 10 digits starting with 04 (spaces allowed). */
export function validateAuMobile(value: string): string | undefined {
  const digits = value.replace(/\s/g, '');
  if (!digits) return 'Enter a mobile number';
  if (!/^04\d{8}$/.test(digits)) return 'Enter a 10-digit mobile starting with 04';
  return undefined;
}

/** Formats "0411222333" as "0411 222 333". Leaves anything else untouched. */
export function formatAuMobile(value: string): string {
  const d = value.replace(/\s/g, '');
  return /^\d{10}$/.test(d) ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : value;
}
