// Logic & coding templates: Venn sorting, logic gates, robot programming, ordering, binary bulbs.
import { h, esc, squash, wiggle, popIn, goHome, wait, $$ } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { ICON } from '../../core/art.js';
import { VENN, regionAt, spot, vennSvg, GATE } from '../../core/art_logic.js';

// ----- Venn sorting: drag (or tap, then tap a region) each number into the right part -----
export const venn = {
  render(host, act, ctx) {
    const { la, lb, ca, cb, items } = act.data; let left = items.length, sel = null; const placed = { a: 0, b: 0, ab: 0, none: 0 };
    host.innerHTML = `<div class="t-venn"><div class="vwrap">${vennSvg(la, lb)}<div class="vlayer"></div></div>
      <div class="vcode"><code>A: ${esc(ca)}</code><code>B: ${esc(cb)}</code><small>${t('venn.key')}</small></div>
      <div class="chips">${items.map((it, i) => `<button class="chip2" data-i="${i}">${it.v}</button>`).join('')}</div></div>`;
    const svg = host.querySelector('svg'), layer = host.querySelector('.vlayer');
    const toSvg = (cx, cy) => { const r = svg.getBoundingClientRect(); return [(cx - r.left) * VENN.W / r.width, (cy - r.top) * VENN.H / r.height, r]; };
    const flash = region => { const sel2 = { a: '.va', b: '.vb', ab: '.va,.vb', none: '.vu' }[region]; svg.querySelectorAll(sel2).forEach(e => { e.classList.remove('flash'); void e.getBBox(); e.classList.add('flash'); }); };
    function place(chip, region) {
      const it = items[+chip.dataset.i];
      if (it.region !== region) { sfx.boing(); wiggle(chip); goHome(chip); chip.classList.remove('sel'); sel = null; ctx.submit('wrong'); return; }
      const [x, y] = spot(region, placed[region]++), m = h(`<b class="vnum">${it.v}</b>`);
      m.style.left = (x / VENN.W * 100) + '%'; m.style.top = (y / VENN.H * 100) + '%'; layer.append(m); popIn(m); flash(region); sfx.pop();
      chip.remove(); sel = null; left--; if (!left) setTimeout(() => ctx.submit('done'), 500);
    }
    host.querySelectorAll('.chip2').forEach(chip => {
      chip.style.touchAction = 'none'; chip._x = chip._y = 0;
      chip.addEventListener('pointerdown', e => {
        e.preventDefault(); try { chip.setPointerCapture(e.pointerId); } catch (_) {}
        const sx = e.clientX, sy = e.clientY; let moved = false; chip.classList.add('lift');
        const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.hypot(dx, dy) > 8) moved = true; chip._x = dx; chip._y = dy; chip.style.transform = `translate(${dx}px,${dy}px) scale(1.1)`; };
        const up = ev => {
          chip.removeEventListener('pointermove', mv); chip.removeEventListener('pointerup', up); chip.classList.remove('lift');
          if (!moved) { chip.style.transform = ''; if (sel) sel.classList.remove('sel'); sel = chip; chip.classList.add('sel'); sfx.tap(); return; }
          const [x, y, r] = toSvg(ev.clientX, ev.clientY);
          if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) { goHome(chip); return; }
          place(chip, regionAt(x, y));
        };
        chip.addEventListener('pointermove', mv); chip.addEventListener('pointerup', up);
      });
    });
    svg.addEventListener('click', e => { if (!sel) return; const [x, y] = toSvg(e.clientX, e.clientY); place(sel, regionAt(x, y)); });
    return { hint(l) { if (l < 2) { wiggle(host.querySelector('.vcode')); return; } const c = host.querySelector('.chip2'); if (c) { c.classList.add('glow'); flash(items[+c.dataset.i].region); } } };
  }
};

