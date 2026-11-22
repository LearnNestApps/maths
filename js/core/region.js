// Country settings: number style, money, voice and dates. Chosen once per device (Grown-ups can change it).
import { settings, save } from './store.js';

// Coins and notes are listed in the smallest unit (paise, cents, pence) so sums stay whole numbers.
export const REGIONS = {
  india: { name: 'India', locale: 'en-IN', voice: 'en-IN', group: 'indian', sym: '₹', minor: null,
    coins: [100, 200, 500, 1000, 2000], notes: [1000, 2000, 5000, 10000], gold: [1000, 2000] },
  us: { name: 'USA', locale: 'en-US', voice: 'en-US', group: 'intl', sym: '$', minor: '¢',
    coins: [1, 5, 10, 25], notes: [100, 500, 1000, 2000], gold: [] },
  canada: { name: 'Canada', locale: 'en-CA', voice: 'en-CA', group: 'intl', sym: '$', minor: '¢',
    coins: [5, 10, 25, 100, 200], notes: [500, 1000, 2000, 5000], gold: [100, 200] },
  uk: { name: 'UK', locale: 'en-GB', voice: 'en-GB', group: 'intl', sym: '£', minor: 'p',
    coins: [1, 2, 5, 10, 20, 50, 100, 200], notes: [500, 1000, 2000, 5000], gold: [1, 2, 100, 200] }
};
export function guessRegion() {
  const l = (navigator.language || '').toLowerCase(), tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  if (l.endsWith('-in') || /Kolkata|Calcutta/.test(tz)) return 'india';
  if (l.endsWith('-ca') || /Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal/.test(tz)) return 'canada';
  if (l.endsWith('-gb') || /London/.test(tz)) return 'uk';
  if (l.endsWith('-us') || /America\//.test(tz)) return 'us';
  return 'india';
}
export const regionId = () => settings().region || guessRegion();
export const R = () => REGIONS[regionId()];
export const hasRegion = () => !!settings().region;
export function setRegion(id) { settings().region = id; save(); }
export const isIndia = () => regionId() === 'india';

// Numbers: Indian grouping (12,34,567) or international (1,234,567).
export function fmt(n) {
  if (R().group !== 'indian') return Number(n).toLocaleString('en-US');
  const s = String(Math.abs(n)), sign = n < 0 ? '-' : ''; if (s.length <= 3) return sign + s;
  return sign + s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
}
// Money: whole major units ("₹40", "$40", "£40").
export const money = n => `${R().sym}${fmt(n)}`;
// A coin or note value in the smallest unit → its printed label ("25¢", "50p", "$2", "₹10").
export function coinLabel(v) { const r = R(); return r.minor && v < 100 ? `${v}${r.minor}` : `${r.sym}${v / 100}`; }
// A total in the smallest unit → how to say it in an answer.
export function amountLabel(v) { const r = R(); if (r.minor && v < 100) return `${v}${r.minor}`; return v % 100 ? `${r.sym}${(v / 100).toFixed(2)}` : `${r.sym}${fmt(v / 100)}`; }
export const dateFmt = (d, opts) => new Date(d).toLocaleDateString(R().locale, opts);
