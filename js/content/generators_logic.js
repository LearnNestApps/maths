// Logic & coding generators: Venn diagrams, logic gates, code reading, robot routes, ordering, binary.
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { vennSvg } from '../core/art_logic.js';

const SETS = [
  ['even', 'n % 2 == 0', n => n % 2 === 0], ['odd', 'n % 2 == 1', n => n % 2 === 1],
  ['multiple of 3', 'n % 3 == 0', n => n % 3 === 0], ['multiple of 5', 'n % 5 == 0', n => n % 5 === 0],
  ['more than 10', 'n > 10', n => n > 10], ['less than 15', 'n < 15', n => n < 15], ['multiple of 4', 'n % 4 == 0', n => n % 4 === 0]
];
const regionOf = (a, b, n) => a[2](n) && b[2](n) ? 'ab' : a[2](n) ? 'a' : b[2](n) ? 'b' : 'none';
function setPair() {
  for (;;) {
    const [a, b] = shuffle(SETS).slice(0, 2); if (a[0].replace('odd', 'even') === b[0].replace('odd', 'even')) continue;
    const pool = shuffle([...Array(30).keys()].map(i => i + 1)), got = { a: [], b: [], ab: [], none: [] };
    pool.forEach(n => got[regionOf(a, b, n)].push(n));
    if (Object.values(got).every(l => l.length)) return { a, b, got };
  }
}
const code = s => `<pre class="code">${s}</pre>`;
function mc(prompt, right, wrongs, hint, solution) {
  const opts = shuffle([String(right), ...[...new Set(wrongs.map(String))].filter(w => w !== String(right)).slice(0, 3)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(String(right)), data: { options: opts }, hint, solution: [].concat(solution) };
}

export const GEN_LOGIC = {
  vennSort({ k = 7 } = {}) {
    const { a, b, got } = setPair(), items = shuffle(['a', 'b', 'ab', 'none'].map(r => ({ v: got[r][0], region: r })).concat(shuffle(Object.entries(got).flatMap(([r, l]) => l.slice(1).map(v => ({ v, region: r })))).slice(0, k - 4)));
    return { template: 'venn', prompt: 'Drag each number into the right part of the Venn diagram.', answer: 'done', data: { la: a[0], lb: b[0], ca: a[1], cb: b[1], items },
      hint: 'Check both rules for each number. Both true → the middle. Neither → outside the circles.', solution: items.map(it => `${it.v} → ${{ a: 'A only', b: 'B only', ab: 'A AND B', none: 'neither' }[it.region]}`) };
  },
  vennRead() {
    const { a, b, got } = setPair(), items = Object.entries(got).flatMap(([r, l]) => shuffle(l).slice(0, rnd(1, 3)).map(v => ({ v, region: r })));
    const q = pick(['and', 'or', 'anotb', 'none']), cnt = { and: got => items.filter(i => i.region === 'ab').length, or: () => items.filter(i => i.region !== 'none').length, anotb: () => items.filter(i => i.region === 'a').length, none: () => items.filter(i => i.region === 'none').length }[q]();
    const words = { and: `<b>${a[0]} AND ${b[0]}</b>`, or: `<b>${a[0]} OR ${b[0]}</b>`, anotb: `<b>${a[0]} but NOT ${b[0]}</b>`, none: `<b>NOT ${a[0]} and NOT ${b[0]}</b>` }[q];
    const where = { and: 'the overlap in the middle', or: 'anywhere inside the circles', anotb: 'circle A, outside B', none: 'outside both circles' }[q];
    return mc(`How many numbers are ${words}? ${vennSvg(a[0], b[0], items, 'small')}`, cnt, choices(cnt, 4, 0, items.length).map(String), `Look in ${where}.`, [`${q.toUpperCase()} → ${where}: ${cnt}`]);
  },
  gateTable({ gates = ['AND', 'OR', 'NOT'] } = {}) {
    const g = pick(gates), what = { AND: 'AND: the lamp is ON only when A and B are both ON.', OR: 'OR: the lamp is ON when A or B (or both) is ON.', NOT: 'NOT: the lamp is the opposite of A.', XOR: 'XOR: ON when exactly one of A and B is ON.', NAND: 'NAND: the opposite of AND.', 'A AND NOT B': 'ON when A is ON and B is OFF.', 'NOT A OR B': 'ON unless A is ON and B is OFF.' }[g];
    return { template: 'gates', prompt: `${g} gate: will the lamp be ON or OFF?`, answer: 'done', data: { gate: g }, hint: what, solution: [what] };
  },
  codeIf() {
    const x = rnd(1, 20), lim = rnd(5, 15), kind = pick(['simple', 'and', 'or', 'elif']);
    let src, out, hint;
    if (kind === 'simple') { src = `x = ${x}\nif x > ${lim}:\n    print("big")\nelse:\n    print("small")`; out = x > lim ? 'big' : 'small'; hint = `Is ${x} > ${lim}?`; }
    if (kind === 'and') { src = `x = ${x}\nif x > ${lim} and x % 2 == 0:\n    print("yes")\nelse:\n    print("no")`; out = x > lim && x % 2 === 0 ? 'yes' : 'no'; hint = 'With "and", BOTH parts must be true.'; }
    if (kind === 'or') { src = `x = ${x}\nif x < ${lim} or x == 20:\n    print("yes")\nelse:\n    print("no")`; out = x < lim || x === 20 ? 'yes' : 'no'; hint = 'With "or", ONE true part is enough.'; }
    if (kind === 'elif') { src = `x = ${x}\nif x < 5:\n    print("small")\nelif x < 12:\n    print("medium")\nelse:\n    print("large")`; out = x < 5 ? 'small' : x < 12 ? 'medium' : 'large'; hint = 'Check the conditions from the top; the first true one wins.'; }
    return mc(`What does this program print? ${code(src)}`, out, ['big', 'small', 'yes', 'no', 'medium', 'large'], hint, [hint, `It prints "${out}"`]);
  },
  codeLoop() {
    const kind = pick(['sum', 'count', 'evens', 'double']); let src, out, hint;
    if (kind === 'sum') { const n = rnd(3, 6), s = rnd(2, 5); src = `total = 0\nrepeat ${n} times:\n    total = total + ${s}\nprint(total)`; out = n * s; hint = `The loop adds ${s} each time, ${n} times.`; }
    if (kind === 'count') { const a = rnd(1, 4), b = a + rnd(3, 6); src = `count = 0\nfor i in range(${a}, ${b}):\n    count = count + 1\nprint(count)`; out = b - a; hint = `range(${a}, ${b}) goes from ${a} up to ${b - 1}.`; }
    if (kind === 'evens') { const b = rnd(6, 12); src = `for i in range(1, ${b}):\n    if i % 2 == 0:\n        print(i)`; out = Array.from({ length: b - 1 }, (_, i) => i + 1).filter(i => i % 2 === 0).join(', '); hint = `i goes from 1 to ${b - 1}; only even numbers are printed.`;
      const alt = [Array.from({ length: b }, (_, i) => i + 1).filter(i => i % 2 === 0).join(', '), Array.from({ length: b - 1 }, (_, i) => i + 1).filter(i => i % 2).join(', '), Array.from({ length: b - 2 }, (_, i) => i + 1).filter(i => i % 2 === 0).join(', ')];
      return mc(`What does this program print? ${code(src)}`, out, alt, hint, [hint, out]); }
    if (kind === 'double') { const s = rnd(1, 3), n = rnd(3, 5); src = `x = ${s}\nrepeat ${n} times:\n    x = x * 2\nprint(x)`; out = s * 2 ** n; hint = `x doubles ${n} times.`; }
    return mc(`What does this program print? ${code(src)}`, out, choices(out, 4, Math.max(0, out - 10), out + 12).map(String), hint, [hint, `It prints ${out}`]);
  },
  robot({ n = 5, segs = 2, rocks = 0, loops = false } = {}) {
    for (;;) {
      const start = [0, n - 1]; let x = 0, y = n - 1, d = 0; const path = [[x, y]], prog = [];
      let okRoute = true;
      for (let s = 0; s < segs; s++) {
        if (s > 0) { const turn = pick(['R', 'L']); d = (d + (turn === 'R' ? 1 : 3)) % 4; prog.push({ c: turn, k: 1 }); }
        const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0]; let max = 0; while (true) { const nx = x + DX[d] * (max + 1), ny = y + DY[d] * (max + 1); if (nx < 0 || ny < 0 || nx >= n || ny >= n || path.some(p => p[0] === nx && p[1] === ny)) break; max++; }
        if (max < 1) { okRoute = false; break; }
        const len = rnd(1, Math.min(max, loops ? 4 : 3)); for (let i = 0; i < len; i++) { x += DX[d]; y += DY[d]; path.push([x, y]); }
        prog.push({ c: 'F', k: len });
      }
      if (!okRoute || (x === start[0] && y === start[1])) continue;
      const free = [...Array(n * n).keys()].map(i => [i % n, Math.floor(i / n)]).filter(c => !path.some(p => p[0] === c[0] && p[1] === c[1]));
      const rk = shuffle(free).slice(0, rocks);
      const blocks = loops ? prog.length : prog.reduce((s, b) => s + b.k, 0);
      const solutionText = 'One answer: ' + prog.map(b => `${{ F: 'Forward', L: 'Turn left', R: 'Turn right' }[b.c]}${b.k > 1 ? ' × ' + b.k : ''}`).join(', ');
      return { template: 'robot', prompt: loops ? 'Get the robot to the star using repeat (× 2, × 3…) to save blocks.' : 'Program the robot to reach the star. Then press Run.', answer: 'goal',
        data: { n, start, goal: [x, y], rocks: rk, loops, limit: loops ? blocks : 0, solutionText }, hint: 'The robot starts facing up. Turns don\'t move it; they change the way it faces.', solution: [solutionText] };
    }
  },
  orderSteps() {
    const algos = [
      ['Make a cup of tea', ['Boil the water', 'Put a tea bag in the cup', 'Pour the hot water', 'Add milk', 'Stir and drink']],
      ['Brush your teeth', ['Wet the brush', 'Put on toothpaste', 'Brush for two minutes', 'Rinse your mouth', 'Wash the brush']],
      ['Plant a seed', ['Fill a pot with soil', 'Make a small hole', 'Drop in the seed', 'Cover it with soil', 'Water it every day']],
      ['Send a message', ['Unlock the phone', 'Open the messages app', 'Choose a friend', 'Type the message', 'Press send']],
      ['Cross the road', ['Stop at the edge', 'Look right', 'Look left', 'Look right again', 'Walk across when clear']]
    ];
    const [name, steps] = pick(algos), shown = shuffle(steps.map((s, i) => i));
    return { template: 'order', prompt: `An algorithm is a list of steps in order. Tap the steps for "${name}" in the right order.`, answer: 'done', data: { cards: shown.map(i => steps[i]), order: steps.map((_, i) => shown.indexOf(i)) },
      hint: 'What has to happen first, before anything else can?', solution: steps.map((s, i) => `${i + 1}. ${s}`) };
  },
  sortNumbers() {
    const nums = shuffle(choices(rnd(20, 80), 5, 1, 99)), up = Math.random() < .6, sorted = [...nums].sort((a, b) => up ? a - b : b - a);
    return { template: 'order', prompt: `Sorting is something computers do all the time. Tap the numbers from ${up ? 'smallest to largest' : 'largest to smallest'}.`, answer: 'done', data: { cards: nums.map(String), order: sorted.map(v => nums.indexOf(v)) },
      hint: `Find the ${up ? 'smallest' : 'largest'} number left each time.`, solution: [sorted.join(' → ')] };
  },
  binary({ bits = 4 } = {}) {
    const target = rnd(1, 2 ** bits - 1);
    return { template: 'binary', prompt: `Computers count with bulbs that are ON (1) or OFF (0). Make ${target}.`, answer: target, data: { bits, target, showSum: bits <= 4 }, hint: 'Start with the biggest bulb that fits, then add smaller ones.',
      solution: [`${target} = ${Array.from({ length: bits }, (_, i) => 2 ** (bits - 1 - i)).filter(v => target & v).join(' + ')}`, `In binary: ${target.toString(2).padStart(bits, '0')}`] };
  }
};
