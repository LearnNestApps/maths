// Reasoning (mental ability) generators: the reasoning topics used in the
// Maharashtra scholarship Intelligence Test and the NMMS Mental Ability Test. All original questions.
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { GEN } from './generators.js';
import { isIndia } from '../core/region.js';

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', L = i => AZ[((i % 26) + 26) % 26], pos = ch => AZ.indexOf(ch);
const shift = (w, k) => [...w].map(c => L(pos(c) + k)).join('');
const E = s => `<span class="expr">${s}</span>`;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DIRS = ['North', 'East', 'South', 'West'];
const WORDS3 = ['CAT', 'DOG', 'PEN', 'SUN', 'BAG', 'CUP', 'HAT', 'BOX', 'MAP', 'JAR', 'KEY', 'FAN'];
const WORDS4 = ['BOOK', 'MILK', 'FISH', 'TREE', 'DESK', 'KITE', 'LAMP', 'BELL', 'NEST', 'RAIN'];
// Four-option MCQ from distinct text options.
function mc(prompt, right, wrongs, hint, solution, extra = {}) {
  const opts = shuffle([right, ...[...new Set(wrongs)].filter(w => w !== right).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(right), data: { options: opts, ...extra }, hint, solution: [].concat(solution) };
}
const numMc = (prompt, ans, lo, hi, hint, solution) => mc(prompt, String(ans), choices(ans, 4, lo, hi).map(String), hint, solution);

export const GEN_REASON = {
  letterSeries() {
    const kind = pick(['step', 'step', 'alt', 'grow']), a = rnd(0, 10); let s = [];
    if (kind === 'step') { const d = rnd(1, 4); s = [0, 1, 2, 3, 4].map(i => a + d * i); }
    if (kind === 'alt') { const p = rnd(2, 4), q = rnd(1, 2); s = [a]; for (let i = 1; i < 5; i++) s.push(s[i - 1] + (i % 2 ? p : -q)); }
    if (kind === 'grow') { s = [a]; for (let i = 1; i < 5; i++) s.push(s[i - 1] + i); }
    const ans = L(s[4]), shown = s.slice(0, 4).map(L).join(', ');
    return mc(`${'What comes next?'} ${E(shown + ', ?')}`, ans, [L(s[4] + 1), L(s[4] - 1), L(s[4] + 2), L(s[3] + 1)], 'Write the alphabet positions (A = 1, B = 2…) and look at the jumps.', [s.slice(0, 5).map(i => `${L(i)}(${(i % 26 + 26) % 26 + 1})`).join(' → ')]);
  },
  analogyNum() {
    const rules = [['square', x => x * x, 'x × x'], ['cube', x => x ** 3, 'x × x × x'], ['times', null, ''], ['plus', null, '']];
    let [name, f, desc] = pick(rules), k = rnd(2, 9);
    if (name === 'times') { f = x => x * k; desc = `× ${k}`; } if (name === 'plus') { f = x => x + k; desc = `+ ${k}`; }
    const a = rnd(2, name === 'cube' ? 6 : 12), b = rnd(2, name === 'cube' ? 9 : 15); if (a === b) return GEN_REASON.analogyNum();
    return numMc(`${E(`${a} : ${f(a)} :: ${b} : ?`)}`, f(b), Math.max(1, f(b) - 20), f(b) + 20, `How did ${a} become ${f(a)}? Do the same to ${b}.`, [`${a} → ${f(a)} is ${desc.replace(/x/g, a)}`, `${b} → ${f(b)}`]);
  },
  analogyLetter() {
    const k = rnd(1, 4), a = rnd(0, 18), b = rnd(0, 18), w = s => L(s) + L(s + 1);
    const p = w(a), q = shift(p, k), r = w(b), ans = shift(r, k);
    return mc(`${E(`${p} : ${q} :: ${r} : ?`)}`, ans, [shift(r, k + 1), shift(r, k - 1), shift(r, -k), L(b + k) + L(b + k)], `Count how many letters each letter moves from ${p} to ${q}.`, [`Each letter moves ${k} forward: ${r} → ${ans}`]);
  },
  oddGroup() {
    const d = rnd(1, 3), starts = shuffle([...Array(20).keys()]).slice(0, 4), odd = rnd(0, 3);
    const groups = starts.map((s, i) => i === odd ? L(s) + L(s + d) + L(s + d + rnd(1, 2) + d) : L(s) + L(s + d) + L(s + 2 * d));
    return mc('Which group of letters is the odd one out?', groups[odd], groups.filter((_, i) => i !== odd), `In three groups, the letters jump by the same amount.`, [`The others jump by ${d} each time; ${groups[odd]} does not.`]);
  },
  coding() {
    const kind = pick(['shift', 'shift', 'reverse', 'number']);
    if (kind === 'shift') {
      const k = pick([1, 2, -1, 3]), [w1, w2] = shuffle(WORDS3).slice(0, 2), ans = shift(w2, k);
      return mc(`If ${E(w1)} is written as ${E(shift(w1, k))}, how is ${E(w2)} written?`, ans, [shift(w2, k + 1), shift(w2, -k), shift(w2, k - 1 || 2), [...ans].reverse().join('')], 'Compare each letter with its code letter. How far does it move?', [`Each letter moves ${Math.abs(k)} ${k > 0 ? 'forward' : 'back'}: ${w2} → ${ans}`]);
    }
    if (kind === 'reverse') {
      const [w1, w2] = shuffle(WORDS4).slice(0, 2), rev = w => [...w].reverse().join(''), ans = rev(w2);
      return mc(`If ${E(w1)} is written as ${E(rev(w1))}, how is ${E(w2)} written?`, ans, [shift(w2, 1), rev(shift(w2, 1)), w2.slice(1) + w2[0]], 'Look at the order of the letters.', [`The letters are written backwards: ${ans}`]);
    }
    const [w1, w2] = shuffle(WORDS3).slice(0, 2), sum = w => [...w].reduce((s, c) => s + pos(c) + 1, 0);
    return numMc(`If A = 1, B = 2, C = 3 … and ${E(w1)} = ${sum(w1)}, what is ${E(w2)}?`, sum(w2), Math.max(3, sum(w2) - 10), sum(w2) + 10, 'Add up the alphabet positions of the letters.', [`${[...w2].map(c => `${c}=${pos(c) + 1}`).join(', ')} → ${sum(w2)}`]);
  },
  alphabetPos() {
    const kind = pick(['right', 'left', 'position', 'middle']);
    if (kind === 'position') { const i = rnd(0, 25); return numMc(`What is the position of ${E(L(i))} in the alphabet?`, i + 1, 1, 26, 'Count from A = 1. Tip: E = 5, J = 10, O = 15, T = 20.', [`${L(i)} = ${i + 1}`]); }
    if (kind === 'middle') { const a = rnd(0, 14), gap = 2 * rnd(2, 5), m = a + gap / 2; return mc(`Which letter is exactly in the middle of ${E(L(a))} and ${E(L(a + gap))}?`, L(m), [L(m + 1), L(m - 1), L(m + 2)], 'Count the letters between them and take half.', [`${L(a)}…${L(m)}…${L(a + gap)}`]); }
    const k = rnd(2, 7), a = kind === 'right' ? rnd(0, 25 - k) : rnd(k, 25), ans = L(kind === 'right' ? a + k : a - k);
    return mc(`Which letter is ${k}${['th', 'st', 'nd', 'rd'][k] || 'th'} to the ${kind} of ${E(L(a))}?`, ans, [L(pos(ans) + 1), L(pos(ans) - 1), L(kind === 'right' ? a - k : a + k)], `Count ${k} letters ${kind === 'right' ? 'forward (towards Z)' : 'back (towards A)'}.`, [`${L(a)} → ${ans}`]);
  },
  directions() {
    if (Math.random() < .5) {
      let f = rnd(0, 3); const start = DIRS[f], turns = Array.from({ length: rnd(2, 3) }, () => pick(['right', 'left', 'right', 'back']));
      turns.forEach(tn => f = (f + (tn === 'right' ? 1 : tn === 'left' ? 3 : 2)) % 4);
      const txt = turns.map(tn => tn === 'back' ? 'turns around' : `turns ${tn}`).join(', then ');
      return mc(`Asha faces ${start}. She ${txt}. Which way is she facing now?`, DIRS[f], DIRS.filter(d => d !== DIRS[f]), 'Right turn = clockwise (N → E → S → W). Left = the other way.', [`${start} → ${DIRS[f]}`]);
    }
    const a = pick([0, 2]), b = pick([1, 3]), x = rnd(2, 9), y = rnd(2, 9);
    const ns = a === 0 ? 'North' : 'South', ew = b === 1 ? 'East' : 'West', ans = ns + '-' + ew;
    return mc(`Raj walks ${x} km ${ns}, then ${y} km ${ew}. In which direction is he from where he started?`, ans, [`${ns === 'North' ? 'South' : 'North'}-${ew}`, `${ns}-${ew === 'East' ? 'West' : 'East'}`, ns, ew].map(String), 'Draw it: one walk up or down, one walk across.', [`He is ${ns} and ${ew} of the start: ${ans}`]);
  },
  ranking() {
    if (Math.random() < .5) { const l = rnd(4, 18), r = rnd(4, 18); return numMc(`In a row of children, Meera is ${l}th from the left and ${r}th from the right. How many children are in the row?`, l + r - 1, l + r - 4, l + r + 3, 'Add both positions, then take 1 away (Meera is counted twice).', [`${l} + ${r} − 1 = ${l + r - 1}`]); }
    const n = rnd(20, 45), l = rnd(3, n - 3); return numMc(`There are ${n} students in a line. Kabir is ${l}th from the front. What is his position from the back?`, n - l + 1, n - l - 3, n - l + 4, 'Position from the back = total − position from the front + 1.', [`${n} − ${l} + 1 = ${n - l + 1}`]);
  },
  calendar() {
    if (Math.random() < .5) { const d = rnd(0, 6), n = rnd(8, 30), ans = DAYS[(d + n - 1) % 7]; return mc(`If the 1st of a month is a ${DAYS[d]}, what day is the ${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}?`, ans, DAYS.filter(x => x !== ans).sort(() => Math.random() - .5), 'The same day comes back every 7 days: 1st, 8th, 15th, 22nd, 29th.', [`${n} − 1 = ${n - 1} days later; ${n - 1} ÷ 7 leaves ${(n - 1) % 7}`, ans]); }
    const d = rnd(0, 6), n = rnd(8, 60), ans = DAYS[(d + n) % 7];
    return mc(`Today is ${DAYS[d]}. What day will it be after ${n} days?`, ans, DAYS.filter(x => x !== ans).sort(() => Math.random() - .5), 'Divide the days by 7 and use the remainder.', [`${n} ÷ 7 = ${Math.floor(n / 7)} weeks, remainder ${n % 7}`, ans]);
  },
  clockAngle() {
    if (Math.random() < .6) { const hr = rnd(1, 11), a = Math.min(30 * hr, 360 - 30 * hr); return numMc(`What is the smaller angle between the hands of a clock at ${hr} o'clock?`, a, 0, 180, 'Each hour mark is 30° apart (360° ÷ 12).', [`${Math.min(hr, 12 - hr)} × 30° = ${a}°`]); }
    const hr = rnd(1, 11), m = pick([0, 30]), rh = m ? (11 - hr + 12) % 12 || 12 : (12 - hr) % 12 || 12, rm = m ? 30 : 0, fmt = (h, mm) => `${h}:${String(mm).padStart(2, '0')}`;
    return mc(`A clock seen in a mirror shows ${fmt(hr, m)}. What is the real time?`, fmt(rh, rm), [fmt(hr, m), fmt((rh % 12) + 1, rm), fmt(rh, rm ? 0 : 30)], 'Mirror time + real time = 12:00 (or 11:60).', [`12:00 − ${fmt(hr, m)} = ${fmt(rh, rm)}`]);
  },
  mirrorWord() {
    const w = pick(WORDS4), water = Math.random() < .35, cls = water ? 'flipy' : 'flipx';
    const opts = { [cls]: `<span class="mw ${cls}">${w}</span>`, plain: `<span class="mw">${[...w].reverse().join('')}</span>`, other: `<span class="mw ${water ? 'flipx' : 'flipy'}">${w}</span>`, rot: `<span class="mw rot">${w}</span>` };
    return mc(`Which is the ${water ? 'water image (reflection below)' : 'mirror image (mirror on the right)'} of ${E(w)}?`, opts[cls], [opts.plain, opts.other, opts.rot], water ? 'A water image turns the word upside down but keeps left and right.' : 'A mirror image keeps top and bottom but swaps left and right.', [water ? 'Flipped top to bottom' : 'Flipped left to right'], { html: true });
  },
  countFigures() {
    const kind = pick(['grid', 'fan', 'strip']); let svg, ans, how;
    if (kind === 'grid') { const n = rnd(2, 3); ans = n === 2 ? 5 : 14; how = n === 2 ? '4 small + 1 big = 5' : '9 small + 4 medium + 1 big = 14'; svg = `<svg viewBox="0 0 120 120" class="fig"><g fill="none" stroke="currentColor" stroke-width="3">${Array.from({ length: n + 1 }, (_, i) => `<path d="M${10 + i * 100 / n} 10V110M10 ${10 + i * 100 / n}H110"/>`).join('')}</g></svg>`; return numMc(`How many squares are in this figure? ${svg}`, ans, 1, 20, 'Count the small squares, then the bigger squares made of several small ones.', [how]); }
    if (kind === 'fan') { const m = rnd(1, 3), k = m + 1; ans = k * (k + 1) / 2; svg = `<svg viewBox="0 0 120 110" class="fig"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M60 8 110 100H10z"/>${Array.from({ length: m }, (_, i) => `<path d="M60 8 ${10 + 100 * (i + 1) / k} 100"/>`).join('')}</g></svg>`; return numMc(`How many triangles are in this figure? ${svg}`, ans, 1, 15, 'Count single triangles, then triangles made of 2, 3… pieces next to each other.', [`${k} small pieces → ${Array.from({ length: k }, (_, i) => k - i).join(' + ')} = ${ans}`]); }
    const k = rnd(3, 5); ans = k * (k + 1) / 2; svg = `<svg viewBox="0 0 130 50" class="fig"><g fill="none" stroke="currentColor" stroke-width="3"><rect x="5" y="5" width="120" height="40"/>${Array.from({ length: k - 1 }, (_, i) => `<path d="M${5 + 120 * (i + 1) / k} 5v40"/>`).join('')}</g></svg>`;
    return numMc(`How many rectangles are in this figure? ${svg}`, ans, 1, 20, 'Count rectangles made of 1 piece, 2 pieces next to each other, 3 pieces…', [`${Array.from({ length: k }, (_, i) => k - i).join(' + ')} = ${ans}`]);
  },
  missingFigure() {
    const rule = pick(['sum', 'prod']), sets = Array.from({ length: 3 }, () => { const a = rnd(2, 9), b = rnd(2, 9); return [a, b, rnd(1, Math.min(9, a * b - 1))]; });
    const f = ([a, b, c]) => rule === 'sum' ? a + b + c : a * b - c, ans = f(sets[2]);
    const tri = (s, i) => `<svg viewBox="0 0 100 92" class="tri"><path d="M50 6 94 86H6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><g font-size="17" font-weight="800" text-anchor="middle" fill="currentColor"><text x="50" y="30">${s[0]}</text><text x="22" y="80">${s[1]}</text><text x="78" y="80">${s[2]}</text><text x="50" y="64" fill="var(--acc)">${i === 2 ? '?' : f(s)}</text></g></svg>`;
    return numMc(`Find the missing number. <span class="tris">${sets.map(tri).join('')}</span>`, ans, Math.max(0, ans - 10), ans + 10, 'Find one rule that works for the first two triangles.', [rule === 'sum' ? 'Middle = top + left + right' : 'Middle = top × left − right', `${rule === 'sum' ? sets[2].join(' + ') : `${sets[2][0]} × ${sets[2][1]} − ${sets[2][2]}`} = ${ans}`]);
  },
  relations() {
    const T = pick([
      ['Ravi is Meena\'s brother. Meena is Anil\'s daughter. How is Anil related to Ravi?', 'Father', ['Brother', 'Uncle', 'Grandfather']],
      ['Sita is the mother of Raju. Raju is the brother of Priya. How is Sita related to Priya?', 'Mother', ['Sister', 'Aunt', 'Grandmother']],
      ['Amit is the son of Mohan. Mohan is the brother of Kiran (a man). How is Kiran related to Amit?', 'Uncle', ['Father', 'Brother', 'Cousin']],
      ['Neha is the daughter of Suresh. Suresh is the son of Lata. How is Lata related to Neha?', 'Grandmother', ['Mother', 'Aunt', 'Sister']],
      ['Rohit\'s father is Vijay. Vijay\'s only sister is Asha. How is Asha related to Rohit?', 'Aunt', ['Mother', 'Sister', 'Grandmother']],
      ['Tara is the sister of Dev. Dev is the son of Ramesh. How is Tara related to Ramesh?', 'Daughter', ['Sister', 'Wife', 'Mother']],
      ['Om is the father of Jai. Jai is the father of Ved. How is Om related to Ved?', 'Grandfather', ['Father', 'Uncle', 'Brother']]
    ]);
    return mc(T[0], T[1], T[2], 'Draw a small family tree: parents above, children below.', [T[1]]);
  },
  intelligenceMock({ n = 25 } = {}) {
    const asQ = a => ({ stem: a.prompt, options: a.data.options, answer: a.answer, html: !!a.data.html });
    const take = (gens, k) => Array.from({ length: k }, () => asQ(GEN[pick(gens)]({ hard: true })));
    const per = Math.round(n / 5);
    const nm = 'Reasoning';
    return { template: 'mock', prompt: `${nm} practice test`, data: { title: `${nm} practice test · ${n} questions`, minutes: Math.round(n * 1.2), note: isIndia() ? 'Practice test: original questions on every reasoning topic, 1 mark each. Check the official pattern for your exam year.' : 'Practice test: original questions on every reasoning topic, 1 mark each.', sections: [
      { name: 'Series and analogies', marks: 1, qs: take(['seriesNext', 'letterSeries', 'analogyNum', 'analogyLetter'], per) },
      { name: 'Odd one out and coding', marks: 1, qs: take(['oddOneOut', 'oddGroup', 'coding', 'alphabetPos'], per) },
      { name: 'Directions, ranking, time', marks: 1, qs: take(['directions', 'ranking', 'calendar', 'clockAngle'], per) },
      { name: 'Figures', marks: 1, qs: take(['mirrorWord', 'countFigures', 'missingFigure'], per) },
      { name: 'Relations and mixed', marks: 1, qs: take(['relations', 'coding', 'seriesNext', 'calendar'], n - 4 * per) }] } };
  }
};