// ----- Logic gates: predict the lamp for each row of the truth table, then watch it light -----
const evalGate = (g, a, b) => ({ AND: a & b, OR: a | b, XOR: a ^ b, NOT: 1 - a, NAND: 1 - (a & b), 'A AND NOT B': a & (1 - b), 'NOT A OR B': (1 - a) | b }[g]);
export const gates = {
  render(host, act, ctx) {
    const { gate } = act.data, one = gate === 'NOT', rows = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    let k = 0, assisted = false;
    const sym = GATE[gate] ? `<g class="gsym" transform="translate(130 50)">${GATE[gate]}</g>` : `<g transform="translate(120 52)"><rect width="120" height="56" rx="10" class="gbox"/><text x="60" y="34" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">${gate}</text></g>`;
    const outX = GATE[gate] ? 212 : 240;
    host.innerHTML = `<div class="t-gate"><svg class="gsvg" viewBox="0 0 360 160">
      <g class="wire"><path d="M54 ${one ? 80 : 68}H${GATE[gate] ? 150 : 120}"/>${one ? '' : `<path d="M54 92H${GATE[gate] ? 150 : 120}"/>`}<path d="M${outX} 80H300"/></g>
      <g class="sw a"><rect x="8" y="${one ? 66 : 54}" width="40" height="28" rx="14"/><circle cx="22" cy="${one ? 80 : 68}" r="10"/><text x="-2" y="${one ? 86 : 74}" text-anchor="end">A</text></g>
      ${one ? '' : '<g class="sw b"><rect x="8" y="78" width="40" height="28" rx="14"/><circle cx="22" cy="92" r="10"/><text x="-2" y="98" text-anchor="end">B</text></g>'}
      ${sym}<g class="lamp"><circle cx="318" cy="80" r="22"/><path d="M310 104h16v10h-16z" fill="#868e96"/></g></svg>
      <table class="tt"><thead><tr><th>A</th>${one ? '' : '<th>B</th>'}<th>${t('gate.out')}</th></tr></thead><tbody>${rows.map((r, i) => `<tr data-r="${i}"><td>${r[0]}</td>${one ? '' : `<td>${r[1]}</td>`}<td class="o">?</td></tr>`).join('')}</tbody></table>
      <div class="gask"><span>${t('gate.ask')}</span><button class="btn lon" data-v="1">${t('gate.on')}</button><button class="btn loff" data-v="0">${t('gate.off')}</button></div></div>`;
    const svg = host.querySelector('svg'), lamp = host.querySelector('.lamp'), trs = $$('.tt tbody tr', host);
    const setRow = () => {
      const r = rows[k]; svg.querySelector('.sw.a').classList.toggle('on', !!r[0]); svg.querySelector('.sw.b')?.classList.toggle('on', !!r[1]);
      lamp.classList.remove('lit'); svg.querySelector('.wire').classList.remove('live'); trs.forEach((tr, i) => tr.classList.toggle('now', i === k));
    };
    host.querySelector('.gask').addEventListener('click', async e => {
      const b = e.target.closest('[data-v]'); if (!b || k >= rows.length) return;
      const r = rows[k], out = evalGate(gate, r[0], r[1] ?? 0), guess = +b.dataset.v, cell = trs[k].querySelector('.o');
      lamp.classList.toggle('lit', !!out); svg.querySelector('.wire').classList.toggle('live', !!out);
      cell.textContent = out; cell.className = 'o ' + (guess === out ? 'ok' : 'no');
      if (guess === out) { sfx.pop(); squash(cell); } else { sfx.boing(); wiggle(trs[k]); assisted = true; }
      say(out ? t('gate.on') : t('gate.off'));
      k++; await wait(900);
      if (k < rows.length) setRow(); else ctx.submit('done', { assisted });
    });
    setRow();
    return { hint() { host.querySelector('.gask span').textContent = act.hint; } };
  }
};

