import './core/compat.js';
// App shell: boot, onboarding, mode homes, grown-ups area.
import { $, $$, h, esc, holdButton, squash, popIn, toast } from './core/ui.js';
import { t, tr, setLang, lang, LANGS } from './core/i18n.js';
import { profile, profiles, addProfile, setActive, updateProfile, removeProfile, resetProgress, effectiveMode, modeForAge, settings, save, clearLearners, reload } from './core/store.js';
import { sfx, say, unlockAudio, hush } from './core/audio.js';
import { status, pct, nextSkill } from './core/mastery.js';
import { PIP, ICON, SKILL_ICON, sticker } from './core/art.js';
import { playSkill } from './engine/player.js';
import { dashboard } from './dashboard.js';
import { tableExplainer } from './content/table_learn.js';
import { LEARN } from './content/learn.js';
import { learnerReport, familyReport, reportText } from './report.js';
import { adminError, signedIn, userEmail, signUp, signIn, signOut, resetPassword, setPassword, deleteAccount, syncNow, cloudStatus, onStatus, handleAuthRedirect, checkSession, isAdmin, isAdminCached, adminOverview } from './core/cloud.js';
import { REGIONS, R, regionId, setRegion, hasRegion, loc, lvShort, lvLong } from './core/region.js';

const app = $('#app');
let content = { skills: [], explainers: {} }, RAW = [], lastOpen = 0;   // lastOpen: ignore a second tap that would start a lesson twice
// Lessons for this country: drop ones marked for other countries, use international names outside India.
function applyRegion() { const id = regionId(); content.skills = RAW.filter(s => !s.regions || s.regions.includes(id)).map(s => loc(id !== 'india' && s.intl ? { ...s, ...s.intl } : { ...s })); }
const COLORS = ['#ff8a3d', '#4dabf7', '#5cc96b', '#9775fa', '#ff6b8a', '#ffb020'];
const TRACKS = ['school', 'life', 'uni', 'tables', 'tricks', 'vedic', 'logic', 'exam', 'method'];
let tab = null;

// Signing in happens on the Uplore home page. "again" shows a friendly "please sign in again" there.
let leaving = false;
function toHub(again) { if (leaving) return; leaving = true; location.replace('../#signin' + (again ? '-again' : '')); }
const UPLORE = `<a class="btn grownbtn uplink" href="../" aria-label="Uplore home">← Uplore</a>`;
// Another tab (Maths or the home page) signed in or out, or changed the learners.
function otherTab() {
  if (leaving) return;
  const s = checkSession();
  if (s === 'gone') return toHub(false);
  if (s === 'changed') { leaving = true; location.reload(); return; }
  if (reload()) afterSync();
}

const mount = el => { app.replaceChildren(el); window.scrollTo(0, 0); };
const applyMode = () => { const p = profile(); document.documentElement.dataset.mode = p ? effectiveMode(p) : 'little'; };
const skillsFor = p => content.skills.filter(s => s.modes.includes(effectiveMode(p)));

async function boot() {
  window.__pipStarted = true;
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  try {
    const [s, e] = await Promise.all([fetch('content/skills.json').then(r => r.json()), fetch('content/explainers.json').then(r => r.json())]);
    RAW = s.skills; content = { skills: [], explainers: e };
    // "Learn first" explainers, built when opened so they follow the learner's country.
    RAW.forEach(k => { if (!k.intro && LEARN[k.id]) { k.intro = 'L-' + k.id; Object.defineProperty(e, k.intro, { get: () => loc(LEARN[k.id]()), enumerable: true, configurable: true }); } });
    applyRegion();
    // Times tables: a 'Learn' explainer for each table (built here, not stored).
    RAW.forEach(k => { if (k.intro && k.intro.startsWith('tbl-')) { const n = k.params.n; content.explainers[k.intro] = Array.isArray(n) ? tableExplainer(24, 'Learn the tables of 21 to 30') : tableExplainer(n); } });
  } catch (err) { app.innerHTML = '<p class="err">Could not load lessons. Please reload the page.</p>'; return; }
  // Family account: finish an email link (old links still land here), then sync in the background.
  const auth = handleAuthRedirect();
  // No lessons without a family account: sign in on the home page.
  if (!signedIn()) return toHub(false);
  onStatus(() => { if (!signedIn()) toHub(true); });   // the session ended (expired, or the server refused it)
  window.addEventListener('storage', e => { if (e.key === null || /^pipmaths\.(session|v1|synced)$/.test(e.key)) otherTab(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) otherTab(); });
  window.addEventListener('pageshow', e => { if (e.persisted) otherTab(); });
  syncNow().then(ok => { if (ok) afterSync(); });
  if (auth) setTimeout(() => { if (auth.error) toast(auth.error); else if (auth.type === 'recovery') accountSheet('newpw', home); else toast(t('acc.confirmed')); }, 700);
  window.addEventListener('pip-synced', afterSync);
  // Typing #admin while the app is already open: the page does not reload, so react here.
  window.addEventListener('hashchange', () => { if (location.hash === '#admin') { if (!profile() && profiles().length) setActive(profiles()[0].id); ownerGate(admin); } });
  const wantAdmin = location.hash === '#admin';
  if (!profiles().length) { onboarding(); if (wantAdmin) ownerGate(admin); return; }
  if (wantAdmin) { if (!profile()) setActive(profiles()[0].id); applyMode(); home(); ownerGate(admin); return; }
  // The learner is chosen on the Uplore home page: open straight into them. "Who is playing?" only
  // when none is chosen (opened directly, or after Log out in Maths).
  if (!profile()) picker(); else { setLang(profile().lang); applyMode(); home(); }
}

