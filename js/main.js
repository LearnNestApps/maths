// App shell: boot, onboarding, mode homes, grown-ups area.
import { $, $$, h, esc, holdButton, squash, popIn, toast } from './core/ui.js';
import { t, tr, setLang, lang, LANGS } from './core/i18n.js';
import { profile, profiles, addProfile, setActive, updateProfile, removeProfile, resetProgress, effectiveMode, modeForAge, settings, save } from './core/store.js';
import { sfx, say, unlockAudio, hush } from './core/audio.js';
import { status, pct, nextSkill } from './core/mastery.js';
import { PIP, ICON, SKILL_ICON, sticker } from './core/art.js';
import { playSkill } from './engine/player.js';
import { dashboard } from './dashboard.js';

const app = $('#app');
let content = { skills: [], explainers: {} };
const COLORS = ['#ff8a3d', '#4dabf7', '#5cc96b', '#9775fa', '#ff6b8a', '#ffb020'];
const TRACKS = ['school', 'tables', 'tricks', 'vedic', 'logic', 'exam', 'method'];
let tab = null;

const mount = el => { app.replaceChildren(el); window.scrollTo(0, 0); };
const applyMode = () => { const p = profile(); document.documentElement.dataset.mode = p ? effectiveMode(p) : 'little'; };
const skillsFor = p => content.skills.filter(s => s.modes.includes(effectiveMode(p)));

async function boot() {
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  try {
    const [s, e] = await Promise.all([fetch('content/skills.json').then(r => r.json()), fetch('content/explainers.json').then(r => r.json())]);
    content = { skills: s.skills, explainers: e };
  } catch (err) { app.innerHTML = '<p class="err">Could not load lessons. Please reload the page.</p>'; return; }
  const p = profile();
  if (p) { setLang(p.lang); applyMode(); home(); } else onboarding();
}

