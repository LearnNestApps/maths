// Building blocks for "Learn first" explainers: frames and simple, clear pictures.
const INK = '#1d3557';

// Spoken text: strip tags, read fractions as "a over b", and symbols as words.
export function spoken(html) {
  return String(html)
    .replace(/<span class="frac"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g, ' $1 over $2 ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]*>/g, ' ')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/ = /g, ' equals ')
    .replace(/≈/g, ' is about ').replace(/²/g, ' squared ').replace(/³/g, ' cubed ').replace(/√/g, ' square root of ')
    .replace(/✓|✗|→/g, ' ').replace(/\s+/g, ' ').trim();
}
export const F = (html, say) => ({ html, say: say || spoken(html) });
// A try-it question: Next waits until the learner has answered once.
export const T = (html, options, answer, right, wrong, say) => ({ html, say: say || spoken(html), try: { options: options.map(String), answer, right, wrong } });
export const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
export const big = s => `<div class="big small">${s}</div>`;
export const p = s => `<p>${s}</p>`;
export const mk = s => `<mark>${s}</mark>`;
export const alt = s => `<span class="alt">${s}</span>`;
export const no = (title, body) => `<div class="lno">✗ ${title}${body ? `<span class="lfl">${body}</span>` : ''}</div>`;
export const yes = (title, body) => `<div class="lyes">✓ ${title}${body ? `<span class="lfl">${body}</span>` : ''}</div>`;
export const cmp = (...xs) => `<div class="lcmp">${xs.join('')}</div>`;
export const steps = list => `<ol class="lsteps">${list.map(s => `<li>${s}</li>`).join('')}</ol>`;
export const box = s => `<div class="lbox">${s}</div>`;

// A fraction bar: n equal parts, the first k shaded.
export function bar(n, k, color = '#4dabf7', w = 300) {
  const pw = w / n;
  return `<svg class="lbar" viewBox="0 0 ${w + 4} 44" width="${w + 4}" height="44" role="img" aria-label="${k} of ${n} parts shaded">${Array.from({ length: n }, (_, i) =>
    `<rect x="${2 + i * pw}" y="2" width="${pw}" height="40" rx="3" fill="${i < k ? color : '#fff'}" stroke="${INK}" stroke-width="2"/>`).join('')}</svg>`;
}
export const barRow = (n, k, color) => `<div class="lrow">${bar(n, k, color)}<b class="lfr">${fr(k, n)}</b></div>`;

// Column working: rows of numbers lined up on the right; optional carries above.
export function cols(rows, result, carry, lines = [rows.length - 1]) {
  const W = Math.max(...rows.map(r => String(r).length), String(result ?? '').length);
  const cell = (s, cls = '') => `<tr class="${cls}">${String(s).padStart(W, ' ').split('').map(c => `<td>${c === ' ' ? '' : c}</td>`).join('')}</tr>`;
  return `<table class="lcols">${carry ? cell(carry, 'carry') : ''}${rows.map((r, i) => cell(r, lines.includes(i) ? 'last' : '')).join('')}${result != null ? cell(result, 'res') : ''}</table>`;
}

// Place-value table: headers and a number's digits; highlight one column.
export function pv(headers, digits, hi = -1) {
  return `<table class="lpv"><tr>${headers.map((h, i) => `<th class="${i === hi ? 'hi' : ''}">${h}</th>`).join('')}</tr><tr>${String(digits).split('').map((d, i) => `<td class="${i === hi ? 'hi' : ''}">${d}</td>`).join('')}</tr></table>`;
}

// A number line from a to b with ticks every `step`; hops = [[from, to, label]], pts = [[x, label]].
export function nline(a, b, step, hops = [], pts = [], w = 320) {
  const X = v => 14 + (v - a) / (b - a) * (w - 28), ticks = [];
  for (let v = a; v <= b + 1e-9; v += step) ticks.push(v);
  const lab = v => Number.isInteger(v) ? v : +v.toFixed(2);
  return `<svg class="lnl" viewBox="0 0 ${w} 92" width="${w}" height="92" role="img" aria-label="number line">
    <line x1="6" y1="62" x2="${w - 6}" y2="62" stroke="${INK}" stroke-width="2.5"/>
    ${ticks.map(v => `<line x1="${X(v)}" y1="55" x2="${X(v)}" y2="69" stroke="${INK}" stroke-width="2"/><text x="${X(v)}" y="86" font-size="13" text-anchor="middle" fill="${INK}">${String(lab(v)).replace('-', '−')}</text>`).join('')}
    ${hops.map(([f, t2, l], i) => { const x1 = X(f), x2 = X(t2), mx = (x1 + x2) / 2, hgt = Math.min(44, 14 + Math.abs(x2 - x1) / 3);
      return `<path d="M${x1} 58 Q${mx} ${58 - hgt * 1.6} ${x2} 58" fill="none" stroke="${['#ff6b4a', '#4dabf7', '#2f9e44', '#ae3ec9'][i % 4]}" stroke-width="3"/><text x="${mx}" y="${58 - hgt * .8 - 6}" font-size="14" font-weight="700" text-anchor="middle" fill="${['#ff6b4a', '#4dabf7', '#2f9e44', '#ae3ec9'][i % 4]}">${l}</text>`; }).join('')}
    ${pts.map(([v, l]) => `<circle cx="${X(v)}" cy="62" r="6" fill="#ff6b4a"/>${l ? `<text x="${X(v)}" y="40" font-size="14" font-weight="700" text-anchor="middle" fill="#ff6b4a">${l}</text>` : ''}`).join('')}</svg>`;
}

// A rectangle w × h, optionally with unit squares, labelled with its sides.
export function rect(w, h, unit = 'cm', squares = true, s = 26) {
  const W = w * s, H = h * s, g = [];
  if (squares) { for (let i = 1; i < w; i++) g.push(`<line x1="${30 + i * s}" y1="10" x2="${30 + i * s}" y2="${10 + H}" stroke="#a5d8ff" stroke-width="1.5"/>`); for (let j = 1; j < h; j++) g.push(`<line x1="30" y1="${10 + j * s}" x2="${30 + W}" y2="${10 + j * s}" stroke="#a5d8ff" stroke-width="1.5"/>`); }
  return `<svg class="lpic" viewBox="0 0 ${W + 60} ${H + 40}" width="${W + 60}" height="${H + 40}" role="img" aria-label="rectangle ${w} by ${h}"><rect x="30" y="10" width="${W}" height="${H}" fill="#e7f5ff" stroke="${INK}" stroke-width="2.5"/>${g.join('')}
    <text x="${30 + W / 2}" y="${H + 32}" font-size="15" font-weight="700" text-anchor="middle" fill="${INK}">${w} ${unit}</text><text x="22" y="${10 + H / 2 + 5}" font-size="15" font-weight="700" text-anchor="end" fill="${INK}">${h}</text></svg>`;
}

// An angle of `deg` degrees, opening anticlockwise from a horizontal arm.
export function angle(deg, label = '', r = 90) {
  const cx = 40, cy = 120, rad = deg * Math.PI / 180, x2 = cx + r * Math.cos(rad), y2 = cy - r * Math.sin(rad), a = 28;
  const arc = deg === 90 ? `<path d="M${cx + 18} ${cy} V${cy - 18} H${cx}" fill="none" stroke="#ff6b4a" stroke-width="2.5"/>`
    : `<path d="M${cx + a} ${cy} A${a} ${a} 0 ${deg > 180 ? 1 : 0} 0 ${cx + a * Math.cos(rad)} ${cy - a * Math.sin(rad)}" fill="none" stroke="#ff6b4a" stroke-width="2.5"/>`;
  return `<svg class="lpic" viewBox="0 0 ${deg > 90 ? 200 : 150} 140" width="${deg > 90 ? 200 : 150}" height="140" role="img" aria-label="angle ${deg} degrees">
    ${deg > 90 ? `<g transform="translate(60 0)">` : '<g>'}<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${INK}" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="3"/>${arc}
    ${label ? `<text x="${cx + 36}" y="${cy - 10}" font-size="15" font-weight="700" fill="#ff6b4a">${label}</text>` : ''}</g></svg>`;
}

// A polygon from points (in a 0–100 box), with optional side labels and right-angle marks.
export function shape(pts, { fill = '#e7f5ff', labels = [], ticks = [], w = 150 } = {}) {
  const P = pts.map(([x, y]) => [10 + x * 1.3, 10 + y * 1.3]);
  const lab = labels.map((l, i) => { if (!l) return ''; const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length]; return `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" dy="5" font-size="13" font-weight="700" text-anchor="middle" fill="#c92a2a" paint-order="stroke" stroke="#fff" stroke-width="4">${l}</text>`; });
  return `<svg class="lpic" viewBox="0 0 150 150" width="${w}" height="${w}" role="img" aria-label="shape"><polygon points="${P.map(q => q.join(',')).join(' ')}" fill="${fill}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>${lab.join('')}${ticks.join('')}</svg>`;
}

