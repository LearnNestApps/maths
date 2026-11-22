// Templates for the youngest learners: picture-pick, sorting bins, pattern caterpillar,
// place-value builder, sharing, and frog feeding.
import { h, esc, rnd, shuffle, squash, wiggle, popIn, draggable, flyTo, goHome, ctr, $$ } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { ICON } from '../../core/art.js';
import { FLY, FROG } from '../../core/art_pond.js';
import { ROD, UNIT, FLAT, COOKIE, PLATE } from '../../core/art_little.js';

// Count scene items marked .c aloud with number badges.
function countAloud(els, step = 700) {
  els.forEach((el, i) => setTimeout(() => { if (!el.isConnected) return; el.dataset.n = i + 1; el.classList.add('counted'); squash(el); sfx.tap(); say(String(i + 1), i > 0); }, i * step));
  return els.length * step;
}

// ----- Picture-pick: a scene plus answer tiles, or tappable things inside the scene -----
// data: { scene?, tiles?: [html], labels?: [text], tapScene?: bool, flash?: ms, count?: bool, wide?: bool }
export const pick = {
  render(host, act, ctx) {
    const d = act.data;
    host.innerHTML = `<div class="t-pick${d.wide ? ' wide' : ''}">${d.scene != null ? `<div class="scene">${d.scene}${d.flash ? `<div class="cover"><button class="peek btn">${t('pick.peek')}</button></div>` : ''}</div>` : ''}
      ${d.tiles ? `<div class="ptiles n${d.tiles.length}">${d.tiles.map((x, i) => `<button class="ptile" data-i="${i}" aria-label="${esc(d.labels?.[i] ?? 'Option ' + (i + 1))}">${x}</button>`).join('')}</div>` : ''}</div>`;
    const scene = host.querySelector('.scene');
    host.querySelectorAll('.ptile, .scene [data-opt]').forEach((el, k) => {
      if (el.matches('.ptile')) popIn(el, k * 60);
      el.addEventListener('click', () => {
        if (el.disabled || el.classList.contains('off')) return;
        const i = +(el.dataset.i ?? el.dataset.opt);
        const r = ctx.submit(i);
        if (r.ok) { el.classList.add('ok'); squash(el); }
        else { el.classList.add('bad'); wiggle(el); if (el.matches('.ptile')) el.disabled = true; else el.classList.add('off'); }
      });
    });
    let cover;
    if (d.flash && scene) {
      cover = scene.querySelector('.cover');
      const hide = () => cover.classList.add('on');
      const peek = () => { cover.classList.remove('on'); setTimeout(hide, d.flash); };
      cover.querySelector('.peek').onclick = e => { e.stopPropagation(); sfx.tap(); peek(); };
      setTimeout(hide, d.flash + 300);
    }
    return { hint(l) {
      if (cover) cover.classList.remove('on');
      if (l < 2) { if (scene) wiggle(scene); return; }
      const delay = d.count && scene ? countAloud($$('.c', scene)) : 0;
      setTimeout(() => host.querySelector(`.ptile[data-i="${act.answer}"], .scene [data-opt="${act.answer}"]`)?.classList.add('glow'), delay);
    } };
  }
};

// ----- Sorting into bins -----
// data: { items: [{html, bin}], bins: [html] }
export const sort = {
  render(host, act, ctx) {
    const { items, bins } = act.data; let left = items.length, sel = null;
    host.innerHTML = `<div class="t-sort"><div class="tray">${items.map((it, i) => `<button class="sitem" data-i="${i}" data-b="${it.bin}">${it.html}</button>`).join('')}</div>
      <div class="bins">${bins.map((b, i) => `<div class="bin" data-b="${i}" role="button" tabindex="0"><div class="blabel">${b}</div><div class="bin-in"></div></div>`).join('')}</div></div>`;
    const binEls = $$('.bin', host);
    const place = (el, bin) => {
      if (+el.dataset.b === +bin.dataset.b) {
        el.dataset.used = 1; sfx.pop(); el.classList.remove('sel'); el.style.transform = ''; el._x = el._y = 0;
        bin.querySelector('.bin-in').append(el); popIn(el); left--;
        if (!left) ctx.submit('done');
      } else { wiggle(el); goHome(el); el.classList.remove('sel'); ctx.submit('wrong'); }
      sel = null;
    };
    $$('.sitem', host).forEach((el, i) => {
      popIn(el, i * 50);
      draggable(el, { targets: () => binEls, onDrop: async (el, tg) => { await flyTo(el, tg); place(el, tg); },
        onTap: el => { if (sel) sel.classList.remove('sel'); sel = el; el.classList.add('sel'); sfx.tap(); } });
    });
    binEls.forEach(b => b.addEventListener('click', () => { if (sel) { const s = sel; flyTo(s, b).then(() => place(s, b)); } }));
    return { hint(l) { binEls.forEach(b => squash(b)); if (l >= 2) { const first = host.querySelector('.tray .sitem'); if (first) { first.classList.add('glow'); binEls[+first.dataset.b].classList.add('glow'); } } } };
  }
};

