// Vedic maths: the remaining sutras (4–9, 11, 12, 13, 15, 16), each as worked steps.
// Every lesson's last line says why the method works in ordinary algebra.
import { rnd, pick, shuffle } from '../core/ui.js';

const E = s => `<span class="expr">${s}</span>`;
const sg = n => n < 0 ? `− ${-n}` : `+ ${n}`;                       // "+ 3" / "− 3"
const xp = (n, v = 'x') => n === 0 ? v : `${v} ${sg(n)}`;            // "x + 3"
const lin = (a, b, v = 'x') => `${a === 1 ? '' : a === -1 ? '−' : a}${v}${b ? ' ' + sg(b) : ''}`; // "3x − 2"
const lin2 = (a, b, c) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c}`;
const quad = (b, c) => `x²${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x` : ''}${c ? ' ' + sg(c) : ''}`;
const S = (html, answer) => ({ html, answer });
const ST = (prompt, steps, hint, solution) => ({ template: 'steps', prompt, answer: steps[steps.length - 1].answer, data: { steps, neg: true }, hint, solution });
function MC(prompt, right, wrongs, hint, solution) {
  const opts = shuffle([right, ...wrongs.filter(w => w !== right)]);
  return { template: 'mcq', prompt, answer: opts.indexOf(right), data: { options: opts }, hint, solution };
}
const M = n => n < 0 ? `−${-n}` : `${n}`, P = n => n < 0 ? `(−${-n})` : `${n}`;
const nz = (a, b) => { let v; do v = rnd(a, b); while (v === 0); return v; };

export const GEN_VEDIC = {
  // Sutra 4 · Paravartya Yojayet, "transpose and apply".
  paravartya() {
    if (Math.random() < .5) {
      const x = nz(-6, 9); let a, c; do { a = rnd(2, 9); c = rnd(1, 8); } while (a === c);
      const b = nz(-12, 12), d = a * x + b - c * x;
      return ST(`Solve ${E(`${lin(a, b)} = ${lin(c, d)}`)}`, [
        S(`Transpose the numbers: ${M(d)} − ${P(b)} = ?`, d - b),
        S(`Transpose the x terms: ${a} − ${c} = ?`, a - c),
        S(`x = ${M(d - b)} ÷ ${P(a - c)} = ?`, x)],
        'Paravartya Yojayet: move each term across the = sign and change its sign. Then x = (numbers) ÷ (x numbers).',
        [`${a}x − ${c}x = ${M(d)} − ${P(b)}`, `${M(a - c)}x = ${M(d - b)}`, `x = ${M(x)}`]);
    }
    // (x + a)(x + b) = (x + c)(x + d)  →  x = (cd − ab) ÷ (a + b − c − d)
    for (;;) {
      const x = nz(-5, 8), a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 9), num = (a + b - c) * x + a * b, den = c + x;
      if (!den || num % den) continue; const d = num / den;
      if (d < 1 || d > 12 || a + b === c + d || new Set([a, b, c, d]).size < 4 || a * b === c * d) continue;
      return ST(`Solve ${E(`(${xp(a)})(${xp(b)}) = (${xp(c)})(${xp(d)})`)}`, [
        S(`Right product minus left product: ${c} × ${d} − ${a} × ${b} = ?`, c * d - a * b),
        S(`Left sum minus right sum: (${a} + ${b}) − (${c} + ${d}) = ?`, a + b - c - d),
        S(`x = ${M(c * d - a * b)} ÷ ${P(a + b - c - d)} = ?`, x)],
        'Paravartya: the x² terms cancel. x = (cd − ab) ÷ ((a + b) − (c + d)).',
        [`x² + ${a + b}x + ${a * b} = x² + ${c + d}x + ${c * d}`, `${M(a + b - c - d)}x = ${M(c * d - a * b)}`, `x = ${M(x)}`]);
    }
  },

  // Sutra 5 · Shunyam Saamyasamuccaye, "when the total is the same, it is zero".
  shunyam() {
    if (Math.random() < .5) {
      const N = pick([12, 18, 20, 24, 30, 36]), pairs = []; for (let p = 1; p * p < N; p++) if (N % p === 0) pairs.push([p, N / p]);
      const [P, Q] = shuffle(pairs).slice(0, 2);
      return ST(`Solve ${E(`(${xp(P[0])})(${xp(P[1])}) = (${xp(Q[0])})(${xp(Q[1])})`)}`, [
        S(`Left constants multiplied: ${P[0]} × ${P[1]} = ?`, N),
        S(`Right constants multiplied: ${Q[0]} × ${Q[1]} = ?`, N),
        S('The products are the same, so x = ?', 0)],
        'Shunyam Saamyasamuccaye: when the number terms are the same on both sides, the x term must be zero.',
        [`x² + ${P[0] + P[1]}x + ${N} = x² + ${Q[0] + Q[1]}x + ${N}`, `${M(P[0] + P[1] - Q[0] - Q[1])}x = 0, so x = 0`]);
    }
    // (px + a)/(px + b) = (px + b)/(px + a): numerators add to the same as denominators → that total = 0.
    for (;;) {
      const p = pick([1, 1, 2, 3]), a = rnd(1, 15), b = rnd(1, 15);
      if (a === b || (a + b) % (2 * p)) continue;
      const x = -(a + b) / (2 * p);
      return ST(`Solve ${E(`(${lin(p, a)}) / (${lin(p, b)}) = (${lin(p, b)}) / (${lin(p, a)})`)}`, [
        S(`Add the numerators: (${lin(p, a)}) + (${lin(p, b)}) = ${2 * p}x + ?`, a + b),
        S(`The denominators add to the same total, so ${2 * p}x + ${a + b} = 0. x = ?`, x)],
        'Shunyam Saamyasamuccaye: if the numerators add up to the same thing as the denominators, that total is zero.',
        [`${2 * p}x + ${a + b} = 0`, `x = ${M(x)}`]);
    }
  },

  // Sutra 6 · Anurupye Shunyamanyat, "if one is in ratio, the other is zero".
  anurupye() {
    for (;;) {
      const yZero = Math.random() < .5, v = rnd(1, 6), co = rnd(2, 9), k = rnd(2, 4), other = [rnd(2, 15), rnd(2, 15)];
      // The pair in ratio: coefficient co and constant co·v, then k times both.
      const [o1, o2] = other; if (o1 * k === o2) continue;
      const e1 = yZero ? [co, o1, co * v] : [o1, co, co * v], e2 = yZero ? [co * k, o2, co * v * k] : [o2, co * k, co * v * k];
      const X = yZero ? v : 0, Y = yZero ? 0 : v;
      return ST(`Solve ${E(lin2(...e1))} and ${E(lin2(...e2))}`, [
        S(`${yZero ? 'x' : 'y'}-coefficients: ${co} : ${co * k} = 1 : ?`, k),
        S(`Constants: ${co * v} : ${co * v * k} = 1 : ?`, k),
        S(`Same ratio, so the other letter is zero. ${yZero ? 'y' : 'x'} = ?`, 0),
        S(`Then ${co}${yZero ? 'x' : 'y'} = ${co * v}, so ${yZero ? 'x' : 'y'} = ?`, v)],
        `Anurupye Shunyamanyat: when one letter's coefficients are in the same ratio as the constants, the other letter is 0.`,
        [`${yZero ? 'y' : 'x'} = 0`, `${yZero ? 'x' : 'y'} = ${co * v} ÷ ${co} = ${v}`, `Check: x = ${X}, y = ${Y} fits both equations.`]);
    }
  },

  // Sutra 7 · Sankalana-Vyavakalanabhyam, "by addition and by subtraction".
  sankalana() {
    for (;;) {
      const a = rnd(2, 9), b = rnd(1, 9), x = rnd(-4, 9), y = rnd(-4, 9);
      if (a === b || (x === 0 && y === 0)) continue;
      const c = a * x + b * y, d = b * x + a * y;
      return ST(`Solve ${E(lin2(a, b, c))} and ${E(lin2(b, a, d))}`, [
        S(`Add: ${a + b}(x + y) = ${M(c + d)}, so x + y = ?`, x + y),
        S(`Subtract: ${M(a - b)}(x − y) = ${M(c - d)}, so x − y = ?`, x - y),
        S(`x = (${x + y} + ${P(x - y)}) ÷ 2 = ?`, x),
        S(`y = (${x + y} − ${P(x - y)}) ÷ 2 = ?`, y)],
        'Sankalana-Vyavakalanabhyam: when the x and y numbers swap places, add the equations and subtract them.',
        [`x + y = ${M(x + y)}`, `x − y = ${M(x - y)}`, `x = ${M(x)}, y = ${M(y)}`]);
    }
  },

  // Sutra 8 · Puranapuranabhyam, "by completing or not completing" (completing the square).
  purana() {
    for (;;) {
      const r1 = rnd(-8, 8), r2 = rnd(-8, 8); if (r1 <= r2 || (r1 + r2) % 2) continue;
      const b = -(r1 + r2), c = r1 * r2, h = b / 2, k = (r1 - r2) / 2;
      return ST(`Solve ${E(`${quad(b, c)} = 0`)} by completing the square.`, [
        S(`Complete the square: (${xp(h)})² = ${h * h} ${sg(-c)} = ?`, k * k),
        S(`So ${xp(h)} = ± ?`, k),
        S('Larger answer: x = ?', r1),
        S('Smaller answer: x = ?', r2)],
        'Puranapuranabhyam: take half the x number, square it, and move the constant across.',
        [`(${xp(h)})² = ${k * k}`, `${xp(h)} = ±${k}`, `x = ${M(r1)} or x = ${M(r2)}`]);
    }
  },

  // Sutra 9 · Chalana-Kalanabhyam, "differences and similarities": first differential = ± √discriminant.
  chalana() {
    for (;;) {
      const r1 = rnd(-9, 9), r2 = rnd(-9, 9); if (r1 <= r2) continue;
      const b = -(r1 + r2), c = r1 * r2, D = (r1 - r2) ** 2;
      return ST(`Solve ${E(`${quad(b, c)} = 0`)}`, [
        S(`Discriminant: (${M(b)})² − 4 × ${P(c)} = ?`, D),
        S('Square root of the discriminant = ?', r1 - r2),
        S(`First differential: 2x ${sg(b)} = +${r1 - r2}, so x = ?`, r1),
        S(`And 2x ${sg(b)} = −${r1 - r2}, so x = ?`, r2)],
        'Chalana-Kalanabhyam: the first differential (2x + b) equals ± the square root of the discriminant (b² − 4c).',
        [`2x ${sg(b)} = ±${r1 - r2}`, `x = ${M(r1)} or x = ${M(r2)}`, 'Why: (2x + b)² = b² − 4c is the quadratic formula rearranged.']);
    }
  },

  // Sutra 11 · Vyashtisamanstih, "part and whole": the average from a guessed middle.
  vyashti() {
    for (;;) {
      const n = pick([5, 6]), G = pick([30, 40, 50, 60, 70, 80, 120, 150, 250]), d = Array.from({ length: n }, () => rnd(-9, 9)), s = d.reduce((x, y) => x + y);
      if (s % n || d.every(v => !v)) continue;
      const nums = d.map(v => G + v);
      return ST(`Find the average of ${nums.join(', ')} using a guess of ${G}.`, [
        S(`Differences from ${G}: ${d.map(v => v < 0 ? `−${-v}` : `+${v}`).join(' ')}. Total = ?`, s),
        S(`Share the total: ${M(s)} ÷ ${n} = ?`, s / n),
        S(`Average = ${G} ${s < 0 ? '−' : '+'} ${Math.abs(s / n)} = ?`, G + s / n)],
        'Vyashtisamanstih: guess a middle value, average only the small differences, then adjust the guess.',
        [`${G} ${s < 0 ? '−' : '+'} ${Math.abs(s)} ÷ ${n} = ${G + s / n}`]);
    }
  },

  // Sutra 12 · Shesanyankena Charamena, "the remainders by the last digit" (1/7 family).
  shesanyankena() {
    const n = rnd(1, 6), rems = []; let r = n;
    for (let i = 0; i < 6; i++) { r = (r * 10) % 7; rems.push(r); }
    const block = +rems.map(x => (x * 7) % 10).join('');
    let prev = n;
    const steps = rems.map(x => { const st = S(`${prev * 10} ÷ 7 leaves remainder ?`, x); prev = x; return st; });
    return ST(`Write ${E(`${n}/7`)} as a recurring decimal.`, [...steps,
      S(`Multiply each remainder by 7 and keep the last digit. ${n}/7 = 0.(repeating block ?)`, block)],
      'Shesanyankena Charamena: list the remainders, multiply each by the last digit of 7 (that is 7), keep only the last digit.',
      [`Remainders: ${rems.join(', ')}`, `× 7 → ${rems.map(x => x * 7).join(', ')}`, `Last digits: ${String(block)}`, `${n}/7 = 0.${block} ${block} …`]);
  },

  // Sutra 13 · Sopaantyadvayamantyam, "the ultimate and twice the penultimate".
  sopaantya() {
    const a = rnd(1, 6), s = pick([3, 3, 6]), [A, B, C, D] = [a, a + s, a + 2 * s, a + 3 * s], x = -(D + 2 * C) / 3;
    const f = (p, q) => `1/((${xp(p)})(${xp(q)}))`;
    return ST(`Solve<br>${E(`${f(A, B)} + ${f(A, C)}`)}<br>${E(`= ${f(A, D)} + ${f(B, C)}`)}`, [
      S(`The four factors go up in equal steps. Ultimate (last) factor: x + ?`, D),
      S(`Penultimate (second-last) factor: x + ?`, C),
      S(`Ultimate + 2 × penultimate = 3x + ?`, D + 2 * C),
      S(`Set it to zero: x = ?`, x)],
      'Sopaantyadvayamantyam: when the factors are in equal steps, the last factor plus twice the second-last equals zero.',
      [`(${xp(D)}) + 2(${xp(C)}) = 3x + ${D + 2 * C} = 0`, `x = ${M(x)}`]);
  },

  // Sutra 15 · Gunitasamuchyah: sum of coefficients of the product = product of the sums in the factors.
  gunita() {
    const fac = () => { let v; do v = rnd(-9, 9); while (v === 0 || v === -1); return v; }, a = fac(), b = fac();
    if (Math.random() < .5) {
      return ST(`Check ${E(`(${xp(a)})(${xp(b)}) = ${quad(a + b, a * b)}`)} with coefficient sums.`, [
        S(`Sum of the numbers in (${xp(a)}): 1 ${sg(a)} = ?`, 1 + a),
        S(`Sum of the numbers in (${xp(b)}): 1 ${sg(b)} = ?`, 1 + b),
        S(`Multiply them: ${M(1 + a)} × ${P(1 + b)} = ?`, (1 + a) * (1 + b)),
        S(`Sum of the coefficients of the answer: 1 ${sg(a + b)} ${sg(a * b)} = ?`, 1 + a + b + a * b)],
        'Gunitasamuchyah: the product of the coefficient sums of the factors equals the coefficient sum of the product. Both are 1 + a + b + ab.',
        [`${M((1 + a) * (1 + b))} = ${M(1 + a + b + a * b)}: the check passes.`, 'Why: putting x = 1 into both sides gives these sums.']);
    }
    const ok = Math.random() < .5, mid = ok ? a + b : a + b + pick([1, -1, 2, -2]), con = a * b;
    const sumF = (1 + a) * (1 + b), sumP = 1 + mid + con;
    return MC(`Use Gunitasamuchyah to check: is ${E(`(${xp(a)})(${xp(b)}) = ${quad(mid, con)}`)} right?`, ok ? 'Passes the check' : 'Wrong', ['Passes the check', 'Wrong'],
      'Multiply the coefficient sums of the two brackets, and compare with the coefficient sum of the answer.',
      [`(1 ${sg(a)})(1 ${sg(b)}) = ${M(sumF)}`, `1 ${sg(mid)} ${sg(con)} = ${M(sumP)}`, ok ? 'They match.' : 'They do not match, so the expansion is wrong.']);
  },

  // Sutra 16 · Gunakasamuchyah: the first differential equals the sum of the factors.
  gunaka() {
    let p, q; do { p = rnd(-9, 9); q = rnd(-9, 9); } while (!p || !q || p === q);
    const [lo, hi] = [Math.min(p, q), Math.max(p, q)], b = p + q, c = p * q;
    if (Math.random() < .5) {
      return ST(`Factorise ${E(quad(b, c))} as (x + p)(x + q), and check it.`, [
        S(`The first differential is 2x + ?`, b),
        S(`So p + q = ${b}, and p × q = ?`, c),
        S('The smaller of p and q = ?', lo),
        S('The larger of p and q = ?', hi)],
        'Gunakasamuchyah: the first differential (2x + b) must equal the sum of the factors, (x + p) + (x + q).',
        [`${quad(b, c)} = (${xp(lo)})(${xp(hi)})`, `Check: (${xp(lo)}) + (${xp(hi)}) = 2x ${sg(b)} ✓`]);
    }
    const ok = Math.random() < .5; let lo2 = lo, hi2 = hi; if (!ok) { do { lo2 = lo + pick([-1, 1, -2, 2]); } while (lo2 === 0 || lo2 === hi || lo2 + hi === b); }
    return MC(`Use Gunakasamuchyah to check: is ${E(`${quad(b, c)} = (${xp(lo2)})(${xp(hi2)})`)} right?`, ok ? 'Passes the check' : 'Wrong', ['Passes the check', 'Wrong'],
      'Differentiate the left side (x² + bx + c → 2x + b) and add the factors on the right. They must match.',
      [`Differential: 2x ${sg(b)}`, `Sum of factors: 2x ${sg(lo2 + hi2)}`, ok ? 'They match.' : 'They do not match, so the factorisation is wrong.']);
  }
};
