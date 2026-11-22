// Question generators for JK to Grade 2 (Little Learners). Prompts are short and spoken aloud.
import { rnd, pick, shuffle, choices } from '../core/ui.js';
import { timeText } from '../core/i18n.js';
import { OBJ, shapeSvg } from '../core/art.js';
import { FLOWER, BUG, CHICK } from '../core/art_pond.js';
import { R, coinLabel, amountLabel, isUS, U } from '../core/region.js';
import { dots, tenFrame, BALL, BIRD, COL, positionScene, SOLID, COIN, NOTE, PENCIL, fracShape, SYM, FRUIT, FEATHER, ROCK, UNIT } from '../core/art_little.js';

const N = n => `<span class="tn">${n}</span>`;
const c = (svg, cls = '') => `<i class="c ${cls}">${svg}</i>`;
const many = (svg, n, cls = '') => Array.from({ length: n }, () => c(svg, cls)).join('');
const numTiles = (ans, k, lo, hi) => { const o = choices(ans, k, lo, hi); return { tiles: o.map(N), labels: o.map(String), answer: o.indexOf(ans) }; };
const P = (prompt, answer, data, hint, solution, extra = {}) => ({ template: 'pick', prompt, answer, data, hint, solution: [].concat(solution), ...extra });
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const GEN_LITTLE = {
  // ---------- JK ----------
  subitize({ max = 3 } = {}) {
    const n = rnd(1, max), o = numTiles(n, Math.min(3, max), 1, max);
    return P('How many dots? Look quickly!', o.answer, { scene: `<div class="bigpic">${dots(n)}</div>`, flash: max <= 3 ? 1500 : 1800, tiles: o.tiles, labels: o.labels }, 'Look again. Can you see the dots without counting?', `${n} dots`);
  },
  sortColor() {
    const [a, b] = shuffle(['red', 'blue', 'yellow', 'green']).slice(0, 2);
    const items = shuffle([...Array(3).fill(0), ...Array(3).fill(1)]).map(bin => ({ html: BALL(COL[bin ? b : a]), bin }));
    return { template: 'sort', prompt: `Sort the balls: ${a} balls in one box, ${b} balls in the other.`, answer: 'done', data: { items, bins: [BALL(COL[a]), BALL(COL[b])] }, hint: 'Match the colour of each ball to the colour on the box.', solution: [`${a} → ${a} box, ${b} → ${b} box`] };
  },
  sortSize() {
    const items = shuffle([...Array(3).fill(0), ...Array(3).fill(1)]).map(bin => ({ html: BALL(COL[pick(['red', 'blue', 'green', 'orange'])], bin ? .45 : 1), bin }));
    return { template: 'sort', prompt: 'Put the big balls in one box and the small balls in the other.', answer: 'done', data: { items, bins: [BALL('#adb5bd', 1), BALL('#adb5bd', .45)] }, hint: 'Is it big or small? Look at the picture on each box.', solution: ['Big balls → big box, small balls → small box'] };
  },
  pattern({ lv = 0 } = {}) {
    const unit = pick(lv === 0 ? ['AB'] : lv === 1 ? ['AAB', 'ABB', 'ABC'] : ['AABB', 'ABC', 'AAB']);
    const letters = [...new Set(unit)], ids = shuffle([0, 1, 2, 3]), map = {}; letters.forEach((L, j) => map[L] = ids[j]);
    const len = Math.min(9, unit.length * 3), seq = [...Array(len)].map((_, j) => map[unit[j % unit.length]]);
    const miss = len - 1, ans = seq[miss];
    return { template: 'pattern', prompt: 'What comes next? Drag it onto the caterpillar.', answer: ans, data: { seq, miss, options: shuffle([ans, ...shuffle(ids.filter(v => v !== ans)).slice(0, 2)]) },
      hint: 'Say the colours out loud. What comes after?', solution: [`The pattern repeats: ${unit}`] };
  },
  moreGroup({ max = 5, fewer = false } = {}) {
    let a, b; do { a = rnd(1, max); b = rnd(1, max); } while (a === b);
    const thing = pick(['apples', 'stars', 'balloons']), ans = fewer ? (a < b ? 0 : 1) : (a > b ? 0 : 1);
    const scene = `<div class="groups">${[a, b].map((n, i) => `<button class="grpcard" data-opt="${i}" aria-label="Group ${i + 1}">${many(OBJ[thing], n, 'sm')}</button>`).join('')}</div>`;
    return P(`Tap the group with ${fewer ? 'fewer' : 'more'} ${thing}.`, ans, { scene, tapScene: true, count: true }, 'Count each group. Which number is bigger?', `${a} and ${b}`);
  },
  sizes({ ask = 'biggest' } = {}) {
    const k = ask === 'pick' ? pick(['biggest', 'smallest']) : ask, sz = shuffle([.45, .7, 1]), col = COL[pick(['red', 'blue', 'green', 'orange', 'purple'])];
    const ans = sz.indexOf(k === 'biggest' ? 1 : .45);
    return P(`Tap the ${k} ball.`, ans, { scene: `<div class="row3">${sz.map((s, i) => `<button class="opt3" data-opt="${i}" aria-label="Ball ${i + 1}">${BALL(col, s)}</button>`).join('')}</div>`, tapScene: true }, `Look at all three. Which is the ${k}?`, `The ${k} ball`);
  },
  heights({ ask = 'tallest' } = {}) {
    const k = ask === 'pick' ? pick(['tallest', 'shortest']) : ask, hs = shuffle([2, 3, 4, 5, 6]).slice(0, 3), best = k === 'tallest' ? Math.max(...hs) : Math.min(...hs);
    const cols = shuffle(['#ff6b8a', '#9775fa', '#ff8a3d', '#4dabf7']);
    const scene = `<div class="garden">${hs.map((u, i) => `<button class="mflower" data-opt="${i}" style="--h:${u}" aria-label="Flower ${i + 1}"><span class="hd">${FLOWER(cols[i])}</span><span class="stem"></span></button>`).join('')}</div>`;
    return P(`Tap the ${k} flower.`, hs.indexOf(best), { scene, tapScene: true }, `Look at the tops of the flowers.`, `The ${k} flower`);
  },
  heavier() {
    const pairs = [[ROCK, FEATHER, 'rock', 'feather'], [OBJ.apples, FEATHER, 'apple', 'feather'], [ROCK, OBJ.balloons, 'rock', 'balloon']];
    const [heavy, light] = pick(pairs), left = Math.random() < .5;
    const items = left ? [heavy, light] : [light, heavy], tilt = left ? -14 : 14;
    const scene = `<div class="miniscale" style="--tilt:${tilt}deg"><div class="mbeam"><button class="mpan l" data-opt="0" aria-label="Left">${items[0]}</button><button class="mpan r" data-opt="1" aria-label="Right">${items[1]}</button></div><i class="mpost"></i></div>`;
    return P('Which one is heavier? Tap it.', left ? 0 : 1, { scene, tapScene: true }, 'The heavier side goes down.', 'The side that goes down is heavier');
  },
  position() {
    const opts = shuffle(['on', 'under', 'next', 'in']).slice(0, 3), want = pick(opts);
    const word = { on: 'on the table', under: 'under the table', next: 'next to the table', in: 'in the box' }[want];
    return P(`Find the cat ${word}.`, opts.indexOf(want), { tiles: opts.map(positionScene), labels: opts.map(o => 'Cat ' + o), wide: true }, `Look carefully: is the cat ${word}?`, `The cat is ${word}`);
  },

  // ---------- SK ----------
  feedFrog({ max = 10 } = {}) { const n = rnd(3, max); return { template: 'feed', prompt: `Feed the frog ${n} flies!`, answer: n, data: { n, total: Math.min(12, n + rnd(1, 3)) }, hint: 'Count each fly as you tap it. Stop when you reach the number.', solution: [Array.from({ length: n }, (_, i) => i + 1).join(', ')] }; },
  numeralMatch({ max = 10 } = {}) {
    const n = rnd(1, max), o = choices(n, 3, 1, max);
    return P(`Find the group with ${n}.`, o.indexOf(n), { scene: `<div class="bignum">${n}</div>`, tiles: o.map(k => dots(k)), labels: o.map(k => k + ' dots') }, 'Count the dots in each box.', `${n} dots`);
  },
  bugs({ max = 6 } = {}) {
    const n = rnd(1, max), o = numTiles(n, 3, 1, 10);
    return P('How many ladybugs?', o.answer, { scene: `<div class="leafy">${many(BUG, n)}</div>`, tiles: o.tiles, labels: o.labels, count: true }, 'Touch each ladybug as you count.', `${n} ladybugs`);
  },
  afterBefore({ max = 10 } = {}) {
    const after = Math.random() < .6, n = after ? rnd(1, max - 1) : rnd(2, max), ans = after ? n + 1 : n - 1, o = numTiles(ans, 3, 0, max + 1);
    const track = after ? `${n - 1 >= 0 ? `<b>${n - 1}</b>` : ''}<b class="hl">${n}</b><b class="qm">?</b>` : `<b class="qm">?</b><b class="hl">${n}</b><b>${n + 1}</b>`;
    return P(`What number comes ${after ? 'after' : 'before'} ${n}?`, o.answer, { scene: `<div class="track">${track}</div>`, tiles: o.tiles, labels: o.labels }, after ? 'Count on one more.' : 'Count back one.', `${after ? n + ' → ' + ans : ans + ' → ' + n}`);
  },
  oneMoreLess({ max = 10 } = {}) {
    const more = Math.random() < .5, n = more ? rnd(1, max - 1) : rnd(2, max), ans = more ? n + 1 : n - 1, o = numTiles(ans, 3, 0, max);
    return P(`What is one ${more ? 'more' : 'less'} than ${n}?`, o.answer, { scene: `<div class="bigpic">${tenFrame(n)}</div>`, tiles: o.tiles, labels: o.labels }, more ? 'Imagine adding one more dot.' : 'Imagine taking one dot away.', `${n} ${more ? '+' : '−'} 1 = ${ans}`);
  },
  addDucks({ max = 5 } = {}) {
    const a = rnd(1, max - 1), b = rnd(1, max - a), o = numTiles(a + b, 3, 1, max + 2);
    const scene = `<div class="eqscene"><span class="grp">${many(CHICK('#ffd23f'), a)}</span><b class="op">+</b><span class="grp">${many(CHICK('#8fd0ff'), b)}</span></div>`;
    return P(`${a} yellow ducks and ${b} blue ducks. How many ducks altogether?`, o.answer, { scene, tiles: o.tiles, labels: o.labels, count: true }, 'Count all the ducks together.', `${a} + ${b} = ${a + b}`);
  },
  birdsAway({ max = 5 } = {}) {
    const n = rnd(2, max), k = rnd(1, n - 1), o = numTiles(n - k, 3, 0, max);
    const scene = `<div class="birds">${Array.from({ length: n }, (_, i) => i < k ? `<i class="away">${BIRD('#adb5bd')}</i>` : c(BIRD())).join('')}</div>`;
    return P(`${n} birds. ${k} fly away. How many are left?`, o.answer, { scene, tiles: o.tiles, labels: o.labels, count: true }, 'Count only the birds still sitting.', `${n} − ${k} = ${n - k}`);
  },
  solids() {
    const names = { cube: 'box shape (cube)', sphere: 'ball shape (sphere)', cone: 'party-hat shape (cone)', cylinder: 'can shape (cylinder)' };
    const keys = shuffle(Object.keys(SOLID)).slice(0, 3), want = pick(keys);
    return P(`Tap the ${names[want]}.`, keys.indexOf(want), { tiles: keys.map(k => SOLID[k]), labels: keys }, `A ${names[want]}. Think of things at home with that shape.`, names[want]);
  },

  // ---------- Grade 1 ----------
  missing100() {
    const start = rnd(0, 9) * 10 + 1, row = Array.from({ length: 10 }, (_, i) => start + i), gap = rnd(1, 8), ans = row[gap], o = numTiles(ans, 3, 1, 100);
    return P('Which number is missing?', o.answer, { scene: `<div class="hrow">${row.map((v, i) => `<b class="${i === gap ? 'qm' : ''}">${i === gap ? '?' : v}</b>`).join('')}</div>`, tiles: o.tiles, labels: o.labels, wide: true }, 'Each box is one more than the box before.', `${row[gap - 1]} → ${ans} → ${row[gap + 1]}`);
  },
  skipCount({ steps = [2, 5, 10] } = {}) {
    const st = pick(steps), a = st * rnd(1, 5), seq = [0, 1, 2, 3].map(i => a + st * i), ans = a + st * 4, o = shuffle([ans - st, ans, ans + st]);
    return P(`Count in ${st}s. What comes next?`, o.indexOf(ans), { scene: `<div class="track">${seq.map(v => `<b>${v}</b>`).join('')}<b class="qm">?</b></div>`, tiles: o.map(N), labels: o.map(String) }, `Add ${st} each time.`, `${seq.join(', ')}, ${ans}`);
  },
  tensOnes({ places = 2 } = {}) {
    const n = places === 2 ? rnd(11, 99) : rnd(101, 999);
    const parts = places === 2 ? `${Math.floor(n / 10)} tens and ${n % 10} ones` : `${Math.floor(n / 100)} hundreds, ${Math.floor(n / 10) % 10} tens and ${n % 10} ones`;
    return { template: 'build', prompt: `Make ${n} with the blocks.`, answer: n, data: { places, target: n }, hint: `${n} is ${parts}.`, solution: [`${n} = ${parts}`] };
  },
  bonds10() {
    const a = rnd(1, 9), o = numTiles(10 - a, 3, 0, 10);
    return P(`${a} and how many more make 10?`, o.answer, { scene: `<div class="bigpic">${tenFrame(a)}</div>`, tiles: o.tiles, labels: o.labels }, 'Count the empty boxes in the ten-frame.', `${a} + ${10 - a} = 10`);
  },
  sentence({ max = 10, missing = false } = {}) {
    const a = rnd(1, max - 1), b = rnd(1, max - a), sum = a + b;
    if (missing) { const o = numTiles(b, 3, 0, max); return P('What is the missing number?', o.answer, { scene: `<div class="sent">${a} + <b class="qm">?</b> = ${sum}</div>`, tiles: o.tiles, labels: o.labels }, `Count on from ${a} to ${sum}.`, `${a} + ${b} = ${sum}`); }
    const o = numTiles(sum, 3, 1, max + 3);
    return P('What is the answer?', o.answer, { scene: `<div class="sent">${a} + ${b} = <b class="qm">?</b></div>`, tiles: o.tiles, labels: o.labels }, `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)}.`, `${a} + ${b} = ${sum}`, { say: `${a} plus ${b}` });
  },
  subtract({ max = 10 } = {}) {
    const a = rnd(3, max), b = rnd(1, a - 1), o = numTiles(a - b, 3, 0, max);
    const scene = `<div class="sent">${a} − ${b} = <b class="qm">?</b></div><div class="dotsrow">${Array.from({ length: a }, (_, i) => `<i class="dot${i >= a - b ? ' x' : ' c'}"></i>`).join('')}</div>`;
    return P('What is the answer?', o.answer, { scene, tiles: o.tiles, labels: o.labels, count: true }, 'Cross out the ones taken away, then count the rest.', `${a} − ${b} = ${a - b}`, { say: `${a} take away ${b}` });
  },
  compareNum({ max = 99 } = {}) {
    let a, b; do { a = rnd(10, max); b = rnd(10, max); } while (a === b || Math.abs(a - b) > 40);
    const ans = a > b ? 0 : 1;
    return P('Which number is bigger?', ans, { tiles: [N(a), N(b)], labels: [String(a), String(b)] }, 'Compare the tens first. If they are the same, compare the ones.', `${Math.max(a, b)} > ${Math.min(a, b)}`);
  },
  dayAfter() {
    const i = rnd(0, 6), ans = DAYS[(i + 1) % 7], o = shuffle([ans, ...shuffle(DAYS.filter(d => d !== ans && d !== DAYS[i])).slice(0, 2)]);
    return P(`Which day comes after ${DAYS[i]}?`, o.indexOf(ans), { tiles: o.map(d => `<span class="tw">${d}</span>`), labels: o }, 'Say the days of the week in order.', DAYS.join(', '));
  },
  coins({ max = 20, notes = false } = {}) {
    // Values are in the smallest unit (paise / cents / pence).
    const r = R(), step = notes || !r.minor ? 100 : 1;
    const pool = notes ? [...r.coins.filter(v => v >= 100), ...r.notes] : (r.minor ? r.coins.filter(v => v < 100) : r.coins.filter(v => v <= 1000));
    const cap = notes ? max * 100 : r.minor ? 99 : max * 100;
    let items = [], total = 0;
    for (let tries = 0; items.length < 6 && tries < 60; tries++) { const v = pick(pool); if (total + v > cap) { if (items.length >= 2) break; continue; } items.push(v); total += v; if (Math.random() < .15 && items.length >= 3) break; }
    if (items.length < 2) return GEN_LITTLE.coins({ max, notes });
    items.sort((x, y) => y - x);
    const o = choices(total / step, 3, 1, cap / step + 5).map(x => x * step), isNote = v => r.notes.includes(v) && (notes || v >= 1000);
    const scene = `<div class="money">${items.map(v => isNote(v) ? c(NOTE(coinLabel(v), r.notes.indexOf(v)), 'note') : c(COIN(coinLabel(v), r.coins.indexOf(v) / Math.max(1, r.coins.length - 1), r.gold.includes(v) || ((r.copper || []).includes(v) && 'copper')), 'coin')).join('')}</div>`;
    return P('How much money is this?', o.indexOf(total), { scene, tiles: o.map(v => N(amountLabel(v))), labels: o.map(amountLabel) }, 'Start with the biggest one and count on.', `${items.map(coinLabel).join(' + ')} = ${amountLabel(total)}`);
  },
  sides() {
    const shapes = { 3: '<path d="M50 8 92 86H8z"/>', 4: '<rect x="12" y="12" width="76" height="76" rx="3"/>', 5: '<path d="M50 6 94 38 77 90H23L6 38z"/>', 6: '<path d="M28 10h44l22 40-22 40H28L6 50z"/>' };
    const k = pick([3, 4, 5, 6]), o = numTiles(k, 3, 3, 8), ask = pick(['sides', 'corners']);
    return P(`How many ${ask} does this shape have?`, o.answer, { scene: `<div class="bigpic"><svg viewBox="0 0 100 100"><g fill="#ffd23f" stroke="#1d2b53" stroke-width="4" stroke-linejoin="round">${shapes[k]}</g></svg></div>`, tiles: o.tiles, labels: o.labels }, `Trace each ${ask === 'sides' ? 'straight side' : 'corner'} with your finger.`, `${k} ${ask}`);
  },
  halves() {
    const kind = pick(['pie', 'bar']), opts = shuffle([['ok', fracShape(kind, 2, 1)], ['uneven', fracShape(kind === 'pie' ? 'bar' : kind, 2, 1, true)], ['thirds', fracShape(kind === 'pie' ? 'bar' : 'pie', 3, 1)]]);
    return P('Which one is cut into halves: 2 equal parts?', opts.findIndex(x => x[0] === 'ok'), { tiles: opts.map(x => x[1]), labels: opts.map(x => x[0]) }, 'Halves are 2 parts that are exactly the same size.', 'Two equal parts');
  },
  pictograph({ ask = 'pick' } = {}) {
    const fr = shuffle(Object.keys(FRUIT)), counts = shuffle([2, 3, 4, 5, 6]).slice(0, 4);
    const scene = `<div class="pgraph">${fr.map((f, i) => `<div class="prow"><span class="plab">${FRUIT[f]}</span><span class="pics">${many(OBJ.stars, counts[i], 'sm')}</span></div>`).join('')}<p class="pkey">Each star = 1 child</p></div>`;
    const kind = ask === 'pick' ? pick(['most', 'count']) : ask;
    if (kind === 'most') { const best = counts.indexOf(Math.max(...counts)); return P('Which fruit do the most children like?', best, { scene, tiles: fr.map(f => FRUIT[f]), labels: fr, wide: true }, 'Find the longest row of stars.', `${fr[best]}: ${counts[best]}`); }
    const i = rnd(0, 3), o = numTiles(counts[i], 3, 1, 8);
    return P(`How many children like the ${fr[i] === 'grapes' ? 'grapes' : fr[i] + 's'}?`, o.answer, { scene, tiles: o.tiles, labels: o.labels, wide: true }, 'Count the stars in that row.', `${counts[i]} children`);
  },
  lengthBlocks() {
    const L = rnd(2, 7), o = numTiles(L, 3, 1, 9);
    return P('How many blocks long is the pencil?', o.answer, { scene: `<div class="measure"><div class="pen" style="--l:${L}">${PENCIL(L, pick(['#ffd23f', '#4dabf7', '#ff6b6b']))}</div><div class="blocks">${Array.from({ length: 9 }, (_, i) => `<i class="blk${i < L ? ' on' : ''}"></i>`).join('')}</div></div>`, tiles: o.tiles, labels: o.labels }, 'Count the blocks under the pencil, from its end to its tip.', `${L} blocks`);
  },

  // ---------- Grade 2 ----------
  sub2() {
    let a, b; do { a = rnd(31, 98); b = rnd(11, a - 10); } while ((a % 10) >= (b % 10) && Math.random() < .7);
    const borrow = (a % 10) < (b % 10);
    return { template: 'numpad', prompt: 'Work it out.', answer: a - b, data: { expr: `<span class="expr">${a} − ${b} = ?</span>` }, say: `${a} take away ${b}`, hint: 'Take away the ones first. If you can\'t, exchange 1 ten for 10 ones.',
      solution: [borrow ? `${a % 10} < ${b % 10}: exchange 1 ten → ${(a % 10) + 10} − ${b % 10} = ${(a % 10) + 10 - (b % 10)}` : `${a % 10} − ${b % 10} = ${(a % 10) - (b % 10)}`, `${Math.floor(a / 10)}${borrow ? ' − 1' : ''} − ${Math.floor(b / 10)} = ${Math.floor(a / 10) - (borrow ? 1 : 0) - Math.floor(b / 10)} tens`, `${a} − ${b} = ${a - b}`] };
  },
  arrays() {
    const r = rnd(2, 5), k = rnd(2, 5), o = numTiles(r * k, 3, 2, 30);
    return P(`${r} rows of ${k}. How many dots altogether?`, o.answer, { scene: `<div class="arr" style="--k:${k}">${Array.from({ length: r * k }, () => '<i class="dot c"></i>').join('')}</div>`, tiles: o.tiles, labels: o.labels, count: true }, `Count in ${k}s, one row at a time.`, `${Array(r).fill(k).join(' + ')} = ${r * k}`);
  },
  shareEqual() {
    const p = rnd(2, 4), k = rnd(2, 5);
    return { template: 'share', prompt: `Share ${p * k} cookies equally between ${p} plates.`, answer: k, data: { total: p * k, plates: p }, hint: 'Give one cookie to each plate, then go round again.', solution: [`${p * k} ÷ ${p} = ${k} on each plate`] };
  },
  oddEven() {
    const n = rnd(3, 16), even = n % 2 === 0;
    const scene = `<div class="pairs">${Array.from({ length: Math.ceil(n / 2) }, (_, i) => `<span class="pr"><i class="dot"></i>${i * 2 + 1 < n ? '<i class="dot"></i>' : '<i class="dot ghost"></i>'}</span>`).join('')}</div>`;
    return P(`Is ${n} odd or even?`, even ? 1 : 0, { scene, tiles: ['<span class="tw">Odd</span>', '<span class="tw">Even</span>'], labels: ['Odd', 'Even'] }, 'Even numbers make pairs with none left over.', `${n} is ${even ? 'even' : 'odd'}`);
  },
  fractionName() {
    const want = pick([[2, 'one half'], [3, 'one third'], [4, 'one quarter']]), kind = pick(['pie', 'bar']);
    const opts = shuffle([2, 3, 4]);
    return P(`Which picture shows ${want[1]} shaded?`, opts.indexOf(want[0]), { tiles: opts.map(k => fracShape(kind, k, 1)), labels: opts.map(k => '1 of ' + k) }, `Count the equal parts: ${want[1]} means 1 of ${want[0]} equal parts.`, `${want[1]} = 1/${want[0]}`);
  },
  ruler() {
    const us = isUS(), top = us ? 7 : 12, u = U('len'), L = us ? rnd(2, 6) : rnd(3, 11), o = numTiles(L, 3, 1, top);
    o.tiles = o.labels.map(v => N(v + ' ' + u));
    const ticks = Array.from({ length: top + 1 }, (_, i) => `<span class="tk"><b>${i}</b></span>`).join('');
    return P('How long is the pencil?', o.answer, { scene: `<div class="rulerscene" style="--l:${L}${us ? ';--u:clamp(36px,11vw,76px)' : ''}"><div class="pen2">${PENCIL(L)}</div><div class="rul">${ticks}</div></div>`, tiles: o.tiles, labels: o.labels, wide: true }, 'The pencil starts at 0. Read the number at its tip.', `${L} ${u}`);
  },
  clockQuarter() {
    const hr = rnd(1, 12), m = pick([0, 15, 30, 45]);
    return { template: 'clock', prompt: `Show ${timeText(hr, m)} on the clock.`, answer: `${hr}:${m}`, data: { h: hr, m, half: true, quarter: true }, check: v => v === `${hr}:${m}`, hint: 'Long hand: 3 is quarter past, 6 is half past, 9 is quarter to. The short hand moves a little too.', solution: [`${hr}:${String(m).padStart(2, '0')}`] };
  },
  symmetry() {
    const sym = pick(['butterfly', 'house', 'heart']), asym = shuffle(['flag', 'boot', 'bolt']).slice(0, 2), opts = shuffle([sym, ...asym]);
    return P('Which picture is the same on both sides of the red line?', opts.indexOf(sym), { tiles: opts.map(k => SYM[k]), labels: opts }, 'Imagine folding the picture on the line. Do both halves match?', `The ${sym} is symmetrical`);
  },
  barGraph() {
    const fr = shuffle(Object.keys(FRUIT)), v = shuffle([2, 3, 4, 5, 6, 7]).slice(0, 4), most = Math.random() < .5;
    const best = v.indexOf(most ? Math.max(...v) : Math.min(...v));
    const scene = `<div class="bgraph"><div class="bars2">${v.map((x, i) => `<div class="bcol"><span class="bv">${x}</span><i style="--v:${x}"></i>${FRUIT[fr[i]]}</div>`).join('')}</div></div>`;
    return P(`Which fruit has the ${most ? 'tallest' : 'shortest'} bar?`, best, { scene, tiles: fr.map(f => FRUIT[f]), labels: fr, wide: true }, `Look for the ${most ? 'highest' : 'lowest'} bar.`, `${fr[best]}: ${v[best]}`);
  },
  numberRule() {
    const st = rnd(2, 6), a = rnd(1, 15), seq = [0, 1, 2, 3].map(i => a + st * i), ans = a + st * 4, o = numTiles(ans, 3, ans - 6, ans + 6);
    return P('Find the rule. What comes next?', o.answer, { scene: `<div class="track">${seq.map(x => `<b>${x}</b>`).join('')}<b class="qm">?</b></div>`, tiles: o.tiles, labels: o.labels }, 'How much does it grow each time?', `+${st} each time: ${ans}`);
  },

  // ---------- Methods ----------
  abacusDirect() {
    const hv = rnd(0, 1), add = Math.random() < .5;
    let e, b; if (add) { e = rnd(0, 3); b = rnd(1, 4 - e); } else { e = rnd(1, 4); b = rnd(1, e); }
    const start = hv * 5 + e, ans = add ? start + b : start - b;
    return { template: 'abacus', prompt: `The abacus shows ${start}. ${add ? 'Add' : 'Take away'} ${b}.`, answer: ans, data: { rods: 1, start, target: ans }, hint: add ? 'Push up more bottom beads.' : 'Push some bottom beads back down.', solution: [`${start} ${add ? '+' : '−'} ${b} = ${ans}`] };
  },
  oddOnePic() {
    const sets = [[OBJ.apples, OBJ.stars], [OBJ.balloons, OBJ.apples], [shapeSvg('circle'), shapeSvg('square')], [shapeSvg('triangle'), shapeSvg('heart')], [FRUIT.banana, FRUIT.grapes]];
    const [same, diff] = pick(sets), pos = rnd(0, 3);
    return P('Which one does not belong?', pos, { tiles: [0, 1, 2, 3].map(i => i === pos ? diff : same), labels: ['1', '2', '3', '4'] }, 'Three are the same. Find the different one.', 'The different picture');
  }
};