// A bar chart: data = [[label, value]], gridlines every `step`.
export function chart(data, step, top, color = '#4dabf7') {
  const W = 300, H = 160, bw = (W - 40) / data.length;
  const Y = v => 10 + (1 - v / top) * (H - 30), lines = [];
  for (let v = 0; v <= top; v += step) lines.push(`<line x1="34" y1="${Y(v)}" x2="${W}" y2="${Y(v)}" stroke="#dee2e6"/><text x="30" y="${Y(v) + 4}" font-size="11" text-anchor="end" fill="${INK}">${v}</text>`);
  return `<svg class="lpic" viewBox="0 0 ${W} ${H + 8}" width="${W}" height="${H + 8}" role="img" aria-label="bar chart">${lines.join('')}${data.map(([l, v], i) =>
    `<rect x="${40 + i * bw + bw * .18}" y="${Y(v)}" width="${bw * .64}" height="${Y(0) - Y(v)}" rx="3" fill="${color}"/><text x="${40 + i * bw + bw / 2}" y="${H + 4}" font-size="12" text-anchor="middle" fill="${INK}">${l}</text>`).join('')}</svg>`;
}

// A soroban (abacus) showing a number: one rod per digit, one 5-bead above the bar, four 1-beads below.
export function abacus(n, rods = String(n).length) {
  const ds = String(n).padStart(rods, '0').split('').map(Number), W = rods * 46 + 20, beads = [];
  ds.forEach((d, i) => { const x = 30 + i * 46; beads.push(`<line x1="${x}" y1="8" x2="${x}" y2="150" stroke="#8d6e63" stroke-width="3"/>`);
    const five = d >= 5; beads.push(`<ellipse cx="${x}" cy="${five ? 48 : 22}" rx="18" ry="10" fill="${five ? '#ff6b4a' : '#e9ecef'}" stroke="${INK}" stroke-width="1.5"/>`);
    for (let k = 0; k < 4; k++) { const on = k < d % 5; beads.push(`<ellipse cx="${x}" cy="${on ? 74 + k * 20 : 84 + k * 20 + 2}" rx="18" ry="9" fill="${on ? '#4dabf7' : '#e9ecef'}" stroke="${INK}" stroke-width="1.5"/>`); } });
  return `<svg class="lpic" viewBox="0 0 ${W} 160" width="${W}" height="160" role="img" aria-label="abacus showing ${n}"><rect x="4" y="4" width="${W - 8}" height="152" rx="8" fill="none" stroke="#8d6e63" stroke-width="5"/><line x1="4" y1="62" x2="${W - 4}" y2="62" stroke="#8d6e63" stroke-width="5"/>${beads.join('')}</svg>`;
}

