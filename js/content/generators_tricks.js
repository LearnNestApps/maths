// Mental maths tricks. Each item walks through the trick as steps, ending with the answer.
import { rnd, pick } from '../core/ui.js';

const E = s => `<span class="expr">${s}</span>`;
const st = (html, answer) => ({ html, answer });
const T = (q, say, answer, steps, hint, solution) => ({ template: 'steps', prompt: E(q), say, answer, data: { steps }, hint, solution });

export const GEN_TRICKS = {
  roundAdjust() { // 19 + 6 → 20 + 5
    const a = rnd(1, 8) * 10 + pick([8, 9]), b = rnd(3, 9), up = 10 - (a % 10), r = Math.ceil(a / 10) * 10;
    return T(`${a} + ${b}`, `${a} plus ${b}`, a + b, [st(`${a} needs ? more to make ${r}`, up), st(`Take that from ${b}: ${b} − ${up} = ?`, b - up), st(`${r} + ${b - up} = ?`, a + b)],
      `Round ${a} up to ${r}, and take the same amount from ${b}.`, [`${a} + ${b} = ${r} + ${b - up} = ${a + b}`]);
  },
  makeTen() { // 8 + 5 → 8 + 2 + 3
    const a = rnd(6, 9), b = rnd(11 - a, 9), need = 10 - a;
    return T(`${a} + ${b}`, `${a} plus ${b}`, a + b, [st(`${a} + ? = 10`, need), st(`${b} − ${need} = ?`, b - need), st(`10 + ${b - need} = ?`, a + b)],
      `Use part of ${b} to fill ${a} up to 10.`, [`${a} + ${need} = 10, then 10 + ${b - need} = ${a + b}`]);
  },
  nearDoubles() { // 7 + 8 → 7 + 7 + 1
    const a = rnd(3, 12), b = a + 1;
    return T(`${a} + ${b}`, `${a} plus ${b}`, a + b, [st(`Double ${a}: ${a} + ${a} = ?`, a * 2), st(`${a * 2} + 1 = ?`, a + b)],
      `${b} is one more than ${a}. Double ${a}, then add 1.`, [`${a} + ${a} + 1 = ${a + b}`]);
  },
  addNine() { // 46 + 9 → 46 + 10 − 1
    const a = rnd(12, 89), nine = pick([9, 9, 19, 29]), ten = nine + 1;
    return T(`${a} + ${nine}`, `${a} plus ${nine}`, a + nine, [st(`${a} + ${ten} = ?`, a + ten), st(`${a + ten} − 1 = ?`, a + nine)],
      `Adding ${nine} is the same as adding ${ten} and taking 1 away.`, [`${a} + ${ten} − 1 = ${a + nine}`]);
  },
  subRound() { // 52 − 19 → 52 − 20 + 1
    const b = rnd(1, 6) * 10 + 9, a = rnd(b + 5, 99), r = b + 1;
    return T(`${a} − ${b}`, `${a} take away ${b}`, a - b, [st(`${a} − ${r} = ?`, a - r), st(`You took 1 too many, so add it back: ${a - r} + 1 = ?`, a - b)],
      `Take away ${r} (easy), then give back the extra 1.`, [`${a} − ${r} + 1 = ${a - b}`]);
  },
  countUp() { // 62 − 38: count up from 38
    const b = rnd(12, 58), a = rnd(b + 11, 99), r = Math.ceil(b / 10) * 10 === b ? b + 10 : Math.ceil(b / 10) * 10;
    return T(`${a} − ${b}`, `${a} take away ${b}`, a - b, [st(`From ${b} up to ${r} is ?`, r - b), st(`From ${r} up to ${a} is ?`, a - r), st(`${r - b} + ${a - r} = ?`, a - b)],
      `Count up from ${b} to ${a} in easy jumps.`, [`${b} → ${r} → ${a}: ${r - b} + ${a - r} = ${a - b}`]);
  },
  partition() { // 34 + 25 → 30 + 20, 4 + 5
    let a, b; do { a = rnd(12, 68); b = rnd(11, 89 - a); } while ((a % 10) + (b % 10) > 9 && Math.random() < .5);
    const t = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, o = (a % 10) + (b % 10);
    return T(`${a} + ${b}`, `${a} plus ${b}`, a + b, [st(`Tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ?`, t), st(`Ones: ${a % 10} + ${b % 10} = ?`, o), st(`${t} + ${o} = ?`, a + b)],
      'Add the tens, add the ones, then put them together.', [`${t} + ${o} = ${a + b}`]);
  },
  timesFive() { // 5 × 24 → 240 ÷ 2
    const n = rnd(6, 48) * (Math.random() < .7 ? 2 : 1);
    return T(`${n} × 5`, `${n} times 5`, n * 5, [st(`${n} × 10 = ?`, n * 10), st(`Half of ${n * 10} = ?`, n * 5)],
      '× 5 is the same as × 10, then halve.', [`${n} × 10 ÷ 2 = ${n * 5}`]);
  },
  doubleDouble() { // × 4 and × 8
    const n = rnd(11, 45), k = pick([4, 4, 8]);
    const steps = [st(`Double ${n} = ?`, n * 2), st(`Double ${n * 2} = ?`, n * 4)];
    if (k === 8) steps.push(st(`Double ${n * 4} = ?`, n * 8));
    return T(`${n} × ${k}`, `${n} times ${k}`, n * k, steps, `× ${k} is doubling ${k === 4 ? 'twice' : 'three times'}.`, [`${n} → ${n * 2} → ${n * 4}${k === 8 ? ' → ' + n * 8 : ''}`]);
  },
  nineFingers() { // 9 × k: tens = k − 1, ones = 10 − k
    const k = rnd(2, 10);
    return T(`9 × ${k}`, `9 times ${k}`, 9 * k, [st(`Fold finger ${k}. Fingers to its left: ${k} − 1 = ?`, k - 1), st(`Fingers to its right: 10 − ${k} = ?`, 10 - k), st(`So 9 × ${k} = ?`, 9 * k)],
      'Hold up 10 fingers. Fold down finger number k: left fingers are tens, right fingers are ones.', [`${k - 1} tens and ${10 - k} ones = ${9 * k}`]);
  },
  timesTwentyFive() { // × 25 → × 100 ÷ 4
    const n = rnd(2, 24) * 4 / pick([1, 1, 2]);
    return T(`${n} × 25`, `${n} times 25`, n * 25, [st(`${n} × 100 = ?`, n * 100), st(`${n * 100} ÷ 4 = ?`, n * 25)],
      '25 is a quarter of 100, so × 100 and divide by 4.', [`${n} × 100 ÷ 4 = ${n * 25}`]);
  },
  halveDouble() { // 16 × 5 → 8 × 10 ; 14 × 15 → 7 × 30
    const b = pick([5, 15, 25, 50]), a = rnd(3, 24) * 2, ha = a / 2, db = b * 2;
    return T(`${a} × ${b}`, `${a} times ${b}`, a * b, [st(`Halve ${a} = ?`, ha), st(`Double ${b} = ?`, db), st(`${ha} × ${db} = ?`, a * b)],
      `Halve one number and double the other: the answer stays the same, and ${db} is easier.`, [`${a} × ${b} = ${ha} × ${db} = ${a * b}`]);
  },
  times99() { // n × 99 → n × 100 − n
    const n = rnd(3, 48), m = pick([9, 99]);
    return T(`${n} × ${m}`, `${n} times ${m}`, n * m, [st(`${n} × ${m + 1} = ?`, n * (m + 1)), st(`${n * (m + 1)} − ${n} = ?`, n * m)],
      `${m} is one less than ${m + 1}. Multiply by ${m + 1}, then take away one ${n}.`, [`${n} × ${m + 1} − ${n} = ${n * m}`]);
  },
  percentTrick() { // 15% = 10% + 5%
    const n = rnd(2, 40) * 20, p = pick([10, 5, 15, 20, 25]);
    const steps = [st(`10% of ${n} = ?`, n / 10)];
    if (p === 5) steps.push(st(`5% is half of that = ?`, n / 20));
    if (p === 15) steps.push(st(`5% is half of 10% = ?`, n / 20), st(`10% + 5% = ?`, n * .15));
    if (p === 20) steps.push(st(`20% is double 10% = ?`, n / 5));
    if (p === 25) steps.push(st(`25% is a quarter: ${n} ÷ 4 = ?`, n / 4));
    return T(`${p}% of ${n}`, `${p} percent of ${n}`, n * p / 100, steps, 'Start with 10%: divide by 10. Build other percentages from it.', [`${p}% of ${n} = ${n * p / 100}`]);
  }
};
