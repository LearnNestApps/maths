// Templates 7, 9, 10, 11, 12: worked steps, graph plotter, timed drill, mock test runner, animated explainer.
import { h, esc, wiggle, squash, popIn, wait } from '../../core/ui.js';
import { t } from '../../core/i18n.js';
import { sfx, say } from '../../core/audio.js';
import { ICON } from '../../core/art.js';
import { numInput } from './basic.js';
import { GEN } from '../../content/generators.js';

// ----- 7. Step-by-step worked solution -----
export const steps = {
  render(host, act, ctx) {
    const S = act.data.steps; let cur = 0, misses = 0, assisted = false;
    host.innerHTML = `<div class="t-steps"><ol class="sl">${S.map((s, i) => `<li class="st${i ? ' wait' : ' now'}"><span class="sh">${s.html}</span><b class="slot"></b></li>`).join('')}</ol><div class="io"></div></div>`;
    const lis = host.querySelectorAll('.st'), slot = () => lis[cur].querySelector('.slot');
    const ni = numInput(host.querySelector('.io'), { neg: !!act.data.neg, dot: !!act.data.dot, onChange: v => { slot().textContent = v.replace('-', '−'); }, onSubmit: v => check(Number(v)) });
    ctx.onCleanup(() => ni.destroy());
    function advance(ok) {
      lis[cur].classList.remove('now'); lis[cur].classList.add(ok ? 'done' : 'shown'); slot().textContent = String(S[cur].answer).replace('-', '−'); cur++; misses = 0; ni.clear();
      if (cur >= S.length) { ctx.submit(act.answer, { assisted }); return; }
      lis[cur].classList.remove('wait'); lis[cur].classList.add('now'); popIn(lis[cur]);
    }
    function check(v) {
      if (v === S[cur].answer) { sfx.pop(); squash(lis[cur]); advance(true); return; }
      misses++; sfx.boing(); wiggle(lis[cur]); ni.clear(); slot().textContent = '';
      if (misses >= 2) { assisted = true; advance(false); }
    }
    return { hint() { assisted = true; slot().textContent = String(S[cur].answer).replace('-', '−'); lis[cur].classList.add('glow'); } };
  }
};

// ----- 9. Graph plotter: tap two grid points on the line -----
export const graph = {
  render(host, act, ctx) {
    const R = 6, U = 40, size = U * (2 * R + 2), o = size / 2, pts = [];
    const X = x => o + x * U, Y = y => o - y * U;
    let grid = ''; for (let i = -R; i <= R; i++) { grid += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}" class="${i ? 'gl' : 'ax'}"/><line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}" class="${i ? 'gl' : 'ax'}"/>`; if (i && i % 2 === 0) grid += `<text x="${X(i)}" y="${Y(0) + 26}" class="gt">${i}</text><text x="${X(0) - 14}" y="${Y(i) + 7}" class="gt">${i}</text>`; }
    host.innerHTML = `<div class="t-graph"><svg class="gp" viewBox="0 0 ${size} ${size}">${grid}<g class="hintpts"></g><line class="pl" x1="0" y1="0" x2="0" y2="0"/><g class="pts"></g><rect class="hit" width="${size}" height="${size}" fill="transparent"/></svg>
      <div class="gside"><div class="eqn">${esc(act.data.eq)}</div><div class="coords"></div><button class="btn primary checkbtn">${ICON.check}<span>${t('ui.check')}</span></button></div></div>`;
    const svg = host.querySelector('svg'), g = host.querySelector('.pts'), line = host.querySelector('.pl');
    const draw = () => {
      g.innerHTML = pts.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="11" class="pt"/>`).join('');
      host.querySelector('.coords').textContent = pts.map(([x, y]) => `(${x}, ${y})`).join('  ');
      if (pts.length === 2 && (pts[0][0] !== pts[1][0] || pts[0][1] !== pts[1][1])) {
        const [[x1, y1], [x2, y2]] = pts, dx = x2 - x1, dy = y2 - y1, k = 40;
        line.setAttribute('x1', X(x1 - dx * k)); line.setAttribute('y1', Y(y1 - dy * k)); line.setAttribute('x2', X(x1 + dx * k)); line.setAttribute('y2', Y(y1 + dy * k)); line.style.opacity = 1;
      } else line.style.opacity = 0;
    };
    svg.addEventListener('click', e => {
      const r = svg.getBoundingClientRect(), s = size / r.width, x = Math.round(((e.clientX - r.left) * s - o) / U), y = Math.round((o - (e.clientY - r.top) * s) / U);
      if (Math.abs(x) > R || Math.abs(y) > R) return;
      const k = pts.findIndex(p => p[0] === x && p[1] === y); if (k >= 0) pts.splice(k, 1); else { pts.push([x, y]); if (pts.length > 2) pts.shift(); }
      sfx.tap(); draw();
    });
    host.querySelector('.checkbtn').addEventListener('click', () => { if (pts.length < 2) { wiggle(svg); return; } const r = ctx.submit(pts.map(p => [...p])); if (!r.ok) wiggle(svg); });
    const { m, c } = act.data;
    return { hint(l) { const hp = host.querySelector('.hintpts'); hp.innerHTML = `<circle cx="${X(0)}" cy="${Y(c)}" r="16" class="hp"/>` + (l >= 2 ? `<circle cx="${X(1)}" cy="${Y(m + c)}" r="16" class="hp"/>` : ''); } };
  }
};

