// "Learn first" explainers for grown-ups (Everyday & money, University) and the Reasoning topics.
import { F, T, fr, big, p, mk, alt, no, yes, cmp, steps, box, table } from './learn_kit.js';
import { isUS, isIndia, money, tax, foreign, U } from '../core/region.js';

const sup = n => `<sup>${n}</sup>`;
const K = () => isIndia() ? 50 : 1;                 // rupee amounts are about 50× dollar/pound amounts
const M = n => money(Math.round(n * K() * 100) / 100);
const r2 = n => Math.round(n * 100) / 100;
const mat = rows => `<span class="lmat">${rows.map(r => `<span>${r.map(v => String(v).replace('-', '−')).join(' ')}</span>`).join('')}</span>`;
const L = s => `<span class="lletters">${s}</span>`;

export const ADULT = {
  // ---------------- Everyday maths ----------------
  'a-tip': () => { const bill = 80 * K(), tot = bill * 1.15; return { title: 'Tips and splitting the bill', frames: [
    F(`${p(`The bill is ${money(bill)}. Four friends add a 15% tip and split it.`)}${steps([`Tip: 10% = ${money(bill / 10)}, 5% = ${money(bill / 20)}, so 15% = ${money(bill * .15)}`, `Total: ${money(bill)} + ${money(bill * .15)} = ${money(tot)}`, `Each: ${money(tot)} ÷ 4 = ${alt(money(tot / 4))}`])}`),
    F(`${p('Quick way: multiply the bill by 1.15 to add 15% in one go. Round to the nearest cent/paisa at the end.')}`),
    T(p(`Your turn. A ${money(100 * K())} bill with a 10% tip, split between 2 people. How much each?`), [money(55 * K()), money(50 * K()), money(60 * K()), money(110 * K())], 0, 'Yes! Total 110% of the bill, then halve it.', 'Not quite. Add the 10% tip first, then split.')
  ] }; },
  'a-unitp': () => isUS() ? ({ title: 'Price per pound', frames: [
    F(`${p('1 lb = 16 oz. To find the price per pound, find the price per ounce, then × 16.')}${p(`A 12 oz pack costs ${money(6)}: ${money(6)} ÷ 12 = ${money(0.5)} per oz, × 16 = ${alt(money(8))} per lb`)}`),
    T(p(`Your turn. An 8 oz pack costs ${money(3)}. What is the price per lb?`), [money(6), money(4.8), money(3), money(24)], 0, 'Yes! 8 oz is half a pound, so double it.', 'Not quite. How many 8 oz packs make 16 oz?')
  ] }) : ({ title: 'Price per kg', frames: [
    F(`${p('1 kg = 1000 g. Find the price per gram, then × 1000. Or scale up the pack.')}${p(`A 250 g pack costs ${M(3.5)}: 4 packs make 1 kg, so ${M(3.5)} × 4 = ${alt(M(14))} per kg`)}`),
    T(p(`Your turn. A 500 g pack costs ${M(4)}. What is the price per kg?`), [M(8), M(2), M(4.5), M(40)], 0, 'Yes! 500 g is half a kilogram, so double it.', 'Not quite. How many 500 g packs make 1 kg?')
  ] }),
  'a-recipe': () => ({ title: 'Scaling recipes', frames: [
    F(`${p('A recipe for 4 people needs 250 g of flour. For 6 people?')}${steps(['Per person: 250 ÷ 4 = 62.5 g', `For 6: 62.5 × 6 = ${alt('375 g')}`])}${p('Or use the scale factor: 6 ÷ 4 = 1.5, and 250 × 1.5 = 375.')}`),
    T(p('Your turn. A recipe for 2 people needs 450 g. How much for 8 people?'), ['1800 g', '900 g', '1350 g', '3600 g'], 0, 'Yes! 8 is 4 times 2: 450 × 4 = 1800.', 'Not quite. 8 people is 4 times as many as 2.')
  ] }),
  'a-time': () => ({ title: 'Travel times', frames: [
    F(`${p('A flight leaves at 23:45 and takes 8 h 5 min.')}${steps(['Add the hours: 23:45 + 8 h = 31:45', 'Past 24:00 means the next day: 31:45 − 24:00 = 07:45', `Add the minutes: 07:45 + 5 min = ${alt('07:50 (next day)')}`])}`),
    F(`${p('If minutes go past 60, carry 1 hour: 19:50 + 30 min = 20:20.')}`),
    T(p('Your turn. A train leaves at 21:30 and takes 4 h 45 min. When does it arrive?'), ['02:15 (next day)', '01:15 (next day)', '25:75', '02:15'], 0, 'Yes! 21:30 + 4 h = 01:30, + 45 min = 02:15 next day.', 'Not quite. Add the hours, take off 24 for the next day, then add the minutes.')
  ] }),
  'a-conv': () => ({ title: 'Converting units', frames: [
    F(table([['Conversion', 'Rule'], ['miles → km', '× 1.6'], ['km → miles', '÷ 1.6'], ['kg → lb', '× 2.2'], ['°C → °F', '× 9 ÷ 5 + 32'], ['°F → °C', '− 32, × 5 ÷ 9']])),
    F(`${p('40°C to °F: 40 × 9 ÷ 5 = 72, + 32 = ' + alt('104°F'))}${p('98.6°F to °C: 98.6 − 32 = 66.6, × 5 ÷ 9 = 37°C (body temperature)')}`),
    T(p('Your turn. How many km is 50 miles?'), [80, 31.25, 50, 66], 0, 'Yes! 50 × 1.6 = 80 km.', 'Not quite. Miles to km: multiply by 1.6.')
  ] }),
  'a-pct': () => ({ title: 'Pay rises and price changes', frames: [
    F(`${big('% change = (new − old) ÷ old × 100')}${p(`From ${M(720)} to ${M(864)}: (864 − 720) ÷ 720 × 100 = ${alt('20%')}`)}`),
    F(`${p('A fall gives a negative answer. Always divide by the <b>old</b> value.')}${p(`A ${M(600)} pay with a 5% raise: × 1.05 = ${M(630)}`)}`),
    T(p(`Your turn. A price goes from ${M(50)} to ${M(40)}. What is the percentage change?`), ['−20%', '−25%', '20%', '−10%'], 0, 'Yes! −10 ÷ 50 = −0.2, a 20% fall.', 'Not quite. Divide the change by the old price (50).')
  ] }),
  'a-est': () => ({ title: 'Estimating a shopping total', frames: [
    F(`${p('Round each price to an easy number, then add.')}${box(`${M(1.99)} → ${M(2)}<br>${M(5.70)} → ${M(6)}<br>${M(3.20)} → ${M(3)}`)}${p(`Estimate: ${M(2)} + ${M(6)} + ${M(3)} = about ${alt(M(11))}`)}`),
    T(p(`Your turn. Estimate: ${M(4.95)} + ${M(2.10)} + ${M(7.99)}`), [`about ${M(15)}`, `about ${M(14)}`, `about ${M(13)}`, `about ${M(20)}`], 0, 'Yes! 5 + 2 + 8 = 15.', 'Not quite. Round each price to the nearest whole unit first.')
  ] }),
  'a-fuel': () => isUS() ? ({ title: 'Fuel cost for a trip', frames: [
    F(`${p(`A 300-mile trip. The car does 30 miles per gallon. Gas is ${money(3.5)} a gallon.`)}${steps(['Gallons: 300 ÷ 30 = 10', `Cost: 10 × ${money(3.5)} = ${alt(money(35))}`])}`),
    T(p(`Your turn. 240 miles at 40 mpg, gas ${money(4)} a gallon. Fuel cost?`), [money(24), money(16), money(60), money(96)], 0, 'Yes! 6 gallons × 4 = 24.', 'Not quite. Gallons = miles ÷ mpg.')
  ] }) : ({ title: 'Fuel cost for a trip', frames: [
    F(`${p(`A 400 km trip. The car uses 6 litres per 100 km. Fuel is ${M(2)} a litre.`)}${steps(['Litres: 400 ÷ 100 × 6 = 24', `Cost: 24 × ${M(2)} = ${alt(M(48))}`])}`),
    T(p(`Your turn. 300 km at 5 litres per 100 km, fuel ${M(2)} a litre. Fuel cost?`), [M(30), M(15), M(60), M(150)], 0, 'Yes! 15 litres × 2 = 30.', 'Not quite. Litres = km ÷ 100 × litres per 100 km.')
  ] }),

  // ---------------- Money and finance ----------------
  'a-budget': () => ({ title: 'Monthly budget', frames: [
    F(`${table([['Monthly', 'Amount'], ['Take-home pay', M(3000)], ['Rent', M(1000)], ['Food', M(400)], ['Bills', M(250)]])}${p(`Left over = pay − all spending = 3000 − 1650 = ${alt(M(1350))}`)}`),
    F(`${p('Add up the spending first, then take it from take-home pay (after tax).')}`),
    T(p(`Your turn. Pay ${M(2000)}; rent ${M(800)}, food ${M(300)}, bills ${M(200)}. What is left?`), [M(700), M(1300), M(1000), M(900)], 0, 'Yes! Spending 1300, so 2000 − 1300 = 700.', 'Not quite. Add the three costs, then subtract from 2000.')
  ] }),
  'a-pay': () => ({ title: 'Payslips and overtime', frames: [
    F(`${box('<b>Gross pay</b>: before tax = hours × hourly rate<br><b>Take-home (net) pay</b>: after deductions<br><b>Time and a half</b>: overtime at 1.5 × the rate')}`),
    F(`${p(`40 hours at ${M(20)}, plus 5 hours overtime at time and a half:`)}${steps([`Normal: 40 × ${M(20)} = ${M(800)}`, `Overtime: 5 × ${M(30)} = ${M(150)}`, `Total: ${alt(M(950))}`])}`),
    T(p(`Your turn. Gross pay is ${M(1000)}; 15% is taken off for tax. Take-home pay?`), [M(850), M(150), M(985), M(1150)], 0, 'Yes! 1000 × 0.85 = 850.', 'Not quite. Take 15% off: × 0.85.')
  ] }),
  'a-fx': () => { const [name, sym, rate] = foreign()[0]; return { title: 'Currency exchange', frames: [
    F(`${p(`Practice rate: 1 ${name.replace(/s$/, '')} = ${money(rate)}.`)}${box(`Foreign → your money: <b>multiply</b> by the rate<br>Your money → foreign: <b>divide</b> by the rate`)}`),
    F(`${p(`${sym}100 in your money: 100 × ${rate} = ${alt(money(100 * rate))}`)}${p(`${money(rate * 50)} in ${name}: ${rate * 50} ÷ ${rate} = ${sym}50`)}`),
    T(p(`Your turn. At 1 = ${money(rate)}, how much is ${sym}20 in your money?`), [money(20 * rate), money(r2(20 / rate)), money(20 + rate), money(rate)], 0, 'Yes! Multiply by the rate.', 'Not quite. Foreign money to yours: multiply.')
  ] }; },
  'a-infl': () => ({ title: 'Inflation', frames: [
    F(`${p('Inflation makes prices rise by a percentage each year, like compound interest.')}${big('Future price = price × (1 + r/100)ⁿ')}${p(`${M(100)} at 3% for 2 years: 100 × 1.03${sup(2)} = ${alt(M(106.09))}`)}`, 'Future price is price times one plus r over a hundred to the power n.'),
    T(p(`Your turn. Something costs ${M(200)}. Prices rise 10% a year. Cost in 2 years?`), [M(242), M(240), M(220), M(400)], 0, 'Yes! 200 → 220 → 242.', 'Not quite. 10% on 200, then 10% on the new price.')
  ] }),
  'a-mort': () => { const P = 100000 * K(), i = .06 / 12, n = 240, pay = r2(P * i / (1 - (1 + i) ** -n)); return { title: 'Loans and mortgages', frames: [
    F(`${p('A loan repaid monthly has a fixed payment worked out by the bank. From it you can find:')}${box('Total repaid = monthly payment × number of months<br>Interest = total repaid − amount borrowed<br>First month\'s interest = balance × yearly rate ÷ 12')}`),
    F(`${p(`${money(P)} at 6% over 20 years: payment ${money(pay)} a month.`)}${steps([`Total: ${money(pay)} × 240 = ${money(r2(pay * 240))}`, `Interest: ${money(r2(pay * 240))} − ${money(P)} = ${alt(money(r2(pay * 240 - P)))}`])}`),
    T(p(`Your turn. A loan of ${M(10000)} is repaid with 24 payments of ${M(470)}. How much interest?`), [M(1280), M(470), M(11280), M(10000)], 0, 'Yes! 24 × 470 = 11,280, minus 10,000.', 'Not quite. Total repaid minus the amount borrowed.')
  ] }; },
  'a-card': () => ({ title: 'Credit card interest', frames: [
    F(`${p('Card rates are yearly (APR). Each month charges about APR ÷ 12.')}${p(`18% a year → 1.5% a month. On ${M(2000)}: 2000 × 0.015 = ${alt(M(30))} interest this month`)}`),
    F(`${p('With nothing paid, interest is charged on interest:')}${p(`After 2 months: ${M(2000)} × 1.015${sup(2)} = ${M(2060.45)}`)}`),
    T(p(`Your turn. A balance of ${M(1000)} at 24% a year. How much interest is added this month?`), [M(20), M(24), M(240), M(2)], 0, 'Yes! 24% ÷ 12 = 2% a month: 2% of 1000 = 20.', 'Not quite. Monthly rate = yearly rate ÷ 12.')
  ] }),
  'a-save': () => ({ title: 'Savings goals', frames: [
    F(`${p(`Goal ${M(1100)}, saving ${M(165)} a month.`)}${steps(['1100 ÷ 165 ≈ 6.67', `Round <b>up</b>: you need ${alt(7)} months`])}${p('After 6 months you only have 990, so you need a 7th month.')}`),
    T(p(`Your turn. Goal ${M(1000)}, saving ${M(300)} a month. How many months?`), [4, 3, 3.33, 5], 0, 'Yes! 3 months is only 900, so 4 months.', 'Not quite. Divide, then round UP to a whole month.')
  ] }),
  'a-tax': () => { const t = tax(), m = 1 + t.rate / 100; return { title: `Prices with and without ${t.name}`, frames: [
    F(`${box(`Add ${t.name}: × ${m}<br>Remove ${t.name}: ÷ ${m}`)}${p(`${M(100)} before ${t.name} → ${M(100)} × ${m} = ${alt(M(100 * m))}`)}`),
    F(`${p(`A price of ${M(100 * m)} <b>includes</b> ${t.rate}% ${t.name}. Before ${t.name}: ÷ ${m} = ${M(100)}`)}${cmp(no(`Take ${t.rate}% off`, M(r2(100 * m * (1 - t.rate / 100)))), yes(`Divide by ${m}`, M(100)))}`),
    T(p(`Your turn. A price of ${M(200 * m)} includes ${t.rate}% ${t.name}. What was it before ${t.name}?`), [M(200), M(r2(200 * m * (1 - t.rate / 100))), M(200 * m * m), M(200 * m)], 0, `Yes! ÷ ${m} gives 200.`, `Not quite. Divide by ${m}.`)
  ] }; },

  // ---------------- Aptitude tests ----------------
  'a-data': () => ({ title: 'Aptitude: reading data tables', frames: [
    F(`${table([['Year', 2022, 2023, 2024, 2025], ['Sales', 220, 231, 254, 229]])}${box(`Mean: (220 + 231 + 254 + 229) ÷ 4 = 233.5<br>Biggest rise: 2023 → 2024 (+23)<br>% change 2022 → 2023: 11 ÷ 220 × 100 = 5%`)}`),
    F(`${p('Read the question twice: is it asking for a total, a difference, a mean or a percentage?')}`),
    T(p('Your turn. Sales went from 220 to 231. What is the percentage increase?'), ['5%', '11%', '4.8%', '105%'], 0, 'Yes! 11 ÷ 220 = 0.05.', 'Not quite. Change ÷ old value × 100.')
  ] }),
  'a-invp': () => ({ title: 'Aptitude: work and time', frames: [
    F(`${p('More workers → fewer days. The total work stays the same:')}${big('workers × days = constant')}${p(`4 workers × 3 days = 12 worker-days. 6 workers: 12 ÷ 6 = ${alt('2 days')}`)}`),
    T(p('Your turn. 5 workers take 8 days. How long would 10 workers take?'), [4, 16, 13, 3], 0, 'Yes! 40 worker-days ÷ 10 = 4.', 'Not quite. Total work = 5 × 8. Share it between 10.')
  ] }),
  'a-seq': () => ({ title: 'Aptitude: number sequences', frames: [
    F(`${p('Try these checks in order:')}${steps(['Differences: is it + the same each time?', 'Differences of differences', 'Each term = sum of the two before it?', 'Alternating patterns, × or ÷'])}`),
    F(`${big('2, 4, 6, 10, 16, 26, ?')}${p(`Each term is the sum of the two before: 16 + 26 = ${alt(42)}`)}`),
    T(`${p('Your turn. What comes next?')}${big('1, 4, 9, 16, 25, ?')}`, [36, 30, 34, 49], 0, 'Yes! Square numbers: 6² = 36.', 'Not quite. Differences 3, 5, 7, 9 … next is 11.')
  ] }),

  // ---------------- University ----------------
  'u-dot': () => ({ title: 'Dot product', frames: [
    F(`${big('a · b = a₁b₁ + a₂b₂ + a₃b₃')}${p('<span class="lnc">(6, 6, 0) · (−2, −1, −1)</span>: 6 × (−2) + 6 × (−1) + 0 × (−1) = −12 − 6 + 0 = ' + alt('−18'))}`),
    F(`${p('If a · b = 0, the vectors are <b>perpendicular</b>. In general a · b = |a||b| cos θ.')}`),
    T(p('Your turn. Find (1, 2, 3) · (4, 0, −1).'), [1, 7, 4, '−1'], 0, 'Yes! 4 + 0 − 3 = 1.', 'Not quite. Multiply matching parts and add.')
  ] }),
  'u-inv': () => ({ title: 'Inverse of a 2×2 matrix', frames: [
    F(`${big(`${mat([['a', 'b'], ['c', 'd']])}⁻¹ = ${fr(1, 'ad − bc')} ${mat([['d', '−b'], ['−c', 'a']])}`)}${p('Swap a and d, change the signs of b and c, divide by the determinant.')}`, 'Swap a and d, change the signs of b and c, and divide by the determinant.'),
    F(`${p(`${mat([[3, 2], [1, 1]])}: det = 3 − 2 = 1, inverse = ${mat([[1, -2], [-1, 3]])}`)}${p('Check: A × A⁻¹ = I. If det = 0 there is no inverse.')}`),
    T(`${p(`Your turn. What is the determinant you divide by for ${mat([[4, 3], [2, 2]])}?`)}`, [2, 14, 8, 6], 0, 'Yes! 4 × 2 − 3 × 2 = 2.', 'Not quite. ad − bc.')
  ] }),
  'u-eig': () => ({ title: 'Eigenvalues', frames: [
    F(`${p('Eigenvalues λ solve det(A − λI) = 0. For a 2 × 2 matrix:')}${big('λ² − (trace)λ + det = 0')}${p('trace = a + d, det = ad − bc')}`),
    F(`${p(`${mat([[-2, 4], [4, -2]])}: trace −4, det 4 − 16 = −12`)}${p('λ² + 4λ − 12 = 0 → (λ + 6)(λ − 2) = 0 → λ = −6 or 2')}${p('Triangular matrix: eigenvalues are the diagonal.')}`),
    T(`${p(`Your turn. Eigenvalues of ${mat([[5, 4], [0, -2]])}?`)}`, ['5 and −2', '5 and 4', '3 and 0', '−5 and 2'], 0, 'Yes! It is triangular: read the diagonal.', 'Not quite. Below the diagonal is 0: the eigenvalues are on the diagonal.')
  ] }),
  'u-logic': () => ({ title: 'Sets and logic', frames: [
    F(table([['p', 'q', 'p ∧ q (and)', 'p ∨ q (or)'], ['T', 'T', 'T', 'T'], ['T', 'F', 'F', 'T'], ['F', 'T', 'F', 'T'], ['F', 'F', 'F', 'F']])),
    F(`${box('De Morgan: ¬(p ∧ q) = ¬p ∨ ¬q, and ¬(p ∨ q) = ¬p ∧ ¬q<br>Sets: |A ∪ B| = |A| + |B| − |A ∩ B|')}`),
    T(p('Your turn. p is True and q is False. What is p ∧ q?'), ['False', 'True'], 0, 'Yes! "and" needs both true.', 'Not quite. ∧ means and.')
  ] }),
  'u-mod': () => ({ title: 'Modular arithmetic', frames: [
    F(`${p('a mod n is the <b>remainder</b> when a is divided by n.')}${big('17 mod 5 = 2')}${p('Clocks work mod 24: 19:00 + 191 h → 210 mod 24 = 18 → 18:00')}`),
    F(`${p('You can reduce first: <span class="lnc">(64 × 42) mod 10 = (4 × 2) mod 10</span> = ' + alt(8))}`),
    T(p('Your turn. What is 50 mod 7?'), [1, 7, 3, 0], 0, 'Yes! 49 is 7 × 7, so 1 is left.', 'Not quite. Divide 50 by 7: what is left over?')
  ] }),
  'u-base': () => ({ title: 'Binary and hexadecimal', frames: [
    F(`${table([['64', '32', '16', '8', '4', '2', '1'], [1, 1, 0, 0, 0, 0, 1]])}${p(`97 = 64 + 32 + 1, so in binary 97 is ${alt('1100001₂')}`)}`),
    F(`${p('Hexadecimal is base 16: digits 0–9 then A=10 … F=15.')}${p('2F₁₆ = 2 × 16 + 15 = 47. FF₁₆ = 255.')}`),
    T(p('Your turn. Convert 1011₂ to decimal.'), [11, 1011, 13, 9], 0, 'Yes! 8 + 2 + 1 = 11.', 'Not quite. Place values 8, 4, 2, 1.')
  ] }),
  'u-graph': () => ({ title: 'Graph theory', frames: [
    F(`${box('<b>Degree</b> of a vertex: number of edges at it<br>Sum of degrees = 2 × number of edges')}${p('Can you travel every edge exactly once (an Euler path)? Count the <b>odd</b>-degree vertices:')}`),
    F(table([['Odd vertices', 'Euler path?'], ['0', 'Yes, start and end at the same vertex'], ['2', 'Yes, start and end at the two odd ones'], ['more than 2', 'No']])),
    T(p('Your turn. Degrees 2, 2, 2, 2. Can you travel every edge exactly once?'), ['Yes, starting and ending at the same vertex', 'Yes, between two odd vertices', 'No'], 0, 'Yes! No odd vertices: a circuit.', 'Not quite. How many vertices have an odd degree?')
  ] }),
  'u-gcd': () => ({ title: "Euclid's algorithm", frames: [
    F(`${big('gcd(a, b) = gcd(b, a mod b)')}${steps(['192 = 1 × 186 + 6', '186 = 31 × 6 + 0', 'The last non-zero remainder is the gcd: 6'])}`),
    F(`${p('Then lcm(a, b) = a × b ÷ gcd(a, b).')}`),
    T(p('Your turn. Find gcd(48, 18).'), [6, 3, 2, 18], 0, 'Yes! 48 = 2 × 18 + 12, 18 = 1 × 12 + 6, 12 = 2 × 6.', 'Not quite. Divide and keep the remainder until it is 0.')
  ] }),
  'u-series': () => ({ title: 'Infinite geometric series', frames: [
    F(`${p('If the ratio r is between −1 and 1, the terms shrink and the sum settles:')}${big(`S∞ = ${fr('a', '1 − r')}`)}`, 'Sum to infinity is a over one minus r, when r is between minus one and one.'),
    F(`${p(`5 − 5/4 + 5/16 − …: a = 5, r = −¼ → 5 ÷ 1.25 = ${alt(4)}`)}`),
    T(p('Your turn. Find the sum to infinity of 6 + 3 + 1.5 + …'), [12, 10.5, 9, 'no sum'], 0, 'Yes! r = ½: 6 ÷ ½ = 12.', 'Not quite. a = 6, r = ½.')
  ] }),
  'u-int': () => ({ title: 'Integration techniques', frames: [
    F(`${p('<b>Substitution</b>: spot a function and its derivative.')}${p('∫ 2x(x² + 4)² dx: let u = x² + 4, du = 2x dx → ∫ u² du = u³/3 = (x² + 4)³/3 + c')}`),
    F(`${p('<b>By parts</b>: ∫ u dv = uv − ∫ v du')}${p('∫ x eˣ dx: u = x, dv = eˣ dx → xeˣ − ∫ eˣ dx = xeˣ − eˣ + c')}`),
    T(p('Your turn. Find ∫ 2x(x² + 1)³ dx.'), ['(x² + 1)⁴/4 + c', '(x² + 1)⁴ + c', 'x²(x² + 1)³ + c', '2(x² + 1)⁴ + c'], 0, 'Yes! u = x² + 1: ∫ u³ du = u⁴/4.', 'Not quite. Substitute u = x² + 1; 2x dx is du.')
  ] }),
  'u-de': () => ({ title: 'Differential equations', frames: [
    F(`${big('dy/dt = ky → y = y₀ e^(kt)')}${p('Growth (k &gt; 0) or decay (k &lt; 0) at a rate proportional to the amount.')}`),
    F(`${p('dy/dt = y, y(0) = 30: y = 30eᵗ. At t = 4: 30 × e⁴ ≈ 1637.9')}${p('Doubling time = ln 2 ÷ k.')}`),
    T(p('Your turn. Solve dy/dt = 2y with y(0) = 5.'), ['y = 5e^(2t)', 'y = 2e^(5t)', 'y = 5 + 2t', 'y = 10t'], 0, 'Yes! y₀ = 5, k = 2.', 'Not quite. The answer is y₀e^(kt).')
  ] }),
  'u-ev': () => ({ title: 'Expected value and variance', frames: [
    F(`${table([['x', 0, 1, 2, 3], ['P(X = x)', 0.1, 0.2, 0.3, 0.4]])}${box('E(X) = Σ x·P = 0 + 0.2 + 0.6 + 1.2 = 2<br>E(X²) = 0 + 0.2 + 1.2 + 3.6 = 5<br>Var(X) = E(X²) − E(X)² = 5 − 4 = 1')}`),
    T(p('Your turn. X is 0 or 10, each with probability 0.5. Find E(X).'), [5, 10, 0, 2.5], 0, 'Yes! 0 × 0.5 + 10 × 0.5 = 5.', 'Not quite. Multiply each value by its probability and add.')
  ] }),
  'u-ci': () => ({ title: 'Confidence intervals', frames: [
    F(`${big('95% interval: mean ± 1.96 × σ ÷ √n')}${p('n = 36, mean 53, σ = 12: 1.96 × 12 ÷ 6 = 3.92')}${p(`53 ± 3.92 → ${alt('49.1 to 56.9')}`)}`),
    F(`${p('A bigger sample (n) gives a narrower interval: more data, more certainty.')}`),
    T(p('Your turn. n = 100, mean 50, σ = 10. What is the 95% interval?'), ['48.0 to 52.0', '30.4 to 69.6', '49.0 to 51.0', '40.2 to 59.8'], 0, 'Yes! 1.96 × 10 ÷ 10 = 1.96.', 'Not quite. σ ÷ √n = 10 ÷ 10 = 1, then × 1.96.')
  ] }),

  // ---------------- Reasoning ----------------
  'b-numseries': () => ({ title: 'Number series', frames: [
    F(`${p('Write the jumps between numbers. Look for: the same jump, growing jumps, alternating jumps, or each = sum of the two before.')}${big('1, 5, 6, 11, 17')}${p('5 + 6 = 11, 6 + 11 = 17: each is the sum of the two before.')}`),
    T(`${p('Your turn. What comes next?')}${big('3, 6, 9, 15, 24, ?')}`, [39, 33, 30, 48], 0, 'Yes! 15 + 24 = 39.', 'Not quite. Try adding the two numbers before.')
  ] }),
  'b-letseries': () => ({ title: 'Letter series', frames: [
    F(`${p('Turn letters into numbers (A = 1 … Z = 26). Remember <b>EJOTY</b>: E 5, J 10, O 15, T 20, Y 25.')}${big('A, E, D, H, G')}${p('1, 5, 4, 8, 7: +4, −1, +4, −1 → next is 7 + 4 = 11 = K')}`),
    T(`${p('Your turn. What comes next?')}${big('B, D, F, H, ?')}`, ['J', 'I', 'K', 'G'], 0, 'Yes! +2 each time: H (8) + 2 = J (10).', 'Not quite. Count the jump between letters.')
  ] }),
  'b-anum': () => ({ title: 'Number analogies', frames: [
    F(`${p('a : b :: c : ? means "a is to b as c is to ?". Find the rule for the first pair, then use it.')}${box('11 : 18 → + 7, so 13 : 20<br>3 : 27 → cube, so 7 : 343')}`),
    T(`${p('Your turn.')}${big('4 : 16 :: 6 : ?')}`, [36, 18, 24, 12], 0, 'Yes! Squares: 6² = 36.', 'Not quite. What turns 4 into 16? Try × 4, + 12, or squaring, and test.')
  ] }),
  'b-alet': () => ({ title: 'Letter analogies', frames: [
    F(`${p('Find how each letter moves in the first pair.')}${big('IJ : MN :: HI : ?')}${p('I → M is +4, J → N is +4. So H → L, I → M: ' + alt('LM'))}`),
    T(`${p('Your turn.')}${big('AB : DE :: GH : ?')}`, ['JK', 'IJ', 'KL', 'HI'], 0, 'Yes! +3 each: G → J, H → K.', 'Not quite. A → D is how many steps?')
  ] }),
  'b-odd': () => ({ title: 'Odd one out: numbers', frames: [
    F(`${p('Find a property all but one share: even/odd, prime, square, multiple of something, digit sum…')}${box('9, 16, 25, 30, 36 → all squares except <b>30</b>')}`),
    T(`${p('Your turn. Which is the odd one out?')}${big('4, 9, 16, 20, 25')}`, [20, 9, 4, 25], 0, 'Yes! The others are square numbers.', 'Not quite. Four of them are square numbers.')
  ] }),
  'b-oddlet': () => ({ title: 'Odd one out: letters', frames: [
    F(`${p('Turn each group into numbers and look at the gaps.')}${box('ILP: 9, 12, 15 (+3, +3)<br>PQT: 16, 17, 20 (+1, +3) ← different')}`),
    T(`${p('Your turn. Which group is the odd one out?')}${big('ACE, GIK, MOQ, RTW')}`, ['RTW', 'ACE', 'GIK', 'MOQ'], 0, 'Yes! The others go +2, +2; RTW goes +2, +3.', 'Not quite. Check the gaps in each group.')
  ] }),
  'b-code': () => ({ title: 'Coding and decoding', frames: [
    F(`${p('Find how each letter changed, then do the same.')}${big('CUP → BTO')}${p('Each letter moves back 1. So FAN → ' + alt('EZM'))}${p('(Before A comes Z: the alphabet wraps round.)')}`),
    T(p('Your turn. If CAT is written as DBU, how is DOG written?'), ['EPH', 'CNF', 'EOH', 'DPH'], 0, 'Yes! Each letter moves forward 1.', 'Not quite. C → D, A → B, T → U: each letter +1.')
  ] }),
  'b-alpha': () => ({ title: 'Alphabet positions', frames: [
    F(`${p('Use positions: A 1 … Z 26 (EJOTY: 5, 10, 15, 20, 25).')}${box('6th to the <b>left</b> of Y: 25 − 6 = 19 → S<br>6th to the <b>right</b> of I: 9 + 6 = 15 → O')}`),
    T(p('Your turn. Which letter is 4th to the right of K?'), ['O', 'N', 'P', 'G'], 0, 'Yes! K is the 11th letter; 11 + 4 = 15, which is O.', 'Not quite. K is the 11th letter. Add 4.')
  ] }),
  'b-dir': () => ({ title: 'Directions', frames: [
    F(`${p('North up, East right, South down, West left.')}${box('Turn right: clockwise 90°<br>Turn left: anticlockwise 90°<br>Turn around: 180°')}${p('Facing East, turn right → South, turn around → North.')}`),
    F(`${p('9 km South then 7 km East: you are below and to the right of the start → South-East.')}`),
    T(p('Your turn. Facing North, you turn right twice. Which way do you face?'), ['South', 'East', 'West', 'North'], 0, 'Yes! North → East → South.', 'Not quite. Each right turn moves one step clockwise.')
  ] }),
  'b-rank': () => ({ title: 'Ranking and order', frames: [
    F(`${box('Position from the back = total − position from front + 1<br>Total = position from left + position from right − 1')}${p('43 students, Kabir 24th from the front: 43 − 24 + 1 = 20th from the back.')}`),
    T(p('Your turn. Ira is 10th from the front and 5th from the back. How many in the line?'), [14, 15, 16, 5], 0, 'Yes! 10 + 5 − 1 = 14 (she is counted twice).', 'Not quite. Add both positions, then subtract 1.')
  ] }),
  'b-cal': () => ({ title: 'Calendar', frames: [
    F(`${p('Days repeat every 7. Count the days after the 1st, then take the remainder ÷ 7.')}${p('1st is Friday. 19th is 18 days later: 18 = 2 weeks + 4 → Friday + 4 = Tuesday.')}`),
    T(p('Your turn. The 1st is a Monday. What day is the 10th?'), ['Wednesday', 'Tuesday', 'Thursday', 'Monday'], 0, 'Yes! 9 days later = 1 week + 2: Monday + 2.', 'Not quite. 10th − 1st = 9 days = 1 week and 2 days.')
  ] }),
  'b-clock': () => ({ title: 'Clock angles and mirror time', frames: [
    F(`${p('<b>Mirror time</b> = 11:60 − the time shown.')}${p('Mirror shows 2:15 → 11:60 − 2:15 = 9:45.')}`),
    F(`${p('<b>Angle between the hands</b> = |30 × hours − 5.5 × minutes|')}${p('3:00 → 90°. 3:30 → |90 − 165| = 75°.')}`),
    T(p('Your turn. A clock in a mirror shows 4:20. What is the real time?'), ['7:40', '8:40', '4:40', '7:20'], 0, 'Yes! 11:60 − 4:20 = 7:40.', 'Not quite. Subtract from 11:60.')
  ] }),
  'b-mirror': () => ({ title: 'Mirror and water images', frames: [
    F(`${p('A mirror on the right flips left and right: the word is reversed and each letter is flipped.')}${big(`KITE → ${L('KITE')}`)}${p('Letters that look the same in a mirror: A H I M O T U V W X Y.')}`),
    F(`${p('A <b>water image</b> flips top and bottom (upside down).')}`),
    T(p('Your turn. Which letters look the same in a mirror?'), ['A H O', 'B C D', 'F G J', 'K L N'], 0, 'Yes! A, H and O are symmetrical left to right.', 'Not quite. Which letters have a vertical line of symmetry?')
  ] }),
  'b-count': () => ({ title: 'Counting figures', frames: [
    F(`${p('Count <b>systematically</b>: single shapes first, then shapes made of 2 parts, then 3, and so on.')}${p('A triangle cut by lines from the top into 3 sections: 3 small + 2 double + 1 whole = 6.')}${box('Pattern: n sections → 1 + 2 + … + n triangles')}`),
    T(p('Your turn. A triangle is cut into 4 sections by lines from the top. How many triangles?'), [10, 4, 8, 6], 0, 'Yes! 4 + 3 + 2 + 1 = 10.', 'Not quite. Count 1-part, 2-part, 3-part and 4-part triangles.')
  ] }),
  'b-miss': () => ({ title: 'Missing numbers in figures', frames: [
    F(`${p('Each figure follows the same rule. Test the rule on the complete figures first.')}${box('(2, 3) → 6, (4, 5) → 20: the rule is multiply')}${p('Try +, −, ×, then mixes like (a + b) × 2.')}`),
    T(p('Your turn. (2, 3) → 6, (4, 5) → 20, (3, 7) → ?'), [21, 10, 4, 37], 0, 'Yes! 3 × 7 = 21.', 'Not quite. 2 × 3 = 6 and 4 × 5 = 20.')
  ] }),
  'b-rel': () => ({ title: 'Family relations', frames: [
    F(`${p('Draw a small family tree as you read.')}${box('Father\'s or mother\'s brother: uncle<br>Father\'s or mother\'s mother: grandmother<br>Uncle\'s child: cousin')}${p('Amit is Mohan\'s son; Kiran is Mohan\'s brother → Kiran is Amit\'s uncle.')}`),
    T(p("Your turn. Priya's mother's brother is Priya's…"), ['Uncle', 'Brother', 'Cousin', 'Grandfather'], 0, 'Yes! A parent\'s brother is an uncle.', 'Not quite. He is the brother of her parent.')
  ] })
};
