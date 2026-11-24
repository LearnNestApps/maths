// Adults: everyday maths, money, work aptitude tests (also for Achievers), and intro university topics.
import { rnd, pick, shuffle } from '../core/ui.js';
import { money, U, isUS, tax, currency, foreign, fmt } from '../core/region.js';

const E = s => `<span class="expr">${s}</span>`;
const r2 = x => Math.round(x * 100) / 100, r1 = x => Math.round(x * 10) / 10;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] || (c === '-' ? '⁻' : c)).join('');
const NP = (prompt, answer, hint, solution, data = {}) => ({ template: 'numpad', prompt, answer, data: { expr: '', dot: true, neg: true, maxLen: 12, ...data }, hint, solution: [].concat(solution) });
// Answers that need rounding: accept within tol.
const NPt = (prompt, answer, tol, hint, solution) => ({ template: 'numpad', prompt, answer: tol < 0.1 ? r2(answer) : r1(answer), data: { expr: '', dot: true, neg: true, maxLen: 12 }, hint, solution: [].concat(solution), check: v => Math.abs(Number(v) - answer) <= tol + 1e-9 });
function MC(prompt, right, wrongs, hint, solution, data = {}) {
  const opts = shuffle([String(right), ...[...new Set(wrongs.map(String))].filter(w => w !== String(right)).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(String(right)), data: { options: opts, ...data }, hint, solution: [].concat(solution) };
}
const tbl = (head, rows) => `<div class="mtab"><table class="ptab"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const M2 = m => `<span class="mat"><span>${m[0][0]}</span><span>${m[0][1]}</span><span>${m[1][0]}</span><span>${m[1][1]}</span></span>`;
const cents = 'Round to 2 decimal places.';
// Money sizes: rupee amounts are about 50 times bigger than dollar/pound amounts for the same thing.
const K = () => currency().code === 'INR' ? 50 : 1;

export const GEN_ADULT = {
  // ================= Everyday =================
  tipSplit() {
    const bill = (rnd(30, 180) + pick([0, .5])) * K(), tip = pick([10, 15, 18, 20]), n = rnd(2, 6), each = bill * (1 + tip / 100) / n;
    if (Math.random() < .4) return NPt(`The bill is ${money(bill)}. You add a ${tip}% tip. What is the total? ${cents}`, bill * (1 + tip / 100), .01, `Find ${tip}% of the bill and add it on (or × ${1 + tip / 100}).`, [`${bill} × ${1 + tip / 100} = ${money(r2(bill * (1 + tip / 100)))}`]);
    return NPt(`The bill is ${money(bill)}. ${n} friends add a ${tip}% tip and split it equally. How much does each pay? ${cents}`, each, .01, 'Add the tip first, then divide by the number of people.', [`${bill} × ${1 + tip / 100} = ${r2(bill * (1 + tip / 100))}`, `÷ ${n} = ${money(r2(each))}`]);
  },
  unitPrice() {
    const us = isUS(), unit = us ? 'lb' : 'kg', small = us ? 'oz' : 'g', per = us ? 16 : 1000, size = pick(us ? [8, 12, 24] : [250, 400, 750]), price = (rnd(2, 12) + pick([0, .5, .25])) * K();
    return NPt(`A ${size} ${small} pack costs ${money(price)}. What is the price per ${unit}? ${cents}`, price / size * per, .01, `There are ${per} ${small} in 1 ${unit}.`, [`${price} ÷ ${size} × ${per} = ${money(r2(price / size * per))} per ${unit}`]);
  },
  recipeScale() {
    const from = pick([2, 4, 6]), to = pick([3, 5, 8, 9].filter(x => x !== from)), amt = pick([150, 200, 250, 300, 360, 450]), unit = isUS() ? 'ml' : 'g';
    const v = amt / from * to; return NPt(`A recipe for ${from} people needs ${amt} ${unit === 'ml' ? 'ml of milk' : 'g of flour'}. How much for ${to} people (${unit})? Round to 1 decimal place if needed.`, v, .1, 'Find the amount for 1 person, then multiply.', [`${amt} ÷ ${from} = ${r2(amt / from)}`, `× ${to} = ${r1(v)} ${unit}`]);
  },
  timeCalc() {
    const h = rnd(18, 23), m = pick([0, 10, 15, 25, 40, 45, 50]), dh = rnd(2, 9), dm = pick([5, 20, 30, 35, 50]), tot = h * 60 + m + dh * 60 + dm, ah = Math.floor(tot / 60) % 24, am = tot % 60, next = tot >= 24 * 60;
    const T = (H, M) => `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`, ans = `${T(ah, am)}${next ? ' (next day)' : ''}`;
    return MC(`A flight leaves at ${T(h, m)} and takes ${dh} h ${dm} min. When does it land (same time zone)?`, ans, [`${T((ah + 1) % 24, am)}${next ? ' (next day)' : ''}`, `${T(ah, (am + 30) % 60)}${next ? ' (next day)' : ''}`, `${T(ah, am)}${next ? '' : ' (next day)'}`], 'Add the hours, then the minutes; past 24:00 is the next day.', [`${T(h, m)} + ${dh} h = ${T((h + dh) % 24, m)}`, `+ ${dm} min = ${ans}`]);
  },
  convertUnits() {
    const k = pick(['km', 'kg', 'temp']);
    if (k === 'km') { const mi = rnd(5, 120); return NPt(`1 mile ≈ 1.6 km. How many km is ${mi} miles? Round to 1 decimal place.`, mi * 1.6, .1, 'Multiply by 1.6.', [`${mi} × 1.6 = ${r1(mi * 1.6)} km`]); }
    if (k === 'kg') { const kg = rnd(2, 90); return NPt(`1 kg ≈ 2.2 lb. How many lb is ${kg} kg? Round to 1 decimal place.`, kg * 2.2, .1, 'Multiply by 2.2.', [`${kg} × 2.2 = ${r1(kg * 2.2)} lb`]); }
    if (isUS()) { const f = rnd(5, 21) * 9 + 32 - 9 * 5; const c = (f - 32) * 5 / 9; return NPt(`Convert ${f}°F to °C. Round to 1 decimal place.`, c, .1, '°C = (°F − 32) × 5 ÷ 9.', [`(${f} − 32) × 5 ÷ 9 = ${r1(c)}°C`]); }
    const c = rnd(-10, 40); return NPt(`Convert ${c}°C to °F. Round to 1 decimal place.`, c * 9 / 5 + 32, .1, '°F = °C × 9 ÷ 5 + 32.', [`${c} × 9 ÷ 5 + 32 = ${r1(c * 9 / 5 + 32)}°F`]);
  },
  percentChange() {
    const k = pick(['raise', 'rise', 'drop']), a = rnd(20, 90) * 100 * (K() > 1 ? 10 : 1);
    if (k === 'raise') { const p = pick([2, 3, 4, 5, 8, 10]); return NP(`Your pay is ${money(a)} a year. You get a ${p}% raise. What is your new pay?`, r2(a * (1 + p / 100)), `Multiply by ${1 + p / 100}.`, [`${a} × ${1 + p / 100} = ${money(a * (1 + p / 100))}`], { dot: true }); }
    const b = a + (k === 'rise' ? 1 : -1) * pick([5, 10, 15, 20, 25]) * a / 100, ch = (b - a) / a * 100;
    return NP(`A price went from ${money(a)} to ${money(b)}. What is the percentage change? (Use − for a fall.)`, r2(ch), 'Change ÷ original × 100.', [`(${b} − ${a}) ÷ ${a} × 100 = ${r2(ch)}%`], { neg: true, dot: true });
  },
  estimate() {
    const items = Array.from({ length: 5 }, () => (rnd(1, 19) + pick([.49, .99, .25, .75])) * (K() > 1 ? 20 : 1)), tot = items.reduce((s, v) => s + v, 0), near = Math.round(tot / 5) * 5;
    return MC(`Estimate your shopping total: ${items.map(money).join(' + ')}`, `about ${money(near)}`, [`about ${money(near + 10)}`, `about ${money(Math.max(5, near - 10))}`, `about ${money(near * 2)}`], 'Round each price to the nearest whole number, then add.', [items.map(v => Math.round(v)).join(' + ') + ` = ${items.reduce((s, v) => s + Math.round(v), 0)}`, `actual ${money(r2(tot))}`]);
  },
  fuelCost() {
    if (isUS()) { const mi = rnd(80, 400), mpg = pick([25, 30, 35, 40]), pr = pick([3.2, 3.5, 3.8, 4]); const c = mi / mpg * pr; return NPt(`A trip is ${mi} miles. The car does ${mpg} miles per gallon and gas costs ${money(pr)} a gallon. What does the fuel cost? ${cents}`, c, .01, 'Gallons needed = miles ÷ mpg; then × price.', [`${mi} ÷ ${mpg} = ${r2(mi / mpg)} gallons`, `× ${pr} = ${money(r2(c))}`]); }
    const km = rnd(80, 600), per100 = pick([5, 6, 7, 8]), pr = { india: 105, uk: 1.45, canada: 1.65 }[currency().code === 'INR' ? 'india' : currency().code === 'GBP' ? 'uk' : 'canada'], c = km / 100 * per100 * pr;
    return NPt(`A trip is ${km} km. The car uses ${per100} litres per 100 km and fuel costs ${money(pr)} a litre. What does the fuel cost? ${cents}`, c, .01, 'Litres = km ÷ 100 × litres per 100 km; then × price.', [`${km} ÷ 100 × ${per100} = ${r2(km / 100 * per100)} L`, `× ${pr} = ${money(r2(c))}`]);
  },
  // ================= Money =================
  budget() {
    const inc = rnd(25, 80) * 100 * K(), rent = Math.round(inc * pick([.25, .3, .35]) / 10) * 10, food = rnd(30, 90) * 10 * K(), bills = rnd(10, 40) * 10 * K(), left = inc - rent - food - bills, k = pick(['left', 'pct']);
    const T = tbl(['Monthly', 'Amount'], [['Take-home pay', money(inc)], ['Rent', money(rent)], ['Food', money(food)], ['Bills', money(bills)]]);
    if (k === 'left') return NP(`${T}How much is left each month?`, left, 'Take-home pay minus all the costs.', [`${inc} − ${rent} − ${food} − ${bills} = ${money(left)}`], { neg: true });
    return NPt(`${T}What percentage of take-home pay goes on rent? Round to 1 decimal place.`, rent / inc * 100, .1, 'Rent ÷ pay × 100.', [`${rent} ÷ ${inc} × 100 = ${r1(rent / inc * 100)}%`]);
  },
  payslip() {
    const hrs = rnd(20, 45), rate = (rnd(12, 40) + pick([0, .5])) * (K() > 1 ? 10 : 1), gross = hrs * rate, tr = pick([10, 15, 20]), k = pick(['gross', 'net', 'over']);
    if (k === 'gross') return NPt(`You work ${hrs} hours at ${money(rate)} an hour. What is your gross pay (before tax)? ${cents}`, gross, .01, 'Hours × hourly rate.', [`${hrs} × ${rate} = ${money(r2(gross))}`]);
    if (k === 'net') return NPt(`Your gross pay is ${money(gross)}. ${tr}% is taken off for tax. What is your take-home pay? ${cents}`, gross * (1 - tr / 100), .01, `Take-home = ${100 - tr}% of gross.`, [`${r2(gross)} × ${1 - tr / 100} = ${money(r2(gross * (1 - tr / 100)))}`]);
    const ot = rnd(2, 8); return NPt(`You earn ${money(rate)} an hour, and overtime is paid at time-and-a-half. You work 40 hours plus ${ot} hours overtime. What is your pay? ${cents}`, 40 * rate + ot * rate * 1.5, .01, 'Overtime hours are paid at 1.5 × the normal rate.', [`40 × ${rate} = ${r2(40 * rate)}`, `${ot} × ${r2(rate * 1.5)} = ${r2(ot * rate * 1.5)}`, `total ${money(r2(40 * rate + ot * rate * 1.5))}`]);
  },
  exchange() {
    const [nm, sym, rate] = pick(foreign()), cur = currency(), toLocal = Math.random() < .5, amt = toLocal ? rnd(2, 50) * 10 : rnd(1, 60) * (rate > 10 ? 1000 : 10);
    if (toLocal) return NPt(`Practice rate: 1 ${nm.replace(/s$/, '')} = ${money(rate)}. How much is ${sym}${fmt(amt)} in your money? ${cents}`, amt * rate, .01, 'Multiply by the rate.', [`${amt} × ${rate} = ${money(r2(amt * rate))}`]);
    return NPt(`Practice rate: 1 ${nm.replace(/s$/, '')} = ${money(rate)}. How many ${nm} do you get for ${money(amt)}? ${cents}`, amt / rate, .01, 'Divide by the rate.', [`${amt} ÷ ${rate} = ${r2(amt / rate)} ${nm}`]);
  },
  inflation() {
    const p = rnd(2, 40) * 10 * K(), r = pick([2, 3, 4, 5, 6]), n = rnd(2, 10), v = p * (1 + r / 100) ** n;
    return NPt(`Prices rise by ${r}% a year. Something costs ${money(p)} today. What will it cost in ${n} years? ${cents}`, v, .01, `Multiply by ${1 + r / 100} for each year.`, [`${p} × ${1 + r / 100}${sup(n)} = ${money(r2(v))}`]);
  },
  mortgage() {
    const P = rnd(5, 40) * 10000 * K(), apr = pick([4, 5, 6, 7, 8]), yrs = pick([5, 10, 15, 20, 25]), i = apr / 1200, n = yrs * 12, pay = P * i / (1 - (1 + i) ** -n), k = pick(['total', 'interest', 'month1']);
    const intro = `A loan of ${money(P)} at ${apr}% a year is repaid monthly over ${yrs} years. The monthly payment is ${money(r2(pay))}.`;
    if (k === 'total') return NPt(`${intro} How much is repaid in total? Round to the nearest whole number.`, Math.round(r2(pay) * n), 1, 'Monthly payment × number of months.', [`${r2(pay)} × ${n} = ${money(Math.round(r2(pay) * n))}`]);
    if (k === 'interest') return NPt(`${intro} How much interest is paid in total? Round to the nearest whole number.`, r2(pay) * n - P, 1, 'Total repaid − amount borrowed.', [`${r2(pay)} × ${n} = ${Math.round(r2(pay) * n)}`, `− ${P} = ${money(Math.round(r2(pay) * n - P))}`]);
    return NPt(`${intro} How much of the first payment is interest? ${cents}`, P * i, .01, `First month's interest = loan × ${apr}% ÷ 12.`, [`${P} × ${apr / 100} ÷ 12 = ${money(r2(P * i))}`]);
  },
  creditCard() {
    const bal = rnd(5, 60) * 50 * K(), apr = pick([18, 20, 22, 24, 30]), k = pick(['month', 'year']);
    if (k === 'month') return NPt(`A credit card balance of ${money(bal)} is charged ${apr}% a year (${r2(apr / 12)}% a month). How much interest is added this month? ${cents}`, bal * apr / 1200, .01, 'Balance × yearly rate ÷ 12.', [`${bal} × ${apr / 100} ÷ 12 = ${money(r2(bal * apr / 1200))}`]);
    const m = rnd(2, 6), v = bal * (1 + apr / 1200) ** m; return NPt(`A balance of ${money(bal)} grows at ${apr}% a year (${r2(apr / 12)}% a month) with nothing paid. What is it after ${m} months? ${cents}`, v, .01, `Multiply by ${1 + apr / 1200} each month.`, [`${bal} × ${1 + apr / 1200}${sup(m)} = ${money(r2(v))}`]);
  },
  savingsGoal() {
    const goal = rnd(10, 100) * 100 * K(), per = rnd(5, 40) * 10 * K(), months = Math.ceil(goal / per);
    return NP(`You want to save ${money(goal)}. You save ${money(per)} a month. How many months until you reach it?`, months, 'Divide, and round UP: a part month still counts.', [`${goal} ÷ ${per} = ${r2(goal / per)}`, `→ ${months} months`]);
  },
  salesTax() {
    const tx = tax(), p = (rnd(5, 200) + pick([0, .99, .5])) * K(), withTax = p * (1 + tx.rate / 100);
    if (Math.random() < .5) return NPt(`A price is ${money(p)} before ${tx.name} of ${tx.rate}%. What do you pay? ${cents}`, withTax, .01, `× ${1 + tx.rate / 100}.`, [`${p} × ${1 + tx.rate / 100} = ${money(r2(withTax))}`]);
    const inc = rnd(10, 300) * K() * (1 + tx.rate / 100); return NPt(`A price of ${money(r2(inc))} includes ${tx.rate}% ${tx.name}. What was the price before ${tx.name}? ${cents}`, inc / (1 + tx.rate / 100), .01, `Divide by ${1 + tx.rate / 100} (do not just take ${tx.rate}% off).`, [`${r2(inc)} ÷ ${1 + tx.rate / 100} = ${money(r2(inc / (1 + tx.rate / 100)))}`]);
  },
  // ================= Work tests =================
  dataInterp() {
    const yrs = [2022, 2023, 2024, 2025], s = [rnd(20, 60) * 10]; for (let i = 1; i < 4; i++) s.push(Math.round(s[i - 1] * (1 + pick([-10, 5, 10, 20, 25]) / 100)));
    const T = tbl(['Year', ...yrs], [['Sales (units)', ...s]]), i = rnd(0, 2), ch = (s[i + 1] - s[i]) / s[i] * 100;
    if (Math.random() < .5) return NPt(`${T}What was the percentage change from ${yrs[i]} to ${yrs[i + 1]}? Round to 1 decimal place (use − for a fall).`, ch, .1, 'Change ÷ earlier year × 100.', [`(${s[i + 1]} − ${s[i]}) ÷ ${s[i]} × 100 = ${r1(ch)}%`]);
    const tot = s.reduce((a, b) => a + b); return NPt(`${T}What is the mean yearly sales figure? Round to 1 decimal place.`, tot / 4, .1, 'Add all four years and divide by 4.', [`${tot} ÷ 4 = ${tot / 4}`, ...(tot % 4 ? [`≈ ${Math.round(tot / 4 * 10) / 10}`] : [])]);
  },
  inverseProp() {
    const w = rnd(2, 8), d = rnd(2, 12), w2 = pick([...Array(10).keys()].map(x => x + 1).filter(x => x > 1 && x !== w && (w * d) % x === 0));
    if (!w2) return GEN_ADULT.inverseProp();
    return NP(`${w} workers can finish a job in ${d} days. How many days would ${w2} workers take (same speed)?`, w * d / w2, 'Find the total work (worker-days) first.', [`${w} × ${d} = ${w * d} worker-days`, `÷ ${w2} = ${w * d / w2} days`]);
  },
  hardSeq() {
    const k = pick(['mul', 'sq', 'alt', 'fib']);
    if (k === 'mul') { const a = rnd(1, 5), m = rnd(2, 3), c = rnd(-3, 3); const s = [a]; for (let i = 0; i < 5; i++) s.push(s[i] * m + c); return NP(`What comes next? ${E(s.slice(0, 5).join(', ') + ', …')}`, s[5], 'Look at how each term is made from the one before.', [`Each term × ${m} ${c < 0 ? '− ' + -c : '+ ' + c}`, `${s[4]} × ${m} ${c < 0 ? '− ' + -c : '+ ' + c} = ${s[5]}`], { neg: true }); }
    if (k === 'sq') { const a = rnd(1, 6), c = rnd(-2, 3), s = Array.from({ length: 6 }, (_, i) => (a + i) ** 2 + c); return NP(`What comes next? ${E(s.slice(0, 5).join(', ') + ', …')}`, s[5], 'Compare with square numbers.', [`These are n² ${c < 0 ? '− ' + -c : '+ ' + c}`, `${a + 5}² ${c < 0 ? '− ' + -c : '+ ' + c} = ${s[5]}`]); }
    if (k === 'alt') { const a = rnd(2, 9), p = rnd(2, 6), q = rnd(1, 4), s = [a]; for (let i = 0; i < 6; i++) s.push(i % 2 ? s[i] - q : s[i] + p); return NP(`What comes next? ${E(s.slice(0, 6).join(', ') + ', …')}`, s[6], 'Two different steps take turns.', [`+${p}, −${q}, +${p}, …`, `${s[5]} ${5 % 2 ? '− ' + q : '+ ' + p} = ${s[6]}`]); }
    const a = rnd(1, 4), b = rnd(2, 6), s = [a, b]; for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]); return NP(`What comes next? ${E(s.slice(0, 6).join(', ') + ', …')}`, s[6], 'Each term is the sum of the two before.', [`${s[4]} + ${s[5]} = ${s[6]}`]);
  },
  // ================= University =================
  dotProduct() {
    const a = [rnd(-5, 6), rnd(-5, 6), rnd(-5, 6)], b = [rnd(-5, 6), rnd(-5, 6), rnd(-5, 6)], d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], V = v => `(${v.join(', ')})`;
    if (Math.random() < .6) return NP(`Find ${E(`${V(a)} · ${V(b)}`)}`, d, 'Multiply matching parts and add.', [`${a.map((x, i) => `${x}×${b[i]}`).join(' + ')} = ${d}`], { neg: true });
    if (!b[0] && !b[1]) b[0] = 3;
    const c = [b[1], -b[0], 0]; const k = rnd(-4, 4) || 2; const v2 = [k * c[0], k * c[1], 0];
    return MC(`Are ${E(V([b[0], b[1], 0]))} and ${E(V(v2))} perpendicular?`, 'Yes: the dot product is 0', ['No: the dot product is not 0', 'Only if they have the same length', 'Cannot tell without the angle'], 'Two vectors are perpendicular exactly when their dot product is 0.', [`${b[0]}×${v2[0]} + ${b[1]}×${v2[1]} + 0 = 0`]);
  },
  matInverse() {
    const A = pick([[[2, 1], [1, 1]], [[3, 2], [1, 1]], [[1, 2], [1, 3]], [[5, 2], [2, 1]], [[4, 3], [1, 1]], [[2, 5], [1, 3]], [[3, 1], [5, 2]]]), det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const inv = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]].map(r => r.map(v => v + 0));
    return MC(`Find the inverse of ${M2(A)}`, M2(inv), [M2([[A[1][1], A[0][1]], [A[1][0], A[0][0]]]), M2([[-A[1][1], A[0][1]], [A[1][0], -A[0][0]]]), M2([[A[0][0], -A[0][1]], [-A[1][0], A[1][1]]])], 'Swap a and d, change the signs of b and c, divide by the determinant.', [`det = ${det}`, 'inverse = (1/det) × [d −b; −c a]'], { html: true });
  },
  eigen() {
    const p = rnd(-3, 5), q = rnd(-3, 6), b = rnd(1, 5), sym = Math.random() < .5;
    if (!sym || p === q) { const A = [[p, b], [0, q]]; return MC(`Find the eigenvalues of ${M2(A)}`, `${Math.min(p, q)} and ${Math.max(p, q)}`, [`${p + b} and ${q}`, `${p} and ${b}`, `${p + q} and ${p * q}`], 'For a triangular matrix, the eigenvalues are on the diagonal.', [`det(A − λI) = (${p} − λ)(${q} − λ) = 0`, `λ = ${p}, ${q}`], { html: true }); }
    const s = rnd(1, 4), d = rnd(-2, 4), A = [[d, s], [s, d]]; return MC(`Find the eigenvalues of ${M2(A)}`, `${d - s} and ${d + s}`, [`${d} and ${s}`, `${d - s} and ${d * s}`, `${-d - s} and ${s - d}`], 'Solve det(A − λI) = 0.', [`(${d} − λ)² − ${s * s} = 0`, `λ = ${d} ± ${s}`, `${d - s} and ${d + s}`], { html: true });
  },
  setsLogic() {
    const k = pick(['union', 'truth', 'imp', 'demorgan']);
    if (k === 'union') { const a = rnd(10, 40), b = rnd(10, 40), both = rnd(2, Math.min(a, b) - 1); return NP(`|A| = ${a}, |B| = ${b}, |A ∩ B| = ${both}. Find |A ∪ B|.`, a + b - both, 'Add both, then take away the overlap you counted twice.', [`${a} + ${b} − ${both} = ${a + b - both}`]); }
    const p = Math.random() < .5, q = Math.random() < .5, B = v => v ? 'True' : 'False';
    if (k === 'truth') { const op = pick(['∧', '∨', '⊕']), v = op === '∧' ? p && q : op === '∨' ? p || q : p !== q; return MC(`p is ${B(p)} and q is ${B(q)}. What is ${E(`p ${op} q`)}?`, B(v), [B(!v)], '∧ = and, ∨ = or, ⊕ = exactly one.', [`${B(p)} ${op} ${B(q)} = ${B(v)}`]); }
    if (k === 'imp') { const v = !p || q; return MC(`p is ${B(p)} and q is ${B(q)}. What is ${E('p → q')}?`, B(v), [B(!v)], '"If p then q" is only false when p is true and q is false.', [`${B(p)} → ${B(q)} = ${B(v)}`]); }
    return MC(`Which is the same as ${E('¬(p ∧ q)')}?`, '¬p ∨ ¬q', ['¬p ∧ ¬q', 'p ∨ q', '¬p ∧ q'], "De Morgan's law: the NOT goes inside and ∧ becomes ∨.", ['¬(p ∧ q) = ¬p ∨ ¬q']);
  },
  modArith() {
    const k = pick(['mod', 'prod', 'last', 'clock']);
    if (k === 'mod') { const n = rnd(3, 12), a = rnd(20, 200); return NP(`What is ${E(`${a} mod ${n}`)}?`, a % n, 'The remainder when you divide.', [`${a} = ${Math.floor(a / n)} × ${n} + ${a % n}`]); }
    if (k === 'prod') { const n = rnd(5, 11), a = rnd(10, 99), b = rnd(10, 99); return NP(`What is ${E(`(${a} × ${b}) mod ${n}`)}?`, (a * b) % n, `Reduce each number mod ${n} first.`, [`${a} mod ${n} = ${a % n}, ${b} mod ${n} = ${b % n}`, `${a % n} × ${b % n} = ${(a % n) * (b % n)} → mod ${n} = ${(a * b) % n}`]); }
    if (k === 'last') { const b = pick([2, 3, 7, 9]), e = rnd(10, 60), cyc = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 7: [7, 9, 3, 1], 9: [9, 1] }[b]; const d = cyc[(e - 1) % cyc.length]; return NP(`What is the last digit of ${E(`${b}${sup(e)}`)}?`, d, 'Last digits repeat in a cycle.', [`cycle: ${cyc.join(', ')}`, `${e} → position ${(e - 1) % cyc.length + 1} → ${d}`]); }
    const now = rnd(0, 23), add = rnd(25, 200); return NP(`It is ${now}:00 now. What hour will it be in ${add} hours (24-hour clock)?`, (now + add) % 24, 'Work mod 24.', [`(${now} + ${add}) mod 24 = ${(now + add) % 24}`]);
  },
  bases() {
    const k = pick(['b2d', 'd2b', 'hex', 'd2h']);
    if (k === 'b2d') { const n = rnd(5, 255); return NP(`Convert ${E(n.toString(2) + '₂')} to decimal.`, n, 'Each place is worth double the one to its right.', [`${n.toString(2)}₂ = ${n}`]); }
    if (k === 'd2b') { const n = rnd(5, 127); return NP(`Convert ${n} to binary (type the 0s and 1s).`, Number(n.toString(2)), 'Keep dividing by 2 and read the remainders upwards.', [`${n} = ${n.toString(2)}₂`]); }
    if (k === 'hex') { const n = rnd(16, 255); return NP(`Convert ${E(n.toString(16).toUpperCase() + '₁₆')} to decimal.`, n, 'Hex digits: A = 10 … F = 15; places are 16s and 1s.', [`${n.toString(16).toUpperCase()} = ${Math.floor(n / 16)} × 16 + ${n % 16} = ${n}`]); }
    const n = rnd(16, 255), hx = n.toString(16).toUpperCase(); return MC(`Convert ${n} to hexadecimal.`, hx, [(n + 1).toString(16).toUpperCase(), (n % 16).toString(16).toUpperCase() + Math.floor(n / 16).toString(16).toUpperCase(), String(n)], 'Divide by 16: quotient and remainder.', [`${n} = ${Math.floor(n / 16)} × 16 + ${n % 16}`, `= ${hx}₁₆`]);
  },
  graphTheory() {
    const deg = Array.from({ length: rnd(4, 6) }, () => rnd(1, 5)); if (deg.reduce((a, b) => a + b) % 2) deg[0]++;
    const E2 = deg.reduce((a, b) => a + b) / 2, odd = deg.filter(d => d % 2).length, k = pick(['edges', 'euler']);
    if (k === 'edges') return NP(`A graph has vertices with degrees ${E(deg.join(', '))}. How many edges does it have?`, E2, 'Each edge adds 1 to the degree of two vertices.', [`sum of degrees = ${E2 * 2}`, `edges = ${E2 * 2} ÷ 2 = ${E2}`]);
    const ans = odd === 0 ? 'Yes, and it can start and end at the same vertex' : odd === 2 ? 'Yes, starting and ending at the two odd vertices' : 'No';
    return MC(`A connected graph has vertex degrees ${E(deg.join(', '))}. Can you travel every edge exactly once?`, ans, ['Yes, and it can start and end at the same vertex', 'Yes, starting and ending at the two odd vertices', 'No'].filter(x => x !== ans), 'Count the vertices with odd degree: 0 or 2 → yes; more → no.', [`odd-degree vertices: ${odd}`]);
  },
  series() {
    const a = rnd(1, 9), q = pick([2, 3, 4, 5]), sgn = Math.random() < .3 ? -1 : 1, r = sgn / q, S = a / (1 - r);
    const terms = `${a} ${sgn < 0 ? '−' : '+'} ${frac(a, q)} + ${frac(a, q * q)} ${sgn < 0 ? '−' : '+'} …`;
    return MC(`Find the sum to infinity of ${E(terms)}`, frac(a * q, q - sgn), [frac(a * q, q + sgn), frac(a, q - 1), String(a * q)], 'S = a ÷ (1 − r), when −1 < r < 1.', [`r = ${frac(sgn, q)}`, `${a} ÷ (1 − ${frac(sgn, q)}) = ${frac(a * q, q - sgn)}`]);
  },
  diffEq() {
    const k = pick(['form', 'value', 'double']);
    const A = rnd(2, 9) * 10, kk = pick([.1, .2, .5, 1]), ky = (v, s = 'y') => `${kk === 1 ? '' : kk}${s}`;
    if (k === 'form') return MC(`Solve ${E(`dy/dt = ${ky()}`)} with ${E(`y(0) = ${A}`)}.`, `y = ${A}e^(${ky(0, 't')})`, [`y = ${A} + ${ky(0, 't')}`, `y = ${kk}e^(${A}t)`, `y = ${A}t^${kk}`], 'Separate: dy/y = k dt, integrate, use the starting value.', [`ln y = ${ky(0, 't')} + c`, `y = ${A}e^(${ky(0, 't')})`]);
    if (k === 'value') { const t = rnd(1, 5); return NPt(`${E(`dy/dt = ${ky()}`)}, ${E(`y(0) = ${A}`)}. Find y when t = ${t}, to 1 decimal place.`, A * Math.exp(kk * t), .1, 'y = y(0) × e^(kt).', [`${A} × e^(${r2(kk * t)}) = ${r1(A * Math.exp(kk * t))}`]); }
    return NPt(`A population follows ${E(`dP/dt = ${ky(0, 'P')}`)}. How long does it take to double? Round to 2 decimal places.`, Math.log(2) / kk, .01, 'Doubling time = ln 2 ÷ k.', [`ln 2 ÷ ${kk} = ${r2(Math.log(2) / kk)}`]);
  },
  expectation() {
    const xs = [0, 1, 2, 3], ps = shuffle([.1, .2, .3, .4]), ex = xs.reduce((s, x, i) => s + x * ps[i], 0), k = Math.random() < .6 ? 'E' : 'V';
    const T = tbl(['x', ...xs], [['P(X = x)', ...ps]]);
    if (k === 'E') return NPt(`${T}Find E(X).`, ex, .001, 'E(X) = Σ x × P(x).', [xs.map((x, i) => `${x}×${ps[i]}`).join(' + ') + ` = ${r2(ex)}`]);
    const ex2 = xs.reduce((s, x, i) => s + x * x * ps[i], 0), v = ex2 - ex * ex; return NPt(`${T}Find Var(X). Round to 2 decimal places.`, v, .01, 'Var(X) = E(X²) − (E(X))².', [`E(X) = ${r2(ex)}, E(X²) = ${r2(ex2)}`, `${r2(ex2)} − ${r2(ex)}² = ${r2(v)}`]);
  },
  confInt() {
    const mean = rnd(40, 90), sd = pick([5, 8, 10, 12, 15]), n = pick([25, 36, 49, 64, 100]), se = sd / Math.sqrt(n), m = 1.96 * se, lo = r1(mean - m), hi = r1(mean + m);
    return MC(`A sample of ${n} has mean ${mean} and population standard deviation ${sd}. What is the 95% confidence interval for the mean (1 d.p.)?`, `${lo} to ${hi}`, [`${r1(mean - 1.96 * sd)} to ${r1(mean + 1.96 * sd)}`, `${r1(mean - se)} to ${r1(mean + se)}`, `${r1(mean - 1.645 * se)} to ${r1(mean + 1.645 * se)}`], 'mean ± 1.96 × σ/√n.', [`σ/√n = ${sd}/${Math.sqrt(n)} = ${r2(se)}`, `1.96 × ${r2(se)} = ${r2(m)}`, `${mean} ± ${r2(m)} → ${lo} to ${hi}`]);
  },
  integrationTech() {
    const k = pick(['sub', 'parts', 'exp']), n = rnd(2, 5), c = rnd(1, 6);
    if (k === 'sub') return MC(`Find ${E(`∫ 2x(x² + ${c})${sup(n)} dx`)}`, `(x² + ${c})${sup(n + 1)}/${n + 1} + c`, [`(x² + ${c})${sup(n + 1)} + c`, `2(x² + ${c})${sup(n + 1)}/${n + 1} + c`, `x²(x² + ${c})${sup(n)} + c`], `Let u = x² + ${c}; then du = 2x dx.`, [`∫ u${sup(n)} du = u${sup(n + 1)}/${n + 1}`, `= (x² + ${c})${sup(n + 1)}/${n + 1} + c`]);
    if (k === 'parts') return MC(`Find ${E('∫ x eˣ dx')}`, 'xeˣ − eˣ + c', ['xeˣ + eˣ + c', 'x²eˣ/2 + c', 'eˣ + c'], 'Integration by parts: u = x, dv = eˣ dx.', ['∫ x eˣ dx = x eˣ − ∫ eˣ dx', '= xeˣ − eˣ + c']);
    const a = rnd(2, 6); return MC(`Find ${E(`∫ e^(${a}x) dx`)}`, `e^(${a}x)/${a} + c`, [`${a}e^(${a}x) + c`, `e^(${a}x) + c`, `e^(${a}x + 1)/(${a}x + 1) + c`], 'Divide by the number in front of x.', [`∫ e^(${a}x) dx = e^(${a}x)/${a} + c`]);
  },
  euclid() {
    const g = rnd(2, 15), a = g * rnd(5, 40), b = g * rnd(5, 40), G = gcd(a, b);
    if (Math.random() < .6) return NP(`Use Euclid's algorithm to find ${E(`gcd(${a}, ${b})`)}.`, G, 'Divide the bigger by the smaller; repeat with the remainder until it is 0.', (() => { let x = Math.max(a, b), y = Math.min(a, b); const s = []; while (y) { s.push(`${x} = ${Math.floor(x / y)} × ${y} + ${x % y}`); [x, y] = [y, x % y]; } s.push(`gcd = ${x}`); return s; })());
    const L = a * b / G; return NP(`Find ${E(`lcm(${a}, ${b})`)}.`, L, 'lcm = a × b ÷ gcd.', [`gcd = ${G}`, `${a} × ${b} ÷ ${G} = ${L}`]);
  }
};
