// "Learn first" explainers for Grades 9–12.
import { F, T, fr, big, p, mk, alt, no, yes, cmp, steps, box, table } from './learn_kit.js';
import { U, money } from '../core/region.js';

const INK = '#1d3557';
const sup = n => `<sup>${n}</sup>`;
// Right-angled triangle with side labels: [bottom, left, slanted], optional angle label at the bottom-right corner.
const rtri = (b, l, h, ang = '') => `<svg class="lpic" viewBox="-70 0 310 160" width="300" role="img" aria-label="right-angled triangle"><polygon points="30,130 210,130 30,25" fill="#e7f5ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M30 116 H44 V130" fill="none" stroke="#ff6b4a" stroke-width="2.5"/>
  <text x="120" y="152" font-size="15" font-weight="700" text-anchor="middle" fill="#1971c2">${b}</text><text x="22" y="82" font-size="15" font-weight="700" text-anchor="end" fill="#1971c2">${l}</text><text x="130" y="68" font-size="15" font-weight="700" fill="#c92a2a">${h}</text>
  ${ang ? `<path d="M182 130 A28 28 0 0 0 186 116" fill="none" stroke="#ff6b4a" stroke-width="2.5"/><text x="166" y="122" font-size="14" font-weight="700" fill="#ff6b4a">${ang}</text>` : ''}</svg>`;
