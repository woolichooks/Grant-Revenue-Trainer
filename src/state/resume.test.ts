import { describe, it, expect } from 'vitest';
import { resumeFrom } from './resume';
import { buildQuestions } from '../engine/engine';
import { SCENARIOS } from '../data/scenarios';
import type { AnswerRecord, TopicKey } from '../data/types';

// Topic order: restricted, conditional, type, period, total, recognized, refundable
const questions = buildQuestions(SCENARIOS[0], { pvMode: false, pvRate: 5 });
const ans = (correct: boolean): AnswerRecord => ({ given: 'x', correct });
const saved = (entries: [TopicKey, boolean][]): Partial<Record<TopicKey, AnswerRecord>> =>
  Object.fromEntries(entries.map(([k, c]) => [k, ans(c)]));

describe('resumeFrom', () => {
  it('starts at question 0 with no streak when nothing is saved', () => {
    expect(resumeFrom(questions, {})).toEqual({ qIdx: 0, streak: 0 });
  });

  it('resumes at the first unanswered question and rebuilds the streak', () => {
    const r = resumeFrom(
      questions,
      saved([
        ['restricted', true],
        ['conditional', true],
        ['type', true],
      ]),
    );
    expect(r).toEqual({ qIdx: 3, streak: 3 });
  });

  it('resets the streak after a wrong answer in the prefix', () => {
    const r = resumeFrom(
      questions,
      saved([
        ['restricted', true],
        ['conditional', false],
        ['type', true],
      ]),
    );
    expect(r).toEqual({ qIdx: 3, streak: 1 });
  });

  it('lands on the summary when every question is answered', () => {
    const all = saved(questions.map((q) => [q.topic, true] as [TopicKey, boolean]));
    const r = resumeFrom(questions, all);
    expect(r.qIdx).toBe(questions.length);
    expect(r.streak).toBe(questions.length);
  });

  it('only counts the contiguous answered prefix if there is a gap', () => {
    // restricted + type answered, conditional missing -> resume at conditional (index 1)
    const r = resumeFrom(
      questions,
      saved([
        ['restricted', true],
        ['type', true],
      ]),
    );
    expect(r).toEqual({ qIdx: 1, streak: 1 });
  });
});
