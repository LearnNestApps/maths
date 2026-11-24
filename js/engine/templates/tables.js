// Table chart: a multiplication table (or squares/cubes) with blanks to fill in, read aloud as you go.
import { h, squash, wiggle, popIn } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { ICON } from '../../core/art.js';
import { numInput } from './basic.js';

export const tablechart = {
  render(host, act, ctx) {
    const { rows, blanks, title } = act.data, open = [...blanks].sort((a, b) => a - b);
    let k = 0, misses = 0, assisted = false;
    host.innerHTML = `<div class="t-chart"><div class="chead"><b>${title}</b><button class="btn hear">${ICON.speak}<span>${t('tab.hear')}</span></button></div>
      <ol class="crows">${rows.map((r, i) => `<li class="crow${blanks.includes(i) ? ' blank' : ''}" data-i="${i}"><span class="lhs">${r.lhs}</span><span class="eq">=</span><b class="rhs">${blanks.includes(i) ? '' : r.ans}</b></li>`).join('')}</ol><div class="io"></div></div>`;
    const lis = [...host.querySelectorAll('.crow')], cur = () => lis[open[k]], slot = () => cur().querySelector('.rhs');
    const mark = () => { lis.forEach(l => l.classList.remove('now')); if (k < open.length) { cur().classList.add('now'); cur().scrollIntoView?.({ block: 'nearest' }); } };
    const ni = numInput(host.querySelector('.io'), { onChange: v => { slot().textContent = v; }, onSubmit: v => check(Number(v)) });
    ctx.onCleanup(() => ni.destroy());
    function next(ok) {
      const r = rows[open[k]]; cur().classList.add(ok ? 'done' : 'shown'); slot().textContent = r.ans; say(r.say || `${r.lhs.replace('×', 'times')} is ${r.ans}`);
      k++; misses = 0; ni.clear(); mark();
      if (k >= open.length) setTimeout(() => ctx.submit('done', { assisted }), 600);
    }
    function check(v) {
      if (v === rows[open[k]].ans) { sfx.pop(); squash(cur()); next(true); return; }
      misses++; sfx.boing(); wiggle(cur()); ni.clear(); slot().textContent = '';
      if (misses >= 2) { assisted = true; next(false); }
    }
    host.querySelector('.hear').onclick = () => rows.forEach((r, i) => say(`${r.say || r.lhs.replace('×', 'times') + ' is ' + r.ans}`, i > 0));
    mark();
    return { hint() { assisted = true; const r = rows[open[k]]; slot().textContent = r.ans; cur().classList.add('glow'); } };
  }
};

// Flash mental arithmetic (Anzan): numbers appear one at a time, then type the total.
export const flash = {
  render(host, act, ctx) {
    const { nums, ms } = act.data; let ni;
    host.innerHTML = `<div class="t-flash"><div class="fnum" aria-live="polite"></div><button class="btn primary huge fgo">${ICON.play}<span>${t('drill.go')}</span></button><div class="io"></div></div>`;
    const box = host.querySelector('.fnum'), io = host.querySelector('.io');
    const run = async () => {
      host.querySelector('.fgo').hidden = true; io.innerHTML = ''; ni?.destroy();
      for (const v of nums) { box.textContent = v < 0 ? '− ' + -v : (box.dataset.first ? '+ ' : '') + v; box.dataset.first = 1; squash(box); sfx.tick(); say(v < 0 ? 'minus ' + -v : String(v)); await new Promise(r => setTimeout(r, ms)); box.textContent = ''; await new Promise(r => setTimeout(r, 180)); }
      delete box.dataset.first; box.textContent = '?';
      ni = numInput(io, { neg: true, onSubmit: v => { const r = ctx.submit(Number(v)); if (!r.ok) { ni.shake(); ni.clear(); } } });
      ctx.onCleanup(() => ni.destroy());
      host.querySelector('.fgo').hidden = false; host.querySelector('.fgo span').textContent = t('flash.again');
    };
    host.querySelector('.fgo').onclick = run;
    return { hint() { box.textContent = nums.map((v, i) => i && v > 0 ? '+ ' + v : v < 0 ? '− ' + -v : v).join(' '); } };
  }
};

// ---------- Times-table games ----------
import { shuffle } from '../../core/ui.js';
import { FROG } from '../../core/art_pond.js';

