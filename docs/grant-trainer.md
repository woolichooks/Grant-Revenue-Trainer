# Grant Revenue Recognition Trainer

An interactive training game that teaches a staff accountant how to perform
nonprofit **grant revenue recognition** under US GAAP — **ASC 958-605 / ASU
2018-08** (conditional vs. unconditional) and **ASU 2016-14** (net-asset
classification).

The learner reads a realistic grant-agreement excerpt and makes **seven
determinations** about it across **6 levels** that ramp from easy to hard. Each
answer is graded instantly with an explanation and the relevant FASB citation.
Progress (points, streak, per-determination mastery) persists across reloads.

## Stack

- **Vite + React 18 + TypeScript** (static SPA)
- **lucide-react** icons
- **Woolichooks design tokens** in `src/styles/tokens.css`
- **Vitest** for the engine/content regression tests

## Run it

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build
npm test         # run the engine + content regression tests
```

## Project layout

```
src/
  data/        FASB content, ported verbatim — scenarios, citations, topics, types
  engine/      grading, present-value math, money formatting (+ engine.test.ts)
  state/       useGameState — localStorage persistence + derived values
  components/  presentational primitives (Pill, CiteCard, Feedback, ExcerptBlocks, …)
  screens/     HomeScreen · PlayScreen · ResultsScreen
  App.tsx      owns screen routing + wiring
```

## Accounting integrity

The dollar amounts, correct answers, and FASB citations live in `src/data/` and
are **accounting-accurate** — they must not drift. `src/engine/engine.test.ts`
pins the known-good values (e.g. the multi-year pledge present value of
**$85,782 at 5%**, Level 4's $110,000 recognized with a $10,000 refundable
advance) so any regression fails the test suite. The citations were verified
against the source ASC 958 / ASU 2018-08 standards during the build.

### The seven determinations

1. Restriction status · 2. Condition · 3. Restriction type · 4. Grant period ·
5. Total award · 6. Current-year revenue · 7. Refundable advance

### Challenge Mode

Completing all 6 levels unlocks **Challenge Mode** from a card on the home
screen. It contains two real, deliberately dense grant agreements — the
Calloway Family Foundation grant (a discretionary, report-gated multi-year
grant → *conditional*) and the Whitmore Foundation core-support grant (a right
of return with no barrier → the *unconditional* trap). The excerpts are long
and full of boilerplate, so they take real effort to read. Challenge answers
are worth **2× points**. Challenge content lives in `src/data/challenge.ts`;
scoring weights are in `src/state/scoring.ts`.

### Present-value discounting

A Home-screen setting (3% / 5% / 7%) discounts **only** unconditional multi-year
pledges (Level 3) to present value. Conditional multi-year grants are
intentionally excluded — a teaching point, since you don't recognize future
conditional installments at all.
