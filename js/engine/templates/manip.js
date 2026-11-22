// Template 8: interactive manipulatives (abacus, number line, clock, bar model).
import { h, esc, clamp, wiggle, squash } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx } from '../../core/audio.js';
import { ICON } from '../../core/art.js';
import { numInput } from './basic.js';

const checkBtn = () => `<button class="btn primary checkbtn">${ICON.check}<span>${t('ui.check')}</span></button>`;

// ----- Soroban: 1 heaven bead (5) + 4 earth beads (1) per rod -----
export const abacus = {
  render(host, act, ctx) {
    const rods = act.data.rods, st = Array.from({ length: rods }, () => ({ hv: 0, e: 0 }));
    if (act.data.start) String(act.data.start).padStart(rods, '0').split('').forEach((d, i) => { st[i].hv = +d >= 5 ? 1 : 0; st[i].e = +d % 5; });
    const labels = rods === 1 ? [''] : ['H', 'T', 'O'].slice(-rods);
    host.innerHTML = `<div class="t-abacus"><div class="readout ${ctx.mode === 'little' ? 'on' : ''}">0</div>
      <div class="frame" style="--rods:${rods}">${st.map((_, r) => `<div class="rod" data-r="${r}"><i class="wire"></i><button class="bead hv" data-r="${r}" data-b="h" aria-label="5"></button>${[0, 1, 2, 3].map(i => `<button class="bead" data-r="${r}" data-b="${i}" aria-label="1"></button>`).join('')}<span class="lab">${labels[r]}</span></div>`).join('')}<i class="bar"></i></div>${checkBtn()}</div>`;
    const value = () => st.reduce((s, x) => s * 10 + x.hv * 5 + x.e, 0);
    const draw = () => {
      host.querySelectorAll('.rod').forEach((rod, r) => {
        rod.querySelector('.hv').classList.toggle('on', !!st[r].hv);
        rod.querySelectorAll('.bead:not(.hv)').forEach((b, i) => b.classList.toggle('on', i < st[r].e));
      });
      host.querySelector('.readout').textContent = value();
    };
    host.querySelector('.frame').addEventListener('click', e => {
      const b = e.target.closest('.bead'); if (!b) return; const s = st[+b.dataset.r];
      if (b.dataset.b === 'h') s.hv ^= 1; else { const i = +b.dataset.b; s.e = i < s.e ? i : i + 1; }
      sfx.bead(); draw();
    });
    host.querySelector('.checkbtn').addEventListener('click', () => { const r = ctx.submit(value()); if (!r.ok) wiggle(host.querySelector('.frame')); });
    draw();
    return { hint(l) { const ro = host.querySelector('.readout'); ro.classList.add('on'); squash(ro); } };
  }
};

// ----- Number line with a draggable marker -----
export const numline = {
  render(host, act, ctx) {
    const { min, max, step } = act.data, n = Math.round((max - min) / step), every = n > 10 ? Math.ceil(n / 10) : 1;
    let val = min;
    host.innerHTML = `<div class="t-nl"><svg class="nl" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
      <line x1="40" y1="120" x2="960" y2="120" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
      ${Array.from({ length: n + 1 }, (_, i) => { const x = 40 + 920 * i / n, lab = i % every === 0; return `<line class="tk" data-i="${i}" x1="${x}" y1="${lab ? 98 : 106}" x2="${x}" y2="${lab ? 142 : 134}" stroke="currentColor" stroke-width="${lab ? 5 : 3}"/>${lab ? `<text x="${x}" y="182" text-anchor="middle" font-size="30" font-weight="700" fill="currentColor">${min + i * step}</text>` : `<text class="ghost" data-i="${i}" x="${x}" y="182" text-anchor="middle" font-size="22" fill="currentColor">${min + i * step}</text>`}`; }).join('')}
      <g class="mk"><path d="M0 -6 L22 -46 L-22 -46Z" fill="var(--acc)"/><circle cy="-58" r="22" fill="var(--acc)"/><text class="mv" y="-50" text-anchor="middle" font-size="22" font-weight="800" fill="#fff"></text></g>
      <rect class="hitbox" x="0" y="20" width="1000" height="180" fill="transparent"/></svg>${checkBtn()}</div>`;
    const svg = host.querySelector('svg'), mk = host.querySelector('.mk'), mv = host.querySelector('.mv');
    const place = v => { val = v; const i = (v - min) / step; mk.setAttribute('transform', `translate(${40 + 920 * i / n} 114)`); mv.textContent = String(v).length > 3 ? '' : v; };
    const fromEvent = e => { const r = svg.getBoundingClientRect(), sx = 1000 / r.width, x = (e.clientX - r.left) * sx; const i = clamp(Math.round((x - 40) / 920 * n), 0, n); return min + i * step; };
    let drag = false;
    svg.addEventListener('pointerdown', e => { drag = true; try { svg.setPointerCapture(e.pointerId); } catch (_) {} const v = fromEvent(e); if (v !== val) sfx.tick(); place(v); });
    svg.addEventListener('pointermove', e => { if (!drag) return; const v = fromEvent(e); if (v !== val) { sfx.tick(); place(v); } });
    svg.addEventListener('pointerup', () => drag = false);
    svg.style.touchAction = 'none';
    const kd = e => { if (e.key === 'ArrowRight') place(Math.min(max, val + step)); else if (e.key === 'ArrowLeft') place(Math.max(min, val - step)); else return; e.preventDefault(); };
    document.addEventListener('keydown', kd); ctx.onCleanup(() => document.removeEventListener('keydown', kd));
    place(min);
    host.querySelector('.checkbtn').addEventListener('click', () => { const r = ctx.submit(val); if (!r.ok) wiggle(svg); });
    return { hint(l) { if (l >= 2) host.querySelectorAll('.ghost').forEach(g => g.classList.add('on')); } };
  }
};

