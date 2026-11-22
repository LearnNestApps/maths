// Templates 2 and 3: drag-and-drop to a target, and the balance scale.
import { h, esc, BOUNCE, draggable, flyTo, goHome, wiggle, squash, popIn } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx } from '../../core/audio.js';
import { shapeSvg } from '../../core/art.js';

export const drag = {
  render(host, act, ctx) {
    const { target, options } = act.data;
    host.innerHTML = `<div class="t-drag"><div class="board"><div class="sil" aria-label="${esc(t('shape.' + target))}">${shapeSvg(target, true)}</div></div><div class="dock">${options.map(k => `<button class="tile" data-k="${k}" aria-label="${esc(t('shape.' + k))}">${shapeSvg(k)}</button>`).join('')}</div></div>`;
    const sil = host.querySelector('.sil'); let busy = false;
    host.querySelectorAll('.tile').forEach((el, i) => {
      popIn(el, i * 80);
      draggable(el, { targets: () => [sil], canStart: () => !busy, onDrop: async (el, tg) => {
        busy = true; await flyTo(el, tg);
        if (el.dataset.k === target) {
          el.dataset.used = 1; el.style.visibility = 'hidden'; sil.innerHTML = shapeSvg(target); sil.classList.add('filled');
          sil.firstChild.animate?.([{ transform: 'scale(.6) rotate(0)' }, { transform: 'scale(1.12) rotate(360deg)', offset: .7 }, { transform: 'scale(1) rotate(360deg)' }], { duration: 800, easing: BOUNCE });
          ctx.submit(target);
        } else { wiggle(el); setTimeout(() => { goHome(el); busy = false; ctx.submit(el.dataset.k); }, 380); }
      } });
    });
    return { hint(l) { sil.classList.add('pulse'); if (l >= 2) host.querySelector(`.tile[data-k="${target}"]`)?.classList.add('glow'); } };
  }
};

export const balance = {
  render(host, act, ctx) {
    const { left: L, options } = act.data; let R = 0, alive = true, busy = false;
    const STR = '<svg class="str" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 0 8 100M50 0 92 100" stroke="#6b4a30" stroke-width="2" vector-effect="non-scaling-stroke" fill="none"/></svg>';
    const pan = id => `<div class="hang ${id}"><div class="pan" ${id === 'r' ? 'id="rpan"' : ''}>${STR}<div class="load"></div><div class="plate"></div></div></div>`;
    host.innerHTML = `<div class="t-bal"><div class="scale"><div class="post"></div><div class="base"></div><div class="beam">${pan('l')}${pan('r')}</div></div>
      <div class="dock">${options.map(n => `<button class="tile" data-n="${n}" aria-label="${n}"><div class="stack">${'<i class="cube"></i>'.repeat(n)}</div></button>`).join('')}</div></div>`;
    const beam = host.querySelector('.beam'), hangs = host.querySelectorAll('.hang'), [lload, rload] = host.querySelectorAll('.load'), rpan = host.querySelector('#rpan');
    lload.innerHTML = '<i class="cube b"></i>'.repeat(L);
    let th = 0, v = 0; const tgt = () => Math.max(-16, Math.min(16, (R - L) * 4.5));
    (function step() { if (!alive || !beam.isConnected) return; const a = -70 * (th - tgt()) - 5 * v; v += a / 60; th += v / 60; beam.style.transform = `rotate(${th}deg)`; hangs.forEach(x => x.style.transform = `rotate(${-th}deg)`); requestAnimationFrame(step); })();
    ctx.onCleanup(() => { alive = false; });
    host.querySelectorAll('.tile').forEach(el => draggable(el, { targets: () => [rpan], canStart: () => !busy, onDrop: async (el, tg) => {
      busy = true; await flyTo(el, tg); const n = +el.dataset.n;
      el.style.visibility = 'hidden'; el.style.transform = ''; el._x = el._y = 0; rload.innerHTML = '';
      for (let j = 0; j < n; j++) setTimeout(() => { const c = h('<i class="cube"></i>'); rload.append(c); popIn(c); R = j + 1; sfx.tap(); }, j * 90);
      setTimeout(() => {
        if (!alive) return;
        const r = ctx.submit(n);
        if (!r.ok) setTimeout(() => { if (!alive) return; rload.innerHTML = ''; R = 0; el.style.visibility = 'visible'; popIn(el); busy = false; }, 700);
      }, n * 90 + 900);
    } }));
    return { hint(l) { wiggle(lload); if (l >= 2) host.querySelector(`.tile[data-n="${L}"]`)?.classList.add('glow'); } };
  }
};
