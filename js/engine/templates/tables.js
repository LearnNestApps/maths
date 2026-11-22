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
