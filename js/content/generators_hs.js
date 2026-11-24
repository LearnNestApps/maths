// Grades 9–12 (Achievers) and adult brush-up: algebra, geometry and trigonometry, statistics and
// probability, calculus, finance, matrices. Pictures and "tap the graph" wherever they help.
import { rnd, pick, shuffle } from '../core/ui.js';
import { money, U } from '../core/region.js';

const E = s => `<span class="expr">${s}</span>`;
const r2 = x => Math.round(x * 100) / 100;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const sg = (v, first = false) => v < 0 ? (first ? '−' : '− ') + -v : (first ? '' : '+ ') + v;            // "+ 3" / "− 3"
const term = (c, v, first = false) => c === 0 ? '' : `${c < 0 ? (first ? '−' : '− ') : (first ? '' : '+ ')}${Math.abs(c) === 1 && v ? '' : Math.abs(c)}${v}`;
const poly = (...ts) => ts.map(([c, v], i) => term(c, v, i === 0 || ts.slice(0, i).every(([cc]) => cc === 0))).filter(Boolean).join(' ') || '0';
const bracket = p => p === 0 ? 'x' : `(x ${sg(p)})`;
const NP = (prompt, answer, expr, hint, solution, data = {}) => ({ template: 'numpad', prompt, answer, data: { expr: expr ? E(expr) : '', ...data }, hint, solution: [].concat(solution) });
function MC(prompt, right, wrongs, hint, solution, data = {}) {
  const opts = shuffle([String(right), ...[...new Set(wrongs.map(String))].filter(w => w !== String(right)).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(String(right)), data: { options: opts, ...data }, hint, solution: [].concat(solution) };
}
const TG = (prompt, curves, targets, hint, solution, R = 6) => ({ template: 'tapgraph', prompt, answer: targets[0], data: { curves, targets, R }, hint, solution: [].concat(solution),
  check: v => Array.isArray(v) && targets.some(([x, y]) => x === v[0] && y === v[1]) });
const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const sub = n => String(n).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'['0123456789'.indexOf(c)]).join('');
const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] || (c === '-' ? '⁻' : c)).join('');