// ----- Analogue clock with draggable hands -----
export const clock = {
  render(host, act, ctx) {
    const half = act.data.half; let hr = 12, m = 0, grab = null;
    host.innerHTML = `<div class="t-clock"><svg class="clk" viewBox="-110 -110 220 220">
      <circle r="102" fill="#fff" stroke="var(--acc)" stroke-width="8"/>
      ${Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 92 : 86; return `<line x1="${Math.sin(a) * r1}" y1="${-Math.cos(a) * r1}" x2="${Math.sin(a) * 97}" y2="${-Math.cos(a) * 97}" stroke="#1d2b53" stroke-width="${i % 5 ? 1.5 : 3.5}"/>`; }).join('')}
      ${Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30 * Math.PI / 180; return `<text x="${Math.sin(a) * 70}" y="${-Math.cos(a) * 70 + 9}" text-anchor="middle" font-size="26" font-weight="800" fill="#1d2b53">${i + 1}</text>`; }).join('')}
      <g class="mh${half ? '' : ' fixed'}"><line y2="-82" stroke="#4dabf7" stroke-width="7" stroke-linecap="round"/><circle cy="-82" r="${half ? 12 : 0}" fill="#4dabf7" opacity=".35"/></g>
      <g class="hh"><line y2="-52" stroke="#ff6b4a" stroke-width="11" stroke-linecap="round"/><circle cy="-52" r="14" fill="#ff6b4a" opacity=".35"/></g>
      <circle r="8" fill="#1d2b53"/></svg>
      <div class="clkctl"><button class="btn" data-d="-1" aria-label="Hour back">−</button><span class="clkread"></span><button class="btn" data-d="1" aria-label="Hour forward">+</button></div>${checkBtn()}</div>`;
    const svg = host.querySelector('svg'), hh = host.querySelector('.hh'), mh = host.querySelector('.mh');
    const draw = () => { hh.setAttribute('transform', `rotate(${(hr % 12 + m / 60) * 30})`); mh.setAttribute('transform', `rotate(${m * 6})`); host.querySelector('.clkread').textContent = ctx.mode === 'little' ? '' : `${hr}:${String(m).padStart(2, '0')}`; };
    const ang = e => { const r = svg.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; return (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360; };
    svg.style.touchAction = 'none';
    svg.addEventListener('pointerdown', e => {
      const a = ang(e), r = svg.getBoundingClientRect(), d = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) / (r.width / 220);
      grab = half && d > 64 ? 'm' : 'h'; try { svg.setPointerCapture(e.pointerId); } catch (_) {} move(a);
    });
    const move = a => {
      if (grab === 'h') { const nh = Math.round(((a - m / 2) % 360 + 360) % 360 / 30) || 12; if (nh !== hr) { hr = nh; sfx.tick(); } }
      else if (grab === 'm') { const sm = act.data.quarter ? 15 : 30, nm = (Math.round(a / (sm * 6)) * sm) % 60; if (nm !== m) { m = nm; sfx.tick(); } }
      draw();
    };
    svg.addEventListener('pointermove', e => { if (grab) move(ang(e)); });
    svg.addEventListener('pointerup', () => grab = null);
    host.querySelector('.clkctl').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; hr = ((hr - 1 + +b.dataset.d + 12) % 12) + 1; sfx.tick(); draw(); });
    host.querySelector('.checkbtn').addEventListener('click', () => { const r = ctx.submit(`${hr}:${m}`); if (!r.ok) wiggle(svg); });
    draw();
    return { hint(l) { if (l >= 2) { host.querySelector('.clkread').textContent = `${hr}:${String(m).padStart(2, '0')}`; } squash(hh.parentNode); } };
  }
};

// ----- Singapore bar model + number answer -----
export const bar = {
  render(host, act, ctx) {
    const d = act.data; let svgBars = '';
    if (d.kind === 'pw') {
      const wa = Math.max(18, Math.round(84 * d.parts[0] / d.whole));
      svgBars = `<div class="bm"><div class="brace"><span>${d.whole}</span></div><div class="bars"><div class="seg a" style="flex:${wa}">${d.parts[0]}</div><div class="seg q" style="flex:${84 - wa}">?</div></div></div>`;
    } else {
      const tot = d.a + d.b, wa = Math.round(80 * d.a / tot);
      svgBars = `<div class="bm cmp"><div class="row"><span class="nm">${esc(d.name)}</span><div class="bars"><div class="seg a" style="flex:0 0 ${wa}%">${d.a}</div></div></div>
        <div class="row"><span class="nm">${esc(d.name2)}</span><div class="bars"><div class="seg a" style="flex:0 0 ${wa}%">${d.a}</div><div class="seg b" style="flex:0 0 ${80 - wa}%">${d.b}</div><span class="q2">?</span></div></div></div>`;
    }
    host.innerHTML = `<div class="t-bar">${svgBars}<div class="io"></div></div>`;
    const ni = numInput(host.querySelector('.io'), { onSubmit: v => { const r = ctx.submit(Number(v)); if (!r.ok) { ni.shake(); ni.clear(); } } });
    ctx.onCleanup(() => ni.destroy());
    return { hint(l) { host.querySelectorAll('.seg.q,.q2').forEach(e => e.classList.add('glow')); } };
  }
};
