// Lesson player: runs a skill's activities, applies the hint ladder, records mastery, shows results.
import { h, esc, wait, squash, popIn, RM } from '../core/ui.js';
import { t, tr } from '../core/i18n.js';
import { sfx, say, hush } from '../core/audio.js';
import { ICON, PIP, sticker } from '../core/art.js';
import { record, pct } from '../core/mastery.js';
import { profile, effectiveMode, save } from '../core/store.js';
import { TEMPLATES, explainer } from './templates/index.js';
import { GEN } from '../content/generators.js';

const PRAISE = ['fb.great', 'fb.correct', 'fb.wellDone'];

export async function playSkill(skill, content, { mount, onExit, mode: forced }) {
  const p = profile(), mode = forced || effectiveMode(p);
  const root = h(`<section class="player">
    <header class="ptop"><button class="icon pclose" aria-label="${t('ui.close')}">${ICON.close}</button>
      <div class="pbar" role="progressbar" aria-label="Progress"><i></i></div>
      ${mode === 'little' ? `<div class="pipmini">${PIP()}</div>` : ''}
      <button class="icon pspeak" aria-label="${t('ui.listen')}">${ICON.speak}</button></header>
    <div class="ptitle">${esc(tr(skill.title))}</div>
    <main class="stage"><div class="prompt"></div><div class="host"></div><div class="solution"></div></main>
    <footer class="pfoot"><div class="fb" aria-live="polite"></div><button class="btn hintb">${ICON.bulb}<span>${t('ui.hint')}</span></button></footer></section>`);
  mount(root);
  let exited = false, cleanups = [];
  const $ = s => root.querySelector(s), host = $('.host'), promptEl = $('.prompt');
  const runCleanups = () => { cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = []; };
  const exit = () => { if (exited) return; exited = true; runCleanups(); hush(); onExit(); };
  $('.pclose').onclick = exit;
  const pip = $('.pipmini svg');
  const setPip = (c, ms) => { if (!pip) return; pip.classList.remove('cheer', 'think'); pip.classList.add(c); setTimeout(() => pip.classList.remove(c), ms); };
  const feedback = (msg, kind) => { const f = $('.fb'); f.className = 'fb ' + kind; f.textContent = msg; if (msg) squash(f); };
  const progress = r => { $('.pbar i').style.width = (r * 100) + '%'; };

  // Intro explainer on first visit.
  if (skill.intro && content.explainers[skill.intro] && !p.progress[skill.id]) {
    root.classList.add('explaining');
    await explainer(host, content.explainers[skill.intro]);
    root.classList.remove('explaining');
    if (exited) return;
  }

  let seqI = 0;
  const genOf = () => skill.seq ? skill.seq[seqI++ % skill.seq.length] : skill.mix ? skill.mix[Math.floor(Math.random() * skill.mix.length)] : skill.gen;
  const firstAct = GEN[genOf()](skill.params || {});
  const T = TEMPLATES[firstAct.template];

  // ----- Session templates (drill, mock) run once and report a score -----
  if (T.session) {
    $('.hintb').hidden = true; promptEl.innerHTML = '';
    const res = await new Promise(resolve => {
      const ctx = { mode, t, say, sfx, onCleanup: f => cleanups.push(f), best: () => p.bests[skill.id] ?? null, finish: resolve, submit: () => ({ ok: false }) };
      T.render(host, firstAct, ctx);
    });
    runCleanups(); if (exited) return;
    for (let i = 0; i < res.total; i++) record(p, skill.id, i < res.correct);
    const newBest = res.score > (p.bests[skill.id] ?? -1); if (newBest) p.bests[skill.id] = res.score;
    return results({ correct: res.correct, total: res.total, newBest, best: p.bests[skill.id] });
  }

  // ----- Item-by-item lesson -----
  const n = skill.items || (mode === 'little' ? 5 : 8);
  let correct = 0;
  for (let i = 0; i < n && !exited; i++) {
    const act = i === 0 ? firstAct : GEN[genOf()](skill.params || {});
    progress(i / n);
    const first = await runItem(act);
    runCleanups();
    if (first) correct++;
    progress((i + 1) / n);
  }
  if (exited) return;
  results({ correct, total: n });

  function runItem(act) {
    return new Promise(resolve => {
      let tries = 0, settled = false, assistedByHint = false;
      $('.solution').innerHTML = ''; $('.solution').classList.remove('on'); feedback('', '');
      promptEl.innerHTML = act.prompt; host.innerHTML = '';
      if (location.hash === '#debug') window.__act = act;
      const speakIt = () => {
        const c = promptEl.cloneNode(true); if (act.say) c.querySelectorAll('.expr').forEach(e => e.remove());
        say(`${c.textContent} ${act.say || ''}`.trim());
      };
      $('.pspeak').onclick = speakIt;
      if (mode === 'little' || mode === 'explore') setTimeout(() => { if (!settled && !exited) speakIt(); }, 300);
      const T = TEMPLATES[act.template];
      const ctx = {
        mode, t, say, sfx, onCleanup: f => cleanups.push(f),
        submit(v, opt = {}) {
          if (settled) return { ok: false };
          const ok = act.check ? act.check(v) : String(v).trim() === String(act.answer);
          if (ok) {
            settled = true; const firstTry = tries === 0 && !opt.assisted && !assistedByHint;
            sfx.chime(); setPip('cheer', 1500); feedback(t(PRAISE[Math.floor(Math.random() * PRAISE.length)]), 'ok');
            if (mode === 'little') say(t('fb.great'));
            record(p, skill.id, firstTry); save();
            setTimeout(() => resolve(firstTry), mode === 'little' ? 1500 : 1000);
            return { ok: true };
          }
          tries++; sfx.boing(); setPip('think', 1200);
          if (tries === 1) { feedback(t('fb.try'), 'bad'); inst.hint?.(1); }
          else if (tries === 2) { feedback(act.hint || t('fb.hint'), 'hint'); inst.hint?.(2); if (mode === 'little' || mode === 'explore') say(act.hint); }
          else { settled = true; record(p, skill.id, false); save(); showSolution(act).then(() => resolve(false)); }
          return { ok: false };
        }
      };
      const inst = T.render(host, act, ctx) || {};
      $('.hintb').hidden = mode === 'little';
      $('.hintb').onclick = () => { assistedByHint = true; feedback(act.hint || t('fb.hint'), 'hint'); inst.hint?.(2); };
    });
  }

  function showSolution(act) {
    return new Promise(res => {
      const s = $('.solution');
      s.innerHTML = `<div class="solin"><h4>${t('fb.solution')}</h4><ol>${(act.solution || []).map(l => `<li>${l}</li>`).join('')}</ol><button class="btn primary">${t('fb.gotit')}</button></div>`;
      s.classList.add('on'); feedback('', '');
      s.querySelector('button').onclick = () => { s.classList.remove('on'); res(); };
    });
  }

  function results({ correct, total, newBest, best }) {
    const r = p.progress[skill.id], m = pct(r);
    let reward = '';
    if (mode === 'little') { const got = correct >= Math.ceil(total * .6); if (got) p.stickers.push(skill.icon); reward = got ? `<div class="rsticker">${sticker(skill.icon, p.stickers.length)}</div><p class="rline">${t('res.sticker')}</p>` : ''; }
    else if (mode === 'explore') { const c = correct * 5; p.coins += c; reward = `<p class="rline coins">${ICON.coin}<span>${t('res.coins', { n: c })}</span></p>`; }
    save();
    root.innerHTML = `<section class="results">${mode === 'little' ? `<div class="rpip">${PIP('cheer')}</div>` : ''}
      <h2>${correct >= total * .6 ? t('fb.wellDone') : esc(tr(skill.title))}</h2>
      <p class="rscore">${t('res.score', { c: correct, n: total })}</p>${reward}
      ${newBest ? `<p class="rline best">${t('res.newBest')}</p>` : best != null ? `<p class="rline">${t('res.best', { n: best })}</p>` : ''}
      ${mode !== 'little' ? `<div class="rmast"><div class="mbar"><i style="width:${m}%"></i></div><span>${t('res.mastery', { p: m })}</span></div>` : ''}
      <div class="ract"><button class="btn primary ragain">${ICON.replay}<span>${t('ui.again')}</span></button><button class="btn rhome">${t('ui.home')}</button></div></section>`;
    sfx.fanfare(); if (mode === 'little') say(t('fb.wellDone'));
    if (!RM && mode !== 'adult') confetti(root);
    root.querySelector('.ragain').onclick = () => { exited = true; playSkill(skill, content, { mount, onExit, mode: forced }); };
    root.querySelector('.rhome').onclick = exit;
  }
}

function confetti(root) {
  for (let k = 0; k < 50; k++) {
    const c = h('<i class="cf"></i>'); c.style.left = Math.random() * 100 + 'vw';
    c.style.background = ['#ffd23f', '#ff6b4a', '#4dabf7', '#5cc96b', '#ff6b8a', '#9775fa'][k % 6]; root.append(c);
    c.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translate(${Math.random() * 160 - 80}px,110vh) rotate(${360 + Math.random() * 720}deg)` }], { duration: 1800 + Math.random() * 1400, delay: Math.random() * 400, easing: 'cubic-bezier(.3,.6,.6,1)', fill: 'backwards' }).onfinish = () => c.remove();
  }
}
