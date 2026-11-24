// Family accounts and sync with Supabase (plain fetch; no packages).
// The app keeps working on the device without an account; signing in adds backup and the same
// learners and progress on every device.
import { profiles, settings, setProfiles, onSave, save } from './store.js';

export const SUPABASE_URL = 'https://kafkrkcuogvurfhigksk.supabase.co';
// Tests on this computer can point the app at a stand-in server; never on the real site.
const BASE = (() => { try { return (location.hostname === 'localhost' && localStorage.getItem('pipmaths.sburl')) || SUPABASE_URL; } catch (e) { return SUPABASE_URL; } })();
const KEY = 'sb_publishable_OYg8qCsdnHd0Dx_3JXcpBw_ZqBApST6';   // public key: safe in the app; the database rules do the protecting
const SKEY = 'pipmaths.session', PKEY = 'pipmaths.synced';
const SCHEMA = 'Math_schema';   // the database schema that holds the Pip Maths tables
const APP_URL = () => location.origin + location.pathname.replace(/[^/]*$/, '');

let session = read(SKEY), synced = read(PKEY) || {}, status = { state: session ? 'idle' : 'off', at: null, error: null }, adminCache = null;
const statusFns = [];
function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function keep(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function setStatus(patch) { Object.assign(status, patch); statusFns.forEach(f => { try { f(status); } catch (e) {} }); }
export const onStatus = fn => { statusFns.push(fn); };
export const cloudStatus = () => status;
export const signedIn = () => !!session;
export const userEmail = () => session && session.user && session.user.email;

// ---------- HTTP ----------
class CloudError extends Error { constructor(msg, code) { super(msg); this.code = code; } }
async function call(path, { method = 'GET', body, auth = true, headers = {}, retry = true } = {}) {
  if (auth && session) await fresh();
  const h = { apikey: KEY, 'Content-Type': 'application/json', ...headers };
  // Tables and functions are in our own schema, not "public": tell the API which one.
  if (path.startsWith('/rest/')) { h['Accept-Profile'] = SCHEMA; h['Content-Profile'] = SCHEMA; }
  if (auth && session) h.Authorization = 'Bearer ' + session.access_token;
  let r;
  try { r = await fetch(BASE + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch (e) { throw new CloudError('No internet connection', 'offline'); }
  if (r.status === 401 && auth && session && retry) { await refresh(true); return call(path, { method, body, auth, headers, retry: false }); }
  const text = await r.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!r.ok) throw new CloudError(niceError(data, r.status), r.status);
  return data;
}
function niceError(d, code) {
  const m = (d && (d.msg || d.message || d.error_description || d.error)) || '';
  if (/invalid login credentials/i.test(m)) return 'That email and password do not match.';
  if (/email not confirmed/i.test(m)) return 'Please confirm your email first: open the link we sent you.';
  if (/already registered|already been registered|user_already_exists/i.test(m)) return 'There is already an account with that email. Try signing in.';
  if (/password/i.test(m) && /(short|least|weak)/i.test(m)) return 'Please use a longer password (at least 8 characters).';
  if (/rate limit|too many/i.test(m) || code === 429) return 'Too many tries. Please wait a few minutes.';
  return m || 'Something went wrong (' + code + ').';
}

// ---------- Sessions ----------
function saveSession(d) {
  if (!d || !d.access_token) return;
  session = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600), user: d.user || (session && session.user) };
  keep(SKEY, session); adminCache = null;
}
async function fresh() { if (session && session.expires_at - 60 < Date.now() / 1000) await refresh(); }
let refreshing = null;
// Renew the session once, even if several requests notice at the same time (each renewal token works only once).
function refresh(force) {
  if (!session) return Promise.resolve();
  if (!refreshing) refreshing = (async () => {
    try { saveSession(await call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', auth: false, body: { refresh_token: session.refresh_token } })); }
    catch (e) { if (e.code !== 'offline') { endSession(); setStatus({ state: 'off', error: 'Signed out: please sign in again.' }); } throw e; }
    finally { setTimeout(() => { refreshing = null; }, 0); }
  })();
  return force ? refreshing : refreshing.catch(() => {});
}
function endSession() { session = null; keep(SKEY, null); synced = {}; keep(PKEY, null); adminCache = null; }

export async function signUp(email, password) {
  const d = await call('/auth/v1/signup?redirect_to=' + encodeURIComponent(APP_URL()), { method: 'POST', auth: false, body: { email: email.trim(), password } });
  if (d && d.access_token) { saveSession(d); await syncNow(); return { signedIn: true }; }
  return { confirm: true };   // email confirmation is on: the parent opens the link, which signs them in
}
export async function signIn(email, password) {
  saveSession(await call('/auth/v1/token?grant_type=password', { method: 'POST', auth: false, body: { email: email.trim(), password } }));
  await syncNow();
}
export async function resetPassword(email) { await call('/auth/v1/recover?redirect_to=' + encodeURIComponent(APP_URL()), { method: 'POST', auth: false, body: { email: email.trim() } }); }
export async function setPassword(password) { await call('/auth/v1/user', { method: 'PUT', body: { password } }); }
export async function signOut() { try { await call('/auth/v1/logout', { method: 'POST' }); } catch (e) {} endSession(); setStatus({ state: 'off', error: null }); }
export async function deleteAccount() { await call('/rest/v1/rpc/delete_my_account', { method: 'POST', body: {} }); endSession(); setStatus({ state: 'off', error: null }); }

// Links in Supabase emails come back to the app with the session in the address (#access_token=…&type=…).
export function handleAuthRedirect() {
  const h = location.hash || ''; if (!/access_token=|error_description=/.test(h)) return null;
  const q = {}; h.slice(1).split('&').forEach(kv => { const i = kv.indexOf('='); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); });
  history.replaceState(null, '', location.pathname + location.search);
  if (q.error_description) return { error: q.error_description };
  saveSession({ access_token: q.access_token, refresh_token: q.refresh_token, expires_in: +q.expires_in || 3600, expires_at: +q.expires_at || 0 });
  call('/auth/v1/user').then(u => { if (session) { session.user = u; keep(SKEY, session); setStatus({}); } }).catch(() => {});
  return { type: q.type || 'signin' };
}

// ---------- Sync ----------
// Each learner is one row: name plus everything else in "data". "t" is when it last changed on a device.
const body = p => { const { id, name, t, ...rest } = p; return JSON.stringify(rest) + '|' + name; };
function toRow(p, uid) { const { id, name, ...data } = p; data.mode = data.modeOverride || (p.age <= 7 ? 'little' : p.age <= 13 ? 'explore' : p.age <= 18 ? 'achieve' : 'adult'); return { family_id: uid, id, name: String(name || 'Learner').slice(0, 40), data, deleted: false }; }
function fromRow(r) { const { mode, ...data } = r.data || {}; return { ...data, id: r.id, name: r.name }; }

let timer = null, running = null, lastPull = 0, pendingSettings = false;
let lastSettings = (() => { const st = settings(); return [st.region, st.sound, st.voice].join('|'); })();
// Called on every local change: mark changed learners and push them a few seconds later.
onSave(() => {
  if (!session) return;
  for (const p of profiles()) { const b = body(p); if (synced[p.id] !== b) p.t = Date.now(); }
  const st = settings(), sk = [st.region, st.sound, st.voice].join('|'); if (sk !== lastSettings) pendingSettings = true; lastSettings = sk;
  clearTimeout(timer); timer = setTimeout(() => syncNow({ pull: false }), 2500);
});

export async function syncNow({ pull = true } = {}) {
  if (!session) return;
  if (running) return running;
  running = (async () => {
    setStatus({ state: 'syncing', error: null });
    try {
      const uid = session.user && session.user.id || (session.user = await call('/auth/v1/user')).id;
      let list = profiles().slice();
      if (pull) {
        // 1. Bring in what other devices saved; newest change wins for each learner.
        const rows = await call('/rest/v1/learners?select=id,name,data,deleted,updated_at');
        const fam = await call('/rest/v1/families?select=settings');
        const byId = new Map(list.map(p => [p.id, p]));
        for (const r of rows || []) {
          const local = byId.get(r.id), remote = fromRow(r);
          if (r.deleted) { if (local && synced[r.id] !== undefined) byId.delete(r.id); continue; }
          if (!local && synced[r.id] !== undefined) continue;   // removed on this device since the last sync: stays removed
          if (!local || (remote.t || 0) > (local.t || 0)) { byId.set(r.id, remote); synced[r.id] = body(remote); }
        }
        // Learners removed on this device since the last sync are removed from the account too.
        list = [...byId.values()];
        const remoteSettings = fam && fam[0] && fam[0].settings;
        if (remoteSettings && remoteSettings.region && !pendingSettings) Object.assign(settings(), remoteSettings);
        setProfiles(list); lastPull = Date.now();
      }
      // 2. Send learners that changed here, and mark removed ones as deleted.
      const out = list.filter(p => synced[p.id] !== body(p)).map(p => toRow(p, uid));
      const gone = Object.keys(synced).filter(id => !list.some(p => p.id === id));
      for (const id of gone) out.push({ family_id: uid, id, name: '-', data: {}, deleted: true });
      if (out.length) await call('/rest/v1/learners?on_conflict=family_id,id', { method: 'POST', body: out, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
      const st = settings();
      await call('/rest/v1/families?on_conflict=id', { method: 'POST', body: [{ id: uid, settings: { region: st.region, sound: st.sound, voice: st.voice } }], headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
      pendingSettings = false;
      list.forEach(p => { synced[p.id] = body(p); }); gone.forEach(id => { delete synced[id]; }); keep(PKEY, synced);
      setStatus({ state: 'idle', at: Date.now(), error: null });
      return true;
    } catch (e) {
      setStatus({ state: e.code === 'offline' ? 'offline' : 'error', error: e.message });
      return false;
    } finally { running = null; }
  })();
  return running;
}
// Pull again when the app comes back to the front (another device may have saved), at most once a minute.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (!document.hidden && session && Date.now() - lastPull > 60000) syncNow().then(ok => ok && window.dispatchEvent(new Event('pip-synced'))); });
  window.addEventListener('online', () => { if (session) syncNow({ pull: false }); });
}

// ---------- Admin (checked by the server) ----------
export async function isAdmin() {
  if (!session) return false;
  if (adminCache === true) return true;   // only a 'yes' is remembered: a 'no' is asked again (the owner may have just been added)
  try { adminCache = !!(await call('/rest/v1/rpc/is_admin', { method: 'POST', body: {} })) || null; lastAdminError = null; } catch (e) { lastAdminError = e.message; return false; }
  return adminCache === true;
}
export const isAdminCached = () => adminCache === true;
// Why the owner check failed (a server message), or null if the server simply said 'not an admin'.
let lastAdminError = null;
export const adminError = () => lastAdminError;
export const adminOverview = () => call('/rest/v1/rpc/admin_overview', { method: 'POST', body: {} });