// Frog hops: a number line in steps of n; tap where the frog lands next.
export const hop = {
  render(host, act, ctx) {
    const { n, from, hops } = act.data, last = from + hops, top = Math.max(10, last), W = 640, x = k => 24 + k * (W - 48) / top;
    let step = 0, misses = 0, assisted = false;
    let line = `<path d="M10 120H${W - 10}" stroke="currentColor" stroke-width="3"/>`;
    for (let k = 0; k <= top; k++) line += `<path d="M${x(k)} 112V128" stroke="currentColor" stroke-width="3"/><text class="hl${k <= from ? ' on' : ''}" data-k="${k}" x="${x(k)}" y="152" text-anchor="middle" font-size="${n * top > 99 ? 15 : 18}" font-weight="800" fill="currentColor">${k <= from ? n * k : '?'}</text>`;
    host.innerHTML = `<div class="t-hop"><svg viewBox="0 0 ${W} 165" class="hopline">${line}<g class="arcs"></g><g class="frog" style="transform:translate(${x(from) - 26}px,68px)">${FROG.replace('<svg ', '<svg width="52" height="38" ')}</g></svg><div class="hopopts"></div></div>`;
    const frog = host.querySelector('.frog'), opts = host.querySelector('.hopopts'), arcs = host.querySelector('.arcs');
    const ask = () => {
      const cur = from + step, next = n * (cur + 1), wrong = shuffle([next + 1, next - 1, next + n, n * cur + 1].filter(v => v > n * cur && v !== next)).slice(0, 2);
      opts.innerHTML = shuffle([next, ...wrong]).map(v => `<button class="tile hopt" data-v="${v}">${v}</button>`).join('');
      host.querySelector('.t-hop').dataset.next = next;
      opts.querySelectorAll('.hopt').forEach(b => b.onclick = () => {
        if (+b.dataset.v !== next) { misses++; sfx.boing(); wiggle(b); b.disabled = true; if (misses >= 2) assisted = true; return; }
        sfx.pop(); const k = cur + 1;
        arcs.insertAdjacentHTML('beforeend', `<path class="tl-hop" d="M${x(cur)} 112Q${(x(cur) + x(k)) / 2} 50 ${x(k)} 112" style="stroke:var(--acc)" stroke-width="3.5" fill="none"/>`);
        frog.style.transform = `translate(${x(k) - 26}px,68px)`; frog.classList.remove('jump'); void frog.getBoundingClientRect(); frog.classList.add('jump');
        const lab = host.querySelector(`.hl[data-k="${k}"]`); lab.textContent = next; lab.classList.add('on'); say(String(next));
        step++; misses = 0;
        if (step >= hops) { opts.innerHTML = ''; setTimeout(() => ctx.submit('done', { assisted }), 500); } else setTimeout(ask, 380);
      });
    };
    ask();
    return { hint() { assisted = true; const b = opts.querySelector(`.hopt[data-v="${host.querySelector('.t-hop').dataset.next}"]`); b && b.classList.add('glow'); } };
  }
};

// Bubble pop: tap every multiple; other bubbles wobble.
export const pop = {
  render(host, act, ctx) {
    const { bubbles } = act.data; let left = bubbles.filter(b => b.m).length, misses = 0;
    host.innerHTML = `<div class="t-pop">${bubbles.map((b, i) => `<button class="bub" data-i="${i}" data-m="${b.m}" style="--d:${(i % 5) * .35}s;--h:${[0, 18, 6, 24, 10][i % 5]}px">${b.v}</button>`).join('')}<p class="popleft">${left}</p></div>`;
    const counter = host.querySelector('.popleft'), show = () => { counter.textContent = left ? `${left} to pop` : ''; }; show();
    host.querySelectorAll('.bub').forEach(el => el.onclick = () => {
      if (el.classList.contains('gone')) return;
      if (el.dataset.m === '1') { sfx.pop(); el.classList.add('gone'); left--; show(); if (!left) setTimeout(() => ctx.submit('done', { assisted: misses > 1 }), 450); }
      else { misses++; sfx.boing(); wiggle(el); }
    });
    return { hint() { host.querySelectorAll('.bub[data-m="1"]:not(.gone)').forEach(b => b.classList.add('glow')); } };
  }
};

// Memory match: all cards are shown for a moment, then turned over; find the pairs.
export const match = {
  render(host, act, ctx) {
    const { cards } = act.data; let open = [], found = 0, misses = 0, busy = true;
    host.innerHTML = `<div class="t-match">${cards.map((c, i) => `<button class="mcard up" data-i="${i}" data-k="${c.k}"><span>${c.face}</span></button>`).join('')}</div>`;
    const els = [...host.querySelectorAll('.mcard')];
    setTimeout(() => { els.forEach(e => e.classList.remove('up')); busy = false; }, ctx.mode === 'little' ? 3500 : 2500);
    els.forEach(el => el.onclick = () => {
      if (busy || el.classList.contains('up') || el.classList.contains('done')) return;
      el.classList.add('up'); sfx.tap(); open.push(el);
      if (open.length < 2) return;
      const [a, b] = open; open = [];
      if (a.dataset.k === b.dataset.k) { sfx.pop(); a.classList.add('done'); b.classList.add('done'); found++; if (found === cards.length / 2) setTimeout(() => ctx.submit('done', { assisted: misses > 3 }), 500); }
      else { misses++; busy = true; setTimeout(() => { a.classList.remove('up'); b.classList.remove('up'); busy = false; }, 800); }
    });
    return { hint() { busy = true; els.forEach(e => e.classList.add('up')); setTimeout(() => { els.forEach(e => { if (!e.classList.contains('done')) e.classList.remove('up'); }); busy = false; }, 1500); } };
  }
};
