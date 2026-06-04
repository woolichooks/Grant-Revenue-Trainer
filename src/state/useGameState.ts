/* ============================================================
   Game state: results, bestStreak, settings — persisted to
   localStorage under the prototype's key so the storage contract
   is identical. Derived helpers (points, completion, score).
   ============================================================ */
import { useCallback, useEffect, useState } from 'react';
import type { AnswerRecord, Results, Settings, TopicKey } from '../data/types';
import { SCENARIOS } from '../data/scenarios';
import { CHALLENGE_SCENARIOS } from '../data/challenge';
import { TOPICS } from '../data/topics';
import { computePoints } from './scoring';

const STORE_KEY = 'ww-grant-trainer-v2';

interface StoredState {
  results?: Results;
  bestStreak?: number;
  settings?: Settings;
}

function loadState(): StoredState {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '') || {};
  } catch {
    return {};
  }
}

function saveState(s: StoredState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota/availability errors */
  }
}

export function isComplete(results: Results, sid: string): boolean {
  const r = results[sid];
  return !!r && TOPICS.every((t) => r[t.key]);
}

export function scoreOf(results: Results, sid: string): number {
  const r = results[sid] || {};
  return Object.values(r).filter((x) => x?.correct).length;
}

export function useGameState() {
  const init = loadState();
  const [results, setResults] = useState<Results>(init.results || {});
  const [bestStreak, setBestStreak] = useState<number>(init.bestStreak || 0);
  const [settings, setSettings] = useState<Settings>(init.settings || { pvMode: false, pvRate: 5, sound: true });

  useEffect(() => {
    saveState({ results, bestStreak, settings });
  }, [results, bestStreak, settings]);

  // Points are derived (not accumulated) and recomputed every render so
  // replays stay consistent. Normal answers score 10; challenge answers 20.
  const points = computePoints(results);

  const recordAnswer = useCallback((sid: string, topic: TopicKey, val: AnswerRecord) => {
    setResults((r) => ({ ...r, [sid]: { ...(r[sid] || {}), [topic]: val } }));
  }, []);

  const clearScenario = useCallback((sid: string) => {
    setResults((r) => {
      const c = { ...r };
      delete c[sid];
      return c;
    });
  }, []);

  const bumpStreak = useCallback((n: number) => {
    setBestStreak((b) => Math.max(b, n));
  }, []);

  const resetAll = useCallback(() => {
    setResults({});
    setBestStreak(0);
  }, []);

  const completedCount = SCENARIOS.filter((s) => isComplete(results, s.id)).length;
  const challengeCompletedCount = CHALLENGE_SCENARIOS.filter((s) => isComplete(results, s.id)).length;
  // Challenge mode unlocks once every normal level is complete (i.e. Level 6 done).
  const challengeUnlocked = completedCount === SCENARIOS.length;

  return {
    results,
    bestStreak,
    settings,
    setSettings,
    points,
    completedCount,
    challengeCompletedCount,
    challengeUnlocked,
    recordAnswer,
    clearScenario,
    bumpStreak,
    resetAll,
  };
}