export const GEN_HS = {
  // ================= Algebra =================
  indices() {
    const k = pick(['mul', 'div', 'pow', 'zero', 'neg', 'frac']), a = pick(['x', 'a', 'y']), m = rnd(2, 9), n = rnd(2, 7);
    if (k === 'mul') return NP(`Simplify ${E(`${a}${sup(m)} × ${a}${sup(n)} = ${a}^?`)} What is the power?`, m + n, '', 'Multiplying: add the powers.', [`${m} + ${n} = ${m + n}`, `${a}${sup(m + n)}`]);
    if (k === 'div') { const M = m + n; return NP(`Simplify ${E(`${a}${sup(M)} ÷ ${a}${sup(n)} = ${a}^?`)} What is the power?`, m, '', 'Dividing: take away the powers.', [`${M} − ${n} = ${m}`, `${a}${sup(m)}`]); }
    if (k === 'pow') return NP(`Simplify ${E(`(${a}${sup(m)})${sup(n)} = ${a}^?`)} What is the power?`, m * n, '', 'A power of a power: multiply the powers.', [`${m} × ${n} = ${m * n}`]);
    if (k === 'zero') { const b = rnd(2, 99); return NP(`What is ${E(`${b}⁰`)}?`, 1, '', 'Anything (except 0) to the power 0 is 1.', [`${b}⁰ = 1`]); }
    if (k === 'neg') { const b = pick([2, 3, 4, 5, 10]), p = b === 10 ? rnd(1, 3) : rnd(1, 3); return MC(`What is ${E(`${b}${sup(-p)}`)}?`, `1/${b ** p}`, [`−${b ** p}`, `${-b * p}`, `1/${b * p}`], 'A negative power means "one over".', [`${b}${sup(-p)} = 1/${b}${sup(p)} = 1/${b ** p}`]); }
    const [b, r, p] = pick([[8, 3, 2], [27, 3, 2], [16, 4, 3], [16, 2, 3], [25, 2, 3], [64, 3, 2], [32, 5, 2], [81, 4, 3], [9, 2, 3], [4, 2, 3]]), root = Math.round(b ** (1 / r));
    return NP(`What is ${E(`${b}^(${p}/${r})`)}?`, root ** p, '', 'The bottom of the fraction is a root, the top is a power.', [`${r === 2 ? '√' : r === 3 ? '∛' : r + 'th root of '}${b} = ${root}`, `${root}${sup(p)} = ${root ** p}`]);
  },
  surds() {
    const k = pick(['simp', 'add', 'mul', 'rat']);
    const sq = pick([4, 9, 16, 25, 36, 49]), m = pick([2, 3, 5, 6, 7]), s = Math.sqrt(sq);
    if (k === 'simp') return MC(`Simplify ${E(`√${sq * m}`)}`, `${s}√${m}`, [`${m}√${s}`, `${s * m}√1`, `${sq}√${m}`, `√${s + m}`], `Find a square number that divides ${sq * m}.`, [`${sq * m} = ${sq} × ${m}`, `√${sq * m} = √${sq} × √${m} = ${s}√${m}`]);
    if (k === 'add') { const a = rnd(1, 5), b = rnd(1, 5); return MC(`Simplify ${E(`${a}√${m} + ${b}√${m}`)}`, `${a + b}√${m}`, [`${a + b}√${2 * m}`, `${a * b}√${m}`, `${a + b}√${m * m}`], 'Like surds add like terms: like 2x + 3x.', [`${a}√${m} + ${b}√${m} = ${a + b}√${m}`]); }
    if (k === 'mul') { const a = rnd(2, 5), b = rnd(2, 5); return NP(`Work out ${E(`${a}√${m} × ${b}√${m}`)}`, a * b * m, '', '√m × √m = m.', [`${a} × ${b} = ${a * b}`, `√${m} × √${m} = ${m}`, `${a * b} × ${m} = ${a * b * m}`]); }
    const a = rnd(2, 9); return MC(`Rationalise the denominator: ${E(`${a}/√${m}`)}`, gcd(a, m) === m ? `${a / m}√${m}` : `${a}√${m}/${m}`, [`${a}√${m}`, `${a}/${m}`, `√${m}/${a}`], `Multiply top and bottom by √${m}.`, [`${a}/√${m} × √${m}/√${m} = ${a}√${m}/${m}`]);
  },
  quadFactor() {
    let p = rnd(-7, 7), q = rnd(-7, 7); if (!p) p = 3; if (!q) q = -2;
    const b = p + q, c = p * q, Q = poly([1, 'x²'], [b, 'x'], [c, '']), ans = `${bracket(p)}${bracket(q)}`;
    // Wrong options: (x + u)(x + v) with a different pair {u, v}, so none is secretly also right.
    const key = (u, v) => [u, v].sort((m, n) => m - n).join(','), seen = new Set([key(p, q)]), wrong = [];
    for (const [u, v] of [[-p, -q], [p, -q], [-p, q], [c, 1], [b || 1, c], [p + 1, q - 1]]) { if (!u || !v || seen.has(key(u, v))) continue; seen.add(key(u, v)); wrong.push(`${bracket(u)}${bracket(v)}`); }
    return MC(`Factorise ${E(Q)}`, ans, wrong, `Find two numbers that multiply to ${c} and add to ${b}.`, [`${p} × ${q} = ${c} and ${p} + ${q} = ${b}`, `${Q} = ${ans}`]);
  },
  quadSolve() {
    let p = rnd(-7, 7), q = rnd(-7, 7); if (p === q) q = p + 2;
    const Q = poly([1, 'x²'], [-(p + q), 'x'], [p * q, '']), [lo, hi] = [Math.min(p, q), Math.max(p, q)], ans = `x = ${lo} or x = ${hi}`;
    return MC(`Solve ${E(`${Q} = 0`)}`, ans, [`x = ${-hi} or x = ${-lo}`, `x = ${lo} or x = ${-hi}`, `x = ${p * q} or x = ${p + q}`], 'Factorise, then each bracket can be 0.', [`${Q} = ${bracket(-p)}${bracket(-q)}`, `${bracket(-p)} = 0 → x = ${p}`, `${bracket(-q)} = 0 → x = ${q}`]);
  },
  quadRoots() {
    let p = rnd(-5, 2), q = p + rnd(2, 5); if (q > 5) q = 5;
    const fn = `(x-(${p}))*(x-(${q}))`, lab = `y = ${bracket(-p)}${bracket(-q)}`, left = Math.random() < .5;
    return TG(`Tap where the curve crosses the x-axis on the ${left ? 'left' : 'right'}.`, [{ fn: `(${fn})/2`, label: lab.replace('y = ', 'y = ½') }], [[left ? p : q, 0]], 'The curve crosses the x-axis where y = 0: when one bracket is 0.', [`${bracket(-p)} = 0 → x = ${p}`, `${bracket(-q)} = 0 → x = ${q}`]);
  },
  vertex() {
    const h = rnd(-4, 4), k = rnd(-4, 3);
    if (Math.random() < .5) return TG(`Tap the turning point (lowest point) of ${E(`y = ${bracket(-h)}² ${sg(k)}`)}`, [{ fn: `(x-(${h}))**2+(${k})`, label: `y = ${bracket(-h)}² ${sg(k)}` }], [[h, k]], 'In y = (x − h)² + k the turning point is (h, k).', [`Turning point: (${h}, ${k})`]);
    const b = 2 * rnd(-5, 5) || 4, c = rnd(-9, 9), hh = b / 2, kk = c - hh * hh, ans = `${bracket(hh)}² ${sg(kk)}`;
    return MC(`Complete the square: ${E(poly([1, 'x²'], [b, 'x'], [c, '']))}`, ans, [`${bracket(hh)}² ${sg(c + hh * hh)}`, `${bracket(b)}² ${sg(c - b * b)}`, `${bracket(-hh)}² ${sg(kk)}`], `Halve the x-coefficient: (x ${sg(hh)})², then fix the number.`, [`${bracket(hh)}² = ${poly([1, 'x²'], [b, 'x'], [hh * hh, ''])}`, `so take away ${hh * hh}: ${ans}`]);
  },
  quadFormula() {
    const a = rnd(1, 4), b = rnd(-9, 9), c = rnd(-9, 9), D = b * b - 4 * a * c, Q = poly([a, 'x²'], [b, 'x'], [c, '']);
    if (Math.random() < .5) return NP(`For ${E(`${Q} = 0`)}, what is the discriminant ${E('b² − 4ac')}?`, D, '', `a = ${a}, b = ${b}, c = ${c}.`, [`${b}² − 4 × ${a} × ${c} = ${b * b} − ${4 * a * c} = ${D}`], { neg: true });
    const ans = D > 0 ? '2 real roots' : D === 0 ? '1 real root (repeated)' : 'No real roots';
    return MC(`How many real solutions does ${E(`${Q} = 0`)} have?`, ans, ['2 real roots', '1 real root (repeated)', 'No real roots'].filter(x => x !== ans), 'Work out b² − 4ac: positive → 2, zero → 1, negative → none.', [`b² − 4ac = ${D}`, ans]);
  },
  simultaneous() {
    const x = rnd(-5, 6), y = rnd(-5, 6), a = rnd(1, 4), b = rnd(1, 4), c = rnd(1, 4), d = -rnd(1, 4);
    const e1 = `${poly([a, 'x'], [b, 'y'])} = ${a * x + b * y}`, e2 = `${poly([c, 'x'], [d, 'y'])} = ${c * x + d * y}`;
    if (a * d - b * c === 0) return GEN_HS.simultaneous();
    const askX = Math.random() < .5;
    return NP(`Solve the simultaneous equations. What is ${askX ? 'x' : 'y'}?<br>${E(e1)}<br>${E(e2)}`, askX ? x : y, '', 'Make one letter match in both equations, then add or subtract to get rid of it.', [`x = ${x}, y = ${y}`, `Check: ${a}(${x}) ${sg(b)}(${y}) = ${a * x + b * y}`], { neg: true });
  },
  simulGraph() {
    const x = rnd(-3, 3), y = rnd(-3, 3), m1 = pick([1, 2, -1]), m2 = pick([-2, -1, 1, 3].filter(m => m !== m1)), c1 = y - m1 * x, c2 = y - m2 * x;
    const L = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : m}x ${c ? sg(c) : ''}`.trim();
    return TG('Tap where the two lines cross. That point solves both equations.', [{ fn: `${m1}*x+(${c1})`, label: L(m1, c1) }, { fn: `${m2}*x+(${c2})`, label: L(m2, c2) }], [[x, y]], 'Follow both lines until they meet.', [`They meet at (${x}, ${y}): x = ${x}, y = ${y}`]);
  },
  functions() {
    const a = rnd(2, 5), b = rnd(-6, 6), k = pick(['val', 'comp', 'inv']);
    const f = `${a}x ${sg(b)}`, fv = v => a * v + b;
    if (k === 'val') { const v = rnd(-4, 6); return NP(`${E(`f(x) = ${f}`)}. Find ${E(`f(${v})`)}.`, fv(v), '', `Put ${v} in place of x.`, [`${a} × ${v} ${sg(b)} = ${fv(v)}`], { neg: true }); }
    if (k === 'comp') { const c = rnd(1, 4), v = rnd(-3, 4), g = w => w * w + c; return NP(`${E(`f(x) = ${f}`)} and ${E(`g(x) = x² ${sg(c)}`)}. Find ${E(`fg(${v})`)}.`, fv(g(v)), '', 'Work from the inside out: do g first, then f.', [`g(${v}) = ${v * v} ${sg(c)} = ${g(v)}`, `f(${g(v)}) = ${a} × ${g(v)} ${sg(b)} = ${fv(g(v))}`], { neg: true }); }
    const y = rnd(-3, 6) * a + b, x = (y - b) / a;
    return NP(`${E(`f(x) = ${f}`)}. Find ${E(`f⁻¹(${y})`)}.`, x, '', `The inverse undoes f: which x gives f(x) = ${y}?`, [`${a}x ${sg(b)} = ${y}`, `x = (${y} ${sg(-b)}) ÷ ${a} = ${x}`], { neg: true });
  },
  sequences() {
    const k = pick(['nth', 'term', 'sum', 'geo']), d = rnd(2, 9) * pick([1, 1, -1]), a = rnd(-5, 12);
    const seq = n => a + (n - 1) * d, list = [1, 2, 3, 4].map(seq).join(', ');
    if (k === 'nth') { const c = a - d, ans = `${d}n ${c ? sg(c) : ''}`.trim(); return MC(`Find the nth term of ${list}, …`, ans, [`${a}n ${sg(d)}`, `${d}n ${sg(a)}`, `n ${sg(d)}`].filter(x => x !== ans), `It goes up by ${d} each time, so it starts "${d}n".`, [`Difference ${d} → ${d}n`, `First term: ${d} × 1 ${c ? sg(c) : ''} = ${a}`, ans]); }
    if (k === 'term') { const n = rnd(10, 40); return NP(`What is the ${n}th term of ${list}, …?`, seq(n), '', 'nth term = first term + (n − 1) × difference.', [`${a} + ${n - 1} × ${d} = ${seq(n)}`], { neg: true }); }
    if (k === 'sum') { const n = rnd(5, 20), S = n * (2 * a + (n - 1) * d) / 2; return NP(`Find the sum of the first ${n} terms of ${list}, …`, S, '', 'Sum = n/2 × (2 × first term + (n − 1) × difference).', [`${n}/2 × (2 × ${a} + ${n - 1} × ${d}) = ${S}`], { neg: true }); }
    const g0 = rnd(1, 5), r = pick([2, 3, -2]), n = rnd(4, 7), G = i => g0 * r ** (i - 1);
    return NP(`${[1, 2, 3, 4].map(G).join(', ')}, … is a geometric sequence. What is term ${n}?`, G(n), '', `Each term is ×${r}.`, [`${g0} × ${r}${sup(n - 1)} = ${G(n)}`], { neg: true });
  },
  exponential() {
    const k = pick(['double', 'grow', 'decay', 'half']);
    if (k === 'double') { const s = pick([50, 100, 200, 300]), h = pick([2, 3, 4]), n = rnd(2, 4); return NP(`Bacteria double every ${h} hours. There are ${s} now. How many after ${h * n} hours?`, s * 2 ** n, '', `${h * n} hours is ${n} doublings.`, [`${s} × 2${sup(n)} = ${s * 2 ** n}`]); }
    if (k === 'half') { const s = pick([800, 1600, 640]), h = pick([5, 8, 10]), n = rnd(2, 4); return NP(`A substance halves every ${h} days. Start: ${s} g. How much is left after ${h * n} days (g)?`, s / 2 ** n, '', `${n} halvings.`, [`${s} ÷ 2${sup(n)} = ${s / 2 ** n} g`], { dot: true }); }
    const P = pick([1000, 2000, 5000]), r = pick([10, 20]), n = 2, up = k === 'grow', f = up ? 1 + r / 100 : 1 - r / 100, v = r2(P * f ** n);
    return NP(`A town of ${P} people ${up ? 'grows' : 'shrinks'} by ${r}% a year. How many people after ${n} years?`, v, '', `Each year multiply by ${f}.`, [`${P} × ${f}² = ${v}`], { dot: true });
  },
  logs() {
    const k = pick(['basic', 'solve', 'rules']), b = pick([2, 3, 5, 10]), e = rnd(1, b === 2 ? 7 : 4);
    if (k === 'basic') return NP(`What is ${E(`log${b === 10 ? '' : sub(b)} ${b ** e}`)}?`, e, '', `${b} to what power gives ${b ** e}?`, [`${b}${sup(e)} = ${b ** e}`, `so the log is ${e}`]);
    if (k === 'solve') return NP(`Solve ${E(`${b}ˣ = ${b ** e}`)}`, e, '', 'Write the number as a power of ' + b + '.', [`${b ** e} = ${b}${sup(e)}`, `x = ${e}`]);
    const p = rnd(1, 4), q = rnd(1, 3); return NP(`Work out ${E(`log₂ ${2 ** p} + log₂ ${2 ** q}`)}`, p + q, '', 'log a + log b = log(ab).', [`log₂ (${2 ** p} × ${2 ** q}) = log₂ ${2 ** (p + q)} = ${p + q}`]);
  },
  binomial() {
    const n = rnd(3, 7), k = rnd(1, n - 1);
    if (Math.random() < .5) return NP(`What is the coefficient of ${E(k === 1 ? "x" : `x${sup(k)}`)} in ${E(`(1 + x)${sup(n)}`)}?`, C(n, k), '', `Use Pascal's triangle, row ${n}, or ⁿCᵣ.`, [`${n}C${k} = ${C(n, k)}`]);
    const a = rnd(2, 3); return NP(`What is the coefficient of ${E(k === 1 ? "x" : `x${sup(k)}`)} in ${E(`(1 + ${a}x)${sup(n)}`)}?`, C(n, k) * a ** k, '', `The term is ${n}C${k} × (${a}x)${sup(k)}.`, [`${n}C${k} × ${a}${sup(k)} = ${C(n, k)} × ${a ** k} = ${C(n, k) * a ** k}`]);
  },
  rearrange() {
    const f = pick([
      ['v = u + at', 't', 't = (v − u)/a', ['t = v − u − a', 't = (v + u)/a', 't = a(v − u)']],
      ['A = πr²', 'r', 'r = √(A/π)', ['r = A/(2π)', 'r = √A − π', 'r = (A/π)²']],
      ['y = mx + c', 'x', 'x = (y − c)/m', ['x = y − c − m', 'x = (y + c)/m', 'x = m(y − c)']],
      ['P = 2(l + w)', 'w', 'w = P/2 − l', ['w = P − 2l', 'w = 2P − l', 'w = (P − l)/2']],
      ['F = 9C/5 + 32', 'C', 'C = 5(F − 32)/9', ['C = 9(F − 32)/5', 'C = 5F/9 − 32', 'C = (F + 32) × 5/9']],
      ['s = d/t', 'd', 'd = st', ['d = s/t', 'd = t/s', 'd = s + t']],
      ['E = ½mv²', 'v', 'v = √(2E/m)', ['v = 2E/m', 'v = √(E/2m)', 'v = (2E/m)²']]
    ]);
    return MC(`Make ${E(f[1])} the subject of ${E(f[0])}`, f[2], f[3], 'Undo each operation in reverse order, doing the same to both sides.', [`${f[0]} → ${f[2]}`]);
  },
  algFrac() {
    const k = pick(['diff', 'fact', 'add']), p = rnd(1, 9), q = rnd(1, 6);
    if (k === 'diff') return MC(`Simplify ${E(`(x² − ${p * p}) / (x + ${p})`)}`, `x − ${p}`, [`x + ${p}`, `x − ${p * p}`, `x² − ${p}`], 'x² − a² = (x − a)(x + a).', [`(x − ${p})(x + ${p}) / (x + ${p}) = x − ${p}`]);
    if (k === 'fact') return MC(`Simplify ${E(`(x² ${sg(p + q)}x ${sg(p * q)}) / (x ${sg(p)})`)}`, `x ${sg(q)}`, [`x ${sg(p)}`, `x ${sg(p * q)}`, `x ${sg(p + q)}`], 'Factorise the top first.', [`(x ${sg(p)})(x ${sg(q)}) / (x ${sg(p)}) = x ${sg(q)}`]);
    return MC(`Write as one fraction: ${E(`1/x + 1/(x + ${p})`)}`, `(2x + ${p}) / (x(x + ${p}))`, [`2 / (2x + ${p})`, `(x + ${p + 1}) / (x(x + ${p}))`, `2 / (x(x + ${p}))`], 'Use the common denominator x(x + ' + p + ').', [`(x + ${p}) / (x(x + ${p})) + x / (x(x + ${p}))`, `= (2x + ${p}) / (x(x + ${p}))`]);
  },
  lineEq() {
    const m = pick([-3, -2, -1, 1, 2, 3, 4]), c = rnd(-5, 5), x1 = rnd(-4, 1), x2 = x1 + rnd(1, 4), y1 = m * x1 + c, y2 = m * x2 + c, k = pick(['grad', 'eq', 'perp']);
    const L = (mm, cc) => `y = ${mm === 1 ? '' : mm === -1 ? '−' : mm}x ${cc ? sg(cc) : ''}`.trim();
    if (k === 'grad') return NP(`Find the gradient of the line through ${E(`(${x1}, ${y1})`)} and ${E(`(${x2}, ${y2})`)}.`, m, '', 'Gradient = change in y ÷ change in x.', [`(${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${y2 - y1} ÷ ${x2 - x1} = ${m}`], { neg: true });
    if (k === 'eq') return MC(`Which is the equation of the line through ${E(`(${x1}, ${y1})`)} and ${E(`(${x2}, ${y2})`)}?`, L(m, c), [L(-m, c), L(m, -c), L(c || 1, m)], 'Find the gradient m, then put one point into y = mx + c.', [`m = ${m}`, `${y1} = ${m} × ${x1} + c → c = ${c}`, L(m, c)]);
    const ans = frac(-1, m); return MC(`A line has gradient ${m}. What is the gradient of a line perpendicular to it?`, ans, [String(m), String(-m), frac(1, m)], 'Perpendicular gradients multiply to −1.', [`${m} × ${ans} = −1`]);
  },
  polyRem() {
    const a = rnd(1, 3), b = rnd(-5, 5), c = rnd(-6, 6), d = rnd(-9, 9), r = rnd(-3, 3), f = x => a * x ** 3 + b * x ** 2 + c * x + d, P = poly([a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']);
    if (Math.random() < .5) return NP(`Find the remainder when ${E(P)} is divided by ${E(`(x ${sg(-r)})`)}`, f(r), '', `Remainder theorem: put x = ${r} into the polynomial.`, [`f(${r}) = ${f(r)}`], { neg: true });
    const p = rnd(-3, 3) || 2, q = rnd(-4, 4), s = rnd(-4, 4), g = x => (x - p) * (x * x + q * x + s), G = poly([1, 'x³'], [q - p, 'x²'], [s - p * q, 'x'], [-p * s, '']);
    const wrong = [-p, p + 1, p - 1, p + 2, p - 2, -p + 1].filter(v => v !== p && g(v) !== 0).slice(0, 3).map(v => `(x ${sg(-v)})`);
    return MC(`Which of these is a factor of ${E(G)}?`, `(x ${sg(-p)})`, wrong, 'Factor theorem: (x − a) is a factor if f(a) = 0.', [`f(${p}) = ${g(p)} → (x ${sg(-p)}) is a factor`]);
  }
};
