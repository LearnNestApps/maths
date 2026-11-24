// Exam Centre: full practice papers in the real format of each exam (questions, marks, time),
// built from the app's own lessons. Every question is original: generated fresh each time.
import { GEN } from './generators.js';
import { fmt } from '../core/region.js';

// The lesson catalogue for the learner's country; the player hands it over before a paper is built.
let CAT = [];
export const setCatalog = list => { CAT = list || []; };

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickW = list => { const tot = list.reduce((s, x) => s + x[1], 0); let r = Math.random() * tot; for (const x of list) { if ((r -= x[1]) < 0) return x[0]; } return list[list.length - 1][0]; };

// Class number → level code (0 = SK, -1 = JK); capped at Grade 12.
const L = k => k <= -1 ? 'JK' : k === 0 ? 'SK' : 'G' + Math.min(12, k);
const LEVELS = ['JK', 'SK', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
const lvNum = code => LEVELS.indexOf(code) - 1;
// SOF style: 60% from the current class, 40% from the class before.
const cur = k => [[L(k), .6], [L(k - 1), .4]];

const EVERYDAY = ['Money', 'Measurement', 'Measuring', 'Time', 'Data', 'Statistics', 'Percentages', 'Ratio'];
const NUMBERS = ['Number', 'Place value', 'Operations', 'Adding', 'Taking away', 'Multiplying', 'Dividing', 'Comparing', 'Patterns'];
const RS = {
  series: ['seriesNext', 'letterSeries', 'analogyNum', 'analogyLetter'],
  classify: ['oddOneOut', 'oddGroup', 'coding', 'alphabetPos'],
  order: ['directions', 'ranking', 'relations'],
  time: ['calendar', 'clockAngle'],
  figures: ['mirrorWord', 'countFigures', 'missingFigure']
};

// ---------- Pools: which lessons a section may draw from ----------
const gensOf = s => [].concat(s.gen || [], s.mix || [], s.seq || []).filter(g => GEN[g] && !/mock|Mock|examPaper/.test(g));
function pool(spec) {
  const out = [];
  for (const s of CAT) {
    if (s.track === 'exam' && !(spec.reason || spec.gens)) continue;
    if (spec.reason || spec.gens) {
      if (!/^b-/.test(s.id)) continue;
      const g = gensOf(s).filter(x => !spec.gens || spec.gens.includes(x)); if (g.length) out.push({ s, g, w: 1 });
      continue;
    }
    if (!(spec.tracks || ['school']).includes(s.track)) continue;
    if (spec.strands && !spec.strands.includes(s.strand)) continue;
    if (spec.notStrands && spec.notStrands.includes(s.strand)) continue;
    let w = 1;
    if (spec.levels) { const m = spec.levels.find(x => x[0] === s.level); if (!m) continue; w = m[1]; }
    const g = gensOf(s); if (g.length) out.push({ s, g, w });
  }
  // Spread a level's weight over its lessons so each level gets its share of questions.
  const per = {}; out.forEach(o => { per[o.s.level] = (per[o.s.level] || 0) + 1; });
  out.forEach(o => { o.w = spec.reason || spec.gens ? 1 : o.w / per[o.s.level]; });
  return out;
}
// Widen a section's pool step by step if it is too small to fill (few lessons at that level and topic).
function widen(spec) {
  const steps = [spec];
  if (spec.strands) steps.push({ ...spec, strands: null, notStrands: null });
  if (spec.levels) {
    const ks = spec.levels.filter(x => LEVELS.includes(x[0])).map(x => lvNum(x[0])), lo = Math.min(...ks), hi = Math.max(...ks), extra = spec.levels.filter(x => !LEVELS.includes(x[0]));
    steps.push({ ...spec, strands: null, notStrands: null, levels: [[L(lo - 1), 1], ...spec.levels.map(x => [x[0], 2]), [L(hi + 1), .5]] });
    if (extra.length) steps[steps.length - 1].tracks = spec.tracks;
    steps.push({ ...spec, strands: null, notStrands: null, levels: LEVELS.slice(Math.max(0, lo - 2 + 1), Math.min(LEVELS.length, hi + 4)).map(c => [c, 1]) });
  }
  return steps;
}

// ---------- Turning a lesson question into a multiple-choice paper question ----------
const dpOf = x => { const s = String(x); return s.includes('.') ? s.split('.')[1].length : 0; };
const isNum = o => /^-?\d+(\.\d+)?$/.test(String(o).replace(/,/g, '').trim());
function numDistractors(x, ok, k, isInt) {
  const dp = isInt ? 0 : Math.max(1, dpOf(x)), u = Math.pow(10, -dp), mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(Math.abs(x) || 1))));
  const raw = [x + u, x - u, x + 2 * u, x - 2 * u, x + 10 * u, x - 10 * u, x * 10, x / 10, x + mag, x - mag, x * 2, x / 2, x + 5 * u, x - 5 * u, x + 3 * u, x - 3 * u, x + mag / 2, x + 4 * u, x - 4 * u];
  const ds = String(Math.abs(Math.round(x))); if (ds.length >= 2) raw.push(Math.sign(x || 1) * +(ds.slice(0, -2) + ds.slice(-1) + ds.slice(-2, -1)));
  const seen = new Set([+x.toFixed(dp)]), out = [];
  for (const c0 of shuffle(raw.slice(0, 8)).concat(shuffle(raw.slice(8)))) {
    const c = +(+c0).toFixed(dp);
    if (!isFinite(c) || seen.has(c) || (x >= 0 && c < 0) || (isInt && !Number.isInteger(c)) || ok(c)) continue;
    seen.add(c); out.push(c); if (out.length === k) break;
  }
  for (let j = 6; out.length < k && j < 60; j++) { const c = +(x + (j % 2 ? j : -j) * u).toFixed(dp); if (!seen.has(c) && !(x >= 0 && c < 0) && !ok(c)) { seen.add(c); out.push(c); } }
  return out;
}
const fracPlain = o => /^-?\d+\/\d+$/.test(o) ? `<span class="frac"><span>${o.split('/')[0]}</span><span>${o.split('/')[1]}</span></span>` : o;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function toPaperQ(act, nOpts) {
  if (!act || Array.isArray(act)) return null;
  const expr = act.data && act.data.expr ? `<div class="mexpr">${act.data.expr}</div>` : '';
  const stem = act.prompt + expr, base = { stem, hint: act.hint || '', solution: [].concat(act.solution || []) };
  if (act.template === 'mcq') {
    let opts = (act.data.options || []).map(String), ans = act.answer;
    if (opts.length < 3 || typeof ans !== 'number' || !opts[ans]) return null;
    if (new Set(opts).size !== opts.length) return null;
    const numeric = opts.every(isNum);
    if (opts.length > nOpts) { const right = opts[ans]; opts = [right, ...shuffle(opts.filter((_, i) => i !== ans)).slice(0, nOpts - 1)]; ans = 0; }
    if (opts.length < nOpts) {
      if (!numeric) return null;
      const x = +opts[ans].replace(/,/g, ''), have = new Set(opts.map(o => +o.replace(/,/g, '')));
      const extra = numDistractors(x, c => have.has(c), nOpts - opts.length, opts.every(o => !o.includes('.')));
      if (extra.length < nOpts - opts.length) return null;
      opts = opts.concat(extra.map(String));
    }
    const right = opts[ans];
    if (numeric) opts.sort((a, b) => +a.replace(/,/g, '') - +b.replace(/,/g, '')); else shuffle(opts);
    const show = o => act.data.fractions ? fracPlain(o) : act.data.html ? o : esc(o);
    return { ...base, options: opts.map(show), answer: opts.indexOf(right), html: true };
  }
  // Little Learners picture questions: the scene goes into the question, the tiles become the options.
  if (act.template === 'pick') {
    const d = act.data || {};
    if (!d.tiles || d.tapScene || d.flash || typeof act.answer !== 'number' || !d.tiles[act.answer]) return null;
    const stemP = act.prompt + (d.scene != null ? `<div class="mscene">${d.scene}</div>` : '');
    const labels = d.labels || [], numeric = labels.length === d.tiles.length && labels.every(isNum);
    if (numeric) {
      let opts = labels.map(String); const right = opts[act.answer];
      if (new Set(opts).size !== opts.length) return null;
      if (opts.length > nOpts) opts = [right, ...shuffle(opts.filter(o => o !== right)).slice(0, nOpts - 1)];
      if (opts.length < nOpts) { const have = new Set(opts.map(Number)); const ex = numDistractors(+right, c => have.has(c), nOpts - opts.length, opts.every(o => !o.includes('.'))); if (ex.length < nOpts - opts.length) return null; opts = opts.concat(ex.map(String)); }
      opts.sort((x, y) => +x - +y);
      return { ...base, stem: stemP, options: opts, answer: opts.indexOf(right), html: false };
    }
    if (d.tiles.length !== nOpts || new Set(d.tiles).size !== d.tiles.length) return null;
    const idx = shuffle(d.tiles.map((_, i) => i));
    return { ...base, stem: stemP, options: idx.map(i => `<span class="mtile">${d.tiles[i]}</span>`), answer: idx.indexOf(act.answer), html: true };
  }
  if (act.template === 'numpad') {
    const x = Number(act.answer); if (!isFinite(x) || String(act.answer).trim() === '') return null;
    const ok = c => act.check ? act.check(c) : Math.abs(c - x) < 1e-9;
    const isInt = Number.isInteger(x) && !(act.data && act.data.dot && act.check);
    const ds = numDistractors(x, ok, nOpts - 1, isInt); if (ds.length < nOpts - 1) return null;
    const all = [x, ...ds].sort((a, b) => a - b);
    return { ...base, options: all.map(v => fmt(v)), answer: all.indexOf(x), html: false };
  }
  return null;
}