// ----- 10. Timed drill / flash cards (a whole session) -----
export const drill = {
  session: true,
  render(host, act, ctx) {
    const { gen, params, seconds } = act.data, best = ctx.best();
    host.innerHTML = `<div class="t-drill"><div class="pre"><div class="dbest">${best != null ? t('res.best', { n: best }) : ''}</div><button class="btn primary huge go">${ICON.play}<span>${t('drill.go')}</span></button></div></div>`;
    host.querySelector('.go').addEventListener('click', start);
    let ok = 0, bad = 0, end = 0, timer, q, ni;
    function next() { q = GEN[gen](params); host.querySelector('.dq').textContent = q.q + ' ='; ni.clear(); }
    function start() {
      host.innerHTML = `<div class="t-drill run"><div class="dtop"><div class="tbar"><i></i></div><span class="dleft"></span><span class="dok"></span></div><div class="dq"></div><div class="io"></div></div>`;
      ni = numInput(host.querySelector('.io'), {
        onSubmit: v => judge(v, true),
        onChange: v => judge(v, false)
      });
      ctx.onCleanup(() => { ni.destroy(); clearInterval(timer); });
      end = Date.now() + seconds * 1000; next(); tick(); timer = setInterval(tick, 200);
    }
    function judge(v, force) {
      if (!v) return; const ans = String(q.answer);
      if (v === ans) { ok++; sfx.pop(); squash(host.querySelector('.dq')); next(); }
      else if (force || v.length >= ans.length) { bad++; sfx.boing(); wiggle(host.querySelector('.dq')); ni.clear(); }
      host.querySelector('.dok').textContent = t('drill.answered', { n: ok });
    }
    function tick() {
      const left = Math.max(0, end - Date.now());
      host.querySelector('.tbar i').style.width = (100 * left / (seconds * 1000)) + '%';
      host.querySelector('.dleft').textContent = t('drill.left', { s: Math.ceil(left / 1000) });
      if (!left) { clearInterval(timer); ni.destroy(); ctx.finish({ correct: ok, total: ok + bad, score: ok }); }
    }
    return {};
  }
};

