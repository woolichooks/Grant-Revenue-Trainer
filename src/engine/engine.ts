/* ============================================================
   Grant Trainer — grading + formatting engine.
   Ported faithfully from the prototype engine.js.
   ============================================================ */
import type { Question, Results, Scenario, Settings, TopicKey } from '../data/types';
import { TOPICS, QUESTION_PROMPTS, QUESTION_KIND } from '../data/topics';
import { CITE } from '../data/citations';

export function fmtMoney(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return '$' + Number(n).toLocaleString('en-US');
}

export function parseMoney(str: string | number): number {
  if (typeof str === 'number') return str;
  if (!str) return NaN;
  const cleaned = String(str).replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;
  return parseFloat(cleaned);
}

// Present value of an installment schedule. Index 0 is received now
// (undiscounted); each later installment is discounted by its index in years.
export function pvOfSchedule(schedule: number[], ratePct: number): number {
  const r = (ratePct || 0) / 100;
  return Math.round(schedule.reduce((sum, amt, i) => sum + amt / Math.pow(1 + r, i), 0));
}

// Build the ordered question list (one per topic) for a scenario.
// When pvMode is on and the scenario is an unconditional multi-year pledge
// (pvEligible), the current-year revenue answer becomes the discounted PV.
export function buildQuestions(scenario: Scenario, settings: Settings): Question[] {
  const pvActive = !!(settings?.pvMode && scenario.pvEligible && scenario.pvSchedule);
  return TOPICS.map((t) => {
    const det = scenario.determinations[t.key];
    const kindMeta = QUESTION_KIND[t.key];
    const q: Question = {
      topic: t.key,
      topicLabel: t.label,
      topicShort: t.short,
      prompt: det.prompt || QUESTION_PROMPTS[t.key],
      kind: kindMeta.kind,
      prefix: kindMeta.prefix || '',
      options: det.options || kindMeta.options || [],
      answer: det.answer,
      explain: det.explain,
      cites: det.cites || [],
      tol: det.tol,
    };
    if (pvActive && t.key === 'recognized' && scenario.pvSchedule) {
      const gross = scenario.pvSchedule.reduce((a, b) => a + b, 0);
      const pv = pvOfSchedule(scenario.pvSchedule, settings.pvRate);
      q.answer = pv;
      q.tol = 100; // allow small rounding differences
      q.prompt = `How much contribution revenue is recognized in FY2026 — discounted to present value at ${settings.pvRate}%?`;
      q.explain = `With present-value discounting at ${settings.pvRate}% per year, the unconditional ${fmtMoney(
        gross,
      )} promise is recognized at its present value of ${fmtMoney(pv)} in FY2026 — the first ${fmtMoney(
        scenario.pvSchedule[0],
      )} installment now (undiscounted), plus each later installment discounted by the number of years until receipt. The gross ${fmtMoney(
        gross,
      )} is recorded as a pledge receivable; the discount unwinds as additional contribution revenue over the collection period.`;
      q.cites = [CITE.pv, CITE.uncondRec];
    }
    return q;
  });
}

// Returns true if `given` matches the question's answer.
export function isCorrect(q: Question, given: string | number | null | undefined): boolean {
  if (given === null || given === undefined || given === '') return false;
  if (q.kind === 'num') {
    const a = parseMoney(q.answer as number);
    const g = parseMoney(given);
    if (Number.isNaN(g)) return false;
    const tol = q.tol != null ? q.tol : 0.5;
    return Math.abs(a - g) <= tol;
  }
  return String(given).trim() === String(q.answer).trim();
}

// Format the canonical correct answer for display.
export function displayAnswer(q: Question): string {
  if (q.kind === 'num') return fmtMoney(q.answer as number);
  return String(q.answer);
}

export interface TopicAccuracy {
  right: number;
  total: number;
  label: string;
}

// Aggregate per-topic accuracy across a results map.
export function topicAccuracy(results: Results): Record<TopicKey, TopicAccuracy> {
  const acc = {} as Record<TopicKey, TopicAccuracy>;
  TOPICS.forEach((t) => {
    acc[t.key] = { right: 0, total: 0, label: t.label };
  });
  Object.values(results).forEach((byTopic) => {
    Object.entries(byTopic).forEach(([topic, r]) => {
      const key = topic as TopicKey;
      if (!acc[key] || !r) return;
      acc[key].total += 1;
      if (r.correct) acc[key].right += 1;
    });
  });
  return acc;
}
