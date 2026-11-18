import { formatAuMobile, validateAuMobile, validateEmail } from '@/utils/validation';

describe('validateEmail', () => {
  test.each(['alex@example.com', '  alex.morgan@example.com.au '])('accepts %p', (v) => {
    expect(validateEmail(v)).toBeUndefined();
  });
  test('requires a value', () => expect(validateEmail('   ')).toMatch(/enter an email/i));
  test.each(['alex', 'alex@', 'alex@example', 'a b@example.com'])('rejects %p', (v) => {
    expect(validateEmail(v)).toMatch(/valid email/i);
  });
});

describe('Australian mobile', () => {
  test('accepts 04 numbers with or without spaces', () => {
    expect(validateAuMobile('0411222333')).toBeUndefined();
    expect(validateAuMobile('0411 222 333')).toBeUndefined();
  });
  test.each(['', '0211222333', '041122233', '04112223334'])('rejects %p', (v) => {
    expect(validateAuMobile(v)).toBeDefined();
  });
  test('formats as 4-3-3', () => {
    expect(formatAuMobile('0411222333')).toBe('0411 222 333');
    expect(formatAuMobile('abc')).toBe('abc');
  });
});
