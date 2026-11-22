// Question generators. Each returns one activity:
// { template, prompt, say?, answer, check?(v), data, hint, solution: [lines] }
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { t, timeText } from '../core/i18n.js';
import { sameExpr, termCount, pretty } from './expr.js';

const NAMES = ['Riya', 'Aarav', 'Sana', 'Kabir', 'Meera', 'Arjun', 'Ira', 'Vihaan'];
const E = s => `<span class="expr">${s}</span>`;
const two = () => shuffle(NAMES).slice(0, 2);

// MCQ helper: wraps a numeric question as four options.
function mcq(stem, ans, lo, hi, extra = {}) {
  const opts = choices(ans, 4, lo, hi);
  return { template: 'mcq', prompt: stem, answer: opts.indexOf(ans), data: { options: opts.map(String) }, ...extra };
}

export const GEN = {
  // ---------- Little Learners ----------
  countTap({ max = 5 } = {}) {
    const n = rnd(2, max), thing = pick(['apples', 'stars', 'balloons']);
    return { template: 'tap', prompt: t('q.tapCount', { n, thing: t('thing.' + thing) }), answer: n,
      data: { n, thing, total: Math.min(12, n + rnd(1, 3)) }, hint: t('h.countSlow'),
      solution: [Array.from({ length: n }, (_, i) => i + 1).join(', ') + ' ✓'] };
  },
  shapeMatch({ pool = ['circle', 'square', 'triangle', 'star'] } = {}) {
    const target = pick(pool), opts = shuffle([target, ...shuffle(pool.filter(s => s !== target)).slice(0, 2)]);
    return { template: 'drag', prompt: t('q.findShape', { shape: t('shape.' + target) }), answer: target, data: { target, options: opts },
      hint: t('h.shapeLook'), solution: [t('shape.' + target)] };
  },
  balanceBlocks({ max = 6 } = {}) {
    const L = rnd(1, max);
    return { template: 'balance', prompt: t('q.balance'), answer: L, data: { left: L, options: choices(L, 3, 1, 9) }, hint: t('h.balance'),
      solution: [`${L} = ${L}`] };
  },
  abacusShow({ max = 99 } = {}) {
    const n = rnd(max > 20 ? 11 : 1, max), rods = max > 99 ? 3 : max > 9 ? 2 : 1;
    const digits = String(n).padStart(rods, '0').split('').map(Number);
    return { template: 'abacus', prompt: t('q.abacus', { n }), answer: n, data: { target: n, rods }, hint: t('h.abacus'),
      solution: digits.map((d, i) => `${['', 'Hundreds', 'Tens', 'Ones'].slice(-rods)[i] || ''}: ${d} = ${d >= 5 ? '5 + ' + (d - 5) : d}`) };
  },
  clockShow({ half = false } = {}) {
    const hr = rnd(1, 12), m = half && Math.random() < .5 ? 30 : 0;
    return { template: 'clock', prompt: t('q.clock', { time: timeText(hr, m) }), answer: `${hr}:${m}`, data: { h: hr, m, half },
      check: v => v === `${hr}:${m}`, hint: t('h.clock'), solution: [`${hr}:${String(m).padStart(2, '0')}`] };
  },

  // ---------- Explorers ----------
  add2({ carry = true } = {}) {
    let a, b; do { a = rnd(12, 89); b = rnd(11, 99 - a); } while (carry && (a % 10) + (b % 10) < 10 && Math.random() < .8);
    const ones = (a % 10) + (b % 10);
    return { template: 'numpad', prompt: t('q.calc'), answer: a + b, data: { expr: E(`${a} + ${b} = ?`) }, say: `${a} + ${b}`, hint: t('h.carry'),
      solution: [`${a % 10} + ${b % 10} = ${ones}${ones >= 10 ? ' → write ' + (ones % 10) + ', carry 1' : ''}`, `${Math.floor(a / 10)} + ${Math.floor(b / 10)}${ones >= 10 ? ' + 1' : ''} = ${Math.floor(a / 10) + Math.floor(b / 10) + (ones >= 10 ? 1 : 0)}`, `${a} + ${b} = ${a + b}`] };
  },
  numlinePlace({ min = 0, max = 20, step = 1 } = {}) {
    const n = min + step * rnd(1, Math.round((max - min) / step) - 1);
    return { template: 'numline', prompt: t('q.numline', { n }), answer: n, data: { min, max, step }, hint: t('h.numline'), solution: [`${min} → ${n}`] };
  },
  fracCompare() {
    let a, b, c, d; do { b = rnd(2, 8); d = rnd(2, 8); a = rnd(1, b - 1); c = rnd(1, d - 1); } while (a * d === b * c);
    const big = a / b > c / d ? 0 : 1;
    return { template: 'mcq', prompt: t('q.bigger'), answer: big, data: { options: [`${a}/${b}`, `${c}/${d}`], fractions: true }, hint: t('h.fraction'),
      solution: [`${a}/${b} = ${(a / b).toFixed(2)}`, `${c}/${d} = ${(c / d).toFixed(2)}`, `${big ? c + '/' + d : a + '/' + b} >`] };
  },
  barPartWhole() {
    const w = rnd(24, 95), a = rnd(8, w - 8), [name] = two();
    return { template: 'bar', prompt: t('q.bar', { name, w, a }), answer: w - a, data: { kind: 'pw', whole: w, parts: [a, '?'] }, hint: t('h.bar'),
      solution: [`${w} − ${a} = ${w - a}`] };
  },
  barCompare() {
    const a = rnd(12, 60), b = rnd(5, 30), [name, name2] = two();
    return { template: 'bar', prompt: t('q.bar2', { name, name2, a, b }), answer: a + b, data: { kind: 'cmp', a, b, name, name2 }, hint: t('h.bar'),
      solution: [`${a} + ${b} = ${a + b}`] };
  },
  seriesNext({ hard = false } = {}) {
    const kind = pick(hard ? ['arith', 'geo', 'sq', 'alt', 'fib'] : ['arith', 'arith', 'geo', 'alt']);
    let s = [];
    if (kind === 'arith') { const a = rnd(1, 20), d = rnd(2, 9) * pick([1, 1, -1]); const st = d < 0 ? a + 60 : a; s = [0, 1, 2, 3, 4].map(i => st + d * i); }
    if (kind === 'geo') { const a = rnd(1, 5), r = pick([2, 3]); s = [0, 1, 2, 3, 4].map(i => a * r ** i); }
    if (kind === 'sq') { const a = rnd(1, 6); s = [0, 1, 2, 3, 4].map(i => (a + i) ** 2); }
    if (kind === 'alt') { const a = rnd(1, 10), p = rnd(2, 6), q = rnd(1, 4); s = [a]; for (let i = 1; i < 5; i++) s.push(s[i - 1] + (i % 2 ? p : -q)); }
    if (kind === 'fib') { s = [rnd(1, 3), rnd(2, 5)]; while (s.length < 5) s.push(s[s.length - 1] + s[s.length - 2]); }
    const ans = s[4], shown = s.slice(0, 4);
    return mcq(`${t('q.next')} ${E(shown.join(', ') + ', ?')}`, ans, Math.max(0, ans - 12), ans + 12, { hint: t('h.series'), solution: [shown.join(' → ') + ' → ' + ans] });
  },
  oddOneOut() {
    const kind = pick(['even', 'mult5', 'square']);
    let good, bad;
    if (kind === 'even') { good = shuffle([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]).slice(0, 3); bad = pick([3, 7, 9, 11, 13, 15, 21]); }
    if (kind === 'mult5') { good = shuffle([5, 10, 15, 20, 25, 30, 35, 40, 45]).slice(0, 3); bad = pick([12, 18, 22, 27, 33, 41]); }
    if (kind === 'square') { good = shuffle([4, 9, 16, 25, 36, 49, 64, 81]).slice(0, 3); bad = pick([12, 18, 20, 30, 45, 50]); }
    const opts = shuffle([...good, bad]);
    return { template: 'mcq', prompt: 'Which is the odd one out?', answer: opts.indexOf(bad), data: { options: opts.map(String) }, hint: t('h.series'),
      solution: [`${good.join(', ')}: ${kind === 'even' ? 'even numbers' : kind === 'mult5' ? 'multiples of 5' : 'square numbers'}`, `${bad} is different`] };
  },
  mulFact({ tables = [2, 3, 4, 5, 6, 7, 8, 9, 10] } = {}) { const a = pick(tables), b = rnd(2, 10); return { q: `${a} × ${b}`, answer: a * b }; },
  mul11() { const n = rnd(12, 99); return { q: `${n} × 11`, answer: n * 11 }; },
  mulDrill({ gen = 'mulFact', params = {}, seconds = 60 } = {}) {
    return { template: 'drill', prompt: t('q.calc'), data: { gen, params, seconds } };
  },

  // ---------- Vedic maths ----------
  sq5({ max = 9 } = {}) {
    const d = rnd(1, max), n = d * 10 + 5;
    return { template: 'steps', prompt: `${E(n + '²')}`, answer: n * n, say: `${n} squared`,
      data: { steps: [{ html: `${d} × (${d} + 1) = ?`, answer: d * (d + 1) }, { html: `${d * (d + 1)} | 25 → ${n}² = ?`, answer: n * n }] },
      hint: 'Ekadhikena Purvena: multiply the first digit by one more than itself, then write 25.', solution: [`${d} × ${d + 1} = ${d * (d + 1)}`, `${d * (d + 1)}25`] };
  },
  urdhva2() {
    const a = rnd(11, 49), b = rnd(11, 49), a1 = Math.floor(a / 10), a0 = a % 10, b1 = Math.floor(b / 10), b0 = b % 10;
    const r = a0 * b0, c = a1 * b0 + a0 * b1, l = a1 * b1;
    return { template: 'steps', prompt: E(`${a} × ${b}`), answer: a * b,
      data: { steps: [
        { html: `<b>Vertical (right)</b>: ${a0} × ${b0} = ?`, answer: r },
        { html: `<b>Crosswise</b>: ${a1} × ${b0} + ${a0} × ${b1} = ?`, answer: c },
        { html: `<b>Vertical (left)</b>: ${a1} × ${b1} = ?`, answer: l },
        { html: `${l} | ${c} | ${r} → carry from right to left → ${a} × ${b} = ?`, answer: a * b }] },
      hint: 'Urdhva-Tiryagbhyam: right column, then the cross, then the left column. Keep one digit in each place and carry the rest left.',
      solution: [`${a0}×${b0} = ${r}`, `${a1}×${b0} + ${a0}×${b1} = ${c}`, `${a1}×${b1} = ${l}`, `${l}·100 + ${c}·10 + ${r} = ${a * b}`] };
  },
  nikhilam() {
    const a = rnd(88, 99), b = rnd(88, 99), da = 100 - a, db = 100 - b;
    return { template: 'steps', prompt: E(`${a} × ${b}`), answer: a * b,
      data: { steps: [
        { html: `Deficits from 100: ${a} → ?`, answer: da }, { html: `${b} → ?`, answer: db },
        { html: `Left part: ${a} − ${db} = ?`, answer: a - db }, { html: `Right part: ${da} × ${db} = ? (two digits)`, answer: da * db },
        { html: `${a} × ${b} = ?`, answer: a * b }] },
      hint: 'Nikhilam: subtract each number from 100, cross-subtract for the left part, multiply the deficits for the right part.',
      solution: [`${a - db} | ${String(da * db).padStart(2, '0')}`, `= ${a * b}`] };
  },

  // ---------- Achievers ----------
  linEq() {
    const x = rnd(-6, 9), a = rnd(2, 9), b = rnd(-15, 20), c = a * x + b, bs = b < 0 ? `− ${-b}` : `+ ${b}`;
    return { template: 'numpad', prompt: t('q.solve'), answer: x, data: { expr: E(`${a}x ${bs} = ${c}`), neg: true }, say: `${a} x ${b < 0 ? 'minus' : 'plus'} ${Math.abs(b)} equals ${c}`,
      hint: t('h.eq'), solution: [`${a}x = ${c} ${b < 0 ? '+ ' + -b : '− ' + b} = ${c - b}`, `x = ${c - b} ÷ ${a} = ${x}`] };
  },
  simplifyLike({ hard = false } = {}) {
    let q, ans;
    if (!hard) { const [p, r, s] = [rnd(2, 9), rnd(2, 9), rnd(1, 5)]; q = `${p}x + ${r}x − ${s}x`; ans = `${p + r - s}x`; }
    else { const [p, r, s] = [rnd(2, 5), rnd(1, 6), rnd(1, 3)]; q = `${p}(x + ${r}) − ${s}x`; ans = `${p - s}x + ${p * r}`; }
    return { template: 'mathkb', prompt: t('q.simplify'), answer: ans, data: { expr: E(q) },
      check: v => sameExpr(v, ans) && termCount(v) <= termCount(ans), hint: t('h.like'), solution: [`${pretty(q)} = ${pretty(ans)}`] };
  },
  plotLine() {
    const m = pick([-2, -1, 1, 2, 3]), c = rnd(-3, 3), eq = `y = ${m === 1 ? '' : m === -1 ? '−' : m}x ${c < 0 ? '− ' + -c : c ? '+ ' + c : ''}`.trim();
    return { template: 'graph', prompt: t('q.plot', { eq }), answer: eq, data: { m, c, eq }, check: pts => pts.length === 2 && pts.every(([x, y]) => y === m * x + c),
      hint: t('h.plot'), solution: [`x = 0 → y = ${c}`, `x = 1 → y = ${m + c}`] };
  },

  // ---------- Exams (sample mock) ----------
  mockMini({ exam = 'IMO', klass = 6 } = {}) {
    const asMcq = a => ({ stem: a.prompt + (a.data.expr ? ' ' + a.data.expr : ''), options: a.data.options, answer: a.answer });
    const num = (g) => { const a = GEN[g](); const opts = choices(a.answer, 4, Math.max(0, a.answer - 15), a.answer + 15); return { stem: a.prompt + ' ' + (a.data.expr || ''), options: opts.map(String), answer: opts.indexOf(a.answer) }; };
    const word = () => { const a = GEN.barPartWhole(); const o = choices(a.answer, 4, 1, 99); return { stem: a.prompt, options: o.map(String), answer: o.indexOf(a.answer) }; };
    const money = () => { const p = rnd(3, 9) * 5, q = rnd(2, 5), paid = Math.ceil(p * q / 100) * 100; const ans = paid - p * q, o = choices(ans, 4, 0, paid); return { stem: `A pen costs ₹${p}. You buy ${q} pens and pay ₹${paid}. How much change do you get?`, options: o.map(v => '₹' + v), answer: o.indexOf(ans) }; };
    const hard = () => { const a = GEN.urdhva2(); const o = choices(a.answer, 4, a.answer - 40, a.answer + 40); return { stem: a.prompt, options: o.map(String), answer: o.indexOf(a.answer) }; };
    return { template: 'mock', prompt: `${exam} · Class ${klass}`, data: { title: `${exam} sample mock · Class ${klass}`, minutes: 12, sections: [
      { name: 'Logical Reasoning', marks: 1, qs: [asMcq(GEN.seriesNext({ hard: true })), asMcq(GEN.oddOneOut()), asMcq(GEN.seriesNext())] },
      { name: 'Mathematical Reasoning', marks: 1, qs: [num('add2'), asMcq(GEN.fracCompare()), num('linEq')] },
      { name: 'Everyday Mathematics', marks: 1, qs: [word(), money()] },
      { name: 'Achievers Section', marks: 3, qs: [hard(), hard()] }] } };
  }
};

// Little Learners (JK–Grade 2) generators live in their own file.
import { GEN_LITTLE } from './generators_little.js';
Object.assign(GEN, GEN_LITTLE);
