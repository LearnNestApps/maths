import { R } from './region.js';
// All drawings are inline SVG so the app works offline with no image files.
export const PIP = (c = '') => `<svg class="pip ${c}" viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="190" rx="52" ry="8" fill="#1d2b5333"/><g class="pip-b"><path class="arm l" d="M44 118q-28 4-34-18"/><path class="arm r" d="M156 116q30-6 30-40"/><path d="M100 26c48 0 72 40 72 86s-30 70-72 70-72-24-72-70 24-86 72-86z" fill="#ff8a3d"/><ellipse cx="78" cy="50" rx="20" ry="10" fill="#ffffff40" transform="rotate(-25 78 50)"/><path d="M94 28c-6-14 2-22 8-24 0 8 4 14 10 18" fill="#ff8a3d"/><ellipse cx="100" cy="140" rx="44" ry="32" fill="#ffd9a8"/><g class="eyes"><circle cx="76" cy="92" r="17" fill="#fff"/><circle cx="124" cy="92" r="17" fill="#fff"/><circle class="pu" cx="79" cy="95" r="9" fill="#1d2b53"/><circle class="pu" cx="121" cy="95" r="9" fill="#1d2b53"/><circle cx="82" cy="91" r="3" fill="#fff"/><circle cx="124" cy="91" r="3" fill="#fff"/></g><path d="M84 120q16 16 32 0" stroke="#1d2b53" stroke-width="5" fill="#ff6b4a" stroke-linecap="round" stroke-linejoin="round"/><circle cx="58" cy="116" r="8" fill="#ff6b8a" opacity=".5"/><circle cx="142" cy="116" r="8" fill="#ff6b8a" opacity=".5"/><ellipse cx="78" cy="182" rx="16" ry="8" fill="#e8702a"/><ellipse cx="122" cy="182" rx="16" ry="8" fill="#e8702a"/></g></svg>`;

const sv = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" aria-hidden="true">${d}</svg>`;
const st = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
export const ICON = {
  home: sv(`<path d="M4 11.5 12 4l8 7.5M6.5 9.5V20h11V9.5" ${st}/><path d="M10 20v-5h4v5" ${st}/>`),
  close: sv(`<path d="M6 6l12 12M18 6 6 18" ${st}/>`),
  speak: sv(`<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" ${st}/>`),
  chart: sv(`<path d="M4 20V11M10 20V5M16 20v-6M2.5 20.5h19" ${st}/>`),
  gear: sv(`<circle cx="12" cy="12" r="3.4" ${st}/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" ${st}/>`),
  play: sv('<path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z" fill="currentColor"/>'),
  back: sv(`<path d="M15 5l-7 7 7 7" ${st}/>`),
  check: sv(`<path d="M5 12.5l4.5 4.5L19 7.5" ${st} stroke-width="3"/>`),
  bulb: sv(`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" ${st}/>`),
  lock: sv(`<rect x="5" y="11" width="14" height="9" rx="2" ${st}/><path d="M8 11V8a4 4 0 0 1 8 0v3" ${st}/>`),
  coin: sv('<circle cx="12" cy="12" r="9" fill="#ffd23f"/><circle cx="12" cy="12" r="6" fill="none" stroke="#e0a800" stroke-width="2"/>'),
  star: sv('<path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" stroke-linejoin="round"/>'),
  flag: sv(`<path d="M6 21V4M6 4h11l-2 4 2 4H6" ${st}/>`),
  replay: sv(`<path d="M5 12a7 7 0 1 0 2.1-5" ${st} stroke-width="2.8"/><path d="M4 3v5h5" ${st} stroke-width="2.8"/>`)
};

