// Drawings for the JK–Grade 2 lessons. All inline SVG, generated from small functions.
const S = (vb, d, cls = '') => `<svg viewBox="${vb}" class="${cls}" aria-hidden="true">${d}</svg>`;
export const COL = { red: '#ff5c5c', blue: '#4dabf7', yellow: '#ffd23f', green: '#51cf66', purple: '#9775fa', orange: '#ff8a3d' };

// Dot patterns: dice layout up to 6, ten-frame style beyond.
const DICE = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]] };
export function dots(n, color = '#ff6b4a') {
  if (n <= 6) return S('0 0 100 100', `<rect x="3" y="3" width="94" height="94" rx="18" fill="#fff" stroke="#1d2b5322" stroke-width="3"/>${DICE[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${color}"/>`).join('')}`);
  return tenFrame(n, 0, color);
}
export function tenFrame(n, m = 0, c1 = '#ff6b4a', c2 = '#4dabf7') {
  const frames = Math.ceil(Math.max(n + m, 1) / 10), H = frames * 46 + 6;
  let d = '';
  for (let f = 0; f < frames; f++) for (let i = 0; i < 10; i++) {
    const k = f * 10 + i, x = 6 + (i % 5) * 38, y = 6 + f * 46 + Math.floor(i / 5) * 20;
    d += `<rect x="${x}" y="${y}" width="36" height="18" rx="3" fill="#fff" stroke="#1d2b5355" stroke-width="1.5"/>`;
    if (k < n + m) d += `<circle cx="${x + 18}" cy="${y + 9}" r="7" fill="${k < n ? c1 : c2}"/>`;
  }
  return S(`0 0 198 ${H}`, d);
}

export const BALL = (c, s = 1) => S('0 0 60 60', `<circle cx="30" cy="30" r="${26 * s}" fill="${c}"/><ellipse cx="${30 - 9 * s}" cy="${30 - 10 * s}" rx="${7 * s}" ry="${5 * s}" fill="#fff8"/>`);
export const BIRD = (c = '#4dabf7') => S('0 0 60 50', `<ellipse cx="28" cy="30" rx="20" ry="15" fill="${c}"/><circle cx="44" cy="20" r="10" fill="${c}"/><path d="M53 19l7 3-7 3z" fill="#ff8a3d"/><circle cx="46" cy="18" r="2.4" fill="#1d2b53"/><path d="M16 28q10-14 22-2" fill="#0002"/>`);
export const COOKIE = S('0 0 40 40', '<circle cx="20" cy="20" r="17" fill="#e0a35c"/><g fill="#6b4a30"><circle cx="13" cy="14" r="2.5"/><circle cx="25" cy="12" r="2.5"/><circle cx="20" cy="24" r="2.5"/><circle cx="28" cy="26" r="2"/><circle cx="12" cy="26" r="2"/></g>');

// Position words: a table with a cat in one of four places.
const CAT = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-14 -10l4-12 7 8h6l7-8 4 12" fill="#ff8a3d"/><ellipse cx="0" cy="2" rx="17" ry="14" fill="#ff8a3d"/><circle cx="-6" cy="-1" r="2.5" fill="#1d2b53"/><circle cx="6" cy="-1" r="2.5" fill="#1d2b53"/><path d="M-3 6q3 3 6 0" stroke="#1d2b53" stroke-width="2" fill="none"/></g>`;
export function positionScene(where) {
  const cat = { on: CAT(60, 30), under: CAT(60, 92), next: CAT(132, 92), in: CAT(60, 92) }[where];
  const box = where === 'in';
  return S('0 0 160 120', `<rect x="0" y="108" width="160" height="12" fill="#c9a27a"/>${box
    ? `${cat}<path d="M30 76h60v32H30z" fill="#a86f48"/><path d="M30 76l-8-10h76l-8 10z" fill="#c08552"/>`
    : `<rect x="18" y="46" width="84" height="10" rx="3" fill="#a86f48"/><rect x="24" y="56" width="8" height="52" fill="#8a5a3b"/><rect x="88" y="56" width="8" height="52" fill="#8a5a3b"/>${cat}`}`);
}

