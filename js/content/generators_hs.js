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

// ================= Geometry and trigonometry =================
const D2R = Math.PI / 180, r1 = x => Math.round(x * 10) / 10;
const fig = svg => `<div class="efig">${svg}</div>`;
const SVG = (vb, body) => `<svg viewBox="${vb}" class="mfig" role="img">${body}</svg>`;
const TX = (x, y, s, size = 15, anchor = 'middle') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="currentColor" font-weight="800">${s}</text>`;
const SHAPE = 'style="fill:var(--acc);fill-opacity:.18;stroke:currentColor" stroke-width="3" stroke-linejoin="round"';
// Numbers to 1 decimal place: accept anything within 0.1 (rounding at different steps).
const NP1 = (prompt, answer, hint, solution) => ({ template: 'numpad', prompt, answer: r1(answer), data: { expr: '', dot: true }, hint, solution: [].concat(solution),
  check: v => Math.abs(Number(v) - answer) <= 0.1 + 1e-9 });
// Right-angled triangle: right angle bottom-left; labels for the two legs (a vertical, b horizontal), hypotenuse c, angle θ at bottom-right.
function rightTri({ a = '', b = '', c = '', ang = '' } = {}) {
  const A = [30, 20], B = [30, 150], Cc = [230, 150];
  return SVG('-60 0 330 180', `<polygon points="${[A, B, Cc].map(p => p.join(',')).join(' ')}" ${SHAPE}/><path d="M30 136H44V150" stroke="currentColor" stroke-width="2.5" fill="none"/>`
    + (a ? TX(14, 90, a, 15, 'end') : '') + (b ? TX(130, 172, b) : '') + (c ? TX(140, 76, c, 15, 'start') : '')
    + (ang ? `<path d="M200 150A30 30 0 0 0 205 135" stroke="var(--acc)" stroke-width="3" fill="none"/>${TX(188, 142, ang, 14, 'end')}` : ''));
}
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];

Object.assign(GEN_HS, {
  pythag() {
    const [a, b, c] = pick(TRIPLES), u = U('len'), hyp = Math.random() < .5;
    if (hyp) return NP(`Find the hypotenuse (${u}). ${fig(rightTri({ a: `${a} ${u}`, b: `${b} ${u}`, c: '?' }))}`, c, '', 'a² + b² = c²: square, add, square root.', [`${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}`, `√${c * c} = ${c}`]);
    return NP(`Find the missing side (${u}). ${fig(rightTri({ a: '?', b: `${b} ${u}`, c: `${c} ${u}` }))}`, a, '', 'For a shorter side: c² − b².', [`${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}`, `√${a * a} = ${a}`]);
  },
  pythagWord() {
    const [a, b, c] = pick(TRIPLES), u = isUSu() ? 'ft' : 'm', k = pick(['ladder', 'rect', 'walk']);
    if (k === 'ladder') return NP(`A ${c} ${u} ladder leans against a wall. Its foot is ${a} ${u} from the wall. How high up the wall does it reach (${u})?`, b, '', 'The ladder is the hypotenuse.', [`${c}² − ${a}² = ${b * b}`, `√${b * b} = ${b} ${u}`]);
    if (k === 'rect') return NP(`A rectangle is ${a} ${u} by ${b} ${u}. How long is its diagonal (${u})?`, c, '', 'The diagonal makes a right-angled triangle with two sides.', [`${a}² + ${b}² = ${c * c}`, `√${c * c} = ${c} ${u}`]);
    return NP(`Mia walks ${a * 10} ${u} north, then ${b * 10} ${u} east. How far is she from her start in a straight line (${u})?`, c * 10, '', 'North and east are at right angles.', [`${a * 10}² + ${b * 10}² = ${(c * 10) ** 2}`, `√ = ${c * 10} ${u}`]);
  },
  trigSide() {
    const th = pick([25, 30, 35, 40, 50, 55, 60, 65]), H = rnd(5, 20), u = U('len'), k = pick(['opp', 'adj', 'hypFromOpp']);
    if (k === 'opp') return NP1(`Find x to 1 decimal place. ${fig(rightTri({ a: 'x', c: `${H} ${u}`, ang: th + '°' }))}`, H * Math.sin(th * D2R), 'x is opposite the angle; you know the hypotenuse: use SIN.', [`sin ${th}° = x / ${H}`, `x = ${H} × sin ${th}° = ${r1(H * Math.sin(th * D2R))}`]);
    if (k === 'adj') return NP1(`Find x to 1 decimal place. ${fig(rightTri({ b: 'x', c: `${H} ${u}`, ang: th + '°' }))}`, H * Math.cos(th * D2R), 'x is next to the angle; you know the hypotenuse: use COS.', [`cos ${th}° = x / ${H}`, `x = ${H} × cos ${th}° = ${r1(H * Math.cos(th * D2R))}`]);
    return NP1(`Find x to 1 decimal place. ${fig(rightTri({ a: `${H} ${u}`, b: 'x', ang: th + '°' }))}`, H / Math.tan(th * D2R), 'You know the opposite and want the adjacent: use TAN.', [`tan ${th}° = ${H} / x`, `x = ${H} ÷ tan ${th}° = ${r1(H / Math.tan(th * D2R))}`]);
  },
  trigAngle() {
    const a = rnd(3, 12), c = a + rnd(2, 10), b = rnd(3, 15), u = U('len'), k = pick(['sin', 'tan']);
    if (k === 'sin') { const v = Math.asin(a / c) / D2R; return NP(`Find the angle θ to the nearest degree. ${fig(rightTri({ a: `${a} ${u}`, c: `${c} ${u}`, ang: 'θ' }))}`, Math.round(v), '', 'Opposite and hypotenuse: use sin⁻¹.', [`sin θ = ${a}/${c}`, `θ = sin⁻¹(${a}/${c}) = ${r1(v)}° ≈ ${Math.round(v)}°`]); }
    const v = Math.atan(a / b) / D2R; return NP(`Find the angle θ to the nearest degree. ${fig(rightTri({ a: `${a} ${u}`, b: `${b} ${u}`, ang: 'θ' }))}`, Math.round(v), '', 'Opposite and adjacent: use tan⁻¹.', [`tan θ = ${a}/${b}`, `θ = tan⁻¹(${a}/${b}) = ${r1(v)}° ≈ ${Math.round(v)}°`]);
  },
  trigExact() {
    const T = [['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 90°', '1'], ['cos 0°', '1'], ['tan 45°', '1'], ['sin 0°', '0'], ['cos 90°', '0'], ['sin 60°', '√3/2'], ['cos 30°', '√3/2'], ['sin 45°', '√2/2'], ['cos 45°', '√2/2'], ['tan 60°', '√3'], ['tan 30°', '1/√3']];
    const [q, a] = pick(T); return MC(`What is the exact value of ${E(q)}?`, a, shuffle(['1/2', '√3/2', '√2/2', '1', '0', '√3', '1/√3'].filter(x => x !== a)), 'Picture the 30-60-90 and 45-45-90 triangles.', [`${q} = ${a}`]);
  },
  sineRule() {
    const A = rnd(35, 75), B = rnd(35, 75), a = rnd(6, 15), b = a * Math.sin(B * D2R) / Math.sin(A * D2R), u = U('len');
    const body = `<polygon points="20,150 250,150 150,25" ${SHAPE}/>${TX(135, 172, '')}${TX(70, 82, `${a} ${u}`, 14, 'end')}${TX(214, 82, 'x', 15, 'start')}${TX(42, 142, B + '°', 13, 'start')}${TX(150, 52, '', 13)}${TX(228, 142, A + '°', 13, 'end')}`;
    return NP1(`Find x to 1 decimal place. ${fig(SVG('0 0 280 180', body))}`, b, 'Sine rule: a / sin A = b / sin B. Each side goes with the angle opposite it.', [`x / sin ${B}° = ${a} / sin ${A}°`, `x = ${a} × sin ${B}° ÷ sin ${A}° = ${r1(b)}`]);
  },
  cosineRule() {
    const b = rnd(5, 14), c = rnd(5, 14), A = rnd(40, 120), a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * D2R)), u = U('len');
    const body = `<polygon points="20,150 250,150 110,30" ${SHAPE}/>${TX(135, 172, `${b} ${u}`)}${TX(56, 86, `${c} ${u}`, 14, 'end')}${TX(190, 86, 'x', 15, 'start')}${TX(44, 142, A + '°', 13, 'start')}`;
    return NP1(`Find x to 1 decimal place. ${fig(SVG('0 0 280 180', body))}`, a, 'Cosine rule: a² = b² + c² − 2bc cos A.', [`x² = ${b}² + ${c}² − 2 × ${b} × ${c} × cos ${A}°`, `x² = ${r1(a * a)}`, `x = ${r1(a)}`]);
  },
  triArea() {
    const a = rnd(4, 15), b = rnd(4, 15), Cg = rnd(30, 140), ar = .5 * a * b * Math.sin(Cg * D2R);
    return NP1(`A triangle has sides ${a} ${U('len')} and ${b} ${U('len')} with ${Cg}° between them. Find its area to 1 decimal place (${U('area')}).`, ar, 'Area = ½ab sin C.', [`½ × ${a} × ${b} × sin ${Cg}° = ${r1(ar)}`]);
  },
  circleThm() {
    const k = pick(['centre', 'semi', 'cyclic', 'tangent', 'segment']);
    const circ = extra => fig(SVG('0 0 220 200', `<circle cx="110" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="110" cy="100" r="4" fill="currentColor"/>${TX(118, 96, 'O', 13, 'start')}${extra}`));
    if (k === 'centre') { const x = rnd(20, 80); return NP(`The angle at the circumference is ${x}°. What is the angle at the centre, standing on the same arc? ${circ(`<path d="M40 140L110 100L180 140M40 140L110 20L180 140" stroke="var(--acc)" stroke-width="2.5" fill="none"/>${TX(110, 44, x + '°', 13)}${TX(110, 124, '?', 15)}`)}`, 2 * x, '', 'The angle at the centre is twice the angle at the circumference.', [`2 × ${x}° = ${2 * x}°`]); }
    if (k === 'semi') { const x = rnd(20, 70); return NP(`AC is a diameter and B is on the circle. Angle A is ${x}°. Find angle C (°). ${circ(`<path d="M30 100H190L80 28Z" stroke="var(--acc)" stroke-width="2.5" fill="none"/>${TX(22, 104, 'A', 13, 'end')}${TX(198, 104, 'C', 13, 'start')}${TX(76, 22, 'B', 13)}${TX(48, 94, x + '°', 12, 'start')}`)}`, 90 - x, '', 'An angle in a semicircle is 90°, so angle B = 90°.', [`Angle B = 90°`, `Angle C = 180 − 90 − ${x} = ${90 - x}°`]); }
    if (k === 'cyclic') { const x = rnd(50, 130); return NP(`ABCD is a cyclic quadrilateral (all corners on the circle). Angle A = ${x}°. What is angle C (°)? ${circ(`<path d="M44 66L150 28L186 128L70 166Z" stroke="var(--acc)" stroke-width="2.5" fill="none"/>${TX(36, 64, 'A', 13, 'end')}${TX(154, 22, 'B', 13, 'start')}${TX(194, 134, 'C', 13, 'start')}${TX(64, 182, 'D', 13, 'end')}${TX(62, 80, x + '°', 12, 'start')}${TX(168, 122, '?', 14, 'end')}`)}`, 180 - x, '', 'Opposite angles in a cyclic quadrilateral add up to 180°.', [`180 − ${x} = ${180 - x}°`]); }
    if (k === 'tangent') { const x = rnd(20, 70); return NP(`A tangent touches a circle at T. A line from the centre O to a point P on the tangent makes angle OPT = ${x}°. Find angle TOP (°).`, 90 - x, '', 'A tangent meets the radius at 90°.', [`Angle OTP = 90°`, `180 − 90 − ${x} = ${90 - x}°`]); }
    const x = rnd(25, 75); return NP(`Two angles stand on the same arc, from different points on the circle. One is ${x}°. What is the other (°)?`, x, '', 'Angles in the same segment are equal.', [`both are ${x}°`]);
  },
  arcSector() {
    const r = rnd(3, 12), th = pick([30, 45, 60, 72, 90, 120, 135, 150]), u = U('len'), arc = Math.random() < .5;
    if (arc) return NP1(`A sector has radius ${r} ${u} and angle ${th}°. Find the arc length to 1 decimal place (${u}).`, th / 360 * 2 * Math.PI * r, 'Arc = (angle/360) × 2πr.', [`${th}/360 × 2 × π × ${r} = ${r1(th / 360 * 2 * Math.PI * r)}`]);
    return NP1(`A sector has radius ${r} ${u} and angle ${th}°. Find its area to 1 decimal place (${U('area')}).`, th / 360 * Math.PI * r * r, 'Sector area = (angle/360) × πr².', [`${th}/360 × π × ${r}² = ${r1(th / 360 * Math.PI * r * r)}`]);
  },
  solids3d() {
    const k = pick(['cone', 'sphere', 'pyramid', 'hemi']), u = U('len'), V = U('vol');
    if (k === 'pyramid') { const s = rnd(2, 10), h = rnd(3, 12) * 3; return NP(`A square-based pyramid has base ${s} ${u} by ${s} ${u} and height ${h} ${u}. Find its volume (${V}).`, s * s * h / 3, '', 'Volume = ⅓ × base area × height.', [`⅓ × ${s * s} × ${h} = ${s * s * h / 3}`]); }
    const r = rnd(2, 9);
    if (k === 'cone') { const h = rnd(3, 15); return NP1(`A cone has radius ${r} ${u} and height ${h} ${u}. Find its volume to 1 decimal place (${V}).`, Math.PI * r * r * h / 3, 'Volume = ⅓πr²h.', [`⅓ × π × ${r}² × ${h} = ${r1(Math.PI * r * r * h / 3)}`]); }
    if (k === 'sphere') return NP1(`A sphere has radius ${r} ${u}. Find its volume to 1 decimal place (${V}).`, 4 / 3 * Math.PI * r ** 3, 'Volume = ⁴⁄₃πr³.', [`⁴⁄₃ × π × ${r}³ = ${r1(4 / 3 * Math.PI * r ** 3)}`]);
    return NP1(`A hemisphere (half a sphere) has radius ${r} ${u}. Find its volume to 1 decimal place (${V}).`, 2 / 3 * Math.PI * r ** 3, 'Half of ⁴⁄₃πr³.', [`½ × ⁴⁄₃ × π × ${r}³ = ${r1(2 / 3 * Math.PI * r ** 3)}`]);
  },
  vectors() {
    const k = pick(['add', 'scale', 'mag']), a = [rnd(-6, 6), rnd(-6, 6)], b = [rnd(-6, 6), rnd(-6, 6)], V = v => `(${v[0]}, ${v[1]})`;
    if (k === 'add') { const s = [a[0] + b[0], a[1] + b[1]]; return MC(`a = ${E(V(a))}, b = ${E(V(b))}. What is a + b?`, V(s), [V([a[0] - b[0], a[1] - b[1]]), V([a[0] + b[1], a[1] + b[0]]), V([s[0], -s[1]]), V([s[0] + 1, s[1]]), V([s[0], s[1] - 1]), V([-s[0], s[1]])], 'Add the top numbers, then the bottom numbers.', [`(${a[0]} + ${b[0]}, ${a[1]} + ${b[1]}) = ${V(s)}`]); }
    if (k === 'scale') { const m = rnd(2, 4), s = [m * a[0] - b[0], m * a[1] - b[1]]; return MC(`a = ${E(V(a))}, b = ${E(V(b))}. What is ${m}a − b?`, V(s), [V([m * a[0] + b[0], m * a[1] + b[1]]), V([a[0] - m * b[0], a[1] - m * b[1]]), V([m * (a[0] - b[0]), m * (a[1] - b[1])]), V([s[0] + 1, s[1]]), V([s[0], s[1] - 2]), V([s[1], s[0]])], `Multiply a by ${m} first, then subtract b.`, [`${m}a = ${V([m * a[0], m * a[1]])}`, `− b → ${V(s)}`]); }
    const [p, q, c] = pick(TRIPLES), sx = pick([1, -1]), sy = pick([1, -1]); return NP(`What is the magnitude (length) of the vector ${E(V([sx * p, sy * q]))}?`, c, '', 'Length = √(x² + y²), like Pythagoras.', [`√(${p * p} + ${q * q}) = √${c * c} = ${c}`]);
  },
  radians() {
    const T = [[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [120, '2π/3'], [135, '3π/4'], [150, '5π/6'], [180, 'π'], [270, '3π/2'], [360, '2π']];
    const [d, r] = pick(T), toRad = Math.random() < .5;
    if (toRad) return MC(`Write ${d}° in radians.`, r, shuffle(T.filter(x => x[1] !== r)).slice(0, 3).map(x => x[1]), '180° = π radians.', [`${d}/180 × π = ${r}`]);
    return NP(`Write ${E(r)} radians in degrees.`, d, '', 'π radians = 180°.', [`${r} × 180/π = ${d}°`]);
  },
  trigGraphs() {
    const a = rnd(2, 5), b = pick([2, 3, 4]), f = pick(['sin', 'cos']), k = pick(['amp', 'period', 'max']);
    if (k === 'amp') return NP(`What is the amplitude (height of a wave above the middle) of ${E(`y = ${a} ${f} x`)}?`, a, '', `The number in front of ${f} stretches the wave up and down.`, [`amplitude = ${a}`]);
    if (k === 'period') return NP(`What is the period (length of one full wave, in degrees) of ${E(`y = ${f} ${b}x`)}?`, 360 / b, '', `${f} x repeats every 360°; ${b}x makes it ${b} times faster.`, [`360° ÷ ${b} = ${360 / b}°`]);
    const c = rnd(-3, 3); return NP(`What is the maximum value of ${E(`y = ${a} ${f} x ${c ? sg(c) : ''}`)}?`, a + c, '', `${f} x goes up to 1.`, [`${a} × 1 ${c ? sg(c) : ''} = ${a + c}`], { neg: true });
  }
});
function isUSu() { return U('len') === 'in'; }

// ================= Statistics and probability =================
const FR = (n, d) => frac(n, d);
const tbl = (head, rows) => `<div class="mtab"><table class="ptab"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const fracWrongs = (n, d) => [FR(n + 1, d), FR(n, d + 1), FR(d - n, d), FR(Math.max(1, n - 1), d)];