// Lesson icons (100×100), coloured, used on skill cards.
const S = (d) => `<svg viewBox="0 0 100 100" aria-hidden="true">${d}</svg>`;
export const SKILL_ICON = {
  count: S('<circle cx="30" cy="62" r="16" fill="#ff6b6b"/><circle cx="58" cy="44" r="16" fill="#ff6b6b"/><circle cx="76" cy="72" r="16" fill="#ff6b6b"/><path d="M30 46q2-8 8-10M58 28q2-8 8-10M76 56q2-8 8-10" stroke="#3fae4f" stroke-width="4" fill="none" stroke-linecap="round"/>'),
  shapes: S('<circle cx="30" cy="66" r="22" fill="#4dabf7"/><rect x="50" y="46" width="40" height="40" rx="7" fill="#ff6b6b"/><path d="M50 10 72 46H28z" fill="#ffd23f" stroke="#ffd23f" stroke-width="6" stroke-linejoin="round"/>'),
  balance: S('<rect x="46" y="22" width="8" height="64" rx="4" fill="#a86f48"/><rect x="30" y="84" width="40" height="8" rx="4" fill="#8a5a3b"/><path d="M14 30H86" stroke="#8a5a3b" stroke-width="7" stroke-linecap="round"/><path d="M2 52h24a12 7 0 0 1-24 0zM74 52h24a12 7 0 0 1-24 0z" fill="#ffd23f"/><path d="M14 30 4 52M14 30 24 52M86 30 76 52M86 30 96 52" stroke="#6b4a30" stroke-width="2"/>'),
  abacus: S('<rect x="10" y="12" width="80" height="76" rx="8" fill="none" stroke="#8a5a3b" stroke-width="6"/><path d="M10 36h80" stroke="#8a5a3b" stroke-width="5"/><path d="M30 14v72M50 14v72M70 14v72" stroke="#c9a27a" stroke-width="3"/><g fill="#ff8a3d"><ellipse cx="30" cy="28" rx="10" ry="6"/><ellipse cx="50" cy="44" rx="10" ry="6"/><ellipse cx="50" cy="56" rx="10" ry="6"/><ellipse cx="70" cy="44" rx="10" ry="6"/></g>'),
  clock: S('<circle cx="50" cy="52" r="38" fill="#fff" stroke="#4f5bd5" stroke-width="6"/><path d="M50 52V28M50 52l16 10" stroke="#1d2b53" stroke-width="6" stroke-linecap="round"/>'),
  plus: S('<rect x="10" y="10" width="80" height="80" rx="18" fill="#3fae4f"/><path d="M50 28v44M28 50h44" stroke="#fff" stroke-width="10" stroke-linecap="round"/>'),
  times: S('<rect x="10" y="10" width="80" height="80" rx="18" fill="#ff8a3d"/><path d="M33 33l34 34M67 33 33 67" stroke="#fff" stroke-width="10" stroke-linecap="round"/>'),
  fraction: S('<rect x="10" y="20" width="80" height="22" rx="5" fill="#e8ecff" stroke="#4f5bd5" stroke-width="3"/><rect x="10" y="20" width="53" height="22" rx="5" fill="#4f5bd5"/><rect x="10" y="58" width="80" height="22" rx="5" fill="#ffeede" stroke="#ff8a3d" stroke-width="3"/><rect x="10" y="58" width="40" height="22" rx="5" fill="#ff8a3d"/>'),
  bar: S('<rect x="8" y="30" width="52" height="24" rx="4" fill="#ff6b6b"/><rect x="60" y="30" width="32" height="24" rx="4" fill="#4dabf7"/><path d="M8 22q0-8 8-8h68q8 0 8 8" fill="none" stroke="#1d2b53" stroke-width="4"/><text x="76" y="80" font-size="26" font-weight="800" fill="#1d2b53" text-anchor="middle">?</text>'),
  numline: S('<path d="M6 60h88" stroke="#1d2b53" stroke-width="5" stroke-linecap="round"/><path d="M16 50v20M38 50v20M60 50v20M82 50v20" stroke="#1d2b53" stroke-width="4"/><path d="M60 22l10 14H50z" fill="#ff6b4a"/>'),
  series: S('<g fill="#9775fa"><rect x="8" y="58" width="14" height="22" rx="3"/><rect x="28" y="46" width="14" height="34" rx="3"/><rect x="48" y="34" width="14" height="46" rx="3"/><rect x="68" y="22" width="14" height="58" rx="3"/></g><path d="M70 12h20M80 4v16" stroke="#ff6b4a" stroke-width="4" stroke-linecap="round"/>'),
  vedic: S('<circle cx="50" cy="50" r="40" fill="#ffb020"/><circle cx="50" cy="50" r="28" fill="none" stroke="#fff" stroke-width="4"/><path d="M50 22v56M22 50h56M30 30l40 40M70 30 30 70" stroke="#fff" stroke-width="3"/>'),
  cross: S('<g font-size="26" font-weight="800" fill="#1d2b53" text-anchor="middle"><text x="34" y="38">2</text><text x="66" y="38">3</text><text x="34" y="80">4</text><text x="66" y="80">1</text></g><path d="M34 46v14M66 46v14M40 46l20 14M60 46 40 60" stroke="#ff6b4a" stroke-width="4" stroke-linecap="round"/>'),
  eq: S('<rect x="10" y="10" width="80" height="80" rx="18" fill="#4f5bd5"/><text x="50" y="62" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">x=?</text>'),
  expr: S('<rect x="10" y="10" width="80" height="80" rx="18" fill="#22b8cf"/><text x="50" y="62" font-size="28" font-weight="800" fill="#fff" text-anchor="middle">2x+3x</text>'),
  graph: S('<path d="M14 86V12M14 86h76" stroke="#1d2b53" stroke-width="4"/><path d="M14 80 86 20" stroke="#ff6b4a" stroke-width="5" stroke-linecap="round"/><circle cx="38" cy="60" r="6" fill="#4f5bd5"/><circle cx="62" cy="40" r="6" fill="#4f5bd5"/>'),
  speed: S('<path d="M14 70a36 36 0 1 1 72 0" fill="none" stroke="#1d2b53" stroke-width="6" stroke-linecap="round"/><path d="M50 70 72 38" stroke="#ff6b4a" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="70" r="7" fill="#1d2b53"/>'),
  mock: S('<rect x="18" y="10" width="64" height="80" rx="8" fill="#fff" stroke="#1d2b53" stroke-width="4"/><g fill="#1d2b53"><circle cx="34" cy="32" r="5"/><circle cx="34" cy="50" r="5"/><circle cx="34" cy="68" r="5"/></g><path d="M46 32h24M46 50h24M46 68h24" stroke="#1d2b53" stroke-width="4" stroke-linecap="round"/><path d="M28 50l5 5 9-10" stroke="#3fae4f" stroke-width="4" fill="none"/>'),
  puzzle: S('<path d="M20 20h24a8 8 0 1 1 12 0h24v24a8 8 0 1 0 0 12v24H56a8 8 0 1 0-12 0H20V56a8 8 0 1 1 0-12z" fill="#9775fa"/>')
};