// ---------- Building a paper ----------
const bad = new Set();   // lesson+generator pairs whose questions cannot become multiple choice
function fill(sec, nOpts, seen) {
  const qs = [];
  for (const spec of widen(sec.pool)) {
    const P = pool(spec).filter(o => o.g.some(g => !bad.has(o.s.id + ':' + g)));
    for (let tries = 0; qs.length < sec.n && P.length && tries < sec.n * 25; tries++) {
      const o = pickW(P.map(x => [x, x.w])), g = o.g[rnd(0, o.g.length - 1)];
      if (bad.has(o.s.id + ':' + g)) continue;
      let act; try { act = GEN[g]({ ...(o.s.params || {}), ...(sec.pool.hard ? { hard: true } : {}) }); } catch (e) { bad.add(o.s.id + ':' + g); continue; }
      const q = toPaperQ(act, nOpts);
      if (!q) { if (!act || !['mcq', 'numpad', 'pick'].includes(act.template)) bad.add(o.s.id + ':' + g); continue; }
      const key = q.stem.replace(/<svg[\s\S]*?<\/svg>/g, 'svg') + '|' + q.options.join('|');
      if (seen.has(key)) continue; seen.add(key);
      qs.push({ ...q, skill: o.s.id, topic: o.s.title, lv: o.s.level, gen: g });
    }
    if (qs.length >= sec.n) break;
  }
  return qs;
}