// Bar model: rows of parts [[size, label, color]], with an optional total brace label.
export function bm(rows, total) {
  const max = Math.max(...rows.map(r => r.parts.reduce((s, x) => s + x[0], 0)));
  return `<div class="lbm">${rows.map(r => `<div class="lbmr"><span class="lbmn">${r.name || ''}</span><div class="lbmb" style="width:${r.parts.reduce((s, x) => s + x[0], 0) / max * 100}%">${r.parts.map(([v, l, c]) =>
    `<div style="flex:${v};background:${c || '#a5d8ff'}">${l}</div>`).join('')}</div></div>`).join('')}${total ? `<div class="lbmt">${total}</div>` : ''}</div>`;
}

// A plain table: first row is the header.
export const table = rows => `<table class="ltab">${rows.map((r, i) => `<tr>${r.map(c => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</table>`;

// Points on a grid (first quadrant or all four).
export function coordGrid(pts, n = 6, four = false) {
  const s = 26, o = four ? n * s + 20 : 20, W = four ? 2 * n * s + 40 : n * s + 40, H = W, L = [];
  const X = x => o + x * s, Y = y => (four ? o : n * s + 20) - y * s;
  for (let i = four ? -n : 0; i <= n; i++) { L.push(`<line x1="${X(i)}" y1="${Y(four ? -n : 0)}" x2="${X(i)}" y2="${Y(n)}" stroke="#dee2e6"/>`, `<line x1="${X(four ? -n : 0)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#dee2e6"/>`);
    if (i) L.push(`<text x="${X(i)}" y="${Y(0) + 15}" font-size="11" text-anchor="middle" fill="${INK}">${String(i).replace('-', '−')}</text><text x="${X(0) - 8}" y="${Y(i) + 4}" font-size="11" text-anchor="end" fill="${INK}">${String(i).replace('-', '−')}</text>`); }
  L.push(`<line x1="${X(four ? -n : 0)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}" stroke="${INK}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(four ? -n : 0)}" x2="${X(0)}" y2="${Y(n)}" stroke="${INK}" stroke-width="2"/>`);
  L.push(`<text x="${X(n) + 4}" y="${Y(0) + 4}" font-size="13" font-weight="700" fill="${INK}">x</text><text x="${X(0) + 4}" y="${Y(n) - 4}" font-size="13" font-weight="700" fill="${INK}">y</text>`);
  pts.forEach(([x, y, l, c = '#ff6b4a']) => L.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${c}"/>${l ? `<text x="${X(x) + 9}" y="${Y(y) - 8}" font-size="13" font-weight="700" fill="${c}">${l}</text>` : ''}`));
  return `<svg class="lpic" viewBox="0 0 ${W + 12} ${H}" width="${Math.min(W + 12, 300)}" role="img" aria-label="coordinate grid">${L.join('')}</svg>`;
}
