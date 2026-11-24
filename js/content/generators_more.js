// Grades 3–8: the remaining curriculum-map topics (number, algebra, ratio, geometry, measurement, data, chance, money).
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { fmt, money, U, isUS, tax } from '../core/region.js';

const E = s => `<span class="expr">${s}</span>`;
const r2 = x => +(+x).toFixed(2);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const NP = (prompt, answer, expr, hint, solution, data = {}) => ({ template: 'numpad', prompt, answer, data: { expr: expr ? E(expr) : '', ...data }, hint, solution: [].concat(solution) });
function MC(prompt, right, wrongs, hint, solution, data = {}) {
  const opts = shuffle([String(right), ...[...new Set(wrongs.map(String))].filter(w => w !== String(right)).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(String(right)), data: { options: opts, ...data }, hint, solution: [].concat(solution) };
}
const fig = svg => `<div class="efig">${svg}</div>`;
const SV = (vb, body, cls = 'mfig') => `<svg viewBox="${vb}" class="${cls}" role="img">${body}</svg>`;
const ST = 'stroke="currentColor" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"';
const FILL = 'style="fill:var(--acc);fill-opacity:.25;stroke:var(--acc)" stroke-width="3" stroke-linejoin="round"';
const T = (x, y, s, size = 15, anchor = 'middle') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="currentColor" font-weight="700">${s}</text>`;
const poly = (pts, attrs = FILL) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" ${attrs}/>`;
const table = (head, rows) => `<div class="mtab"><table class="ptab"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const ORD = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

// ---------- shape drawings ----------
const TRI = {
  equilateral: [[80, 20], [140, 124], [20, 124]],
  isosceles: [[80, 14], [118, 130], [42, 130]],
  scalene: [[30, 120], [150, 128], [105, 22]],
  right: [[30, 20], [30, 125], [150, 125]]
};
function triSvg(kind) {
  const p = TRI[kind]; let marks = '';
  const tick = (a, b, n) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 7, ny = dx / L * 7, ux = dx / L * 4, uy = dy / L * 4;
    let s = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 2; s += `<path d="M${mx + ux * o - nx} ${my + uy * o - ny}L${mx + ux * o + nx} ${my + uy * o + ny}" stroke="currentColor" stroke-width="2.5"/>`; } return s; };
  if (kind === 'equilateral') marks = tick(p[0], p[1], 1) + tick(p[1], p[2], 1) + tick(p[2], p[0], 1);
  if (kind === 'isosceles') marks = tick(p[0], p[1], 1) + tick(p[2], p[0], 1);
  if (kind === 'right') marks = `<path d="M30 111H44V125" stroke="currentColor" stroke-width="2.5" fill="none"/>`;
  return SV('0 0 170 140', poly(p) + marks);
}
const QUAD = {
  square: { pts: [[40, 25], [130, 25], [130, 115], [40, 115]], right: true, ticks: [1, 1, 1, 1] },
  rectangle: { pts: [[20, 35], [150, 35], [150, 105], [20, 105]], right: true, ticks: [1, 2, 1, 2] },
  rhombus: { pts: [[85, 15], [145, 70], [85, 125], [25, 70]], ticks: [1, 1, 1, 1] },
  parallelogram: { pts: [[45, 35], [155, 35], [125, 110], [15, 110]], ticks: [1, 2, 1, 2] },
  trapezium: { pts: [[55, 35], [120, 35], [155, 110], [15, 110]], ticks: [0, 0, 0, 0], arrows: true },
  kite: { pts: [[85, 15], [130, 55], [85, 128], [40, 55]], ticks: [1, 2, 2, 1] }
};
function quadSvg(kind) {
  const q = QUAD[kind], p = q.pts; let marks = '';
  for (let i = 0; i < 4; i++) {
    const a = p[i], b = p[(i + 1) % 4], n = q.ticks[i]; if (!n) continue;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 7, ny = dx / L * 7, ux = dx / L * 4, uy = dy / L * 4;
    for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 2; marks += `<path d="M${mx + ux * o - nx} ${my + uy * o - ny}L${mx + ux * o + nx} ${my + uy * o + ny}" stroke="currentColor" stroke-width="2.5"/>`; }
  }
  if (q.right) marks += `<path d="M${p[3][0]} ${p[3][1] - 12}H${p[3][0] + 12}V${p[3][1]}" stroke="currentColor" stroke-width="2.5" fill="none"/>`;
  if (q.arrows) marks += `<path d="M84 29L92 35L84 41M81 104L89 110L81 116" stroke="currentColor" stroke-width="2.5" fill="none"/>`;
  return SV('0 0 170 140', poly(p) + marks);
}
const SHAPE_NAME = k => k === 'trapezium' ? U('trap') : k;

// Nets: drawn as unit squares/triangles on a small grid.
const NETS = {
  cube: { name: 'cube', draw: () => [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]].map(([x, y]) => `<rect x="${10 + x * 34}" y="${8 + y * 34}" width="34" height="34" ${FILL}/>`).join('') },
  cuboid: { name: () => U('box'), draw: () => `<rect x="44" y="8" width="56" height="26" ${FILL}/><rect x="10" y="34" width="34" height="56" ${FILL}/><rect x="44" y="34" width="56" height="56" ${FILL}/><rect x="100" y="34" width="34" height="56" ${FILL}/><rect x="134" y="34" width="56" height="56" ${FILL}/><rect x="44" y="90" width="56" height="26" ${FILL}/>` },
  'triangular prism': { name: 'triangular prism', draw: () => `<rect x="40" y="30" width="40" height="70" ${FILL}/><rect x="80" y="30" width="40" height="70" ${FILL}/><rect x="120" y="30" width="40" height="70" ${FILL}/>${poly([[80, 30], [120, 30], [100, 2]])}${poly([[80, 100], [120, 100], [100, 128]])}` },
  'square-based pyramid': { name: 'square-based pyramid', draw: () => `<rect x="70" y="45" width="44" height="44" ${FILL}/>${poly([[70, 45], [114, 45], [92, 8]])}${poly([[114, 45], [114, 89], [150, 67]])}${poly([[70, 89], [114, 89], [92, 126]])}${poly([[70, 45], [70, 89], [34, 67]])}` },
  cylinder: { name: 'cylinder', draw: () => `<rect x="40" y="38" width="120" height="54" ${FILL}/><circle cx="100" cy="19" r="19" ${FILL}/><circle cx="100" cy="111" r="19" ${FILL}/>` }
};
const netName = k => typeof NETS[k].name === 'function' ? NETS[k].name() : NETS[k].name;

// Shapes on a grid for transformations.
const GRID = (w, h, s) => { let g = ''; for (let i = 0; i <= w; i++) g += `<path d="M${i * s} 0V${h * s}" stroke="currentColor" stroke-opacity=".18"/>`; for (let j = 0; j <= h; j++) g += `<path d="M0 ${j * s}H${w * s}" stroke="currentColor" stroke-opacity=".18"/>`; return g; };
const LSHAPE = [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]];   // an L, so every move looks different

export const GEN_MORE = {
  // ---------- Number ----------
  squareRoot() {
    if (Math.random() < .6) { const n = rnd(2, 15); return NP(`What is the square root of ${n * n}?`, n, `√${n * n} = ?`, 'Which number times itself gives this?', [`${n} × ${n} = ${n * n}`, `so √${n * n} = ${n}`]); }
    const a = rnd(3, 11), x = a * a + rnd(1, 2 * a); return MC(`√${x} is between which two whole numbers?`, `${a} and ${a + 1}`, [`${a - 1} and ${a}`, `${a + 1} and ${a + 2}`, `${Math.floor(x / 2)} and ${Math.floor(x / 2) + 1}`], 'Find the square numbers just below and just above.', [`${a}² = ${a * a} and ${a + 1}² = ${(a + 1) ** 2}`, `${a * a} < ${x} < ${(a + 1) ** 2}`]);
  },
  ordinal() {
    const k = pick(['race', 'word', 'month']);
    if (k === 'race') { const n = rnd(3, 25); return MC(`In a race, ${n - 1} children finish before Sam. In what place does Sam finish?`, ORD(n), [ORD(n - 1), ORD(n + 1), ORD(n + 2)], 'Count the children ahead, then add Sam.', [`${n - 1} ahead + Sam = ${ORD(n)} place`]); }
    if (k === 'word') { const w = pick(['ELEPHANT', 'NOTEBOOK', 'TRIANGLE', 'SANDWICH', 'DINOSAUR', 'PUMPKINS']), i = rnd(2, w.length); return MC(`What is the ${ORD(i)} letter of ${w}?`, w[i - 1], [w[i - 2] || w[i], w[i] || w[0], w[w.length - i]], 'Count the letters from the left.', [`${w.split('').map((c, j) => j === i - 1 ? `[${c}]` : c).join(' ')}`]); }
    const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], i = rnd(2, 12);
    return MC(`Which is the ${ORD(i)} month of the year?`, M[i - 1], [M[i - 2], M[i % 12], M[(i + 4) % 12]], 'Start counting at January.', [`January is 1st … ${M[i - 1]} is ${ORD(i)}`]);
  },
  recurring() {
    const k = pick(['toDec', 'toFrac', 'dots']);
    const set = [[1, 3, '0.333…'], [2, 3, '0.666…'], [1, 9, '0.111…'], [4, 9, '0.444…'], [1, 6, '0.1666…'], [5, 6, '0.8333…'], [1, 11, '0.0909…'], [1, 7, '0.142857142857…']];
    const [n, d, dec] = pick(set);
    if (k === 'toDec') return MC(`Write ${E(`${n}/${d}`)} as a decimal.`, dec, set.filter(x => x[2] !== dec).map(x => x[2]), `Divide ${n} by ${d}: the digits start repeating.`, [`${n} ÷ ${d} = ${dec}`]);
    if (k === 'toFrac') return MC(`Which fraction equals ${dec}?`, `${n}/${d}`, set.filter(x => x[2] !== dec).map(x => `${x[0]}/${x[1]}`), 'Try dividing each fraction.', [`${n} ÷ ${d} = ${dec}`]);
    const q = pick([[1, 3, true], [1, 4, false], [2, 9, true], [3, 8, false], [1, 12, true], [7, 20, false]]);
    return MC(`Does ${E(`${q[0]}/${q[1]}`)} make a recurring decimal?`, q[2] ? 'Yes, it repeats for ever' : 'No, it stops', [q[2] ? 'No, it stops' : 'Yes, it repeats for ever'], 'If the bottom (simplified) has only 2s and 5s as factors, the decimal stops.', [`${q[1]} = ${q[1] === 4 ? '2 × 2' : q[1] === 8 ? '2 × 2 × 2' : q[1] === 20 ? '2 × 2 × 5' : q[1] === 3 ? '3' : q[1] === 9 ? '3 × 3' : '2 × 2 × 3'}`, q[2] ? 'it has a factor other than 2 and 5 → recurring' : 'only 2s and 5s → it stops']);
  },
  fracMul() {
    const cop = (lo, hi, den) => { let x; do { x = rnd(lo, hi); } while (gcd(x, den) !== 1); return x; };
    const b = rnd(2, 9), d = rnd(2, 9), a = cop(1, b - 1, b), c = cop(1, d - 1, d), ans = frac(a * c, b * d);
    if (Math.random() < .3) { const w = rnd(2, 5) * b; return NP(`What is ${E(`${a}/${b}`)} of ${w}?`, a * w / b, '', `Divide by ${b}, then multiply by ${a}.`, [`${w} ÷ ${b} = ${w / b}`, `${w / b} × ${a} = ${a * w / b}`]); }
    return MC(`Work out ${E(`${a}/${b} × ${c}/${d}`)}. Give the simplest answer.`, ans, [frac(a + c, b + d), frac(a * d, b * c), frac(a * c, b + d), frac(a * c + 1, b * d)], 'Multiply the tops, multiply the bottoms, then simplify.', [`${a} × ${c} = ${a * c}, ${b} × ${d} = ${b * d}`, `${a * c}/${b * d} = ${ans}`]);
  },
  fracDiv() {
    const cop = (lo, hi, den) => { let x; do { x = rnd(lo, hi); } while (gcd(x, den) !== 1); return x; };
    const b = rnd(2, 9), d = rnd(2, 9), a = cop(1, 8, b), c = cop(1, 8, d), ans = frac(a * d, b * c);
    if (Math.random() < .3) { const w = rnd(2, 6), q = rnd(2, 5), nm = { 2: 'halves', 3: 'thirds', 4: isUS() ? 'fourths' : 'quarters', 5: 'fifths' }[q]; return NP(`How many ${nm} are there in ${w}?`, w * q, `${w} ÷ 1/${q} = ?`, `Each whole has ${q} ${nm}.`, [`${w} × ${q} = ${w * q}`]); }
    return MC(`Work out ${E(`${a}/${b} ÷ ${c}/${d}`)}. Give the simplest answer.`, ans, [frac(a * c, b * d), frac(b * c, a * d), frac(a * d + 1, b * c), frac(a, b * c)], 'Keep the first, flip the second, then multiply.', [`${a}/${b} × ${d}/${c} = ${a * d}/${b * c}`, `= ${ans}`]);
  },
  // ---------- Algebra ----------
  expand() {
    const a = rnd(2, 9), b = rnd(1, 5), c = rnd(1, 12), neg = Math.random() < .4, s = neg ? '−' : '+';
    const B = b === 1 ? 'x' : `${b}x`, out = `${a * b}x ${s} ${a * c}`;
    return MC(`Expand ${E(`${a}(${B} ${s} ${c})`)}`, out, [`${a * b}x ${s} ${c}`, `${a + b}x ${s} ${a * c}`, `${a * b}x ${neg ? '+' : '−'} ${a * c}`, `${b}x ${s} ${a * c}`], 'Multiply everything inside the brackets by the number outside.', [`${a} × ${B} = ${a * b}x`, `${a} × ${c} = ${a * c}`, `${out}`]);
  },
  factorise() {
    const g = rnd(2, 9); let p = rnd(1, 9), q = rnd(1, 12); while (gcd(p, q) !== 1) q++;
    const s = Math.random() < .4 ? '−' : '+', P = p === 1 ? 'x' : `${p}x`, ans = `${g}(${P} ${s} ${q})`;
    return MC(`Factorise ${E(`${g * p}x ${s} ${g * q}`)} fully.`, ans, [`${g}(${P} ${s} ${g * q})`, `${g * p}(x ${s} ${q})`, `x(${g * p} ${s} ${g * q})`, `${g}(${q}x ${s} ${p})`].filter(x => x !== ans), `What is the biggest number that divides both ${g * p} and ${g * q}?`, [`Both divide by ${g}`, `${g * p}x ÷ ${g} = ${P}, ${g * q} ÷ ${g} = ${q}`, ans]);
  },
  inequality() {
    const a = rnd(2, 6), x = rnd(-3, 9), b = rnd(1, 12), sym = pick(['<', '>', '≤', '≥']), rhs = a * x + b;
    if (Math.random() < .5) return MC(`Solve ${E(`${a}x + ${b} ${sym.replace('<', '&lt;').replace('>', '&gt;')} ${rhs}`)}`, `x ${sym} ${x}`, [`x ${sym} ${x + 1}`, `x ${{ '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sym]} ${x}`, `x ${sym} ${rhs - b}`], 'Solve it like an equation: take away, then divide.', [`${a}x ${sym} ${rhs} − ${b} = ${rhs - b}`, `x ${sym} ${rhs - b} ÷ ${a} = ${x}`]);
    const lo = rnd(-2, 4), hi = lo + rnd(2, 4), cnt = hi - lo - 1;
    return NP(`How many whole numbers n make ${E(`${lo} &lt; n &lt; ${hi}`)} true?`, cnt, '', '"<" means the end numbers do not count.', [`n = ${Array.from({ length: cnt }, (_, i) => lo + 1 + i).join(', ')}`, `${cnt} numbers`]);
  },
  // ---------- Ratio and rates ----------
  proportion() {
    const k = pick(['recipe', 'cost', 'work']);
    if (k === 'recipe') { const sv = pick([2, 4, 5]), g = rnd(2, 8) * sv, to = sv * rnd(2, 3) + (sv % 2 === 0 && Math.random() < .4 ? sv / 2 : 0); const ans = g / sv * to; if (!Number.isInteger(ans)) return GEN_MORE.proportion();
      return NP(`A recipe for ${sv} people uses ${g * 10} g of rice. How many grams for ${to} people?`, ans * 10, '', `Find the amount for 1 person first.`, [`1 person: ${g * 10} ÷ ${sv} = ${g * 10 / sv} g`, `${to} people: ${g * 10 / sv} × ${to} = ${ans * 10} g`]); }
    if (k === 'cost') { const n = rnd(3, 8), each = rnd(2, 15), m = rnd(2, 12); return NP(`${n} notebooks cost ${money(n * each)}. How much do ${m} notebooks cost (in ${money(0).replace(/[\d.,]/g, '').trim() || 'money'})?`, m * each, '', 'Same price for each notebook.', [`1 notebook: ${money(each)}`, `${m} × ${each} = ${money(m * each)}`]); }
    const sp = rnd(30, 80), h = rnd(2, 5), m = rnd(2, 6); return NP(`A machine fills ${sp} bottles in ${h} minutes. How many in ${h * m} minutes?`, sp * m, '', `${h * m} minutes is ${m} times as long.`, [`${sp} × ${m} = ${sp * m}`]);
  },
  scaleMap() {
    const us = isUS(), small = us ? 'in' : 'cm', big = us ? 'miles' : 'km', per = pick(us ? [2, 5, 10] : [2, 5, 10, 25]), d = rnd(2, 12);
    if (Math.random() < .6) return NP(`On a map, 1 ${small} stands for ${per} ${big}. Two towns are ${d} ${small} apart on the map. How far apart are they really (${big})?`, d * per, '', 'Multiply the map distance by the scale.', [`${d} × ${per} = ${d * per} ${big}`]);
    const k = rnd(2, 5) * 10, real = rnd(2, 9) * k; return NP(`A model car is built to a scale of 1 : ${k}. The real car is ${real} ${small} long. How long is the model (${small})?`, real / k, '', `The model is ${k} times smaller.`, [`${real} ÷ ${k} = ${real / k} ${small}`]);
  },
  bestBuy() {
    const unit = isUS() ? 'oz' : 'g', s1 = pick(isUS() ? [8, 12, 16] : [200, 250, 500]), m = pick([2, 3]), s2 = s1 * m;
    const p1 = rnd(2, 9), better2 = Math.random() < .5, p2 = better2 ? p1 * m - rnd(1, 2) : p1 * m + rnd(1, 3);
    const A = `Small: ${s1} ${unit} for ${money(p1)}`, B = `Large: ${s2} ${unit} for ${money(p2)}`;
    return MC(`Which is the better buy?<br>${A}<br>${B}`, better2 ? 'Large' : 'Small', [better2 ? 'Small' : 'Large', 'They are the same'], `${m} small packs would be ${s2} ${unit}. What would they cost?`, [`${m} small = ${s2} ${unit} for ${money(p1 * m)}`, `Large costs ${money(p2)}: ${better2 ? 'less, so Large is better' : 'more, so Small is better'}`]);
  },
  // ---------- Geometry ----------
  triangleType() {
    const k = pick(Object.keys(TRI)), ask = k === 'right' ? 'right-angled' : k;
    const wrong = { equilateral: ['scalene', 'right-angled'], isosceles: ['equilateral', 'scalene', 'right-angled'], scalene: ['equilateral', 'isosceles'], right: ['equilateral', 'isosceles'] }[k];
    return MC(`What type of triangle is this? ${fig(triSvg(k))}`, ask, wrong, 'Matching marks show equal sides; a small square shows a right angle.', [{ equilateral: 'All 3 sides are equal.', isosceles: 'Exactly 2 sides are equal.', scalene: 'No sides are equal.', right: 'One angle is 90°.' }[k]]);
  },
  quadType() {
    const k = pick(Object.keys(QUAD));
    const facts = { square: '4 equal sides and 4 right angles.', rectangle: 'Opposite sides equal and 4 right angles.', rhombus: '4 equal sides, no right angles.', parallelogram: 'Opposite sides equal and parallel, no right angles.', trapezium: 'Exactly one pair of parallel sides.', kite: 'Two pairs of equal sides next to each other.' };
    const wrong = { square: ['trapezium', 'kite', 'parallelogram'], rectangle: ['square', 'rhombus', 'kite', 'trapezium'], rhombus: ['square', 'rectangle', 'trapezium'], parallelogram: ['square', 'rectangle', 'rhombus', 'kite', 'trapezium'], trapezium: ['square', 'rectangle', 'rhombus', 'parallelogram', 'kite'], kite: ['square', 'rectangle', 'parallelogram', 'trapezium'] }[k];
    return MC(`What is the best (most exact) name for this shape? ${fig(quadSvg(k))}`, SHAPE_NAME(k), shuffle(wrong).map(SHAPE_NAME), 'Look at the marks: equal sides, right angles and parallel arrows.', [facts[k] + (k === 'square' ? ' (A square is also a special rectangle and rhombus, but "square" is the exact name.)' : k === 'rhombus' ? ' (A rhombus is a special parallelogram.)' : k === 'rectangle' ? ' (A rectangle is a special parallelogram.)' : '')]);
  },
  parPerp() {
    const k = pick(['parallel', 'perpendicular', 'neither']), a = rnd(-30, 30);
    const line = (x, y, ang, len = 150) => { const r = ang * Math.PI / 180; return `<path d="M${(x - Math.cos(r) * len / 2).toFixed(1)} ${(y - Math.sin(r) * len / 2).toFixed(1)}L${(x + Math.cos(r) * len / 2).toFixed(1)} ${(y + Math.sin(r) * len / 2).toFixed(1)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`; };
    let body;
    if (k === 'parallel') body = line(100, 50, a) + line(100, 100, a);
    else if (k === 'perpendicular') body = line(100, 75, a) + line(100, 75, a + 90, 110) + `<path d="M${100 + 12 * Math.cos(a * Math.PI / 180)} ${75 + 12 * Math.sin(a * Math.PI / 180)}l${12 * Math.cos((a + 90) * Math.PI / 180)} ${12 * Math.sin((a + 90) * Math.PI / 180)}l${-12 * Math.cos(a * Math.PI / 180)} ${-12 * Math.sin(a * Math.PI / 180)}" stroke="currentColor" stroke-width="2" fill="none"/>`;
    else body = line(100, 55, a) + line(100, 95, a + pick([25, -25, 40]));
    return MC(`These two lines are…${fig(SV('0 0 200 150', body))}`, k, ['parallel', 'perpendicular', 'neither'].filter(x => x !== k), 'Parallel lines never meet. Perpendicular lines meet at a right angle.', [{ parallel: 'They stay the same distance apart: parallel.', perpendicular: 'They meet at 90° (see the square): perpendicular.', neither: 'They would meet, but not at a right angle.' }[k]]);
  },
  nets() {
    const k = pick(Object.keys(NETS));
    return MC(`This net folds up into which solid? ${fig(SV('0 0 200 140', NETS[k].draw()))}`, netName(k), Object.keys(NETS).filter(x => x !== k).map(netName), 'Count the faces and look at their shapes.', [{ cube: '6 equal squares → cube', cuboid: '6 rectangles in pairs → ' + U('box'), 'triangular prism': '2 triangles + 3 rectangles → triangular prism', 'square-based pyramid': '1 square + 4 triangles → square-based pyramid', cylinder: '2 circles + 1 rectangle → cylinder' }[k]]);
  },
  transform() {
    const k = pick(['reflection', 'rotation', 'translation']), s = 22, ox = 1, oy = 1;
    const pts = LSHAPE.map(([x, y]) => [x + ox, y + oy]);
    let img;
    if (k === 'translation') { const dx = rnd(4, 6), dy = rnd(-1, 1); img = pts.map(([x, y]) => [x + dx, y + dy]); }
    else if (k === 'reflection') img = pts.map(([x, y]) => [10 - x, y]);            // mirror line x = 5
    else img = pts.map(([x, y]) => [10 - x, 8 - y]);                                 // half turn about (5, 4)
    const P = arr => arr.map(([x, y]) => [x * s, y * s]);
    const mirror = k === 'reflection' ? `<path d="M${5 * s} 0V${8 * s}" style="stroke:var(--acc)" stroke-width="3" stroke-dasharray="6 5"/>` : '';
    const body = GRID(10, 8, s) + poly(P(pts)) + poly(P(img), 'style="fill:var(--ok);fill-opacity:.3;stroke:var(--ok)" stroke-width="3"') + mirror + T(pts[0][0] * s + 10, pts[0][1] * s + 34, 'A', 16) + T(img[0][0] * s + (k === 'translation' ? 10 : -10), img[0][1] * s + (k === 'rotation' ? -14 : 34), 'B', 16);
    return MC(`How does shape A move to shape B? ${fig(SV(`0 0 ${10 * s} ${8 * s}`, body))}`, k, ['reflection', 'rotation', 'translation'].filter(x => x !== k), 'Translation slides it. Reflection flips it in a mirror line. Rotation turns it.', [{ translation: 'Same way round, just moved along: translation.', reflection: 'Flipped over the dashed mirror line: reflection.', rotation: 'Turned upside down (half turn): rotation.' }[k]]);
  },
  congruent() {
    if (Math.random() < .5) {
      const a = rnd(2, 9), b = rnd(2, 9), k = pick([2, 3]), u = U('len');
      return NP(`Two rectangles are similar. The small one is ${a} ${u} by ${b} ${u}. The big one is ${a * k} ${u} long. How wide is it (${u})?`, b * k, '', 'Similar shapes: every side is multiplied by the same number.', [`Scale factor: ${a * k} ÷ ${a} = ${k}`, `${b} × ${k} = ${b * k} ${u}`]);
    }
    const kind = pick(['congruent', 'similar', 'neither']), w = rnd(3, 6), h = rnd(2, 4), s = 16;
    const [w2, h2] = kind === 'congruent' ? [w, h] : kind === 'similar' ? [w * 2, h * 2] : [w + 2, h];
    const body = `<rect x="10" y="${10 + (8 - h) * s / 2}" width="${w * s}" height="${h * s}" ${FILL}/>${T(10 + w * s / 2, 10 + (8 - h) * s / 2 + h * s + 18, `${w} × ${h}`, 14)}<rect x="${30 + 6 * s}" y="${10 + (8 - h2) * s / 2}" width="${w2 * s}" height="${h2 * s}" style="fill:var(--ok);fill-opacity:.3;stroke:var(--ok)" stroke-width="3"/>${T(30 + 6 * s + w2 * s / 2, Math.min(10 + (8 - h2) * s / 2 + h2 * s + 18, 168), `${w2} × ${h2}`, 14)}`;
    return MC(`Are these rectangles congruent, similar or neither? ${fig(SV(`0 0 ${40 + 6 * s + 12 * s} 175`, body))}`, kind, ['congruent', 'similar', 'neither'].filter(x => x !== kind), 'Congruent: same shape and size. Similar: same shape, all sides scaled by the same number.', [{ congruent: 'Same sides exactly → congruent.', similar: 'Every side doubled → similar.', neither: 'Only one side changed → neither.' }[kind]]);
  },
  tessellate() {
    const yes = ['square', 'equilateral triangle', 'regular hexagon', 'rectangle'], no = ['regular pentagon', 'regular octagon', 'circle'];
    if (Math.random() < .5) { const r = pick(yes); return MC('Which shape tessellates (fits together with no gaps) on its own?', r, shuffle(no), 'Angles meeting at a point must add up to 360°.', [r === 'regular hexagon' ? '3 × 120° = 360°' : r === 'equilateral triangle' ? '6 × 60° = 360°' : '4 × 90° = 360°']); }
    const r = pick(no); return MC('Which shape will NOT tessellate on its own?', r, shuffle(yes), 'Do copies of its angle add up to exactly 360°?', [r === 'circle' ? 'Circles always leave gaps.' : r === 'regular pentagon' ? '108° does not go into 360° exactly.' : '135° does not go into 360° exactly.']);
  },
  construct() {
    const k = pick(['bisect', 'perp', 'tri']);
    if (k === 'bisect') { const a = rnd(3, 16) * 10; return NP(`You bisect an angle of ${a}°. What size is each new angle?`, a / 2, '', 'Bisect means cut exactly in half.', [`${a} ÷ 2 = ${a / 2}°`]); }
    if (k === 'perp') { const L = rnd(3, 15) * 2, u = U('len'); return NP(`A perpendicular bisector cuts a ${L} ${u} line. How far from each end is the crossing point (${u})?`, L / 2, '', 'It crosses at the midpoint, at a right angle.', [`${L} ÷ 2 = ${L / 2} ${u}`]); }
    const a = rnd(3, 9), b = rnd(3, 9), c = rnd(3, 16), ok = a + b > c && a + c > b && b + c > a;
    return MC(`Can you construct a triangle with sides ${a}, ${b} and ${c}?`, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], 'The two shorter sides together must be longer than the longest side.', [`${[a, b, c].sort((x, y) => x - y).slice(0, 2).join(' + ')} = ${[a, b, c].sort((x, y) => x - y).slice(0, 2).reduce((x, y) => x + y)} ${ok ? '>' : '≤'} ${Math.max(a, b, c)}`]);
  },
  // ---------- Measurement ----------
  weightCap() {
    const us = isUS();
    if (Math.random() < .5) { // read a measuring jug
      const step = us ? 1 : 100, maxM = us ? 8 : 1000, lab = us ? 'cups' : 'ml', marks = us ? 8 : 10, v = rnd(1, marks - 1) * (maxM / marks) + (us && Math.random() < .5 ? .5 : 0);
      const H = 150, y0 = 165, level = y0 - v / maxM * H;
      let ticks = ''; for (let i = 0; i <= marks; i++) { const y = y0 - i * H / marks; ticks += `<path d="M60 ${y}h14" stroke="currentColor" stroke-width="2"/>${i % 2 === 0 || us ? T(54, y + 5, i * maxM / marks, 12, 'end') : ''}`; if (us && i < marks) ticks += `<path d="M60 ${y - H / marks / 2}h8" stroke="currentColor" stroke-width="1.5"/>`; }
      const body = `<rect x="60" y="${level}" width="90" height="${y0 - level}" style="fill:#4dabf7;fill-opacity:.55"/><path d="M60 10V${y0}H150V10" ${ST}/>${ticks}${T(105, 188, lab, 13)}`;
      return NP(`How much water is in the jug (${lab})? ${fig(SV('0 0 200 195', body))}`, v, '', `Each mark is ${us ? '1 cup (small marks are halves)' : (maxM / marks) + ' ' + lab}.`, [`The water reaches ${v} ${lab}.`], { dot: us });
    }
    const items = us ? [['an apple', 'oz'], ['a bag of potatoes', 'lb'], ['a pencil', 'oz'], ['a dog', 'lb'], ['a bath of water', 'gal'], ['a spoon of medicine', 'fl oz']] : [['an apple', 'g'], ['a bag of potatoes', 'kg'], ['a pencil', 'g'], ['a dog', 'kg'], ['a bath of water', 'L'], ['a spoon of medicine', 'ml']];
    const [it, u] = pick(items), all = us ? ['oz', 'lb', 'gal', 'fl oz'] : ['g', 'kg', 'L', 'ml'];
    return MC(`Which unit would you use to measure ${it}?`, u, all.filter(x => x !== u), 'Small things: small units. Liquids: capacity units.', [`${it}: ${u}`]);
  },
  temperature() {
    const us = isUS(), uT = U('temp');
    if (Math.random() < .5) {
      const [lo, hi, st] = us ? [-20, 100, 10] : [-20, 40, 5], v = rnd(lo / st, hi / st) * st, H = 160, y = t => 180 - (t - lo) / (hi - lo) * H;
      let ticks = ''; for (let t = lo; t <= hi; t += st) ticks += `<path d="M92 ${y(t)}h12" stroke="currentColor" stroke-width="2"/>${(t / st) % 2 === 0 ? T(86, y(t) + 5, t, 12, 'end') : ''}`;
      const body = `<rect x="104" y="14" width="22" height="172" rx="11" ${ST}/><circle cx="115" cy="198" r="16" style="fill:#fa5252"/><rect x="110" y="${y(v)}" width="10" height="${200 - y(v)}" style="fill:#fa5252"/>${ticks}${T(150, 30, uT, 16)}`;
      return NP(`What temperature does the thermometer show (${uT})? ${fig(SV('0 0 180 220', body))}`, v, '', `Each mark is ${st}${uT}. Below 0 the numbers are negative.`, [`The red line stops at ${v}${uT}.`], { neg: true });
    }
    const a = us ? rnd(-10, 40) : rnd(-12, 10), d = us ? rnd(5, 30) : rnd(3, 15), up = Math.random() < .5, b = up ? a + d : a - d;
    return NP(`At 6 am it was ${a}${uT}. By noon it ${up ? 'rose' : 'fell'} by ${d}${uT}. What was the temperature at noon (${uT})?`, b, '', up ? 'Count up.' : 'Count down; you may go below zero.', [`${a} ${up ? '+' : '−'} ${d} = ${b}${uT}`], { neg: true });
  },
  timetable() {
    const stops = ['Station', 'Market', 'Park', 'School'], start = rnd(7, 9) * 60 + pick([0, 10, 15, 20, 30]), gaps = [pick([8, 10, 12, 15]), pick([5, 7, 9, 11]), pick([6, 10, 13])];
    const buses = [0, pick([30, 40, 45]), pick([75, 80, 90])].map(off => { let t = start + off; return [t, ...gaps.map(g => (t += g))]; });
    const hm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
    const tbl = table(['Stop', 'Bus 1', 'Bus 2', 'Bus 3'], stops.map((s, i) => [s, ...buses.map(b => hm(b[i]))]));
    const k = pick(['journey', 'catch', 'wait']);
    if (k === 'journey') { const b = rnd(0, 2), i = rnd(0, 1), j = rnd(i + 2, 3); return NP(`${tbl}How many minutes does Bus ${b + 1} take from ${stops[i]} to ${stops[j]}?`, buses[b][j] - buses[b][i], '', 'Count on from the first time to the second.', [`${hm(buses[b][j])} − ${hm(buses[b][i])} = ${buses[b][j] - buses[b][i]} minutes`]); }
    if (k === 'catch') { const need = buses[1][3] + rnd(1, 10); return MC(`${tbl}You must be at School by ${hm(need)}. Which is the last bus you can catch from Station?`, 'Bus 2', ['Bus 1', 'Bus 3'], 'Look along the School row.', [`Bus 2 reaches School at ${hm(buses[1][3])}; Bus 3 is too late (${hm(buses[2][3])}).`]); }
    const at = buses[1][0] - rnd(3, 20); return NP(`${tbl}You get to the Station at ${hm(at)}. How many minutes until the next bus?`, buses[1][0] - at, '', 'Find the first bus after you arrive.', [`Bus 2 leaves at ${hm(buses[1][0])}`, `${buses[1][0] - at} minutes`]);
  },
  cylinder() {
    const r = 7 * rnd(1, 2), h = rnd(2, 12), u = U('len'), sa = Math.random() < .3;
    const body = `<ellipse cx="80" cy="30" rx="55" ry="16" ${FILL}/><path d="M25 30V120A55 16 0 0 0 135 120V30" ${ST}/><path d="M25 120A55 16 0 0 1 135 120" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5" fill="none"/><path d="M80 30H135" stroke="currentColor" stroke-width="2"/>${T(108, 24, `r = ${r}`, 13)}${T(160, 80, `h = ${h}`, 13, 'start')}`;
    if (sa) return NP(`Using π = 22/7, find the curved surface area of this cylinder (${U('area')}). ${fig(SV('0 0 220 145', body))}`, 2 * 22 * r * h / 7, '', 'Curved area = 2πrh (the label unrolled).', [`2 × 22/7 × ${r} × ${h} = ${2 * 22 * r * h / 7}`]);
    return NP(`Using π = 22/7, find the volume of this cylinder (${U('vol')}). ${fig(SV('0 0 220 145', body))}`, 22 * r * r * h / 7, '', 'Volume = area of the circle × height = πr²h.', [`22/7 × ${r} × ${r} = ${22 * r * r / 7}`, `× ${h} = ${22 * r * r * h / 7}`]);
  },
  // ---------- Data and chance ----------
  tally() {
    const pets = ['Cats', 'Dogs', 'Fish', 'Birds'], n = pets.map(() => rnd(2, 17));
    const marks = v => { let s = ''; for (let i = 0; i < Math.floor(v / 5); i++) s += '<span class="tl5">||||</span> '; return s + '|'.repeat(v % 5); };
    const tbl = table(['Pet', 'Tally'], pets.map((p, i) => [p, `<span class="tally">${marks(n[i])}</span>`]));
    const k = pick(['one', 'total', 'diff']), i = rnd(0, 3), j = (i + rnd(1, 3)) % 4;
    if (k === 'one') return NP(`${tbl}How many children chose ${pets[i]}?`, n[i], '', 'Each crossed group is 5.', [`${Math.floor(n[i] / 5)} fives + ${n[i] % 5} = ${n[i]}`]);
    if (k === 'total') return NP(`${tbl}How many children were asked altogether?`, n.reduce((a, b) => a + b), '', 'Count each row, then add.', [`${n.join(' + ')} = ${n.reduce((a, b) => a + b)}`]);
    return NP(`${tbl}How many more chose ${n[i] >= n[j] ? pets[i] : pets[j]} than ${n[i] >= n[j] ? pets[j] : pets[i]}?`, Math.abs(n[i] - n[j]), '', 'Find both numbers, then subtract.', [`${Math.max(n[i], n[j])} − ${Math.min(n[i], n[j])} = ${Math.abs(n[i] - n[j])}`]);
  },
  lineGraph() {
    const us = isUS(), days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], base = us ? rnd(40, 60) : rnd(8, 16), st = us ? 2 : 1, v = days.map(() => base + rnd(0, 10) * st);
    const top = Math.ceil((Math.max(...v) + st) / (5 * st)) * 5 * st, bot = Math.floor((Math.min(...v) - st) / (5 * st)) * 5 * st;
    const X = i => 45 + i * 40, Y = t => 160 - (t - bot) / (top - bot) * 140;
    let g = ''; for (let t = bot; t <= top; t += 5 * st / (us ? 1 : 1)) g += `<path d="M40 ${Y(t)}H260" stroke="currentColor" stroke-opacity=".15"/>${T(34, Y(t) + 4, t, 11, 'end')}`;
    const body = g + `<path d="M40 20V160H262" ${ST}/><polyline points="${v.map((t, i) => `${X(i)},${Y(t)}`).join(' ')}" style="stroke:var(--acc)" stroke-width="3" fill="none"/>${v.map((t, i) => `<circle cx="${X(i)}" cy="${Y(t)}" r="4.5" style="fill:var(--acc)"/>${T(X(i), 178, days[i], 11)}`).join('')}${T(150, 14, `Noon temperature (${U('temp')})`, 12)}`;
    const k = pick(['read', 'max', 'rise']), F = fig(SV('0 0 270 185', body));
    if (k === 'read') { const i = rnd(0, 5); return NP(`What was the temperature on ${days[i]} (${U('temp')})? ${F}`, v[i], '', 'Go up from the day, then across to the scale.', [`${days[i]}: ${v[i]}${U('temp')}`], { neg: true }); }
    if (k === 'max') { const m = Math.max(...v), d = days[v.indexOf(m)]; return MC(`Which day was warmest? ${F}`, d, days.filter(x => x !== d), 'Find the highest point.', [`${d}: ${m}${U('temp')}`]); }
    const i = rnd(0, 4); return NP(`How much did the temperature change from ${days[i]} to ${days[i + 1]} (${U('temp')})? Use − for a fall. ${F}`, v[i + 1] - v[i], '', 'Second value minus the first.', [`${v[i + 1]} − ${v[i]} = ${v[i + 1] - v[i]}`], { neg: true });
  },
  carroll() {
    const lim = pick([20, 30, 50]), n = rnd(2, 99), ev = n % 2 === 0, big = n > lim;
    const cell = (e, b) => `${e ? 'Even' : 'Not even'}, ${b ? `more than ${lim}` : `not more than ${lim}`}`;
    const tbl = table(['', `More than ${lim}`, `Not more than ${lim}`], [['<b>Even</b>', 'A', 'B'], ['<b>Not even</b>', 'C', 'D']]);
    const right = ev ? (big ? 'A' : 'B') : (big ? 'C' : 'D');
    return MC(`${tbl}In which box of this Carroll diagram does ${n} go?`, right, ['A', 'B', 'C', 'D'].filter(x => x !== right), 'Check both questions: is it even? is it more than ' + lim + '?', [`${n} is ${ev ? 'even' : 'not even'} and ${big ? 'more than' : 'not more than'} ${lim} → box ${right} (${cell(ev, big)})`]);
  },
  freqTable() {
    const vals = [0, 1, 2, 3, 4], f = vals.map(() => rnd(1, 9)), N = f.reduce((a, b) => a + b), tot = vals.reduce((s, v, i) => s + v * f[i], 0);
    const tbl = table(['Pets at home', 'Frequency'], vals.map((v, i) => [v, f[i]]));
    const k = pick(['n', 'mode', 'total', 'mean']);
    if (k === 'n') return NP(`${tbl}How many children were asked?`, N, '', 'Add up the frequency column.', [`${f.join(' + ')} = ${N}`]);
    if (k === 'mode') { const m = Math.max(...f); if (f.filter(x => x === m).length > 1) return GEN_MORE.freqTable(); return NP(`${tbl}What is the mode (most common number of pets)?`, vals[f.indexOf(m)], '', 'Find the biggest frequency.', [`Biggest frequency ${m} → ${vals[f.indexOf(m)]} pets`]); }
    if (k === 'total') return NP(`${tbl}How many pets are there altogether?`, tot, '', 'Multiply each number of pets by its frequency, then add.', [vals.map((v, i) => `${v}×${f[i]}`).join(' + ') + ` = ${tot}`]);
    if (tot % N) return GEN_MORE.freqTable();
    return NP(`${tbl}What is the mean number of pets per child?`, tot / N, '', 'Mean = total pets ÷ number of children.', [`Total pets = ${tot}`, `${tot} ÷ ${N} = ${tot / N}`]);
  },
  scatter() {
    const k = pick(['positive', 'negative', 'no']);
    const pts = Array.from({ length: 14 }, () => { const x = rnd(5, 95); const y = k === 'positive' ? x + rnd(-14, 14) : k === 'negative' ? 100 - x + rnd(-14, 14) : rnd(5, 95); return [x, Math.max(3, Math.min(97, y))]; });
    const body = `<path d="M30 10V150H250" ${ST}/>${pts.map(([x, y]) => `<circle cx="${30 + x * 2.15}" cy="${150 - y * 1.35}" r="5" style="fill:var(--acc)"/>`).join('')}`;
    const ctx = { positive: ['hours of revision', 'test score'], negative: ['age of a car', 'its value'], no: ['shoe size', 'test score'] }[k];
    return MC(`What type of correlation does this scatter graph show? ${fig(SV('0 0 260 160', body))}`, `${k} correlation`, ['positive correlation', 'negative correlation', 'no correlation'].filter(x => x !== `${k} correlation`), 'Up to the right: positive. Down to the right: negative. Scattered everywhere: none.', [{ positive: 'Points go up together', negative: 'One goes up as the other goes down', no: 'No pattern' }[k] + ` (like ${ctx[0]} and ${ctx[1]}).`]);
  },
  sampleSpace() {
    const k = pick(['coins', 'dice', 'spin', 'sum']);
    if (k === 'coins') { const n = rnd(2, 3); return NP(`You flip ${n} coins. How many different outcomes are there?`, 2 ** n, '', 'Each coin doubles the number of outcomes.', [`${Array(n).fill(2).join(' × ')} = ${2 ** n}`]); }
    if (k === 'dice') return NP('You roll a dice and flip a coin. How many different outcomes are there?', 12, '', 'List them: 1H, 1T, 2H, …', ['6 × 2 = 12']);
    if (k === 'spin') { const a = rnd(3, 5), b = rnd(2, 4); return NP(`Spinner A has ${a} colours and spinner B has ${b} numbers. How many outcomes when you spin both?`, a * b, '', 'Every colour can go with every number.', [`${a} × ${b} = ${a * b}`]); }
    const s = rnd(3, 11), ways = 6 - Math.abs(7 - s);
    return MC(`Two dice are rolled and added. What is the probability of a total of ${s}?`, frac(ways, 36), [frac(ways + 1, 36), frac(1, 11), frac(ways, 12)], 'There are 6 × 6 = 36 equally likely outcomes. Count the ones that make the total.', [`${ways} ways make ${s}`, `${ways}/36 = ${frac(ways, 36)}`]);
  },
  experimental() {
    const n = pick([20, 40, 50, 60, 100]), r = rnd(1, n / 2), k = pick(['est', 'expect']);
    if (k === 'est') return MC(`A spinner landed on red ${r} times in ${n} spins. What is the experimental probability of red?`, frac(r, n), [frac(n - r, n), frac(r, n + r), frac(1, 2) === frac(r, n) ? frac(1, 3) : frac(1, 2)], 'Times it happened ÷ total tries.', [`${r}/${n} = ${frac(r, n)}`]);
    const p = pick([[1, 4], [1, 5], [2, 5], [3, 10], [1, 2]]), tries = pick([40, 60, 100, 200]);
    return NP(`The probability of a drawing pin landing point up is ${E(`${p[0]}/${p[1]}`)}. About how many times will it land point up in ${tries} drops?`, tries * p[0] / p[1], '', 'Expected number = probability × number of tries.', [`${p[0]}/${p[1]} × ${tries} = ${tries * p[0] / p[1]}`]);
  },
  // ---------- Money ----------
  discount() {
    const tx = tax(), k = pick(['off', 'tax', 'pct']), price = rnd(4, 40) * 5;
    if (k === 'off') { const d = pick([10, 20, 25, 50]), now = price * (100 - d) / 100; return NP(`A jacket costs ${money(price)}. In the sale it is ${d}% off. What is the sale price?`, now, '', `Find ${d}% of ${money(price)}, then take it away.`, [`${d}% of ${price} = ${price * d / 100}`, `${price} − ${price * d / 100} = ${money(now)}`], { dot: !Number.isInteger(now) }); }
    if (k === 'tax') { const base = rnd(2, 20) * 10, add = base * tx.rate / 100; return NP(`A game costs ${money(base)} before ${tx.name}. ${tx.name} is ${tx.rate}%. What is the price with ${tx.name}?`, r2(base + add), '', `Find ${tx.rate}% of ${money(base)} and add it on.`, [`${tx.rate}% of ${base} = ${r2(add)}`, `${base} + ${r2(add)} = ${money(r2(base + add))}`], { dot: true }); }
    const was = rnd(4, 20) * 10, d = pick([10, 20, 25, 30, 40]), now = was * (100 - d) / 100;
    return NP(`A bike was ${money(was)} and is now ${money(now)}. What percentage discount is that (%)?`, d, '', 'Discount ÷ old price × 100.', [`Saving: ${was} − ${now} = ${was - now}`, `${was - now} ÷ ${was} × 100 = ${d}%`]);
  }
};
