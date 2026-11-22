// Profiles, settings and progress, kept on this device (localStorage, failing soft).
const KEY = 'pipmaths.v1';
const blank = () => ({ profiles: [], active: null, settings: { sound: true, voice: true } });
let S = load();
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!d) return blank();
    const out = { ...blank(), ...d, settings: { ...blank().settings, ...(d.settings || {}) } };
    // Fill in fields that older saves (or damaged data) may be missing, so screens never show "undefined".
    out.profiles = (Array.isArray(d.profiles) ? d.profiles : []).filter(p => p && p.id).map(p => ({ modeOverride: null, progress: {}, bests: {}, coins: 0, stickers: [], sessions: [], color: '#4dabf7', age: 8, ...p, name: p.name || 'Learner' }));
    return out;
  } catch (e) { return blank(); }
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
export const settings = () => S.settings;
export const profiles = () => S.profiles;
export const profile = () => S.profiles.find(p => p.id === S.active) || null;

export function modeForAge(age) { return age <= 7 ? 'little' : age <= 13 ? 'explore' : age <= 18 ? 'achieve' : 'adult'; }
export function effectiveMode(p) { return p.modeOverride || modeForAge(p.age); }

export function addProfile({ name, age, board, lang, color }) {
  const p = { id: 'p' + Date.now().toString(36), name, age, board, lang, color, modeOverride: null, created: Date.now(), progress: {}, bests: {}, coins: 0, stickers: [] };
  S.profiles.push(p); S.active = p.id; save(); return p;
}
export function setActive(id) { S.active = id; save(); }
export function updateProfile(patch) { const p = profile(); if (p) { Object.assign(p, patch); save(); } }
export function removeProfile(id) { S.profiles = S.profiles.filter(p => p.id !== id); if (S.active === id) S.active = S.profiles[0]?.id || null; save(); }
export function resetProgress() { const p = profile(); if (p) { p.progress = {}; p.bests = {}; p.coins = 0; p.stickers = []; save(); } }