// Paper formats. n = questions, marks = per correct answer, blank = per unanswered, neg = taken off per wrong.
function imo(k) {
  const small = k <= 4, lr = { reason: true, hard: k >= 6 };
  const lrPool = k <= 2 ? { tracks: ['school'], levels: [[L(k), 1], [L(k - 1), 1]], strands: ['Patterns', 'Sorting', 'Comparing', 'Position', 'Number'] } : { ...lr, gens: k <= 4 ? [...RS.series, ...RS.classify, 'alphabetPos', 'ranking'] : null };
  return { title: `IMO-style practice paper · Class ${k}`, minutes: 60, opts: 4,
    note: 'Practice paper in the SOF IMO Level 1 format: original questions written for Pip Maths (not from SOF). No negative marking. Check the official pattern for your exam year.',
    sections: [
      { name: 'Logical Reasoning', n: small ? 10 : 15, marks: 1, pool: lrPool },
      { name: k >= 11 ? 'Mathematical Reasoning / Applied Maths' : 'Mathematical Reasoning', n: small ? 10 : 20, marks: 1, pool: { tracks: ['school'], levels: cur(k), notStrands: EVERYDAY } },
      { name: 'Everyday Mathematics', n: 10, marks: 1, pool: { tracks: k >= 9 ? ['school', 'life'] : ['school'], levels: k >= 9 ? [...cur(k), ['Everyday', .5], ['Money', .5]] : cur(k), strands: k >= 9 ? null : EVERYDAY } },
      { name: 'Achievers Section', n: 5, marks: small ? 2 : 3, pool: { tracks: ['school'], levels: [[L(k), .5], [L(k + 1), .5]] } }] };
}
const msceNote = 'Practice for the Maharashtra scholarship exam (MSCE Pune): this paper covers the {part} only, 2 marks a question, no negative marking. Original questions written for Pip Maths. Check the official pattern for your exam year.';
const reasonSections = (sizes, hard) => [
  { name: 'Series and analogies', n: sizes[0], marks: sizes[5], pool: { gens: RS.series, hard } },
  { name: 'Classification and coding', n: sizes[1], marks: sizes[5], pool: { gens: RS.classify, hard } },
  { name: 'Directions, ranking and relations', n: sizes[2], marks: sizes[5], pool: { gens: RS.order, hard } },
  { name: 'Time and calendar', n: sizes[3], marks: sizes[5], pool: { gens: RS.time, hard } },
  { name: 'Figures and images', n: sizes[4], marks: sizes[5], pool: { gens: RS.figures, hard } }];
