// "Learn first": a short teaching explainer before a lesson's questions.
// Each entry is a function, so pictures, money and wording follow the learner's country when it is shown.
// Frames: F(html, say) shows a picture or idea; T(...) is one question the learner tries with Pip before practice.

const F = (html, say) => ({ html, say: say || html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
const T = (html, options, answer, right, wrong, say) => ({ html, say: say || html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(), try: { options, answer, right, wrong } });
const fr = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

// A fraction bar: n equal parts, the first k shaded.
function bar(n, k, color = '#4dabf7', w = 300) {
  const pw = w / n;
  return `<svg class="lbar" viewBox="0 0 ${w + 4} 44" width="${w + 4}" height="44" role="img" aria-label="${k} of ${n} parts shaded">${Array.from({ length: n }, (_, i) =>
    `<rect x="${2 + i * pw}" y="2" width="${pw}" height="40" rx="3" fill="${i < k ? color : '#fff'}" stroke="#1d3557" stroke-width="2"/>`).join('')}</svg>`;
}
const barRow = (n, k, color) => `<div class="lrow">${bar(n, k, color)}<b class="lfr">${fr(k, n)}</b></div>`;

import { G3_5 } from './learn_g3_5.js';
import { G6_8 } from './learn_g6_8.js';

export const LEARN = {
  ...G3_5,
  ...G6_8,
  'e-fequiv': () => ({
    title: 'Equivalent fractions',
    frames: [
      F(`<p>These bars are the same size. Look at how much is shaded.</p>
        ${barRow(2, 1, '#ff6b4a')}${barRow(4, 2, '#ffa94d')}${barRow(8, 4, '#4dabf7')}
        <p><b>${fr(1, 2)} = ${fr(2, 4)} = ${fr(4, 8)}</b>: the same amount, with different names. These are <mark>equivalent fractions</mark>.</p>`,
        'These bars are the same size. One half, two quarters and four eighths shade the same amount. They are equivalent fractions.'),
      F(`<p>Cut every piece into 2. There are now twice as many pieces, and twice as many are shaded.</p>
        ${barRow(4, 3, '#ffa94d')}${barRow(8, 6, '#4dabf7')}
        <div class="big small">${fr(3, 4)} = ${fr('3 <mark>× 2</mark>', '4 <mark>× 2</mark>')} = ${fr(6, 8)}</div>
        <p>Rule: <b>multiply the top and the bottom by the same number</b>.</p>`,
        'Cut every piece into two. Three quarters becomes six eighths. Multiply the top and the bottom by the same number.'),
      F(`<div class="big small">${fr(2, 3)} = ${fr('?', 12)}</div>
        <p><b>Step 1.</b> What did the bottom get multiplied by? 3 × <mark>4</mark> = 12</p>
        <p><b>Step 2.</b> Do the same to the top: 2 × <mark>4</mark> = 8</p>
        ${barRow(3, 2, '#ff6b4a')}${barRow(12, 8, '#4dabf7')}
        <div class="big small">${fr(2, 3)} = ${fr('<span class="alt">8</span>', 12)}</div>`,
        'Two thirds equals what over twelve? Three times four is twelve, so multiply the top by four too. Two times four is eight. Two thirds equals eight twelfths.'),
      F(`<p>Watch out: <b>do not add</b>.</p>
        <div class="lcmp"><div class="lno">✗ Add 9 to both<span class="lfl">${fr(2, 3)} → ${fr(11, 12)}</span>${bar(12, 11, '#adb5bd', 220)}<small>Too much shaded!</small></div>
        <div class="lyes">✓ Multiply both by 4<span class="lfl">${fr(2, 3)} → ${fr(8, 12)}</span>${bar(12, 8, '#4dabf7', 220)}<small>Same amount</small></div></div>`,
        'Watch out. Do not add the same number to the top and bottom. Two thirds is not eleven twelfths. Multiply instead: eight twelfths.'),
      T(`<p>Your turn. Fill in the missing number.</p><div class="big small">${fr(3, 4)} = ${fr('?', 8)}</div>${barRow(4, 3, '#ffa94d')}`,
        ['3', '4', '6', '7'], 2,
        'Yes! 4 × 2 = 8, so 3 × 2 = 6.',
        'Not quite. What times 4 makes 8? Do the same to the 3.',
        'Your turn. Three quarters equals what over eight?')
    ]
  })
};
