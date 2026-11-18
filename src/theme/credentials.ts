import type { CredentialStyle } from '@/types';

/**
 * Gradient palettes for demo wallet cards. Each is [from, to, accent].
 * Original colourways — not based on any issued card design.
 */
export const credentialPalettes: Record<CredentialStyle, [string, string, string]> = {
  teal: ['#0B5D66', '#0F7D80', '#13999A'],
  slate: ['#2D3A55', '#46557A', '#5F6E96'],
  kelp: ['#1F5C3A', '#2E7D4F', '#4C9A62'],
  sand: ['#8A5A1F', '#B57A2E', '#D49C4D'],
  ink: ['#1C2230', '#2A3245', '#3B4560'],
  ocean: ['#13406B', '#1D5F96', '#2F7DBE'],
  plum: ['#4A2350', '#6B3474', '#8E4E98'],
};