// Countable objects for the youngest learners.
export const OBJ = {
  apples: '<svg viewBox="0 0 60 60"><path d="M30 14c-6-6-20-4-22 10s6 30 14 30c4 0 5-2 8-2s4 2 8 2c8 0 16-16 14-30S36 8 30 14z" fill="#ff4b4b"/><path d="M30 14c0-6 2-9 6-11" stroke="#6b4a30" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M33 9c6-4 12-2 14 1-5 3-10 3-14-1z" fill="#3fae4f"/><ellipse cx="20" cy="26" rx="4" ry="7" fill="#fff6"/></svg>',
  stars: '<svg viewBox="0 0 60 60"><path d="M30 5l7.6 15.4 17 2.5-12.3 12 2.9 16.9L30 43.8l-15.2 8 2.9-16.9-12.3-12 17-2.5z" fill="#ffd23f" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/><circle cx="25" cy="28" r="2.5" fill="#1d2b53"/><circle cx="35" cy="28" r="2.5" fill="#1d2b53"/></svg>',
  balloons: '<svg viewBox="0 0 60 60"><ellipse cx="30" cy="24" rx="16" ry="19" fill="#9775fa"/><path d="M30 43l-3 4h6z" fill="#9775fa"/><path d="M30 47q-4 6 0 12" stroke="#1d2b53" stroke-width="1.6" fill="none"/><ellipse cx="24" cy="16" rx="4" ry="6" fill="#fff6"/></svg>'
};

