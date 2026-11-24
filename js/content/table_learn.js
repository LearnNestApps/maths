// "Learn" explainers for the times tables: what multiplying means, skip counting, turnarounds,
// a trick for that table, and the matching division facts. Built for any table n (2–30).

const dots = (rows, cols, r = 9, gap = 26, color = 'var(--acc)') => {
  let s = ''; for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) s += `<circle cx="${18 + j * gap}" cy="${18 + i * gap}" r="${r}" style="fill:${color}"/>`;
  return `<svg viewBox="0 0 ${cols * gap + 10} ${rows * gap + 10}" class="tl-dots" preserveAspectRatio="xMidYMid meet" style="max-width:${Math.min(100, cols * 9)}%">${s}</svg>`;
};
const bars = (count, n) => `<div class="tl-bars">${Array.from({ length: count }, () => `<div class="tl-bar"><b>${n}</b></div>`).join('')}</div>`;

// Skip-counting number line with hops that appear one after another.
function hopLine(n, hops = 10) {
  const W = 620, x = k => 20 + k * (W - 40) / hops;
  let s = `<path d="M10 70H${W - 10}" stroke="currentColor" stroke-width="3"/>`;
  for (let k = 0; k <= hops; k++) s += `<path d="M${x(k)} 62V78" stroke="currentColor" stroke-width="3"/>`;
  for (let k = 1; k <= hops; k++) {
    const d = (k * .32).toFixed(2);
    s += `<path class="tl-hop" style="animation-delay:${d}s" d="M${x(k - 1)} 62Q${(x(k - 1) + x(k)) / 2} 14 ${x(k)} 62" stroke="var(--acc)" stroke-width="3.5" fill="none"/>`;
    s += `<text class="tl-num" style="animation-delay:${d}s" x="${x(k)}" y="100" text-anchor="middle" font-size="${n * hops > 99 ? 15 : 18}" font-weight="800" fill="currentColor">${n * k}</text>`;
  }
  s += `<text x="${x(0)}" y="100" text-anchor="middle" font-size="18" font-weight="800" fill="currentColor">0</text>`;
  return `<svg viewBox="0 0 ${W} 110" class="tl-line">${s}</svg>`;
}

// One trick per table.
function trick(n) {
  const T = {
    2: ['Double it!', `2 × 8 is just <b>8 + 8 = 16</b>. Every answer is even.`],
    3: ['Add the digits', `Answers go 3, 6, 9, 12, 15, 18… The digits of every answer add up to 3, 6 or 9 (1 + 8 = 9).`],
    4: ['Double, then double again', `4 × 7: double 7 = <b>14</b>, double 14 = <b>28</b>.`],
    5: ['Half of 10 ×', `5 × 8 is half of 10 × 8 = 80, so <b>40</b>. Answers always end in <b>0 or 5</b>.`],
    6: ['5 × and one more group', `6 × 7 = 5 × 7 + 7 = 35 + 7 = <b>42</b>. Bonus: 6 × an even number ends in that number (6 × 4 = 2<b>4</b>, 6 × 8 = 4<b>8</b>).`],
    7: ['5 × plus 2 ×', `7 × 6 = 5 × 6 + 2 × 6 = 30 + 12 = <b>42</b>.`],
    8: ['Double three times', `8 × 6: 6 → 12 → 24 → <b>48</b>.`],
    9: ['10 × take away one', `9 × 7 = 10 × 7 − 7 = 70 − 7 = <b>63</b>. The digits of the answer add to 9 (6 + 3).`],
    10: ['Add a zero', `10 × 7 = <b>70</b>. The digits move one place to the left.`],
    11: ['Repeat the digit', `Up to 9: 11 × 4 = <b>44</b>, 11 × 7 = <b>77</b>. 11 × 12 = 120 + 12 = <b>132</b>.`],
    12: ['10 × plus 2 ×', `12 × 7 = 70 + 14 = <b>84</b>.`],
    13: ['10 × plus 3 ×', `13 × 6 = 60 + 18 = <b>78</b>.`],
    14: ['Double the 7s', `14 × 6 = double 7 × 6 = double 42 = <b>84</b>.`],
    15: ['10 × plus half of it', `15 × 8 = 80 + 40 = <b>120</b>.`],
    16: ['Double the 8s', `16 × 7 = double 56 = <b>112</b>.`],
    17: ['10 × plus 7 ×', `17 × 6 = 60 + 42 = <b>102</b>.`],
    18: ['20 × take away 2 ×', `18 × 7 = 140 − 14 = <b>126</b>.`],
    19: ['20 × take away one', `19 × 6 = 120 − 6 = <b>114</b>.`],
    20: ['2 ×, then add a zero', `20 × 7: 2 × 7 = 14, so <b>140</b>.`]
  };
  if (T[n]) return T[n];
  const u = n - 20; return ['20 × plus the rest', `${n} × 6 = 20 × 6 + ${u} × 6 = 120 + ${u * 6} = <b>${n * 6}</b>.`];
}

export function tableExplainer(n, label) {
  const k = n <= 5 ? 4 : 3, prod = n * k, small = n <= 12;
  const [tName, tText] = trick(n);
  const a = Math.min(9, Math.max(3, 6)), d = n * a;
  return {
    title: label || `Learn the table of ${n}`,
    frames: [
      { html: `<div class="big">${k} × ${n} = ?</div>${small ? dots(k, n) : bars(k, n)}<p><b>${k} × ${n}</b> means <b>${k} groups of ${n}</b>. Count them: ${Array.from({ length: k }, (_, i) => n * (i + 1)).join(', ')}. So ${k} × ${n} = <b>${prod}</b>.</p>`,
        say: `${k} times ${n} means ${k} groups of ${n}. Count them: ${Array.from({ length: k }, (_, i) => n * (i + 1)).join(', ')}. So ${k} times ${n} is ${prod}.` },
      { html: `<div class="big small">Count in ${n}s</div>${hopLine(n)}<p>Each hop adds <b>${n}</b>. The numbers you land on are the <b>table of ${n}</b>.</p>`,
        say: `Count in ${n}s: ${Array.from({ length: 10 }, (_, i) => n * (i + 1)).join(', ')}.` },
      { html: `<div class="big small">${k} × ${n} = ${n} × ${k}</div>${small && n <= 10 ? `<div class="tl-two">${dots(k, n, 7, 20)}<span>=</span>${dots(n, k, 7, 20)}</div>` : ''}<p>Turn it round and the answer stays the same. So you already know some of this table from smaller tables!</p>`,
        say: `${k} times ${n} is the same as ${n} times ${k}. Turning it round does not change the answer.` },
      { html: `<div class="big small">Trick: ${tName}</div><p class="tl-trick">${tText}</p>`, say: `Here is a trick for the ${n} times table. ${tName}. ${tText.replace(/<[^>]+>/g, '')}` },
      { html: `<div class="tl-family"><div><b>${a} × ${n} = ${d}</b></div><div>${n} × ${a} = ${d}</div><div>${d} ÷ ${n} = ${a}</div><div>${d} ÷ ${a} = ${n}</div></div><p>One fact gives you <b>four</b>: two times facts and two division facts. Now let's play!</p>`,
        say: `One fact gives you four. ${a} times ${n} is ${d}, so ${d} divided by ${n} is ${a}. Now let's play!` }
    ]
  };
}
