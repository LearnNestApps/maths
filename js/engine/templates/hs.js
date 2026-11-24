// Tap the graph: curves are drawn on a grid; tap the point that answers the question
// (where lines cross, where a curve meets an axis, its turning point…). Taps snap to whole numbers.
import { h, wiggle, squash } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx } from '../../core/audio.js';
import { ICON } from '../../core/art.js';

const COLORS = ['var(--acc)', '#f76707', '#2f9e44'];   // second and third lines always contrast with the theme colour

export const tapgraph = {
  render(host, act, ctx) {
    const { curves, R = 6, labels = [] } = act.data, U = 34, size = U * (2 * R + 2), o = size / 2;
    const X = x => o + x * U, Y = y => o - y * U;
    let grid = '';
    for (let i = -R; i <= R; i++) {
      grid += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}" class="${i ? 'gl' : 'ax'}"/><line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}" class="${i ? 'gl' : 'ax'}"/>`;
      if (i && i % 2 === 0) grid += `<text x="${X(i)}" y="${Y(0) + 16}" class="gn">${i}</text><text x="${X(0) - 8}" y="${Y(i) + 5}" class="gn" text-anchor="end">${i}</text>`;
    }
    // Curves: sampled finely, broken where they leave the grid.
    const paths = curves.map((c, k) => {
      const f = Function('x', `return ${c.fn};`); let d = '', pen = false;
      for (let x = -R; x <= R + 1e-9; x += .04) {
        const y = f(x);
        if (!isFinite(y) || Math.abs(y) > R + .5) { pen = false; continue; }
        d += `${pen ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`; pen = true;
      }
      return `<path d="${d}" style="stroke:${COLORS[k % 3]}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    }).join('');
    const key = curves.map((c, k) => `<span class="gkey"><i style="background:${COLORS[k % 3]}"></i>${c.label}</span>`).join('');
    host.innerHTML = `<div class="t-graph t-tapgraph"><svg class="gp" viewBox="0 0 ${size} ${size}">${grid}${paths}<g class="hintpts"></g><g class="pts"></g><rect class="hit" width="${size}" height="${size}" fill="transparent"/></svg>
      <div class="gside"><div class="gkeys">${key}</div><div class="coords">${t('tg.tap')}</div><button class="btn primary checkbtn">${ICON.check}<span>${t('ui.check')}</span></button></div></div>`;
    const svg = host.querySelector('svg'), g = host.querySelector('.pts'), coords = host.querySelector('.coords');
    let pt = null;
    svg.addEventListener('click', e => {
      const r = svg.getBoundingClientRect(), s = size / r.width, x = Math.round(((e.clientX - r.left) * s - o) / U), y = Math.round((o - (e.clientY - r.top) * s) / U);
      if (Math.abs(x) > R || Math.abs(y) > R) return;
      pt = [x, y]; sfx.tap();
      g.innerHTML = `<circle cx="${X(x)}" cy="${Y(y)}" r="11" class="pt"/>`; coords.textContent = `(${x}, ${y})`; squash(coords);
    });
    host.querySelector('.checkbtn').addEventListener('click', () => { if (!pt) { wiggle(svg); return; } const r = ctx.submit([...pt]); if (!r.ok) wiggle(svg); });
    return { hint(l) { const [tx, ty] = act.data.targets[0]; host.querySelector('.hintpts').innerHTML = l >= 2 ? `<circle cx="${X(tx)}" cy="${Y(ty)}" r="18" class="hp"/>` : `<line x1="${X(tx)}" y1="${Y(-R)}" x2="${X(tx)}" y2="${Y(R)}" class="hp" stroke-dasharray="6 6"/>`; } };
  }
};
