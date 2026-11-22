# Pip Maths

A maths learning app that grows with the learner: playful voice-led games for ages 3–7, an island adventure for 8–13, a study desk for 14–18, and a calm dark tool for adults.

It covers four tracks: **school maths** (JK to university), **Vedic maths** (the 16 sutras), **Indian exam prep** (Maharashtra scholarship, NMMS, SOF IMO) and **other methods** (abacus, Singapore bar models, speed maths, puzzles).

**Live site:** https://learnnestapps.github.io/maths/ (GitHub Pages, updates automatically from `main`).

See [`docs/master-plan.md`](docs/master-plan.md) for the full plan and build order.

## Run it

No build step and no installs. Serve the folder with any static web server and open it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` straight from disk won't work, because browsers block JavaScript modules on `file://`.)

## How it's organised

```
index.html              entry page
css/app.css             all styles; one skin per mode (data-mode on <html>)
content/skills.json     the lesson catalogue (one entry per lesson)
content/explainers.json animated intro frames for lessons such as Vedic sutras
js/main.js              onboarding, mode homes, grown-ups area, admin "All topics"
js/core/                store (profiles, progress), mastery engine, strings, audio, drawings, helpers
js/content/generators.js question generators (each returns one activity)
js/content/generators_little.js  JK–Grade 2 generators
js/content/expr.js      algebra answer checker for the maths keyboard
js/engine/player.js     lesson player: hint ladder, mastery recording, results
js/engine/templates/    the activity templates (tap, drag, balance, number pad, maths keyboard,
                        multiple choice, worked steps, abacus, number line, clock, bar model,
                        graph, timed drill, mock test, explainer; little.js adds picture-pick,
                        sorting, pattern caterpillar, place-value builder, sharing, frog feeding)
```

## Add a lesson

1. If needed, add a generator to `js/content/generators.js`. It returns `{ template, prompt, answer, data, hint, solution }`.
2. Add an entry to `content/skills.json`:

```json
{ "id": "ex-sub2", "track": "school", "modes": ["explore"], "level": "G2", "strand": "Operations",
  "icon": "plus", "gen": "sub2", "items": 8, "title": "2-digit subtraction" }
```

3. Open the grown-ups area (press and hold the gear for 2 seconds), choose **All topics (admin)**, and press **Try** on the new lesson.

## Learning rules

- **Hint ladder:** first wrong answer → "try again"; second → hint; third → worked solution.
- **Mastery:** 80% or more over the last 10 first-try answers, across at least 2 different days.
- **Review:** mastered lessons come back after 2, 7 and 30 days.
- Progress is stored in the browser (localStorage) on one device.

## Status

- **Step 1, foundation:** done. 23 sample lessons across all modes and tracks.
- **Step 2, Little Learners (JK–Grade 2):** done. 57 lessons from first counting to Grade 2 (place value to 1000, adding and taking away to 100, sharing, fractions, time to the quarter hour, money to ₹100, graphs, symmetry), abacus levels 1–2, picture puzzles, and a sticker book.
- **Next:** Step 3, Explorers (Grades 3–8).