// ----- 11. Mock test runner: sections, timer, question palette, review -----
export const mock = {
  session: true,
  render(host, act, ctx) {
    const { sections, minutes, title, blankMax = 0 } = act.data;
    const qs = sections.flatMap((s, si) => s.qs.map(q => ({ ...q, si, marks: s.marks, pick: null, flag: false })));
    const L = 'ABCDE', show = (q, o) => q.html ? o : esc(o);
    let cur = 0, timer, end = Date.now() + minutes * 60000, done = false;
    host.innerHTML = `<div class="t-mock"><div class="mhead"><b>${esc(title)}</b><span class="mtime" role="timer"></span></div>
      <div class="mtabs">${sections.map((s, i) => `<button class="chip" data-s="${i}">${esc(s.name)}</button>`).join('')}</div>
      <div class="mbody"><div class="mq"></div><div class="mopts"></div></div>
      <div class="mnav"><button class="btn mprev">${t('mock.prev')}</button><button class="btn mflag" aria-label="${t('mock.mark')}">${ICON.flag}<span class="lg">${t('mock.mark')}</span><span class="sm">${t('mock.flag')}</span></button><button class="btn mnext">${t('mock.next')}</button></div>
      <div class="pal">${qs.map((_, i) => `<button class="pq" data-q="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`).join('')}</div>
      <button class="btn primary msub">${t('mock.submit')}</button><p class="mnote">${esc(act.data.note || t('mock.note'))}</p><div class="msheet"></div></div>`;
    const $ = s => host.querySelector(s);
    const markStr = m => `${m} ${m === 1 ? 'mark' : 'marks'}`;
    function show1(i) {
      cur = i; const q = qs[i], sec = sections[q.si];
      $('.mq').innerHTML = `<span class="qn">Q${i + 1} · ${esc(sec.name)} · ${markStr(q.marks)}</span><div>${q.stem}</div>`;
      $('.mopts').innerHTML = q.options.map((o, k) => `<button class="mo${q.pick === k ? ' sel' : ''}" data-k="${k}" aria-pressed="${q.pick === k}"><b>${L[k]}</b><span>${show(q, o)}</span></button>`).join('');
      host.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', +c.dataset.s === q.si));
      host.querySelectorAll('.pq').forEach((p, k) => { p.className = 'pq' + (qs[k].pick != null ? ' pa' : '') + (qs[k].flag ? ' flag' : '') + (k === i ? ' cur' : ''); });
      $('.mflag').classList.toggle('on', q.flag); $('.mprev').disabled = i === 0; $('.mnext').disabled = i === qs.length - 1;
    }
    // Tapping the chosen answer again clears it (blank answers can score in some contests).
    $('.mopts').addEventListener('click', e => { const b = e.target.closest('.mo'); if (!b || done) return; const k = +b.dataset.k; qs[cur].pick = qs[cur].pick === k ? null : k; sfx.tap(); show1(cur); });
    $('.mprev').addEventListener('click', () => show1(Math.max(0, cur - 1)));
    $('.mnext').addEventListener('click', () => show1(Math.min(qs.length - 1, cur + 1)));
    $('.mflag').addEventListener('click', () => { qs[cur].flag = !qs[cur].flag; show1(cur); });
    $('.pal').addEventListener('click', e => { const b = e.target.closest('.pq'); if (b) show1(+b.dataset.q); });
    $('.mtabs').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) show1(qs.findIndex(q => q.si === +b.dataset.s)); });
    const sheet = (msg, yes, no, onYes) => {
      $('.msheet').innerHTML = `<div class="sheetin" role="dialog" aria-modal="true"><p>${msg}</p><div class="row"><button class="btn myes primary">${yes}</button><button class="btn mno">${no}</button></div></div>`;
      $('.msheet').classList.add('on'); $('.mno').focus();
      $('.mno').onclick = () => $('.msheet').classList.remove('on');
      $('.myes').onclick = onYes;
    };
    $('.msub').addEventListener('click', () => sheet(t('mock.confirm', { n: qs.filter(q => q.pick == null).length }), t('mock.yes'), t('mock.no'), finish));
    // Leaving mid-test loses the answers, so ask first.
    if (ctx.setGuard) ctx.setGuard(leave => { if (done) return false; sheet(t('mock.leave'), t('mock.leaveYes'), t('mock.no'), () => { done = true; clearInterval(timer); leave(); }); return true; });
    function finish() {
      if (done) return; done = true; clearInterval(timer);
      let blanks = 0;
      const per = sections.map((s, si) => {
        const sq = qs.filter(q => q.si === si), right = sq.filter(q => q.pick === q.answer).length, wrong = sq.filter(q => q.pick != null && q.pick !== q.answer).length;
        let bl = sq.filter(q => q.pick == null).length; if (blankMax) { bl = Math.min(bl, Math.max(0, blankMax - blanks)); } blanks += bl;
        const m = right * s.marks + (s.blank ? bl * s.blank : 0) - (s.neg ? wrong * s.neg : 0);
        return { name: s.name, right, n: sq.length, m, t: sq.length * s.marks };
      });
      const M = per.reduce((a, p) => a + p.m, 0), T = per.reduce((a, p) => a + p.t, 0), right = per.reduce((a, p) => a + p.right, 0);
      // Topics to practise: lessons behind the questions missed, most missed first.
      const miss = {}; qs.forEach(q => { if (q.pick !== q.answer && q.skill) { miss[q.skill] = miss[q.skill] || { id: q.skill, topic: q.topic, n: 0 }; miss[q.skill].n++; } });
      const weak = Object.values(miss).sort((a, b) => b.n - a.n).slice(0, 6);
      const ext = sections.some(s => s.blank) ? `<p class="mrule">${t('mock.blankRule')}</p>` : '';
      host.innerHTML = `<div class="t-mock res"><h3>${t('mock.result')}</h3><div class="mbig">${t('mock.marks', { m: M, t: T })}</div><p>${t('mock.right', { r: right, n: qs.length })}</p>${ext}
        <table class="mtab"><thead><tr><th>${t('mock.section')}</th><th class="r">✓</th><th class="r">${t('mock.marksH')}</th></tr></thead><tbody>${per.map(p => `<tr><td>${esc(p.name)}</td><td class="r">${p.right}/${p.n}</td><td class="r">${p.m}/${p.t}</td></tr>`).join('')}</tbody></table>
        ${weak.length ? `<div class="weak"><h4>${t('mock.weak')}</h4>${weak.map(w => `<div class="wk"><span>${esc(w.topic)} <small>${t('mock.missed', { n: w.n })}</small></span>${ctx.open ? `<button class="btn wgo" data-id="${esc(w.id)}">${t('mock.practise')}</button>` : ''}</div>`).join('')}</div>` : ''}
        <h4>${t('mock.review')}</h4>
        <ol class="review">${qs.map((q, i) => `<li class="${q.pick === q.answer ? 'ok' : 'no'}"><div class="rq">${q.stem}</div><em>${q.pick == null ? t('mock.blank') : `${t('mock.yours')} ${L[q.pick]}. ${show(q, q.options[q.pick])}`}${q.pick === q.answer ? ' ✓' : ` · ${t('mock.correct')} ${L[q.answer]}. ${show(q, q.options[q.answer])}`}</em>${q.solution && q.solution.length ? `<details><summary>${t('mock.working')}</summary><div class="rsol">${q.solution.map(x => `<div>${x}</div>`).join('')}</div></details>` : ''}</li>`).join('')}</ol>
        <button class="btn primary mdone">${t('ui.continue')}</button></div>`;
      const res = { correct: right, total: qs.length, score: M };
      host.querySelector('.mdone').onclick = () => ctx.finish(res);
      host.querySelectorAll('.wgo').forEach(b => b.onclick = () => ctx.open(b.dataset.id, res));
      host.scrollIntoView && host.scrollIntoView({ block: 'start' });
    }
    function tick() { const left = Math.max(0, end - Date.now()), mm = Math.floor(left / 60000), ss = Math.floor(left / 1000) % 60; const el = $('.mtime'); if (el) { el.textContent = `${mm}:${String(ss).padStart(2, '0')}`; el.classList.toggle('low', left < 5 * 60000); } if (!left) finish(); }
    timer = setInterval(tick, 500); tick(); ctx.onCleanup(() => clearInterval(timer));
    show1(0);
    return {};
  }
};

// ----- 12. Animated explainer (frames + narration) -----
export function explainer(host, ex) {
  return new Promise(resolve => {
    let i = 0;
    host.innerHTML = `<div class="t-ex"><h3>${esc(ex.title)}</h3><div class="frame"></div><div class="exdots">${ex.frames.map(() => '<i></i>').join('')}</div>
      <div class="exnav"><button class="btn exback">${t('ui.back')}</button><button class="btn exsay" aria-label="${t('ui.listen')}">${ICON.speak}</button><button class="btn primary exnext">${t('ui.next')}</button></div><button class="linkbtn exskip">${t('ui.skip')}</button></div>`;
    const fr = host.querySelector('.frame');
    const show = () => {
      fr.innerHTML = ex.frames[i].html; fr.animate?.([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
      host.querySelectorAll('.exdots i').forEach((d, k) => d.classList.toggle('on', k <= i));
      host.querySelector('.exback').disabled = i === 0;
      host.querySelector('.exnext').textContent = i === ex.frames.length - 1 ? t('ex.start') : t('ui.next');
      say(ex.frames[i].say);
    };
    host.querySelector('.exnext').onclick = () => { sfx.tap(); if (i < ex.frames.length - 1) { i++; show(); } else resolve(); };
    host.querySelector('.exback').onclick = () => { if (i > 0) { i--; show(); } };
    host.querySelector('.exsay').onclick = () => say(ex.frames[i].say);
    host.querySelector('.exskip').onclick = () => resolve();
    show();
  });
}