// ---------- Owner lock: the admin page needs the owner's passcode (remembered on the owner's device) ----------
async function ownerGate(next) {
  if (signedIn() && await isAdmin()) return next();
  const out = !signedIn();
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="ownh"><div class="ghead"><h3 id="ownh">${t('own.title')}</h3><button class="icon ownno" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <p>${t(out ? 'own.signin' : 'own.notadmin')}</p>${!out ? `<p class="note">${t('own.as', { email: esc(userEmail() || '') })}${adminError() ? `<br>${t('own.err')} <code>${esc(adminError())}</code>` : ''}</p>` : ''}
    <div class="row" style="justify-content:flex-start">${out ? `<button class="btn primary ownin">${t('acc.signin')}</button>` : ''}<button class="btn ownok">${t('ui.ok')}</button></div></div></div>`);
  document.body.append(el);
  const close = () => { el.remove(); if (location.hash === '#admin') history.replaceState(null, '', location.pathname); };
  $('.ownno', el).onclick = close; $('.ownok', el).onclick = close;
  if (out) $('.ownin', el).onclick = () => { close(); toHub(false); };
}

// ---------- Family account: sign up, sign in, forgot password, new password ----------
function accountSheet(kind, after) {
  const titles = { signup: 'acc.create', signin: 'acc.signin', forgot: 'acc.forgot', newpw: 'acc.newpw' };
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="acch"><div class="ghead"><h3 id="acch">${t(titles[kind])}</h3><button class="icon accx" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <p class="accintro">${t('acc.intro.' + kind)}</p>
    <form class="form accform" novalidate>
      ${kind !== 'newpw' ? `<label><span>${t('acc.email')}</span><input id="accemail" name="email" type="email" autocomplete="username" inputmode="email" autocapitalize="off" spellcheck="false" required></label>`
        // Password managers need to know whose password this is before they offer to create and save one.
        : `<input type="email" name="email" autocomplete="username" value="${esc(userEmail() || '')}" readonly hidden>`}
      ${kind !== 'forgot' ? `<label><span>${t(kind === 'newpw' ? 'acc.newpw' : 'acc.password')}</span><span class="pwrow"><input id="accpw" name="password" type="password" autocomplete="${kind === 'signin' ? 'current-password' : 'new-password'}" minlength="8" autocapitalize="off" spellcheck="false"${kind === 'signin' ? '' : ' passwordrules="minlength: 8; required: lower; required: upper; required: digit;"'} required><button type="button" class="btn ghost pwshow" aria-pressed="false">${t('acc.show')}</button></span></label>${kind === 'signin' ? '' : `<small class="pwtip">${t('acc.pwTip')}</small>`}` : ''}
      ${kind === 'signup' ? `<label class="acccons"><input id="acccons" type="checkbox"> <span>${t('acc.consent')}</span></label>` : ''}
      <p class="accmsg" role="alert"></p>
      <div class="row" style="justify-content:flex-start"><button class="btn primary accgo" type="submit">${t(titles[kind])}</button></div>
    </form>
    <div class="row acclinks" style="justify-content:flex-start">
      ${kind === 'signin' ? `<button class="btn ghost" data-k="forgot">${t('acc.forgotQ')}</button><button class="btn ghost" data-k="signup">${t('acc.noAccount')}</button>` : ''}
      ${kind === 'signup' || kind === 'forgot' ? `<button class="btn ghost" data-k="signin">${t('acc.haveAccount')}</button>` : ''}
    </div></div></div>`);
  document.body.append(el);
  const msg = $('.accmsg', el), go = $('.accgo', el), close = () => el.remove();
  $('.accx', el).onclick = close;
  $$('[data-k]', el).forEach(b => b.onclick = () => { close(); accountSheet(b.dataset.k, after); });
  const first = $('input:not([hidden])', el); if (first) setTimeout(() => first.focus(), 50);
  const show = $('.pwshow', el); if (show) show.onclick = () => { const i = $('#accpw', el), on = i.type === 'password'; i.type = on ? 'text' : 'password'; show.textContent = t(on ? 'acc.hide' : 'acc.show'); show.setAttribute('aria-pressed', on); i.focus(); };
  $('.accform', el).onsubmit = async e => {
    e.preventDefault(); msg.textContent = ''; msg.className = 'accmsg';
    const email = $('#accemail', el) ? $('#accemail', el).value.trim() : '', pw = $('#accpw', el) ? $('#accpw', el).value : '';
    if (kind !== 'newpw' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = t('acc.badEmail'); return; }
    if (kind !== 'forgot' && pw.length < 8) { msg.textContent = t('acc.shortPw'); return; }
    if (kind === 'signup' && !$('#acccons', el).checked) { msg.textContent = t('acc.needConsent'); return; }
    go.disabled = true; go.textContent = t('acc.wait');
    try {
      if (kind === 'signup') {
        const r = await signUp(email, pw);
        if (r.confirm) { $('.accform', el).innerHTML = `<p class="accok">${t('acc.checkEmail', { email: esc(email) })}</p>`; $('.acclinks', el).innerHTML = ''; return; }
      } else if (kind === 'signin') await signIn(email, pw);
      else if (kind === 'forgot') { await resetPassword(email); $('.accform', el).innerHTML = `<p class="accok">${t('acc.resetSent', { email: esc(email) })}</p>`; $('.acclinks', el).innerHTML = ''; return; }
      else await setPassword(pw);
      close(); afterSync(); toast(t(kind === 'newpw' ? 'acc.pwSaved' : 'acc.welcome'));
      if (after) after(); else grownups();
    } catch (err) { msg.textContent = err.message; go.disabled = false; go.textContent = t(titles[kind]); }
  };
}
// After a sync, other devices' learners and settings may have arrived: refresh the screen.
function afterSync() {
  applyRegion();
  const q = sel => document.querySelector(sel);
  const onSetup = q('#app > section.ob'), onHome = q('#app > section.home:not(.admin):not(.dash)'), onPicker = q('#app > .picker');
  if (!profiles().length) { if (!onSetup) onboarding(); return; }
  // Only redraw the first screen, the picker or the main page (never admin, the dashboard, a lesson or an open panel).
  if (q('.sheet.on') || !(onSetup || onHome || onPicker)) return;
  // "Who is playing?" stays until someone taps a learner: a sync only refreshes the list.
  if (onPicker || !profile()) { picker(); return; }
  applyMode(); tab = null; home();
}
function accountBlock() {
  const st = cloudStatus();
  if (!signedIn()) return `<div class="acct"><b>${t('acc.title')}</b><p>${t('acc.why')}</p>
    <div class="row" style="justify-content:flex-start"><a class="btn primary" href="../#signin">${t('acc.signin')}</a><a class="btn ghost" href="privacy.html">${t('acc.privacy')}</a></div></div>`;
  const when = st.at ? new Date(st.at).toLocaleTimeString(R().locale, { hour: 'numeric', minute: '2-digit' }) : '';
  const line = st.state === 'syncing' ? t('acc.syncing') : st.state === 'offline' ? t('acc.offline') : st.error ? esc(st.error) : when ? t('acc.savedAt', { time: when }) : t('acc.auto');
  return `<div class="acct"><b>${t('acc.title')}</b><p>${t('acc.as', { email: esc(userEmail() || '') })}<br><small class="accst">${line}</small></p>
    <div class="row" style="justify-content:flex-start"><button class="btn gsync">${t('acc.syncNow')}</button><button class="btn gsignout">${t('acc.signout')}</button><a class="btn ghost" href="privacy.html">${t('acc.privacy')}</a><button class="btn ghost gdelacct">${t('acc.delete')}</button></div></div>`;
}

