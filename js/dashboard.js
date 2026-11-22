// Grown-ups dashboard: per-learner progress and a content overview.
import { $, $$, h, esc } from './core/ui.js';
import { t } from './core/i18n.js';
import { profiles, effectiveMode } from './core/store.js';
import { status, pct } from './core/mastery.js';
import { ICON, SKILL_ICON } from './core/art.js';
import { dateFmt } from './core/region.js';

const DAY = 864e5, today = () => Math.floor(Date.now() / DAY);
const MODES = ['little', 'explore', 'achieve', 'adult'];
const fmtDur = ms => { const m = Math.round(ms / 60000); return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`; };
const LV = ['JK', 'SK', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
const lvSort = (a, b) => { const i = LV.indexOf(a), j = LV.indexOf(b); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j) || a.localeCompare(b, 'en', { numeric: true }); };
const dayLabel = d => dateFmt(d * DAY, { day: 'numeric', month: 'short' });

function stats(p, skills) {
  const mine = skills.filter(s => s.modes.includes(effectiveMode(p))), now = today();
  const attempts = Object.entries(p.progress).flatMap(([id, r]) => r.a.map(([ok, d]) => ({ id, ok, d })));
  const perDay = Array.from({ length: 14 }, (_, i) => { const d = now - 13 + i, l = attempts.filter(a => a.d === d); return { d, n: l.length, ok: l.filter(a => a.ok).length }; });
  const week = attempts.filter(a => a.d > now - 7), activeDays = new Set(attempts.filter(a => a.d > now - 30).map(a => a.d));
  let streak = 0; const days = new Set(attempts.map(a => a.d)); for (let d = days.has(now) ? now : now - 1; days.has(d); d--) streak++;
  const sess = p.sessions || [], weekMs = sess.filter(s => s.t > Date.now() - 7 * DAY).reduce((a, s) => a + s.ms, 0);
  const byTrack = {}; mine.forEach(s => { const b = byTrack[s.track] ||= { total: 0, mastered: 0, learning: 0 }; b.total++; const st = status(p.progress[s.id]); if (st === 'mastered' || st === 'review') b.mastered++; else if (st === 'learning') b.learning++; });
  const weak = mine.map(s => ({ s, r: p.progress[s.id] })).filter(x => x.r && x.r.a.length >= 5 && !x.r.mastered && pct(x.r) < 60).sort((a, b) => pct(a.r) - pct(b.r)).slice(0, 5);
  const review = mine.filter(s => status(p.progress[s.id]) === 'review');
  return { mine, perDay, week, activeDays: activeDays.size, streak, weekMs, byTrack, weak, review, sess,
    mastered: mine.filter(s => ['mastered', 'review'].includes(status(p.progress[s.id]))).length, started: mine.filter(s => p.progress[s.id]).length,
    acc: week.length ? Math.round(100 * week.filter(a => a.ok).length / week.length) : null, total: attempts.length };
}

// 14-day activity bars (single series): rounded tops, recessive grid, hover tooltip per bar.
function activityChart(perDay) {
  const max = Math.max(5, ...perDay.map(d => d.n)), top = Math.ceil(max / 5) * 5, W = 560, H = 200, L = 34, B = 26, bw = (W - L - 8) / 14;
  const y = v => H - B - (H - B - 12) * v / top;
  const grid = [0, .5, 1].map(f => `<path d="M${L} ${y(top * f)}H${W - 4}" class="dgrid"/><text x="${L - 6}" y="${y(top * f) + 4}" class="dtick" text-anchor="end">${Math.round(top * f)}</text>`).join('');
  const bars = perDay.map((d, i) => { const x = L + i * bw + 3, hh = Math.max(0, y(0) - y(d.n)), w = bw - 6; const path = hh ? `M${x} ${y(0)}V${y(d.n) + Math.min(4, hh)}q0 -4 4 -4h${w - 8}q4 0 4 4V${y(0)}Z` : '';
    return `<g class="dbar" data-tip="${dayLabel(d.d)}: ${d.n} question${d.n === 1 ? '' : 's'}${d.n ? `, ${Math.round(100 * d.ok / d.n)}% right first time` : ''}"><rect x="${L + i * bw}" y="10" width="${bw}" height="${H - B - 10}" fill="transparent"/>${path ? `<path d="${path}" class="dfill"/>` : ''}${i % 2 === 1 || i === 13 ? `<text x="${x + w / 2}" y="${H - 8}" class="dtick" text-anchor="middle">${i === 13 ? 'Today' : dayLabel(d.d)}</text>` : ''}</g>`; }).join('');
  return `<div class="dchart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Questions answered per day, last 14 days">${grid}${bars}</svg><div class="dtip" hidden></div></div>`;
}

export function dashboard({ content, mount, onBack, onTry, pid }) {
  const all = profiles(), p = all.find(x => x.id === pid) || all[0];
  document.documentElement.dataset.mode = 'achieve';
  if (!p) { mount(h(`<section class="home"><p class="note">${t('dash.none')}</p></section>`)); return; }
  const S = stats(p, content.skills), TR = ['school', 'tables', 'tricks', 'vedic', 'logic', 'exam', 'method'];
  const tile = (label, value, sub = '') => `<div class="kpi"><span>${label}</span><b>${value}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
  const el = h(`<section class="home dash">
    <header class="htop"><button class="icon aback" aria-label="${t('ui.back')}">${ICON.back}</button><h1 class="admh">${t('dash.title')}</h1><button class="btn dhome">${ICON.home}<span>${t('ui.home')}</span></button></header>
    <div class="tabs dtabs"><button class="tab on" data-v="learners">${t('dash.learners')}</button><button class="tab" data-v="content">${t('dash.content')}</button></div>
    <div class="dview" data-view="learners">
      <div class="lrs">${all.map(q => `<button class="lr${q.id === p.id ? ' on' : ''}" data-p="${q.id}"><span class="av" style="--c:${q.color}">${esc(q.name[0]).toUpperCase()}</span>${esc(q.name)}<small>${t('mode.' + effectiveMode(q))}</small></button>`).join('')}</div>
      <h2 class="dh">${esc(p.name)} · ${t('mode.' + effectiveMode(p))}</h2>
      <div class="kpis">
        ${tile(t('dash.mastered'), `${S.mastered}<small>/${S.mine.length}</small>`, t('dash.startedN', { n: S.started }))}
        ${tile(t('dash.acc'), S.acc == null ? '—' : S.acc + '%', t('dash.last7'))}
        ${tile(t('dash.streak'), S.streak, S.streak === 1 ? t('dash.day') : t('dash.days'))}
        ${tile(t('dash.time'), fmtDur(S.weekMs), t('dash.last7'))}
        ${tile(t('dash.active'), S.activeDays, t('dash.last30'))}
        ${tile(t('dash.answered'), S.total, t('dash.recent'))}
      </div>
      <div class="dgrid2">
        <section class="dcard"><h3>${t('dash.activity')}</h3>${activityChart(S.perDay)}</section>
        <section class="dcard"><h3>${t('dash.byTrack')}</h3>
          <div class="dlegend"><span><i class="sw1"></i>${t('status.mastered')}</span><span><i class="sw2"></i>${t('status.learning')}</span><span><i class="sw0"></i>${t('status.new')}</span></div>
          <div class="trk">${TR.filter(k => S.byTrack[k]).map(k => { const b = S.byTrack[k], nw = b.total - b.mastered - b.learning; return `<div class="trow" title="${t('track.' + k)}: ${b.mastered} mastered, ${b.learning} learning, ${nw} not started"><span class="tl">${t('track.' + k)}</span><div class="tbar2">${b.mastered ? `<i class="s1" style="flex:${b.mastered}"></i>` : ''}${b.learning ? `<i class="s2" style="flex:${b.learning}"></i>` : ''}${nw ? `<i class="s0" style="flex:${nw}"></i>` : ''}</div><span class="tn2">${b.mastered}/${b.total}</span></div>`; }).join('')}</div></section>
      </div>
      <div class="dgrid2">
        <section class="dcard"><h3>${t('dash.attention')}</h3>${S.weak.length || S.review.length ? `<ul class="dlist">${S.review.slice(0, 3).map(s => `<li><span class="admic">${SKILL_ICON[s.icon] || ''}</span><span><b>${esc(s.title)}</b><small>${t('status.review')}</small></span><button class="btn dtry" data-id="${s.id}">${t('adm.try')}</button></li>`).join('')}${S.weak.map(x => `<li><span class="admic">${SKILL_ICON[x.s.icon] || ''}</span><span><b>${esc(x.s.title)}</b><small>${t('dash.accShort', { p: pct(x.r) })}</small></span><button class="btn dtry" data-id="${x.s.id}">${t('adm.try')}</button></li>`).join('')}</ul>` : `<p class="note left">${t('dash.allGood')}</p>`}</section>
        <section class="dcard"><h3>${t('dash.recentS')}</h3>${S.sess.length ? `<div class="scroll"><table class="ptab"><thead><tr><th>${t('g.skill')}</th><th>${t('dash.when')}</th><th class="r">${t('dash.score')}</th><th class="r">${t('dash.timeS')}</th></tr></thead><tbody>${S.sess.slice(-8).reverse().map(s => { const sk = content.skills.find(x => x.id === s.id); return `<tr><td>${esc(sk ? sk.title : s.id)}</td><td>${dateFmt(s.t, { day: 'numeric', month: 'short' })}</td><td class="r">${s.c}/${s.n}</td><td class="r">${fmtDur(s.ms)}</td></tr>`; }).join('')}</tbody></table></div>` : `<p class="note left">${t('dash.noSess')}</p>`}</section>
      </div>
      ${all.length > 1 ? `<section class="dcard"><h3>${t('dash.everyone')}</h3><div class="scroll"><table class="ptab"><thead><tr><th>${t('dash.learner')}</th><th>${t('ui.mode')}</th><th class="r">${t('dash.mastered')}</th><th class="r">${t('dash.acc')}</th><th class="r">${t('dash.streak')}</th></tr></thead><tbody>${all.map(q => { const s = stats(q, content.skills); return `<tr><td>${esc(q.name)}</td><td>${t('mode.' + effectiveMode(q))}</td><td class="r">${s.mastered}/${s.mine.length}</td><td class="r">${s.acc == null ? '—' : s.acc + '%'}</td><td class="r">${s.streak}</td></tr>`; }).join('')}</tbody></table></div></section>` : ''}
    </div>
    <div class="dview" data-view="content" hidden>
      <p class="admsub">${t('dash.contentSub', { n: content.skills.length })}</p>
      <div class="scroll"><table class="ptab ctab"><thead><tr><th>${t('dash.track')}</th>${MODES.map(m => `<th class="r">${t('mode.' + m)}</th>`).join('')}<th class="r">${t('dash.total')}</th></tr></thead><tbody>
        ${TR.map(k => { const l = content.skills.filter(s => s.track === k); return `<tr><td>${t('track.' + k)}</td>${MODES.map(m => `<td class="r">${l.filter(s => s.modes.includes(m)).length}</td>`).join('')}<td class="r"><b>${l.length}</b></td></tr>`; }).join('')}
        <tr class="tot"><td>${t('dash.total')}</td>${MODES.map(m => `<td class="r">${content.skills.filter(s => s.modes.includes(m)).length}</td>`).join('')}<td class="r"><b>${content.skills.length}</b></td></tr></tbody></table></div>
      <p class="note left">${t('dash.multi')}</p>
      <h3 class="dh">${t('dash.byLevel')}</h3>
      <div class="lvls">${[...new Set(content.skills.map(s => s.level))].sort(lvSort).map(lv => `<span class="chip">${esc(lv)} <b>${content.skills.filter(s => s.level === lv).length}</b></span>`).join('')}</div>
    </div></section>`);
  mount(el);
  $('.aback', el).onclick = onBack; $('.dhome', el).onclick = onBack;
  $$('.dtabs .tab', el).forEach(b => b.onclick = () => { $$('.dtabs .tab', el).forEach(x => x.classList.toggle('on', x === b)); $$('.dview', el).forEach(v => v.hidden = v.dataset.view !== b.dataset.v); });
  $$('[data-p]', el).forEach(b => b.onclick = () => dashboard({ content, mount, onBack, onTry, pid: b.dataset.p }));
  $$('.dtry', el).forEach(b => b.onclick = () => onTry(b.dataset.id, p.id));
  const tip = $('.dtip', el), chart = $('.dchart', el);
  $$('.dbar', el).forEach(g => {
    const show = e => { tip.hidden = false; tip.textContent = g.dataset.tip; const r = chart.getBoundingClientRect(), b = g.getBoundingClientRect(); tip.style.left = Math.min(r.width - 170, Math.max(0, b.left - r.left + b.width / 2 - 85)) + 'px'; tip.style.top = '0px'; g.classList.add('hov'); };
    g.addEventListener('pointerenter', show); g.addEventListener('click', show);
    g.addEventListener('pointerleave', () => { tip.hidden = true; g.classList.remove('hov'); });
  });
}
