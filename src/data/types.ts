/* ============================================================
   Shared types for the Grant Revenue Trainer content + engine.
   ============================================================ */

export interface Cite {
  code: string;
  text: string;
}

export type TopicKey =
  | 'restricted'
  | 'conditional'
  | 'type'
  | 'period'
  | 'total'
  | 'recognized'
  | 'refundable';

export interface Topic {
  key: TopicKey;
  label: string;
  short: string;
}

export type QuestionKindName = 'mc' | 'num';

export interface QuestionKindMeta {
  kind: QuestionKindName;
  options?: string[];
  prefix?: string;
}

/* ---- Agreement excerpt blocks ---- */
export interface MetaBlock {
  meta: [string, string][];
}
export interface ParagraphBlock {
  p: string;
}
export interface ClauseBlock {
  clause: string;
  text: string;
}
export interface NoteBlock {
  note: string;
}
export interface PolicyBlock {
  policy: string;
}
export interface SigBlock {
  sig: string;
}
export type ExcerptBlock =
  | MetaBlock
  | ParagraphBlock
  | ClauseBlock
  | NoteBlock
  | PolicyBlock
  | SigBlock;

/* ---- One determination's correct answer + teaching content ---- */
export interface Determination {
  answer: string | number;
  explain: string;
  cites: Cite[];
  /** Only the `period` determination carries its own option list. */
  options?: string[];
  /** Optional per-determination prompt override (e.g. challenge scenarios with their own reporting year). */
  prompt?: string;
  /** Optional numeric tolerance override (defaults applied in the engine). */
  tol?: number;
}

export interface Scenario {
  id: string;
  level: string;
  levelIndex: number;
  title: string;
  funder: string;
  instrument: string;
  tag: string;
  received: string;
  excerpt: ExcerptBlock[];
  determinations: Record<TopicKey, Determination>;
  /** Present-value discounting applies only to flagged unconditional multi-year pledges. */
  pvEligible?: boolean;
  pvSchedule?: number[];
  /** Per-scenario fiscal-year footnote override (challenge scenarios use different fiscal years). */
  fyeNote?: string;
  /** Marks a challenge-mode scenario (2× points, separate flow). */
  challenge?: boolean;
}

/* ---- Game / persistence state ---- */
export interface Settings {
  pvMode: boolean;
  pvRate: 3 | 5 | 7;
  /** Sound effects. Optional for backward-compatible persisted state; treated as on when undefined. */
  sound?: boolean;
}

export interface AnswerRecord {
  given: string | number;
  correct: boolean;
}

/** results[scenarioId][topicKey] = { given, correct } */
export type Results = Record<string, Partial<Record<TopicKey, AnswerRecord>>>;

/** A built, gradable question (one per topic) for a scenario run. */
export interface Question {
  topic: TopicKey;
  topicLabel: string;
  topicShort: string;
  prompt: string;
  kind: QuestionKindName;
  prefix: string;
  options: string[];
  answer: string | number;
  explain: string;
  cites: Cite[];
  tol?: number;
}