// ----- Pattern caterpillar: fill the empty segment -----
const SEG = [{ c: '#ff6b6b', m: '<circle cx="50" cy="50" r="13" fill="#fff9"/>' }, { c: '#4dabf7', m: '<path d="M50 36 64 62H36z" fill="#fff9"/>' }, { c: '#ffd23f', m: '<rect x="38" y="38" width="24" height="24" rx="3" fill="#fff9"/>' }, { c: '#9775fa', m: '<path d="M50 34 66 50 50 66 34 50z" fill="#fff9"/>' }];
export const segSvg = i => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="${SEG[i].c}" stroke="#0002" stroke-width="4"/>${SEG[i].m}</svg>`;
const HEAD = '<svg viewBox="0 0 100 100"><path d="M36 22 26 2M64 22 74 2" stroke="#1d2b53" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="4" r="6" fill="#ff6b4a"/><circle cx="74" cy="4" r="6" fill="#ff6b4a"/><circle cx="50" cy="54" r="44" fill="#5cc96b" stroke="#0002" stroke-width="4"/><circle cx="38" cy="48" r="9" fill="#fff"/><circle cx="62" cy="48" r="9" fill="#fff"/><circle cx="40" cy="50" r="4.5" fill="#1d2b53"/><circle cx="64" cy="50" r="4.5" fill="#1d2b53"/><path d="M38 68q12 10 24 0" stroke="#1d2b53" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
export const pattern = {
  render(host, act, ctx) {
    const { seq, miss, options } = act.data;
    host.innerHTML = `<div class="t-pat"><div class="cater-wrap"><div class="cater" style="--n:${seq.length + 1}">${seq.map((v, j) => j === miss ? '<div class="cseg gap"></div>' : `<div class="cseg">${segSvg(v)}</div>`).join('')}<div class="cseg head">${HEAD}</div></div></div>
      <div class="dock">${options.map(v => `<button class="tile" data-v="${v}" aria-label="Piece">${segSvg(v)}</button>`).join('')}</div></div>`;
    const segs = $$('.cseg', host); segs.forEach((g, j) => g.style.animationDelay = (j * .12) + 's');
    const slot = host.querySelector('.cseg.gap'); let busy = false;
    $$('.tile', host).forEach((el, i) => { popIn(el, i * 80); draggable(el, { targets: () => [slot], canStart: () => !busy, onDrop: async (el, tg) => {
      busy = true; await flyTo(el, tg);
      if (+el.dataset.v === act.answer) { el.dataset.used = 1; el.style.visibility = 'hidden'; slot.innerHTML = segSvg(act.answer); slot.classList.add('filled'); squash(slot); ctx.submit(act.answer); }
      else { wiggle(el); setTimeout(() => { goHome(el); busy = false; ctx.submit(+el.dataset.v); }, 350); }
    } }); });
    return { hint(l) { segs.filter(s => !s.classList.contains('head')).forEach((g, j) => setTimeout(() => squash(g), j * 350)); if (l >= 2) host.querySelector(`.tile[data-v="${act.answer}"]`)?.classList.add('glow'); } };
  }
};

// ----- Place-value builder: hundreds, tens and ones -----
export const build = {
  render(host, act, ctx) {
    const places = act.data.places; const cols = ['h', 't', 'o'].slice(3 - places); const cnt = { h: 0, t: 0, o: 0 };
    const art = { h: FLAT, t: ROD, o: UNIT }, name = { h: t('pv.h'), t: t('pv.t'), o: t('pv.o') };
    host.innerHTML = `<div class="t-build"><div class="pvcols">${cols.map(c => `<div class="pvcol c-${c}"><div class="pvhead">${name[c]}</div><div class="pvarea" data-c="${c}"></div>
      <div class="pvbtns"><button class="btn" data-c="${c}" data-d="-1" aria-label="Remove one">−</button><span class="pvn">0</span><button class="btn primary" data-c="${c}" data-d="1" aria-label="Add one">+</button></div></div>`).join('')}</div>
      <div class="pvread">0</div><button class="btn primary checkbtn">${ICON.check}<span>${t('ui.check')}</span></button></div>`;
    const val = () => cnt.h * 100 + cnt.t * 10 + cnt.o;
    const draw = c => { const a = host.querySelector(`.pvarea[data-c="${c}"]`); a.innerHTML = Array.from({ length: cnt[c] }, () => `<i class="pv-${c}">${art[c]}</i>`).join(''); host.querySelector(`.c-${c} .pvn`).textContent = cnt[c]; host.querySelector('.pvread').textContent = val(); };
    host.querySelectorAll('.pvbtns .btn').forEach(b => b.onclick = () => { const c = b.dataset.c, d = +b.dataset.d; const n = cnt[c] + d; if (n < 0 || n > 9) { wiggle(b); return; } cnt[c] = n; sfx.tap(); draw(c); if (d > 0) popIn(host.querySelector(`.pvarea[data-c="${c}"]`).lastChild); });
    host.querySelector('.checkbtn').onclick = () => { const r = ctx.submit(val()); if (!r.ok) wiggle(host.querySelector('.pvcols')); };
    return { hint(l) { host.querySelectorAll('.pvn').forEach(n => n.classList.add('on')); if (l >= 2) host.querySelector('.pvread').classList.add('on'); } };
  }
};

// ----- Sharing equally: tap a plate to deal one cookie; "Start again" puts them all back -----
export const share = {
  render(host, act, ctx) {
    const { total, plates } = act.data; let pile = total;
    host.innerHTML = `<div class="t-share"><div class="pile">${Array.from({ length: total }, () => `<i class="ck">${COOKIE}</i>`).join('')}</div>
      <div class="plates n${plates}">${Array.from({ length: plates }, (_, i) => `<button class="plt" data-p="${i}" aria-label="Plate ${i + 1}">${PLATE}<span class="on-plate"></span><b class="pc">0</b></button>`).join('')}</div><button class="btn sreset">${ICON.replay}<span>${t('share.reset')}</span></button></div>`;
    const pileEl = host.querySelector('.pile'), counts = Array(plates).fill(0);
    const update = () => { $$(".plt", host).forEach((p, i) => p.querySelector('.pc').textContent = counts[i]); };
    $$(".plt", host).forEach(p => p.addEventListener('click', e => {
      const i = +p.dataset.p, on = p.querySelector('.on-plate');
      if (!pile) { wiggle(p); return; }
      const ck = pileEl.lastElementChild; ck.remove(); pile--; counts[i]++;
      const c = h(`<i class="ck">${COOKIE}</i>`); on.append(c); popIn(c); sfx.pop(); update();
      if (!pile) setTimeout(() => {
        const r = ctx.submit(counts.every(x => x === counts[0]) ? counts[0] : -1);
        if (!r.ok) { wiggle(host.querySelector('.plates')); setTimeout(() => host.querySelector('.sreset')?.click(), 900); }
      }, 400);
    }));
    host.querySelector('.sreset').onclick = () => { $$('.on-plate', host).forEach(o => o.innerHTML = ''); counts.fill(0); pile = total; pileEl.innerHTML = `<i class="ck">${COOKIE}</i>`.repeat(total); sfx.tap(); update(); };
    return { hint(l) { if (l >= 2) { $$(".plt", host).forEach(p => p.classList.add('glow')); } else wiggle(pileEl); } };
  }
};

// ----- Feed the frog: tap flies, each one flies into the frog's mouth -----
export const feed = {
  render(host, act, ctx) {
    const { n, total } = act.data; let c = 0;
    host.innerHTML = `<div class="t-feed"><div class="pond"><div class="lily"></div><div class="frogwrap"><div class="frog">${FROG}</div><i class="mouth"></i></div></div>
      <div class="tally">${'<i></i>'.repeat(n)}</div><button class="bigcheck" aria-label="${t('ui.check')}">${ICON.check}</button></div>`;
    const pond = host.querySelector('.pond'), frog = host.querySelector('.frog'), mouth = host.querySelector('.mouth'), dots = $$('.tally i', host);
    const spawn = () => {
      pond.querySelectorAll('.fly').forEach(f => f.remove()); c = 0; dots.forEach(d => d.classList.remove('on')); host.querySelector('.tally').classList.remove('over');
      shuffle([...Array(12).keys()]).slice(0, total).forEach((cell, i) => {
        const f = h(`<button class="fly" aria-label="fly">${FLY}</button>`);
        f.style.left = (4 + (cell % 4) * 23 + rnd(0, 6)) + '%'; f.style.top = (4 + Math.floor(cell / 4) * 15 + rnd(0, 4)) + '%'; f.firstChild.style.animationDelay = (-Math.random() * 2) + 's';
        pond.append(f); popIn(f, i * 50);
        f.addEventListener('click', () => {
          if (f.dataset.eaten) return; f.dataset.eaten = 1; c++; sfx.pop(); say(String(c));
          if (dots[c - 1]) dots[c - 1].classList.add('on'); host.querySelector('.tally').classList.toggle('over', c > n);
          const [x, y] = ctr(f), [mx, my] = ctr(mouth);
          f.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3,.7)', offset: .15 }, { transform: `translate(${mx - x}px,${my - y}px) scale(.25)`, opacity: .8 }], { duration: 500, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' })
            .onfinish = () => { f.style.visibility = 'hidden'; squash(frog); };
        });
      });
    };
    spawn();
    host.querySelector('.bigcheck').onclick = () => { const r = ctx.submit(c); if (!r.ok) setTimeout(spawn, 600); };
    return { hint(l) { wiggle(host.querySelector('.tally')); if (l >= 2) host.querySelector('.tally').classList.add('glow'); } };
  }
};