// 3D solids
export const SOLID = {
  cube: S('0 0 100 100', '<path d="M20 34 50 20l30 14v36L50 86 20 70z" fill="#4dabf7"/><path d="M20 34 50 48l30-14L50 20z" fill="#a5d8ff"/><path d="M50 48v38L80 70V34z" fill="#1c7ed6"/>'),
  sphere: S('0 0 100 100', '<defs><radialGradient id="sg" cx=".35" cy=".35"><stop offset="0" stop-color="#ffc9c9"/><stop offset="1" stop-color="#e03131"/></radialGradient></defs><circle cx="50" cy="52" r="34" fill="url(#sg)"/>'),
  cone: S('0 0 100 100', '<path d="M50 12 80 78a30 10 0 0 1-60 0z" fill="#ffd23f"/><ellipse cx="50" cy="78" rx="30" ry="10" fill="#f59f00"/>'),
  cylinder: S('0 0 100 100', '<path d="M24 26v48a26 9 0 0 0 52 0V26z" fill="#51cf66"/><ellipse cx="50" cy="26" rx="26" ry="9" fill="#b2f2bb"/>')
};

// Indian money
export const COIN = v => S('0 0 60 60', `<circle cx="30" cy="30" r="${v >= 10 ? 27 : v >= 5 ? 25 : v >= 2 ? 23 : 21}" fill="${v === 10 || v === 20 ? '#e8c26b' : '#ced4da'}" stroke="${v === 10 || v === 20 ? '#b8860b' : '#868e96'}" stroke-width="3"/><text x="30" y="38" text-anchor="middle" font-size="${v >= 10 ? 18 : 21}" font-weight="800" fill="#1d2b53">₹${v}</text>`);
export const NOTE = v => S('0 0 100 50', `<rect x="2" y="2" width="96" height="46" rx="6" fill="${{ 10: '#e9b38a', 20: '#d8f5a2', 50: '#99e9f2', 100: '#d0bfff' }[v] || '#eee'}" stroke="#0003" stroke-width="2"/><circle cx="74" cy="25" r="13" fill="#fff8"/><text x="30" y="33" text-anchor="middle" font-size="22" font-weight="800" fill="#1d2b53">₹${v}</text>`);

