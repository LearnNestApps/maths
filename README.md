# Pip Maths

A maths learning app that grows with the learner: playful voice-led games for ages 3–7, an island adventure for 8–13, a study desk for 14–18, and a calm dark tool for adults.

It covers seven tracks: **school maths** (JK to university), **tables**, **mental maths tricks**, **Vedic maths** (the 16 sutras), **logic & coding**, **Indian exam prep** (Maharashtra scholarship incl. Buddhimatta, NMMS, SOF IMO) and **other methods** (abacus, Singapore bar models, speed maths, puzzles).

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
js/content/generators_explore.js Grades 3–8 generators
js/content/generators_tables.js, _tricks.js, _reason.js (Buddhimatta), _logic.js (Logic & coding)
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

3. Tap **Grown-ups** (answer the sum), choose **Admin: all lessons**, and press **Try** on the new lesson.

## Grown-ups, admin and dashboard

- **Grown-ups button** (top right of the home screen): answer a quick sum (for example 7 × 9) to open the grown-ups area. Adults skip the sum.
- **Admin page directly:** open https://learnnestapps.github.io/maths/#admin and answer the sum.
- **Admin: all lessons:** every lesson in every age group, with search, age-group filters and a Try button. **Dashboard** sits next to it.
- **Switch, edit or log out:** tap the learner's name at the top left: switch learner, edit name/colour/age, add a learner, or **Log out**. Logging out (or having more than one learner) shows a "Who is playing?" screen when the app opens.
- **Dashboard:** per learner: lessons mastered, right-first-time %, streak, practice time, active days, a 14-day activity chart, progress by track, lessons that need attention (with Try), recent sessions, and a summary of all learners. The **Content** tab counts lessons by track, age group and level.
- There are no online accounts: learners and progress are saved in the browser on each device.

## Learning rules

- **Hint ladder:** first wrong answer → "try again"; second → hint; third → worked solution.
- **Mastery:** 80% or more over the last 10 first-try answers, across at least 2 different days.
- **Review:** mastered lessons come back after 2, 7 and 30 days.
- Progress is stored in the browser (localStorage) on one device.

## Status

- **Step 1, foundation:** done. 23 sample lessons across all modes and tracks.
- **Step 2, Little Learners (JK–Grade 2):** done. 57 lessons from first counting to Grade 2 (place value to 1000, adding and taking away to 100, sharing, fractions, time to the quarter hour, money to ₹100, graphs, symmetry), abacus levels 1–2, picture puzzles, and a sticker book.
- **Tables:** tables 2–20 (one lesson each: fill the chart, then facts, missing numbers and division), tables 21–30, squares 11–30, cubes 1–15, and 60-second sprints.
- **Buddhimatta (intelligence test):** 16 topic lessons (number and letter series, analogies, odd one out, coding-decoding, alphabet positions, directions, ranking, calendar, clocks and mirror time, mirror and water images, counting figures, missing numbers in figures, family relations) and a 25-question practice test.
- **Mental maths tricks:** 14 tricks, each with a short animation and step-by-step practice (make 10, near doubles, round and adjust, adding 9, split into tens and ones, take away 19, count up to subtract, × 5, × 4/× 8 by doubling, 9s on your fingers, × 25, halve and double, × 9/× 99, percentages from 10%).
- **Logic & coding:** algorithms (steps in order), robot programming with sequences, turns and repeat loops, sorting, Venn diagrams (sorting and AND/OR/NOT), logic gates with lamps (AND, OR, NOT, XOR, NAND), reading if/else and loop code, binary bulbs.
- **Step 3, Explorers (Grades 3–8):** done. Number (place value, lakhs and crores, rounding, Roman numerals, negatives, factors, primes, HCF, LCM, divisibility, powers, standard form), operations (3-digit adding and subtracting, long multiplication and division, remainders, BODMAS), fractions, decimals and percentages, ratio (unitary method, sharing, speed-distance-time), algebra (missing numbers, substitution, nth term, equations, simplifying), geometry (angles, triangles, polygons, circles, coordinates, 3D shapes, symmetry), measurement (units, perimeter, area, circles, volume, 24-hour time), money (profit and loss, simple interest), data (mean/median/mode/range, bar graphs, pie charts) and probability. Plus Vedic sutras 10 and 14 and Beejank checking, abacus levels 3–8 with flash Anzan, bar models with units, Speed Arena drills and magic squares.
- **Next:** Step 4, the Exam Centre (full-length mocks), then Achievers (Grades 9–12) and Adults.
