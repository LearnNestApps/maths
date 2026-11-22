// Tiny expression evaluator for answers typed on the maths keyboard.
// Supports numbers, x, y, + − × ÷ ^, brackets, √, and implicit multiplication (2x, 3(x+1)).
function tokenize(s) {
  s = String(s).replace(/\s+/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3');
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ t: 'n', v: parseFloat(s.slice(i, j)) }); i = j; continue; }
    if (/[xy]/.test(c)) { out.push({ t: 'v', v: c }); i++; continue; }
    if (c === '√') { out.push({ t: 'f', v: 'sqrt' }); i++; continue; }
    if ('+-*/^()'.includes(c)) { out.push({ t: 'o', v: c }); i++; continue; }
    throw new Error('bad char');
  }
  // insert implicit multiplication
  const res = [];
  out.forEach((tk, k) => {
    const p = res[res.length - 1];
    const pEnds = p && (p.t === 'n' || p.t === 'v' || (p.t === 'o' && p.v === ')'));
    const starts = tk.t === 'n' || tk.t === 'v' || tk.t === 'f' || (tk.t === 'o' && tk.v === '(');
    if (pEnds && starts) res.push({ t: 'o', v: '*' });
    res.push(tk);
  });
  return res;
}
function parse(tokens) {
  let i = 0; const peek = () => tokens[i], eat = () => tokens[i++];
  function expr() { let n = term(); while (peek() && peek().t === 'o' && '+-'.includes(peek().v)) { const o = eat().v, r = term(), l = n; n = o === '+' ? (e => l(e) + r(e)) : (e => l(e) - r(e)); } return n; }
  function term() { let n = unary(); while (peek() && peek().t === 'o' && '*/'.includes(peek().v)) { const o = eat().v, r = unary(), l = n; n = o === '*' ? (e => l(e) * r(e)) : (e => l(e) / r(e)); } return n; }
  function unary() { if (peek() && peek().t === 'o' && peek().v === '-') { eat(); const u = unary(); return e => -u(e); } if (peek() && peek().t === 'o' && peek().v === '+') { eat(); return unary(); } return power(); }
  function power() { const b = atom(); if (peek() && peek().t === 'o' && peek().v === '^') { eat(); const ex = unary(); return e => Math.pow(b(e), ex(e)); } return b; }
  function atom() {
    const tk = eat(); if (!tk) throw new Error('end');
    if (tk.t === 'n') return () => tk.v;
    if (tk.t === 'v') return e => e[tk.v];
    if (tk.t === 'f') { const a = atom(); return e => Math.sqrt(a(e)); }
    if (tk.t === 'o' && tk.v === '(') { const n = expr(); const c = eat(); if (!c || c.v !== ')') throw new Error('paren'); return n; }
    throw new Error('unexpected');
  }
  const f = expr(); if (i !== tokens.length) throw new Error('trailing'); return f;
}
export function compile(s) { try { return parse(tokenize(s)); } catch (e) { return null; } }
export function sameExpr(a, b) {
  const fa = compile(a), fb = compile(b); if (!fa || !fb) return false;
  for (const x of [-2.5, -1, 0, 1.5, 2, 3.7]) for (const y of [-1, 2]) {
    const va = fa({ x, y }), vb = fb({ x, y });
    if (!isFinite(va) || !isFinite(vb) || Math.abs(va - vb) > 1e-7 * Math.max(1, Math.abs(vb))) return false;
  }
  return true;
}
// Count top-level terms, used to make sure "simplify" answers really are simplified.
export function termCount(s) { s = String(s).replace(/\s+/g, '').replace(/−/g, '-'); let d = 0, n = 1; [...s].forEach((c, i) => { if (c === '(') d++; else if (c === ')') d--; else if (d === 0 && i > 0 && (c === '+' || c === '-') && !'*/^('.includes(s[i - 1])) n++; }); return n; }
export const pretty = s => String(s).replace(/\*/g, '×').replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/-/g, '−');