const olympiad = (title, minutes, note, parts) => ({ title, minutes, opts: 5, note, ...parts });
const parts3 = (k, m, extra = {}) => [
  { name: 'Part A', n: 10, marks: m[0], pool: { tracks: ['school'], levels: [[L(k - 2), .5], [L(k - 1), .5]] }, ...extra },
  { name: 'Part B', n: 10, marks: m[1], pool: { tracks: ['school'], levels: [[L(k - 1), .4], [L(k), .6]] }, ...extra },
  { name: 'Part C', n: 5, marks: m[2], pool: { tracks: ['school'], levels: [[L(k), .6], [L(k + 1), .4]] }, ...extra }];
const indep = 'Original questions written for Pip Maths; not from or endorsed by {org}.';

export const PAPERS = {
  imo: ({ klass = 6 } = {}) => imo(klass),
  msceMaths: ({ klass = 4 } = {}) => ({ title: `Scholarship practice: Mathematics · Class ${klass}`, minutes: 60, opts: 4, note: msceNote.replace('{part}', 'Mathematics part (50 questions)'),
    sections: klass <= 5 ? [
      { name: 'Numbers and operations', n: 18, marks: 2, pool: { levels: cur(klass), strands: NUMBERS } },
      { name: 'Fractions and decimals', n: 8, marks: 2, pool: { levels: cur(klass), strands: ['Fractions', 'Decimals'] } },
      { name: 'Measurement, time and money', n: 14, marks: 2, pool: { levels: cur(klass), strands: ['Measurement', 'Measuring', 'Time', 'Money'] } },
      { name: 'Geometry', n: 10, marks: 2, pool: { levels: cur(klass), strands: ['Geometry', 'Position'] } }] : [
      { name: 'Numbers', n: 12, marks: 2, pool: { levels: cur(klass), strands: ['Number', 'Operations', 'Patterns'] } },
      { name: 'Fractions, decimals and percentages', n: 10, marks: 2, pool: { levels: cur(klass), strands: ['Fractions', 'Decimals', 'Percentages'] } },
      { name: 'Algebra and ratio', n: 8, marks: 2, pool: { levels: cur(klass), strands: ['Algebra', 'Ratio'] } },
      { name: 'Measurement and geometry', n: 12, marks: 2, pool: { levels: cur(klass), strands: ['Geometry', 'Measurement', 'Measuring', 'Time'] } },
      { name: 'Applied maths: money, profit, interest', n: 8, marks: 2, pool: { levels: [...cur(klass), [L(klass + 1), .3]], strands: ['Money', 'Percentages', 'Data', 'Statistics'] } }] }),
  msceReason: ({ klass = 4 } = {}) => ({ title: `Scholarship practice: Intelligence Test · Class ${klass}`, minutes: 60, opts: 4, note: msceNote.replace('{part}', 'Intelligence Test part (50 questions)'),
    sections: reasonSections([12, 12, 10, 6, 10, 2], klass >= 7) }),
  nmmsMat: () => ({ title: 'NMMS practice: Mental Ability Test (MAT)', minutes: 90, opts: 4,
    note: 'Practice in the NMMS MAT format: 90 questions, 1 mark each, 90 minutes, no negative marking. Original questions written for Pip Maths. Check your state\'s pattern for the exam year.',
    sections: reasonSections([22, 20, 20, 10, 18, 1], true) }),
  nmmsSat: () => ({ title: 'NMMS practice: SAT Mathematics', minutes: 20, opts: 4,
    note: 'The Mathematics part of the NMMS Scholastic Aptitude Test: 20 questions from Classes 7 and 8, 1 mark each. (The full SAT also has Science and Social Science.) Original questions written for Pip Maths.',
    sections: [{ name: 'Number and algebra', n: 10, marks: 1, pool: { levels: [['G8', .6], ['G7', .4]], strands: ['Number', 'Algebra', 'Fractions', 'Decimals', 'Ratio', 'Percentages', 'Operations'] } },
      { name: 'Geometry, measurement and data', n: 10, marks: 1, pool: { levels: [['G8', .6], ['G7', .4]], strands: ['Geometry', 'Measurement', 'Measuring', 'Data', 'Statistics', 'Probability', 'Money'] } }] }),
  amc8: () => olympiad('AMC 8-style practice contest', 40, 'Practice in the AMC 8 format: 25 questions, 40 minutes, 1 point each, no penalty for wrong answers, no calculator. ' + indep.replace('{org}', 'the MAA'),
    { sections: [{ name: 'Questions 1–10', n: 10, marks: 1, pool: { levels: [['G6', .5], ['G7', .5]] } }, { name: 'Questions 11–20', n: 10, marks: 1, pool: { levels: [['G7', .4], ['G8', .6]] } }, { name: 'Questions 21–25', n: 5, marks: 1, pool: { levels: [['G8', .6], ['G9', .4]] } }] }),
  amc10: () => olympiad('AMC 10-style practice contest', 75, 'Practice in the AMC 10 format: 25 questions, 75 minutes, 6 points for a correct answer, 1.5 for a blank, 0 for a wrong answer. ' + indep.replace('{org}', 'the MAA'),
    { sections: [{ name: 'Questions 1–10', n: 10, marks: 6, blank: 1.5, pool: { levels: [['G8', .5], ['G9', .5]] } }, { name: 'Questions 11–20', n: 10, marks: 6, blank: 1.5, pool: { levels: [['G9', .4], ['G10', .6]] } }, { name: 'Questions 21–25', n: 5, marks: 6, blank: 1.5, pool: { levels: [['G10', .6], ['G11', .4]] } }] }),
  jmc: () => olympiad('Junior Challenge-style practice paper', 60, 'Practice in the format of the UKMT Junior Mathematical Challenge (Year 8 and below): 25 questions, 60 minutes, 5 marks for Questions 1–15 and 6 marks for Questions 16–25, no penalty for wrong answers. ' + indep.replace('{org}', 'the UKMT'),
    { sections: [{ name: 'Questions 1–15', n: 15, marks: 5, pool: { levels: [['G5', .3], ['G6', .4], ['G7', .3]] } }, { name: 'Questions 16–25', n: 10, marks: 6, pool: { levels: [['G7', .6], ['G8', .4]] } }] }),
  imc: () => olympiad('Intermediate Challenge-style practice paper', 60, 'Practice in the format of the UKMT Intermediate Mathematical Challenge (Year 11 and below): 25 questions, 60 minutes, 5 marks for Questions 1–15 and 6 marks for Questions 16–25, no penalty for wrong answers. ' + indep.replace('{org}', 'the UKMT'),
    { sections: [{ name: 'Questions 1–15', n: 15, marks: 5, pool: { levels: [['G8', .5], ['G9', .5]] } }, { name: 'Questions 16–25', n: 10, marks: 6, pool: { levels: [['G10', .6], ['G11', .4]] } }] }),
  gauss: ({ grade = 7 } = {}) => olympiad(`Gauss-style practice contest · Grade ${grade}`, 60, `Practice in the format of the CEMC Gauss Contest (Grade ${grade}): 25 questions, 60 minutes, 5 marks each in Part A, 6 in Part B, 8 in Part C; no penalty for a wrong answer, 2 marks for each unanswered question (up to 10). ` + indep.replace('{org}', 'the CEMC (University of Waterloo)'),
    { blankMax: 10, sections: parts3(grade, [5, 6, 8], { blank: 2 }) }),
  pascal: () => olympiad('Pascal-style practice contest · Grade 9', 60, 'Practice in the format of the CEMC Pascal Contest (Grade 9): 25 questions, 60 minutes, 5 marks each in Part A, 6 in Part B, 8 in Part C; no penalty for a wrong answer, 2 marks for each unanswered question (up to 10). ' + indep.replace('{org}', 'the CEMC (University of Waterloo)'),
    { blankMax: 10, sections: parts3(9, [5, 6, 8], { blank: 2 }) })
};

export const GEN_EXAM = {
  examPaper({ paper = 'imo', ...opt } = {}) {
    const P = PAPERS[paper](opt), seen = new Set();
    const sections = P.sections.map(sec => ({ name: sec.name, marks: sec.marks, blank: sec.blank || 0, neg: sec.neg || 0, qs: fill(sec, P.opts, seen) }));
    return { template: 'mock', prompt: P.title, data: { title: P.title, minutes: P.minutes, note: P.note, blankMax: P.blankMax || 0, sections } };
  }
};