const starPath = (() => { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 20 : 46, a = -Math.PI / 2 + Math.PI * i / 5; p.push((50 + r * Math.cos(a)).toFixed(1) + ' ' + (54 + r * Math.sin(a)).toFixed(1)); } return 'M' + p.join('L') + 'Z'; })();
export const SHAPES = {
  circle: { g: '<circle cx="50" cy="50" r="42"/>', c: '#4dabf7', e: 46 },
  square: { g: '<rect x="9" y="9" width="82" height="82" rx="8"/>', c: '#ff6b6b', e: 44 },
  triangle: { g: '<path d="M50 7 95 89H5z"/>', c: '#ffd23f', e: 62 },
  star: { g: `<path d="${starPath}"/>`, c: '#ff8a3d', e: 52 },
  rectangle: { g: '<rect x="3" y="24" width="94" height="52" rx="7"/>', c: '#5cc96b', e: 44 },
  heart: { g: '<path d="M50 88C20 66 6 50 6 32 6 18 17 8 30 8c10 0 17 6 20 14 3-8 10-14 20-14 13 0 24 10 24 24 0 18-14 34-44 56z"/>', c: '#ff6b8a', e: 38 }
};
export function shapeSvg(k, outline = false) {
  const s = SHAPES[k];
  if (outline) return `<svg viewBox="0 0 100 100" style="overflow:visible"><g fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".55" stroke-width="3" stroke-dasharray="8 6" stroke-linejoin="round">${s.g}</g></svg>`;
  return `<svg viewBox="0 0 100 100"><g fill="${s.c}" stroke="#0002" stroke-width="3" stroke-linejoin="round">${s.g}</g><g fill="#fff"><circle cx="39" cy="${s.e}" r="7"/><circle cx="61" cy="${s.e}" r="7"/></g><g fill="#1d2b53"><circle cx="40" cy="${s.e + 1}" r="3.6"/><circle cx="60" cy="${s.e + 1}" r="3.6"/></g><path d="M43 ${s.e + 12}q7 6 14 0" stroke="#1d2b53" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
}
const burst = (() => { let d = ''; for (let i = 0; i < 32; i++) { const r = i % 2 ? 42 : 48, a = Math.PI * i / 16; d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); } return d + 'Z'; })();
export const sticker = (icon, i = 0) => `<svg viewBox="0 0 100 100" class="stkr" style="--r:${(i * 37) % 17 - 8}deg"><path d="${burst}" fill="#fff"/><circle cx="50" cy="50" r="37" fill="#ffd23f" fill-opacity=".35"/><g transform="translate(21 21) scale(.58)">${(SKILL_ICON[icon] || SKILL_ICON.count).replace(/<\/?svg[^>]*>/g, '')}</g></svg>`;

// Icons for the JK–Grade 2 lessons.
Object.assign(SKILL_ICON, {
  dots: S('<rect x="8" y="8" width="84" height="84" rx="18" fill="#fff" stroke="#1d2b5333" stroke-width="4"/><g fill="#ff6b4a"><circle cx="30" cy="30" r="10"/><circle cx="50" cy="50" r="10"/><circle cx="70" cy="70" r="10"/></g>'),
  sort: S('<path d="M10 50h34l-4 38H14zM56 50h34l-4 38H60z" fill="#ced4da"/><circle cx="27" cy="38" r="12" fill="#ff5c5c"/><circle cx="73" cy="38" r="12" fill="#4dabf7"/><circle cx="27" cy="66" r="8" fill="#ff5c5c"/><circle cx="73" cy="66" r="8" fill="#4dabf7"/>'),
  pattern: S('<circle cx="16" cy="58" r="13" fill="#ff6b6b"/><circle cx="36" cy="54" r="13" fill="#4dabf7"/><circle cx="56" cy="58" r="13" fill="#ff6b6b"/><circle cx="76" cy="54" r="13" fill="none" stroke="#1d2b53" stroke-width="3" stroke-dasharray="5 4"/><circle cx="90" cy="40" r="9" fill="#5cc96b"/>'),
  compare: S('<g fill="#ff6b6b"><circle cx="20" cy="30" r="9"/><circle cx="20" cy="54" r="9"/><circle cx="20" cy="78" r="9"/></g><g fill="#4dabf7"><circle cx="80" cy="54" r="9"/></g><path d="M38 40 62 54 38 68" fill="none" stroke="#1d2b53" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
  size: S('<circle cx="30" cy="62" r="24" fill="#4dabf7"/><circle cx="66" cy="72" r="14" fill="#4dabf7"/><circle cx="86" cy="78" r="8" fill="#4dabf7"/>'),
  flower: S('<path d="M30 92V54M70 92V30" stroke="#3fae4f" stroke-width="5"/><circle cx="30" cy="48" r="11" fill="#ff6b8a"/><circle cx="70" cy="24" r="13" fill="#9775fa"/><circle cx="30" cy="48" r="4" fill="#ffd23f"/><circle cx="70" cy="24" r="5" fill="#ffd23f"/>'),
  position: S('<rect x="14" y="40" width="72" height="9" rx="3" fill="#a86f48"/><rect x="20" y="49" width="7" height="40" fill="#8a5a3b"/><rect x="73" y="49" width="7" height="40" fill="#8a5a3b"/><ellipse cx="50" cy="78" rx="14" ry="11" fill="#ff8a3d"/><path d="M38 72l3-10 6 6M62 72l-3-10-6 6" fill="#ff8a3d"/>'),
  frog: S('<ellipse cx="50" cy="64" rx="38" ry="26" fill="#5cc96b"/><circle cx="31" cy="40" r="13" fill="#5cc96b"/><circle cx="69" cy="40" r="13" fill="#5cc96b"/><circle cx="31" cy="39" r="7" fill="#fff"/><circle cx="69" cy="39" r="7" fill="#fff"/><circle cx="32" cy="40" r="3.5" fill="#1d2b53"/><circle cx="68" cy="40" r="3.5" fill="#1d2b53"/><path d="M33 66q17 13 34 0" stroke="#1d2b53" stroke-width="4" fill="none" stroke-linecap="round"/>'),
  numeral: S('<rect x="8" y="8" width="84" height="84" rx="18" fill="#ffd23f"/><text x="50" y="72" text-anchor="middle" font-size="60" font-weight="800" fill="#1d2b53">7</text>'),
  bug: S('<circle cx="50" cy="26" r="12" fill="#1d2b53"/><ellipse cx="50" cy="58" rx="32" ry="30" fill="#ff4b4b"/><path d="M50 28v60" stroke="#1d2b53" stroke-width="3"/><g fill="#1d2b53"><circle cx="36" cy="50" r="6"/><circle cx="64" cy="50" r="6"/><circle cx="38" cy="72" r="5"/><circle cx="62" cy="72" r="5"/></g>'),
  track: S('<g font-size="24" font-weight="800" text-anchor="middle" fill="#1d2b53"><rect x="4" y="34" width="28" height="32" rx="6" fill="#fff"/><text x="18" y="59">4</text><rect x="36" y="34" width="28" height="32" rx="6" fill="#ffd23f"/><text x="50" y="59">5</text><rect x="68" y="34" width="28" height="32" rx="6" fill="#fff" stroke="#ff6b4a" stroke-width="3" stroke-dasharray="4 3"/><text x="82" y="59" fill="#ff6b4a">?</text></g>'),
  tenframe: S('<g stroke="#1d2b5355" stroke-width="2" fill="#fff">' + [0, 1, 2, 3, 4].map(i => `<rect x="${6 + i * 18}" y="30" width="16" height="18"/><rect x="${6 + i * 18}" y="50" width="16" height="18"/>`).join('') + '</g><g fill="#ff6b4a">' + [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${14 + (i % 5) * 18}" cy="${39 + Math.floor(i / 5) * 20}" r="6"/>`).join('') + '</g>'),
  duck: S('<ellipse cx="44" cy="62" rx="32" ry="24" fill="#ffd23f"/><circle cx="66" cy="36" r="17" fill="#ffd23f"/><path d="M80 34l14 4-14 6z" fill="#ff8a3d"/><circle cx="70" cy="32" r="3.5" fill="#1d2b53"/>'),
  bird: S('<ellipse cx="44" cy="58" rx="32" ry="22" fill="#4dabf7"/><circle cx="70" cy="40" r="15" fill="#4dabf7"/><path d="M83 38l12 4-12 5z" fill="#ff8a3d"/><circle cx="73" cy="36" r="3.5" fill="#1d2b53"/><path d="M24 54q16-24 34-4" fill="#0002"/>'),
  solid: S('<path d="M14 40 40 28l26 12v32L40 86 14 72z" fill="#4dabf7"/><path d="M14 40l26 12 26-12-26-12z" fill="#a5d8ff"/><circle cx="76" cy="36" r="18" fill="#ff6b6b"/>'),
  grid: S('<g fill="#fff" stroke="#1d2b5355" stroke-width="2">' + Array.from({ length: 16 }, (_, i) => `<rect x="${10 + (i % 4) * 20}" y="${10 + Math.floor(i / 4) * 20}" width="20" height="20"/>`).join('') + '</g><rect x="50" y="30" width="20" height="20" fill="#ffd23f" stroke="#1d2b53" stroke-width="2"/>'),
  blocks: S('<g fill="#4dabf7" stroke="#1c7ed6">' + [0, 1, 2].map(k => Array.from({ length: 10 }, (_, i) => `<rect x="${10 + k * 18}" y="${8 + i * 8.4}" width="14" height="8"/>`).join('')).join('') + '</g><g fill="#ff8a3d" stroke="#d9661c"><rect x="68" y="76" width="12" height="12"/><rect x="82" y="76" width="12" height="12"/><rect x="68" y="62" width="12" height="12"/></g>'),
  minus: S('<rect x="10" y="10" width="80" height="80" rx="18" fill="#4dabf7"/><path d="M28 50h44" stroke="#fff" stroke-width="10" stroke-linecap="round"/>'),
  calendar: S('<rect x="12" y="18" width="76" height="70" rx="8" fill="#fff" stroke="#1d2b53" stroke-width="4"/><rect x="12" y="18" width="76" height="18" rx="8" fill="#ff6b4a"/><g fill="#1d2b5355">' + Array.from({ length: 12 }, (_, i) => `<rect x="${20 + (i % 4) * 16}" y="${44 + Math.floor(i / 4) * 14}" width="10" height="9" rx="2"/>`).join('') + '</g>'),
  get coin() { return S(`<circle cx="40" cy="56" r="28" fill="#e8c26b" stroke="#b8860b" stroke-width="4"/><circle cx="66" cy="40" r="24" fill="#ced4da" stroke="#868e96" stroke-width="4"/><text x="66" y="48" text-anchor="middle" font-size="22" font-weight="800" fill="#1d2b53">${R().sym}</text>`); },
  ruler: S('<rect x="6" y="40" width="88" height="26" rx="3" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/><g stroke="#1d2b53" stroke-width="2">' + Array.from({ length: 9 }, (_, i) => `<path d="M${14 + i * 9.5} 40v${i % 2 ? 7 : 12}"/>`).join('') + '</g>'),
  array: S('<g fill="#9775fa">' + Array.from({ length: 12 }, (_, i) => `<circle cx="${20 + (i % 4) * 20}" cy="${30 + Math.floor(i / 4) * 20}" r="7"/>`).join('') + '</g>'),
  cookie: S('<ellipse cx="50" cy="66" rx="44" ry="18" fill="#fff" stroke="#1d2b5333" stroke-width="3"/><circle cx="36" cy="54" r="14" fill="#e0a35c"/><circle cx="64" cy="54" r="14" fill="#e0a35c"/><g fill="#6b4a30"><circle cx="32" cy="50" r="2.5"/><circle cx="40" cy="57" r="2.5"/><circle cx="60" cy="50" r="2.5"/><circle cx="68" cy="57" r="2.5"/></g>'),
  pairs: S('<g fill="#51cf66"><circle cx="26" cy="26" r="9"/><circle cx="50" cy="26" r="9"/><circle cx="26" cy="52" r="9"/><circle cx="50" cy="52" r="9"/><circle cx="26" cy="78" r="9"/></g><circle cx="50" cy="78" r="9" fill="none" stroke="#1d2b5355" stroke-width="3" stroke-dasharray="4 3"/><text x="80" y="62" text-anchor="middle" font-size="26" font-weight="800" fill="#1d2b53">?</text>'),
  mirror: S('<ellipse cx="32" cy="42" rx="18" ry="22" fill="#9775fa"/><ellipse cx="68" cy="42" rx="18" ry="22" fill="#9775fa"/><ellipse cx="34" cy="72" rx="13" ry="12" fill="#da77f2"/><ellipse cx="66" cy="72" rx="13" ry="12" fill="#da77f2"/><path d="M50 6v88" stroke="#e03131" stroke-width="3" stroke-dasharray="6 5"/>')
});

