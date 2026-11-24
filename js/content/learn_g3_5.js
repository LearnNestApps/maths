// "Learn first" explainers for Grades 3–5. Each matches what its lesson's questions ask.
import { F, T, fr, big, p, mk, alt, no, yes, cmp, steps, box, bar, barRow, cols, pv, nline, rect, angle, shape, chart, abacus, bm, table, coordGrid } from './learn_kit.js';
import { isIndia, isUS, U, fmt } from '../core/region.js';

const INK = '#1d3557';
// A small robot grid: robot at [c, r] facing up, star at [c, r], path of cells.
function robotGrid(robot, star, path = [], rocks = [], n = 4) {
  const s = 40, cell = ([c, r]) => [10 + c * s + s / 2, 10 + r * s + s / 2];
  const g = []; for (let i = 0; i <= n; i++) g.push(`<line x1="${10 + i * s}" y1="10" x2="${10 + i * s}" y2="${10 + n * s}" stroke="#ced4da"/><line x1="10" y1="${10 + i * s}" x2="${10 + n * s}" y2="${10 + i * s}" stroke="#ced4da"/>`);
  const pts = [robot, ...path].map(cell);
  return `<svg class="lpic" viewBox="0 0 ${n * s + 20} ${n * s + 20}" width="${n * s + 20}" role="img" aria-label="robot grid">${g.join('')}
    ${rocks.map(q => { const [x, y] = cell(q); return `<circle cx="${x}" cy="${y}" r="13" fill="#868e96"/>`; }).join('')}
    ${pts.length > 1 ? `<polyline points="${pts.map(q => q.join(',')).join(' ')}" fill="none" stroke="#4dabf7" stroke-width="4" stroke-dasharray="6 5"/>` : ''}
    <text x="${cell(star)[0]}" y="${cell(star)[1] + 9}" font-size="26" text-anchor="middle">⭐</text>
    <g transform="translate(${cell(robot)[0]} ${cell(robot)[1]})"><rect x="-13" y="-11" width="26" height="24" rx="6" fill="#ff6b4a"/><path d="M-7 -11 L0 -21 L7 -11 Z" fill="#ff6b4a"/><circle cx="-5" cy="0" r="3" fill="#fff"/><circle cx="5" cy="0" r="3" fill="#fff"/></g></svg>`;
}
// Venn picture: two circles with numbers in each part.
function venn(la, lb, a, both, b, out = []) {
  const t = (xs, x, y) => xs.map((v, i) => `<text x="${x}" y="${y + i * 20}" font-size="16" font-weight="700" text-anchor="middle" fill="${INK}">${v}</text>`).join('');
  return `<svg class="lpic" viewBox="0 0 300 180" width="300" role="img" aria-label="Venn diagram"><rect x="2" y="2" width="296" height="176" rx="10" fill="#f8f9fa" stroke="#adb5bd"/>
    <circle cx="115" cy="95" r="64" fill="#ff6b4a33" stroke="#ff6b4a" stroke-width="2.5"/><circle cx="185" cy="95" r="64" fill="#4dabf733" stroke="#4dabf7" stroke-width="2.5"/>
    <text x="85" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="#e8590c">${la}</text><text x="215" y="24" font-size="13" font-weight="700" text-anchor="middle" fill="#1971c2">${lb}</text>
    ${t(a, 88, 92)}${t(both, 150, 92)}${t(b, 212, 92)}${t(out, 270, 160)}</svg>`;
}
// Tally marks: groups of five (four lines and a line across).
function tally(n) {
  const g = []; let x = 6;
  for (let k = 0; k < Math.floor(n / 5); k++) { for (let i = 0; i < 4; i++) g.push(`<line x1="${x + i * 8}" y1="6" x2="${x + i * 8}" y2="34" stroke="${INK}" stroke-width="3"/>`); g.push(`<line x1="${x - 4}" y1="30" x2="${x + 28}" y2="10" stroke="#ff6b4a" stroke-width="3"/>`); x += 46; }
  for (let i = 0; i < n % 5; i++) g.push(`<line x1="${x + i * 8}" y1="6" x2="${x + i * 8}" y2="34" stroke="${INK}" stroke-width="3"/>`);
  return `<svg class="lpic" viewBox="0 0 ${x + 40} 40" width="${x + 40}" height="40" role="img" aria-label="${n} tally marks">${g.join('')}</svg>`;
}
const sm = (s, w = 110) => s.replace('class="lpic"', `class="lpic" style="width:${w}px;height:auto"`);
const codeBlock = s => `<pre class="lcode">${s}</pre>`;
const ab = (n, rods) => abacus(n, rods);