Object.assign(GEN_HS, {
  histogram() {
    const edges = [0, 10, 20, 40, 60, 100], fd = edges.slice(1).map(() => rnd(1, 6) * .5), W = 300, H = 150, X = v => 40 + v * (W - 50) / 100, maxFd = 3.5;
    const bars = fd.map((f, i) => `<rect x="${X(edges[i])}" y="${H - f / maxFd * (H - 20)}" width="${X(edges[i + 1]) - X(edges[i])}" height="${f / maxFd * (H - 20)}" style="fill:var(--acc);fill-opacity:.45;stroke:var(--acc)" stroke-width="2"/>`).join('');
    let ax = `<path d="M40 ${H}H${W}M40 ${H}V10" stroke="currentColor" stroke-width="2"/>`;
    for (let v = 0; v <= 3; v += .5) ax += `<path d="M36 ${H - v / maxFd * (H - 20)}H${W}" stroke="currentColor" stroke-opacity=".12"/>` + TX(32, H - v / maxFd * (H - 20) + 4, v, 10, 'end');
    edges.forEach(e => { ax += TX(X(e), H + 14, e, 10); });
    const body = ax + bars + TX(170, H + 30, 'Time (minutes)', 11) + `<text x="10" y="80" font-size="10" fill="currentColor" font-weight="700" transform="rotate(-90 10 80)" text-anchor="middle">Frequency density</text>`, i = rnd(0, 4);
    return NP(`How many people took between ${edges[i]} and ${edges[i + 1]} minutes? ${fig(SVG(`0 0 ${W + 10} ${H + 36}`, body))}`, fd[i] * (edges[i + 1] - edges[i]), '', 'Frequency = frequency density × class width.', [`${fd[i]} × ${edges[i + 1] - edges[i]} = ${fd[i] * (edges[i + 1] - edges[i])}`]);
  },
  cumFreq() {
    const groups = ['0–10', '10–20', '20–30', '30–40', '40–50'], f = groups.map(() => rnd(2, 15)), cf = f.reduce((a, v, i) => [...a, (a[i - 1] || 0) + v], []), N = cf[cf.length - 1];
    const k = pick(['total', 'cf', 'medgrp']);
    const T = tbl(['Mark', 'Frequency', 'Cumulative frequency'], groups.map((g, i) => [g, f[i], k === 'cf' && i === 3 ? '?' : cf[i]]));
    if (k === 'total') return NP(`${T}How many students are there in total?`, N, '', 'The last cumulative frequency is the total.', [`${N}`]);
    if (k === 'cf') return NP(`${T}What is the missing cumulative frequency?`, cf[3], '', 'Add the frequency to the cumulative total above it.', [`${cf[2]} + ${f[3]} = ${cf[3]}`]);
    const med = N / 2, gi = cf.findIndex(c => c >= med);
    return MC(`${T}Which group contains the median?`, groups[gi], groups.filter((_, j) => j !== gi), `The median is the ${med}th value. Find where the cumulative frequency reaches it.`, [`Half of ${N} = ${med}`, `Cumulative frequency reaches ${med} in ${groups[gi]}`]);
  },
  boxPlot() {
    // Every value sits on a tick mark (multiples of 5), so it can be read exactly.
    let v = [rnd(0, 2) * 5]; for (let i = 0; i < 4; i++) v.push(v[i] + rnd(1, 3) * 5); const [mn, q1, md, q3, mx] = v;
    const X = t => 20 + t * 260 / 70, body = `<path d="M${X(mn)} 60H${X(q1)}M${X(q3)} 60H${X(mx)}M${X(mn)} 45V75M${X(mx)} 45V75" stroke="currentColor" stroke-width="3"/><rect x="${X(q1)}" y="35" width="${X(q3) - X(q1)}" height="50" style="fill:var(--acc);fill-opacity:.25;stroke:var(--acc)" stroke-width="3"/><path d="M${X(md)} 35V85" style="stroke:var(--acc)" stroke-width="4"/>`
      + `<path d="M20 110H280" stroke="currentColor" stroke-width="2"/>` + Array.from({ length: 15 }, (_, i) => `<path d="M${X(i * 5)} 106V114" stroke="currentColor" stroke-width="2"/>${i % 2 === 0 ? TX(X(i * 5), 130, i * 5, 11) : ''}`).join('');
    const k = pick(['median', 'iqr', 'range', 'q3']), F = fig(SVG('0 0 300 140', body));
    if (k === 'median') return NP(`What is the median? ${F}`, md, '', 'The line inside the box is the median.', [`Median = ${md}`]);
    if (k === 'q3') return NP(`What is the upper quartile? ${F}`, q3, '', 'The right edge of the box.', [`Upper quartile = ${q3}`]);
    if (k === 'iqr') return NP(`What is the interquartile range? ${F}`, q3 - q1, '', 'IQR = upper quartile − lower quartile (the width of the box).', [`${q3} − ${q1} = ${q3 - q1}`]);
    return NP(`What is the range? ${F}`, mx - mn, '', 'Range = biggest − smallest (the ends of the whiskers).', [`${mx} − ${mn} = ${mx - mn}`]);
  },
  stdDev() {
    const m = rnd(5, 20), d = rnd(1, 5), n = pick([2, 3]), data = shuffle([...Array(n).fill(m - d), ...Array(n).fill(m + d)]);
    if (Math.random() < .5) return NP(`Find the standard deviation of ${E(data.join(', '))}`, d, '', 'Find the mean, then the average squared distance from it, then square root.', [`Mean = ${m}`, `Every value is ${d} from the mean`, `SD = √(${d}²) = ${d}`]);
    const x = [rnd(1, 9), rnd(1, 9), rnd(1, 9), rnd(1, 9), rnd(1, 9)], mean = x.reduce((a, b) => a + b) / 5, sd = Math.sqrt(x.reduce((a, b) => a + (b - mean) ** 2, 0) / 5);
    return NP1(`Find the standard deviation of ${E(x.join(', '))} to 1 decimal place.`, sd, 'σ = √( Σ(x − mean)² ÷ n ).', [`Mean = ${r2(mean)}`, `σ = ${r1(sd)}`]);
  },
  groupedMean() {
    const groups = [[0, 10], [10, 20], [20, 30], [30, 40]], f = groups.map(() => rnd(2, 12)), N = f.reduce((a, b) => a + b), mids = groups.map(([a, b]) => (a + b) / 2), tot = mids.reduce((s, m, i) => s + m * f[i], 0);
    return NP1(`${tbl(['Time (min)', 'Frequency'], groups.map(([a, b], i) => [`${a} – ${b}`, f[i]]))}Estimate the mean time to 1 decimal place.`, tot / N, 'Use the midpoint of each group: Σ(midpoint × frequency) ÷ total.', [mids.map((m, i) => `${m}×${f[i]}`).join(' + ') + ` = ${tot}`, `${tot} ÷ ${N} = ${r1(tot / N)}`]);
  },
  treeDiagram() {
    const r = rnd(2, 6), b = rnd(2, 6), n = r + b, repl = Math.random() < .5;
    const p1 = [r, n], p2 = repl ? [r, n] : [r - 1, n - 1], num = p1[0] * p2[0], den = p1[1] * p2[1];
    const tree = `<path d="M20 100L110 50M20 100L110 150M130 50L220 25M130 50L220 75M130 150L220 125M130 150L220 175" stroke="currentColor" stroke-width="2.5" fill="none"/>`
      + TX(56, 64, `${r}/${n}`, 12) + TX(56, 146, `${b}/${n}`, 12) + TX(170, 28, repl ? `${r}/${n}` : '?', 12) + TX(118, 54, 'R', 14) + TX(118, 156, 'B', 14) + TX(228, 30, 'R', 13, 'start') + TX(228, 80, 'B', 13, 'start') + TX(228, 130, 'R', 13, 'start') + TX(228, 180, 'B', 13, 'start');
    return MC(`A bag has ${r} red and ${b} blue counters. Two are taken ${repl ? 'with the first put back' : 'without putting the first back'}. What is the probability both are red? ${fig(SVG('0 0 260 200', tree))}`, FR(num, den),
      [FR(r * r, n * n) === FR(num, den) ? FR(r * (r - 1), n * (n - 1)) : FR(r * r, n * n), FR(2 * r, n * 2 + (repl ? 1 : 0)), FR(r, n), FR(num + 1, den)], 'Multiply along the branches.', [`${r}/${n} × ${p2[0]}/${p2[1]} = ${num}/${den} = ${FR(num, den)}`, repl ? '' : 'Without replacement, there is one fewer red and one fewer counter for the second pick.'].filter(Boolean));
  },
  conditional() {
    const a = rnd(5, 30), b = rnd(5, 30), c = rnd(5, 30), d = rnd(5, 30), k = pick(['and', 'given', 'given2']);
    const T = tbl(['', 'Walk', 'Bus', 'Total'], [['<b>Year 7</b>', a, b, a + b], ['<b>Year 8</b>', c, d, c + d], ['<b>Total</b>', a + c, b + d, a + b + c + d]]), N = a + b + c + d;
    if (k === 'and') return MC(`${T}A student is picked at random. What is P(Year 7 and walks)?`, FR(a, N), fracWrongs(a, N).concat([FR(a, a + b)]), 'Use the whole total as the bottom.', [`${a}/${N} = ${FR(a, N)}`]);
    if (k === 'given') return MC(`${T}A student who takes the bus is picked. What is the probability they are in Year 8?`, FR(d, b + d), [FR(d, N), FR(d, c + d), FR(b, b + d)], 'Only look at the Bus column.', [`P(Year 8 | Bus) = ${d}/${b + d} = ${FR(d, b + d)}`]);
    return MC(`${T}A Year 7 student is picked. What is the probability they walk?`, FR(a, a + b), [FR(a, N), FR(a, a + c), FR(b, a + b)], 'Only look at the Year 7 row.', [`P(Walk | Year 7) = ${a}/${a + b} = ${FR(a, a + b)}`]);
  },
  vennProb() {
    const onlyA = rnd(2, 15), both = rnd(1, 10), onlyB = rnd(2, 15), none = rnd(1, 10), N = onlyA + both + onlyB + none, k = pick(['and', 'or', 'given', 'notA']);
    const v = `<rect x="5" y="5" width="290" height="170" rx="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="115" cy="90" r="62" style="fill:var(--acc);fill-opacity:.15;stroke:var(--acc)" stroke-width="2.5"/><circle cx="185" cy="90" r="62" style="fill:#f76707;fill-opacity:.12;stroke:#f76707" stroke-width="2.5"/>`
      + TX(84, 96, onlyA, 18) + TX(150, 96, both, 18) + TX(216, 96, onlyB, 18) + TX(270, 164, none, 16) + TX(70, 30, 'Football', 13) + TX(232, 30, 'Tennis', 13);
    const F = fig(SVG('0 0 300 180', v));
    if (k === 'and') return MC(`${N} children were asked which sports they play. One is picked at random. P(Football and Tennis)? ${F}`, FR(both, N), fracWrongs(both, N), 'The overlap is "and".', [`${both}/${N} = ${FR(both, N)}`]);
    if (k === 'or') return MC(`One child is picked at random. P(Football or Tennis)? ${F}`, FR(onlyA + both + onlyB, N), fracWrongs(onlyA + both + onlyB, N).concat([FR(onlyA + 2 * both + onlyB, N)]), '"Or" means in either circle (count the overlap once).', [`${onlyA} + ${both} + ${onlyB} = ${onlyA + both + onlyB}`, `${onlyA + both + onlyB}/${N} = ${FR(onlyA + both + onlyB, N)}`]);
    if (k === 'given') return MC(`A child who plays Tennis is picked. What is the probability they also play Football? ${F}`, FR(both, both + onlyB), [FR(both, N), FR(both, onlyA + both), FR(onlyB, both + onlyB)], 'Only look inside the Tennis circle.', [`${both}/(${both} + ${onlyB}) = ${FR(both, both + onlyB)}`]);
    return MC(`One child is picked at random. What is the probability they do NOT play Football? ${F}`, FR(onlyB + none, N), fracWrongs(onlyB + none, N).concat([FR(none, N)]), 'Everything outside the Football circle.', [`${onlyB} + ${none} = ${onlyB + none}`, `${onlyB + none}/${N} = ${FR(onlyB + none, N)}`]);
  },
  independent() {
    const a = rnd(1, 9) / 10, b = rnd(1, 9) / 10, k = pick(['and', 'neither', 'atleast']);
    if (k === 'and') return NP(`P(rain) = ${a} and P(bus late) = ${b}. They are independent. Find P(rain and bus late).`, r2(a * b), '', 'For independent events, multiply.', [`${a} × ${b} = ${r2(a * b)}`], { dot: true });
    if (k === 'neither') return NP(`P(A) = ${a}, P(B) = ${b}, independent. Find P(neither A nor B).`, r2((1 - a) * (1 - b)), '', 'P(not A) × P(not B).', [`${r2(1 - a)} × ${r2(1 - b)} = ${r2((1 - a) * (1 - b))}`], { dot: true });
    return NP(`P(A) = ${a}, P(B) = ${b}, independent. Find P(at least one of them).`, r2(1 - (1 - a) * (1 - b)), '', '1 − P(neither).', [`1 − ${r2(1 - a)} × ${r2(1 - b)} = ${r2(1 - (1 - a) * (1 - b))}`], { dot: true });
  },
  perms() {
    const k = pick(['fact', 'npr', 'word']), n = rnd(3, 7), r = rnd(2, Math.min(4, n)), F = m => m <= 1 ? 1 : m * F(m - 1);
    if (k === 'fact') return NP(`In how many different orders can ${n} books be arranged on a shelf?`, F(n), '', `${n} choices for the first spot, then ${n - 1}, …`, [`${n}! = ${F(n)}`]);
    if (k === 'npr') { const pl = n >= 4 && Math.random() < .5 ? 3 : 2, txt = pl === 3 ? '1st, 2nd and 3rd' : '1st and 2nd'; return NP(`${n} runners are in a race. In how many ways can ${txt} place be decided?`, F(n) / F(n - pl), '', 'Multiply the number of choices for each place.', [`${Array.from({ length: pl }, (_, i) => n - i).join(' × ')} = ${F(n) / F(n - pl)}`]); }
    const w = pick(['MATHS', 'CAT', 'BOOKS', 'LEVEL', 'APPLE']), cnt = {}; for (const c of w) cnt[c] = (cnt[c] || 0) + 1; const v = F(w.length) / Object.values(cnt).reduce((p, c) => p * F(c), 1);
    return NP(`How many different arrangements are there of the letters ${E(w)}?`, v, '', 'n! ÷ (repeats)!', [`${w.length}!${Object.values(cnt).some(c => c > 1) ? ' ÷ ' + Object.values(cnt).filter(c => c > 1).map(c => c + '!').join(' ÷ ') : ''} = ${v}`]);
  },
  combs() {
    const n = rnd(5, 12), r = rnd(2, Math.min(5, n - 1)), k = pick(['team', 'pizza']);
    if (k === 'team') return NP(`How many ways can a team of ${r} be chosen from ${n} players?`, C(n, r), '', 'Order does not matter: use ⁿCᵣ.', [`${n}C${r} = ${C(n, r)}`]);
    return NP(`A pizza shop has ${n} toppings. How many different pizzas have exactly ${r} toppings?`, C(n, r), '', 'Choosing, not arranging: ⁿCᵣ.', [`${n}C${r} = ${C(n, r)}`]);
  },
  binomProb() {
    const n = rnd(3, 6), k = rnd(0, n), ways = C(n, k), den = 2 ** n;
    if (Math.random() < .6) return MC(`A fair coin is flipped ${n} times. What is the probability of exactly ${k} heads?`, FR(ways, den), [FR(1, den), FR(k, n), FR(ways + 1, den), FR(ways, 2 * n)], `Number of ways (${n}C${k}) × (½)${sup(n)}.`, [`${n}C${k} = ${ways}`, `${ways}/${den} = ${FR(ways, den)}`]);
    const p = pick([.1, .2, .3]), m = rnd(3, 5); return NP(`X ~ B(${m}, ${p}). Find P(X = 0) to 4 decimal places.`, Math.round((1 - p) ** m * 1e4) / 1e4, '', 'P(X = 0) = (1 − p)ⁿ.', [`${r2(1 - p)}${sup(m)} = ${Math.round((1 - p) ** m * 1e4) / 1e4}`], { dot: true });
  },
  normalDist() {
    const mu = pick([50, 60, 100, 170]), s = pick([5, 10, 15]), k = pick(['1sd', '2sd', 'above2', 'above1']);
    if (k === '1sd') return NP(`Heights are normally distributed with mean ${mu} and standard deviation ${s}. About what percentage lie between ${mu - s} and ${mu + s} (%)?`, 68, '', 'About 68% lie within 1 standard deviation of the mean.', ['68% (the 68–95–99.7 rule)']);
    if (k === '2sd') return NP(`Mean ${mu}, standard deviation ${s}, normal distribution. About what percentage lie between ${mu - 2 * s} and ${mu + 2 * s} (%)?`, 95, '', 'About 95% lie within 2 standard deviations.', ['95%']);
    if (k === 'above2') return NP(`Mean ${mu}, standard deviation ${s}, normal distribution. About what percentage are above ${mu + 2 * s} (%)?`, 2.5, '', '95% are within 2 SD; the other 5% is split between the two tails.', ['(100 − 95) ÷ 2 = 2.5%'], { dot: true });
    return NP(`Mean ${mu}, standard deviation ${s}, normal distribution. About what percentage are above ${mu + s} (%)?`, 16, '', '68% are within 1 SD; the other 32% is split between the two tails.', ['(100 − 68) ÷ 2 = 16%']);
  }
});

