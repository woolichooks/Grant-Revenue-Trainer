/* ============================================================
   Engine + content regression tests.
   These pin the accounting-accurate answers so the port (and any
   future refactor) cannot silently drift the numbers, citations,
   or present-value math.
   ============================================================ */
import { describe, it, expect } from 'vitest';
import {
  buildQuestions,
  isCorrect,
  pvOfSchedule,
  parseMoney,
  fmtMoney,
  displayAnswer,
  topicAccuracy,
} from './engine';
import { SCENARIOS } from '../data/scenarios';
import { TOPICS } from '../data/topics';
import type { Question, Scenario, Settings } from '../data/types';

const OFF: Settings = { pvMode: false, pvRate: 5 };
const byId = (id: string): Scenario => SCENARIOS.find((s) => s.id === id)!;
const q = (s: Scenario, topic: string, settings: Settings = OFF): Question =>
  buildQuestions(s, settings).find((x) => x.topic === topic)!;

describe('money helpers', () => {
  it('formats and parses round-trip', () => {
    expect(fmtMoney(85782)).toBe('$85,782');
    expect(parseMoney('$85,782')).toBe(85782);
    expect(parseMoney('110000')).toBe(110000);
    expect(Number.isNaN(parseMoney(''))).toBe(true);
  });
});

describe('present-value math', () => {
  it('discounts $30k×3 to $85,782 at 5% (first installment undiscounted)', () => {
    expect(pvOfSchedule([30000, 30000, 30000], 5)).toBe(85782);
  });
  it('0% leaves the schedule undiscounted', () => {
    expect(pvOfSchedule([30000, 30000, 30000], 0)).toBe(90000);
  });
});

describe('scenario structure', () => {
  it('has six scenarios with stable ids in level order s1,s2,s3,s4,s6,s5', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual(['s1', 's2', 's3', 's4', 's6', 's5']);
    expect(SCENARIOS.map((s) => s.levelIndex)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('every scenario answers all seven determinations', () => {
    for (const s of SCENARIOS) {
      for (const t of TOPICS) {
        expect(s.determinations[t.key], `${s.id}.${t.key}`).toBeDefined();
      }
    }
  });
});

describe('known-good answers (FASB-accurate)', () => {
  it('L1 unrestricted gift — recognize $25,000, unconditional, no refundable advance', () => {
    const s = byId('s1');
    expect(q(s, 'restricted').answer).toBe('Without donor restrictions');
    expect(q(s, 'conditional').answer).toBe('Unconditional');
    expect(q(s, 'recognized').answer).toBe(25000);
    expect(q(s, 'refundable').answer).toBe('No');
  });

  it('L2 program grant — restricted but unconditional, recognize $40,000', () => {
    const s = byId('s2');
    expect(q(s, 'restricted').answer).toBe('With donor restrictions');
    expect(q(s, 'conditional').answer).toBe('Unconditional');
    expect(q(s, 'type').answer).toBe('Program');
    expect(q(s, 'recognized').answer).toBe(40000);
  });

  it('L3 multi-year pledge trap — full $90,000 recognized when PV off', () => {
    const s = byId('s3');
    expect(q(s, 'total').answer).toBe(90000);
    expect(q(s, 'recognized').answer).toBe(90000);
    expect(q(s, 'conditional').answer).toBe('Unconditional');
    expect(q(s, 'type').answer).toBe('Time');
  });

  it('L4 cost-reimbursement — recognize $110,000 with a $10,000 refundable advance', () => {
    const s = byId('s4');
    expect(q(s, 'conditional').answer).toBe('Conditional');
    expect(q(s, 'type').answer).toBe('Expense');
    expect(q(s, 'total').answer).toBe(150000);
    expect(q(s, 'recognized').answer).toBe(110000);
    expect(q(s, 'refundable').answer).toBe('Yes');
  });

  it('L5 capital milestone (s6) — recognize only the cleared $200,000', () => {
    const s = byId('s6');
    expect(s.levelIndex).toBe(5);
    expect(q(s, 'conditional').answer).toBe('Conditional');
    expect(q(s, 'type').answer).toBe('Project');
    expect(q(s, 'total').answer).toBe(600000);
    expect(q(s, 'recognized').answer).toBe(200000);
  });

  it('L6 multi-element (s5) — recognize Year-1 $150,000, advance flips to revenue', () => {
    const s = byId('s5');
    expect(s.levelIndex).toBe(6);
    expect(q(s, 'conditional').answer).toBe('Conditional');
    expect(q(s, 'type').answer).toBe('Department');
    expect(q(s, 'total').answer).toBe(300000);
    expect(q(s, 'recognized').answer).toBe(150000);
    expect(q(s, 'refundable').answer).toBe('No');
  });
});

describe('present-value mode (Level 3 only)', () => {
  it('changes the recognized answer to the discounted PV with $100 tolerance', () => {
    const s = byId('s3');
    const rec = q(s, 'recognized', { pvMode: true, pvRate: 5 });
    expect(rec.answer).toBe(85782);
    expect(rec.tol).toBe(100);
    expect(rec.prompt).toContain('present value');
    // total award stays the gross pledge receivable
    expect(q(s, 'total', { pvMode: true, pvRate: 5 }).answer).toBe(90000);
  });

  it('does NOT affect conditional multi-year grants (Level 6 / s5)', () => {
    const s = byId('s5');
    const rec = q(s, 'recognized', { pvMode: true, pvRate: 5 });
    expect(rec.answer).toBe(150000); // unchanged — not pvEligible
  });
});

describe('grading', () => {
  it('numeric answers use exact ±0.5 tolerance by default', () => {
    const rec = q(byId('s1'), 'recognized');
    expect(isCorrect(rec, '25000')).toBe(true);
    expect(isCorrect(rec, '$25,000')).toBe(true);
    expect(isCorrect(rec, '24000')).toBe(false);
  });

  it('PV answers accept anything within ±$100', () => {
    const rec = q(byId('s3'), 'recognized', { pvMode: true, pvRate: 5 });
    expect(isCorrect(rec, '85782')).toBe(true);
    expect(isCorrect(rec, '85700')).toBe(true); // within tolerance
    expect(isCorrect(rec, '85000')).toBe(false); // outside tolerance
  });

  it('MC answers must match exactly', () => {
    const cond = q(byId('s4'), 'conditional');
    expect(isCorrect(cond, 'Conditional')).toBe(true);
    expect(isCorrect(cond, 'Unconditional')).toBe(false);
    expect(isCorrect(cond, '')).toBe(false);
  });

  it('displayAnswer formats numeric answers as money', () => {
    expect(displayAnswer(q(byId('s4'), 'recognized'))).toBe('$110,000');
  });
});

describe('topicAccuracy aggregation', () => {
  it('counts right/total per topic across scenarios', () => {
    const acc = topicAccuracy({
      s1: { conditional: { given: 'Unconditional', correct: true } },
      s4: { conditional: { given: 'Unconditional', correct: false } },
    });
    expect(acc.conditional).toEqual({ right: 1, total: 2, label: 'Condition' });
    expect(acc.recognized).toEqual({ right: 0, total: 0, label: 'Current-year revenue' });
  });
});
