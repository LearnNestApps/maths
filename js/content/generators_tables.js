// Multiplication tables, squares and cubes.
import { rnd, pick, shuffle } from '../core/ui.js';

const E = s => `<span class="expr">${s}</span>`;
// n can be a number or a [lo, hi] range (e.g. tables 21–30).
const pickN = n => Array.isArray(n) ? rnd(n[0], n[1]) : n;
const sayTimes = (a, b) => `${a} times ${b}`;

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
  tableDrill({ lo = 2, hi = 10, seconds = 60 } = {}) {
    return { template: 'drill', prompt: 'Work it out.', data: { gen: 'mulFact', params: { tables: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i) }, seconds } };
  }
};
