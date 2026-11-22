// Explorers (Grades 3–8) generators.
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { SOLID } from '../core/art_little.js';
import { fmt, money, isIndia, U, conversions } from '../core/region.js';

const E = s => `<span class="expr">${s}</span>`;
const r2 = x => +(+x).toFixed(2);
const fmtIN = n => { const s = String(n); if (s.length <= 3) return s; const last3 = s.slice(-3), rest = s.slice(0, -3); return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3; }; // used by the India-only lakhs and crores lesson
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
const NP = (prompt, answer, expr, hint, solution, extra = {}) => ({ template: 'numpad', prompt, answer, data: { expr: expr ? E(expr) : '', ...extra.data }, hint, solution: [].concat(solution), ...(extra.say ? { say: extra.say } : {}) });
function MC(prompt, right, wrongs, hint, solution, data = {}) {
  const opts = shuffle([String(right), ...[...new Set(wrongs.map(String))].filter(w => w !== String(right)).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(String(right)), data: { options: opts, ...data }, hint, solution: [].concat(solution) };
}
const numMC = (prompt, ans, spread, hint, sol) => MC(prompt, ans, choices(ans, 4, Math.max(0, ans - spread), ans + spread), hint, sol);
const fig = svg => `<div class="efig">${svg}</div>`;

// ---------- drawings ----------
function angleSvg(deg, label = '') {
  const a = deg * Math.PI / 180, x = 110 + 90 * Math.cos(-a), y = 120 + 90 * Math.sin(-a), big = deg > 180 ? 1 : 0;
  const ax = 110 + 34 * Math.cos(-a), ay = 120 + 34 * Math.sin(-a);
  return `<svg viewBox="0 0 220 150" class="ang"><path d="M110 120H200M110 120L${x.toFixed(1)} ${y.toFixed(1)}" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M144 120A34 34 0 ${big} 0 ${ax.toFixed(1)} ${ay.toFixed(1)}" fill="none" stroke="var(--acc)" stroke-width="3"/>${label ? `<text x="${110 + 52 * Math.cos(-a / 2)}" y="${125 + 52 * Math.sin(-a / 2)}" font-size="18" font-weight="800" fill="var(--acc)" text-anchor="middle">${label}</text>` : ''}</svg>`;
}
function lineAngles(a) { // straight line split into a and x
  const r = a * Math.PI / 180, x = 110 + 90 * Math.cos(-r), y = 120 + 90 * Math.sin(-r);
  return `<svg viewBox="0 0 220 150" class="ang"><path d="M15 120H205M110 120L${x.toFixed(1)} ${y.toFixed(1)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><text x="${110 + 40 * Math.cos(-r / 2)}" y="${118 + 40 * Math.sin(-r / 2)}" font-size="16" font-weight="800" fill="currentColor" text-anchor="middle">${a}°</text><text x="${110 + 40 * Math.cos(-(r + Math.PI) / 2)}" y="${118 + 40 * Math.sin(-(r + Math.PI) / 2)}" font-size="18" font-weight="800" fill="var(--acc)" text-anchor="middle">x</text></svg>`;
}
function triSvg(A, B) { // labelled triangle, third angle x
  return `<svg viewBox="0 0 220 150" class="ang"><path d="M20 130H200L80 20Z" fill="var(--line)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><text x="40" y="124" font-size="16" font-weight="800" fill="currentColor">${A}°</text><text x="168" y="124" font-size="16" font-weight="800" fill="currentColor">${B}°</text><text x="80" y="48" font-size="18" font-weight="800" fill="var(--acc)" text-anchor="middle">x</text></svg>`;
}
function rectSvg(w, h, unit = U('len'), shape = 'rect') {
  if (shape === 'tri') return `<svg viewBox="0 0 220 150" class="ang"><path d="M20 130H200L70 25Z" fill="#d0ebff" stroke="currentColor" stroke-width="3"/><path d="M70 25V130" stroke="var(--acc)" stroke-width="2" stroke-dasharray="5 4"/><text x="110" y="148" font-size="15" font-weight="800" text-anchor="middle" fill="currentColor">${w} ${unit}</text><text x="76" y="88" font-size="15" font-weight="800" fill="var(--acc)">${h} ${unit}</text></svg>`;
  if (shape === 'para') return `<svg viewBox="0 0 220 150" class="ang"><path d="M20 130H160L200 30H60Z" fill="#d3f9d8" stroke="currentColor" stroke-width="3"/><path d="M60 30V130" stroke="var(--acc)" stroke-width="2" stroke-dasharray="5 4"/><text x="90" y="148" font-size="15" font-weight="800" text-anchor="middle" fill="currentColor">${w} ${unit}</text><text x="66" y="86" font-size="15" font-weight="800" fill="var(--acc)">${h} ${unit}</text></svg>`;
  const W = 60 + Math.min(w, 20) * 6, H = 30 + Math.min(h, 15) * 5;
  return `<svg viewBox="0 0 ${W + 70} ${H + 50}" class="ang"><rect x="35" y="15" width="${W}" height="${H}" fill="#fff3bf" stroke="currentColor" stroke-width="3"/><text x="${35 + W / 2}" y="${H + 40}" font-size="15" font-weight="800" text-anchor="middle" fill="currentColor">${w} ${unit}</text><text x="${W + 42}" y="${15 + H / 2 + 5}" font-size="15" font-weight="800" fill="currentColor">${h} ${unit}</text></svg>`;
}
function gridPoint(x, y, quads = 1) {
  const R = 6, U = 18, lo = quads === 1 ? 0 : -R, size = (R - lo) * U + 40, X = v => 20 + (v - lo) * U, Y = v => 20 + (R - v) * U;
  let g = ''; for (let i = lo; i <= R; i++) g += `<path d="M${X(i)} ${Y(lo)}V${Y(R)}M${X(lo)} ${Y(i)}H${X(R)}" stroke="${i === 0 ? 'currentColor' : 'var(--line)'}" stroke-width="${i === 0 ? 2.5 : 1}"/>`;
  for (let i = lo; i <= R; i += 2) if (i) g += `<text x="${X(i)}" y="${Y(0) + 15}" font-size="10" text-anchor="middle" fill="currentColor">${i}</text><text x="${X(0) - 8}" y="${Y(i) + 4}" font-size="10" text-anchor="end" fill="currentColor">${i}</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" class="gridpt">${g}<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="var(--acc)"/></svg>`;
}
function barChart(labels, vals) {
  const max = Math.ceil(Math.max(...vals) / 20) * 20, W = 50 * labels.length + 40;
  return `<svg viewBox="0 0 ${W} 190" class="bchart">${[0, .25, .5, .75, 1].map(f => { const v = Math.round(max * f), y = 160 - 140 * f; return `<path d="M34 ${y}H${W - 4}" stroke="var(--line)"/><text x="30" y="${y + 4}" font-size="11" text-anchor="end" fill="currentColor">${v}</text>`; }).join('')}
    ${vals.map((v, i) => `<rect x="${44 + i * 50}" y="${160 - 140 * v / max}" width="32" height="${140 * v / max}" rx="4" fill="${['#4dabf7', '#ff8a3d', '#51cf66', '#9775fa', '#ff6b8a'][i]}"/><text x="${60 + i * 50}" y="178" font-size="12" text-anchor="middle" fill="currentColor">${labels[i]}</text>`).join('')}</svg>`;
}
function pieSvg(parts, cols) {
  let a0 = -Math.PI / 2, d = '';
  parts.forEach((p, i) => { const a1 = a0 + p * 2 * Math.PI, P = a => `${(80 + 70 * Math.cos(a)).toFixed(1)} ${(80 + 70 * Math.sin(a)).toFixed(1)}`; d += `<path d="M80 80L${P(a0)}A70 70 0 ${p > .5 ? 1 : 0} 1 ${P(a1)}Z" fill="${cols[i]}" stroke="#fff" stroke-width="2"/>`; a0 = a1; });
  return `<svg viewBox="0 0 160 160" class="pie">${d}</svg>`;
}

export const GEN_EXPLORE = {
  // ---------- Number ----------
  placeValue({ digits = 5 } = {}) {
    const n = rnd(10 ** (digits - 1), 10 ** digits - 1), s = String(n), i = rnd(0, s.length - 2), d = +s[i] || 1;
    const num = +(s.slice(0, i) + d + s.slice(i + 1)), place = 10 ** (s.length - 1 - i), val = d * place;
    return numMCv(`What is the value of the digit ${d} in ${E(fmt(num))}?`, val, [d, d * place * 10, d * place / 10 || d * 10, place], 'Find its place: ones, tens, hundreds, thousands…', [`${d} is in the ${fmt(place)}s place → ${fmt(val)}`]);
  },
  indianSystem() {
    const kind = pick(['lakh', 'crore', 'commas']);
    if (kind === 'commas') { const n = rnd(100000, 99999999); return MC(`Which is the Indian way of writing ${n}?`, fmtIN(n), [n.toLocaleString('en-US'), String(n).replace(/\B(?=(\d{4})+(?!\d))/g, ','), fmtIN(n).replace(',', '')], 'Indian commas: first after 3 digits from the right, then after every 2.', [fmtIN(n)]); }
    if (kind === 'lakh') { const l = rnd(2, 99); return numMC(`How many lakhs make ${E(fmtIN(l * 100000))}?`, l, 15, '1 lakh = 1,00,000.', [`${fmtIN(l * 100000)} ÷ 1,00,000 = ${l}`]); }
    const c = rnd(2, 9), l = rnd(1, 99); return numMC(`${c} crore ${l} lakh is how many lakhs?`, c * 100 + l, 40, '1 crore = 100 lakh.', [`${c} × 100 + ${l} = ${c * 100 + l} lakh`]);
  },
  bigNumbers() {
    const kind = pick(['thousands', 'millions', 'commas', 'words']);
    if (kind === 'thousands') { const k = rnd(12, 999); return numMC(`How many thousands make ${E(fmt(k * 1000))}?`, k, 30, '1 thousand = 1,000.', [`${fmt(k * 1000)} ÷ 1,000 = ${k}`]); }
    if (kind === 'millions') { const m = rnd(1, 9), k = rnd(10, 990); return NP(`Write ${m} million ${k} thousand as a number. How many thousands is that?`, m * 1000 + k, '', '1 million = 1,000 thousands.', [`${m} × 1,000 + ${k} = ${fmt(m * 1000 + k)} thousand = ${fmt((m * 1000 + k) * 1000)}`]); }
    if (kind === 'commas') { const n = rnd(1000000, 99999999), s = String(n); return MC('Where do the commas go?', n.toLocaleString('en-US'), [s.replace(/\B(?=(\d{4})+(?!\d))/g, ','), s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3), s.replace(/(\d{2})(?=\d)/g, '$1,')], 'Count 3 digits from the right, put a comma, and repeat.', [n.toLocaleString('en-US')]); }
    const m = rnd(1, 9), k = rnd(100, 999), n = m * 1000000 + k * 1000;
    return MC(`How do you read ${E(fmt(n))}?`, `${m} million, ${k} thousand`, [`${m} billion, ${k} thousand`, `${m * 10 + Math.floor(k / 100)} lakh`, `${m} million, ${k} hundred`], 'Groups of three: millions, thousands, ones.', [`${fmt(n)} = ${m} million, ${k} thousand`]);
  },
  rounding({ to = 'pick' } = {}) {
    const p = to === 'pick' ? pick([10, 100, 1000]) : to, n = rnd(p * 2, p * 99) + rnd(1, p - 1), ans = Math.round(n / p) * p;
    return NP(`Round to the nearest ${p}.`, ans, String(n), `Look at the digit after the ${p}s place: 5 or more rounds up.`, [`${n} → ${ans}`]);
  },
  roman() {
    const toR = n => { const m = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; };
    const n = rnd(4, 99);
    if (Math.random() < .5) return MC(`Write ${E(n)} in Roman numerals.`, toR(n), [toR(n + 1), toR(n - 1), toR(n + 10), toR(Math.max(1, n - 10))], 'I = 1, V = 5, X = 10, L = 50, C = 100. A smaller one before a bigger one subtracts.', [`${n} = ${toR(n)}`]);
    return numMC(`What number is ${E(toR(n))}?`, n, 12, 'I = 1, V = 5, X = 10, L = 50, C = 100. IV = 4, IX = 9, XL = 40, XC = 90.', [`${toR(n)} = ${n}`]);
  },
  negatives() {
    const kind = pick(['add', 'sub', 'temp']);
    if (kind === 'temp') { const a = rnd(-8, 6), b = rnd(a + 3, a + 15); return NP(`The temperature rises from ${a}${U('temp')} to ${b}${U('temp')}. By how many degrees did it rise?`, b - a, '', 'Count the steps on a number line from the first to the second.', [`${b} − (${a}) = ${b - a}`]); }
    const a = rnd(-12, 12), b = rnd(-12, 12), ans = kind === 'add' ? a + b : a - b, f = v => v < 0 ? `(−${-v})` : v;
    return NP('Work it out.', ans, `${a < 0 ? '−' + -a : a} ${kind === 'add' ? '+' : '−'} ${f(b)} = ?`, kind === 'sub' ? 'Taking away a negative is the same as adding.' : 'Adding a negative is the same as taking away.', [`= ${ans}`], { data: { neg: true } });
  },
  factors() {
    const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 72]), f = [...Array(n).keys()].map(i => i + 1).filter(i => n % i === 0);
    if (Math.random() < .5) return numMC(`How many factors does ${E(n)} have?`, f.length, 5, 'Find pairs that multiply to make it: 1 × n, 2 × …', [f.join(', ')]);
    const good = pick(f.filter(x => x > 1 && x < n)), bad = shuffle([...Array(n).keys()].map(i => i + 2).filter(i => n % i && i < n)).slice(0, 3);
    return MC(`Which of these is a factor of ${E(n)}?`, good, bad, 'A factor divides it exactly, with no remainder.', [`${n} ÷ ${good} = ${n / good}`]);
  },
  primes() {
    const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97], C = [9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
    const p = pick(P.slice(3)), w = shuffle(C).slice(0, 3);
    return MC('Which of these is a prime number?', p, w, 'A prime has exactly two factors: 1 and itself. Try dividing by 3, 7…', [`${p} is prime`, ...w.map(c => { const d = [3, 5, 7].find(k => c % k === 0); return `${c} = ${d} × ${c / d}`; })]);
  },
  hcf() { const g = rnd(2, 12), a = g * rnd(2, 7), b = g * rnd(2, 7); if (a === b) return GEN_EXPLORE.hcf(); return NP('Find the HCF (highest common factor).', gcd(a, b), `HCF(${a}, ${b}) = ?`, 'List the factors of both; pick the biggest one in both lists.', [`HCF = ${gcd(a, b)}`]); },
  lcm() { const a = rnd(2, 12), b = rnd(2, 12); if (a === b) return GEN_EXPLORE.lcm(); return NP('Find the LCM (lowest common multiple).', lcm(a, b), `LCM(${a}, ${b}) = ?`, `Count in ${Math.max(a, b)}s until you reach a number that ${Math.min(a, b)} also divides.`, [`LCM = ${lcm(a, b)}`]); },
  divisibility() {
    const k = pick([3, 4, 6, 9, 11]), rule = { 3: 'digit sum divisible by 3', 4: 'last two digits divisible by 4', 6: 'even AND digit sum divisible by 3', 9: 'digit sum divisible by 9', 11: 'alternate digit sums differ by 0 or 11' }[k];
    const good = k * rnd(120, 900), bad = Array.from({ length: 3 }, () => { let x; do { x = rnd(1000, 9999); } while (x % k === 0); return x; });
    return MC(`Which number is divisible by ${k}?`, good, bad, `Rule for ${k}: ${rule}.`, [`${good} ÷ ${k} = ${good / k}`]);
  },
  powers() { const b = rnd(2, 6), e = rnd(2, b <= 3 ? 6 : 4); return NP('Work it out.', b ** e, `${b}<sup>${e}</sup> = ?`, `Multiply ${b} by itself ${e} times.`, [`${Array(e).fill(b).join(' × ')} = ${b ** e}`], { say: `${b} to the power ${e}` }); },
  sciNotation() {
    const m = rnd(11, 99) / 10, e = rnd(3, 8), n = Math.round(m * 10 ** e);
    return MC(`Write ${E(n.toLocaleString('en-US'))} in standard form.`, `${m} × 10^${e}`, [`${m} × 10^${e + 1}`, `${m} × 10^${e - 1}`, `${Math.round(m * 10)} × 10^${e}`], 'Put the decimal point after the first digit, then count how far it moved.', [`${n} = ${m} × 10^${e}`]);
  },

  // ---------- Operations ----------
  add3() { const a = rnd(120, 879), b = rnd(105, 999 - a); return NP('Work it out.', a + b, `${a} + ${b} = ?`, 'Add ones, then tens, then hundreds; carry when you get 10 or more.', [`${a} + ${b} = ${a + b}`]); },
  sub3() { const a = rnd(300, 999), b = rnd(101, a - 50); return NP('Work it out.', a - b, `${a} − ${b} = ?`, 'Subtract ones, tens, hundreds; exchange a ten or hundred when needed.', [`${a} − ${b} = ${a - b}`]); },
  mul2x1() { const a = rnd(12, 99), b = rnd(3, 9); return NP('Work it out.', a * b, `${a} × ${b} = ?`, `Split: ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}.`, [`${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${a * b}`]); },
  mul2x2() {
    const a = rnd(12, 98), b = rnd(12, 49), b1 = Math.floor(b / 10) * 10, b0 = b % 10;
    return { template: 'steps', prompt: E(`${a} × ${b}`), answer: a * b, data: { steps: [{ html: `${a} × ${b0} = ?`, answer: a * b0 }, { html: `${a} × ${b1} = ?`, answer: a * b1 }, { html: `${a * b0} + ${a * b1} = ?`, answer: a * b }] },
      hint: `Multiply by the ones (${b0}), then by the tens (${b1}), then add.`, solution: [`${a} × ${b0} = ${a * b0}`, `${a} × ${b1} = ${a * b1}`, `Total ${a * b}`] };
  },
  divRemainder() {
    const d = rnd(3, 9), q = rnd(4, 19), r = rnd(1, d - 1), n = d * q + r;
    return { template: 'steps', prompt: E(`${n} ÷ ${d}`), answer: r, data: { steps: [{ html: `How many ${d}s fit into ${n}? (quotient)`, answer: q }, { html: `${d} × ${q} = ${d * q}. Remainder: ${n} − ${d * q} = ?`, answer: r }] },
      hint: `Count in ${d}s up to ${n} without going over.`, solution: [`${n} ÷ ${d} = ${q} remainder ${r}`] };
  },
  longDiv() { const d = rnd(3, 9), q = rnd(21, 199); return NP('Work it out.', q, `${d * q} ÷ ${d} = ?`, 'Divide digit by digit from the left, carrying remainders.', [`${d} × ${q} = ${d * q}`]); },
  bodmas() {
    const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, 9);
    const forms = [[`${a} + ${b} × ${c}`, a + b * c, `${b} × ${c} first`], [`(${a} + ${b}) × ${c}`, (a + b) * c, 'brackets first'], [`${a * c} ÷ ${c} + ${b} × ${d}`, a + b * d, 'divide and multiply before adding'], [`${a} × ${b} − ${c} + ${d}`, a * b - c + d, 'multiply first, then left to right']];
    const [q, ans, why] = pick(forms);
    return NP('Work it out (BODMAS).', ans, `${q} = ?`, `Order: Brackets, Orders (powers), Division/Multiplication, Addition/Subtraction. Here: ${why}.`, [`${q} = ${ans}`]);
  },

  // ---------- Fractions, decimals, percentages ----------
  fracEquiv() { const b = rnd(2, 9), a = rnd(1, b - 1), k = rnd(2, 6); return NP('Fill in the missing number.', a * k, `${a}/${b} = ?/${b * k}`, `${b} × ${k} = ${b * k}, so multiply the top by ${k} too.`, [`${a} × ${k} = ${a * k}`]); },
  fracSimplify() { const b = rnd(3, 9), a = rnd(1, b - 1), g = gcd(a, b); const A = a / g, B = b / g, k = rnd(2, 6); return MC(`Simplify ${E(`${A * k}/${B * k}`)}.`, `${A}/${B}`, [`${A * k / gcd(A * k, 2) || A}/${B * k}`, `${A + 1}/${B}`, `${A}/${B + 1}`, `${B}/${A}`], 'Divide the top and bottom by the same number (their HCF).', [`÷ ${k}: ${A}/${B}`]); },
  fracAdd({ same = true } = {}) {
    if (same) { const d = rnd(5, 12), a = rnd(1, d - 2), b = rnd(1, d - 1 - a); return MC(`${E(`${a}/${d} + ${b}/${d}`)} = ?`, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`], 'Same bottom number: add the tops only.', [`${a + b}/${d}`]); }
    const d1 = rnd(2, 6), d2 = rnd(2, 6); if (d1 === d2) return GEN_EXPLORE.fracAdd({ same }); const a = 1, b = 1, L = lcm(d1, d2), n = a * L / d1 + b * L / d2, g = gcd(n, L);
    return MC(`${E(`1/${d1} + 1/${d2}`)} = ?`, `${n / g}/${L / g}`, [`2/${d1 + d2}`, `${n}/${L * 2}`, `1/${L}`], `Make the bottoms the same: ${L}.`, [`${L / d1}/${L} + ${L / d2}/${L} = ${n}/${L}${g > 1 ? ` = ${n / g}/${L / g}` : ''}`]);
  },
  fracOf() { const b = pick([2, 3, 4, 5, 6, 8, 10]), a = rnd(1, b - 1), n = b * rnd(2, 12); return NP('Work it out.', n / b * a, `${a}/${b} of ${n} = ?`, `Divide by ${b}, then multiply by ${a}.`, [`${n} ÷ ${b} = ${n / b}`, `${n / b} × ${a} = ${n / b * a}`]); },
  mixed() { const b = rnd(2, 9), w = rnd(1, 5), a = rnd(1, b - 1), top = w * b + a; return Math.random() < .5 ? MC(`Write ${E(`${top}/${b}`)} as a mixed number.`, `${w} ${a}/${b}`, [`${w + 1} ${a}/${b}`, `${w} ${b - a}/${b}`, `${a} ${w}/${b}`], `How many whole ${b}s fit in ${top}? The rest is the fraction.`, [`${top} ÷ ${b} = ${w} remainder ${a}`]) : NP('Write as an improper fraction: what is the top number?', top, `${w} ${a}/${b} = ?/${b}`, `${w} × ${b} + ${a}.`, [`${w} × ${b} + ${a} = ${top}`]); },
  decPlace() { const n = (rnd(10, 999) / 100).toFixed(2), s = n.replace('.', ''), i = rnd(0, s.length - 1), d = s[i]; if (d === '0') return GEN_EXPLORE.decPlace(); const pl = [1, 0.1, 0.01].slice(3 - s.length + (s.length - 3) * 0)[0]; const places = s.length === 3 ? [1, .1, .01] : [10, 1, .1, .01]; const val = r2(+d * places[i]); return MC(`What is the value of the ${d} in ${E(n)}?`, String(val), [String(r2(val * 10)), String(r2(val / 10)), d].map(String), 'Places after the point: tenths, then hundredths.', [`${d} × ${places[i]} = ${val}`]); },
  decAdd() { const a = rnd(11, 899) / 10, b = rnd(11, 499) / 10, add = Math.random() < .6, ans = r2(add ? a + b : Math.max(a, b) - Math.min(a, b)); return NP('Work it out.', ans, add ? `${a} + ${b} = ?` : `${Math.max(a, b)} − ${Math.min(a, b)} = ?`, 'Line up the decimal points.', [`= ${ans}`], { data: { dot: true } }); },
  decMul() { const n = rnd(11, 999) / 100, k = pick([10, 100, 1000]), mul = Math.random() < .6, ans = +(mul ? n * k : n / k).toFixed(6); return NP('Work it out.', ans, mul ? `${n} × ${k} = ?` : `${n} ÷ ${k} = ?`, `${mul ? 'Multiplying' : 'Dividing'} by ${k} moves the digits ${String(k).length - 1} place${k > 10 ? 's' : ''} ${mul ? 'left (bigger)' : 'right (smaller)'}.`, [`= ${ans}`], { data: { dot: true } }); },
  convertFDP() {
    const [f, d, p] = pick([['1/2', '0.5', '50%'], ['1/4', '0.25', '25%'], ['3/4', '0.75', '75%'], ['1/5', '0.2', '20%'], ['2/5', '0.4', '40%'], ['1/10', '0.1', '10%'], ['3/10', '0.3', '30%'], ['1/8', '0.125', '12.5%'], ['3/5', '0.6', '60%']]);
    const ask = pick(['fd', 'fp', 'dp']), all = { f: ['1/2', '1/4', '3/4', '1/5', '2/5', '3/10'], d: ['0.5', '0.25', '0.75', '0.2', '0.4', '0.3'], p: ['50%', '25%', '75%', '20%', '40%', '30%'] };
    const [from, to] = { fd: [f, d], fp: [f, p], dp: [d, p] }[ask], kind = ask[1];
    return MC(`${E(from)} is the same as…`, to, shuffle(all[kind]).filter(x => x !== to), 'Fraction → divide top by bottom for the decimal; × 100 for the percentage.', [`${f} = ${d} = ${p}`]);
  },
  pctOf() { const p = pick([10, 20, 25, 30, 40, 50, 60, 75, 5, 15]), n = pick([20, 40, 60, 80, 120, 200, 240, 300, 400, 500, 800]); return NP('Work it out.', n * p / 100, `${p}% of ${n} = ?`, 'Find 10% (÷ 10), or 1% (÷ 100), and build up.', [`${n} × ${p}/100 = ${n * p / 100}`]); },
  pctChange() { const n = pick([200, 400, 500, 800, 1000, 1200, 1500, 2000]), p = pick([10, 20, 25, 5, 15]), up = Math.random() < .5; return NP(`A price of ${money(n)} ${up ? 'goes up' : 'is reduced'} by ${p}%. What is the new price?`, up ? n * (100 + p) / 100 : n * (100 - p) / 100, '', `${p}% of ${n} = ${n * p / 100}; ${up ? 'add' : 'take'} it ${up ? 'on' : 'off'}.`, [`${n} ${up ? '+' : '−'} ${n * p / 100} = ${up ? n * (100 + p) / 100 : n * (100 - p) / 100}`]); },

  // ---------- Ratio ----------
  ratioSimplify() { const g = rnd(2, 9), a = rnd(1, 7), b = rnd(1, 7); if (gcd(a, b) > 1 || a === b) return GEN_EXPLORE.ratioSimplify(); return MC(`Simplify the ratio ${E(`${a * g} : ${b * g}`)}.`, `${a} : ${b}`, [`${b} : ${a}`, `${a * 2} : ${b}`, `${a} : ${b * 2}`], 'Divide both sides by their HCF.', [`÷ ${g} → ${a} : ${b}`]); },
  ratioShare() { const a = rnd(1, 5), b = rnd(1, 5), k = rnd(5, 30); if (a === b) return GEN_EXPLORE.ratioShare(); return NP(`Share ${money((a + b) * k)} between Riya and Aarav in the ratio ${a} : ${b}. How much does Aarav get?`, b * k, '', `Total parts: ${a + b}. One part = ${money((a + b) * k)} ÷ ${a + b}.`, [`1 part = ${money(k)}`, `Aarav: ${b} × ${k} = ${money(b * k)}`]); },
  unitRate() { const n = rnd(2, 6), p = rnd(5, 40), m = rnd(n + 1, 12); return NP(`${n} pencils cost ${money(n * p)}. How much do ${m} pencils cost?`, m * p, '', 'Find the cost of 1 pencil first.', [`1 pencil = ${money(p)}`, `${m} × ${p} = ${money(m * p)}`]); },
  sdt() {
    const s = pick([20, 30, 40, 45, 50, 60, 80]), t = rnd(2, 6), kind = pick(['d', 's', 't']), d = U('big'), v = U('speed');
    if (kind === 'd') return NP(`A bus travels at ${s} ${v} for ${t} hours. How far does it go (${d})?`, s * t, '', 'Distance = speed × time.', [`${s} × ${t} = ${s * t} ${d}`]);
    if (kind === 's') return NP(`A car goes ${s * t} ${d} in ${t} hours. What is its speed (${v})?`, s, '', 'Speed = distance ÷ time.', [`${s * t} ÷ ${t} = ${s} ${v}`]);
    return NP(`How many hours does it take to travel ${s * t} ${d} at ${s} ${v}?`, t, '', 'Time = distance ÷ speed.', [`${s * t} ÷ ${s} = ${t} h`]);
  },

  // ---------- Algebra ----------
  missingNum() { const a = rnd(12, 80), b = rnd(5, 60), kind = pick(['+', '−', '×']); if (kind === '+') return NP('Find the missing number.', a, `□ + ${b} = ${a + b}`, 'Do the opposite: take away.', [`${a + b} − ${b} = ${a}`]); if (kind === '−') return NP('Find the missing number.', a + b, `□ − ${b} = ${a}`, 'Do the opposite: add.', [`${a} + ${b} = ${a + b}`]); const x = rnd(2, 12), y = rnd(2, 12); return NP('Find the missing number.', x, `□ × ${y} = ${x * y}`, 'Do the opposite: divide.', [`${x * y} ÷ ${y} = ${x}`]); },
  evalExpr() { const x = rnd(2, 9), a = rnd(2, 6), b = rnd(1, 12), form = pick([[`${a}x + ${b}`, a * x + b], [`${a}x − ${b}`, a * x - b], [`x² + ${b}`, x * x + b], [`${a}(x + ${b})`, a * (x + b)]]); return NP(`If x = ${x}, what is the value?`, form[1], form[0], `Replace x with ${x}, then work it out.`, [`${form[0].replace(/x/g, `(${x})`)} = ${form[1]}`], { data: { neg: true } }); },
  nthTerm() { const d = rnd(2, 7), a = rnd(1, 12), n = pick([10, 20, 50]), seq = [1, 2, 3, 4].map(i => a + d * (i - 1)); return NP(`The pattern ${seq.join(', ')}, … What is the ${n}th term?`, a + d * (n - 1), '', `It goes up by ${d}. nth term = ${d}n ${a - d >= 0 ? '+ ' + (a - d) : '− ' + (d - a)}.`, [`${d} × ${n} ${a - d >= 0 ? '+' : '−'} ${Math.abs(a - d)} = ${a + d * (n - 1)}`]); },

  // ---------- Geometry ----------
  angleType() { const kind = pick(['acute', 'right', 'obtuse', 'straight', 'reflex']), deg = { acute: rnd(20, 80), right: 90, obtuse: rnd(100, 170), straight: 180, reflex: rnd(200, 330) }[kind]; return MC(`What type of angle is this? ${fig(angleSvg(deg))}`, kind, ['acute', 'right', 'obtuse', 'straight', 'reflex'], 'Acute < 90° < obtuse < 180° < reflex. Right = 90°, straight = 180°.', [`${deg}° → ${kind}`]); },
  angleEstimate() { const deg = pick([30, 45, 60, 90, 120, 135, 150]); return MC(`About how big is this angle? ${fig(angleSvg(deg))}`, `${deg}°`, [30, 45, 60, 90, 120, 135, 150].filter(x => Math.abs(x - deg) >= 15).map(x => x + '°'), 'Compare with a right angle (90°), like the corner of a book.', [`${deg}°`]); },
  angleLine() { const a = rnd(25, 155); return NP(`Find x. ${fig(lineAngles(a))}`, 180 - a, '', 'Angles on a straight line add up to 180°.', [`180 − ${a} = ${180 - a}`]); },
  angleTri() { const A = rnd(30, 80), B = rnd(30, 140 - A); return NP(`Find x. ${fig(triSvg(A, B))}`, 180 - A - B, '', 'Angles in a triangle add up to 180°.', [`180 − ${A} − ${B} = ${180 - A - B}`]); },
  polygonAngles() { const n = rnd(5, 10), names = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' }; return NP(`What do the inside angles of a ${names[n]} (${n} sides) add up to, in degrees?`, (n - 2) * 180, '', 'Split it into triangles from one corner: (n − 2) triangles × 180°.', [`(${n} − 2) × 180 = ${(n - 2) * 180}`]); },
  circleParts() { const r = rnd(3, 25), u = U('len'); return Math.random() < .5 ? NP(`A circle has radius ${r} ${u}. What is its diameter (${u})?`, 2 * r, '', 'Diameter = 2 × radius.', [`2 × ${r} = ${2 * r}`]) : NP(`A circle has diameter ${2 * r} ${u}. What is its radius (${u})?`, r, '', 'Radius = half the diameter.', [`${2 * r} ÷ 2 = ${r}`]); },
  coordinates({ quads = 1 } = {}) { const lo = quads === 1 ? 0 : -6, x = rnd(lo, 6), y = rnd(lo, 6); if (!x && !y) return GEN_EXPLORE.coordinates({ quads }); return MC(`What are the coordinates of the point? ${fig(gridPoint(x, y, quads))}`, `(${x}, ${y})`, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y - 1})`, `(${-x}, ${y})`], 'Along the corridor (x), then up the stairs (y).', [`(${x}, ${y})`]); },
  solidFEV() { const s = pick([['cube', 6, 12, 8], ['cuboid', 6, 12, 8], ['square pyramid', 5, 8, 5], ['triangular prism', 5, 9, 6], ['tetrahedron (triangle pyramid)', 4, 6, 4]]), ask = pick(['faces', 'edges', 'vertices']), v = { faces: s[1], edges: s[2], vertices: s[3] }[ask]; return numMC(`How many ${ask} does a ${s[0]} have?`, v, 6, 'Faces are flat surfaces, edges are lines, vertices are corners.', [`${s[0]}: ${s[1]} faces, ${s[2]} edges, ${s[3]} vertices`]); },
  symmetryLines() { const n = rnd(3, 8), names = { 3: 'equilateral triangle', 4: 'square', 5: 'regular pentagon', 6: 'regular hexagon', 7: 'regular heptagon', 8: 'regular octagon' }; return numMC(`How many lines of symmetry does a ${names[n]} have?`, n, 4, 'A regular shape has as many lines of symmetry as sides.', [`${n} sides → ${n} lines`]); },

  // ---------- Measurement ----------
  units() {
    const c = pick(conversions()), big = Math.random() < .5, v = c[2] > 1000 ? rnd(1, 3) : rnd(2, 15) + (Math.random() < .4 ? .5 : 0);
    return big ? NP(`Convert ${v} ${c[0]} to ${c[1]}.`, r2(v * c[2]), '', `1 ${c[0]} = ${fmt(c[2])} ${c[1]}.`, [`${v} × ${c[2]} = ${r2(v * c[2])}`], { data: { dot: true } })
      : NP(`Convert ${r2(v * c[2])} ${c[1]} to ${c[0]}.`, v, '', `Divide by ${c[2]}.`, [`${r2(v * c[2])} ÷ ${c[2]} = ${v}`], { data: { dot: true } });
  },
  perimeter() { const w = rnd(3, 20), h = rnd(2, 14), u = U('len'); return NP(`What is the perimeter of this rectangle (${u})? ${fig(rectSvg(w, h))}`, 2 * (w + h), '', 'Perimeter = distance all the way round: add all four sides.', [`2 × (${w} + ${h}) = ${2 * (w + h)} ${u}`]); },
  areaRect() { const w = rnd(3, 20), h = rnd(2, 14), a = U('area'); return NP(`What is the area of this rectangle (${a})? ${fig(rectSvg(w, h))}`, w * h, '', 'Area = length × width.', [`${w} × ${h} = ${w * h} ${a}`]); },
  areaShapes() {
    const k = pick(['tri', 'para', 'trap']), u = U('len'), A = U('area');
    if (k === 'tri') { const b = rnd(4, 20) * 2, h = rnd(3, 15); return NP(`What is the area of this triangle (${A})? ${fig(rectSvg(b, h, u, 'tri'))}`, b * h / 2, '', 'Triangle area = ½ × base × height.', [`½ × ${b} × ${h} = ${b * h / 2} ${A}`]); }
    if (k === 'para') { const b = rnd(4, 20), h = rnd(3, 15); return NP(`What is the area of this parallelogram (${A})? ${fig(rectSvg(b, h, u, 'para'))}`, b * h, '', 'Parallelogram area = base × height.', [`${b} × ${h} = ${b * h} ${A}`]); }
    const a = rnd(3, 12), b = a + rnd(2, 10), h = rnd(2, 10) * 2, T = U('trap'); return NP(`A ${T} has parallel sides ${a} ${u} and ${b} ${u} and height ${h} ${u}. What is its area (${A})?`, (a + b) * h / 2, '', `${T[0].toUpperCase() + T.slice(1)} area = ½ × (a + b) × h.`, [`½ × (${a} + ${b}) × ${h} = ${(a + b) * h / 2}`]);
  },
  circleMeasure() { const r = 7 * rnd(1, 4), area = Math.random() < .5, u = U('len'), A = U('area'); return area ? NP(`Using π = 22/7, find the area of a circle with radius ${r} ${u} (${A}).`, 22 * r * r / 7, '', 'Area = π r².', [`22/7 × ${r} × ${r} = ${22 * r * r / 7}`]) : NP(`Using π = 22/7, find the circumference of a circle with radius ${r} ${u} (${u}).`, 44 * r / 7, '', 'Circumference = 2 π r.', [`2 × 22/7 × ${r} = ${44 * r / 7}`]); },
  volume() { const l = rnd(2, 12), w = rnd(2, 10), h = rnd(2, 10), sa = Math.random() < .35, u = U('len'), B = U('box'); return sa ? NP(`A ${B} is ${l} ${u} × ${w} ${u} × ${h} ${u}. What is its surface area (${U('area')})?`, 2 * (l * w + w * h + l * h), '', 'Surface area = 2(lw + wh + lh).', [`2 × (${l * w} + ${w * h} + ${l * h}) = ${2 * (l * w + w * h + l * h)}`]) : NP(`A ${B} is ${l} ${u} × ${w} ${u} × ${h} ${u}. What is its volume (${U('vol')})?`, l * w * h, '', 'Volume = length × width × height.', [`${l} × ${w} × ${h} = ${l * w * h}`]); },
  time24() {
    if (Math.random() < .5) { const h = rnd(13, 23), m = pick([0, 15, 30, 45, 5, 50]), want = `${h - 12}:${String(m).padStart(2, '0')} pm`; return MC(`${E(`${h}:${String(m).padStart(2, '0')}`)} in 12-hour time is…`, want, [`${h - 10}:${String(m).padStart(2, '0')} pm`, `${h - 12}:${String(m).padStart(2, '0')} am`, `${h}:${String(m).padStart(2, '0')} pm`], 'For afternoon times, take away 12.', [want]); }
    const h1 = rnd(7, 15), m1 = pick([0, 10, 15, 20, 30, 40, 45]), dur = rnd(25, 170), t2 = h1 * 60 + m1 + dur, f = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    return NP(`A train leaves at ${f(h1 * 60 + m1)} and arrives at ${f(t2)}. How many minutes is the journey?`, dur, '', 'Count up to the next hour, then whole hours, then the extra minutes.', [`${dur} minutes`]);
  },
  profitLoss() { const cp = rnd(5, 45) * 20, p = pick([10, 20, 25, 5]), profit = Math.random() < .6, sp = profit ? cp * (100 + p) / 100 : cp * (100 - p) / 100; return NP(`A shopkeeper buys a toy for ${money(cp)} and sells it for ${money(sp)}. What is the ${profit ? 'profit' : 'loss'}?`, Math.abs(sp - cp), '', profit ? 'Profit = selling price − cost price.' : 'Loss = cost price − selling price.', [`${money(Math.abs(sp - cp))} = ${p}% of ${money(cp)}`]); },
  simpleInterest() { const P = rnd(2, 50) * 1000, R = pick([4, 5, 6, 8, 10, 12]), T = rnd(1, 5); return NP(`Find the simple interest on ${money(P)} at ${R}% a year for ${T} year${T > 1 ? 's' : ''}.`, P * R * T / 100, '', 'SI = P × R × T ÷ 100.', [`${P} × ${R} × ${T} ÷ 100 = ${money(P * R * T / 100)}`]); },

  // ---------- Data and probability ----------
  meanMedian() {
    const n = pick([5, 5, 6, 7]), arr = Array.from({ length: n }, () => rnd(1, 20)), kind = pick(['mean', 'median', 'mode', 'range']), s = [...arr].sort((a, b) => a - b);
    if (kind === 'mean') { const tot = arr.reduce((a, b) => a + b, 0), adj = n - (tot % n); arr[0] += tot % n ? adj : 0; const t2 = arr.reduce((a, b) => a + b, 0); return NP(`Find the mean of: ${arr.join(', ')}`, t2 / n, '', 'Mean = total ÷ how many numbers.', [`${t2} ÷ ${n} = ${t2 / n}`]); }
    if (kind === 'median') { if (n % 2 === 0) arr.pop(); const s2 = [...arr].sort((a, b) => a - b); return NP(`Find the median of: ${arr.join(', ')}`, s2[(s2.length - 1) / 2], '', 'Put them in order and take the middle one.', [s2.join(', ')]); }
    if (kind === 'mode') { arr[1] = arr[0]; arr[3 % n] = arr[0]; const cnt = {}; arr.forEach(v => cnt[v] = (cnt[v] || 0) + 1); const mode = +Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0]; return NP(`Find the mode of: ${shuffle(arr).join(', ')}`, mode, '', 'The mode is the number that appears most often.', [`${mode} appears ${cnt[mode]} times`]); }
    return NP(`Find the range of: ${arr.join(', ')}`, s[n - 1] - s[0], '', 'Range = biggest − smallest.', [`${s[n - 1]} − ${s[0]} = ${s[n - 1] - s[0]}`]);
  },
  readBar() {
    const labels = shuffle(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).slice(0, 4).sort((a, b) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(a) - ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(b)), vals = labels.map(() => rnd(2, 12) * 5), i = rnd(0, 3), j = (i + rnd(1, 3)) % 4;
    return Math.random() < .5 ? numMC(`Books borrowed from the library. How many on ${labels[i]}? ${fig(barChart(labels, vals))}`, vals[i], 15, 'Read across from the top of the bar to the scale.', [`${labels[i]}: ${vals[i]}`])
      : NP(`How many more books on ${labels[i]} than on ${labels[j]}? ${fig(barChart(labels, vals))}`, Math.abs(vals[i] - vals[j]), '', 'Read both bars, then subtract.', [`${vals[i]} − ${vals[j]}`], { data: { neg: true } });
  },
  pieRead() {
    const parts = pick([[.5, .25, .25], [.25, .25, .5], [.5, .125, .125, .25], [.75, .25], [.25, .125, .125, .5]]), cols = ['#4dabf7', '#ff8a3d', '#51cf66', '#9775fa'], names = ['Cricket', 'Football', 'Kabaddi', 'Chess'], total = pick([40, 80, 120, 200]), i = rnd(0, parts.length - 1);
    return NP(`${total} students chose a favourite sport. How many chose ${names[i]}? ${fig(`<div class="piewrap">${pieSvg(parts, cols)}<ul class="key">${parts.map((p, k) => `<li><i style="background:${cols[k]}"></i>${names[k]}</li>`).join('')}</ul></div>`)}`, total * parts[i], '', 'What fraction of the circle is it? Take that fraction of the total.', [`${parts[i]} × ${total} = ${total * parts[i]}`]);
  },
  probability() {
    const r = rnd(1, 6), b = rnd(1, 6), g = rnd(0, 4), tot = r + b + g, want = pick(['red', 'blue']), k = want === 'red' ? r : b, G = gcd(k, tot);
    const balls = `<div class="bag">${'<i class="rb"></i>'.repeat(r)}${'<i class="bb"></i>'.repeat(b)}${'<i class="gb"></i>'.repeat(g)}</div>`;
    return MC(`A bag has ${r} red, ${b} blue${g ? ` and ${g} green` : ''} balls. You pick one without looking. What is the probability it is ${want}? ${fig(balls)}`, `${k / G}/${tot / G}`, [`${k}/${tot + 1}`, `${tot - k}/${tot}`, `1/${k}`, `${k}/${tot - k || 1}`].map(x => x), 'Probability = favourable outcomes ÷ total outcomes.', [`${k}/${tot}${G > 1 ? ` = ${k / G}/${tot / G}` : ''}`]);
  },
  chanceWords() {
    const items = [['The sun will rise tomorrow.', 'certain'], ['You roll a 7 on a normal dice.', 'impossible'], ['A coin lands on heads.', 'even chance'], ['It will snow in Mumbai in May.', 'unlikely'], ['You pick a red card from a pack with 40 red and 2 black cards.', 'likely']];
    const [q, a] = pick(items); return MC(`How likely is this? "${q}"`, a, ['impossible', 'unlikely', 'even chance', 'likely', 'certain'], 'Think: never, not often, half the time, most of the time, always?', [a]);
  },

  // ---------- Vedic (Explorers) ----------
  yavadunam() {
    const n = pick([rnd(91, 99), rnd(101, 109)]), d = n - 100, ans = n * n, sq = d * d;
    return { template: 'steps', prompt: E(`${n}²`), answer: ans, say: `${n} squared`, data: { steps: [{ html: `${n} is ${Math.abs(d)} ${d < 0 ? 'below' : 'above'} 100. Left part: ${n} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ?`, answer: n + d }, { html: `Right part: ${Math.abs(d)}² = ? (write as two digits)`, answer: sq }, { html: `${n + d} | ${String(sq).padStart(2, '0')} → ${n}² = ?`, answer: ans }] },
      hint: 'Yavadunam: whatever the gap from 100, move the number by the same amount again, then add the gap squared.', solution: [`${n + d} | ${String(sq).padStart(2, '0')} = ${ans}`] };
  },
  ekanyunena() {
    const n = rnd(12, 98), nines = 99;
    return { template: 'steps', prompt: E(`${n} × ${nines}`), answer: n * nines, data: { steps: [{ html: `Left part: one less than ${n} = ?`, answer: n - 1 }, { html: `Right part: 99 − ${n - 1} = ?`, answer: 99 - (n - 1) }, { html: `${n - 1} | ${String(100 - n).padStart(2, '0')} → ${n} × 99 = ?`, answer: n * 99 }] },
      hint: 'Ekanyunena Purvena: write one less than the number, then what makes that up to 99.', solution: [`${n - 1}${String(100 - n).padStart(2, '0')}`] };
  },
  beejank() {
    const a = rnd(23, 98), b = rnd(12, 79), ds = x => { while (x > 9) x = String(x).split('').reduce((s, c) => s + +c, 0); return x; }, wrong = a * b + pick([10, -10, 1, 9, 100]);
    const shown = Math.random() < .5 ? a * b : wrong, ok = shown === a * b;
    return MC(`Use digit sums (Beejank) to check: is ${E(`${a} × ${b} = ${shown}`)} right?`, ok ? 'Probably right' : 'Wrong', ['Probably right', 'Wrong'], 'Digit-sum each number down to one digit. Multiply the digit sums of the two numbers and compare with the digit sum of the answer.', [`${ds(a)} × ${ds(b)} = ${ds(a) * ds(b)} → ${ds(ds(a) * ds(b))}`, `answer → ${ds(shown)}`, ok ? 'They match.' : 'They do not match, so it is wrong.']);
  },

  // ---------- Abacus 3–8, flash mental maths ----------
  abacusFriends({ kind = 'small' } = {}) {
    if (kind === 'small') { const s = rnd(1, 4), add = rnd(5 - s, 4); return { template: 'abacus', prompt: `The abacus shows ${s}. Add ${add}. (Use small friends: + ${add} = + 5 − ${5 - add})`, answer: s + add, data: { rods: 1, start: s }, hint: `Not enough bottom beads? Bring down the 5-bead and push away ${5 - add}.`, solution: [`${s} + ${add} = ${s + add}`] }; }
    if (kind === 'big') { const s = rnd(1, 8) * 10 + rnd(1, 9), o = s % 10, add = rnd(10 - o, 9); if (s + add > 99) return GEN_EXPLORE.abacusFriends({ kind }); return { template: 'abacus', prompt: `The abacus shows ${s}. Add ${add}. (Big friends: + ${add} = + 10 − ${10 - add})`, answer: s + add, data: { rods: 2, start: s }, hint: `Add 1 on the tens rod and take ${10 - add} from the ones rod.`, solution: [`${s} + ${add} = ${s + add}`] }; }
    const s = rnd(105, 850), add = rnd(15, 140); return { template: 'abacus', prompt: `The abacus shows ${s}. Add ${add}.`, answer: s + add, data: { rods: 3, start: s }, hint: 'Work from the left: hundreds, tens, then ones.', solution: [`${s} + ${add} = ${s + add}`] };
  },
  flash({ count = 4, digits = 1, ms = 1200, minus = false } = {}) {
    const nums = []; let tot = 0;
    for (let i = 0; i < count; i++) { let v = rnd(10 ** (digits - 1), 10 ** digits - 1); if (minus && i && Math.random() < .4 && tot - v >= 0) v = -v; nums.push(v); tot += v; }
    return { template: 'flash', prompt: 'Watch the numbers, add them in your head, then type the total.', answer: tot, data: { nums, ms }, hint: 'Picture the abacus beads moving as each number appears.', solution: [nums.map((v, i) => i && v > 0 ? '+ ' + v : v < 0 ? '− ' + -v : v).join(' ') + ' = ' + tot] };
  },

  // ---------- Bar models, speed, puzzles ----------
  barUnits() {
    const kind = pick(['frac', 'ratio', 'beforeafter']);
    if (kind === 'frac') { const n = rnd(3, 6), k = rnd(1, n - 1), u = rnd(3, 12), [name] = shuffle(['Riya', 'Kabir', 'Meera']); return { template: 'bar', prompt: `${name} spent ${k}/${n} of her money and has ${money((n - k) * u)} left. How much did she have at first?`, answer: n * u, data: { kind: 'units', n, shade: k, label: `${money((n - k) * u)} left`, q: 'money at first' }, hint: `The ${n - k} unshaded units are ${money((n - k) * u)}, so 1 unit = ${money(u)}.`, solution: [`1 unit = ${(n - k) * u} ÷ ${n - k} = ${u}`, `${n} units = ${money(n * u)}`] }; }
    if (kind === 'ratio') { const a = rnd(1, 4), b = rnd(2, 5), u = rnd(4, 15); if (a === b) return GEN_EXPLORE.barUnits(); return { template: 'bar', prompt: `Boys and girls are in the ratio ${a} : ${b}. There are ${(a + b) * u} children. How many girls?`, answer: b * u, data: { kind: 'units', n: a + b, shade: a, label: `${(a + b) * u} children`, q: 'girls' }, hint: `${a + b} units = ${(a + b) * u}, so 1 unit = ${u}.`, solution: [`1 unit = ${u}`, `girls: ${b} × ${u} = ${b * u}`] }; }
    const x = rnd(10, 40), give = rnd(3, 9); return { template: 'bar', prompt: `Aarav and Ira had the same number of stickers. Aarav gave away ${give} and now has ${x - give}. How many does Ira have?`, answer: x, data: { kind: 'units', n: 1, shade: 0, label: `${x - give} + ${give}`, q: 'Ira (same as Aarav at first)' }, hint: 'Before giving any away, they had the same amount.', solution: [`${x - give} + ${give} = ${x}`] };
  },
  mul12() { const n = rnd(12, 99); return { q: `${n} × 12`, answer: n * 12 }; },
  sqDrill() { const n = rnd(11, 30); return { q: `${n}²`, answer: n * n, }; },
  addSubDrill() { const a = rnd(20, 99), b = rnd(10, 99), s = Math.random() < .5; return s && a > b ? { q: `${a} − ${b}`, answer: a - b } : { q: `${a} + ${b}`, answer: a + b }; },
  magicSquare() {
    const base = [[2, 7, 6], [9, 5, 1], [4, 3, 8]], k = rnd(0, 5), rot = shuffle([0, 1, 2, 3])[0];
    let g = base.map(r => r.map(v => v + k)); for (let i = 0; i < rot; i++) g = g[0].map((_, c) => g.map(r => r[c]).reverse());
    const i = rnd(0, 2), j = rnd(0, 2), ans = g[i][j], sum = 15 + 3 * k;
    return NP(`Every row, column and diagonal adds up to ${sum}. What is the missing number? <div class="magic">${g.map((r, a) => r.map((v, b) => `<b class="${a === i && b === j ? 'qm' : ''}">${a === i && b === j ? '?' : v}</b>`).join('')).join('')}</div>`, ans, '', `Use a row or column that has the gap: ${sum} − the other two.`, [`${sum} − ${g[i].filter((_, b) => b !== j).join(' − ')} = ${ans}`]);
  }
};
function numMCv(prompt, ans, wrongs, hint, sol) { return MC(prompt, fmt(ans), wrongs.map(w => Number.isInteger(+w) ? fmt(+w) : String(+w)), hint, sol); }
