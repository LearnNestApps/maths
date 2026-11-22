# Maths App: Master Plan (JK to Adult)

**Status:** updated 22 Nov 2026. Steps 1 (foundation) and 2 (Little Learners) are built.
**Companion doc:** `claude/maths-curriculum-map.md` in the Maths project (the full topic list by strand).

**Changes on 22 Nov 2026 (owner's decisions):** English only (Marathi and Hindi dropped); no school-board selection; an admin view that shows every topic; code kept in a GitHub repository.

---

## 1. What we're building

One app, **Pip Maths**, that takes a learner from their first counting game at age 3 to adult brush-up and university topics. It has:

- **4 modes**, one per age band. Each mode changes the look, the voice, how lessons are taught and how rewards work.
- **4 tracks**, which run across the modes: School Curriculum, Vedic Maths, Indian Exams, and Other Methods.
- **One shared lesson engine**, so each new topic is data, not new code.
- **An admin view** listing every lesson in every mode, with search, filters by mode, and a "Try" button.

**Principles**
1. **Complete before launch.** Every mode and every track ships with real content.
2. **Show, then do.** Every new idea starts with a picture or animation before any symbols.
3. **Never a dead end.** A wrong answer leads to a hint, then a worked example, never just a red X.
4. **One learner, one journey.** The same profile moves up through the modes as the child grows.

---

## 2. The four modes

| | Little Learners | Explorers | Achievers | Adults |
| --- | --- | --- | --- | --- |
| **Ages / grades** | 3–7 · JK–Grade 2 | 8–13 · Grades 3–8 | 14–18 · Grades 9–12 | 18+ |
| **Look** | Pip's pond world: big, bright, cartoon | Island map, one island per strand | Clean dashboard, light or dark | Minimal and dark |
| **Reading needed** | None; everything is spoken | Short sentences, read-aloud on tap | Full text with maths notation | Full text |
| **Lesson style** | Play-only micro-games, 5 rounds | Short visual lesson, guided practice, quest | Concept, worked example, practice, timed quiz | Quick refresher, drill or deep dive |
| **Hints** | Glow and count aloud after 2 wrong tries | Hint, then a worked example | Step-by-step solution | Solution on request |
| **Rewards** | Stickers and a sticker book | Coins, badges, streaks | Mastery %, exam readiness | Streaks, mastery % |
| **Mascot** | Pip, fully animated | Pip as a guide | Pip as a small helper | None |

The app picks the mode from the learner's age; a grown-up can override it.

---

## 3. Track A: School Curriculum

All 15 strands from the curriculum map, organised as **Level → Unit → Skill → Activity**. Levels run JK, SK, G1 … G12, then University. There is no school-board selection: lessons follow one combined sequence by grade.

University (Adult mode): linear algebra, calculus I–III, differential equations, probability and statistics, discrete maths; abstract algebra, topology and analysis as reading and proof modules.

---

## 4. Track B: Vedic Maths

Taught as named mental-maths shortcuts from Bharati Krishna Tirtha's *Vedic Mathematics* (1965), always with a "why it works" step in ordinary algebra.

| # | Sutra | Used for | Mode |
| --- | --- | --- | --- |
| 1 | Ekadhikena Purvena | Squares ending in 5; 1/19-type decimals | Explorers |
| 2 | Nikhilam Navatashcaramam Dashatah | Subtracting from 100/1000; multiplying near a base | Explorers |
| 3 | Urdhva-Tiryagbhyam | General multiplication; polynomials | Explorers → Achievers |
| 4 | Paravartya Yojayet | Division near a base; equations | Explorers → Achievers |
| 5 | Shunyam Saamyasamuccaye | Special linear equations | Achievers |
| 6 | Anurupye Shunyamanyat | Special simultaneous equations | Achievers |
| 7 | Sankalana-Vyavakalanabhyam | Simultaneous equations | Achievers |
| 8 | Puranapuranabhyam | Completing the square; cubics | Achievers |
| 9 | Chalana-Kalanabhyam | Factorising quadratics | Achievers |
| 10 | Yavadunam | Squaring near a base | Explorers |
| 11 | Vyashtisamanstih | Factorising; averages | Achievers |
| 12 | Shesanyankena Charamena | Recurring decimals such as 1/7 | Explorers |
| 13 | Sopaantyadvayamantyam | Special algebraic fractions | Achievers |
| 14 | Ekanyunena Purvena | Multiplying by 9, 99, 999 | Explorers |
| 15 | Gunitasamuchyah | Checking factorisation | Achievers |
| 16 | Gunakasamuchyah | Checking factorisation and derivatives | Achievers |

Also: Beejank (digit sums) for checking, vinculum numbers, Vedic squares, cubes and roots, divisibility tests, and an adult "Vedic speed maths" course.

---

## 5. Track C: Indian Exams (maths and reasoning sections only, in English)

- **Maharashtra State Scholarship (MSCE), Classes 4 and 7:** Mathematics (50 Q) and the Intelligence Test. Next exam: 21 Feb 2027.
- **NMMS, Class 8:** all of the Mental Ability Test plus the maths part of the Scholastic Aptitude Test.
- **SOF IMO, Classes 1–12:** Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, Achievers Section; Level 1 and Level 2.
- **NTSE:** held in reserve until NCERT announces it again.
- **Later packs:** JNVST (Navodaya), Sainik School, other Olympiads.

Each pack: topic-wise question bank, sectional tests, full mocks in the real format with timer and question palette, section-wise reports, weak-topic links back to lessons, original questions only.

---

## 6. Track D: Other Methods

- **Abacus (soroban):** 8 levels, from bead values to Anzan (mental abacus).
- **Singapore bar models:** part-whole, comparison, before-and-after, fractions, ratio, percentage.
- **Speed maths:** Trachtenberg-style shortcuts, combined with Vedic tricks in a "Speed Arena".
- **Puzzles and reasoning:** from picture puzzles for little ones to Kakuro and olympiad problems.

---

## 7. Lesson engine (12 templates)

Tap-to-select, drag-and-drop, balance, number pad, maths keyboard, multiple choice, worked steps, manipulatives (abacus, number line, clock, bar model), graph plotter, timed drill, mock test runner, animated explainer. Step 2 adds picture-pick, sorting bins, pattern caterpillar, place-value builder and sharing.

Content model: `Track → Level → Unit → Skill → Activity`. Skills live in `content/skills.json`; questions come from generators so practice never runs out.

## 8. Learning logic

Mastery at 80%+ over the last 10 first-try answers across 2+ days; spaced review after 2, 7 and 30 days; hint ladder (try again → hint → worked solution); "Up next" recommendation.

## 9. Screens

Onboarding (name, colour, age) · learner switcher · grown-ups area behind a press-and-hold (settings, progress table, admin view) · four mode homes · lesson player · results · admin "All topics" catalogue · Exam Centre (Step 4) · sticker book (Step 2).

## 10. Language

English only, with spoken prompts in an Indian English voice where the device has one. All text is kept in one strings file, so another language could be added later without code changes.

## 11. Tech and code

- **App:** plain JavaScript modules, HTML and CSS; no build step. Runs as a web page today; can become an installable offline app (PWA) and be wrapped for app stores later.
- **Why no React yet:** package installs are switched off in Claude's network settings. Lessons are data files, so a move to React later reuses all content.
- **Data:** progress saved in the browser on one device; account sync later.
- **Code:** GitHub repository [LearnNestApps/maths](https://github.com/LearnNestApps/maths), under the LearnNestApps organisation (kept separate from the FrenchStudy account).

## 12. Build order

1. **Foundation** (done)
2. **Little Learners complete** (done): 57 JK–G2 lessons, abacus levels 1–2, early puzzles, sticker book
3. **Explorers complete:** Grades 3–8, Vedic sutras for this band, abacus 3–8, bar models, speed maths, puzzles
4. **Exam Centre:** MSCE, NMMS, IMO question banks and full mocks
5. **Achievers complete:** Grades 9–12 and remaining sutras
6. **Adults complete:** brush-up courses, Speed Arena, university modules
7. **Voice pack:** recorded English prompts for Little Learners
8. **Polish and testing:** content review, accessibility, offline mode, pilot with families

## 13. Decisions

| Topic | Decision |
| --- | --- |
| Language | English only |
| School boards | No board selection; one combined sequence |
| Admin | "All topics" view in the grown-ups area |
| Exams | MSCE (Classes 4, 7), NMMS, SOF IMO; NTSE in reserve |
| Other methods | Abacus, bar models, speed maths, puzzles |
| Name | Working title "Pip Maths"; check trademark before launch |
| Pricing | Free school lessons; paid family plan for exams, Speed Arena, adult courses |
| Code | GitHub: LearnNestApps/maths |
