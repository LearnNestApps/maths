// "Learn first" explainers for Grades 6–8.
import { F, T, fr, big, p, mk, alt, no, yes, cmp, steps, box, bar, barRow, cols, nline, rect, shape, coordGrid, table } from './learn_kit.js';
import { isUS, U, money, tax } from '../core/region.js';

const INK = '#1d3557';
const codeBlock = s => `<pre class="lcode">${s}</pre>`;
const sup = n => `<sup>${n}</sup>`;
// Two angles on a straight line.
const lineAngles = (a, la, lb) => { const r = a * Math.PI / 180, x = 150 - 90 * Math.cos(r), y = 110 - 90 * Math.sin(r);
  return `<svg class="lpic" viewBox="0 0 300 130" width="300" role="img" aria-label="angles on a straight line"><line x1="20" y1="110" x2="280" y2="110" stroke="${INK}" stroke-width="3"/><line x1="150" y1="110" x2="${x}" y2="${y}" stroke="${INK}" stroke-width="3"/>
  <text x="${150 + 40}" y="98" font-size="16" font-weight="700" fill="#ff6b4a">${lb}</text><text x="${150 - 58}" y="98" font-size="16" font-weight="700" fill="#1971c2">${la}</text></svg>`; };
// A triangle with three angle labels.
const triAngles = (a, b, c) => `<svg class="lpic" viewBox="0 0 260 150" width="260" role="img" aria-label="triangle"><polygon points="20,130 240,130 90,20" fill="#e7f5ff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <text x="44" y="122" font-size="15" font-weight="700" fill="#1971c2">${a}</text><text x="172" y="122" font-size="15" font-weight="700" fill="#1971c2">${b}</text><text x="84" y="54" font-size="15" font-weight="700" fill="#ff6b4a">${c}</text></svg>`;
// A pie chart from [label, degrees, colour].
function pie(parts) {
  let a0 = -90; const P = parts.map(([l, d, c]) => { const a1 = a0 + d, r = 70, cx = 90, cy = 85, rad = x => x * Math.PI / 180;
    const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0)), x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1)), mid = rad((a0 + a1) / 2);
    const s = `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${d > 180 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${c}" stroke="#fff" stroke-width="2"/><text x="${cx + 44 * Math.cos(mid)}" y="${cy + 44 * Math.sin(mid) + 5}" font-size="13" font-weight="700" text-anchor="middle" fill="${INK}">${d}°</text>`; a0 = a1; return s; });
  return `<div class="lrow"><svg class="lpic" viewBox="0 0 180 170" width="180" role="img" aria-label="pie chart">${P.join('')}</svg><div class="lkey">${parts.map(([l, , c]) => `<div><i style="background:${c}"></i>${l}</div>`).join('')}</div></div>`;
}
// Scatter graph: kind = 'pos' | 'neg' | 'none'.
function scatter(kind) {
  const pts = Array.from({ length: 12 }, (_, i) => { const x = 20 + i * 15 + (i * 37 % 9), j = (i * 53 % 23) - 11; const y = kind === 'pos' ? 150 - i * 10 + j : kind === 'neg' ? 40 + i * 10 + j : 40 + (i * 67 % 110); return [x, y]; });
  return `<svg class="lpic" viewBox="0 0 220 170" width="150" role="img" aria-label="scatter graph"><line x1="12" y1="160" x2="215" y2="160" stroke="${INK}" stroke-width="2"/><line x1="12" y1="10" x2="12" y2="160" stroke="${INK}" stroke-width="2"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#4dabf7"/>`).join('')}</svg>`;
}
const circleRD = () => `<svg class="lpic" viewBox="0 0 200 180" width="200" role="img" aria-label="circle with radius and diameter"><circle cx="100" cy="90" r="75" fill="#e7f5ff" stroke="${INK}" stroke-width="3"/><circle cx="100" cy="90" r="4" fill="${INK}"/>
  <line x1="25" y1="90" x2="175" y2="90" stroke="#ff6b4a" stroke-width="3"/><line x1="100" y1="90" x2="153" y2="37" stroke="#1971c2" stroke-width="3"/><text x="118" y="78" font-size="14" font-weight="700" fill="#1971c2" paint-order="stroke" stroke="#e7f5ff" stroke-width="4">radius</text><text x="60" y="110" font-size="14" font-weight="700" fill="#ff6b4a">diameter</text></svg>`;
const cylinder = (r, h, u) => `<svg class="lpic" viewBox="0 -6 215 196" width="190" role="img" aria-label="cylinder"><ellipse cx="85" cy="40" rx="60" ry="18" fill="#d0ebff" stroke="${INK}" stroke-width="2.5"/><path d="M25 40 V150 A60 18 0 0 0 145 150 V40" fill="#e7f5ff" stroke="${INK}" stroke-width="2.5"/><ellipse cx="85" cy="40" rx="60" ry="18" fill="#d0ebff" stroke="${INK}" stroke-width="2.5"/>
  <line x1="85" y1="40" x2="145" y2="40" stroke="#ff6b4a" stroke-width="2.5"/><text x="96" y="14" font-size="14" font-weight="700" fill="#ff6b4a">r = ${r}</text><text x="152" y="100" font-size="14" font-weight="700" fill="#1971c2">h = ${h}</text></svg>`;
const transPic = () => `<svg class="lpic" viewBox="0 0 330 110" width="330" role="img" aria-label="translation, reflection, rotation">
  ${[[0, 'slide', 'M10 70 h30 v-30 l-30 30z', 'M55 50 h30 v-30 l-30 30z'], [110, 'flip', 'M10 70 h30 v-30 l-30 30z', 'M90 70 h-30 v-30 l30 30z'], [220, 'turn', 'M10 70 h30 v-30 l-30 30z', 'M70 40 v30 h30 l-30 -30z']].map(([x, l, a, b]) =>
    `<g transform="translate(${x} 0)"><path d="${a}" fill="#a5d8ff" stroke="${INK}" stroke-width="2"/><path d="${b}" fill="#ffc9c9" stroke="${INK}" stroke-width="2"/>${l === 'flip' ? `<line x1="50" y1="15" x2="50" y2="80" stroke="#868e96" stroke-dasharray="4 3" stroke-width="2"/>` : ''}<text x="50" y="102" font-size="14" font-weight="700" text-anchor="middle" fill="${INK}">${l === 'slide' ? 'Translation' : l === 'flip' ? 'Reflection' : 'Rotation'}</text></g>`).join('')}</svg>`;

export const G6_8 = {
  // ---------------- Grade 6 ----------------
  't-sq': () => ({ title: 'Squares 11 to 30', frames: [
    F(`${p('A <b>square</b> number is a number times itself.')}${big(`18${sup(2)} = 18 × 18 = ${alt(324)}`)}${p(`The reverse is the <b>square root</b>: √324 = 18.`)}`),
    F(`${p('Quick tricks:')}${box(`Ends in 5: 25${sup(2)} → 2 × 3 = 6, then 25 → ${mk(625)}<br>Near 20: 21${sup(2)} = 400 + 20 + 20 + 1 = ${mk(441)}`)}${p('For √: 361 ends in 1, so the root ends in 1 or 9. 19 × 19 = 361 ✓')}`),
    T(`${p('Your turn.')}${big(`15${sup(2)} = ?`)}`, [225, 215, 125, 30], 0, 'Yes! 1 × 2 = 2, then 25: 225.', 'Not quite. 15 × 15, not 15 × 2. Try the ends-in-5 trick.', 'Your turn. Fifteen squared?')
  ] }),
  'lc-loop': () => ({ title: 'Code: loops', frames: [
    F(`${p('A <b>loop</b> repeats code. Follow it step by step, writing down the value each time.')}${codeBlock('x = 2\nrepeat 3 times:\n    x = x * 2\nprint(x)')}${table([['Round', 'x'], ['start', 2], ['1', 4], ['2', 8], ['3', 16]])}${p(`It prints ${mk(16)}.`)}`),
    F(`${codeBlock('for i in range(1, 12):\n    if i % 2 == 0:\n        print(i)')}${p('range(1, 12) gives 1 to 11 (it stops <b>before</b> 12). Only even numbers print:')}${big('2, 4, 6, 8, 10')}`),
    T(`${p('Your turn. What does this print?')}${codeBlock('x = 1\nrepeat 4 times:\n    x = x + 3\nprint(x)')}`, [13, 12, 4, 16], 0, 'Yes! 1 → 4 → 7 → 10 → 13.', 'Not quite. Add 3 four times, starting at 1.')
  ] }),
  'e-neg': () => ({ title: 'Negative numbers', frames: [
    F(`${nline(-6, 4, 1, [[-1, -6, '+ (−5)']])}${p(`Adding a negative moves <b>left</b>: −1 + (−5) = ${alt('−6')}`)}`),
    F(`${p('Subtracting a negative moves <b>right</b>: two minus signs together make a plus.')}${big(`−2 − (−5) = −2 + 5 = ${alt(3)}`)}${nline(-3, 4, 1, [[-2, 3, '+5']])}`),
    T(`${p('Your turn.')}${big('−4 − (−6) = ?')}`, [2, '−10', '−2', 10], 0, 'Yes! −4 + 6 = 2.', 'Not quite. "Minus a minus" becomes plus: −4 + 6.')
  ] }),
  'e-hcf': () => ({ title: 'HCF', frames: [
    F(`${p('The <b>highest common factor</b> is the biggest number that divides both.')}${box(`36: 1, 2, 3, 4, 6, 9, ${mk(12)}, 18, 36<br>48: 1, 2, 3, 4, 6, 8, ${mk(12)}, 16, 24, 48`)}${big(`HCF(48, 36) = ${alt(12)}`)}`),
    F(`${p('Tip: list the factors of the <b>smaller</b> number, biggest first, and stop at the first one that divides the other number.')}`),
    T(`${p('Your turn.')}${big('HCF(12, 18) = ?')}`, [6, 3, 36, 2], 0, 'Yes! 6 divides both, and nothing bigger does.', 'Not quite. Which is the biggest number that divides 12 and 18?')
  ] }),
  'e-lcm': () => ({ title: 'LCM', frames: [
    F(`${p('The <b>lowest common multiple</b> is the smallest number in both times tables.')}${box(`4: 4, 8, ${mk(12)}, 16, 20<br>6: 6, ${mk(12)}, 18, 24`)}${big(`LCM(4, 6) = ${alt(12)}`)}`),
    F(`${p('If two numbers share no factor (like 9 and 11), the LCM is just their product: 9 × 11 = 99.')}`),
    T(`${p('Your turn.')}${big('LCM(6, 8) = ?')}`, [24, 48, 14, 12], 0, 'Yes! 6, 12, 18, 24 and 8, 16, 24: 24.', 'Not quite. List the multiples of 8 until one is also in the 6 times table.')
  ] }),
  'e-bodmas': () => ({ title: 'Order of operations (BODMAS)', frames: [
    F(`${p('Do the operations in this order:')}${box('Brackets, Orders (powers), Division/Multiplication, Addition/Subtraction')}${p('× and ÷ have equal rank: go left to right. + and − too.')}`),
    F(`${big('12 ÷ 4 + 3 × 7')}${steps(['÷ and × first: 12 ÷ 4 = 3 and 3 × 7 = 21', `Then +: 3 + 21 = ${alt(24)}`])}${p('5 × 6 − 4 + 2: 30 − 4 + 2, left to right = 28')}`),
    F(cmp(no('Left to right', '2 + 3 × 4 → 20'), yes('× first', '2 + 12 = 14'))),
    T(`${p('Your turn.')}${big('10 − 2 × 3 = ?')}`, [4, 24, 6, 16], 0, 'Yes! 2 × 3 = 6 first, then 10 − 6 = 4.', 'Not quite. Multiply before you subtract.')
  ] }),
  'e-fadd2': () => ({ title: 'Adding fractions (different bottoms)', frames: [
    F(`${p('Pieces must be the same size before you add. Change both fractions to the same bottom.')}${big(`${fr(1, 3)} + ${fr(1, 2)}`)}${barRow(3, 1, '#ffa94d')}${barRow(2, 1, '#4dabf7')}`, 'One third plus one half. The pieces are different sizes.'),
    F(`${p('3 and 2 both go into 6.')}${big(`${fr(2, 6)} + ${fr(3, 6)} = ${fr(alt(5), 6)}`)}${barRow(6, 5, '#4dabf7')}`, 'Both become sixths: two sixths plus three sixths is five sixths.'),
    F(cmp(no('Add tops and bottoms', `${fr(2, 5)}`), yes('Same bottom first', `${fr(5, 6)}`)), 'Do not add tops and bottoms. Make the bottoms the same first.'),
    T(`${p('Your turn.')}${big(`${fr(1, 4)} + ${fr(1, 3)} = ?`)}`, [fr(7, 12), fr(2, 7), fr(1, 7), fr(2, 12)], 0, 'Yes! 3/12 + 4/12 = 7/12.', 'Not quite. Use twelfths: one quarter = 3/12, one third = 4/12.', 'Your turn. One quarter plus one third?')
  ] }),
  'e-decmul': () => ({ title: '× and ÷ by 10, 100, 1000', frames: [
    F(`${p('Multiplying by 10 makes a number 10 times bigger: the digits move <b>one place left</b>.')}${big(`2.6 × 100 = ${alt(260)}`)}${p('× 100: two places left. × 1000: three places.')}`),
    F(`${p('Dividing moves the digits <b>right</b>, making the number smaller.')}${big(`9.79 ÷ 100 = ${alt('0.0979')}`)}${p('Fill empty places with 0.')}`),
    T(`${p('Your turn.')}${big('4.5 × 1000 = ?')}`, [4500, 450, 45000, '4.5000'], 0, 'Yes! Three places left: 4500.', 'Not quite. × 1000 moves digits three places to the left.')
  ] }),
  'e-fdp': () => ({ title: 'Fractions, decimals, percentages', frames: [
    F(`${p('Three ways to write the same amount. Percent means "out of 100".')}${table([['Fraction', 'Decimal', 'Percent'], [fr(1, 2), '0.5', '50%'], [fr(1, 4), '0.25', '25%'], [fr(3, 4), '0.75', '75%'], [fr(1, 5), '0.2', '20%'], [fr(1, 10), '0.1', '10%']])}`, 'A half is nought point five, fifty percent. A quarter is nought point two five, twenty five percent.'),
    F(`${box('Fraction → decimal: top ÷ bottom<br>Decimal → percent: × 100<br>Percent → decimal: ÷ 100')}${p(`${fr(3, 8)} = 3 ÷ 8 = 0.375 = 37.5%`)}`, 'Fraction to decimal: divide top by bottom. Three eighths is nought point three seven five, thirty seven point five percent.'),
    T(`${p('Your turn. Which is the same as')}${big(fr(3, 4))}`, ['0.75', '0.34', '0.3', '3.4'], 0, 'Yes! 3 ÷ 4 = 0.75.', 'Not quite. Divide 3 by 4.', 'Your turn. Which decimal is the same as three quarters?')
  ] }),
  'e-pct': () => ({ title: 'Percentage of an amount', frames: [
    F(`${p('Build percentages from easy ones:')}${box('50% = half<br>10% = ÷ 10<br>5% = half of 10%<br>1% = ÷ 100')}`),
    F(`${big('35% of 200')}${steps(['10% = 20, so 30% = 60', '5% = 10', `35% = 60 + 10 = ${alt(70)}`])}${p('Or use a calculator method: 35 ÷ 100 × 200 = 70.')}`),
    T(`${p('Your turn.')}${big('25% of 80 = ?')}`, [20, 25, 40, 320], 0, 'Yes! 25% is a quarter: 80 ÷ 4 = 20.', 'Not quite. 25% is one quarter.')
  ] }),
  'e-ratio': () => ({ title: 'Ratios', frames: [
    F(`${p('A ratio compares amounts: 4 : 14 means "4 for every 14".')}${p('Simplify by dividing <b>both</b> numbers by the same number (like fractions):')}${big(`4 : 14 = ${alt('2 : 7')}`)}`),
    F(`${p('The order matters: boys : girls = 2 : 7 is not the same as 7 : 2.')}${p('Keep dividing until nothing else divides both.')}`),
    T(`${p('Your turn. Simplify')}${big('10 : 15')}`, ['2 : 3', '5 : 10', '3 : 2', '1 : 5'], 0, 'Yes! Divide both by 5.', 'Not quite. What divides both 10 and 15?')
  ] }),
  'e-unit': () => ({ title: 'Unitary method', frames: [
    F(`${p('Find the cost of <b>one</b> first, then multiply.')}${p(`2 pencils cost ${money(32)}. How much do 8 cost?`)}${steps([`1 pencil: ${money(32)} ÷ 2 = ${money(16)}`, `8 pencils: ${money(16)} × 8 = ${alt(money(128))}`])}`),
    T(`${p(`Your turn. 3 pens cost ${money(45)}. How much do 5 pens cost?`)}`, [money(75), money(15), money(225), money(48)], 0, `Yes! One pen is ${money(15)}, so 5 cost ${money(75)}.`, 'Not quite. Find the price of one pen first.')
  ] }),
  'e-eval': () => ({ title: 'Substitution', frames: [
    F(`${p('<b>Substitute</b> means put the number in place of the letter.')}${big('If x = 8: 5(x + 9)')}${steps(['Replace x: 5(8 + 9)', 'Bracket first: 8 + 9 = 17', `5 × 17 = ${alt(85)}`])}`),
    F(`${box('5x means 5 × x<br>x² means x × x<br>5(x + 9) means 5 × (x + 9)')}`),
    T(`${p('Your turn. If x = 4, what is')}${big('3(x + 2)')}`, [18, 14, 9, 24], 0, 'Yes! 4 + 2 = 6, and 3 × 6 = 18.', 'Not quite. Put 4 in for x, do the bracket, then multiply by 3.')
  ] }),
  'e-angline': () => ({ title: 'Angles on a straight line', frames: [
    F(`${lineAngles(129, '129°', 'x')}${p(`Angles on a straight line add up to ${mk('180°')}.`)}${big(`x = 180 − 129 = ${alt('51°')}`)}`),
    T(`${p('Your turn. Find x.')}${lineAngles(65, 'x', '65°')}`, ['115°', '25°', '65°', '295°'], 0, 'Yes! 180 − 65 = 115.', 'Not quite. Together the two angles make 180°.')
  ] }),
  'e-angtri': () => ({ title: 'Angles in a triangle', frames: [
    F(`${triAngles('50°', '60°', 'x')}${p(`The three angles in any triangle add up to ${mk('180°')}.`)}${big(`x = 180 − 50 − 60 = ${alt('70°')}`)}`),
    F(`${p('Tear the corners off a paper triangle and line them up: they make a straight line, 180°.')}`),
    T(`${p('Your turn. A right-angled triangle has another angle of 35°. Find the third angle.')}`, ['55°', '65°', '145°', '35°'], 0, 'Yes! 180 − 90 − 35 = 55.', 'Not quite. A right angle is 90°. Take 90 and 35 away from 180.')
  ] }),
  'e-circle': () => ({ title: 'Radius and diameter', frames: [
    F(`${circleRD()}${box('<b>Radius</b>: centre to the edge<br><b>Diameter</b>: right across, through the centre')}${big('diameter = 2 × radius')}`),
    F(`${p('Radius 19 → diameter 38. Diameter 38 → radius 19.')}`),
    T(`${p(`Your turn. A circle has diameter 30 ${U('len')}. What is its radius?`)}`, [15, 60, 30, 10], 0, 'Yes! Half of 30 is 15.', 'Not quite. The radius is half the diameter.')
  ] }),
  'e-areas': () => { const a = U('area'); return { title: 'Area of triangles and more', frames: [
    F(`${p('A triangle is <b>half</b> of a rectangle with the same base and height.')}${shape([[5, 90], [95, 90], [35, 15]], { labels: ['base 16', '', ''], w: 170 })}${big('Area = ½ × base × height')}`),
    F(`${p(`Base 16, height 12: ½ × 16 × 12 = ${alt(96)} ${a}`)}${p('The height must be <b>straight up</b> from the base (at a right angle), not the slanted side.')}${p('Parallelogram: base × height.')}`),
    T(`${p(`Your turn. A triangle has base 10 and height 6. What is its area?`)}`, [30, 60, 16, 8], 0, 'Yes! ½ × 10 × 6 = 30.', 'Not quite. Multiply base by height, then halve it.')
  ] }; },
  'e-vol': () => { const u = U('len'), v = U('vol'); return { title: 'Volume and surface area', frames: [
    F(`${p(`<b>Volume</b> is the space inside: how many unit cubes fill it. For a ${U('box')}:`)}${big('Volume = length × width × height')}${p(`12 × 5 × 7 = ${alt(420)} ${v}`)}`),
    F(`${p('<b>Surface area</b> is the area of all 6 faces added together:')}${box('2 × (l × w + l × h + w × h)')}${p(`2 × (60 + 84 + 35) = ${mk(358)} ${U('area')}`)}`),
    T(`${p(`Your turn. A box is 4 ${u} × 3 ${u} × 2 ${u}. What is its volume?`)}`, [24, 9, 26, 12], 0, 'Yes! 4 × 3 × 2 = 24.', 'Not quite. Multiply all three lengths.')
  ] }; },
  'e-profit': () => ({ title: 'Profit and loss', frames: [
    F(`${box('<b>Profit</b> = selling price − cost price<br><b>Loss</b> = cost price − selling price')}${p(`Bought for ${money(560)}, sold for ${money(700)}: profit = ${alt(money(140))}`)}`),
    F(`${p('Profit % compares the profit with the cost price:')}${p(`${money(140)} ÷ ${money(560)} × 100 = ${mk('25%')}`)}`),
    T(p(`Your turn. A toy is bought for ${money(200)} and sold for ${money(150)}. What is the result?`), [`loss of ${money(50)}`, `profit of ${money(50)}`, `loss of ${money(150)}`, `profit of ${money(350)}`], 0, 'Yes! It sold for less than it cost: a loss of 50.', 'Not quite. Did it sell for more or less than it cost?')
  ] }),
  'e-mean': () => ({ title: 'Mean, median, mode, range', frames: [
    F(`${big('16, 8, 3, 9, 9')}${table([['Average', 'How', 'Answer'], ['Mean', 'total ÷ how many = 45 ÷ 5', 9], ['Median', 'middle when in order: 3, 8, <b>9</b>, 9, 16', 9], ['Mode', 'the most common', 9], ['Range', 'biggest − smallest = 16 − 3', 13]])}`),
    F(`${p('For the median, always put the numbers <b>in order first</b>. With an even count, take the halfway point between the middle two.')}`),
    T(`${p('Your turn. Find the mean of')}${big('4, 6, 8, 10')}`, [7, 28, 6, 8], 0, 'Yes! 28 ÷ 4 = 7.', 'Not quite. Add them all up, then divide by how many there are.')
  ] }),
  'v-yava': () => ({ title: 'Squaring near 100', frames: [
    F(`${p('To square a number near 100, find how far it is from 100.')}${big('104²')}${steps(['104 is 4 more than 100', 'Left part: 104 + 4 = 108', 'Right part: 4² = 16 (always two digits)'])}${big(`104² = ${alt(10816)}`)}`),
    F(`${p('Below 100 works too: 99 is 1 less. Left: 99 − 1 = 98. Right: 1² = 01.')}${big('99² = 9801')}${p('Why: (100 + d)² = 100 × (100 + 2d) + d².')}`),
    T(`${p('Your turn.')}${big('103² = ?')}`, [10609, 10069, 10906, 1069], 0, 'Yes! 103 + 3 = 106, 3² = 09: 10609.', 'Not quite. Left: 103 + 3. Right: 3² written as two digits.')
  ] }),
  'm-sqrt': () => ({ title: 'Square roots', frames: [
    F(`${p('The <b>square root</b> asks: what number times itself gives this?')}${big(`√196 = ${alt(14)}`)}${p('because 14 × 14 = 196.')}`),
    F(`${p('If it is not a perfect square, find the squares on either side:')}${big('√114')}${p(`10² = 100 &lt; 114 &lt; 121 = 11². So √114 is ${mk('between 10 and 11')}.`)}`),
    T(`${p('Your turn. √150 is between which two whole numbers?')}`, ['12 and 13', '11 and 12', '13 and 14', '14 and 15'], 0, 'Yes! 144 < 150 < 169.', 'Not quite. Which squares are just below and just above 150?')
  ] }),
  'm-fracmul': () => ({ title: 'Multiplying fractions', frames: [
    F(`${p('Multiply the tops, multiply the bottoms.')}${big(`${fr(2, 5)} × ${fr(4, 7)} = ${fr('2 × 4', '5 × 7')} = ${fr(alt(8), alt(35))}`)}`, 'Two fifths times four sevenths: multiply the tops and the bottoms. Eight thirty-fifths.'),
    F(`${p('"of" means ×. Half of a third:')}${big(`${fr(1, 2)} × ${fr(1, 3)} = ${fr(1, 6)}`)}${p('Simplify at the end if you can.')}`, 'Of means times. A half of a third is one sixth.'),
    T(`${p('Your turn. Give the simplest answer.')}${big(`${fr(2, 3)} × ${fr(3, 4)} = ?`)}`, [fr(1, 2), fr(5, 7), fr(6, 7), fr(5, 12)], 0, 'Yes! 6/12 simplifies to 1/2.', 'Not quite. Multiply tops (2 × 3) and bottoms (3 × 4), then simplify.', 'Your turn. Two thirds times three quarters?')
  ] }),
  'm-prop': () => ({ title: 'Direct proportion', frames: [
    F(`${p('<b>Direct proportion</b>: when one doubles, the other doubles.')}${p('A recipe for 2 people uses 60 g of rice. For 7 people?')}${steps(['1 person: 60 ÷ 2 = 30 g', `7 people: 30 × 7 = ${alt('210 g')}`])}`),
    F(`${p('Or spot the multiplier: 32 bottles in 3 minutes. 12 minutes is 4 times as long → 32 × 4 = 128 bottles.')}`),
    T(p('Your turn. 3 boxes hold 45 pens. How many pens do 5 boxes hold?'), [75, 15, 135, 47], 0, 'Yes! 1 box holds 15, so 5 boxes hold 75.', 'Not quite. Find how many pens are in one box first.')
  ] }),
  'm-bestbuy': () => isUS() ? ({ title: 'Best buys', frames: [
    F(`${p('Compare prices for the <b>same amount</b>.')}${table([['Pack', 'Price'], ['8 oz', money(2.5)], ['16 oz', money(4)]])}${p(`Two small packs (16 oz) would cost ${money(5)}. The large pack is ${money(4)}: ${mk('large is better')}.`)}`),
    F(`${p('Or find the price per ounce: divide price by size.')}`),
    T(p(`Your turn. 32 oz for ${money(6)} or 16 oz for ${money(3.5)}?`), ['32 oz', '16 oz', 'the same'], 0, `Yes! Two 16 oz packs cost ${money(7)}, more than ${money(6)}.`, 'Not quite. How much would 32 oz cost in small packs?')
  ] }) : ({ title: 'Best buys', frames: [
    F(`${p('Compare prices for the <b>same amount</b>.')}${table([['Pack', 'Price'], ['250 g', money(3)], ['500 g', money(4)]])}${p(`Two small packs (500 g) would cost ${money(6)}. The large pack is ${money(4)}: ${mk('large is better')}.`)}`),
    F(`${p('Or find the price per 100 g (or per kg) for each, and pick the lower one.')}`),
    T(p(`Your turn. 1 kg for ${money(80)} or 500 g for ${money(45)}?`), ['1 kg', '500 g', 'the same'], 0, `Yes! Two 500 g packs cost ${money(90)}, more than ${money(80)}.`, 'Not quite. How much would 1 kg cost in 500 g packs?')
  ] }),
  'm-trans': () => ({ title: 'Reflect, rotate, translate', frames: [
    F(`${transPic()}${box('<b>Translation</b>: slide, same way up<br><b>Reflection</b>: flip in a mirror line<br><b>Rotation</b>: turn about a point')}`),
    F(`${p('Ask: is it the same way round (slide)? A mirror image (flip)? Tilted at a new angle (turn)?')}`),
    T(p('Your turn. A shape is flipped over a mirror line. This is a…'), ['translation', 'reflection', 'rotation'], 1, 'Yes! A flip is a reflection.', 'Not quite. A mirror line means it flips.')
  ] }),
  'm-freq': () => ({ title: 'Frequency tables', frames: [
    F(`${table([['Pets', 'Frequency'], [0, 4], [1, 4], [2, 9]])}${p('<b>Frequency</b> = how many children gave that answer.')}`),
    F(`${box(`Children asked = 4 + 4 + 9 = ${mk(17)}<br>Pets altogether = 0 × 4 + 1 × 4 + 2 × 9 = ${mk(22)}`)}${p('For "how many pets", multiply each value by its frequency, then add.')}`),
    T(`${p('Your turn. How many pets altogether?')}${table([['Pets', 'Frequency'], [0, 2], [1, 3], [2, 5]])}`, [13, 10, 3, 8], 0, 'Yes! 0 + 3 + 10 = 13.', 'Not quite. Multiply pets × frequency for each row, then add.')
  ] }),
  'm-disc': () => { const tx = tax(); return { title: 'Discounts and tax', frames: [
    F(`${p('A <b>discount</b> takes a percentage <b>off</b> the price.')}${p(`${money(190)} with 25% off:`)}${steps([`25% of ${money(190)} = ${money(47.5)}`, `${money(190)} − ${money(47.5)} = ${alt(money(142.5))}`])}`),
    F(`${p(`<b>${tx.name}</b> adds a percentage <b>on</b> to the price.`)}${p(`${money(100)} + ${tx.rate}% ${tx.name} = ${money(100)} + ${money(tx.rate)} = ${mk(money(100 + tx.rate))}`)}`),
    T(p(`Your turn. A jacket costs ${money(50)}. It is 20% off. What is the sale price?`), [money(40), money(30), money(10), money(60)], 0, `Yes! 20% of 50 is 10, and 50 − 10 = 40.`, 'Not quite. Find 20% of 50, then take it away.')
  ] }; },

  // ---------------- Grade 7 ----------------
  'ac-simplify': () => ({ title: 'Simplifying expressions', frames: [
    F(`${p('<b>Like terms</b> have the same letter part. Collect them together.')}${big(`5x + 2x − 3x = ${alt('4x')}`)}`),
    F(`${p('Different letters stay separate:')}${big('3a + 2b + a = 4a + 2b')}${p('x and x² are <b>not</b> like terms either.')}`),
    T(`${p('Your turn. Simplify')}${big('7x + 6x − 5x')}`, ['8x', '18x', '8', '4x'], 0, 'Yes! 7 + 6 − 5 = 8, so 8x.', 'Not quite. Work out 7 + 6 − 5 and keep the x.')
  ] }),
  'lc-gates2': () => ({ title: 'Logic gates: XOR, NAND and mixes', frames: [
    F(`${box('<b>XOR</b>: ON when <b>exactly one</b> switch is ON<br><b>NAND</b>: NOT AND: OFF only when both are ON')}${table([['A', 'B', 'XOR', 'NAND'], ['OFF', 'OFF', 'OFF', 'ON'], ['ON', 'OFF', 'ON', 'ON'], ['OFF', 'ON', 'ON', 'ON'], ['ON', 'ON', 'OFF', 'OFF']])}`),
    F(`${p('For a mix like <b>A AND NOT B</b>, work out the NOT first: flip B, then do the AND.')}${p('A ON, B OFF → NOT B is ON → ON AND ON = <b>ON</b>.')}`),
    T(p('Your turn. XOR gate: both switches are ON. Is the lamp ON or OFF?'), ['ON', 'OFF'], 1, 'Yes! XOR needs exactly one ON.', 'Not quite. XOR is ON only when the switches are different.')
  ] }),
  'lc-bin8': () => ({ title: 'Binary: 8 bulbs', frames: [
    F(`${table([['128', '64', '32', '16', '8', '4', '2', '1'], ['1', '1', '0', '1', '0', '1', '1', '0']])}${p(`128 + 64 + 16 + 4 + 2 = ${alt(214)}`)}`),
    F(`${p('To make a number, take the biggest value that fits, then the next:')}${p('214: 128 ✓ (86 left), 64 ✓ (22), 32 ✗, 16 ✓ (6), 8 ✗, 4 ✓ (2), 2 ✓ (0), 1 ✗')}`),
    T(`${p('Your turn. Which number is')}${big('10000011')}`, [131, 128, 11, 259], 0, 'Yes! 128 + 2 + 1 = 131.', 'Not quite. Add the values above each 1: 128, 2 and 1.')
  ] }),
  'e-powers': () => ({ title: 'Powers', frames: [
    F(`${p('A <b>power</b> says how many times to multiply a number by itself.')}${big(`2${sup(5)} = 2 × 2 × 2 × 2 × 2 = ${alt(32)}`)}`),
    F(cmp(no('2 × 5', '10'), yes('2 × 2 × 2 × 2 × 2', '32')) + p(`Any number to the power 1 is itself: 7${sup(1)} = 7. To the power 0 it is 1.`)),
    T(`${p('Your turn.')}${big(`3${sup(4)} = ?`)}`, [81, 12, 64, 27], 0, 'Yes! 3 × 3 × 3 × 3 = 81.', 'Not quite. Multiply four 3s together.', 'Your turn. Three to the power four?')
  ] }),
  'e-pctch': () => ({ title: 'Percentage increase and decrease', frames: [
    F(`${p(`A price of ${money(1500)} is reduced by 5%.`)}${steps([`5% of ${money(1500)} = ${money(75)}`, `${money(1500)} − ${money(75)} = ${alt(money(1425))}`])}`),
    F(`${p('Quicker: use a <b>multiplier</b>.')}${box('Increase by 20% → × 1.2<br>Decrease by 5% → × 0.95')}${p('1500 × 0.95 = 1425')}`),
    T(p(`Your turn. ${money(800)} is increased by 25%. What is the new price?`), [money(1000), money(825), money(600), money(200)], 0, 'Yes! 25% of 800 is 200: 800 + 200 = 1000.', 'Not quite. Find 25% of 800 and add it on.')
  ] }),
  'e-share': () => ({ title: 'Sharing in a ratio', frames: [
    F(`${p(`Share ${money(120)} between Riya and Aarav in the ratio 4 : 2.`)}${steps(['Total parts: 4 + 2 = 6', `One part: ${money(120)} ÷ 6 = ${money(20)}`, `Riya: 4 × ${money(20)} = ${money(80)}, Aarav: 2 × ${money(20)} = ${alt(money(40))}`])}`),
    F(`${p('Check: the shares add back to the total: 80 + 40 = 120 ✓')}`),
    T(p(`Your turn. Share ${money(100)} in the ratio 3 : 2. How much is the larger share?`), [money(60), money(40), money(20), money(50)], 0, 'Yes! 5 parts, 20 each: 3 × 20 = 60.', 'Not quite. 3 + 2 = 5 parts. Find one part first.')
  ] }),
  'e-sdt': () => { const s = U('speed'), d = U('big'); return { title: 'Speed, distance, time', frames: [
    F(`${box(`Distance = Speed × Time<br>Speed = Distance ÷ Time<br>Time = Distance ÷ Speed`)}${p(`A bus at 60 ${s} for 3 hours: 60 × 3 = ${alt(180)} ${d}`)}`),
    F(`${p('Memory trick: a triangle with <b>D</b> on top and <b>S × T</b> underneath. Cover the one you want; what is left tells you how to work it out.')}`),
    T(p(`Your turn. A car goes 120 ${d} in 2 hours. What is its speed?`), [`60 ${s}`, `240 ${s}`, `122 ${s}`, `30 ${s}`], 0, 'Yes! 120 ÷ 2 = 60.', 'Not quite. Speed = distance ÷ time.')
  ] }; },
  'e-nth': () => ({ title: 'Sequences: the nth term', frames: [
    F(`${big('2, 7, 12, 17, …')}${p(`It goes up by ${mk(5)} each time, so the rule starts with 5n.`)}${table([['n', 1, 2, 3], ['5n', 5, 10, 15], ['term', 2, 7, 12]])}${p('Each term is 3 less than 5n: <b>nth term = 5n − 3</b>')}`),
    F(`${p(`10th term: 5 × 10 − 3 = ${alt(47)}`)}${p('Check with the first term: 5 × 1 − 3 = 2 ✓')}`),
    T(`${p('Your turn. What is the 10th term?')}${big('4, 7, 10, 13, …')}`, [31, 30, 34, 43], 0, 'Yes! Rule 3n + 1: 3 × 10 + 1 = 31.', 'Not quite. It goes up by 3, so start with 3n. What do you add to 3n to get 4?')
  ] }),
  'e-coord4': () => ({ title: 'Coordinates in four quadrants', frames: [
    F(`${coordGrid([[2, -1, '(2, −1)'], [-3, 2, '(−3, 2)', '#1971c2']], 4, true)}${p('Left of the y-axis, x is negative. Below the x-axis, y is negative.')}`),
    F(`${p('Still along first, then up or down. (2, −1): right 2, <b>down</b> 1.')}`),
    T(`${p('Your turn. What are the coordinates of A?')}${coordGrid([[-3, 2, 'A']], 4, true)}`, ['(−3, 2)', '(3, −2)', '(2, −3)', '(−2, 3)'], 0, 'Yes! Left 3, up 2.', 'Not quite. Along first: is it left (negative) or right?')
  ] }),
  'e-circm': () => { const u = U('len'), a = U('area'); return { title: 'Circumference and area of circles', frames: [
    F(`${box(`Circumference (distance round) = 2πr = πd<br>Area = πr²`)}${p(`π ≈ ${fr(22, 7)} or 3.14`)}`, 'Circumference is two pi r. Area is pi r squared. Pi is about twenty-two sevenths, or three point one four.'),
    F(`${p(`Radius 21 ${u}: C = 2 × ${fr(22, 7)} × 21 = ${alt(132)} ${u}`)}${p(`Radius 14 ${u}: A = ${fr(22, 7)} × 14 × 14 = ${alt(616)} ${a}`)}`, 'Radius twenty one: circumference is one hundred and thirty two. Radius fourteen: area is six hundred and sixteen.'),
    T(p(`Your turn. Using π = 22/7, what is the circumference of a circle with radius 7 ${u}?`), [44, 154, 22, 14], 0, 'Yes! 2 × 22/7 × 7 = 44.', 'Not quite. Circumference = 2 × π × r.')
  ] }; },
  'e-si': () => ({ title: 'Simple interest', frames: [
    F(`${big('Interest = P × R × T ÷ 100')}${box('P = amount (principal), R = rate % a year, T = years')}${p(`${money(8000)} at 8% for 2 years: 8000 × 8 × 2 ÷ 100 = ${alt(money(1280))}`)}`),
    F(`${p('Simple interest is the same every year: 8% of 8000 = 640 a year, × 2 years = 1280.')}`),
    T(p(`Your turn. Find the simple interest on ${money(5000)} at 10% a year for 3 years.`), [money(1500), money(500), money(6500), money(150)], 0, 'Yes! 10% is 500 a year, × 3 = 1500.', 'Not quite. Find one year\'s interest, then multiply by 3.')
  ] }),
  'e-pie': () => ({ title: 'Pie charts', frames: [
    F(`${pie([['Cricket', 90, '#4dabf7'], ['Kabaddi', 180, '#ffa94d'], ['Tennis', 90, '#b2f2bb']])}${p('The whole circle is 360° = everyone asked.')}`),
    F(`${p('80 students. Kabaddi has 180°, which is half of 360°.')}${p(`${fr(180, 360)} × 80 = ${alt(40)} students`)}`, '80 students. Kabaddi has 180 degrees, half the circle, so 40 students.'),
    T(p('Your turn. 60 students were asked. A slice is 120°. How many students is that?'), [20, 30, 40, 12], 0, 'Yes! 120° is a third of 360°: 60 ÷ 3 = 20.', 'Not quite. What fraction of 360° is 120°?')
  ] }),
  'e-prob': () => ({ title: 'Probability', frames: [
    F(`${big('Probability = ways it can happen ÷ all possible outcomes')}${p('A bag has 4 red, 5 blue and 4 green balls. P(blue)?')}${big(`${fr(5, '4 + 5 + 4')} = ${fr(alt(5), alt(13))}`)}`, 'Probability is ways it can happen over all outcomes. Five blue out of thirteen: five thirteenths.'),
    F(`${p('Simplify if you can: 4 out of 10 = 2/5.')}${p('Probabilities go from 0 (impossible) to 1 (certain).')}`),
    T(p('Your turn. A bag has 3 red, 2 blue and 5 green balls. What is the probability of green?'), [fr(1, 2), fr(1, 5), fr(2, 5), fr(5, 7)], 0, 'Yes! 5 out of 10 = 1/2.', 'Not quite. 5 green out of 3 + 2 + 5 = 10 balls.')
  ] }),
  'm-fracdiv': () => ({ title: 'Dividing fractions', frames: [
    F(`${p('How many halves are there in 3?')}${barRow(2, 2, '#4dabf7')}${barRow(2, 2, '#4dabf7')}${barRow(2, 2, '#4dabf7')}${big(`3 ÷ ${fr(1, 2)} = ${alt(6)}`)}`, 'How many halves in three? Six.'),
    F(`${p('Rule: <b>flip</b> the second fraction and <b>multiply</b>.')}${big(`${fr(4, 3)} ÷ ${fr(7, 8)} = ${fr(4, 3)} × ${fr(8, 7)} = ${fr(32, 21)}`)}`, 'Flip the second fraction and multiply. Four thirds divided by seven eighths is four thirds times eight sevenths, thirty-two twenty-firsts.'),
    T(`${p('Your turn.')}${big(`2 ÷ ${fr(1, 4)} = ?`)}`, [8, fr(1, 2), 6, fr(2, 4)], 0, 'Yes! There are 4 quarters in each whole: 2 × 4 = 8.', 'Not quite. How many quarters are in 2 wholes?', 'Your turn. Two divided by one quarter?')
  ] }),
  'm-expand': () => ({ title: 'Expanding brackets', frames: [
    F(`${p('Multiply <b>everything</b> inside the bracket by the number outside.')}${big(`3(x − 3) = 3x − 9`)}${big(`7(4x + 4) = 28x + 28`)}`),
    F(cmp(no('Only the first term', '3x − 3'), yes('Both terms', '3x − 9'))),
    T(`${p('Your turn. Expand')}${big('5(2x + 3)')}`, ['10x + 15', '10x + 3', '7x + 8', '10x + 8'], 0, 'Yes! 5 × 2x = 10x and 5 × 3 = 15.', 'Not quite. Multiply both 2x and 3 by 5.')
  ] }),
  'm-scale': () => { const u = U('len'); return { title: 'Scale drawings and maps', frames: [
    F(`${p('A scale of <b>1 : 20</b> means 1 unit on the model is 20 units in real life.')}${box('Real → model: ÷ 20<br>Model → real: × 20')}${p(`A real car 140 ${u} long → model 140 ÷ 20 = ${alt(7)} ${u}`)}`),
    F(`${p(isUS() ? 'On a map, 1 in might stand for 1 mile: measure, then multiply.' : 'On a 1 : 50,000 map, 1 cm stands for 50,000 cm = 500 m.')}`),
    T(p(`Your turn. Scale 1 : 20. The model is 6 ${u} long. How long is the real thing?`), [120, 26, 3, 14], 0, 'Yes! 6 × 20 = 120.', 'Not quite. Model to real: multiply by 20.')
  ] }; },
  'm-congr': () => ({ title: 'Congruent and similar shapes', frames: [
    F(`${box('<b>Congruent</b>: exactly the same shape and size (it may be turned or flipped)<br><b>Similar</b>: same shape, but every side is multiplied by the same number')}`),
    F(`${table([['Rectangles', 'Answer'], ['2 × 3 and 3 × 2', 'congruent'], ['2 × 3 and 4 × 6', 'similar (× 2)'], ['2 × 3 and 3 × 4', 'neither']])}`),
    T(p('Your turn. A 3 × 5 rectangle and a 6 × 10 rectangle are…'), ['congruent', 'similar', 'neither'], 1, 'Yes! Both sides are doubled.', 'Not quite. Is each side multiplied by the same number?')
  ] }),
  'm-sample': () => ({ title: 'Sample spaces', frames: [
    F(`${p('A <b>sample space</b> lists every possible outcome.')}${p('Two coins: HH, HT, TH, TT = 4 outcomes.')}${p('Three coins: 2 × 2 × 2 = <b>8</b>.')}`),
    F(`${p('Shortcut: <b>multiply</b> the number of choices for each part.')}${p('A spinner with 5 colours and one with 2 numbers: 5 × 2 = 10 outcomes.')}`),
    T(p('Your turn. You roll a dice and flip a coin. How many outcomes?'), [12, 8, 6, 2], 0, 'Yes! 6 × 2 = 12.', 'Not quite. 6 ways for the dice times 2 for the coin.')
  ] }),
  'm-exper': () => ({ title: 'Experimental probability', frames: [
    F(`${big('Experimental probability = times it happened ÷ number of tries')}${p(`A spinner landed on red 17 times in 40 spins: P(red) = ${fr(17, 40)}`)}`, 'Times it happened divided by number of tries. Red: seventeen fortieths.'),
    F(`${p('To predict, multiply the probability by the number of tries:')}${p(`P = ${fr(1, 5)}, 40 drops → ${fr(1, 5)} × 40 = ${alt(8)} times`)}`, 'Probability one fifth, forty drops: about eight times.'),
    T(p('Your turn. You flip a fair coin 60 times. About how many heads do you expect?'), [30, 60, 20, 6], 0, 'Yes! ½ × 60 = 30.', 'Not quite. Heads has probability one half.')
  ] }),

  // ---------------- Grade 8 ----------------
  'ac-lineq': () => ({ title: 'Linear equations', frames: [
    F(`${p('An equation is a balance. Do the <b>same</b> to both sides to get x on its own.')}${big('7x + 1 = 57')}${steps(['Take 1 from both sides: 7x = 56', `Divide both sides by 7: x = ${alt(8)}`])}`),
    F(`${p('Undo in reverse order: first undo + or −, then × or ÷.')}${p('Check: 7 × 8 + 1 = 57 ✓')}`),
    T(`${p('Your turn. Solve')}${big('3x − 4 = 11')}`, [5, 7, 15, 3], 0, 'Yes! 3x = 15, so x = 5.', 'Not quite. Add 4 to both sides first, then divide by 3.')
  ] }),
  't-cube': () => ({ title: 'Cubes 1 to 15', frames: [
    F(`${p('A <b>cube</b> number is a number times itself, three times.')}${big(`5${sup(3)} = 5 × 5 × 5 = ${alt(125)}`)}${p(`Not 5 × 3! The cube root reverses it: ∛125 = 5.`)}`),
    F(`${p('Cube roots of big numbers: look at the last digit.')}${box('2197 ends in 7, and 3³ = 27 ends in 7 → the root ends in 3.<br>13³ = 2197 ✓')}`),
    T(`${p('Your turn.')}${big(`4${sup(3)} = ?`)}`, [64, 12, 16, 48], 0, 'Yes! 4 × 4 × 4 = 64.', 'Not quite. Multiply three 4s together.', 'Your turn. Four cubed?')
  ] }),
  'e-sci': () => ({ title: 'Standard form', frames: [
    F(`${p('Standard form writes a number as <b>a × 10ⁿ</b>, where a is at least 1 and less than 10.')}${big(`12,000 = 1.2 × 10${sup(4)}`)}${p('The point moves 4 places to make 1.2, so the power is 4.')}`, 'Standard form: a times ten to the n, where a is from one to just under ten. Twelve thousand is one point two times ten to the four.'),
    F(`${p(`50,000,000 = 5 × 10${sup(7)}. Small numbers use a negative power: 0.003 = 3 × 10${sup('−3')}.`)}`, 'Fifty million is five times ten to the seven. Small numbers use negative powers.'),
    T(`${p('Your turn. Write 3,400 in standard form.')}`, [`3.4 × 10${sup(3)}`, `34 × 10${sup(2)}`, `3.4 × 10${sup(4)}`, `0.34 × 10${sup(4)}`], 0, 'Yes! The point moves 3 places.', 'Not quite. The first number must be between 1 and 10.', 'Your turn. Write three thousand four hundred in standard form.')
  ] }),
  'e-poly': () => ({ title: 'Angles in polygons', frames: [
    F(`${p('Split a polygon into triangles from one corner. A shape with n sides makes <b>n − 2</b> triangles.')}${shape([[50, 5], [95, 38], [78, 92], [22, 92], [5, 38]], { w: 140 })}${big('Sum = (n − 2) × 180°')}`),
    F(`${p(`Pentagon (5 sides): 3 × 180 = ${alt('540°')}`)}${p('Regular shape: each angle = sum ÷ n. Pentagon: 540 ÷ 5 = 108°.')}${p('The outside (exterior) angles of any polygon add to 360°.')}`),
    T(p('Your turn. What do the inside angles of a hexagon (6 sides) add up to?'), ['720°', '1080°', '540°', '360°'], 0, 'Yes! (6 − 2) × 180 = 720.', 'Not quite. Use (n − 2) × 180 with n = 6.')
  ] }),
  'm-recur': () => ({ title: 'Recurring decimals', frames: [
    F(`${p('Some fractions make decimals that <b>repeat for ever</b>:')}${big(`${fr(1, 3)} = 0.333…`)}${p('Others stop: 1/8 = 0.125.')}`, 'Some fractions repeat for ever: one third is nought point three three three. Others stop: one eighth is nought point one two five.'),
    F(`${p('The test: simplify the fraction, then look at the bottom.')}${box('Bottom made only of 2s and 5s → the decimal <b>ends</b><br>Any other prime factor (3, 7, 11…) → it <b>recurs</b>')}${p('12 = 2 × 2 × 3 has a 3, so 1/12 recurs: 0.08333…')}`),
    T(p('Your turn. What happens with 1/20?'), ['It ends (0.05)', 'It recurs'], 0, 'Yes! 20 = 2 × 2 × 5: only 2s and 5s.', 'Not quite. Break 20 into primes: are they only 2s and 5s?')
  ] }),
  'm-factor': () => ({ title: 'Factorising', frames: [
    F(`${p('Factorising is the opposite of expanding: take out the <b>biggest common factor</b>.')}${big(`21x + 6 = 3(7x + 2)`)}${p('3 divides both 21 and 6.')}`),
    F(`${p('Check by expanding back: 3 × 7x + 3 × 2 = 21x + 6 ✓')}${p('"Fully" means take out the <b>highest</b> common factor, not just any.')}`),
    T(`${p('Your turn. Factorise fully')}${big('10x + 15')}`, ['5(2x + 3)', '5(2x + 15)', '2(5x + 15)', '10(x + 15)'], 0, 'Yes! 5 is the biggest number that divides 10 and 15.', 'Not quite. Find the HCF of 10 and 15, then divide each term by it.')
  ] }),
  'm-ineq': () => ({ title: 'Inequalities', frames: [
    F(`${box('&lt; less than &nbsp; &gt; greater than<br>≤ less than or equal &nbsp; ≥ greater than or equal')}${p('Solve like an equation, keeping the sign:')}${big('6x + 7 &lt; 49')}${p(`6x &lt; 42, so ${alt('x &lt; 7')}`)}`),
    F(`${p('Whole numbers n with −2 &lt; n &lt; 1: −1 and 0, so <b>2</b> numbers. The ends are not included.')}${p('Careful: multiplying or dividing by a <b>negative</b> number flips the sign.')}`),
    T(`${p('Your turn. Solve')}${big('2x + 3 &gt; 11')}`, ['x &gt; 4', 'x &lt; 4', 'x &gt; 7', 'x &gt; 5.5'], 0, 'Yes! 2x > 8, so x > 4.', 'Not quite. Take 3 from both sides, then divide by 2.')
  ] }),
  'm-constr': () => ({ title: 'Constructions', frames: [
    F(`${p('Can three lengths make a triangle? The two shorter sides must add up to <b>more</b> than the longest.')}${box('3, 5, 14: 3 + 5 = 8, less than 14 → <b>No</b><br>5, 6, 9: 5 + 6 = 11, more than 9 → <b>Yes</b>')}`),
    F(`${p('A <b>perpendicular bisector</b> cuts a line exactly in half, at a right angle. A 10 cm line is cut at 5 cm from each end.')}`),
    T(p('Your turn. Can you make a triangle with sides 4, 5 and 7?'), ['Yes', 'No'], 0, 'Yes! 4 + 5 = 9, which is more than 7.', 'Not quite. Add the two shorter sides and compare with 7.')
  ] }),
  'm-cyl': () => { const u = U('len'), v = U('vol'); return { title: 'Volume of a cylinder', frames: [
    F(`${cylinder(7, 10, u)}${big('Volume = πr² × h')}${p('Area of the circle on the end, times the height.')}`),
    F(`${p(`r = 7, h = 10: ${fr(22, 7)} × 7 × 7 × 10 = 154 × 10 = ${alt(1540)} ${v}`)}`, 'Radius seven, height ten: twenty-two sevenths times forty-nine is one hundred and fifty four, times ten is one thousand five hundred and forty.'),
    T(p(`Your turn. Using π = 22/7, a cylinder has r = 7 and h = 2. What is its volume?`), [308, 154, 88, 616], 0, 'Yes! 154 × 2 = 308.', 'Not quite. πr² = 22/7 × 49 = 154, then multiply by the height.')
  ] }; },
  'm-scatter': () => ({ title: 'Scatter graphs and correlation', frames: [
    F(`<div class="lgrid"><div class="lbox">${scatter('pos')}<br><b>Positive</b><br><small>both go up</small></div><div class="lbox">${scatter('neg')}<br><b>Negative</b><br><small>one up, one down</small></div><div class="lbox">${scatter('none')}<br><b>None</b><br><small>no pattern</small></div></div>`),
    F(`${p('Height and shoe size: positive. Temperature and coats sold: negative. Shoe size and maths score: none.')}`),
    T(p('Your turn. The more hours someone practises, the fewer mistakes they make. What correlation is that?'), ['positive', 'negative', 'none'], 1, 'Yes! One goes up while the other goes down.', 'Not quite. Hours go up, mistakes go down.')
  ] })
};