// Icons for Tricks and Logic & coding.
Object.assign(SKILL_ICON, {
  bulb: S('<path d="M50 10a28 28 0 0 0-16 51c4 3 6 7 6 12h20c0-5 2-9 6-12a28 28 0 0 0-16-51z" fill="#ffd23f"/><rect x="38" y="76" width="24" height="12" rx="4" fill="#868e96"/><path d="M42 44l8 10 8-10" fill="none" stroke="#e0a800" stroke-width="4" stroke-linecap="round"/>'),
  venn: S('<circle cx="38" cy="52" r="28" fill="#4dabf7" fill-opacity=".55"/><circle cx="62" cy="52" r="28" fill="#ff6b6b" fill-opacity=".55"/>'),
  gate: S('<path d="M8 38h20M8 62h20M78 50h14" stroke="#1d2b53" stroke-width="4"/><path d="M28 28h22a22 22 0 0 1 0 44H28z" fill="#9775fa"/><circle cx="88" cy="50" r="8" fill="#ffd23f"/>'),
  code: S('<rect x="8" y="14" width="84" height="72" rx="10" fill="#1d2b53"/><path d="M30 38 20 50l10 12M70 38l10 12-10 12M56 32 44 68" fill="none" stroke="#69db7c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
  robot: S('<rect x="22" y="30" width="56" height="50" rx="12" fill="#4dabf7"/><rect x="32" y="42" width="36" height="18" rx="9" fill="#fff"/><circle cx="42" cy="51" r="4" fill="#1d2b53"/><circle cx="58" cy="51" r="4" fill="#1d2b53"/><path d="M50 30V16" stroke="#1d2b53" stroke-width="4"/><circle cx="50" cy="13" r="6" fill="#ff6b4a"/>'),
  binary: S('<g font-size="26" font-weight="800" text-anchor="middle"><text x="22" y="62" fill="#1d2b53">1</text><text x="50" y="62" fill="#adb5bd">0</text><text x="78" y="62" fill="#1d2b53">1</text></g><circle cx="22" cy="24" r="10" fill="#ffd23f"/><circle cx="50" cy="24" r="10" fill="#dee2e6"/><circle cx="78" cy="24" r="10" fill="#ffd23f"/>'),
  order: S('<g font-size="18" font-weight="800" fill="#fff" text-anchor="middle"><rect x="10" y="12" width="80" height="20" rx="6" fill="#4dabf7"/><text x="22" y="28">1</text><rect x="10" y="40" width="80" height="20" rx="6" fill="#51cf66"/><text x="22" y="56">2</text><rect x="10" y="68" width="80" height="20" rx="6" fill="#ff8a3d"/><text x="22" y="84">3</text></g>')
});
