// Multiplication tables, squares and cubes.
import { rnd, pick, shuffle } from '../core/ui.js';

const E = s => `<span class="expr">${s}</span>`;
// n can be a number or a [lo, hi] range (e.g. tables 21–30).
const pickN = n => Array.isArray(n) ? rnd(n[0], n[1]) : n;
const sayTimes = (a, b) => `${a} times ${b}`;
// k rows of n dots, in groups of 5 so they are easy to count.
const dotArray = (k, n) => { const g = 24, gx = j => 14 + j * g + Math.floor(j / 5) * 8; let s = ''; for (let i = 0; i < k; i++) for (let j = 0; j < n; j++) s += `<circle cx="${gx(j)}" cy="${14 + i * g}" r="8" style="fill:var(--acc)"/>`;
  return `<svg viewBox="0 0 ${gx(n - 1) + 16} ${k * g + 6}" class="arr" style="max-width:${Math.min(320, (gx(n - 1) + 16) * 1.1)}px">${s}</svg>`; };

export const GEN_TABLES = {
  tableChart({ n = 2, upto = 10, blanks = 4 } = {}) {
    const N = pickN(n), rows = Array.from({ length: upto }, (_, i) => ({ lhs: `${N} × ${i + 1}`, ans: N * (i + 1) }));
    const b = shuffle([...Array(upto).keys()]).slice(0, Math.min(upto, blanks));
    return { template: 'tablechart', prompt: `Fill in the table of ${N}.`, answer: 'done', data: { rows, blanks: b, title: `Table of ${N}` },
      hint: `Each line is ${N} more than the line before.`, solution: rows.map(r => `${r.lhs} = ${r.ans}`) };
  },
  tableFact({ n = 2, upto = 10 } = {}) {
    const N = pickN(n), k = rnd(2, upto);
    return { template: 'numpad', prompt: 'Work it out.', answer: N * k, data: { expr: E(`${N} × ${k} = ?`) }, say: sayTimes(N, k),
      hint: `Count on in ${N}s, or use ${N} × ${k - 1} = ${N * (k - 1)} and add ${N}.`, solution: [`${N} × ${k} = ${N * k}`] };
  },
  tableMissing({ n = 2, upto = 10 } = {}) {
    const N = pickN(n), k = rnd(2, upto);
    return { template: 'numpad', prompt: 'What is the missing number?', answer: k, data: { expr: E(`${N} × ? = ${N * k}`) }, say: `${N} times what is ${N * k}`,
      hint: `Go down the table of ${N} until you reach ${N * k}.`, solution: [`${N} × ${k} = ${N * k}`, `${N * k} ÷ ${N} = ${k}`] };
  },
  tableDivide({ n = 2, upto = 10 } = {}) {
    const N = pickN(n), k = rnd(2, upto);
    return { template: 'numpad', prompt: 'Work it out.', answer: k, data: { expr: E(`${N * k} ÷ ${N} = ?`) }, say: `${N * k} divided by ${N}`,
      hint: `How many ${N}s make ${N * k}?`, solution: [`${N} × ${k} = ${N * k}`, `so ${N * k} ÷ ${N} = ${k}`] };
  },
  powerChart({ p = 2, from = 1, to = 10, blanks = 4 } = {}) {
    const sym = p === 2 ? '²' : '³', rows = Array.from({ length: to - from + 1 }, (_, i) => { const k = from + i; return { lhs: `${k}${sym}`, ans: k ** p, say: `${k} ${p === 2 ? 'squared' : 'cubed'} is ${k ** p}` }; });
    const b = shuffle([...rows.keys()]).slice(0, Math.min(rows.length, blanks));
    return { template: 'tablechart', prompt: `Fill in the ${p === 2 ? 'squares' : 'cubes'}.`, answer: 'done', data: { rows, blanks: b, title: `${p === 2 ? 'Squares' : 'Cubes'} ${from}–${to}` },
      hint: p === 2 ? 'A square is a number times itself.' : 'A cube is a number times itself, times itself again.', solution: rows.map(r => `${r.lhs} = ${r.ans}`) };
  },
  powerFact({ p = 2, from = 1, to = 30 } = {}) {
    const k = rnd(Math.max(2, from), to), sym = p === 2 ? '²' : '³';
    return { template: 'numpad', prompt: 'Work it out.', answer: k ** p, data: { expr: E(`${k}${sym} = ?`) }, say: `${k} ${p === 2 ? 'squared' : 'cubed'}`,
      hint: p === 2 ? `${k} × ${k}` : `${k} × ${k} × ${k}`, solution: [`${p === 2 ? `${k} × ${k}` : `${k} × ${k} × ${k}`} = ${k ** p}`] };
  },
  rootFact({ p = 2, to = 30 } = {}) {
    const k = rnd(2, to);
    return { template: 'numpad', prompt: 'Work it out.', answer: k, data: { expr: E(`${p === 2 ? '√' : '∛'}${k ** p} = ?`) }, say: `${p === 2 ? 'square' : 'cube'} root of ${k ** p}`,
      hint: `Which number ${p === 2 ? 'times itself' : 'times itself three times'} makes ${k ** p}?`, solution: [`${k}${p === 2 ? '²' : '³'} = ${k ** p}`] };
  },
  // ---- Games ----
  // Frog hops: tap where the frog lands next while it skip-counts.
  tableHop({ n = 2 } = {}) {
    const N = pickN(n), from = rnd(0, 4), hops = 5;
    return { template: 'hop', prompt: `Help the frog count in ${N}s. Tap where it lands next!`, answer: 'done', data: { n: N, from, hops },
      say: `Help the frog count in ${N}s`, hint: `Add ${N} to the number the frog is on.`, solution: [Array.from({ length: hops + 1 }, (_, i) => N * (from + i)).join(' → ')] };
  },
  // Picture fact: an array of dots beside the question.
  tableFactPic({ n = 2, upto = 10 } = {}) {
    const N = pickN(n), k = rnd(2, upto), pic = N <= 12 ? `<div class="efig">${dotArray(k, N)}</div>` : '';
    return { template: 'numpad', prompt: `${k} rows of ${N}. How many altogether?${pic}`, answer: N * k, data: { expr: E(`${k} × ${N} = ?`) }, say: `${k} rows of ${N}. How many altogether?`,
      hint: `Count the rows in ${N}s: ${N}, ${2 * N}, ${3 * N}…`, solution: [`${k} × ${N} = ${N * k}`] };
  },
  // Bubble pop: pop every multiple of n.
  tablePop({ n = 2 } = {}) {
    const N = pickN(n), mult = shuffle(Array.from({ length: 10 }, (_, i) => N * (i + 1))).slice(0, 5), others = new Set();
    while (others.size < 5) { const v = rnd(Math.max(2, N - 3), N * 10 + 3); if (v % N) others.add(v); }
    const bubbles = shuffle([...mult.map(v => ({ v, m: 1 })), ...[...others].map(v => ({ v, m: 0 }))]);
    return { template: 'pop', prompt: `Pop all the numbers in the table of ${N}!`, answer: 'done', data: { n: N, bubbles }, say: `Pop all the numbers in the ${N} times table`,
      hint: `They are the numbers you land on counting in ${N}s.`, solution: [`Multiples of ${N} here: ${mult.sort((a, b) => a - b).join(', ')}`] };
  },
  // Memory match: pair each fact with its answer.
  tableMatch({ n = 2 } = {}) {
    const N = pickN(n), ks = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4);
    const cards = shuffle(ks.flatMap(k => [{ k, face: `${N} × ${k}` }, { k, face: String(N * k) }]));
    return { template: 'match', prompt: 'Find the pairs! Match each fact to its answer.', answer: 'done', data: { cards }, say: 'Find the pairs. Match each fact to its answer.',
      hint: 'Remember where you saw each card.', solution: ks.map(k => `${N} × ${k} = ${N * k}`) };
  },
  tableDrill({ lo = 2, hi = 10, seconds = 60 } = {}) {
    return { template: 'drill', prompt: 'Work it out.', data: { gen: 'mulFact', params: { tables: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i) }, seconds } };
  }
};