export const G3_5 = {
  // ---------------- Grade 3 ----------------
  'm-abacus2': () => ({ title: 'Abacus: tens and ones', frames: [
    F(`${p('Each rod is a place. The right rod is <b>ones</b>, the next rod is <b>tens</b>.')}${ab(47)}${p(`Beads pushed to the bar count. The top bead is worth ${mk('5')}; each bottom bead is worth ${mk('1')}.`)}`),
    F(`${p('Read each rod, then put them together.')}${box(`Tens rod: 4 bottom beads = <b>4 tens</b><br>Ones rod: top bead 5 + 2 bottom beads = <b>7 ones</b>`)}${big(`4 tens and 7 ones = ${alt(47)}`)}`),
    T(`${p('Your turn. What number does this abacus show?')}${ab(36)}`, [36, 63, 31, 86], 0, 'Yes! 3 tens, and 5 + 1 = 6 ones.', 'Not quite. Count the tens rod first, then the ones rod (top bead = 5).')
  ] }),
  'm-bar1': () => ({ title: 'Bar models: part and whole', frames: [
    F(`${p('A bar model shows a whole split into parts.')}${bm([{ parts: [[16, '16 red', '#ffa8a8'], [57, '? blue', '#a5d8ff']] }], 'Whole: 73 stickers')}${p('The parts together make the whole.')}`),
    F(`${p('Aarav has 73 stickers. 16 are red. How many are blue?')}${steps(['The whole is 73. One part is 16.', `Missing part = whole − known part`, `73 − 16 = ${alt(57)}`])}${p('Check: 16 + 57 = 73 ✓')}`),
    F(cmp(no('Add them', '73 + 16 = 89'), yes('Take the part away', '73 − 16 = 57')) + p('The blue part must be <b>smaller</b> than the whole, so we subtract.')),
    T(p('Your turn. Kabir has 50 marbles. 18 are blue and the rest are green. How many are green?') + bm([{ parts: [[18, '18 blue', '#a5d8ff'], [32, '?', '#b2f2bb']] }], 'Whole: 50'), [32, 68, 42, 18], 0, 'Yes! 50 − 18 = 32.', 'Not quite. The whole is 50; take away the 18 blue ones.')
  ] }),
  'lc-robot2': () => ({ title: 'Robot: turns and rocks', frames: [
    F(`${p('The robot follows your program one block at a time.')}${box('<b>Forward</b>: move one square.<br><b>Turn left</b> / <b>Turn right</b>: turn on the spot. It does <b>not</b> move.')}`),
    F(`${p('The robot faces up. Plan the path before you build it.')}${robotGrid([0, 3], [1, 1], [[0, 2], [0, 1], [1, 1]], [[1, 2]])}${p('Forward, Forward, Turn right, Forward. The robot cannot move onto a rock, so plan a path around rocks.')}`),
    F(cmp(no('Turn right, then stop', 'still in the same square'), yes('Turn right, then Forward', 'moves one square right')) + p('After every turn you still need <b>Forward</b> to move.')),
    T(p('Your turn. The robot faces up. The star is 2 squares up, then 1 square right. Which program works?') + robotGrid([1, 3], [2, 1]), ['Forward, Forward, Turn right, Forward', 'Forward, Forward, Forward, Turn right', 'Turn right, Forward, Forward, Forward', 'Turn left, Forward, Forward'], 0, 'Yes! Up two squares, turn to face right, then one step.', 'Not quite. Go up first (Forward twice), then turn right and move once.')
  ] }),
  'lc-sort': () => ({ title: 'Sorting like a computer', frames: [
    F(`${p('Computers sort lists all the time: names A to Z, prices low to high.')}${p('A simple way: find the <b>smallest</b>, put it first. Then find the smallest of what is left. Repeat.')}`),
    F(`${big('42, 7, 19, 30')}${steps(['Smallest is <b>7</b> → 7', 'Smallest left is <b>19</b> → 7, 19', 'Then <b>30</b>, then <b>42</b>'])}${big(alt('7, 19, 30, 42'))}${p('Largest to smallest is the same list backwards.')}`),
    T(`${p('Your turn. Sort from smallest to largest:')}${big('58, 12, 85, 21')}${p('Which number comes <b>second</b>?')}`, [12, 21, 58, 85], 1, 'Yes! 12, 21, 58, 85: 21 is second.', 'Not quite. Put the smallest first (12). What is the next smallest?')
  ] }),
  'lc-venn': () => ({ title: 'Venn diagrams: sort the numbers', frames: [
    F(`${p('A Venn diagram sorts things into circles.')}${venn('Even', 'More than 10', ['4', '8'], ['12', '16'], ['15', '13'], ['7'])}`),
    F(steps(['<b>Left only</b>: even, not more than 10 (4, 8)', '<b>Middle</b>: in <b>both</b> circles (12, 16)', '<b>Right only</b>: more than 10, not even (13, 15)', '<b>Outside</b>: in neither (7)'])),
    T(`${p('Your turn. Circles: <b>Even</b> and <b>More than 10</b>. Where does <b>18</b> go?')}`, ['Even only', 'More than 10 only', 'Middle (both)', 'Outside'], 2, 'Yes! 18 is even AND more than 10, so it goes in the middle.', 'Not quite. Is 18 even? Is it more than 10? If both, it goes in the middle.')
  ] }),
  'e-pv': () => ({ title: isIndia() ? 'Place value to lakhs' : 'Place value to millions', frames: [
    F(`${p('Each place is worth 10 times the place to its right.')}${pv(['Ten thou&shy;sands', 'Thou&shy;sands', 'Hun&shy;dreds', 'Tens', 'Ones'], '72229')}${p(`The value of a digit = the digit × its place. The 7 is in the ten thousands place: ${mk(`7 × 10,000 = ${fmt(70000)}`)}.`)}`),
    F(`${p('The same digit can have different values:')}${big('7 <span class="alt">2</span> 2 2 9')}${box(`2 in the thousands place = ${fmt(2000)}<br>2 in the hundreds place = 200<br>2 in the tens place = 20`)}${isIndia() ? p('The next place after ten thousands is the <b>lakh</b>: 1,00,000.') : p('The next place after ten thousands is the <b>hundred thousands</b>: 100,000.')}`),
    T(`${p('Your turn. What is the value of the 5 in')}${big(fmt(45312))}`, [5, 500, fmt(5000), fmt(50000)], 2, `Yes! The 5 is in the thousands place: ${fmt(5000)}.`, 'Not quite. Count the places from the right: ones, tens, hundreds, thousands…')
  ] }),
  'e-round': () => ({ title: 'Rounding to 10, 100, 1000', frames: [
    F(`${p('Rounding means finding the <b>nearest</b> ten, hundred or thousand.')}${nline(5800, 5900, 10, [], [[5890, '5,890']])}${p('5,890 is nearer to 5,900 than to 5,800.')}`),
    F(`${p('The rule: look at the digit <b>just to the right</b> of the place you round to.')}${box('5, 6, 7, 8 or 9 → round <b>up</b><br>0, 1, 2, 3 or 4 → round <b>down</b>')}${p(`Round 52,205 to the nearest 1000: the thousands digit is 2; the next digit is ${mk('2')}, so round down → ${alt('52,000')}.`)}`),
    F(cmp(no('5,899 → 5,800', ''), yes('5,899 → 5,900', '')) + p('To the nearest 100: look at the tens digit, 9. That rounds <b>up</b>.')),
    T(`${p('Your turn. Round to the nearest 100:')}${big('3,650')}`, ['3,600', '3,700', '4,000', '3,650'], 1, 'Yes! The tens digit is 5, so round up to 3,700.', 'Not quite. Look at the tens digit. 5 or more rounds up.')
  ] }),
  'e-add3': () => ({ title: 'Adding 3-digit numbers', frames: [
    F(`${p('Line the numbers up in columns: hundreds, tens, ones. Start with the <b>ones</b>.')}${cols(['359', '+577'], '936', ' 11 ')}`),
    F(steps([`Ones: 9 + 7 = 16. Write ${mk(6)}, carry 1 ten.`, `Tens: 5 + 7 + 1 = 13. Write ${mk(3)}, carry 1 hundred.`, `Hundreds: 3 + 5 + 1 = ${mk(9)}.`]) + big(`359 + 577 = ${alt(936)}`)),
    F(cmp(no('Forget the carry', '826'), yes('Add the carried 1s', '936')) + p('The small carried 1 must be added to the next column.')),
    T(`${p('Your turn.')}${cols(['248', '+135'])}`, [373, 383, 483, 393], 1, 'Yes! 8 + 5 = 13: write 3, carry 1. Then 4 + 3 + 1 = 8, and 2 + 1 = 3.', 'Not quite. Start with the ones: 8 + 5 = 13. Remember the carry.')
  ] }),
  'e-sub3': () => ({ title: 'Subtracting 3-digit numbers', frames: [
    F(`${p('Line up the columns and start with the <b>ones</b>. Always take the bottom number from the top.')}${cols(['692', '−255'], '437')}`),
    F(steps([`Ones: 2 − 5? Not enough. ${mk('Borrow')} 1 ten: 12 − 5 = 7.`, 'Tens: 9 became 8. 8 − 5 = 3.', 'Hundreds: 6 − 2 = 4.']) + big(`692 − 255 = ${alt(437)}`)),
    F(cmp(no('5 − 2 = 3 (wrong way round)', '443'), yes('Borrow: 12 − 5 = 7', '437')) + p('Check by adding back: 437 + 255 = 692 ✓')),
    T(`${p('Your turn.')}${cols(['534', '−218'])}`, [316, 324, 326, 416], 0, 'Yes! 14 − 8 = 6, then 2 − 1 = 1, then 5 − 2 = 3.', 'Not quite. 4 − 8 needs a borrow: 14 − 8 = 6, and the 3 tens become 2.')
  ] }),
  'e-mul2x1': () => ({ title: '2-digit × 1-digit', frames: [
    F(`${p('Split the bigger number into tens and ones, multiply each, then add.')}${big('54 × 3')}${box(`50 × 3 = ${mk(150)}<br>4 × 3 = ${mk(12)}`)}${big(`150 + 12 = ${alt(162)}`)}`),
    F(`${p('In columns it is the same idea, with a carry:')}${cols(['54', '× 3'], '162', '1 ')}${p('4 × 3 = 12: write 2, carry 1. Then 5 × 3 = 15, + 1 = 16.')}`),
    T(`${p('Your turn.')}${big('36 × 4 = ?')}`, [124, 144, 134, 164], 1, 'Yes! 30 × 4 = 120 and 6 × 4 = 24. 120 + 24 = 144.', 'Not quite. Split it: 30 × 4 and 6 × 4, then add.')
  ] }),
  'e-missing': () => ({ title: 'Missing numbers', frames: [
    F(`${big('□ × 3 = 12')}${p('Ask: what times 3 makes 12? Or use the <b>opposite</b> operation:')}${big(`12 ÷ 3 = ${alt(4)}`)}`),
    F(`${box('× ↔ ÷ are opposites<br>+ ↔ − are opposites')}${big('□ + 7 = 15')}${p(`15 − 7 = ${alt(8)}. Check: 8 + 7 = 15 ✓`)}`),
    T(`${p('Your turn. Find the missing number.')}${big('□ × 6 = 42')}`, [6, 7, 8, 36], 1, 'Yes! 42 ÷ 6 = 7, and 7 × 6 = 42.', 'Not quite. Divide: 42 ÷ 6.')
  ] }),
  'm-abacus3': () => ({ title: 'Abacus: small friends', frames: [
    F(`${p('<b>Small friends</b> are pairs that make 5:')}${big('1 + 4 &nbsp; 2 + 3')}${p('Use them when there are not enough bottom beads to add.')}`),
    F(`${p('The abacus shows 2. Add 4. Only 2 bottom beads are free!')}${cmp(`<div class="lbox">${sm(ab(2, 1))}<br>2</div>`, `<div class="lbox">${sm(ab(6, 1))}<br>6</div>`)}${p(`+ 4 = ${mk('+ 5 − 1')}: bring the top bead down (+5), push 1 bottom bead away (−1).`)}`),
    T(`${p('Your turn. The abacus shows 4. You want to add 3. What do you do?')}`, ['+ 5 − 2', '+ 10 − 7', '+ 5 − 3', '+ 2 + 1'], 0, 'Yes! 3 and 2 are small friends: + 3 = + 5 − 2. 4 + 3 = 7.', 'Not quite. Which number makes 5 with 3? Add 5, then take that away.')
  ] }),
  'm-abacus4': () => ({ title: 'Abacus: big friends', frames: [
    F(`${p('<b>Big friends</b> are pairs that make 10:')}${big('1+9 &nbsp; 2+8 &nbsp; 3+7 &nbsp; 4+6 &nbsp; 5+5')}`),
    F(`${p('65 + 6: the ones rod cannot take 6 more.')}${p(`+ 6 = ${mk('+ 10 − 4')}: add one bead on the tens rod, take 4 away on the ones rod.`)}${cmp(`<div class="lbox">${sm(ab(65), 120)}<br>65</div>`, `<div class="lbox">${sm(ab(71), 120)}<br>71</div>`)}`),
    T(`${p('Your turn. 48 + 7. Which move do you use?')}`, ['+ 10 − 3', '+ 10 − 7', '+ 5 + 2', '+ 10 + 3'], 0, 'Yes! 7 and 3 are big friends. 48 + 10 = 58, − 3 = 55.', 'Not quite. Which number makes 10 with 7? Add 10, then take that away.')
  ] }),
  'm-ordinal': () => ({ title: 'Ordinal numbers', frames: [
    F(`${p('Ordinal numbers tell the <b>position</b>: first, second, third…')}${big('1st 2nd 3rd 4th 5th')}${p('Most end in <b>th</b>. But 21st, 22nd, 23rd, 31st… and 11th, 12th, 13th are special.')}`),
    F(`${p('In a race, 22 children finish <b>before</b> Sam.')}${p(`Sam is the next one: 22 + 1 = ${mk(23)}.`)}${big(`Sam is ${alt('23rd')}`)}`),
    T(p('Your turn. 9 children finish before Ava. In what place does Ava finish?'), ['8th', '9th', '10th', '11th'], 2, 'Yes! 9 before her, so she is the 10th.', 'Not quite. If 9 are ahead, add 1 for Ava.')
  ] }),
  'm-weight': () => isUS() ? ({ title: 'Weight and capacity', frames: [
    F(`${p('<b>Weight</b> (how heavy): ounces (oz) and pounds (lb). 16 oz = 1 lb.')}${p('<b>Capacity</b> (how much a container holds): cups, pints (pt), quarts (qt), gallons (gal).')}`),
    F(`${p('Reading a jug: find what <b>one small line</b> is worth.')}${p('If 0 to 4 cups has 8 small gaps, each gap is ½ cup. 7 gaps = 3½ cups.')}`),
    T(p('Your turn. Which unit would you use to weigh a bag of potatoes?'), ['oz', 'lb', 'cups', 'gal'], 1, 'Yes! A bag of potatoes is heavy: pounds.', 'Not quite. It is a weight, and quite heavy.')
  ] }) : ({ title: 'Weight and capacity', frames: [
    F(`${p('<b>Weight</b> (how heavy): grams (g) and kilograms (kg). 1000 g = 1 kg.')}${p('<b>Capacity</b> (how much a container holds): millilitres (ml) and litres (l). 1000 ml = 1 l.')}`),
    F(`${p('Reading a jug: find what <b>one small line</b> is worth.')}${p('If 0 to 500 ml has 5 gaps, each gap is 100 ml. Water up to the 3rd line = 300 ml.')}`),
    T(p('Your turn. Which unit would you use to weigh a bag of rice?'), ['g', 'kg', 'ml', 'l'], 1, 'Yes! A bag of rice is heavy: kilograms.', 'Not quite. It is a weight, and quite heavy.')
  ] }),
  'm-temp': () => { const u = U('temp'), a = isUS() ? 12 : 2, f = isUS() ? 18 : 5, e = a - f; return { title: 'Temperature', frames: [
    F(`${p(`We measure temperature in ${u}. Below zero the numbers are <b>negative</b>: −1, −2, −3…`)}${p('Colder means lower; warmer means higher.')}`),
    F(`${p(`At 6 am it is ${a}${u}. It falls by ${f}${u}.`)}${nline(e - 2, a + 2, isUS() ? 4 : 1, [[a, e, `−${f}`]])}${big(`${a} − ${f} = ${alt(String(e).replace('-', '−'))}${u}`)}${p('Count down past zero into the negatives.')}`),
    T(`${p(`Your turn. It is 3${u} and falls by 7${u}. What is the new temperature?`)}`, ['4', '−4', '−10', '10'], 1, `Yes! 3 down to 0 is 3, then 4 more: −4${u}.`, 'Not quite. Count down 3 to reach 0, then keep going.')
  ] }; },
  'm-tally': () => ({ title: 'Tally charts', frames: [
    F(`${p('Tally marks count in groups of 5: four lines, then one line across.')}${tally(12)}${p(`Count the fives, then the ones: 5 + 5 + 2 = ${alt(12)}.`)}`),
    F(`${table([['Pet', 'Tally', 'Total'], ['Cats', tally(7), 7], ['Dogs', tally(11), 11]])}${p(`"Altogether" means add every row: 7 + 11 = ${mk(18)}.`)}`),
    T(`${p('Your turn. How many?')}${tally(17)}`, [17, 15, 5, 32], 0, 'Yes! 5 + 5 + 5 + 2 = 17.', 'Not quite. Count each crossed group as 5, then add the single lines.')
  ] }),

  // ---------------- Grade 4 ----------------
  'ex-frac': () => ({ title: 'Compare fractions', frames: [
    F(`${p('<b>Same bottom</b>: the bigger top is bigger.')}${barRow(5, 2, '#ffa94d')}${barRow(5, 4, '#4dabf7')}${p(`${fr(4, 5)} > ${fr(2, 5)}`)}`, 'Same bottom: four fifths is bigger than two fifths.'),
    F(`${p('<b>Same top</b>: the smaller bottom is bigger, because its pieces are bigger.')}${barRow(4, 3, '#ffa94d')}${barRow(8, 3, '#4dabf7')}${p(`${fr(3, 4)} > ${fr(3, 8)}`)}`, 'Same top: three quarters is bigger than three eighths, because quarters are bigger pieces.'),
    F(`${p('Different tops and bottoms? Make the bottoms the same.')}${big(`${fr(2, 3)} vs ${fr(3, 4)}`)}${p(`${fr(2, 3)} = ${fr(8, 12)}, ${fr(3, 4)} = ${fr(9, 12)}. So ${fr(3, 4)} is bigger.`)}`, 'Two thirds or three quarters? Two thirds is eight twelfths, three quarters is nine twelfths, so three quarters is bigger.'),
    T(`${p('Your turn. Which is bigger?')}`, [fr(3, 4), fr(3, 8)], 0, 'Yes! Quarters are bigger pieces than eighths.', 'Not quite. Same top: the smaller bottom means bigger pieces.', 'Your turn. Which is bigger, three quarters or three eighths?')
  ] }),
  'm-bar2': () => ({ title: 'Bar models: comparing', frames: [
    F(`${p('Ira has 16 marbles. Meera has 19 <b>more</b>.')}${bm([{ name: 'Ira', parts: [[16, '16', '#ffa8a8']] }, { name: 'Meera', parts: [[16, '16', '#ffa8a8'], [19, '19 more', '#a5d8ff']] }])}${big(`16 + 19 = ${alt(35)}`)}`),
    F(`${p('<b>More</b> → the bar is longer, so add. <b>Fewer</b> → the bar is shorter, so subtract.')}${p('The extra piece is the <b>difference</b>.')}`),
    T(p('Your turn. Vihaan has 24 cards. Ira has 9 fewer. How many does Ira have?') + bm([{ name: 'Vihaan', parts: [[24, '24', '#a5d8ff']] }, { name: 'Ira', parts: [[15, '?', '#ffa8a8']] }]), [15, 33, 9, 16], 0, 'Yes! Fewer means take away: 24 − 9 = 15.', 'Not quite. Fewer means Ira\'s bar is shorter: subtract.')
  ] }),
  'm-series': () => ({ title: 'Number series puzzles', frames: [
    F(`${p('Find the <b>rule</b>: what happens from one number to the next?')}${big('13, 22, 31, 40, ?')}${p(`Each time + 9 → ${alt(49)}`)}`),
    F(`${p('Some rules take turns:')}${big('6, 8, 7, 9, 8, ?')}${p(`+2, −1, +2, −1, +2 → ${alt(10)}`)}${p('Write the jumps under the numbers to see the pattern.')}`),
    T(`${p('Your turn. What comes next?')}${big('5, 10, 8, 13, 11, ?')}`, [14, 16, 9, 15], 1, 'Yes! +5, −2, +5, −2, +5: 11 + 5 = 16.', 'Not quite. Write the jumps: +5, −2, … what comes next?')
  ] }),
  'lc-robot3': () => ({ title: 'Robot: loops (repeat)', frames: [
    F(`${p('Programmers do not like writing the same thing again and again.')}${cmp(box('Forward<br>Forward<br>Forward'), box('<b>Forward × 3</b>'))}${p('A <b>loop</b> repeats a block. Tap × on a block to repeat it.')}`),
    F(`${p('Look for runs of the same block:')}${box('Forward, Forward, Turn right, Forward, Forward, Forward')}${p(`becomes ${mk('Forward × 2, Turn right, Forward × 3')}: 3 blocks instead of 6.`)}`),
    T(p('Your turn. Which is the shortest program for: Forward, Forward, Forward, Forward, Turn left, Forward, Forward?'), ['Forward × 4, Turn left, Forward × 2', 'Forward × 2, Turn left, Forward × 4', 'Forward × 6, Turn left', 'Forward × 4, Turn right, Forward × 2'], 0, 'Yes! 4 forwards, a left turn, then 2 forwards.', 'Not quite. Count each run of Forward and keep the turn in the same place.')
  ] }),
  'lc-vennread': () => ({ title: 'Venn diagrams: AND, OR, NOT', frames: [
    F(`${venn('A', 'B', ['3', '5', '9'], ['6', '12'], ['4', '8', '10', '2'], ['7'])}${box('<b>A AND B</b>: the middle only<br><b>A OR B</b>: anything in either circle<br><b>NOT A</b>: everything outside circle A')}`),
    F(`${p('Count with the picture:')}${box('A AND B = 2 (6, 12)<br>A OR B = 3 + 2 + 4 = 9<br>NOT A = 4 + 1 = 5')}${p('OR includes the middle too, but count it only once!')}`),
    T(`${p('Your turn. 3 numbers are in A only, 2 in the middle, 4 in B only, 1 outside. How many are in A OR B?')}`, [9, 2, 5, 10], 0, 'Yes! 3 + 2 + 4 = 9.', 'Not quite. OR means in A, in B, or in both. Do not count the outside.')
  ] }),
  'e-indian': () => ({ title: 'Lakhs and crores', frames: [
    F(`${table([['Place', 'Number'], ['Thousand', '1,000'], ['Ten thousand', '10,000'], ['Lakh', '1,00,000'], ['Ten lakh', '10,00,000'], ['Crore', '1,00,00,000']])}${p('1 crore = 100 lakh. 1 lakh = 100 thousand.')}`),
    F(`${p('Indian commas: the first after 3 digits from the right, then after every <b>2</b>.')}${big('4,98,29,890')}${p('= 4 crore 98 lakh 29 thousand 890')}`),
    T(`${p('Your turn. 3 crore 25 lakh is how many lakhs?')}`, [325, 3025, 32.5, 3250], 0, 'Yes! 3 crore = 300 lakh, plus 25 = 325 lakh.', 'Not quite. 1 crore = 100 lakh, so 3 crore = 300 lakh.')
  ] }),
  'e-millions': () => ({ title: 'Thousands and millions', frames: [
    F(`${table([['Name', 'Number'], ['One thousand', '1,000'], ['Ten thousand', '10,000'], ['One hundred thousand', '100,000'], ['One million', '1,000,000']])}${p('1 million = 1,000 thousands.')}`),
    F(`${p('Commas split numbers into groups of 3 from the right:')}${big('3,492,000')}${p(`= 3 million, 492 thousand = ${mk('3,492 thousands')}`)}`),
    T(`${p('Your turn. How many thousands are in 2,705,000?')}`, ['2,705', '270', '27,050', '2.705'], 0, 'Yes! 2 million (2,000 thousands) + 705 thousands = 2,705.', 'Not quite. Drop the last three zeros: that counts the thousands.')
  ] }),
  'e-roman': () => ({ title: 'Roman numerals', frames: [
    F(`${table([['I', 'V', 'X', 'L', 'C'], [1, 5, 10, 50, 100]])}${p('Big to small: <b>add</b>. VIII = 5 + 3 = 8.')}${p('Small before big: <b>subtract</b>. IV = 4, IX = 9, XL = 40, XC = 90.')}`),
    F(`${big('28 = XX + VIII = XXVIII')}${big('XCIII = 90 + 3 = 93')}${p('Split the number into tens and ones first.')}`),
    T(`${p('Your turn. What number is')}${big('XLVI')}`, [46, 64, 56, 44], 0, 'Yes! XL = 40, VI = 6: 46.', 'Not quite. X before L means 50 − 10 = 40. Then VI.')
  ] }),
  'e-divrem': () => ({ title: 'Division with remainders', frames: [
    F(`${p('Share 41 into groups of 3. Some may be left over: the <b>remainder</b>.')}${big('41 ÷ 3')}${p(`3 × 13 = 39. 41 − 39 = ${mk(2)} left.`)}${big(`41 ÷ 3 = ${alt('13 r 2')}`)}`),
    F(`${box('The remainder is always <b>smaller</b> than the number you divide by.')}${p('Check: 13 × 3 + 2 = 41 ✓')}`),
    T(`${p('Your turn.')}${big('29 ÷ 4 = ?')}`, ['7 r 1', '6 r 5', '7 r 2', '8 r 1'], 0, 'Yes! 4 × 7 = 28, and 1 is left.', 'Not quite. What times 4 gets closest to 29 without going over?')
  ] }),
  'e-fadd': () => ({ title: 'Adding fractions (same bottom)', frames: [
    F(`${p('When the bottoms are the same, the pieces are the same size. Just add the tops.')}${barRow(12, 5, '#ffa94d')}${barRow(12, 6, '#4dabf7')}${big(`${fr(5, 12)} + ${fr(6, 12)} = ${fr(alt(11), 12)}`)}`, 'Five twelfths plus six twelfths is eleven twelfths. Add the tops, keep the bottom.'),
    F(cmp(no('Add the bottoms too', `${fr(11, 24)}`), yes('Keep the bottom', `${fr(11, 12)}`)) + p('The bottom tells the size of each piece. It does not change.'), 'Do not add the bottoms. Eleven twenty-fourths is wrong. Keep the bottom: eleven twelfths.'),
    T(`${p('Your turn.')}${big(`${fr(2, 7)} + ${fr(3, 7)} = ?`)}`, [fr(5, 7), fr(5, 14), fr(6, 7), fr(1, 7)], 0, 'Yes! 2 + 3 = 5, keep 7: five sevenths.', 'Not quite. Add only the tops.', 'Your turn. Two sevenths plus three sevenths?')
  ] }),
  'e-angtype': () => ({ title: 'Types of angles', frames: [
    F(`<div class="lgrid">${[['Acute', 40, 'less than 90°'], ['Right', 90, 'exactly 90°'], ['Obtuse', 130, 'between 90° and 180°'], ['Straight', 180, 'exactly 180°']].map(([n, d, w]) => `<div class="lbox">${sm(angle(d), 100)}<br><b>${n}</b><br><small>${w}</small></div>`).join('')}</div>`),
    F(`${p('A right angle is a square corner, like the corner of a book.')}${p('Smaller than a corner → <b>acute</b>. Wider than a corner → <b>obtuse</b>. More than a straight line → <b>reflex</b>.')}`),
    T(`${p('Your turn. What type of angle is 120°?')}${sm(angle(120), 150)}`, ['acute', 'right', 'obtuse', 'straight'], 2, 'Yes! 120° is between 90° and 180°.', 'Not quite. Is it more or less than a square corner (90°)?')
  ] }),
  'e-units': () => isUS() ? ({ title: 'Converting units', frames: [
    F(table([['Big unit', 'Small units'], ['1 ft', '12 in'], ['1 yd', '3 ft'], ['1 lb', '16 oz'], ['1 gal', '4 qt'], ['1 qt', '2 pt'], ['1 pt', '2 cups']])),
    F(`${box('Big → small: <b>multiply</b><br>Small → big: <b>divide</b>')}${p(`39 ft to yd: 39 ÷ 3 = ${alt('13 yd')}`)}${p(`2 gal to qt: 2 × 4 = ${alt('8 qt')}`)}`),
    T(`${p('Your turn. Convert 5 ft to inches.')}`, [60, 17, 15, 50], 0, 'Yes! 5 × 12 = 60 inches.', 'Not quite. Feet are bigger, so multiply by 12.')
  ] }) : ({ title: 'Converting units', frames: [
    F(table([['Big unit', 'Small units'], ['1 km', '1000 m'], ['1 m', '100 cm'], ['1 cm', '10 mm'], ['1 kg', '1000 g'], ['1 l', '1000 ml']])),
    F(`${box('Big → small: <b>multiply</b><br>Small → big: <b>divide</b>')}${p(`2000 ml to l: 2000 ÷ 1000 = ${alt('2 l')}`)}${p(`3 m to cm: 3 × 100 = ${alt('300 cm')}`)}`),
    T(`${p('Your turn. Convert 3 kg to grams.')}`, [3000, 300, 30, 1003], 0, 'Yes! 3 × 1000 = 3000 g.', 'Not quite. Kilograms are bigger, so multiply by 1000.')
  ] }),
  'e-perim': () => { const u = U('len'); return { title: 'Perimeter', frames: [
    F(`${p('<b>Perimeter</b> is the distance all the way around a shape.')}${rect(6, 3, u, false)}${p(`6 + 3 + 6 + 3 = ${alt(18)} ${u}`)}`),
    F(`${p('For a rectangle there is a shortcut:')}${big('2 × (length + width)')}${p(`2 × (12 + 15) = 2 × 27 = ${mk(54)}`)}`),
    F(cmp(no('6 × 3 = 18', 'that is the area'), yes('6 + 3 + 6 + 3', 'add every side')) + p('Perimeter: <b>add</b> the sides. Area: <b>multiply</b>.')),
    T(`${p(`Your turn. A rectangle is 8 ${u} long and 5 ${u} wide. What is its perimeter?`)}`, [26, 40, 13, 21], 0, 'Yes! 8 + 5 + 8 + 5 = 26.', 'Not quite. Add all four sides.')
  ] }; },
  'e-area': () => { const u = U('len'), a = U('area'); return { title: 'Area of rectangles', frames: [
    F(`${p('<b>Area</b> is the space inside a shape: how many squares cover it.')}${rect(5, 3, u)}${p(`3 rows of 5 squares = ${alt(15)} ${a}`)}`),
    F(`${big('Area = length × width')}${p(`A rectangle 12 by 10: 12 × 10 = ${mk(120)} ${a}`)}${p(`Area is measured in <b>square</b> units (${a}).`)}`),
    T(`${p(`Your turn. A rectangle is 7 ${u} by 4 ${u}. What is its area?`)}`, [28, 22, 11, 24], 0, 'Yes! 7 × 4 = 28.', 'Not quite. Area means multiply length × width.')
  ] }; },
  'e-time': () => ({ title: '24-hour time and durations', frames: [
    F(`${p('24-hour time counts on after 12:00 instead of starting again.')}${table([['24-hour', '12-hour'], ['09:30', '9:30 am'], ['12:00', '12 noon'], ['15:20', '3:20 pm'], ['22:05', '10:05 pm'], ['00:30', '12:30 am']])}`),
    F(`${p(`After 12:00, <b>subtract 12</b> and write pm: 22 − 12 = ${mk(10)} → 10:05 pm.`)}${p('For a duration, count on in steps:')}${p('13:40 → 14:00 (20 min) → 15:00 (1 h) → 15:15 (15 min) = <b>1 h 35 min</b>')}`),
    T(`${p('Your turn. What is 17:45 in 12-hour time?')}`, ['5:45 pm', '7:45 pm', '5:45 am', '17:45 pm'], 0, 'Yes! 17 − 12 = 5: 5:45 pm.', 'Not quite. Subtract 12 from the hours, and it is afternoon.')
  ] }),
  'e-bar': () => ({ title: 'Reading bar graphs', frames: [
    F(`${p('Books borrowed this week:')}${chart([['Mon', 20], ['Tue', 35], ['Wed', 15], ['Thu', 30]], 5, 40)}${p('Read across from the top of each bar to the scale.')}`),
    F(`${p('Check the scale: here each line is 5, not 1.')}${p(`How many more on Tue than Wed? 35 − 15 = ${alt(20)}`)}`),
    T(`${p('Your turn. How many more on Thu than on Mon?')}${chart([['Mon', 20], ['Tue', 35], ['Wed', 15], ['Thu', 30]], 5, 40)}`, [10, 50, 5, 30], 0, 'Yes! 30 − 20 = 10.', 'Not quite. Read both bars, then subtract.')
  ] }),
  'm-abacus5': () => ({ title: 'Abacus: 3-digit numbers', frames: [
    F(`${p('Three rods: <b>hundreds, tens, ones</b>.')}${ab(326)}${p('326 = 3 hundreds, 2 tens, 6 ones.')}`),
    F(`${p('326 + 24: add the tens first, then the ones.')}${steps(['Tens: + 2 → 346', 'Ones: 6 + 4 needs a big friend: + 4 = + 10 − 6', 'Tens + 1, ones − 6 → 350'])}${ab(350)}`),
    T(`${p('Your turn.')}${big('145 + 30 = ?')}`, [175, 148, 445, 165], 0, 'Yes! Add 3 beads on the tens rod: 175.', 'Not quite. 30 is 3 tens: only the tens rod changes.')
  ] }),
  'm-flash1': () => ({ title: 'Flash maths: 1-digit', frames: [
    F(`${p('Numbers flash one at a time. Keep a <b>running total</b> in your head.')}${big('7 → 3 → 8 → 4')}${steps(['7', '7 + 3 = 10', '10 + 8 = 18', '18 + 4 = 22'])}`),
    F(`${p('Tips:')}${box('Look for pairs that make 10 (7 + 3).<br>Say the total quietly after each number.<br>Picture the abacus beads moving.')}`),
    T(`${p('Your turn. Add them up:')}${big('6, 4, 5, 2')}`, [17, 15, 16, 18], 0, 'Yes! 6 + 4 = 10, + 5 = 15, + 2 = 17.', 'Not quite. Keep a running total: 6, 10, 15…')
  ] }),
  'm-tritype': () => ({ title: 'Types of triangles', frames: [
    F(`<div class="lgrid">${[['Equilateral', [[50, 5], [95, 85], [5, 85]], '3 equal sides'], ['Isosceles', [[50, 5], [80, 90], [20, 90]], '2 equal sides'], ['Scalene', [[10, 80], [90, 90], [35, 15]], 'no equal sides']].map(([n, pts, w]) => `<div class="lbox">${shape(pts, { w: 100 })}<br><b>${n}</b><br><small>${w}</small></div>`).join('')}</div>`),
    F(`${p('By angles:')}${box('<b>Right-angled</b>: one angle is 90°<br><b>Obtuse</b>: one angle is more than 90°<br><b>Acute</b>: all angles less than 90°')}${shape([[10, 90], [10, 20], [90, 90]], { w: 110 })}`),
    T(`${p('Your turn. A triangle has sides 5 cm, 5 cm and 8 cm. What type is it?')}`, ['equilateral', 'isosceles', 'scalene', 'right-angled'], 1, 'Yes! Two sides are equal.', 'Not quite. How many sides are the same length?')
  ] }),
  'm-quad': () => ({ title: 'Quadrilaterals', frames: [
    F(`<div class="lgrid">${[['Square', [[10, 10], [90, 10], [90, 90], [10, 90]], '4 equal sides, 4 right angles'], ['Rectangle', [[5, 25], [95, 25], [95, 75], [5, 75]], '4 right angles'], ['Rhombus', [[50, 5], [92, 50], [50, 95], [8, 50]], '4 equal sides, slanted'], ['Parallelogram', [[25, 25], [98, 25], [75, 80], [2, 80]], 'opposite sides parallel'], [U('trap')[0].toUpperCase() + U('trap').slice(1), [[30, 25], [70, 25], [95, 80], [5, 80]], 'one pair of parallel sides']].map(([n, pts, w]) => `<div class="lbox">${shape(pts, { w: 84 })}<br><b>${n}</b><br><small>${w}</small></div>`).join('')}</div>`),
    F(`${p('Use the <b>most exact</b> name. A square is also a rectangle and a rhombus, but "square" says the most.')}${p('Check: equal sides? right angles? parallel sides?')}`),
    T(`${p('Your turn. A shape has 4 equal sides but no right angles. What is the best name?')}`, ['square', 'rectangle', 'rhombus', U('trap')], 2, 'Yes! Equal sides without right angles: rhombus.', 'Not quite. Equal sides, but slanted corners.')
  ] }),
  'm-parperp': () => ({ title: 'Parallel and perpendicular lines', frames: [
    F(`${cmp(`<div class="lbox"><svg class="lpic" viewBox="0 0 120 90" width="120"><line x1="10" y1="25" x2="110" y2="25" stroke="${INK}" stroke-width="4"/><line x1="10" y1="65" x2="110" y2="65" stroke="${INK}" stroke-width="4"/></svg><br><b>Parallel</b><br><small>never meet, like rail tracks</small></div>`,
      `<div class="lbox"><svg class="lpic" viewBox="0 0 120 90" width="120"><line x1="10" y1="70" x2="110" y2="70" stroke="${INK}" stroke-width="4"/><line x1="60" y1="10" x2="60" y2="70" stroke="${INK}" stroke-width="4"/><path d="M60 58 H72 V70" fill="none" stroke="#ff6b4a" stroke-width="2.5"/></svg><br><b>Perpendicular</b><br><small>meet at a right angle</small></div>`)}`),
    F(`${p('Lines that cross at any other angle are <b>neither</b>.')}${p('Look for the little square corner: that means 90°, so perpendicular.')}`),
    T(`${p('Your turn. The two lines in the letter <b>T</b> are…')}`, ['parallel', 'perpendicular', 'neither'], 1, 'Yes! They meet at a right angle.', 'Not quite. Do they meet? At what angle?')
  ] }),
  'm-ttable': () => ({ title: 'Timetables', frames: [
    F(`${table([['Stop', 'Bus 1', 'Bus 2', 'Bus 3'], ['Station', '8:00', '8:30', '9:20'], ['Market', '8:10', '8:40', '9:30'], ['School', '8:34', '9:04', '9:54']])}${p('Read <b>across</b> for a stop and <b>down</b> for one bus.')}`),
    F(`${p('You must be at School by 9:07. Which bus?')}${p(`Bus 2 gets to School at 9:04 ✓. Bus 3 at 9:54 is too late. ${mk('Take Bus 2')}.`)}${p('You get to the Station at 7:55: the next bus is 8:00, a 5-minute wait.')}`),
    T(`${p('Your turn. You reach the Station at 8:10. How many minutes until the next bus?')}${table([['Stop', 'Bus 1', 'Bus 2', 'Bus 3'], ['Station', '8:00', '8:30', '9:20']])}`, [20, 10, 30, 70], 0, 'Yes! Bus 1 has gone; Bus 2 leaves at 8:30, 20 minutes later.', 'Not quite. Which bus is still to come after 8:10?')
  ] }),
  'm-line': () => ({ title: 'Line graphs', frames: [
    F(`${p('A line graph shows how something changes, like temperature over a week.')}${p('Line going <b>up</b> = increase. Line going <b>down</b> = decrease. The highest point is the most.')}`),
    F(`${p('Change = later value − earlier value.')}${p(`Wed 18${U('temp')}, Thu 12${U('temp')}: 12 − 18 = ${mk('−6')}. It fell by 6.`)}`),
    T(`${p(`Your turn. Mon was 20${U('temp')}, Tue was 25${U('temp')}. What was the change?`)}`, ['+5', '−5', '45', '5 down'], 0, 'Yes! 25 − 20 = +5: it rose by 5.', 'Not quite. Later minus earlier: 25 − 20.')
  ] }),
  'm-carroll': () => ({ title: 'Carroll diagrams', frames: [
    F(`${table([['', 'More than 30', 'Not more than 30'], ['<b>Even</b>', 'A', 'B'], ['<b>Not even</b>', 'C', 'D']])}${p('Each number goes in the box where its <b>row</b> and <b>column</b> are both true.')}`),
    F(`${p('91: Not even (row 2), more than 30 (column 1) → box ' + mk('C') + '.')}${p('29: Not even, not more than 30 → box ' + mk('D') + '.')}`),
    T(`${p('Your turn. Where does <b>44</b> go?')}${table([['', 'More than 30', 'Not more than 30'], ['<b>Even</b>', 'A', 'B'], ['<b>Not even</b>', 'C', 'D']])}`, ['A', 'B', 'C', 'D'], 0, 'Yes! 44 is even and more than 30.', 'Not quite. Is 44 even? Is it more than 30?')
  ] }),

  // ---------------- Grade 5 ----------------
  'lc-gates': () => ({ title: 'Logic gates: AND, OR, NOT', frames: [
    F(`${p('Inside computers, tiny <b>gates</b> decide ON (1) or OFF (0).')}${box('<b>AND</b>: lamp ON only if <b>both</b> switches are ON.<br><b>OR</b>: lamp ON if <b>at least one</b> switch is ON.<br><b>NOT</b>: flips it: ON becomes OFF.')}`),
    F(table([['A', 'B', 'A AND B', 'A OR B'], ['OFF', 'OFF', 'OFF', 'OFF'], ['ON', 'OFF', 'OFF', 'ON'], ['OFF', 'ON', 'OFF', 'ON'], ['ON', 'ON', 'ON', 'ON']])),
    T(p('Your turn. OR gate: switch A is ON, switch B is OFF. Is the lamp ON or OFF?'), ['ON', 'OFF'], 0, 'Yes! OR needs at least one switch ON.', 'Not quite. OR only needs one switch ON.')
  ] }),
  'lc-if': () => ({ title: 'Code: if and else', frames: [
    F(`${p('A program can make choices.')}${codeBlock('x = 16\nif x > 10:\n    print("big")\nelse:\n    print("small")')}${p(`Is 16 > 10? Yes → it prints ${mk('big')}.`)}`),
    F(`${box('<b>and</b>: both must be true<br><b>or</b>: at least one is true<br><b>x % 2 == 0</b>: x is even (no remainder when ÷ 2)')}${codeBlock('x = 11\nif x > 11 and x % 2 == 0:')}${p('11 > 11 is false, so the whole <b>and</b> is false → the else part runs.')}`),
    T(`${p('Your turn. What does this print?')}${codeBlock('x = 7\nif x > 5 and x % 2 == 0:\n    print("yes")\nelse:\n    print("no")')}`, ['yes', 'no'], 1, 'Yes! 7 > 5 is true, but 7 is odd, so "and" is false: no.', 'Not quite. "and" needs both parts true. Is 7 even?')
  ] }),
  'lc-bin4': () => ({ title: 'Binary: 4 bulbs', frames: [
    F(`${p('Computers count with bulbs ON (1) or OFF (0). Each bulb has a value:')}${table([['8', '4', '2', '1'], ['💡', '⚫', '⚫', '💡']])}${p(`ON bulbs: 8 + 1 = ${alt(9)}. In binary: 1001`)}`),
    F(`${p('To make a number, start with the biggest bulb that fits:')}${p('Make 13: 8 ✓ (5 left), 4 ✓ (1 left), 2 ✗, 1 ✓ → 8 + 4 + 1 = 13 → <b>1101</b>')}`),
    T(`${p('Your turn. Which number is')}${big('1010')}`, [10, 1010, 5, 12], 0, 'Yes! 8 + 2 = 10.', 'Not quite. Bulb values are 8, 4, 2, 1. Add the ones that are 1.')
  ] }),
  'e-factors': () => ({ title: 'Factors', frames: [
    F(`${p('<b>Factors</b> of a number divide it exactly, with no remainder.')}${p('Find them in <b>pairs</b> that multiply to the number:')}${big('12 = 1 × 12 = 2 × 6 = 3 × 4')}${p(`Factors of 12: 1, 2, 3, 4, 6, 12 → ${mk('6 factors')}`)}`),
    F(`${p('Start at 1 and work up. Stop when the pairs start repeating.')}${p('Every number has 1 and itself as factors.')}`),
    T(p('Your turn. How many factors does 18 have?'), [4, 5, 6, 8], 2, 'Yes! 1, 2, 3, 6, 9, 18.', 'Not quite. Find the pairs: 1 × 18, 2 × 9, 3 × 6.')
  ] }),
  'e-primes': () => ({ title: 'Prime numbers', frames: [
    F(`${p('A <b>prime</b> number has exactly two factors: 1 and itself.')}${big('2, 3, 5, 7, 11, 13, 17, 19, 23, 29…')}${p('1 is <b>not</b> prime (only one factor). 2 is the only even prime.')}`),
    F(`${p('To test a number under 100, try dividing by 2, 3, 5 and 7.')}${box('51: 5 + 1 = 6, divisible by 3 → not prime (3 × 17)<br>53: not ÷ 2, 3, 5 or 7 → <b>prime</b>')}`),
    T(p('Your turn. Which of these is prime?'), [51, 57, 59, 49], 2, 'Yes! 59 cannot be divided by 2, 3, 5 or 7.', 'Not quite. 51 = 3 × 17, 57 = 3 × 19, 49 = 7 × 7.')
  ] }),
  'e-divis': () => ({ title: 'Divisibility rules', frames: [
    F(table([['÷', 'Rule'], ['2', 'last digit even'], ['3', 'digit sum divisible by 3'], ['4', 'last two digits divisible by 4'], ['5', 'ends in 0 or 5'], ['6', 'divisible by 2 and 3'], ['9', 'digit sum divisible by 9'], ['10', 'ends in 0']])),
    F(`${p('1708 ÷ 4? Last two digits 08 → 8 ÷ 4 ✓.')}${p('For 11: alternate − and +. 8646: 8 − 6 + 4 − 6 = 0 → divisible by 11 ✓.')}`),
    T(p('Your turn. Which number is divisible by 3?'), [1245, 1243, 2240, 4441], 0, 'Yes! 1 + 2 + 4 + 5 = 12, and 12 ÷ 3 = 4.', 'Not quite. Add the digits; the sum must be divisible by 3.')
  ] }),
  'e-mul2x2': () => ({ title: 'Long multiplication', frames: [
    F(`${p('Multiply by the ones, then by the tens, then add.')}${cols(['91', '×28', '728', '+1820'], '2548', null, [1, 3])}`),
    F(steps([`91 × 8 = ${mk(728)}`, `91 × 20 = ${mk(1820)} (a 0 goes in the ones place)`, `728 + 1820 = ${alt(2548)}`])),
    F(cmp(no('91 × 2 = 182', 'forgot it is 20'), yes('91 × 20 = 1820', 'the 2 means 2 tens')) + p('The second row is always multiplied by <b>tens</b>.')),
    T(`${p('Your turn.')}${big('23 × 14 = ?')}`, [322, 312, 230, 332], 0, 'Yes! 23 × 4 = 92, 23 × 10 = 230, 92 + 230 = 322.', 'Not quite. 23 × 4, then 23 × 10, then add.')
  ] }),
  'e-longdiv': () => ({ title: 'Long division', frames: [
    F(`${p('Divide one digit at a time, from the left.')}${big('260 ÷ 4')}${steps(['4 into 2? No. 4 into 26 = 6 (24), remainder 2.', 'Bring down the 0: 20.', '4 into 20 = 5.'])}${big(`260 ÷ 4 = ${alt(65)}`)}`),
    F(`${box('Divide → Multiply → Subtract → Bring down. Repeat.')}${p('Check: 65 × 4 = 260 ✓')}`),
    T(`${p('Your turn.')}${big('156 ÷ 4 = ?')}`, [39, 38, 49, 29], 0, 'Yes! 15 ÷ 4 = 3 r 3, bring down 6: 36 ÷ 4 = 9.', 'Not quite. Start with 15 ÷ 4, then bring down the 6.')
  ] }),
  'e-fsimp': () => ({ title: 'Simplifying fractions', frames: [
    F(`${p('Divide the top and the bottom by the <b>same</b> number.')}${big(`${fr(15, 35)} = ${fr('15 ÷ 5', '35 ÷ 5')} = ${fr(alt(3), alt(7))}`)}${barRow(35, 15, '#ffa94d')}${barRow(7, 3, '#4dabf7')}`, 'Fifteen thirty-fifths: divide top and bottom by five. Three sevenths. Same amount.'),
    F(`${p('Keep going until nothing (except 1) divides both. Use the biggest number that divides both to finish in one step.')}${big(`${fr(2, 8)} = ${fr(1, 4)}`)}`, 'Keep dividing until only one divides both. Two eighths is one quarter.'),
    T(`${p('Your turn. Simplify')}${big(fr(6, 9))}`, [fr(2, 3), fr(3, 6), fr(1, 3), fr(6, 3)], 0, 'Yes! Divide both by 3: two thirds.', 'Not quite. What divides both 6 and 9?', 'Your turn. Simplify six ninths.')
  ] }),
  'e-fof': () => ({ title: 'Fraction of an amount', frames: [
    F(`${p('To find a fraction of an amount: <b>divide by the bottom</b>, <b>multiply by the top</b>.')}${big(`${fr(3, 4)} of 20`)}${steps(['20 ÷ 4 = 5 (one quarter)', `5 × 3 = ${alt(15)} (three quarters)`])}`, 'Three quarters of twenty. Twenty divided by four is five. Five times three is fifteen.'),
    F(`${bar(4, 3, '#4dabf7')}${p(`${fr(1, 2)} of 22 = 22 ÷ 2 = ${mk(11)}`)}`, 'One half of twenty two is eleven.'),
    T(`${p('Your turn.')}${big(`${fr(2, 3)} of 12 = ?`)}`, [8, 4, 6, 18], 0, 'Yes! 12 ÷ 3 = 4, 4 × 2 = 8.', 'Not quite. Divide by 3 first, then multiply by 2.', 'Your turn. Two thirds of twelve?')
  ] }),
  'e-mixed': () => ({ title: 'Mixed numbers', frames: [
    F(`${p('A fraction with a bigger top is more than 1 whole.')}${barRow(7, 7, '#4dabf7')}${barRow(7, 2, '#ffa94d')}${big(`${fr(9, 7)} = 1 ${fr(2, 7)}`)}`, 'Nine sevenths is one whole and two sevenths.'),
    F(`${p('Divide the top by the bottom: the answer is the wholes, the remainder stays on top.')}${p(`9 ÷ 7 = 1 r 2 → ${mk(`1 ${fr(2, 7)}`)}`)}`, 'Nine divided by seven is one, remainder two. So one and two sevenths.'),
    T(`${p('Your turn. Write as a mixed number:')}${big(fr(11, 4))}`, [`2 ${fr(3, 4)}`, `3 ${fr(1, 4)}`, `2 ${fr(1, 4)}`, `1 ${fr(3, 4)}`], 0, 'Yes! 11 ÷ 4 = 2 r 3.', 'Not quite. 11 ÷ 4 = ? remainder ?', 'Your turn. Write eleven quarters as a mixed number.')
  ] }),
  'e-decpv': () => ({ title: 'Decimal place value', frames: [
    F(`${pv(['Ones', '.', 'Tenths', 'Hundredths'], '1.44', 2)}${p(`The first 4 after the point is 4 tenths = ${mk('0.4')}. The second is 4 hundredths = ${mk('0.04')}.`)}`),
    F(`${p('Each place is 10 times smaller as you move right.')}${big(`1.44 = 1 + 0.4 + 0.04`)}`),
    T(`${p('Your turn. What is the value of the 7 in')}${big('3.07')}`, ['7', '0.7', '0.07', '70'], 2, 'Yes! It is in the hundredths place.', 'Not quite. The first place after the point is tenths, the second is hundredths.')
  ] }),
  'e-decadd': () => ({ title: 'Adding and subtracting decimals', frames: [
    F(`${p('Line up the <b>decimal points</b>, then add like whole numbers.')}${cols(['17.7', '+22.9'], '40.6', '11  ')}`),
    F(`${p('24.7 + 26.3 = 51.0, which is the same as 51.')}${p('For subtracting, line up the points too. Fill gaps with 0: 5 − 1.2 → 5.0 − 1.2 = 3.8.')}`),
    T(`${p('Your turn.')}${big('12.5 + 3.8 = ?')}`, [16.3, 15.3, 16.13, 15.13], 0, 'Yes! 5 + 8 = 13 tenths: write 3, carry 1.', 'Not quite. Line up the points. 0.5 + 0.8 = 1.3.')
  ] }),
  'e-angest': () => ({ title: 'Estimating angles', frames: [
    F(`<div class="lgrid">${[[45, '45°: half a corner'], [90, '90°: a corner'], [180, '180°: straight']].map(([d, w]) => `<div class="lbox">${sm(angle(d), 100)}<br><small>${w}</small></div>`).join('')}</div>${p('Compare with these to estimate.')}`),
    F(`${p('A bit less than a corner → about 60° to 80°. A bit more → about 100° to 120°. Nearly straight → about 150° to 170°.')}`),
    T(`${p('Your turn. About how big is this angle?')}${sm(angle(120), 150)}`, ['30°', '60°', '120°', '170°'], 2, 'Yes! A bit more than a right angle.', 'Not quite. Is it bigger or smaller than a square corner?')
  ] }),
  'e-coord': () => ({ title: 'Coordinates', frames: [
    F(`${coordGrid([[5, 4, '(5, 4)']])}${p('Go <b>along</b> first (x), then <b>up</b> (y). "Along the corridor, up the stairs."')}`),
    F(`${p('(2, 0) is on the x-axis: along 2, up 0. (0, 3) is on the y-axis.')}${coordGrid([[2, 0, '(2, 0)'], [0, 3, '(0, 3)', '#4dabf7']])}`),
    T(`${p('Your turn. What are the coordinates of point A?')}${coordGrid([[3, 5, 'A']])}`, ['(3, 5)', '(5, 3)', '(3, 3)', '(5, 5)'], 0, 'Yes! Along 3, up 5.', 'Not quite. Along first (x), then up (y).')
  ] }),
  'e-solids': () => ({ title: 'Faces, edges, vertices', frames: [
    F(`${box('<b>Face</b>: a flat surface<br><b>Edge</b>: where two faces meet<br><b>Vertex</b>: a corner (plural: vertices)')}${table([['Solid', 'Faces', 'Edges', 'Vertices'], ['Cube', 6, 12, 8], [U('box')[0].toUpperCase() + U('box').slice(1), 6, 12, 8], ['Square pyramid', 5, 8, 5], ['Triangular prism', 5, 9, 6], ['Tetrahedron', 4, 6, 4]])}`),
    F(`${p('Check with Euler\'s rule: <b>faces + vertices − edges = 2</b>')}${p('Cube: 6 + 8 − 12 = 2 ✓')}`),
    T(p('Your turn. How many edges does a triangular prism have?'), [6, 9, 5, 12], 1, 'Yes! 3 on each triangle and 3 joining them: 9.', 'Not quite. Count the edges of both triangles, plus the ones joining them.')
  ] }),
  'e-symlines': () => ({ title: 'Lines of symmetry', frames: [
    F(`${p('A <b>line of symmetry</b> folds a shape into two matching halves.')}${table([['Shape', 'Lines'], ['Square', 4], ['Rectangle', 2], ['Equilateral triangle', 3], ['Regular pentagon', 5], ['Circle', 'endless']])}`),
    F(`${p('A <b>regular</b> shape (all sides and angles equal) has as many lines as it has sides.')}${p('Regular heptagon (7 sides) → 7 lines.')}`),
    T(p('Your turn. How many lines of symmetry does a regular hexagon have?'), [3, 6, 4, 12], 1, 'Yes! 6 sides, 6 lines.', 'Not quite. A regular shape has one line for each side.')
  ] }),
  'e-chance': () => ({ title: 'How likely?', frames: [
    F(`${nline(0, 1, .25, [], [[0, 'impossible'], [.25, 'unlikely'], [.5, 'even'], [.75, 'likely'], [1, 'certain']], 340)}${p('Every event fits somewhere on this line.')}`),
    F(`${box('Rolling a 7 on a normal dice: <b>impossible</b><br>Getting heads on a coin: <b>even chance</b><br>The sun rising tomorrow: <b>certain</b>')}`),
    T(p('Your turn. A drawer has 9 red socks and 1 blue sock. You pick one without looking. How likely is red?'), ['impossible', 'unlikely', 'even chance', 'likely', 'certain'], 3, 'Yes! Most socks are red, but not all.', 'Not quite. Most are red, but there is one blue.')
  ] }),
  'v-ekan': () => ({ title: 'Multiplying by 99', frames: [
    F(`${p('To multiply a 2-digit number by 99:')}${steps(['Left part: the number − 1', 'Right part: 100 − the number'])}${big(`73 × 99 → ${mk(72)} | ${mk(27)} = ${alt(7227)}`)}`),
    F(`${p('Why it works: 73 × 99 = 73 × 100 − 73 = 7300 − 73 = 7227.')}`),
    T(`${p('Your turn.')}${big('45 × 99 = ?')}`, [4455, 4545, 4555, 4405], 0, 'Yes! 45 − 1 = 44, 100 − 45 = 55: 4455.', 'Not quite. Left part 45 − 1, right part 100 − 45.')
  ] }),
  'v-beej': () => ({ title: 'Checking with digit sums', frames: [
    F(`${p('<b>Digit sum</b>: add the digits until one digit is left (9 counts as 0).')}${p('34 → 3 + 4 = 7. 46 → 4 + 6 = 10 → 1.')}`),
    F(`${p('Check 34 × 46 = 1564:')}${steps(['Digit sums: 7 × 1 = 7', 'Answer: 1 + 5 + 6 + 4 = 16 → 7', 'Same (7 = 7) → <b>probably right</b>'])}${p('If they differ, the answer is definitely <b>wrong</b>.')}`),
    T(`${p('Your turn. Is <span class="lwrong">12 × 13 = 166</span> right?')}`, ['Probably right', 'Wrong'], 1, 'Yes! 3 × 4 = 12 → 3, but 1 + 6 + 6 = 13 → 4. They differ, so it is wrong (it is 156).', 'Not quite. 12 → 3, 13 → 4, 3 × 4 = 12 → 3. What is the digit sum of 166?')
  ] }),
  'm-flash2': () => ({ title: 'Flash maths: 2-digit', frames: [
    F(`${p('Add 2-digit numbers in your head: <b>tens first, then ones</b>.')}${big('48 + 37')}${steps(['48 + 30 = 78', '78 + 7 = 85'])}`),
    F(`${p('Keep the running total and add each new number the same way.')}${big('25 → 34 → 16')}${p('25 + 34 = 59, 59 + 16 = 75')}`),
    T(`${p('Your turn. Add them up:')}${big('23, 41, 15')}`, [79, 69, 78, 89], 0, 'Yes! 23 + 41 = 64, + 15 = 79.', 'Not quite. Add tens then ones each time: 23 + 41 = 64 first.')
  ] }),
  'm-flash3': () => ({ title: 'Anzan: add and take away', frames: [
    F(`${p('Anzan means doing abacus maths in your head: picture the beads.')}${p('Some numbers now have a minus sign: take them away from the running total.')}`),
    F(`${big('45 + 32 − 18')}${steps(['45 + 32 = 77', '77 − 18 = 59 (77 − 20 + 2)'])}`),
    T(`${p('Your turn.')}${big('60 − 25 + 13')}`, [48, 22, 98, 38], 0, 'Yes! 60 − 25 = 35, + 13 = 48.', 'Not quite. Do it in order: 60 − 25 first.')
  ] }),
  'm-bar3': () => ({ title: 'Bar models: fractions, ratio, before and after', frames: [
    F(`${p('<b>Before and after</b>: Aarav and Ira had the same number. Aarav gave away 4 and now has 30.')}${bm([{ name: 'Aarav', parts: [[30, '30 now', '#a5d8ff'], [4, '4', '#ffa8a8']] }, { name: 'Ira', parts: [[34, '?', '#b2f2bb']] }])}${p(`Before: 30 + 4 = 34. Ira still has ${alt(34)}.`)}`),
    F(`${p('<b>Units</b>: if 3 equal units = 24, then 1 unit = 24 ÷ 3 = 8.')}${bm([{ parts: [[1, '8'], [1, '8'], [1, '8']] }], '24')}`),
    T(p('Your turn. Ira and Vihaan had the same number of cards. Vihaan gave away 7 and has 15 left. How many does Ira have?'), [22, 8, 15, 29], 0, 'Yes! Vihaan had 15 + 7 = 22, the same as Ira.', 'Not quite. Find how many Vihaan had before giving any away.')
  ] }),
  'm-magic': () => ({ title: 'Magic squares', frames: [
    F(`${table([['4', '9', '8'], ['11', '7', '3'], ['6', '5', '?']])}${p('Every row, column and diagonal adds to the <b>same</b> total.')}`),
    F(`${p('Find the total from a full line: 4 + 9 + 8 = 21.')}${p(`Missing = total − the others: 21 − 6 − 5 = ${alt(10)}.`)}${p('Check: 8 + 3 + 10 = 21 ✓')}`),
    T(`${p('Your turn. Every line adds to 15. What is missing?')}${table([['8', '1', '?'], ['3', '5', '7'], ['4', '9', '2']])}`, [6, 4, 7, 5], 0, 'Yes! 15 − 8 − 1 = 6.', 'Not quite. Total 15, take away 8 and 1.')
  ] }),
  'm-nets': () => ({ title: 'Nets of 3D shapes', frames: [
    F(`${p('A <b>net</b> is the flat shape that folds up into a solid.')}${table([['Solid', 'Its net has'], ['Cube', '6 squares'], ['Triangular prism', '2 triangles + 3 rectangles'], ['Square pyramid', '1 square + 4 triangles'], ['Cylinder', '2 circles + 1 rectangle']])}`),
    F(`${p('Count the faces in the net and match their shapes to the solid\'s faces.')}`),
    T(p('Your turn. A net has 1 square and 4 triangles. What does it fold into?'), ['cube', 'square pyramid', 'triangular prism', 'cylinder'], 1, 'Yes! A square base and 4 triangle sides.', 'Not quite. Which solid has a square base and pointed top?')
  ] }),
  'm-tess': () => ({ title: 'Tessellations', frames: [
    F(`${p('A shape <b>tessellates</b> if copies fit together with no gaps and no overlaps, like floor tiles.')}${p('The angles meeting at each point must add to <b>360°</b>.')}`),
    F(`${table([['Shape', 'Angle', 'At a point'], ['Equilateral triangle', '60°', '6 × 60 = 360 ✓'], ['Square', '90°', '4 × 90 = 360 ✓'], ['Regular hexagon', '120°', '3 × 120 = 360 ✓'], ['Regular pentagon', '108°', '324 or 432 ✗']])}`),
    T(p('Your turn. Which shape tessellates on its own?'), ['regular pentagon', 'circle', 'regular hexagon', 'regular octagon'], 2, 'Yes! Three hexagons meet at each point: 3 × 120° = 360°.', 'Not quite. Which angle fits exactly into 360° a whole number of times?')
  ] })
};