// ---------- Grown-ups gate: a quick sum instead of a hidden press-and-hold ----------
function gate(next) {
  const p = profile(); if (p && effectiveMode(p) === 'adult') return next();
  const a = 3 + Math.floor(Math.random() * 7), b = 6 + Math.floor(Math.random() * 7);
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="gq"><div class="ghead"><h3 id="gq">${t('pgate.title')}</h3><button class="icon gx" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <p>${t('pgate.ask')}</p><div class="gsum">${a} × ${b} = <input id="gans" inputmode="numeric" autocomplete="off" aria-label="${t('pgate.answer')}"></div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary gok">${t('ui.ok')}</button></div></div></div>`);
  document.body.append(el);
  const inp = $('#gans', el), close = () => el.remove();
  const check = () => { if (+inp.value === a * b) { close(); next(); } else { inp.value = ''; toast(t('pgate.wrong')); close(); gate(next); } };
  $('.gok', el).onclick = check; inp.onkeydown = e => { if (e.key === 'Enter') check(); };
  $('.gx', el).onclick = close; el.addEventListener('click', e => { if (e.target === el) close(); });
  inp.focus();
}

// ---------- Who is playing? (shown after logging out, or when there are several learners) ----------
function picker() {
  document.documentElement.dataset.mode = 'little'; hush();
  const el = h(`<section class="ob scene picker">${UPLORE}<div class="obpip">${PIP()}</div><h1 class="obh">${t('pick.who')}</h1>
    <div class="pgrid">${profiles().map(q => `<button class="pcard" data-p="${q.id}"><span class="av big" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span><b>${esc(q.name)}</b><small>${t('mode.' + effectiveMode(q))}</small></button>`).join('')}
      <button class="pcard add"><span class="av big plus">+</span><b>${t('ui.addLearner')}</b></button></div>
    <button class="btn grownbtn pgrown">${ICON.gear}<span>${t('ui.grownups')}</span></button></section>`);
  mount(el);
  $$('[data-p]', el).forEach(b => b.onclick = () => { sfx.pop(); setActive(b.dataset.p); tab = null; home(); say(t('ob.hello', { name: profile().name })); });
  $('.pcard.add', el).onclick = () => onboarding({ cancel: picker });
  $('.pgrown', el).onclick = () => gate(() => { if (!profile()) setActive(profiles()[0].id); applyMode(); home(); grownups(); });
}

// ---------- Onboarding ----------
function onboarding({ cancel } = {}) {
  document.documentElement.dataset.mode = 'little';
  setLang('en');
  const draft = { lang: 'en', name: '', age: null, color: COLORS[profiles().length % COLORS.length], region: regionId() };
  const ages = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const el = h(`<section class="ob scene">${UPLORE}<div class="obpip">${PIP()}</div><div class="obcard">
    <h1>${t('ob.who')}</h1>
    ${hasRegion() ? '' : `<div class="fl"><span>${t('ob.country')}</span><div class="boards">${Object.entries(REGIONS).map(([k, r]) => `<button class="bb rg${k === draft.region ? ' on' : ''}" data-r="${k}">${r.name}</button>`).join('')}</div></div>`}
    <label class="fl"><span>${t('ob.name')}</span><input id="obname" maxlength="20" autocomplete="off" placeholder="${t('ob.namePh')}"></label>
    <div class="colors">${COLORS.map(c => `<button class="sw${c === draft.color ? ' on' : ''}" data-c="${c}" style="--c:${c}" aria-label="Colour"></button>`).join('')}</div>
    <div class="fl"><span>${t('ob.age')}</span><div class="ages">${ages.map(a => `<button class="ab" data-a="${a}">${a === 19 ? t('ob.adult') : a}</button>`).join('')}</div></div>
    <p class="obmode"></p>
    <div class="row">${cancel ? `<button class="btn obback">${t('ui.back')}</button>` : ''}<button class="btn primary obgo" disabled>${t('ob.go')}</button></div></div></section>`);
  mount(el);
  const go = $('.obgo'), sync = () => { go.disabled = !(draft.name.trim() && draft.age); $('.obmode').textContent = draft.age ? `${t('ui.mode')}: ${t('mode.' + modeForAge(draft.age))}` : ''; };
  $('#obname').oninput = e => { draft.name = e.target.value; sync(); };
  $$('.sw').forEach(b => b.onclick = () => { draft.color = b.dataset.c; $$('.sw').forEach(x => x.classList.toggle('on', x === b)); });
  $$('.ab').forEach(b => b.onclick = () => { draft.age = +b.dataset.a; $$('.ab').forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); sync(); });
  $$('.rg').forEach(b => b.onclick = () => { draft.region = b.dataset.r; $$('.rg').forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); });
  if (cancel) $('.obback').onclick = cancel;
  go.onclick = () => { if (!hasRegion()) { setRegion(draft.region); applyRegion(); } const p = addProfile({ ...draft, name: draft.name.trim() }); sfx.fanfare(); applyMode(); tab = null; home(); say(t('ob.hello', { name: p.name })); };
  $('#obname').focus();
}

