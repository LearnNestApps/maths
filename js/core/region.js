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
    coins: [1, 2, 5, 10, 20, 50, 100, 200], notes: [500, 1000, 2000, 5000], gold: [100, 200], copper: [1, 2] }
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

// Measurement: US customary units in the USA, metric everywhere else.
const UNITS = {
  metric: { len: 'cm', big: 'km', speed: 'km/h', temp: '°C', area: 'cm²', vol: 'cm³', trap: 'trapezium', box: 'cuboid' },
  us: { len: 'in', big: 'miles', speed: 'mph', temp: '°F', area: 'sq in', vol: 'cu in', trap: 'trapezoid', box: 'rectangular prism' }
};
export const isUS = () => regionId() === 'us';
export const U = k => UNITS[isUS() ? 'us' : 'metric'][k];
// Unit conversions: [big unit, small unit, how many small in one big]
export const conversions = () => isUS()
  ? [['ft', 'in', 12], ['yd', 'ft', 3], ['lb', 'oz', 16], ['gal', 'qt', 4], ['qt', 'pt', 2], ['pt', 'cups', 2], ['mi', 'ft', 5280]]
  : [['m', 'cm', 100], ['km', 'm', 1000], ['kg', 'g', 1000], ['l', 'ml', 1000], ['cm', 'mm', 10]];

// ---- Localising question text ----
// Lessons are written once (with Indian names and terms); outside India each question is passed through loc().
const NAME_MAP = { Riya: 'Emma', Aarav: 'Liam', Sana: 'Zoe', Kabir: 'Noah', Meera: 'Mia', Arjun: 'Ethan', Ira: 'Ava', Vihaan: 'Leo', Raj: 'Sam',
  Ravi: 'Ben', Meena: 'Lily', Anil: 'Mark', Sita: 'Anna', Raju: 'Jake', Priya: 'Ella', Amit: 'Ryan', Mohan: 'Paul', Kiran: 'Chris', Neha: 'Grace',
  Suresh: 'Tom', Lata: 'Rose', Rohit: 'Max', Vijay: 'Dan', Asha: 'Kate', Tara: 'Ruby', Dev: 'Jack', Ramesh: 'Peter', Om: 'Frank', Jai: 'Henry', Ved: 'Owen' };
const NAME_RE = new RegExp(`\\b(${Object.keys(NAME_MAP).join('|')})\\b`, 'g');
const RULES = {
  us: [[/\bmaths\b/g, 'math'], [/(Pip )?\bMaths\b/g, (m, pip) => pip ? m : 'Math'], [/\bBODMAS\b/g, 'PEMDAS'], [/Brackets, Orders \(powers\), Division\/Multiplication/g, 'Parentheses, Exponents, Multiplication/Division'],
    [/\bCricket\b/g, 'Soccer'], [/\bKabaddi\b/g, 'Basketball'], [/\bfavourite/g, 'favorite'], [/\bcolour/g, 'color'], [/\bColour/g, 'Color'], [/\bcentre/g, 'center'], [/\bgrey\b/g, 'gray']],
  canada: [[/\bmaths\b/g, 'math'], [/(Pip )?\bMaths\b/g, (m, pip) => pip ? m : 'Math'], [/\bBODMAS\b/g, 'BEDMAS'], [/Brackets, Orders \(powers\)/g, 'Brackets, Exponents'], [/\bCricket\b/g, 'Soccer'], [/\bKabaddi\b/g, 'Hockey']],
  uk: [[/\bKabaddi\b/g, 'Rugby']]
};
const COMMON = [[/\bmangos\b/g, 'mangoes'], [/\bIMO · Class (\d+)/g, 'Olympiad-style test · Grade $1'], [/\bClass (\d+)\b/g, 'Grade $1']];
export function locText(s) {
  if (typeof s !== 'string' || regionId() === 'india') return typeof s === 'string' ? s.replace(/\bmangos\b/g, 'mangoes') : s;
  s = s.replace(NAME_RE, m => NAME_MAP[m]);
  for (const [a, b] of [...COMMON, ...(RULES[regionId()] || [])]) s = s.replace(a, b);
  return s;
}
// Walk an activity (or any object) and localise every string in it; functions and numbers are left alone.
export function loc(o) {
  if (typeof o === 'string') return locText(o);
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = loc(o[i]); return o; }
  if (o && typeof o === 'object') { for (const k of Object.keys(o)) if (typeof o[k] !== 'function') o[k] = loc(o[k]); }
  return o;
}

// School level names: each country names its early years and grades differently (UK years run one ahead).
export function lvShort(code) {
  const r = regionId(), g = /^G(\d+)$/.exec(code);
  if (r === 'us') return code === 'JK' ? 'Pre-K' : code === 'SK' ? 'K' : code;
  if (r === 'uk') return code === 'JK' ? 'Nursery' : code === 'SK' ? 'Reception' : g ? `Y${+g[1] + 1}` : code;
  return code;
}
export function lvLong(code) {
  const r = regionId(), g = /^G(\d+)$/.exec(code);
  const early = { india: ['Junior KG', 'Senior KG'], canada: ['Junior Kindergarten', 'Senior Kindergarten'], us: ['Pre-K', 'Kindergarten'], uk: ['Nursery', 'Reception'] }[r];
  if (code === 'JK') return early[0]; if (code === 'SK') return early[1];
  if (g) return r === 'uk' ? `Year ${+g[1] + 1}` : `Grade ${g[1]}`;
  return code === 'Uni' ? 'University' : code;
}