// ================= Calculus, finance, matrices, complex numbers =================
const M2 = m => `<span class="mat"><span>${m[0][0]}</span><span>${m[0][1]}</span><span>${m[1][0]}</span><span>${m[1][1]}</span></span>`;
const NPm = (prompt, answer, hint, solution) => ({ template: 'numpad', prompt, answer: r2(answer), data: { expr: '', dot: true }, hint, solution: [].concat(solution),
  check: v => Math.abs(Number(v) - answer) <= 0.011 });   // money to the nearest cent/penny
const cx = (a, b) => b === 0 ? `${a}` : a === 0 ? `${b === 1 ? '' : b === -1 ? '−' : b}i` : `${a} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i`;
const mono = (c, n) => n === 0 ? `${c}` : `${c === 1 ? '' : c === -1 ? '−' : c}x${n === 1 ? '' : sup(n)}`;

Object.assign(GEN_HS, {
  limits() {
    const a = rnd(-5, 6), k = pick(['poly', 'cancel']);
    if (k === 'poly') { const p = rnd(1, 4), q = rnd(-6, 6) || 2; return NP(`Find ${E(`lim (x → ${a}) of (${poly([p, 'x²'], [q, 'x'])})`)}`, p * a * a + q * a, '', 'For a smooth curve, just put the value in.', [`${p}(${a})² ${sg(q)}(${a}) = ${p * a * a + q * a}`], { neg: true }); }
    const b = a || 3; return NP(`Find ${E(`lim (x → ${b}) of (x² − ${b * b}) / (x ${sg(-b)})`)}`, 2 * b, '', `Putting x = ${b} gives 0/0, so factorise first.`, [`(x ${sg(-b)})(x ${sg(b)}) / (x ${sg(-b)}) = x ${sg(b)}`, `→ ${b} ${sg(b)} = ${2 * b}`], { neg: true });
  },
  differentiate() {
    const a = rnd(1, 9), n = rnd(2, 6), k = pick(['rule', 'value', 'poly']);
    if (k === 'rule') return MC(`Differentiate ${E(`y = ${mono(a, n)}`)}`, `dy/dx = ${mono(a * n, n - 1)}`, [`dy/dx = ${mono(a, n - 1)}`, `dy/dx = ${mono(a * n, n)}`, `dy/dx = ${mono(a * (n - 1), n - 1)}`, `dy/dx = ${mono(a + n, n - 1)}`], 'Multiply by the power, then take 1 off the power.', [`${a} × ${n} = ${a * n}, power ${n} − 1 = ${n - 1}`]);
    const b = rnd(-6, 6), c = rnd(-9, 9), x = rnd(-3, 3), f = `${mono(a, 3)} ${sg(b)}x² ${sg(c)}x`;
    if (k === 'value') return NP(`${E(`f(x) = ${f}`)}. Find ${E(`f′(${x})`)}.`, 3 * a * x * x + 2 * b * x + c, '', 'Differentiate each term, then put the number in.', [`f′(x) = ${3 * a}x² ${sg(2 * b)}x ${sg(c)}`, `f′(${x}) = ${3 * a * x * x + 2 * b * x + c}`], { neg: true });
    return NP(`What is the gradient of the curve ${E(`y = ${poly([1, 'x²'], [b, 'x'])}`)} at x = ${x}?`, 2 * x + b, '', 'The gradient is dy/dx.', [`dy/dx = 2x${b ? ' ' + sg(b) : ''}`, `at x = ${x}: ${2 * x + b}`], { neg: true });
  },
  stationary() {
    const h = rnd(-4, 4), k = rnd(-4, 3), b = -2 * h, c = h * h + k, Q = poly([1, 'x²'], [b, 'x'], [c, '']);
    if (Math.random() < .5) return TG(`Use ${E('dy/dx = 0')} to find the turning point of ${E(`y = ${Q}`)}, then tap it.`, [{ fn: `x*x+(${b})*x+(${c})`, label: `y = ${Q}` }], [[h, k]], 'dy/dx = 2x ' + sg(b) + ' = 0 gives the x of the turning point.', [`dy/dx = 2x ${sg(b)} = 0 → x = ${h}`, `y = ${k}`, `turning point (${h}, ${k})`]);
    const p = rnd(1, 3); return MC(`${E(`y = x³ − ${3 * p * p}x`)} has two stationary points. At which x-values?`, `x = ${-p} and x = ${p}`, [`x = 0 and x = ${3 * p * p}`, `x = ${-3 * p} and x = ${3 * p}`, `x = ${p} only`], 'Set dy/dx = 3x² − ' + 3 * p * p + ' = 0.', [`3x² = ${3 * p * p}`, `x² = ${p * p}`, `x = ±${p}`]);
  },
  chainExp() {
    const k = pick(['chain', 'exp', 'ln', 'trig']), a = rnd(2, 5), b = rnd(1, 7), n = rnd(3, 6);
    if (k === 'chain') return MC(`Differentiate ${E(`y = (${a}x + ${b})${sup(n)}`)}`, `${n * a}(${a}x + ${b})${sup(n - 1)}`, [`${n}(${a}x + ${b})${sup(n - 1)}`, `${n * a}(${a}x + ${b})${sup(n)}`, `${a}(${a}x + ${b})${sup(n - 1)}`], 'Chain rule: differentiate the outside, then multiply by the derivative of the inside.', [`${n}(${a}x + ${b})${sup(n - 1)} × ${a} = ${n * a}(${a}x + ${b})${sup(n - 1)}`]);
    if (k === 'exp') return MC(`Differentiate ${E(`y = e^(${a}x)`)}`, `${a}e^(${a}x)`, [`e^(${a}x)`, `${a}xe^(${a}x − 1)`, `e^(${a})`], 'd/dx of e^(kx) is k e^(kx).', [`dy/dx = ${a}e^(${a}x)`]);
    if (k === 'ln') return MC(`Differentiate ${E(`y = ln(${a}x)`)}`, '1/x', [`${a}/x`, `1/(${a}x)`, `ln ${a}`], 'ln(ax) = ln a + ln x, and ln a is a constant.', ['dy/dx = 1/x']);
    return MC(`Differentiate ${E(`y = sin(${a}x)`)}`, `${a}cos(${a}x)`, [`cos(${a}x)`, `−${a}cos(${a}x)`, `${a}sin(${a}x)`], 'd/dx sin(kx) = k cos(kx).', [`dy/dx = ${a}cos(${a}x)`]);
  },
  integrate() {
    const n = rnd(1, 5), a = (n + 1) * rnd(1, 4);
    return MC(`Find ${E(`∫ ${mono(a, n)} dx`)}`, `${mono(a / (n + 1), n + 1)} + c`, [`${mono(a * n, n - 1)} + c`, `${mono(a, n + 1)} + c`, `${mono(a * (n + 1), n + 1)} + c`, `${mono(a / (n + 1), n + 1)}`], 'Add 1 to the power, divide by the new power, and add c.', [`${a} ÷ ${n + 1} = ${a / (n + 1)}`, `${mono(a / (n + 1), n + 1)} + c`]);
  },
  definiteInt() {
    const k = pick(['poly', 'area']);
    if (k === 'poly') { const a = rnd(0, 2), b = a + rnd(1, 3), p = rnd(1, 3) * 3, q = rnd(1, 4) * 2, F = x => p / 3 * x ** 3 + q / 2 * x * x; return NP(`Evaluate ${E(`∫ from ${a} to ${b} of (${p}x² + ${q}x) dx`)}`, F(b) - F(a), '', 'Integrate, then subtract: F(top) − F(bottom).', [`F(x) = ${p / 3}x³ + ${q / 2}x²`, `F(${b}) − F(${a}) = ${F(b)} − ${F(a)} = ${F(b) - F(a)}`]); }
    const m = rnd(1, 3), K = m * m; return MC(`Find the area between ${E(`y = ${K} − x²`)} and the x-axis.`, frac(4 * m ** 3, 3), [frac(2 * m ** 3, 3), String(2 * m ** 3), frac(8 * m ** 3, 3)], `The curve crosses the axis at x = −${m} and x = ${m}. Integrate between them.`, [`∫ from −${m} to ${m} of (${K} − x²) dx`, `= [${K}x − x³/3] = ${frac(4 * m ** 3, 3)}`]);
  },
  compound() {
    const P = pick([500, 1000, 2000, 5000]), r = pick([2, 3, 4, 5, 6]), n = rnd(2, 5), A = P * (1 + r / 100) ** n;
    if (Math.random() < .5) return NPm(`${money(P)} is invested at ${r}% compound interest a year. How much is it worth after ${n} years? Round to 2 decimal places.`, A, `Multiply by ${1 + r / 100} once for each year.`, [`${P} × ${1 + r / 100}${sup(n)} = ${money(r2(A))}`]);
    return NPm(`${money(P)} is invested at ${r}% compound interest a year. How much interest is earned in ${n} years? Round to 2 decimal places.`, A - P, 'Find the final amount, then take away the starting amount.', [`${P} × ${1 + r / 100}${sup(n)} = ${r2(A)}`, `${r2(A)} − ${P} = ${money(r2(A - P))}`]);
  },
  depreciation() {
    const P = rnd(8, 30) * 1000, r = pick([10, 15, 20, 25]), n = rnd(2, 4), V = P * (1 - r / 100) ** n;
    return NPm(`A car costs ${money(P)}. It loses ${r}% of its value each year. What is it worth after ${n} years? Round to 2 decimal places.`, V, `Each year multiply by ${1 - r / 100}.`, [`${P} × ${1 - r / 100}${sup(n)} = ${money(r2(V))}`]);
  },
  loans() {
    const k = pick(['total', 'interest', 'months']), m = pick([12, 24, 36]), pay = rnd(10, 60) * 10, borrowed = Math.round(pay * m * (1 - pick([.08, .1, .12])) / 100) * 100;
    if (k === 'total') return NP(`A loan is repaid with ${m} monthly payments of ${money(pay)}. How much is repaid in total?`, pay * m, '', 'Payments × number of months.', [`${pay} × ${m} = ${money(pay * m)}`]);
    if (k === 'interest') return NP(`${money(borrowed)} is borrowed and repaid with ${m} payments of ${money(pay)}. How much interest is paid?`, pay * m - borrowed, '', 'Total repaid − amount borrowed.', [`${pay} × ${m} = ${pay * m}`, `${pay * m} − ${borrowed} = ${money(pay * m - borrowed)}`]);
    const total = pay * m; return NP(`A phone costs ${money(total)} on a payment plan of ${money(pay)} a month. How many months will it take?`, m, '', 'Total ÷ monthly payment.', [`${total} ÷ ${pay} = ${m} months`]);
  },
  reversePct() {
    const orig = rnd(4, 60) * 10, r = pick([10, 20, 25, 30, 40, 50]), up = Math.random() < .5, now = orig * (up ? 1 + r / 100 : 1 - r / 100);
    return NP(`After a ${r}% ${up ? 'increase' : 'decrease'}, a price is ${money(now)}. What was it before?`, orig, '', `${money(now)} is ${up ? 100 + r : 100 - r}% of the original.`, [`${now} ÷ ${up ? 1 + r / 100 : 1 - r / 100} = ${money(orig)}`], { dot: true });
  },
  matrices() {
    const A = [[rnd(-3, 5), rnd(-3, 5)], [rnd(-3, 5), rnd(-3, 5)]], B = [[rnd(-3, 5), rnd(-3, 5)], [rnd(-3, 5), rnd(-3, 5)]], k = pick(['add', 'mul', 'det', 'scalar']);
    const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    if (k === 'det') return NP(`Find the determinant of ${M2(A)}`, A[0][0] * A[1][1] - A[0][1] * A[1][0], '', 'For [a b; c d] the determinant is ad − bc.', [`${A[0][0]} × ${A[1][1]} − ${A[0][1]} × ${A[1][0]} = ${A[0][0] * A[1][1] - A[0][1] * A[1][0]}`], { neg: true });
    if (k === 'add') { const S = [[A[0][0] + B[0][0], A[0][1] + B[0][1]], [A[1][0] + B[1][0], A[1][1] + B[1][1]]]; return MC(`${M2(A)} + ${M2(B)} = ?`, M2(S), [M2([[S[0][0], S[1][0]], [S[0][1], S[1][1]]]), M2(mul(A, B)), M2([[A[0][0] - B[0][0], A[0][1] - B[0][1]], [A[1][0] - B[1][0], A[1][1] - B[1][1]]]), M2([[S[0][0] + 1, S[0][1]], [S[1][0], S[1][1]]]), M2([[S[0][0], S[0][1]], [S[1][0], S[1][1] - 1]])], 'Add the numbers in the same positions.', ['Add position by position.'], { html: true }); }
    if (k === 'scalar') { const s = rnd(2, 4); return MC(`${s} × ${M2(A)} = ?`, M2(A.map(r => r.map(v => s * v))), [M2(A.map(r => r.map(v => s + v))), M2([[s * A[0][0], A[0][1]], [A[1][0], s * A[1][1]]]), M2(A.map(r => r.map(v => s * v + 1))), M2(A.map(r => r.map(v => -s * v)))], `Multiply every number by ${s}.`, [`Every entry × ${s}`], { html: true }); }
    const P = mul(A, B); return MC(`${M2(A)} × ${M2(B)} = ?`, M2(P), [M2(mul(B, A)), M2([[A[0][0] * B[0][0], A[0][1] * B[0][1]], [A[1][0] * B[1][0], A[1][1] * B[1][1]]]), M2([[P[0][0], P[1][0]], [P[0][1], P[1][1]]]), M2([[P[0][0] + 1, P[0][1]], [P[1][0], P[1][1]]]), M2([[P[0][0], P[0][1] - 1], [P[1][0], P[1][1] + 1]])], 'Row × column: multiply across and down, then add.', [`top-left: ${A[0][0]}×${B[0][0]} + ${A[0][1]}×${B[1][0]} = ${P[0][0]}`], { html: true });
  },
  complexNum() {
    const a = rnd(-5, 6), b = rnd(-5, 6) || 2, c = rnd(-5, 6), d = rnd(-5, 6) || 3, k = pick(['add', 'mul', 'mod', 'i2']);
    if (k === 'add') return MC(`Simplify ${E(`(${cx(a, b)}) + (${cx(c, d)})`)}`, cx(a + c, b + d), [cx(a + c, b - d), cx(a - c, b + d), cx(a * c, b * d), cx(a + d, b + c)], 'Add real parts, then imaginary parts.', [`(${a} + ${c}) + (${b} + ${d})i = ${cx(a + c, b + d)}`]);
    if (k === 'mul') return MC(`Simplify ${E(`(${cx(a, b)})(${cx(c, d)})`)}`, cx(a * c - b * d, a * d + b * c), [cx(a * c + b * d, a * d + b * c), cx(a * c, b * d), cx(a * c - b * d, a * d - b * c)], 'Expand the brackets and use i² = −1.', [`= ${a * c} ${sg(a * d)}i ${sg(b * c)}i ${sg(b * d)}i²`, `i² = −1 → ${cx(a * c - b * d, a * d + b * c)}`]);
    if (k === 'mod') { const [p, q, r] = pick(TRIPLES); return NP(`Find the modulus ${E(`|${cx(p * pick([1, -1]), q * pick([1, -1]))}|`)}`, r, '', '|a + bi| = √(a² + b²).', [`√(${p * p} + ${q * q}) = ${r}`]); }
    const n = pick([2, 3, 4, 5, 6, 7, 8]), ans = ['1', 'i', '−1', '−i'][n % 4];
    return MC(`What is ${E(`i${sup(n)}`)}?`, ans, ['1', 'i', '−1', '−i'].filter(x => x !== ans), 'i² = −1, i³ = −i, i⁴ = 1, then it repeats.', [`${n} ÷ 4 leaves ${n % 4} → i${sup(n)} = ${ans}`]);
  }
});
