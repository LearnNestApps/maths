// Drawings for Logic & coding: Venn diagrams and logic gates.
export const VENN = { W: 400, H: 260, A: { cx: 150, cy: 138, r: 98 }, B: { cx: 250, cy: 138, r: 98 } };
export const regionAt = (x, y) => {
  const inA = (x - VENN.A.cx) ** 2 + (y - VENN.A.cy) ** 2 <= VENN.A.r ** 2, inB = (x - VENN.B.cx) ** 2 + (y - VENN.B.cy) ** 2 <= VENN.B.r ** 2;
  return inA && inB ? 'ab' : inA ? 'a' : inB ? 'b' : 'none';
};
// Spots for numbers inside each region (used for tap placement and the read-only diagrams).
const SPOTS = { a: [[100, 110], [92, 150], [112, 188], [80, 130], [120, 80]], b: [[300, 110], [308, 150], [288, 188], [320, 130], [280, 80]], ab: [[200, 105], [200, 140], [200, 175], [200, 70]], none: [[30, 30], [370, 30], [30, 235], [370, 235], [200, 245], [30, 130]] };
export const spot = (region, k) => SPOTS[region][k % SPOTS[region].length];
export function vennSvg(la, lb, items = [], cls = '') {
  const count = { a: 0, b: 0, ab: 0, none: 0 };
  const nums = items.map(it => { const [x, y] = spot(it.region, count[it.region]++); return `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">${it.v}</text>`; }).join('');
  return `<svg class="venn ${cls}" viewBox="0 0 ${VENN.W} ${VENN.H}"><rect class="vu" x="3" y="3" width="394" height="254" rx="14"/>
    <circle class="va" cx="${VENN.A.cx}" cy="${VENN.A.cy}" r="${VENN.A.r}"/><circle class="vb" cx="${VENN.B.cx}" cy="${VENN.B.cy}" r="${VENN.B.r}"/>
    <text class="vl" x="${VENN.A.cx - 40}" y="30" text-anchor="middle">A: ${la}</text><text class="vl" x="${VENN.B.cx + 40}" y="30" text-anchor="middle">B: ${lb}</text>${nums}</svg>`;
}

// Gate symbols (100×60), inputs on the left at y=18 and y=42, output at the right at y=30.
export const GATE = {
  AND: '<path d="M20 6h30a24 24 0 0 1 0 48H20z"/>',
  OR: '<path d="M16 6q16 24 0 48h26q26-6 40-24Q68 12 42 6z"/>',
  XOR: '<path d="M22 6q16 24 0 48h24q26-6 38-24Q70 12 46 6z"/><path d="M12 6q16 24 0 48" fill="none"/>',
  NOT: '<path d="M24 8 70 30 24 52z"/><circle cx="76" cy="30" r="6"/>',
  NAND: '<path d="M16 6h28a24 24 0 0 1 0 48H16z"/><circle cx="76" cy="30" r="6"/>'
};