// Plot functions on a small grid. fns: [[f, colour]]; pts: [[x, y, label]].
let plotN = 0;
function plot(fns, pts = [], [x0, x1, y0, y1] = [-6, 6, -6, 6]) {
  const id = 'lpc' + (++plotN), W = 260, H = 220, X = x => 20 + (x - x0) / (x1 - x0) * (W - 40), Y = y => 10 + (y1 - y) / (y1 - y0) * (H - 30), g = [];
  for (let x = Math.ceil(x0); x <= x1; x++) g.push(`<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="#f1f3f5"/>`);
  for (let y = Math.ceil(y0); y <= y1; y++) g.push(`<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="#f1f3f5"/>`);
  g.push(`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="${INK}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="${INK}" stroke-width="2"/>`);
  fns.forEach(([f, c]) => { const d = []; for (let i = 0; i <= 120; i++) { const x = x0 + (x1 - x0) * i / 120, y = f(x); if (y >= y0 - 2 && y <= y1 + 2) d.push(`${d.length ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(Math.max(y0 - 2, Math.min(y1 + 2, y))).toFixed(1)}`); } g.push(`<path d="${d.join(' ')}" fill="none" stroke="${c}" stroke-width="3" clip-path="url(#${id})"/>`); });
  pts.forEach(([x, y, l]) => g.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="#ff6b4a"/><text x="${X(x) + 8}" y="${Y(y) - 8}" font-size="13" font-weight="700" fill="#c92a2a" paint-order="stroke" stroke="#fff" stroke-width="4">${l}</text>`));
  return `<svg class="lpic" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="graph"><clipPath id="${id}"><rect x="20" y="10" width="${W - 40}" height="${H - 30}"/></clipPath>${g.join('')}</svg>`;
}
// Box plot from five numbers on a 0–50 scale.
const boxPlot = (mn, q1, md, q3, mx, top = 50) => { const X = v => 20 + v / top * 260;
  return `<svg class="lpic" viewBox="0 0 300 100" width="300" role="img" aria-label="box plot"><line x1="${X(mn)}" y1="40" x2="${X(q1)}" y2="40" stroke="${INK}" stroke-width="2.5"/><line x1="${X(q3)}" y1="40" x2="${X(mx)}" y2="40" stroke="${INK}" stroke-width="2.5"/>
  <rect x="${X(q1)}" y="22" width="${X(q3) - X(q1)}" height="36" fill="#d0ebff" stroke="${INK}" stroke-width="2.5"/><line x1="${X(md)}" y1="22" x2="${X(md)}" y2="58" stroke="#c92a2a" stroke-width="3"/>
  <line x1="${X(mn)}" y1="30" x2="${X(mn)}" y2="50" stroke="${INK}" stroke-width="2.5"/><line x1="${X(mx)}" y1="30" x2="${X(mx)}" y2="50" stroke="${INK}" stroke-width="2.5"/>
  ${[[mn, 'min'], [q1, 'Q1'], [md, 'median'], [q3, 'Q3'], [mx, 'max']].map(([v, l], i) => `<text x="${X(v)}" y="${i % 2 ? 16 : 78}" font-size="12" font-weight="700" text-anchor="middle" fill="${INK}">${l} ${v}</text>`).join('')}</svg>`; };
const mat = rows => `<span class="lmat">${rows.map(r => `<span>${r.map(v => String(v).replace('-', '−')).join(' ')}</span>`).join('')}</span>`;

export const G9_12 = {
  // ---------------- Grade 9 ----------------
  'ac-plot': () => ({ title: 'Plotting straight lines', frames: [
    F(`${p('To plot y = 3x + 2, make a table: pick some x values and work out y.')}${table([['x', 0, 1, 2], ['y = 3x + 2', 2, 5, 8]])}${p('Plot the points and join them with a ruler.')}`),
    F(`${plot([[x => 3 * x + 2, '#4dabf7']], [[0, 2, '(0, 2)'], [1, 5, '(1, 5)']], [-3, 3, -4, 9])}${p('In <b>y = mx + c</b>: m is the steepness (gradient), c is where it crosses the y-axis.')}`),
    T(`${p('Your turn. On the line y = 2x + 1, what is y when x = 3?')}`, [7, 6, 9, 5], 0, 'Yes! 2 × 3 + 1 = 7.', 'Not quite. Put x = 3 into 2x + 1.')
  ] }),
  'h-indices': () => ({ title: 'Laws of indices', frames: [
    F(table([['Rule', 'Example'], [`a${sup('m')} × a${sup('n')} = a${sup('m+n')}`, `a${sup(5)} × a${sup(2)} = a${sup(7)}`], [`a${sup('m')} ÷ a${sup('n')} = a${sup('m−n')}`, `x${sup(16)} ÷ x${sup(7)} = x${sup(9)}`], [`(a${sup('m')})${sup('n')} = a${sup('mn')}`, `(a${sup(3)})${sup(4)} = a${sup(12)}`], [`a${sup(0)} = 1`, `7${sup(0)} = 1`]])
      , 'Multiply: add the powers. Divide: subtract the powers. Power of a power: multiply the powers. Anything to the power zero is one.'),
    F(`${p('Why add? a⁵ × a² = (a·a·a·a·a)(a·a): seven a\'s multiplied.')}${cmp(no('Multiply the powers', 'a⁵ × a² = a¹⁰'), yes('Add the powers', 'a⁵ × a² = a⁷'))}`, 'a to the five times a squared is seven a\'s multiplied: add the powers, do not multiply them.'),
    T(`${p('Your turn. Simplify (a³)⁴. What is the power?')}`, [12, 7, 81, 64], 0, 'Yes! Power of a power: 3 × 4 = 12.', 'Not quite. A power of a power: multiply the powers.', 'Your turn. a cubed, all to the power four. What is the power?')
  ] }),
  'h-lineq': () => ({ title: 'Straight-line equations', frames: [
    F(`${big(`gradient = ${fr('change in y', 'change in x')}`)}${p(`Through (−1, 3) and (1, 5): ${fr('5 − 3', '1 − (−1)')} = ${fr(2, 2)} = ${alt(1)}`)}`, 'Gradient is change in y over change in x. Through minus one, three and one, five: two over two, which is one.'),
    F(`${box('<b>y = mx + c</b>: m = gradient, c = y-intercept<br><b>Parallel</b> lines: same gradient<br><b>Perpendicular</b> lines: gradients multiply to −1')}${p(`Perpendicular to gradient 3: ${mk(`−${fr(1, 3)}`)}`)}`, 'Parallel lines have the same gradient. Perpendicular gradients multiply to minus one, so perpendicular to three is minus one third.'),
    T(`${p('Your turn. What is the gradient of the line through (0, 1) and (2, 7)?')}`, [3, 6, 4, '1/3'], 0, 'Yes! (7 − 1) ÷ (2 − 0) = 3.', 'Not quite. Change in y over change in x.')
  ] }),
  'h-rearr': () => ({ title: 'Rearranging formulae', frames: [
    F(`${p('Treat it like solving an equation: do the same to both sides until the letter you want is alone.')}${big('P = 2(l + w)')}${steps(['Divide by 2: P/2 = l + w', `Subtract l: ${alt('w = P/2 − l')}`])}`),
    F(`${big('F = 9C/5 + 32')}${steps(['− 32: F − 32 = 9C/5', '× 5: 5(F − 32) = 9C', `÷ 9: ${alt('C = 5(F − 32)/9')}`])}${p('Undo the last thing done to the letter first.')}`),
    T(`${p('Your turn. Make r the subject of')}${big('C = 2πr')}`, ['r = C/(2π)', 'r = 2πC', 'r = C − 2π', 'r = 2C/π'], 0, 'Yes! Divide both sides by 2π.', 'Not quite. r is multiplied by 2π, so divide by 2π.')
  ] }),
  'h-qfact': () => ({ title: 'Factorising quadratics', frames: [
    F(`${p('x² + bx + c = (x + p)(x + q), where')}${box('p + q = b &nbsp;&nbsp; and &nbsp;&nbsp; p × q = c')}${big('x² − 6x + 8')}${p(`Two numbers that add to −6 and multiply to 8: −2 and −4 → ${alt('(x − 2)(x − 4)')}`)}`),
    F(`${big('x² − x − 42')}${p('Add to −1, multiply to −42: +6 and −7 → (x + 6)(x − 7)')}${p('Check by expanding: x² − 7x + 6x − 42 ✓')}`),
    T(`${p('Your turn. Factorise')}${big('x² + 7x + 12')}`, ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x − 3)(x − 4)'], 0, 'Yes! 3 + 4 = 7 and 3 × 4 = 12.', 'Not quite. Find two numbers that add to 7 and multiply to 12.')
  ] }),
  'h-qsolve': () => ({ title: 'Solving quadratics by factorising', frames: [
    F(`${p('Get everything on one side so it equals <b>0</b>, then factorise.')}${big('x² + 5x − 14 = 0')}${big('(x + 7)(x − 2) = 0')}`),
    F(`${p('If two things multiply to 0, one of them <b>must be 0</b>:')}${box('x + 7 = 0 → x = −7<br>x − 2 = 0 → x = 2')}${p('A quadratic usually has <b>two</b> answers.')}`),
    T(`${p('Your turn. Solve')}${big('x² − 9x + 20 = 0')}`, ['x = 4 or x = 5', 'x = −4 or x = −5', 'x = 2 or x = 10', 'x = 9 or x = 20'], 0, 'Yes! (x − 4)(x − 5) = 0.', 'Not quite. Two numbers adding to −9 and multiplying to 20.')
  ] }),
  'h-qroots': () => ({ title: 'Quadratic graphs: roots', frames: [
    F(`${plot([[x => x * x - 4, '#4dabf7']], [[-2, 0, '−2'], [2, 0, '2']], [-4, 4, -5, 6])}${p('The <b>roots</b> are where the curve crosses the x-axis (where y = 0). They are the solutions of x² − 4 = 0.')}`),
    F(`${p('Factorised form shows the roots straight away: y = (x − 1)(x + 3) crosses at x = 1 and x = −3.')}${p('Note the signs flip: (x + 3) gives −3.')}`),
    T(`${p('Your turn. Where does y = (x − 2)(x + 5) cross the x-axis?')}`, ['x = 2 and x = −5', 'x = −2 and x = 5', 'x = 2 and x = 5', 'x = −10'], 0, 'Yes! Each bracket = 0: x = 2 or x = −5.', 'Not quite. Set each bracket to 0.')
  ] }),
  'h-simul': () => ({ title: 'Simultaneous equations', frames: [
    F(`${p('Two equations, two unknowns. <b>Eliminate</b> one letter by adding or subtracting.')}${box('4x + 2y = 10<br>4x − 3y = 5')}${p('Subtract: (2y) − (−3y) = 5y, and 10 − 5 = 5 → 5y = 5 → <b>y = 1</b>')}`),
    F(`${p(`Put y = 1 back in: 4x + 2 = 10 → 4x = 8 → ${alt('x = 2')}`)}${p('Check in the other one: 4(2) − 3(1) = 5 ✓')}`),
    T(`${p('Your turn. Solve: x + y = 10 and x − y = 4. What is x?')}`, [7, 3, 14, 6], 0, 'Yes! Add them: 2x = 14, so x = 7 (and y = 3).', 'Not quite. Add the two equations: the y\'s cancel.')
  ] }),
  'h-simgr': () => ({ title: 'Simultaneous equations on a graph', frames: [
    F(`${plot([[x => x + 1, '#4dabf7'], [x => 3 - x, '#ff6b4a']], [[1, 2, '(1, 2)']], [-3, 5, -2, 6])}${p('Each equation is a line. The point where they <b>cross</b> works in both equations.')}`),
    F(`${p('y = x + 1 and y = 3 − x cross at (1, 2), so the solution is x = 1, y = 2.')}${p('Check: 1 + 1 = 2 ✓ and 3 − 1 = 2 ✓')}`),
    T(p('Your turn. Two lines cross at (−3, −1). What is the solution?'), ['x = −3, y = −1', 'x = −1, y = −3', 'x = 3, y = 1', 'no solution'], 0, 'Yes! The crossing point gives x and y.', 'Not quite. The point is (x, y).')
  ] }),
  'h-pyth': () => { const u = U('len'); return { title: 'Pythagoras’ theorem', frames: [
    F(`${rtri('a', 'b', 'c (hypotenuse)')}${big('a² + b² = c²')}${p('The <b>hypotenuse</b> c is the longest side, opposite the right angle.')}`),
    F(`${p(`Find the hypotenuse with sides 20 and 21: 400 + 441 = 841, √841 = ${alt(29)}`)}${p(`Find a shorter side: hypotenuse 10, other side 8: 100 − 64 = 36, √36 = ${alt(6)}`)}${p('Longest side: <b>add</b> the squares. Shorter side: <b>subtract</b>.')}`),
    T(p(`Your turn. The two shorter sides are 6 ${u} and 8 ${u}. How long is the hypotenuse?`), [10, 14, 7, 100], 0, 'Yes! 36 + 64 = 100, √100 = 10.', 'Not quite. Square both, add, then square root.')
  ] }; },
  'h-pythw': () => ({ title: 'Pythagoras in real life', frames: [
    F(`${p('A 25 m ladder leans against a wall, with its foot 7 m from the wall.')}${rtri('7 m', 'height?', 'ladder 25 m')}${p('The ladder is the hypotenuse.')}`),
    F(`${p(`height² = 25² − 7² = 625 − 49 = 576 → height = ${alt('24 m')}`)}${p('Look for the right angle: wall and ground, the corner of a rectangle (diagonals), north and east.')}`),
    T(p('Your turn. A rectangle is 5 m by 12 m. How long is its diagonal?'), ['13 m', '17 m', '7 m', '60 m'], 0, 'Yes! 25 + 144 = 169, √169 = 13.', 'Not quite. The diagonal is the hypotenuse: 5² + 12².')
  ] }),
  'h-revpct': () => ({ title: 'Reverse percentages', frames: [
    F(`${p(`After a 20% increase, a price is ${money(96)}. What was it before?`)}${steps([`New price = 120% of the old one`, `1% = ${money(96)} ÷ 120 = ${money(0.8)}`, `100% = ${alt(money(80))}`])}`),
    F(`${p('Quicker: divide by the multiplier. Increase 20% → ÷ 1.2. Decrease 30% → ÷ 0.7.')}${cmp(no('Take 20% of 96', '96 − 19.20 = 76.80'), yes('96 ÷ 1.2', '= 80'))}`),
    T(p(`Your turn. After a 25% increase, a price is ${money(150)}. What was it before?`), [money(120), money(112.5), money(187.5), money(125)], 0, 'Yes! 150 ÷ 1.25 = 120.', 'Not quite. The new price is 125% of the old one: divide by 1.25.')
  ] }),

  // ---------------- Grade 10 ----------------
  'h-surds': () => ({ title: 'Surds', frames: [
    F(`${p('A <b>surd</b> is a square root that is not a whole number, like √2. Keep it exact.')}${box('√a × √b = √(ab)<br>√12 = √4 × √3 = 2√3')}`),
    F(`${p('Add like surds like like terms: √7 + 5√7 = 6√7.')}${p(`Rationalise (no √ on the bottom): multiply top and bottom by the surd.`)}${big(`${fr(7, '√3')} × ${fr('√3', '√3')} = ${fr('7√3', 3)}`)}`, 'Add like surds: root seven plus five root seven is six root seven. To rationalise, multiply top and bottom by root three.'),
    T(`${p('Your turn. Simplify √50.')}`, ['5√2', '25√2', '2√5', '10√5'], 0, 'Yes! √50 = √25 × √2 = 5√2.', 'Not quite. Find a square number that divides 50.')
  ] }),
  'h-vertex': () => ({ title: 'Completing the square and turning points', frames: [
    F(`${big('x² + bx + c = (x + b/2)² − (b/2)² + c')}${p(`x² + 8x − 2: half of 8 is 4 → (x + 4)² − 16 − 2 = ${alt('(x + 4)² − 18')}`)}`),
    F(`${plot([[x => (x + 4) ** 2 - 18, '#4dabf7']], [[-4, -18, '(−4, −18)']], [-10, 2, -20, 6])}${p('The turning point is (−4, −18): flip the sign inside the bracket, keep the number outside.')}`),
    T(`${p('Your turn. Complete the square:')}${big('x² + 6x + 1')}`, ['(x + 3)² − 8', '(x + 3)² + 1', '(x + 6)² − 35', '(x + 3)² − 10'], 0, 'Yes! (x + 3)² = x² + 6x + 9, so subtract 8.', 'Not quite. Half of 6 is 3, and 3² = 9. Then 1 − 9.')
  ] }),
  'h-qform': () => ({ title: 'The discriminant', frames: [
    F(`${big('x = (−b ± √(b² − 4ac)) ÷ 2a')}${p('The part under the root, <b>b² − 4ac</b>, is the <b>discriminant</b>.')}${box('&gt; 0 → 2 real roots<br>= 0 → 1 repeated root<br>&lt; 0 → no real roots')}`),
    F(`${p('4x² − 8x − 6 = 0: a = 4, b = −8, c = −6')}${p(`b² − 4ac = 64 − 4(4)(−6) = 64 + 96 = 160 &gt; 0 → ${alt('2 real roots')}`)}`),
    T(`${p('Your turn. How many real solutions does x² + 2x + 5 = 0 have?')}`, ['none', '1', '2'], 0, 'Yes! 4 − 20 = −16, less than 0.', 'Not quite. Work out b² − 4ac with a = 1, b = 2, c = 5.')
  ] }),
  'h-func': () => ({ title: 'Functions: composite and inverse', frames: [
    F(`${p('A <b>function</b> is a rule: f(x) = 2x + 4. Put the number in for x.')}${p(`f(−2) = 2(−2) + 4 = ${alt(0)}`)}${p('<b>fg(x)</b> means do g first, then f.')}`),
    F(`${p('The <b>inverse</b> f⁻¹ undoes f. Write y = 2x + 1, then make x the subject:')}${p('x = (y − 1)/2, so f⁻¹(x) = (x − 1)/2.')}${p(`f⁻¹(−5) = (−5 − 1)/2 = ${alt('−3')}`)}`),
    T(`${p('Your turn. f(x) = 3x − 1. Find f(4).')}`, [11, 12, 13, 7], 0, 'Yes! 3 × 4 − 1 = 11.', 'Not quite. Replace x with 4.')
  ] }),
  'h-seq': () => ({ title: 'Arithmetic and geometric sequences', frames: [
    F(`${p('<b>Arithmetic</b>: add the same amount d each time. −4, 4, 12, 20 … (d = 8)')}${box('nth term = a + (n − 1)d<br>Sum of n terms = n/2 × (2a + (n − 1)d)')}${p('Sum of 19 terms: 19/2 × (−8 + 18 × 8) = 19/2 × 136 = 1292')}`),
    F(`${p('<b>Geometric</b>: multiply by the same ratio r. 3, 6, 12, 24 … (r = 2)')}${big('nth term = a × rⁿ⁻¹')}${p(`The 6th term = 3 × 2${sup(5)} = ${alt(96)}`)}`, 'Geometric: multiply by the same ratio each time. Term six is three times two to the five, ninety six.'),
    T(`${p('Your turn. What is the 10th term of 5, 8, 11, …?')}`, [32, 35, 30, 38], 0, 'Yes! 5 + 9 × 3 = 32.', 'Not quite. a = 5, d = 3: a + (10 − 1)d.')
  ] }),
  'h-expo': () => ({ title: 'Exponential growth and decay', frames: [
    F(`${box('Growth by r% a year: × (1 + r/100) each year<br>Decay by r%: × (1 − r/100) each year')}${p(`2000 people growing 20% a year, after 2 years: 2000 × 1.2${sup(2)} = ${alt(2880)}`)}`, 'Growth by r percent: multiply by one plus r over a hundred each year. Two thousand times one point two squared is two thousand eight hundred and eighty.'),
    F(`${p('<b>Half-life</b>: the amount halves every fixed time.')}${p('1600 g, halving every 5 days, after 15 days = 3 halvings: 1600 → 800 → 400 → 200 g')}`),
    T(p('Your turn. 800 g halves every 2 days. How much is left after 6 days?'), ['100 g', '200 g', '400 g', '50 g'], 0, 'Yes! 3 halvings: 400, 200, 100.', 'Not quite. 6 days is 3 lots of 2 days.')
  ] }),
  'h-algfr': () => ({ title: 'Algebraic fractions', frames: [
    F(`${p('Same as number fractions: find a common bottom.')}${big(`${fr(1, 'x')} + ${fr(1, 'x + 9')} = ${fr('(x + 9) + x', 'x(x + 9)')} = ${fr('2x + 9', 'x(x + 9)')}`)}`, 'One over x plus one over x plus nine: the common bottom is x times x plus nine. The top is two x plus nine.'),
    F(`${p('To simplify, cancel <b>factors</b> (whole brackets), never single terms.')}${cmp(no('Cancel x terms', '(x + 3)/x → 3'), yes('Cancel a factor', '(x + 3)(x − 1)/(x − 1) = x + 3'))}`),
    T(`${p('Your turn. Write as one fraction:')}${big(`${fr(1, 'x')} + ${fr(1, 'x + 2')}`)}`, [fr('2x + 2', 'x(x + 2)'), fr(2, '2x + 2'), fr(2, 'x(x + 2)'), fr('x + 2', 'x')], 0, 'Yes! (x + 2 + x) over x(x + 2).', 'Not quite. Use the bottom x(x + 2) for both fractions.', 'Your turn. One over x plus one over x plus two, as one fraction.')
  ] }),
  'h-trigs': () => ({ title: 'Trigonometry: finding sides (SOH-CAH-TOA)', frames: [
    F(`${rtri('adjacent', 'opposite', 'hypotenuse', 'θ')}${box('<b>SOH</b>: sin θ = opposite ÷ hypotenuse<br><b>CAH</b>: cos θ = adjacent ÷ hypotenuse<br><b>TOA</b>: tan θ = opposite ÷ adjacent')}`),
    F(`${p('Label the sides from the angle, pick the rule with the two sides you know or want.')}${p(`Hypotenuse 10, θ = 30°, find the opposite: SOH → opp = 10 × sin 30° = 10 × 0.5 = ${alt(5)}`)}`),
    T(p('Your turn. Hypotenuse 12, θ = 30°. Find the opposite side.'), [6, 10.4, 24, 6.9], 0, 'Yes! 12 × sin 30° = 6.', 'Not quite. Opposite and hypotenuse: use sin.')
  ] }),
  'h-triga': () => ({ title: 'Trigonometry: finding angles', frames: [
    F(`${p('To find an angle, use the <b>inverse</b>: sin⁻¹, cos⁻¹, tan⁻¹ (shift on a calculator).')}${p(`Opposite 7, adjacent 10: tan θ = 0.7 → θ = tan⁻¹(0.7) ≈ ${alt('35°')}`)}`),
    F(`${p('Same steps: label sides, choose SOH, CAH or TOA, divide, then inverse.')}`),
    T(p('Your turn. Opposite 5, hypotenuse 10. Find θ.'), ['30°', '60°', '45°', '27°'], 0, 'Yes! sin θ = 0.5, so θ = 30°.', 'Not quite. Opposite and hypotenuse: sin θ = 5 ÷ 10.')
  ] }),
  'h-trigx': () => ({ title: 'Exact trig values', frames: [
    F(table([['', '0°', '30°', '45°', '60°', '90°'], ['sin', 0, fr(1, 2), fr('√2', 2), fr('√3', 2), 1], ['cos', 1, fr('√3', 2), fr('√2', 2), fr(1, 2), 0], ['tan', 0, fr('√3', 3), 1, '√3', '—']]), 'Sine of zero, thirty, forty five, sixty, ninety: zero, a half, root two over two, root three over two, one. Cosine is the same backwards. Tan forty five is one.'),
    F(`${p('Memory tip: sin goes √0/2, √1/2, √2/2, √3/2, √4/2. Cos is the same list backwards. tan = sin ÷ cos.')}`),
    T(`${p('Your turn. What is the exact value of cos 60°?')}`, [fr(1, 2), fr('√3', 2), 1, 0], 0, 'Yes! cos 60° = 1/2.', 'Not quite. Cos is the sin list backwards.', 'Your turn. Exact value of cos sixty degrees?')
  ] }),
  'h-circ': () => ({ title: 'Circle theorems', frames: [
    F(box('A tangent meets a radius at <b>90°</b><br>Angle in a semicircle is <b>90°</b><br>Angle at the centre = <b>2 ×</b> angle at the edge<br>Angles in the same segment are <b>equal</b><br>Opposite angles of a cyclic quadrilateral add to <b>180°</b>')),
    F(`${p('A tangent touches the circle at T. Angle OPT = 35°. Find TOP.')}${steps(['OTP = 90° (tangent meets radius)', `TOP = 180 − 90 − 35 = ${alt('55°')}`])}`),
    T(p('Your turn. The angle at the edge of a circle is 40°. What is the angle at the centre on the same arc?'), ['80°', '20°', '40°', '140°'], 0, 'Yes! The centre angle is double.', 'Not quite. The angle at the centre is twice the angle at the edge.')
  ] }),
  'h-arc': () => { const u = U('len'), a = U('area'); return { title: 'Arcs and sectors', frames: [
    F(`${p('A sector is a "pizza slice" with angle θ. It is θ/360 of the whole circle.')}${box(`Arc length = ${fr('θ', 360)} × 2πr<br>Sector area = ${fr('θ', 360)} × πr²`)}`, 'A sector is theta over three sixty of the circle. Arc length is that fraction of two pi r; area is that fraction of pi r squared.'),
    F(`${p(`r = 6, θ = 120° (a third): area = ⅓ × π × 36 = 12π ≈ ${alt(37.7)} ${a}`)}${p(`r = 6, θ = 60° (a sixth): arc = ⅙ × 12π = 2π ≈ 6.3 ${u}`)}`),
    T(p(`Your turn. A sector has r = 10 and θ = 90°. Find its area to 1 decimal place.`), [78.5, 15.7, 314.2, 31.4], 0, 'Yes! ¼ × π × 100 ≈ 78.5.', 'Not quite. 90° is a quarter of the circle: ¼ × πr².')
  ] }; },
  'h-solid': () => ({ title: 'Cones, spheres and pyramids', frames: [
    F(table([['Solid', 'Volume'], ['Pyramid', '⅓ × base area × height'], ['Cone', '⅓ × πr² × h'], ['Sphere', '⁴⁄₃ × πr³'], ['Hemisphere', '⅔ × πr³']])),
    F(`${p(`Square pyramid, base 5 × 5, height 9: ⅓ × 25 × 9 = ${alt(75)}`)}${p('A pointed solid holds a third of the prism with the same base and height.')}`),
    T(p('Your turn. A cone has r = 3 and h = 10. Find its volume to 1 decimal place.'), [94.2, 282.7, 31.4, 188.5], 0, 'Yes! ⅓ × π × 9 × 10 = 30π ≈ 94.2.', 'Not quite. ⅓ × π × r² × h with r = 3.')
  ] }),
  'h-hist': () => ({ title: 'Histograms', frames: [
    F(`${p('In a histogram the groups can have different widths, so the height is the <b>frequency density</b>:')}${big('frequency density = frequency ÷ group width')}${p('The <b>area</b> of each bar is the frequency.')}`),
    F(`${p(`Group 0–10 with density 1.5: frequency = 1.5 × 10 = ${alt(15)} people`)}`),
    T(p('Your turn. A bar for 20–40 minutes has frequency density 2.5. How many people?'), [50, 2.5, 25, 100], 0, 'Yes! 2.5 × 20 = 50.', 'Not quite. Frequency = density × width (40 − 20).')
  ] }),
  'h-cumf': () => ({ title: 'Cumulative frequency', frames: [
    F(`${table([['Mark', 'Frequency', 'Cumulative'], ['0–10', 12, 12], ['10–20', 14, 26], ['20–30', 3, 29], ['30–40', 11, 40], ['40–50', 10, 50]])}${p('Cumulative frequency is a <b>running total</b>. The last one is the total.')}`),
    F(`${p('50 students: the median is about the 25th. The running total first reaches 25 in <b>10–20</b> (26).')}`),
    T(p('Your turn. Using the table, which group contains the 40th student?'), ['30–40', '40–50', '20–30', '10–20'], 0, 'Yes! The total reaches 40 at the end of 30–40.', 'Not quite. Find where the running total first reaches 40.')
  ] }),
  'h-box': () => ({ title: 'Box plots', frames: [
    F(`${boxPlot(5, 15, 25, 35, 45)}${p('A box plot shows five numbers: minimum, lower quartile (Q1), median, upper quartile (Q3), maximum.')}`),
    F(`${p('<b>Interquartile range</b> (IQR) = Q3 − Q1: the spread of the middle half.')}${p('Range = max − min. Compare two box plots by their medians and IQRs.')}`),
    T(p('Your turn. Q1 = 15 and Q3 = 35. What is the IQR?'), [20, 50, 25, 10], 0, 'Yes! 35 − 15 = 20.', 'Not quite. IQR = upper quartile − lower quartile.')
  ] }),
  'h-gmean': () => ({ title: 'Estimating the mean from grouped data', frames: [
    F(`${table([['Time', 'Midpoint', 'Frequency', 'Mid × freq'], ['0–10', 5, 6, 30], ['10–20', 15, 12, 180], ['20–30', 25, 8, 200], ['30–40', 35, 2, 70], ['Total', '', 28, 480]])}`),
    F(`${p(`Estimated mean = 480 ÷ 28 ≈ ${alt(17.1)}`)}${p('It is only an <b>estimate</b>, because we use the middle of each group instead of the real values.')}`),
    T(p('Your turn. Groups: 0–10 (4 people), 10–20 (6 people). Estimate the mean.'), [11, 10, 15, 5], 0, 'Yes! (5 × 4 + 15 × 6) ÷ 10 = 110 ÷ 10 = 11.', 'Not quite. Use midpoints 5 and 15, multiply by frequency, add, divide by 10.')
  ] }),
  'h-tree': () => ({ title: 'Tree diagrams', frames: [
    F(`${p('A bag has 4 red and 2 blue. Take one, put it back, take another.')}${table([['1st', '2nd', 'Probability'], ['Red (4/6)', 'Red (4/6)', '4/6 × 4/6 = 16/36'], ['Red', 'Blue (2/6)', '8/36'], ['Blue (2/6)', 'Red', '8/36'], ['Blue', 'Blue', '4/36']])}`, 'Red then red: four sixths times four sixths, sixteen thirty-sixths.'),
    F(`${box('<b>Along</b> the branches: multiply<br><b>Between</b> outcomes: add')}${p(`P(both red) = 16/36 = ${alt('4/9')}`)}${p('Without putting it back, the second fractions change (one fewer ball).')}`),
    T(p('Your turn. A fair coin is flipped twice. What is P(heads, heads)?'), [fr(1, 4), fr(1, 2), fr(2, 4), fr(1, 3)], 0, 'Yes! ½ × ½ = ¼.', 'Not quite. Multiply along the branches.', 'Your turn. Probability of two heads?')
  ] }),
  'h-vennp': () => ({ title: 'Venn diagram probability', frames: [
    F(`${p('Use the numbers in each part of the Venn diagram. P = number in the part ÷ total.')}${box('Football only 10, both 5, Tennis only 8, neither 7 → total 30')}${p('P(both) = 5/30 = 1/6. P(NOT Football) = (8 + 7)/30 = 1/2.')}`),
    F(`${p('"<b>Given</b> they play Tennis": only look inside the Tennis circle. P(Football | Tennis) = 5/13.')}`),
    T(p('Your turn. Using the numbers above, what is P(Tennis)?'), [fr(13, 30), fr(8, 30), fr(5, 30), fr(23, 30)], 0, 'Yes! 8 + 5 = 13 out of 30.', 'Not quite. Tennis includes Tennis only and both.', 'Your turn. Probability of tennis?')
  ] }),
  'h-indep': () => ({ title: 'Independent events', frames: [
    F(`${p('<b>Independent</b>: one does not affect the other.')}${box('P(A and B) = P(A) × P(B)<br>P(at least one) = 1 − P(neither)')}`),
    F(`${p('P(A) = 0.3, P(B) = 0.5:')}${p(`P(neither) = 0.7 × 0.5 = 0.35, so P(at least one) = 1 − 0.35 = ${alt(0.65)}`)}`),
    T(p('Your turn. P(A) = 0.5, P(B) = 0.4, independent. Find P(A and B).'), [0.2, 0.9, 0.1, 0.45], 0, 'Yes! 0.5 × 0.4 = 0.2.', 'Not quite. "And" for independent events: multiply.')
  ] }),
  'h-comp': () => ({ title: 'Compound interest', frames: [
    F(`${p('With <b>compound</b> interest, each year earns interest on last year\'s interest too.')}${big('Amount = P × (1 + r/100)ⁿ')}${p(`${money(2000)} at 3% for 2 years: 2000 × 1.03${sup(2)} = ${alt(money(2121.8))}`)}`, 'Amount is P times one plus r over a hundred to the power n. Two thousand times one point nought three squared.'),
    F(`${p('Simple interest would give 2000 + 2 × 60 = 2120. Compound gives a little more.')}`),
    T(p(`Your turn. ${money(1000)} at 10% compound interest for 2 years.`), [money(1210), money(1200), money(1100), money(1020)], 0, 'Yes! 1000 → 1100 → 1210.', 'Not quite. 10% on 1000, then 10% on the new amount.')
  ] }),
  'h-depr': () => ({ title: 'Depreciation', frames: [
    F(`${p('<b>Depreciation</b>: something loses value by a percentage each year.')}${big('Value = start × (1 − r/100)ⁿ')}${p(`${money(23000)} losing 10% a year, after 2 years: 23000 × 0.9${sup(2)} = ${alt(money(18630))}`)}`, 'Value is start times one minus r over a hundred to the power n.'),
    T(p(`Your turn. A ${money(10000)} car loses 20% each year. What is it worth after 2 years?`), [money(6400), money(6000), money(8000), money(9600)], 0, 'Yes! 10000 × 0.8 × 0.8 = 6400.', 'Not quite. Multiply by 0.8 twice.')
  ] }),

  // ---------------- Grade 11 ----------------
  'h-logs': () => ({ title: 'Logarithms', frames: [
    F(`${p('A logarithm asks: <b>what power?</b>')}${big(`log₃ 9 = 2 because 3${sup(2)} = 9`)}${p('log_b x = y means bʸ = x.')}`, 'A logarithm asks what power. Log base three of nine is two, because three squared is nine.'),
    F(table([['Law', ''], ['log(ab)', 'log a + log b'], ['log(a ÷ b)', 'log a − log b'], ['log(aⁿ)', 'n log a']]), 'Log of a times b is log a plus log b. Log of a over b is log a minus log b. Log of a to the n is n log a.'),
    T(p('Your turn. What is log₂ 32?'), [5, 16, 4, 30], 0, 'Yes! 2⁵ = 32.', 'Not quite. 2 to what power makes 32?', 'Your turn. Log base two of thirty two?')
  ] }),
  'h-binom': () => ({ title: 'Binomial expansion', frames: [
    F(`${p('Coefficients of (1 + x)ⁿ come from <b>Pascal\'s triangle</b>: each number is the sum of the two above.')}${box('1<br>1 1<br>1 2 1<br>1 3 3 1<br>1 4 6 4 1<br>1 5 10 10 5 1<br>1 6 15 20 15 6 1')}`),
    F(`${p('(1 + x)⁶ = 1 + 6x + 15x² + 20x³ + 15x⁴ + 6x⁵ + x⁶')}${p('Coefficient of x² is 15. Or use nCr: ⁶C₂ = 15.')}`),
    T(p('Your turn. What is the coefficient of x² in (1 + x)⁴?'), [6, 4, 8, 16], 0, 'Yes! Row 1 4 6 4 1.', 'Not quite. Use the row 1 4 6 4 1.')
  ] }),
  'h-poly': () => ({ title: 'Remainder and factor theorems', frames: [
    F(`${p('<b>Remainder theorem</b>: dividing f(x) by (x − a) leaves remainder f(a).')}${p('f(x) = 3x³ − 4x² − 2x − 8 ÷ (x − 3): f(3) = 81 − 36 − 6 − 8 = ' + alt(31))}`),
    F(`${p('<b>Factor theorem</b>: if f(a) = 0, then (x − a) is a factor.')}${p('x³ − 2x² − 8x at x = −2: −8 − 8 + 16 = 0 → (x + 2) is a factor.')}`),
    T(p('Your turn. Find the remainder when x² − 5x + 6 is divided by (x − 1).'), [2, 0, 12, 1], 0, 'Yes! f(1) = 1 − 5 + 6 = 2.', 'Not quite. Work out f(1).')
  ] }),
  'h-sine': () => ({ title: 'The sine rule', frames: [
    F(`${big(`${fr('a', 'sin A')} = ${fr('b', 'sin B')} = ${fr('c', 'sin C')}`)}${p('Each side goes with the angle <b>opposite</b> it. Use it when you know a side and its opposite angle.')}`, 'a over sine A equals b over sine B equals c over sine C. Each side goes with its opposite angle.'),
    F(`${p('a = 10, A = 30°, B = 45°. Find b:')}${p(`b = 10 × sin 45° ÷ sin 30° = 10 × 0.707 ÷ 0.5 ≈ ${alt(14.1)}`)}`),
    T(p('Your turn. a = 8, A = 30°, B = 90°. Find b.'), [16, 4, 8, 13.9], 0, 'Yes! 8 × 1 ÷ 0.5 = 16.', 'Not quite. b = a × sin B ÷ sin A.')
  ] }),
  'h-cosine': () => ({ title: 'The cosine rule', frames: [
    F(`${big('a² = b² + c² − 2bc cos A')}${p('Use it with two sides and the angle <b>between</b> them, or with all three sides to find an angle.')}`),
    F(`${p('b = 5, c = 7, A = 60°:')}${p(`a² = 25 + 49 − 70 × 0.5 = 39 → a ≈ ${alt(6.2)}`)}`),
    T(p('Your turn. b = 3, c = 4, A = 90°. Find a.'), [5, 7, 25, 1], 0, 'Yes! cos 90° = 0, so it is just Pythagoras.', 'Not quite. cos 90° = 0.')
  ] }),
  'h-triar': () => ({ title: 'Area of a triangle: ½ab sin C', frames: [
    F(`${big('Area = ½ × a × b × sin C')}${p('a and b are two sides, C is the angle <b>between</b> them.')}`),
    F(`${p(`Sides 9 and 10 with 101° between: ½ × 9 × 10 × sin 101° ≈ ${alt(44.2)}`)}`),
    T(p('Your turn. Sides 6 and 10 with 30° between them. Find the area.'), [15, 30, 60, 26], 0, 'Yes! ½ × 6 × 10 × 0.5 = 15.', 'Not quite. sin 30° = 0.5.')
  ] }),
  'h-vec': () => ({ title: 'Vectors', frames: [
    F(`${p('A vector (x, y) moves x across and y up.')}${box('Add: add the parts. (5, 5) + (4, −4) = (9, 1)<br>Multiply by a number: 2 × (3, −1) = (6, −2)<br>Length: √(x² + y²)')}`),
    F(`${p('a − b means a + (−b): flip the signs of b, then add.')}`),
    T(p('Your turn. What is 3 × (2, −1)?'), ['(6, −3)', '(5, 2)', '(6, −1)', '(2, −3)'], 0, 'Yes! Multiply both parts by 3.', 'Not quite. Multiply each part by 3.')
  ] }),
  'h-rad': () => ({ title: 'Radians', frames: [
    F(`${big('π radians = 180°')}${box('Degrees → radians: × π/180<br>Radians → degrees: × 180/π')}`),
    F(table([['Degrees', 30, 45, 60, 90, 180, 360], ['Radians', 'π/6', 'π/4', 'π/3', 'π/2', 'π', '2π']]), '30 degrees is pi over six, 90 degrees is pi over two, 360 is two pi.'),
    T(p('Your turn. Write 90° in radians.'), ['π/2', 'π/4', '2π', 'π/3'], 0, 'Yes! 90° is half of 180°.', 'Not quite. 180° = π, so 90° is half of π.')
  ] }),
  'h-trigg': () => ({ title: 'Trig graphs', frames: [
    F(`${plot([[x => 2 * Math.sin(x * Math.PI / 3), '#4dabf7']], [], [-6, 6, -3, 3])}${p('y = a sin x + d is a wave. <b>a</b> is the amplitude (height above the middle).')}`),
    F(`${box('Maximum = d + a<br>Minimum = d − a<br>Period of sin x and cos x: 360°')}${p(`y = 5 cos x + 1: max = 1 + 5 = ${alt(6)}`)}`),
    T(p('Your turn. What is the maximum value of y = 3 sin x − 2?'), [1, 3, 5, '−2'], 0, 'Yes! −2 + 3 = 1.', 'Not quite. Maximum = d + a with d = −2 and a = 3.')
  ] }),
  'h-cond': () => ({ title: 'Conditional probability', frames: [
    F(`${table([['', 'Walk', 'Bus', 'Total'], ['Year 7', 25, 15, 40], ['Year 8', 12, 17, 29], ['Total', 37, 32, 69]])}${p('P(Year 7 and walks) = 25/69: the whole table is the total.')}`),
    F(`${p('"<b>Given</b> a Year 7 student is picked": only look at the Year 7 row.')}${p(`P(walk | Year 7) = 25/40 = ${alt('5/8')}`)}`),
    T(p('Your turn. 30 Year 8 students, 12 walk. A Year 8 student is picked. P(walks)?'), [fr(2, 5), fr(12, 69), fr(3, 5), fr(1, 12)], 0, 'Yes! 12/30 = 2/5.', 'Not quite. Only count the Year 8 students.', 'Your turn. Probability a Year 8 student walks?')
  ] }),
  'h-sd': () => ({ title: 'Standard deviation', frames: [
    F(`${p('Standard deviation measures how spread out data is from the mean.')}${steps(['Find the mean', 'Square each distance from the mean', 'Average those squares', 'Square root'])}`),
    F(`${big('4, 10, 4, 10, 4, 10')}${p('Mean 7. Every value is 3 away: squares are all 9. Average 9, √9 = ' + alt(3))}`),
    T(p('Your turn. Find the standard deviation of 2, 4, 6 to 1 decimal place.'), [1.6, 2, 2.7, 4], 0, 'Yes! Squares 4, 0, 4: average 8/3, √(2.67) ≈ 1.6.', 'Not quite. Mean is 4. Distances 2, 0, 2.')
  ] }),
  'h-perm': () => ({ title: 'Permutations', frames: [
    F(`${p('<b>Permutations</b>: arrangements where order matters.')}${p('3 books on a shelf: 3 choices for the first, 2 for the next, 1 for the last: 3 × 2 × 1 = 3! = 6')}`),
    F(`${p('Choosing 1st, 2nd and 3rd from 6 runners: 6 × 5 × 4 = ' + alt(120))}${p('Formula: ⁿPᵣ = n! ÷ (n − r)!')}`),
    T(p('Your turn. In how many orders can 4 books be arranged?'), [24, 16, 10, 4], 0, 'Yes! 4 × 3 × 2 × 1 = 24.', 'Not quite. 4 choices, then 3, then 2, then 1.')
  ] }),
  'h-comb': () => ({ title: 'Combinations', frames: [
    F(`${p('<b>Combinations</b>: choosing a group where order does <b>not</b> matter.')}${big(`ⁿCᵣ = ${fr('n!', 'r!(n − r)!')}`)}`, 'Combinations: n choose r is n factorial over r factorial times n minus r factorial.'),
    F(`${p('3 toppings from 10: 10 × 9 × 8 = 720 ordered ways, but each group of 3 is counted 3! = 6 times.')}${p(`720 ÷ 6 = ${alt(120)}`)}`),
    T(p('Your turn. How many ways can you choose 2 friends from 5?'), [10, 20, 25, 7], 0, 'Yes! 5 × 4 ÷ 2 = 10.', 'Not quite. 5 × 4 ordered ways, divided by 2 because order does not matter.')
  ] }),
  'h-loan': () => ({ title: 'Loans and payment plans', frames: [
    F(`${box('Total repaid = payment × number of payments<br>Interest paid = total repaid − amount borrowed<br>Months = total ÷ monthly payment')}${p(`24 payments of ${money(320)}: 24 × 320 = ${alt(money(7680))}`)}`),
    T(p(`Your turn. You borrow ${money(5000)} and pay back 12 payments of ${money(450)}. How much interest do you pay?`), [money(400), money(5400), money(450), money(600)], 0, 'Yes! 12 × 450 = 5400, minus 5000 = 400.', 'Not quite. Work out the total repaid first, then subtract what you borrowed.')
  ] }),
  'h-diff': () => ({ title: 'Differentiation', frames: [
    F(`${p('Differentiating gives the <b>gradient</b> of a curve at any point.')}${big('y = axⁿ → dy/dx = naxⁿ⁻¹')}${p('Multiply by the power, then take 1 off the power. Constants disappear.')}`, 'Multiply by the power, then reduce the power by one. Constants disappear.'),
    F(`${p('y = 6x⁴ → dy/dx = 24x³')}${p('f(x) = x³ − 4x² − 8x → f′(x) = 3x² − 8x − 8. At x = −2: 12 + 16 − 8 = ' + alt(20))}`),
    T(p('Your turn. Differentiate y = 5x³.'), ['15x²', '5x²', '15x³', '8x²'], 0, 'Yes! 3 × 5 = 15, power 3 − 1 = 2.', 'Not quite. Multiply by the power (3), then reduce the power by 1.')
  ] }),
  'h-stat': () => ({ title: 'Stationary points', frames: [
    F(`${plot([[x => x * x + 2 * x - 2, '#4dabf7']], [[-1, -3, '(−1, −3)']], [-5, 3, -4, 6])}${p('At a turning point the gradient is 0, so solve <b>dy/dx = 0</b>.')}`),
    F(`${p('y = x² + 2x − 2: dy/dx = 2x + 2 = 0 → x = −1, y = 1 − 2 − 2 = −3')}${p('Turning point (−1, −3). If d²y/dx² &gt; 0 it is a minimum; &lt; 0 a maximum.')}`),
    T(p('Your turn. At what x is the turning point of y = x² − 6x?'), [3, '−3', 6, 0], 0, 'Yes! 2x − 6 = 0, so x = 3.', 'Not quite. Differentiate (2x − 6) and set it to 0.')
  ] }),
  'h-mat': () => ({ title: 'Matrices', frames: [
    F(`${p('Add matrices by adding matching entries. Multiply by a number: multiply every entry.')}${p('The <b>determinant</b> of a 2 × 2 matrix:')}${big(`det ${mat([['a', 'b'], ['c', 'd']])} = ad − bc`)}`),
    F(`${p(`det ${mat([[2, 5], [-1, -3]])} = 2 × (−3) − 5 × (−1) = −6 + 5 = ${alt('−1')}`)}${p('Multiplying two matrices: row × column, add the products.')}`),
    T(`${p(`Your turn. Find det ${mat([[3, 1], [2, 4]])}`)}`, [10, 14, 12, 2], 0, 'Yes! 3 × 4 − 1 × 2 = 10.', 'Not quite. ad − bc.', 'Your turn. Determinant of three one, two four?')
  ] }),

  // ---------------- Grade 12 ----------------
  'h-binp': () => ({ title: 'Binomial probability', frames: [
    F(`${p('X ~ B(n, p): n tries, each succeeding with probability p.')}${big('P(X = r) = ⁿCᵣ × pʳ × (1 − p)ⁿ⁻ʳ')}`),
    F(`${p('X ~ B(3, 0.2): P(X = 0) = 0.8 × 0.8 × 0.8 = 0.512')}${p('A fair coin 6 times, exactly 1 head: 6 × (½)⁶ = 6/64 = 3/32')}`),
    T(p('Your turn. X ~ B(2, 0.5). Find P(X = 1).'), [0.5, 0.25, 0.75, 1], 0, 'Yes! There are 2 ways (HT or TH), so 2 × 0.5 × 0.5 = 0.5.', 'Not quite. There are 2 ways (HT, TH), each with probability 0.25.')
  ] }),
  'h-norm': () => ({ title: 'The normal distribution', frames: [
    F(`${plot([[x => 5 * Math.exp(-x * x / 2), '#4dabf7']], [], [-4, 4, -0.5, 5.5])}${p('A bell-shaped curve, symmetric about the mean.')}`),
    F(table([['Within', 'Share'], ['1 standard deviation', 'about 68%'], ['2 standard deviations', 'about 95%'], ['3 standard deviations', 'about 99.7%']]) + p('Above mean + 1 SD: (100 − 68) ÷ 2 = 16%. Above mean + 2 SD: 2.5%.')),
    T(p('Your turn. Mean 100, standard deviation 15. About what percentage are between 85 and 115?'), ['68%', '95%', '50%', '99.7%'], 0, 'Yes! That is within 1 standard deviation.', 'Not quite. 85 and 115 are each 15 (one SD) from the mean.')
  ] }),
  'h-lim': () => ({ title: 'Limits', frames: [
    F(`${p('A limit asks: what value does the expression get closer to as x gets closer to a number?')}${p(`For smooth expressions, just substitute: lim (x → −3) of 4x² + x = 36 − 3 = ${alt(33)}`)}`),
    F(`${p('If substituting gives 0/0, factorise and cancel first:')}${big(`${fr('x² − 4', 'x − 2')} = x + 2`)}${p('As x → 2, this → 4.')}`, 'If you get nought over nought, factorise and cancel. x squared minus four over x minus two is x plus two, which tends to four.'),
    T(`${p('Your turn. Find the limit as x → 3 of')}${big(fr('x² − 9', 'x − 3'))}`, [6, 0, 3, 9], 0, 'Yes! It simplifies to x + 3, which is 6 at x = 3.', 'Not quite. Factorise x² − 9 = (x − 3)(x + 3).', 'Your turn. Limit as x tends to three of x squared minus nine, over x minus three.')
  ] }),
  'h-chain': () => ({ title: 'Chain rule, e and ln', frames: [
    F(table([['Function', 'Derivative'], ['e^(kx)', 'k e^(kx)'], ['ln(kx)', '1/x'], ['f(g(x))', "f′(g(x)) × g′(x)"]])),
    F(`${p('<b>Chain rule</b>: differentiate the outside, keep the inside, then multiply by the derivative of the inside.')}${p('y = (3x + 1)⁵ → 5(3x + 1)⁴ × 3 = 15(3x + 1)⁴')}`),
    T(p('Your turn. Differentiate y = e^(3x).'), ['3e^(3x)', 'e^(3x)', '3x e^(3x)', 'e^(3x) ÷ 3'], 0, 'Yes! Bring the 3 down in front.', 'Not quite. The derivative of e^(kx) is k e^(kx).')
  ] }),
  'h-int': () => ({ title: 'Integration', frames: [
    F(`${p('Integration is the <b>reverse</b> of differentiation.')}${big('∫ axⁿ dx = a xⁿ⁺¹ ÷ (n + 1) + c')}${p('Add 1 to the power, then divide by the new power. Always add + c.')}`, 'Integration reverses differentiation. Add one to the power, divide by the new power, and add c.'),
    F(`${p('∫ 12x³ dx = 12x⁴ ÷ 4 + c = 3x⁴ + c')}${p('Check by differentiating: 3 × 4x³ = 12x³ ✓')}`),
    T(p('Your turn. Find ∫ 6x² dx.'), ['2x³ + c', '12x + c', '6x³ + c', '3x³ + c'], 0, 'Yes! 6x³ ÷ 3 = 2x³.', 'Not quite. Power 2 becomes 3, then divide by 3.')
  ] }),
  'h-defint': () => ({ title: 'Definite integrals and area', frames: [
    F(`${plot([[x => 9 - x * x, '#4dabf7']], [[-3, 0, '−3'], [3, 0, '3']], [-4, 4, -2, 10])}${p('The area under a curve between two x values is a <b>definite integral</b>.')}`),
    F(`${p('Integrate, then (value at top) − (value at bottom):')}${p('∫ from −3 to 3 of (9 − x²) dx = [9x − x³/3] = (27 − 9) − (−27 + 9) = 18 + 18 = ' + alt(36))}`),
    T(p('Your turn. Find ∫ from 0 to 2 of 2x dx.'), [4, 2, 8, 0], 0, 'Yes! ∫ 2x dx = x². Put in 2 and 0: 4 − 0 = 4.', 'Not quite. ∫ 2x dx = x². Put in 2, then 0, and subtract.')
  ] }),
  'h-cplx': () => ({ title: 'Complex numbers', frames: [
    F(`${p('i is the number with')}${big('i² = −1')}${p('A complex number has a real part and an imaginary part: 3 + 6i.')}`),
    F(`${p('Add: real with real, imaginary with imaginary: (3 + 6i) + (6 + i) = 9 + 7i')}${p('Multiply like brackets, then use i² = −1: (1 + 2i)(3 − i) = 3 − i + 6i − 2i² = 5 + 5i')}`),
    T(p('Your turn. Simplify (2 + 3i) + (1 − i).'), ['3 + 2i', '3 + 4i', '1 + 4i', '3 − 2i'], 0, 'Yes! 2 + 1 = 3 and 3i − i = 2i.', 'Not quite. Add the real parts, then the i parts.')
  ] })
};