// Base-ten blocks
export const ROD = S('0 0 14 100', Array.from({ length: 10 }, (_, i) => `<rect x="1" y="${1 + i * 9.8}" width="12" height="9.4" rx="1.5" fill="#4dabf7" stroke="#1c7ed6"/>`).join(''));
export const UNIT = S('0 0 14 14', '<rect x="1" y="1" width="12" height="12" rx="2" fill="#ff8a3d" stroke="#d9661c"/>');
export const FLAT = S('0 0 100 100', `<rect x="1" y="1" width="98" height="98" rx="3" fill="#51cf66" stroke="#2b8a3e" stroke-width="2"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${10.8 + i * 9.8} 1v98M1 ${10.8 + i * 9.8}h98" stroke="#2b8a3e" stroke-width=".8"/>`).join('')}`);

export const PENCIL = (len, c = '#ffd23f') => S(`0 0 ${len * 40 + 8} 28`, `<path d="M4 6h${len * 40 - 26}v16H4z" fill="${c}"/><path d="M${len * 40 - 22} 6l26 8-26 8z" fill="#f4d6b0"/><path d="M${len * 40 - 2} 12l4 2-4 2z" fill="#1d2b53"/><rect x="0" y="6" width="8" height="16" rx="2" fill="#ff8aa0"/>`);

// Fraction pictures: pie or bar, k parts, s shaded; uneven=true draws unequal "halves".
export function fracShape(kind, k, s, uneven = false) {
  if (kind === 'pie') {
    if (uneven) return S('0 0 100 100', '<circle cx="50" cy="50" r="44" fill="#fff" stroke="#1d2b53" stroke-width="3"/><path d="M50 50 50 6A44 44 0 0 1 88 72Z" fill="#ff8a3d"/><path d="M50 6V50L88 72" fill="none" stroke="#1d2b53" stroke-width="3"/>');
    let d = '<circle cx="50" cy="50" r="44" fill="#fff" stroke="#1d2b53" stroke-width="3"/>';
    for (let i = 0; i < k; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / k, a1 = a0 + 2 * Math.PI / k, p = a => `${(50 + 44 * Math.cos(a)).toFixed(1)} ${(50 + 44 * Math.sin(a)).toFixed(1)}`;
      d += `<path d="M50 50L${p(a0)}A44 44 0 ${k === 1 ? 1 : 0} 1 ${p(a1)}Z" fill="${i < s ? '#ff8a3d' : '#fff'}" stroke="#1d2b53" stroke-width="3"/>`;
    }
    return S('0 0 100 100', d);
  }
  const w = uneven ? [30, 70] : Array(k).fill(100 / k); let x = 2, d = '';
  w.forEach((ww, i) => { d += `<rect x="${x}" y="22" width="${ww * .96}" height="56" fill="${i < s ? '#4dabf7' : '#fff'}" stroke="#1d2b53" stroke-width="3"/>`; x += ww * .96; });
  return S('0 0 100 100', d);
}

// Symmetry pictures with a dashed mirror line.
const MIRROR = '<path d="M50 4v92" stroke="#e03131" stroke-width="2.5" stroke-dasharray="6 5"/>';
export const SYM = {
  butterfly: S('0 0 100 100', `<ellipse cx="30" cy="38" rx="20" ry="22" fill="#9775fa"/><ellipse cx="70" cy="38" rx="20" ry="22" fill="#9775fa"/><ellipse cx="32" cy="70" rx="15" ry="14" fill="#da77f2"/><ellipse cx="68" cy="70" rx="15" ry="14" fill="#da77f2"/><rect x="46" y="24" width="8" height="58" rx="4" fill="#1d2b53"/>${MIRROR}`),
  house: S('0 0 100 100', `<path d="M14 48 50 14l36 34v44H14z" fill="#ffd23f"/><rect x="40" y="62" width="20" height="30" fill="#a86f48"/>${MIRROR}`),
  heart: S('0 0 100 100', `<path d="M50 86C22 66 8 50 8 33 8 20 18 11 30 11c9 0 16 5 20 13 4-8 11-13 20-13 12 0 22 9 22 22 0 17-14 33-42 53z" fill="#ff6b8a"/>${MIRROR}`),
  flag: S('0 0 100 100', `<rect x="22" y="10" width="6" height="84" fill="#1d2b53"/><path d="M28 12h50l-10 16 10 16H28z" fill="#51cf66"/>${MIRROR}`),
  boot: S('0 0 100 100', `<path d="M30 10h24v52l26 10v18H30z" fill="#a86f48"/>${MIRROR}`),
  bolt: S('0 0 100 100', `<path d="M58 6 26 56h22l-8 38 34-52H52z" fill="#ffd23f"/>${MIRROR}`)
};

export const FRUIT = {
  apple: S('0 0 60 60', '<path d="M30 14c-6-6-20-4-22 10s6 30 14 30c4 0 5-2 8-2s4 2 8 2c8 0 16-16 14-30S36 8 30 14z" fill="#ff4b4b"/><path d="M33 9c6-4 12-2 14 1-5 3-10 3-14-1z" fill="#3fae4f"/>'),
  banana: S('0 0 60 60', '<path d="M10 22c4 22 26 32 44 22-2-4-6-4-8-3-14 6-28-2-32-19z" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>'),
  mango: S('0 0 60 60', '<path d="M18 50c-12-10-8-34 10-38 16-4 26 12 20 26-4 10-18 20-30 12z" fill="#ff922b"/><path d="M30 12c2-6 8-8 12-6-4 4-8 6-12 6z" fill="#3fae4f"/>'),
  grapes: S('0 0 60 60', '<g fill="#9775fa"><circle cx="22" cy="20" r="8"/><circle cx="38" cy="20" r="8"/><circle cx="30" cy="31" r="8"/><circle cx="18" cy="34" r="7"/><circle cx="42" cy="34" r="7"/><circle cx="30" cy="45" r="8"/></g><path d="M30 12V4" stroke="#3fae4f" stroke-width="3"/>')
};

export const PLATE = S('0 0 100 60', '<ellipse cx="50" cy="34" rx="48" ry="22" fill="#fff" stroke="#1d2b5333" stroke-width="3"/><ellipse cx="50" cy="32" rx="34" ry="14" fill="#f1f3f5"/>');
export const FEATHER = S('0 0 60 60', '<path d="M12 50C14 26 30 10 52 8 50 30 34 46 12 50z" fill="#a5d8ff"/><path d="M12 50 44 18" stroke="#1c7ed6" stroke-width="2"/>');
export const ROCK = S('0 0 60 60', '<path d="M8 44c0-14 10-28 24-28s22 10 22 22-8 14-22 14S8 52 8 44z" fill="#868e96"/><path d="M20 30q6-6 14-4" stroke="#fff6" stroke-width="3" fill="none"/>');