// ---------- Onboarding ----------
function onboarding({ cancel } = {}) {
  document.documentElement.dataset.mode = 'little';
  setLang('en');
  const draft = { lang: 'en', name: '', age: null, color: COLORS[profiles().length % COLORS.length] };
  const ages = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const el = h(`<section class="ob scene"><div class="obpip">${PIP()}</div><div class="obcard">
    <h1>${t('ob.who')}</h1>
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
  if (cancel) $('.obback').onclick = cancel;
  go.onclick = () => { const p = addProfile({ ...draft, name: draft.name.trim() }); sfx.fanfare(); applyMode(); tab = null; home(); say(t('ob.hello', { name: p.name })); };
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
  const stat = mode === 'little' ? `<button class="pill book" aria-label="${t('book.title')}">${sticker('count', 0)}<b>${p.stickers.length}</b></button>`
    : mode === 'explore' ? `<span class="pill">${ICON.coin}<b>${p.coins}</b></span>`
    : `<span class="pill">${ICON.star}<b>${list.filter(s => status(p.progress[s.id]) === 'mastered').length}/${list.length}</b></span>`;
  const el = h(`<section class="home">
    <header class="htop"><button class="who" aria-label="${t('ui.switch')}"><span class="av" style="--c:${p.color}">${esc(p.name[0] || '?').toUpperCase()}</span><span class="nm">${esc(p.name)}</span></button>
      <span class="modechip">${t('mode.' + mode)}</span>${stat}<button class="icon gear" aria-label="${t('ui.holdHint')}" title="${t('ui.holdHint')}">${ICON.gear}</button></header>
    <div class="hero">${mode !== 'adult' ? `<div class="hpip">${PIP()}</div>` : ''}
      <button class="upnext" data-id="${up.id}"><span class="ic">${SKILL_ICON[up.icon] || ''}</span><span class="ut"><small>${t('ui.upNext')}</small><b>${esc(tr(up.title))}</b><em>${esc(up.level)} · ${esc(up.strand)}</em></span><span class="go">${ICON.play}</span></button></div>
    <nav class="tabs" role="tablist">${tracks.map(tk => `<button role="tab" class="tab${tk === tab ? ' on' : ''}" aria-selected="${tk === tab}" data-t="${tk}">${t('track.' + tk)}</button>`).join('')}</nav>
    ${mode === 'little' ? groupByLevel(shown).map(([lv, l]) => `<h2 class="lvlh">${t('lvl.' + lv)} <small>${l.filter(s => status(p.progress[s.id]) === 'mastered').length}/${l.length}</small></h2><div class="skills">${l.map(s => card(p, s, mode)).join('')}</div>`).join('')
      : `<div class="skills">${shown.map(s => card(p, s, mode)).join('')}</div>`}
    ${mode === 'little' ? '' : `<p class="note">${t('ui.sampleNote')}</p>`}</section>`);
  mount(el);
  $$('.skill', el).forEach((c, i) => popIn(c, i * 40));
  $$('.tab', el).forEach(b => b.onclick = () => { tab = b.dataset.t; sfx.tap(); home(); });
  const open = id => { const s = content.skills.find(x => x.id === id); if (mode === 'little') say(tr(s.title)); sfx.pop(); setTimeout(() => playSkill(s, content, { mount, onExit: home }), mode === 'little' ? 500 : 0); };
  $$('[data-id]', el).forEach(b => b.onclick = () => open(b.dataset.id));
  if ($('.pill.book', el)) $('.pill.book', el).onclick = () => { sfx.pop(); stickerBook(); };
  $('.who', el).onclick = () => { sfx.tap(); learnerSheet(); };
  const gear = $('.gear', el);
  if (mode === 'adult') gear.onclick = grownups; else { holdButton(gear, 2000, grownups); gear.addEventListener('click', () => { if (!document.querySelector('.sheet.grown')) toast(t('ui.holdHint')); }); }
}
// Levels in teaching order; the learner's own level is recommended first.
const LEVELS = ['JK', 'SK', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
function byAge(p, list) {
  const target = Math.max(0, Math.min(13, p.age - 4)), idx = s => { const i = LEVELS.indexOf(s.level); return i < 0 ? target : i; };
  const rank = s => { const d = idx(s) - target; return d === 0 ? 0 : d < 0 ? -d * 2 - 1 : d * 2; };
  return [...list].sort((a, b) => rank(a) - rank(b));
}
function groupByLevel(list) {
  const g = new Map(); list.forEach(s => { const k = LEVELS.includes(s.level) ? s.level : 'other'; if (!g.has(k)) g.set(k, []); g.get(k).push(s); });
  return [...g.entries()];
}
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
    <span class="sk"><b>${esc(tr(s.title))}</b>${mode === 'little' ? '' : `<small>${esc(s.level)} · ${esc(s.strand)}</small>`}</span>
    ${mode === 'little' ? (st === 'mastered' ? `<span class="done">${ICON.star}</span>` : '') : `<span class="chip s-${st}">${t('status.' + st)}</span>`}</button>`;
}

// ---------- Learner switcher ----------
function learnerSheet() {
  const me = profile();
  const el = h(`<div class="sheet on"><div class="sheetin" role="dialog" aria-modal="true" aria-labelledby="lt"><div class="ghead"><h3 id="lt">${t('g.learners')}</h3><button class="icon sclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <div class="lrs">${profiles().map(q => `<button class="lr${q.id === me.id ? ' on' : ''}" data-p="${q.id}"><span class="av" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span>${esc(q.name)}<small>${q.id === me.id ? t('ui.current') : t('mode.' + effectiveMode(q))}</small></button>`).join('')}</div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary sedit">${t('ui.editProfile', { name: esc(me.name) })}</button><button class="btn sadd">+ ${t('ui.addLearner')}</button></div></div></div>`);
  document.body.append(el);
  el.onclick = e => {
    const b = e.target.closest('[data-p]');
    if (b) { setActive(b.dataset.p); tab = null; el.remove(); hush(); home(); }
    else if (e.target.closest('.sedit')) { el.remove(); editProfile(); }
    else if (e.target.closest('.sadd')) { el.remove(); onboarding({ cancel: home }); }
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
function grownups() {
  const p = profile(), S = settings(), list = skillsFor(p);
  const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([v, n]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
  const el = h(`<div class="sheet on grown"><div class="sheetin wide" role="dialog" aria-modal="true" aria-labelledby="gt">
    <div class="ghead"><h3 id="gt">${t('g.title')}</h3><button class="icon gclose" aria-label="${t('ui.close')}">${ICON.close}</button></div>
    <h4>${t('g.learners')}</h4>
    <div class="lrs">${profiles().map(q => `<button class="lr${q.id === p.id ? ' on' : ''}" data-p="${q.id}"><span class="av" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span>${esc(q.name)}<small>${q.age > 18 ? t('ob.adult') : q.age} · ${t('mode.' + effectiveMode(q))}</small></button>`).join('')}
      <button class="lr add">+ ${t('ui.addLearner')}</button></div>
    <div class="row" style="justify-content:flex-start"><button class="btn primary gdash">${ICON.star}<span>${t('dash.open')}</span></button><button class="btn primary gadmin">${t('adm.open', { n: content.skills.length })}</button></div>
    <h4>${esc(p.name)}</h4><div class="row" style="justify-content:flex-start"><button class="btn gedit">${t('ui.editProfile', { name: esc(p.name) })}</button></div>
    <div class="form">
      <label><span>${t('ui.mode')}</span>${sel('gmode', [['', t('mode.auto')], ...['little', 'explore', 'achieve', 'adult'].map(m => [m, t('mode.' + m)])], p.modeOverride || '')}</label>
      <label class="tg"><span>${t('ui.sound')}</span><button class="tog" id="gsound" aria-pressed="${S.sound}"></button></label>
      <label class="tg"><span>${t('ui.voice')}</span><button class="tog" id="gvoice" aria-pressed="${S.voice}"></button></label>
    </div>
    <h4>${t('g.progress')}</h4>
    <div class="scroll"><table class="ptab"><thead><tr><th>${t('g.skill')}</th><th>${t('g.status')}</th><th class="r">%</th></tr></thead>
      <tbody>${list.map(s => { const r = p.progress[s.id]; return `<tr><td>${esc(tr(s.title))}<small>${t('track.' + s.track)} · ${esc(s.level)}</small></td><td><span class="chip s-${status(r)}">${t('status.' + status(r))}</span></td><td class="r">${pct(r)}</td></tr>`; }).join('')}</tbody></table></div>
    <p class="gnote">${t('g.note')}</p>
    <div class="row"><button class="btn ghost greset">${t('ui.reset')}</button><button class="btn ghost gdel">${t('ui.delete')}</button></div></div></div>`);
  document.body.append(el);
  const close = () => { el.remove(); home(); };
  $('.gclose', el).onclick = close;
  el.addEventListener('click', e => { if (e.target === el) close(); });
  $$('[data-p]', el).forEach(b => b.onclick = () => { setActive(b.dataset.p); tab = null; el.remove(); home(); grownups(); });
  $('.lr.add', el).onclick = () => { el.remove(); onboarding({ cancel: home }); };
  $('.gadmin', el).onclick = () => { el.remove(); admin(); };
  $('.gdash', el).onclick = () => { el.remove(); openDash(p.id); };
  $('.gedit', el).onclick = () => { el.remove(); editProfile(); };
  $('#gmode', el).onchange = e => { updateProfile({ modeOverride: e.target.value || null }); tab = null; el.remove(); home(); grownups(); };
  $('#gsound', el).onclick = e => { S.sound = !S.sound; e.currentTarget.setAttribute('aria-pressed', S.sound); save(); };
  $('#gvoice', el).onclick = e => { S.voice = !S.voice; e.currentTarget.setAttribute('aria-pressed', S.voice); if (!S.voice) hush(); save(); };
  const twoTap = (btn, label, fn) => btn.onclick = () => { if (!btn.dataset.arm) { btn.dataset.arm = 1; btn.textContent = label; return; } fn(); };
  twoTap($('.greset', el), t('ui.resetConfirm'), () => { resetProgress(); el.remove(); home(); grownups(); });
  twoTap($('.gdel', el), t('ui.deleteConfirm'), () => { removeProfile(p.id); el.remove(); profile() ? home() : onboarding(); });
}

// ---------- Dashboard ----------
function openDash(pid) {
  dashboard({ content, mount, pid, onBack: home,
    onTry: (id, who) => { setActive(who); const s = content.skills.find(x => x.id === id), m = effectiveMode(profile()); document.documentElement.dataset.mode = m; playSkill(s, content, { mount, onExit: () => openDash(who) }); } });
}

// ---------- Admin: every lesson in every mode ----------
const MODES = ['little', 'explore', 'achieve', 'adult'];
let admFilter = 'all', admQuery = '';
function admin() {
  document.documentElement.dataset.mode = 'achieve';
  const all = content.skills, q = admQuery.trim().toLowerCase();
  const match = s => (admFilter === 'all' || s.modes.includes(admFilter)) && (!q || [s.title, s.level, s.strand, s.track, s.gen || (s.seq || s.mix || []).join(' ')].join(' ').toLowerCase().includes(q));
  const shown = all.filter(match);
  const groups = TRACKS.map(tk => [tk, shown.filter(s => s.track === tk)]).filter(([, l]) => l.length);
  const el = h(`<section class="home admin">
    <header class="htop"><button class="icon aback" aria-label="${t('ui.back')}">${ICON.back}</button><h1 class="admh">${t('adm.title')}</h1><button class="btn adash">${ICON.star}<span>${t('dash.open')}</span></button><button class="btn ahome">${ICON.home}<span>${t('ui.home')}</span></button><span class="pill">${shown.length} / ${all.length}</span></header>
    <p class="admsub">${t('adm.sub')}</p>
    <div class="admbar"><input class="admq" type="search" placeholder="${t('adm.search')}" value="${esc(admQuery)}">
      <div class="tabs">${['all', ...MODES].map(m => `<button class="tab${m === admFilter ? ' on' : ''}" data-m="${m}">${m === 'all' ? t('ui.all') : t('mode.' + m)} <small>${m === 'all' ? all.length : all.filter(s => s.modes.includes(m)).length}</small></button>`).join('')}</div></div>
    ${groups.map(([tk, l]) => `<h2 class="admg">${t('track.' + tk)} <small>${l.length}</small></h2>
      <div class="scroll"><table class="ptab admtab"><thead><tr><th>${t('g.skill')}</th><th>${t('adm.level')}</th><th>${t('adm.modes')}</th><th>${t('adm.type')}</th><th></th></tr></thead><tbody>
      ${l.map(s => `<tr><td><span class="admic">${SKILL_ICON[s.icon] || ''}</span><b>${esc(tr(s.title))}</b><small>${esc(s.strand)}</small></td><td>${esc(s.level)}</td>
        <td>${s.modes.map(m => `<span class="chip">${t('mode.' + m)}</span>`).join(' ')}</td><td><code>${esc(s.gen || (s.seq || s.mix || []).join(' + '))}</code></td>
        <td class="r"><button class="btn primary aplay" data-id="${s.id}">${ICON.play}<span>${t('adm.try')}</span></button></td></tr>`).join('')}
      </tbody></table></div>`).join('') || `<p class="note">${t('adm.none')}</p>`}
  </section>`);
  mount(el);
  $('.aback', el).onclick = home;
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