// ----- Robot programming: build a list of commands, press Run, watch the robot move -----
const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
const ROBOT = '<svg viewBox="0 0 60 60"><rect x="12" y="16" width="36" height="32" rx="9" fill="#4dabf7"/><rect x="18" y="24" width="24" height="12" rx="6" fill="#fff"/><circle cx="25" cy="30" r="3" fill="#1d2b53"/><circle cx="35" cy="30" r="3" fill="#1d2b53"/><path d="M30 16V6" stroke="#1d2b53" stroke-width="3"/><circle cx="30" cy="5" r="4" fill="#ff6b4a"/><path d="M22 4l8-4 8 4" fill="none"/><path d="M24 8 30 0l6 8z" fill="#ffd23f"/></svg>';
export const robot = {
  render(host, act, ctx) {
    const { n, start, goal, rocks, loops, limit } = act.data; let prog = [], running = false;
    const cells = Array.from({ length: n * n }, (_, i) => { const x = i % n, y = Math.floor(i / n); return `<i class="cell${rocks.some(r => r[0] === x && r[1] === y) ? ' rock' : ''}${goal[0] === x && goal[1] === y ? ' goal' : ''}"></i>`; }).join('');
    host.innerHTML = `<div class="t-robot"><div class="board" style="--n:${n}">${cells}<div class="bot">${ROBOT}</div></div>
      <div class="rside"><div class="rpal"><button class="btn" data-c="F" aria-label="${t('rob.F')}">⬆<span>${t('rob.F')}</span></button><button class="btn" data-c="L" aria-label="${t('rob.L')}">↺<span>${t('rob.L')}</span></button><button class="btn" data-c="R" aria-label="${t('rob.R')}">↻<span>${t('rob.R')}</span></button></div>
      ${limit ? `<p class="rlimit">${t('rob.limit', { n: limit })}</p>` : ''}${loops ? `<p class="rlimit">${t('rob.loops')}</p>` : ''}
      <ol class="prog" aria-label="Program"></ol><div class="row"><button class="btn primary run">${ICON.play}<span>${t('rob.run')}</span></button><button class="btn clr">${t('rob.clear')}</button></div></div></div>`;
    const bot = host.querySelector('.bot'), list = host.querySelector('.prog');
    const put = (x, y, d, anim = true) => { bot.style.transition = anim ? '' : 'none'; bot.style.transform = `translate(${x * 100}%,${y * 100}%) rotate(${d * 90}deg)`; };
    const draw = () => {
      list.innerHTML = prog.map((b, i) => `<li class="blk2"><button class="bx" data-i="${i}" aria-label="Remove">${{ F: '⬆', L: '↺', R: '↻' }[b.c]} ${t('rob.' + b.c)}</button>${loops ? `<button class="rep" data-i="${i}">× ${b.k}</button>` : ''}</li>`).join('') || `<li class="empty">${t('rob.empty')}</li>`;
      host.querySelector('.run').disabled = !prog.length;
    };
    host.querySelector(".rpal").onclick = e => { const b = e.target.closest('[data-c]'); if (!b || running) return; if (limit && prog.length >= limit) { wiggle(list); return; } prog.push({ c: b.dataset.c, k: 1 }); sfx.tap(); draw(); popIn(list.lastElementChild); };
    list.onclick = e => { if (running) return; const r = e.target.closest('.rep'), x = e.target.closest('.bx'); if (r) { const b = prog[+r.dataset.i]; b.k = b.k % 5 + 1; sfx.tap(); draw(); } else if (x) { prog.splice(+x.dataset.i, 1); sfx.tap(); draw(); } };
    host.querySelector('.clr').onclick = () => { if (running) return; prog = []; draw(); put(start[0], start[1], 0, false); };
    host.querySelector('.run').onclick = async () => {
      if (running || !prog.length) return; running = true; let x = start[0], y = start[1], d = 0, crash = false;
      put(x, y, d, false); await wait(60);
      const steps = prog.flatMap(b => Array(b.k).fill(b.c));
      for (let i = 0; i < steps.length && !crash; i++) {
        list.querySelectorAll('.blk2').forEach(li => li.classList.remove('now'));
        let acc = 0; prog.some((b, j) => { acc += b.k; if (i < acc) { list.children[j]?.classList.add('now'); return true; } });
        const c = steps[i];
        if (c === 'L') d = (d + 3) % 4; else if (c === 'R') d = (d + 1) % 4;
        else { const nx = x + DX[d], ny = y + DY[d]; if (nx < 0 || ny < 0 || nx >= n || ny >= n || rocks.some(r => r[0] === nx && r[1] === ny)) { crash = true; break; } x = nx; y = ny; }
        put(x, y, d); sfx.tick(); await wait(380);
      }
      list.querySelectorAll('.blk2').forEach(li => li.classList.remove('now'));
      const ok = !crash && x === goal[0] && y === goal[1];
      if (ok) { bot.classList.add('happy'); ctx.submit('goal'); }
      else { bot.classList.add('bump'); sfx.boing(); await wait(600); bot.classList.remove('bump'); put(start[0], start[1], 0, false); ctx.submit(crash ? 'crash' : 'missed'); }
      running = false;
    };
    put(start[0], start[1], 0, false); draw();
    return { hint(l) { if (l >= 2) { const p = host.querySelector('.rlimit') || h('<p class="rlimit"></p>'); p.textContent = act.data.solutionText; host.querySelector('.rside').prepend(p); } else wiggle(host.querySelector('.board')); } };
  }
};

