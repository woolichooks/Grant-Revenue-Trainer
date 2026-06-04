/* Challenge-mode content + scoring guarantees. Pins the FASB-accurate
   answers for the two real-world agreements and the 2× points rule. */
import { describe, it, expect } from 'vitest';
import { CHALLENGE_SCENARIOS } from './challenge';
import { TOPICS } from './topics';
import { buildQuestions } from '../engine/engine';
import { computePoints, isChallengeId } from '../state/scoring';
import type { Scenario, Settings } from './types';

const OFF: Settings = { pvMode: false, pvRate: 5 };
const byId = (id: string): Scenario => CHALLENGE_SCENARIOS.find((s) => s.id === id)!;
const q = (s: Scenario, topic: string) => buildQuestions(s, OFF).find((x) => x.topic === topic)!;

describe('challenge structure', () => {
  it('has two challenge scenarios with stable ids and the challenge flag', () => {
    expect(CHALLENGE_SCENARIOS.map((s) => s.id)).toEqual(['c1', 'c2']);
    expect(CHALLENGE_SCENARIOS.every((s) => s.challenge === true)).toBe(true);
  });

  it('answers all seven determinations and carries its own period options + fiscal note', () => {
    for (const s of CHALLENGE_SCENARIOS) {
      for (const t of TOPICS) expect(s.determinations[t.key], `${s.id}.${t.key}`).toBeDefined();
      expect(s.determinations.period.options).toHaveLength(4);
      expect(s.fyeNote).toBeTruthy();
    }
  });

  it('uses deliberately long, dense excerpts (harder to read)', () => {
    for (const s of CHALLENGE_SCENARIOS) {
      // many blocks, including several numbered clauses of boilerplate
      expect(s.excerpt.length).toBeGreaterThanOrEqual(9);
      const clauses = s.excerpt.filter((b) => 'clause' in b).length;
      expect(clauses).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('Calloway (c1) — conditional, discretionary multi-year', () => {
  const s = byId('c1');
  it('is conditional and recognizes only the first cleared installment', () => {
    expect(q(s, 'conditional').answer).toBe('Conditional');
    expect(q(s, 'total').answer).toBe(3000000);
    expect(q(s, 'recognized').answer).toBe(1200000);
    expect(q(s, 'refundable').answer).toBe('No');
  });
  it('overrides the recognized prompt with its calendar reporting year', () => {
    expect(q(s, 'recognized').prompt).toContain('calendar 2026');
  });
  it('answers the 5-year period', () => {
    expect(q(s, 'period').answer).toBe('2026 – 2030 (5 years)');
  });
});

describe('Whitmore (c2) — the unconditional core-support trap', () => {
  const s = byId('c2');
  it('is unconditional and recognizes the full multi-year promise', () => {
    expect(q(s, 'conditional').answer).toBe('Unconditional');
    expect(q(s, 'total').answer).toBe(1200000);
    expect(q(s, 'recognized').answer).toBe(1200000);
    expect(q(s, 'refundable').answer).toBe('No');
  });
  it('overrides the recognized prompt with its FY2027 reporting year', () => {
    expect(q(s, 'recognized').prompt).toContain('FY2027');
  });
});

describe('challenge scoring (2× points)', () => {
  it('flags challenge ids', () => {
    expect(isChallengeId('c1')).toBe(true);
    expect(isChallengeId('c2')).toBe(true);
    expect(isChallengeId('s1')).toBe(false);
  });

  it('scores challenge answers at double the normal rate', () => {
    const normal = computePoints({ s1: { conditional: { given: 'x', correct: true } } });
    const challenge = computePoints({ c1: { conditional: { given: 'x', correct: true } } });
    expect(normal).toBe(10);
    expect(challenge).toBe(20);
  });

  it('mixes normal and challenge correctly', () => {
    const pts = computePoints({
      s1: { restricted: { given: 'x', correct: true }, conditional: { given: 'x', correct: true } }, // 2 × 10
      c2: { restricted: { given: 'x', correct: true }, conditional: { given: 'x', correct: false } }, // 1 × 20
    });
    expect(pts).toBe(40);
  });
});
