/* ============================================================
   Points scoring. Normal answers are worth 10 points each; challenge
   answers are worth double (20). Points are derived from the stored
   results on every render, so replays stay consistent.
   ============================================================ */
import type { Results } from '../data/types';
import { CHALLENGE_SCENARIOS } from '../data/challenge';

export const NORMAL_POINTS = 10;
export const CHALLENGE_POINTS = 20;

export const CHALLENGE_IDS = new Set(CHALLENGE_SCENARIOS.map((s) => s.id));

export function isChallengeId(sid: string): boolean {
  return CHALLENGE_IDS.has(sid);
}

export function computePoints(results: Results): number {
  return Object.entries(results).reduce((total, [sid, byTopic]) => {
    const correct = Object.values(byTopic).filter((x) => x?.correct).length;
    return total + correct * (isChallengeId(sid) ? CHALLENGE_POINTS : NORMAL_POINTS);
  }, 0);
}