// ----- Put in order: tap the cards in the right order -----
export const order = {
  render(host, act, ctx) {
    const { cards, order: want, hintTxt } = act.data; let k = 0;
    host.innerHTML = `<div class="t-order"><div class="ocards">${cards.map((c, i) => `<button class="ocard" data-i="${i}"><span class="onum"></span><span class="otxt">${c}</span></button>`).join('')}</div></div>`;
    host.querySelectorAll('.ocard').forEach((b, j) => { popIn(b, j * 60); b.onclick = () => {
      if (b.classList.contains('done')) return;
      if (+b.dataset.i === want[k]) { k++; b.classList.add('done'); b.querySelector('.onum').textContent = k; sfx.pop(); squash(b); if (k === want.length) setTimeout(() => ctx.submit('done'), 400); }
      else { wiggle(b); ctx.submit('wrong'); }
    }; });
    return { hint(l) { if (l >= 2) host.querySelector(`.ocard[data-i="${want[k]}"]`)?.classList.add('glow'); } };
  }
};

// ----- Binary bulbs: switch bulbs on to make the number -----
export const binary = {
  render(host, act, ctx) {
    const { bits, target } = act.data, vals = Array.from({ length: bits }, (_, i) => 2 ** (bits - 1 - i)), on = Array(bits).fill(0);
    host.innerHTML = `<div class="t-bin"><div class="bulbs">${vals.map((v, i) => `<button class="bulb" data-i="${i}" aria-label="${v}"><svg viewBox="0 0 40 52"><circle cx="20" cy="20" r="16"/><rect x="13" y="36" width="14" height="10" rx="2" fill="#868e96"/></svg><b>${v}</b><i class="bit">0</i></button>`).join('')}</div>
      <div class="bsum">${t('bin.total')} <b>0</b></div><button class="btn primary checkbtn">${ICON.check}<span>${t('ui.check')}</span></button></div>`;
    const sum = () => vals.reduce((s, v, i) => s + v * on[i], 0);
    host.querySelector('.bulbs').onclick = e => { const b = e.target.closest('.bulb'); if (!b) return; const i = +b.dataset.i; on[i] ^= 1; b.classList.toggle('on', !!on[i]); b.querySelector('.bit').textContent = on[i]; sfx.tap(); host.querySelector('.bsum b').textContent = sum(); };
    host.querySelector('.checkbtn').onclick = () => { const r = ctx.submit(sum()); if (!r.ok) wiggle(host.querySelector('.bulbs')); };
    if (!act.data.showSum) host.querySelector('.bsum').classList.add('hide');
    return { hint() { host.querySelector('.bsum').classList.remove('hide'); } };
  }
};
