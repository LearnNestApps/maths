// Templates 1, 4, 5, 6: tap-to-select, number pad, maths keyboard, multiple choice.
import { h, esc, rnd, shuffle, squash, wiggle, popIn, numpad, $$ } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { OBJ, ICON } from '../../core/art.js';
import { pretty } from '../../content/expr.js';

// Shared numeric answer box + on-screen pad + physical keyboard.
export function numInput(host, { neg = false, dot = false, onSubmit, maxLen = 8, onChange } = {}) {
  let v = '';
  const disp = h('<div class="ans" aria-live="polite"><span class="v"></span><i class="caret"></i></div>');
  const render = () => { disp.querySelector('.v').textContent = v.replace('-', '−'); };
  function onKey(k) {
    sfx.tap();
    if (k === 'del') v = v.slice(0, -1);
    else if (k === 'ok') { if (v && v !== '-') onSubmit(v); return; }
    else if (k === '−') v = v.startsWith('-') ? v.slice(1) : '-' + v;
    else if (k === '.') { if (!v.includes('.')) v += (v.replace('-', '') ? '' : '0') + '.'; }
    else if (v.replace('-', '').length < maxLen) v += k;
    render(); onChange && onChange(v);
  }
  const pad = numpad({ onKey, allowNeg: neg, allowDot: dot, okLabel: t('ui.ok') });
  host.append(disp, pad);
  const kd = e => {
    if (e.target.closest('input,textarea') || e.metaKey || e.ctrlKey) return;
    if (/^[0-9]$/.test(e.key)) onKey(e.key); else if (e.key === 'Backspace') onKey('del'); else if (e.key === 'Enter') onKey('ok');
    else if (e.key === '-' && neg) onKey('−'); else if (e.key === '.' && dot) onKey('.'); else return;
    e.preventDefault();
  };
  document.addEventListener('keydown', kd);
  return { clear() { v = ''; render(); }, set(x) { v = String(x); render(); }, get: () => v, shake() { wiggle(disp); }, destroy() { document.removeEventListener('keydown', kd); }, disp, pad };
}

export const tap = {
  render(host, act, ctx) {
    const { n, thing, total } = act.data;
    host.innerHTML = `<div class="t-tap"><div class="field"></div><div class="tally">${'<i></i>'.repeat(n)}</div><button class="bigcheck" aria-label="${t('ui.check')}">${ICON.check}</button></div>`;
    const field = host.querySelector('.field'), dots = $$('.tally i', host), order = [];
    shuffle([...Array(12).keys()]).slice(0, total).forEach((cell, i) => {
      const b = h(`<button class="obj" aria-label="${esc(t('thing.' + thing))}">${OBJ[thing]}</button>`);
      b.style.left = (4 + (cell % 4) * 24 + rnd(0, 5)) + '%'; b.style.top = (4 + Math.floor(cell / 4) * 31 + rnd(0, 5)) + '%';
      field.append(b); popIn(b, i * 60);
      b.addEventListener('click', () => {
        const k = order.indexOf(b);
        if (k >= 0) { order.splice(k, 1); b.classList.remove('on'); sfx.tap(); } else { order.push(b); b.classList.add('on'); sfx.pop(); squash(b); say(String(order.length)); }
        order.forEach((o, j) => o.dataset.n = j + 1);
        dots.forEach((d, j) => d.classList.toggle('on', j < order.length));
        host.querySelector('.tally').classList.toggle('over', order.length > n);
      });
    });
    host.querySelector('.bigcheck').addEventListener('click', () => ctx.submit(order.length));
    return { hint(l) { const tl = host.querySelector('.tally'); wiggle(tl); if (l >= 2) tl.classList.add('glow'); } };
  }
};

function fracHtml(s) {
  const [a, b] = s.split('/').map(Number);
  return `<span class="frac"><span>${a}</span><span>${b}</span></span><span class="strip" style="--n:${b}">${Array.from({ length: b }, (_, i) => `<i class="${i < a ? 'on' : ''}"></i>`).join('')}</span>`;
}
export const mcq = {
  render(host, act, ctx) {
    const { options, fractions } = act.data;
    host.innerHTML = `<div class="t-mcq${fractions ? ' fr' : ''}${options.length === 2 ? ' two' : ''}"><div class="opts">${options.map((o, i) => `<button class="opt" data-i="${i}">${fractions ? fracHtml(o) : act.data.html ? o : esc(o)}</button>`).join('')}</div></div>`;
    host.querySelector('.opts').addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const r = ctx.submit(+b.dataset.i);
      if (r.ok) { b.classList.add('ok'); squash(b); } else { b.classList.add('bad'); b.disabled = true; wiggle(b); }
    });
    return { hint(l) { if (l < 2) return; const wrong = $$('.opt:not([disabled])', host).filter(b => +b.dataset.i !== act.answer); if (wrong.length > 1) { wrong[0].disabled = true; wrong[0].classList.add('dim'); } } };
  }
};

export const numpadT = {
  render(host, act, ctx) {
    host.innerHTML = `<div class="t-num"><div class="q">${act.data.expr || ''}</div><div class="io"></div></div>`;
    const ni = numInput(host.querySelector('.io'), { neg: !!act.data.neg, dot: !!act.data.dot, maxLen: act.data.maxLen || 8, onSubmit: v => { const r = ctx.submit(Number(v)); if (!r.ok) { ni.shake(); ni.clear(); } } });
    ctx.onCleanup(() => ni.destroy());
    return {};
  }
};

const KB = ['7', '8', '9', 'x', '(', ')', '4', '5', '6', '+', '−', '^', '1', '2', '3', '×', '÷', '√', '0', '.', 'y', 'del', 'clr', 'ok'];
export const mathkb = {
  render(host, act, ctx) {
    let v = '';
    host.innerHTML = `<div class="t-kb"><div class="q">${act.data.expr || ''}</div><div class="ans kbans"><span class="v"></span><i class="caret"></i></div>
      <div class="kb">${KB.map(k => `<button class="k${k === 'ok' ? ' ok' : ''}${/[0-9.]/.test(k) ? '' : ' sym'}" data-k="${k}">${k === 'del' ? '⌫' : k === 'clr' ? 'C' : k === 'ok' ? t('ui.ok') : k}</button>`).join('')}</div></div>`;
    const disp = host.querySelector('.kbans .v');
    const render = () => { disp.textContent = pretty(v.replace(/−/g, '-')); };
    const press = k => {
      sfx.tap();
      if (k === 'del') v = v.slice(0, -1); else if (k === 'clr') v = '';
      else if (k === 'ok') { if (!v) return; const r = ctx.submit(v.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')); if (!r.ok) wiggle(host.querySelector('.kbans')); return; }
      else if (v.length < 30) v += k;
      render();
    };
    host.querySelector('.kb').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
    const kd = e => {
      if (e.metaKey || e.ctrlKey) return; const map = { '*': '×', '/': '÷', '-': '−', Backspace: 'del', Enter: 'ok' };
      const k = map[e.key] || e.key; if (KB.includes(k)) { e.preventDefault(); press(k); }
    };
    document.addEventListener('keydown', kd); ctx.onCleanup(() => document.removeEventListener('keydown', kd));
    return {};
  }
};