// ---------- Home (one renderer, four skins) ----------
function home() {
  const p = profile(); if (!p) return onboarding();
  setLang(p.lang); applyMode();
  const mode = effectiveMode(p), list = skillsFor(p);
  const tracks = TRACKS.filter(tk => list.some(s => s.track === tk));
  if (!tracks.includes(tab)) tab = tracks[0];
  const up = nextSkill(p, byAge(p, list));
  const shown = list.filter(s => s.track === tab);
  // Lessons grouped by level, collapsed; the learner's own level (from age) starts open.
  const groups = groupByLevel(shown), own = LEVELS[Math.max(0, Math.min(13, p.age - 4))];
  const key = p.id + '|' + tab;
  if (!openLevels.has(key)) {
    const have = groups.map(g => g[0]), near = have.includes(own) ? own : have.slice().sort((a, b) => Math.abs(LEVELS.indexOf(a) - LEVELS.indexOf(own)) - Math.abs(LEVELS.indexOf(b) - LEVELS.indexOf(own)))[0];
    openLevels.set(key, new Set(groups.length <= 1 ? have : [near]));
  }
  const opened = openLevels.get(key);
  const stat = mode === 'little' ? `<button class="pill book" aria-label="${t('book.title')}">${sticker('count', 0)}<b>${p.stickers.length}</b></button>`
    : mode === 'explore' ? `<span class="pill">${ICON.coin}<b>${p.coins}</b></span>`
    : `<span class="pill">${ICON.star}<b>${list.filter(s => status(p.progress[s.id]) === 'mastered').length}/${list.length}</b></span>`;
  const el = h(`<section class="home">
    <header class="htop">${UPLORE}<button class="who" aria-label="${t('ui.switch')}"><span class="av" style="--c:${p.color}">${esc(p.name[0] || '?').toUpperCase()}</span><span class="nm">${esc(p.name)}</span></button>
      <span class="modechip">${t('mode.' + mode)}</span>${stat}<button class="btn grownbtn progbtn" aria-label="${t('g.progress')}">${ICON.chart}<span>${t('g.progress')}</span></button><button class="btn grownbtn gear" aria-label="${t('ui.grownups')}">${ICON.gear}<span>${t('ui.grownups')}</span></button></header>
    <div class="hero">${mode !== 'adult' ? `<div class="hpip">${PIP()}</div>` : ''}
      <button class="upnext" data-id="${up.id}"><span class="ic">${SKILL_ICON[up.icon] || ''}</span><span class="ut"><small>${t('ui.upNext')}</small><b>${esc(tr(up.title))}</b><em>${esc(lvShort(up.level))} · ${esc(up.strand)}</em></span><span class="go">${ICON.play}</span></button></div>
    <nav class="tabs" role="tablist">${tracks.map(tk => `<button role="tab" class="tab${tk === tab ? ' on' : ''}" aria-selected="${tk === tab}" data-t="${tk}">${t('track.' + tk)}</button>`).join('')}</nav>
    ${groups.map(([lv, l]) => `<details class="lvl" data-lv="${lv}"${opened.has(lv) ? ' open' : ''}><summary class="lvlh"><span class="lvn">${lv === 'other' ? t('lvl.other') : EXTRA.includes(lv) ? t('lvl.x.' + lv) : lvLong(lv)}</span>${lv === own ? `<span class="you">${t('lvl.yours')}</span>` : ''}<small>${l.filter(s => status(p.progress[s.id]) === 'mastered').length}/${l.length}</small><span class="chev" aria-hidden="true"></span></summary><div class="skills">${l.map(s => card(p, s, mode)).join('')}</div></details>`).join('')}
    </section>`);
  mount(el);
  $$('details[open] .skill', el).forEach((c, i) => popIn(c, i * 40));
  $$('details.lvl', el).forEach(d => d.addEventListener('toggle', () => { d.open ? opened.add(d.dataset.lv) : opened.delete(d.dataset.lv); if (d.open) { sfx.tap(); $$('.skill', d).forEach((c, i) => popIn(c, i * 30)); } }));
  $$('.tab', el).forEach(b => b.onclick = () => { tab = b.dataset.t; sfx.tap(); home(); });
  const open = id => { if (Date.now() - lastOpen < 1500) return; lastOpen = Date.now(); const s = content.skills.find(x => x.id === id); if (mode === 'little') say(tr(s.title)); sfx.pop(); setTimeout(() => playSkill(s, content, { mount, onExit: home }), mode === 'little' ? 500 : 0); };
  $$('[data-id]', el).forEach(b => b.onclick = () => open(b.dataset.id));
  if ($('.pill.book', el)) $('.pill.book', el).onclick = () => { sfx.pop(); stickerBook(); };
  $('.who', el).onclick = () => { sfx.tap(); learnerSheet(); };
  $('.progbtn', el).onclick = () => { sfx.tap(); progressSheet(); };
  const gear = $('.gear', el);
  gear.onclick = () => gate(grownups);
}
// Levels in teaching order; the learner's own level is recommended first.
const LEVELS = ['JK', 'SK', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
// Grown-up groups come after the school grades, in this order.
const EXTRA = ['Everyday', 'Money', 'Tests', 'Uni'], ORDER = [...LEVELS, ...EXTRA];
function byAge(p, list) {
  const target = Math.max(0, Math.min(13, p.age - 4)), idx = s => { const i = LEVELS.indexOf(s.level); return i < 0 ? target : i; };
  const rank = s => { const d = idx(s) - target; return d === 0 ? 0 : d < 0 ? -d * 2 - 1 : d * 2; };
  return [...list].sort((a, b) => rank(a) - rank(b));
}
function groupByLevel(list) {
  const g = new Map(); list.forEach(s => { const k = ORDER.includes(s.level) ? s.level : 'other'; if (!g.has(k)) g.set(k, []); g.get(k).push(s); });
  return [...g.entries()].sort((a, b) => (ORDER.indexOf(a[0]) + 1 || 99) - (ORDER.indexOf(b[0]) + 1 || 99));
}
// Which levels are open on the main page, per learner and tab (kept while the app is open).
const openLevels = new Map();
function stickerBook() {
  const p = profile(), n = Math.max(12, Math.ceil((p.stickers.length + 1) / 6) * 6);
  const el = h(`<section class="home"><header class="htop"><button class="icon aback" aria-label="${t('ui.back')}">${ICON.back}</button><h1 class="admh">${t('book.title')}</h1><span class="pill">${sticker('count', 0)}<b>${p.stickers.length}</b></span></header>
    ${p.stickers.length ? '' : `<p class="note">${t('book.empty')}</p>`}
    <div class="bookpage">${Array.from({ length: n }, (_, i) => `<div class="bslot"${p.stickers[i] ? ' style="border:0"' : ''}>${p.stickers[i] ? sticker(p.stickers[i], i + 1) : ''}</div>`).join('')}</div></section>`);
  mount(el); say(p.stickers.length ? t('book.title') : t('book.empty'));
  $('.aback', el).onclick = home;
}
function card(p, s, mode) {
  const r = p.progress[s.id], st = status(r), m = pct(r);
  return `<button class="skill st-${st}" data-id="${s.id}"><span class="ring" style="--p:${m}">${SKILL_ICON[s.icon] || ''}</span>
    <span class="sk"><b>${esc(tr(s.title))}</b>${mode === 'little' ? '' : `<small>${esc(lvShort(s.level))} · ${esc(s.tag || s.strand)}</small>`}</span>
    ${mode === 'little' ? (st === 'mastered' ? `<span class="done">${ICON.star}</span>` : '') : `<span class="chip s-${st}">${t('status.' + st)}</span>`}</button>`;
}

// ---------- Learner switcher ----------
function learnerSheet() {
  const me = profile();
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="lt"><div class="ghead"><h3 id="lt">${t('g.learners')}</h3><button class="icon sclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <div class="lrs">${profiles().map(q => `<button class="lr${q.id === me.id ? ' on' : ''}" data-p="${q.id}"><span class="av" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span>${esc(q.name)}<small>${q.id === me.id ? t('ui.current') : t('mode.' + effectiveMode(q))}</small></button>`).join('')}</div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary sedit">${t('ui.editProfile', { name: esc(me.name) })}</button><button class="btn sadd">+ ${t('ui.addLearner')}</button><button class="btn slogout">${t('ui.logout')}</button></div></div></div>`);
  document.body.append(el);
  el.onclick = e => {
    const b = e.target.closest('[data-p]');
    if (b) { setActive(b.dataset.p); tab = null; el.remove(); hush(); home(); }
    else if (e.target.closest('.sedit')) { el.remove(); editProfile(); }
    else if (e.target.closest('.sadd')) { el.remove(); onboarding({ cancel: home }); }
    else if (e.target.closest('.slogout')) { el.remove(); setActive(null); picker(); }
    else if (e.target === el || e.target.closest('.sclose')) el.remove();
  };
}
function editProfile() {
  const p = profile(), d = { name: p.name, age: p.age, color: p.color };
  const ages = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const el = h(`<div class="sheet on"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="et"><div class="ghead"><h3 id="et">${t('ui.editTitle')}</h3><button class="icon eclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <label class="fl"><span>${t('ob.name')}</span><input id="ename" maxlength="20" autocomplete="off" value="${esc(p.name)}"></label>
    <div class="colors">${COLORS.map(c => `<button class="sw${c === d.color ? ' on' : ''}" data-c="${c}" style="--c:${c}" aria-label="Colour"></button>`).join('')}</div>
    <div class="fl"><span>${t('ob.age')}</span><div class="ages">${ages.map(a => `<button class="ab${a === Math.min(p.age, 19) ? ' on' : ''}" data-a="${a}">${a === 19 ? t('ob.adult') : a}</button>`).join('')}</div></div>
    <p class="obmode"></p>
    <div class="row" style="justify-content:flex-start"><button class="btn primary esave">${t('ui.save')}</button><button class="btn ecancel">${t('ui.cancel')}</button></div></div></div>`);
  document.body.append(el);
  const sync = () => { $('.obmode', el).textContent = `${t('ui.mode')}: ${t('mode.' + (p.modeOverride || modeForAge(d.age)))}`; $('.esave', el).disabled = !d.name.trim(); };
  $('#ename', el).oninput = e => { d.name = e.target.value; sync(); };
  $$('.sw', el).forEach(b => b.onclick = () => { d.color = b.dataset.c; $$('.sw', el).forEach(x => x.classList.toggle('on', x === b)); });
  $$('.ab', el).forEach(b => b.onclick = () => { d.age = +b.dataset.a; $$('.ab', el).forEach(x => x.classList.toggle('on', x === b)); sync(); });
  const close = () => el.remove();
  $('.eclose', el).onclick = close; $('.ecancel', el).onclick = close;
  $('.esave', el).onclick = () => { updateProfile({ name: d.name.trim(), age: d.age, color: d.color }); el.remove(); tab = null; sfx.pop(); home(); toast(t('ui.saved')); };
  sync(); $('#ename', el).focus();
}

// ---------- Grown-ups area ----------
// ---------- Progress: the current learner's own progress (no grown-ups sum needed) ----------
function progressSheet() {
  const p = profile(), list = skillsFor(p);
  const by = { mastered: [], review: [], learning: [], new: [] };   // review = mastered, due for a refresher
  list.forEach(s => { const st = status(p.progress[s.id]); (by[st] || by.new).push(s); });
  const done = [...by.review, ...by.learning, ...by.mastered];
  const rows = done.sort((a, b) => pct(p.progress[b.id]) - pct(p.progress[a.id])).map(s => { const r = p.progress[s.id], st = status(r);
    return `<tr><td>${SKILL_ICON[s.icon] || ''}<span>${esc(tr(s.title))}<small>${t('track.' + s.track)} · ${esc(lvShort(s.level))}</small></span></td><td><span class="chip s-${st}">${t('status.' + st)}</span></td><td class="r"><span class="pbar"><i style="width:${pct(r)}%"></i></span>${pct(r)}%</td></tr>`; }).join('');
  const el = h(`<div class="sheet on prog"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="prh">
    <div class="ghead"><h3 id="prh">${t('prog.title', { name: esc(p.name) })}</h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <div class="ptiles"><div class="kpi"><b>${by.mastered.length + by.review.length}</b><span>${t('status.mastered')}</span></div><div class="kpi"><b>${by.learning.length}</b><span>${t('status.learning')}</span></div><div class="kpi"><b>${by.new.length}</b><span>${t('prog.notyet')}</span></div></div>
    ${rows ? `<div class="scroll"><table class="ptab"><thead><tr><th>${t('g.skill')}</th><th>${t('g.status')}</th><th class="r">${t('prog.score')}</th></tr></thead><tbody>${rows}</tbody></table></div>`
      : `<p class="note">${t('prog.empty')}</p>`}
  </div></div>`);
  document.body.append(el);
  const close = () => el.remove();
  $('.gclose', el).onclick = close; el.onclick = e => { if (e.target === el) close(); };
}

// Weekly report: every learner on this device, last 7 days, with an email button for the grown-up.
function reportSheet() {
  const rep = familyReport(profiles().map(q => learnerReport(q, skillsFor(q))));
  const pctBar = n => `<span class="pbar"><i style="width:${n}%"></i></span>`;
  const card = r => {
    const trend = !r.prevN ? '' : r.n > r.prevN ? ` <span class="up">▲ ${t('rep.more', { n: r.n - r.prevN })}</span>` : r.n < r.prevN ? ` <span class="down">▼ ${t('rep.fewer', { n: r.prevN - r.n })}</span>` : '';
    return `<section class="repcard"><h4><span class="av" style="--c:${r.p.color}">${esc(r.p.name[0]).toUpperCase()}</span>${esc(r.p.name)}</h4>
      ${r.n ? `<div class="ptiles"><div class="kpi"><b>${r.days}</b><span>${t('rep.days')}</span></div><div class="kpi"><b>${r.n}</b><span>${t('rep.questions')}${trend}</span></div><div class="kpi"><b>${r.pct}%</b><span>${t('rep.right')}</span></div></div>
        ${r.practised.length ? `<h5>${t('rep.practised')}</h5><ul class="replist">${r.practised.map(x => `<li><span>${esc(tr(x.s.title))}</span>${pctBar(x.pct)}<b>${x.pct}%</b></li>`).join('')}</ul>` : ''}
        ${r.mastered.length ? `<h5>${t('rep.mastered')}</h5><p>${r.mastered.map(s2 => `<span class="chip s-mastered">${esc(tr(s2.title))}</span>`).join(' ')}</p>` : ''}
        ${r.help.length ? `<h5>${t('rep.help')}</h5><ul class="replist">${r.help.map(x => `<li><span>${esc(tr(x.s.title))} <small>${x.pct}%</small></span><button class="btn rgo" data-p="${r.p.id}" data-s="${x.s.id}">${t('mock.practise')}</button></li>`).join('')}</ul>` : ''}`
      : `<p class="note">${t('rep.none')}</p>`}
      ${r.due ? `<p>${t(r.due === 1 ? 'rep.due' : 'rep.dueN', { n: r.due })}</p>` : ''}
      ${r.next ? `<p><b>${t('rep.next')}</b> ${esc(tr(r.next.title))}</p>` : ''}
      <div class="reptry"><b>${t('rep.home')}</b><p>${esc(r.activity)}</p></div></section>`;
  };
  const email = userEmail() || '', text = reportText(rep, t('rep.title'));
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(t('rep.subject', { range: rep.range }))}&body=${encodeURIComponent(text)}`;
  const el = h(`<div class="sheet on report"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="rph">
    <div class="ghead"><h3 id="rph">${t('rep.title')}<small>${esc(rep.range)}</small></h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <div class="row" style="justify-content:flex-start"><a class="btn primary rmail" href="${mailto}">${t('rep.email')}</a><button class="btn rcopy">${t('rep.copy')}</button></div>
    <p class="note">${email ? t('rep.emailNote', { email: esc(email) }) : t('rep.emailNoAcct')}</p>
    ${rep.learners.map(card).join('')}
  </div></div>`);
  document.body.append(el);
  const close = () => el.remove();
  $('.gclose', el).onclick = close; el.onclick = e => { if (e.target === el) close(); };
  $('.rcopy', el).onclick = async () => { try { await navigator.clipboard.writeText(text); toast(t('rep.copied')); } catch (e) { toast(t('rep.copyFail')); } };
  el.querySelectorAll('.rgo').forEach(b => b.onclick = () => {
    const s2 = content.skills.find(x => x.id === b.dataset.s); if (!s2) return;
    document.querySelectorAll('.sheet').forEach(x => x.remove()); setActive(b.dataset.p); applyMode();
    playSkill(s2, content, { mount, onExit: home });
  });
}

function grownups() {
  const p = profile(), S = settings(), list = skillsFor(p);
  const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([v, n]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
  const el = h(`<div class="sheet on grown"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="gt">
    <div class="ghead"><h3 id="gt">${t('g.title')}</h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <h4>${t('g.learners')}</h4>
    <div class="lrs">${profiles().map(q => `<button class="lr${q.id === p.id ? ' on' : ''}" data-p="${q.id}"><span class="av" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span>${esc(q.name)}<small>${q.age > 18 ? t('ob.adult') : q.age} · ${t('mode.' + effectiveMode(q))}</small></button>`).join('')}
      <button class="lr add">+ ${t('ui.addLearner')}</button><button class="lr add gedit">✎ ${t('ui.editProfile', { name: esc(p.name) })}</button></div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary gdash">${ICON.star}<span>${t('dash.open')}</span></button><button class="btn greport">${t('rep.open')}</button>${isAdminCached() ? `<button class="btn primary gadmin">${t('adm.open', { n: content.skills.length })}</button>` : ''}<a class="btn" href="diag.html">${t('ui.devcheck')}</a></div>
    ${accountBlock()}
    <h4>${esc(p.name)}</h4>
    <div class="form">
      <label><span>${t('ui.country')}</span>${sel('gregion', Object.entries(REGIONS).map(([k, r]) => [k, r.name]), regionId())}</label>
      <label><span>${t('ui.mode')}</span>${sel('gmode', [['', t('mode.auto')], ...['little', 'explore', 'achieve', 'adult'].map(m => [m, t('mode.' + m)])], p.modeOverride || '')}</label>
      <label class="tg"><span>${t('ui.sound')}</span><button class="tog" id="gsound" aria-pressed="${S.sound}"></button></label>
      <label class="tg"><span>${t('ui.voice')}</span><button class="tog" id="gvoice" aria-pressed="${S.voice}"></button></label>
    </div>

    <p class="gnote">${t('g.note')}</p>
    <div class="row"><button class="btn glogout">${t('ui.logout')}</button><button class="btn ghost greset">${t('ui.reset')}</button><button class="btn ghost gdel">${t('ui.delete')}</button></div></div></div>`);
  document.body.append(el);
  const close = () => { el.remove(); home(); };
  $('.gclose', el).onclick = close;
  el.addEventListener('click', e => { if (e.target === el) close(); });
  $$('[data-p]', el).forEach(b => b.onclick = () => { setActive(b.dataset.p); tab = null; el.remove(); home(); grownups(); });
  $('.lr.add', el).onclick = () => { el.remove(); onboarding({ cancel: home }); };
  if ($('.gadmin', el)) $('.gadmin', el).onclick = () => { el.remove(); ownerGate(admin); };
  else if (signedIn()) isAdmin().then(yes => { if (yes && el.isConnected) { el.remove(); grownups(); } });
  if ($('.gsync', el)) $('.gsync', el).onclick = async () => { const st = $('.accst', el); st.textContent = t('acc.syncing'); const ok = await syncNow(); el.remove(); afterSync(); grownups(); toast(ok ? t('acc.synced') : cloudStatus().error); };
  // Sign out completely: back up first, then remove this family's learners from the device.
  if ($('.gsignout', el)) { const b = $('.gsignout', el); b.onclick = async () => {
    b.disabled = true; let ok = false; try { ok = await syncNow({ pull: false }); } catch (e) {} b.disabled = false;
    if (!ok && !b.dataset.arm) { b.dataset.arm = 1; b.textContent = t('acc.signoutAnyway'); toast(t('acc.notBackedUp')); return; }
    leaving = true; await signOut(); clearLearners(); location.replace('../');
  }; }
  if ($('.gdelacct', el)) { const b = $('.gdelacct', el); b.onclick = async () => { if (!b.dataset.arm) { b.dataset.arm = 1; b.textContent = t('acc.deleteConfirm'); return; } leaving = true; try { await deleteAccount(); clearLearners(); location.replace('../'); } catch (e) { leaving = false; toast(e.message); } }; }
  $('.gdash', el).onclick = () => { el.remove(); openDash(p.id); };
  $('.greport', el).onclick = () => reportSheet();
  $('.gedit', el).onclick = () => { el.remove(); editProfile(); };
  $('.glogout', el).onclick = () => { el.remove(); setActive(null); picker(); };
  $('#gregion', el).onchange = e => { setRegion(e.target.value); applyRegion(); tab = null; el.remove(); home(); grownups(); toast(t('ui.countrySet', { c: REGIONS[e.target.value].name })); };
  $('#gmode', el).onchange = e => { updateProfile({ modeOverride: e.target.value || null }); tab = null; el.remove(); home(); grownups(); };
  $('#gsound', el).onclick = e => { S.sound = !S.sound; e.currentTarget.setAttribute('aria-pressed', S.sound); save(); };
  $('#gvoice', el).onclick = e => { S.voice = !S.voice; e.currentTarget.setAttribute('aria-pressed', S.voice); if (!S.voice) hush(); save(); };
  const twoTap = (btn, label, fn) => btn.onclick = () => { if (!btn.dataset.arm) { btn.dataset.arm = 1; btn.textContent = label; return; } fn(); };
  twoTap($('.greset', el), t('ui.resetConfirm'), () => { resetProgress(); el.remove(); home(); grownups(); });
  twoTap($('.gdel', el), t('ui.deleteConfirm'), () => { removeProfile(p.id); el.remove(); profile() ? home() : onboarding(); });
}

// ---------- Dashboard ----------
function openDash(pid) {
  dashboard({ owner: isAdminCached(), content, mount, pid, onBack: home,
    onTry: (id, who) => { setActive(who); const s = content.skills.find(x => x.id === id), m = effectiveMode(profile()); document.documentElement.dataset.mode = m; playSkill(s, content, { mount, onExit: () => openDash(who) }); } });
}

// ---------- Admin: every lesson in every mode ----------
const MODES = ['little', 'explore', 'achieve', 'adult'];
let admFilter = 'all', admQuery = '';
function admin() {
  if (!isAdminCached()) return ownerGate(admin);
  document.documentElement.dataset.mode = 'achieve';
  const all = content.skills, q = admQuery.trim().toLowerCase();
  const match = s => (admFilter === 'all' || s.modes.includes(admFilter)) && (!q || [s.title, s.level, lvLong(s.level), lvShort(s.level), s.tag || '', s.strand, s.track, s.gen || (s.seq || s.mix || []).join(' ')].join(' ').toLowerCase().includes(q));
  const shown = all.filter(match);
  const groups = TRACKS.map(tk => [tk, shown.filter(s => s.track === tk)]).filter(([, l]) => l.length);
  const el = h(`<section class="home admin">
    <header class="htop"><button class="icon aback" aria-label="${t('ui.back')}">${ICON.back}</button><h1 class="admh">${t('adm.title')}</h1><button class="btn adash">${ICON.star}<span>${t('dash.open')}</span></button><button class="btn ahome">${ICON.home}<span>${t('ui.home')}</span></button><span class="pill">${shown.length} / ${all.length}</span></header>
    <p class="admsub">${t('adm.sub')}</p>
    <div class="famov"><h2 class="admg">${t('adm.families')}</h2><div class="famgrid">${t('acc.wait')}</div></div>
    <div class="admbar"><input class="admq" type="search" placeholder="${t('adm.search')}" value="${esc(admQuery)}">
      <div class="tabs">${['all', ...MODES].map(m => `<button class="tab${m === admFilter ? ' on' : ''}" data-m="${m}">${m === 'all' ? t('ui.all') : t('mode.' + m)} <small>${m === 'all' ? all.length : all.filter(s => s.modes.includes(m)).length}</small></button>`).join('')}</div></div>
    ${groups.map(([tk, l]) => `<h2 class="admg">${t('track.' + tk)} <small>${l.length}</small></h2>
      <div class="scroll"><table class="ptab admtab"><thead><tr><th>${t('g.skill')}</th><th>${t('adm.level')}</th><th>${t('adm.modes')}</th><th>${t('adm.type')}</th><th></th></tr></thead><tbody>
      ${l.map(s => `<tr><td><span class="admic">${SKILL_ICON[s.icon] || ''}</span><b>${esc(tr(s.title))}</b><small>${esc(s.strand)}</small></td><td>${esc(lvShort(s.level))}${s.tag ? `<small>${esc(s.tag)}</small>` : ''}</td>
        <td>${s.modes.map(m => `<span class="chip">${t('mode.' + m)}</span>`).join(' ')}</td><td><code>${esc(s.gen || (s.seq || s.mix || []).join(' + '))}</code></td>
        <td class="r"><button class="btn primary aplay" data-id="${s.id}">${ICON.play}<span>${t('adm.try')}</span></button></td></tr>`).join('')}
      </tbody></table></div>`).join('') || `<p class="note">${t('adm.none')}</p>`}
  </section>`);
  mount(el);
  $('.aback', el).onclick = home;
  adminOverview().then(o => {
    const box = $('.famgrid', el); if (!box) return;
    const tile = (n, label) => `<div class="kpi"><b>${n}</b><span>${label}</span></div>`;
    const list = obj => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${esc(REGIONS[k] ? REGIONS[k].name : k === 'unknown' ? '–' : t('mode.' + k))} ${n}`).join(' · ');
    const top = (o.topLessons || []).map(x => { const s = RAW.find(y => y.id === x.id); return `<li>${esc(s ? tr(s.title) : x.id)} <small>${x.learners}</small></li>`; }).join('');
    box.innerHTML = tile(o.families, t('adm.f.families')) + tile(o.learners, t('adm.f.learners')) + tile(o.active7, t('adm.f.active7')) + tile(o.newFamilies30, t('adm.f.new30'))
      + `<p class="famline"><b>${t('adm.f.country')}</b> ${list(o.byCountry) || '–'}<br><b>${t('adm.f.mode')}</b> ${list(o.byMode) || '–'}</p>`
      + (top ? `<div class="famtop"><b>${t('adm.f.top')}</b><ol>${top}</ol></div>` : '');
  }).catch(e => { const box = $('.famgrid', el); if (box) box.textContent = e.message; });
  $('.adash', el).onclick = () => openDash(profile()?.id);
  $('.ahome', el).onclick = home;
  $$('[data-m]', el).forEach(b => b.onclick = () => { admFilter = b.dataset.m; admin(); });
  const qi = $('.admq', el); qi.oninput = () => { admQuery = qi.value; clearTimeout(qi._t); qi._t = setTimeout(() => { admin(); const n = $('.admq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
  $$('.aplay', el).forEach(b => b.onclick = () => {
    const s = content.skills.find(x => x.id === b.dataset.id), m = admFilter !== 'all' && s.modes.includes(admFilter) ? admFilter : s.modes[0];
    document.documentElement.dataset.mode = m;
    playSkill(s, content, { mount, onExit: admin, mode: m });
  });
}

boot();
