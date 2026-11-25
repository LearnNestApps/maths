// Weekly report for grown-ups: what each learner practised in the last 7 days, where they need help,
// what is next, and one 5-minute activity to do together at home. Built from progress on this device.
import { isIndia, isUS, regionId } from './core/region.js';
import { nextSkill, status } from './core/mastery.js';

const DAY = 864e5, today = () => Math.floor(Date.now() / DAY);
const LOCALE = { india: 'en-IN', us: 'en-US', canada: 'en-CA', uk: 'en-GB' };
const dateRange = () => {
  const loc = LOCALE[regionId()] || 'en-GB', end = new Date(), start = new Date(Date.now() - 6 * DAY);
  const f = d => d.toLocaleDateString(loc, { day: 'numeric', month: 'short' });
  return `${f(start)} – ${f(end)}`;
};

// One short activity per strand, using things every home has.
function activity(strand) {
  const bread = isIndia() ? 'a roti' : 'a sandwich or a pizza', coins = isIndia() ? 'a few coins and notes' : 'some coins';
  const A = {
    Fractions: `Cut ${bread} into equal parts together. Ask: "If you eat 2 of the 4 pieces, what fraction is left?"`,
    Decimals: 'Look at prices on a shopping receipt. Ask which item costs the most, and round each price to the nearest whole number.',
    Percentages: 'Find a "% off" sign in a shop or advert. Work out the sale price together.',
    Money: `Give them ${coins} and a small "shop" at home. Let them pay and work out the change.`,
    Time: 'At dinner, ask them to read the clock and say how long until bedtime.',
    Measurement: 'Cook something simple together and let them measure the ingredients.',
    Measuring: 'Measure things around the house with a ruler or tape: a book, a table, their height.',
    Geometry: 'Go on a shape hunt at home: find 3 right angles, 2 circles and something symmetrical.',
    Position: 'Hide a toy and give directions: "3 steps forward, turn left, 2 steps".',
    Data: `Count the colours of ${isUS() ? 'cars' : 'vehicles'} passing by for 5 minutes and make a tally chart together.`,
    Statistics: 'Write down how long each family member sleeps tonight, then find the mean and the range together.',
    Probability: 'Flip a coin 20 times together. Before you start, guess how many heads.',
    Algebra: 'Play "think of a number": "I double it and add 3, and get 15. What was my number?" Then swap roles.',
    Ratio: 'Make a drink or a recipe in a ratio, like 1 cup of juice to 3 cups of water, then double it.',
    Multiplying: 'Play times-table snap with playing cards: turn two cards over and the first to say the product wins.',
    Dividing: 'Share out a snack equally between family members. What is left over?',
    Number: 'Read a big number together from a newspaper or a car number plate, and say its place values.',
    Patterns: 'Make a pattern with spoons and forks and ask them what comes next, and why.'
  };
  return A[strand] || 'Ask them to teach you one thing they learned this week. Explaining it is the best practice.';
}

// Stats for one learner over a 7-day window ending `endDay` (inclusive).
function windowStats(p, endDay) {
  let n = 0, right = 0; const days = new Set(), per = {};
  for (const [id, r] of Object.entries(p.progress || {})) {
    for (const [ok, d] of (r && r.a) || []) if (d > endDay - 7 && d <= endDay) { n++; right += ok; days.add(d); (per[id] = per[id] || { n: 0, ok: 0 }).n++; per[id].ok += ok; }
  }
  return { n, right, days: days.size, per };
}

export function learnerReport(p, skills) {
  const byId = {}; skills.forEach(s => { byId[s.id] = s; });
  const now = today(), w = windowStats(p, now), prev = windowStats(p, now - 7);
  const practised = Object.entries(w.per).filter(([id]) => byId[id]).sort((a, b) => b[1].n - a[1].n);
  const mastered = Object.entries(p.progress || {}).filter(([id, r]) => byId[id] && r.mastered && r.mastered > Date.now() - 7 * DAY).map(([id]) => byId[id]);
  // Needs help: practised this week with at least 4 answers and under 60% right, weakest first.
  const help = practised.filter(([, s]) => s.n >= 4 && s.ok / s.n < .6).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).map(([id, s]) => ({ s: byId[id], pct: Math.round(s.ok / s.n * 100) }));
  const due = skills.filter(s => status(p.progress[s.id]) === 'review');
  const next = nextSkill(p, skills);
  const focus = (help[0] && help[0].s) || (practised[0] && byId[practised[0][0]]) || next;
  return { p, n: w.n, pct: w.n ? Math.round(w.right / w.n * 100) : 0, days: w.days, prevN: prev.n,
    practised: practised.slice(0, 5).map(([id, s]) => ({ s: byId[id], n: s.n, pct: Math.round(s.ok / s.n * 100) })),
    mastered, help: help.slice(0, 3), due: due.length, next, activity: activity(focus && focus.strand) };
}

export function familyReport(list) {
  return { range: dateRange(), learners: list };
}

// Plain-text version for email.
export function reportText(rep, title) {
  const L = [`${title}: ${rep.range}`, ''];
  rep.learners.forEach(r => {
    L.push(`${r.p.name.toUpperCase()}`);
    if (!r.n) L.push('No practice this week. A few minutes on 3 or 4 days makes a big difference.');
    else {
      L.push(`Practised on ${r.days} day${r.days === 1 ? '' : 's'}, ${r.n} questions, ${r.pct}% right first time${r.prevN ? ` (last week: ${r.prevN} questions)` : ''}.`);
      if (r.practised.length) L.push('Practised: ' + r.practised.map(x => `${x.s.title} (${x.pct}%)`).join('; '));
      if (r.mastered.length) L.push('Mastered: ' + r.mastered.map(s => s.title).join('; '));
      if (r.help.length) L.push('Needs some help: ' + r.help.map(x => `${x.s.title} (${x.pct}%)`).join('; '));
    }
    if (r.due) L.push(`${r.due} lesson${r.due === 1 ? '' : 's'} due for a quick review.`);
    if (r.next) L.push(`Up next: ${r.next.title}`);
    L.push(`Try at home (5 minutes): ${r.activity}`, '');
  });
  L.push('Sent from Uplore (Pip Maths): https://getuplore.github.io/maths/');
  return L.join('\n');
}
