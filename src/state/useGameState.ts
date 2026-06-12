/* ============================================================
   Game state: results, bestStreak, settings, player name & per-level
   solve times — persisted to localStorage. Derived helpers (points,
   completion, score). Completed levels submit their solve time to
   Supabase (see lib/telemetry).
   ============================================================ */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Results, Settings, TopicKey } from '../data/types';
import { SCENARIOS } from '../data/scenarios';
import { CHALLENGE_SCENARIOS } from '../data/challenge';
import { TOPICS } from '../data/topics';
import { computePoints } from './scoring';
import type { LevelTimes } from './timing';
import { flushOutbox, submitLevelTime } from '../lib/telemetry';

const STORE_KEY = 'ww-grant-trainer-v2';

interface StoredState {
  results?: Results;
  bestStreak?: number;
  settings?: Settings;
  player?: string;
  times?: LevelTimes;
}

/** Metadata describing a level, supplied when submitting its solve time. */
export interface LevelMeta {
  levelIndex: number | null;
  levelLabel: string;
  challenge: boolean;
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
  const [player, setPlayerState] = useState<string>(init.player || '');
  const [times, setTimes] = useState<LevelTimes>(init.times || {});

  // Keep the latest player name in a ref so completion callbacks (which are
  // memoized) always submit with the current name, not a stale closure.
  const playerRef = useRef(player);
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Levels already submitted this app session — guards against duplicate
  // submissions (e.g. React StrictMode double-invokes). Cleared on replay.
  const submittedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    saveState({ results, bestStreak, settings, player, times });
  }, [results, bestStreak, settings, player, times]);

  // Retry any solve-time submissions that were parked while offline.
  useEffect(() => {
    void flushOutbox();
  }, []);

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
    // Replaying a level re-times it from scratch and may submit a new row.
    submittedRef.current.delete(sid);
    setTimes((t) => {
      if (!t[sid]) return t;
      const c = { ...t };
      delete c[sid];
      return c;
    });
  }, []);

  const bumpStreak = useCallback((n: number) => {
    setBestStreak((b) => Math.max(b, n));
  }, []);

  const setPlayer = useCallback((name: string) => {
    setPlayerState(name.trim());
  }, []);

  // Bank a session's worth of active play time into a level's running total.
  // Ignored once the level is completed.
  const addSessionTime = useCallback((sid: string, ms: number) => {
    if (ms <= 0) return;
    setTimes((t) => {
      const cur = t[sid] || { activeMs: 0, completed: false };
      if (cur.completed) return t;
      return { ...t, [sid]: { ...cur, activeMs: cur.activeMs + ms } };
    });
  }, []);

  // Mark a level complete and submit its total solve time once. `activeMs` is
  // the final accumulated play time, computed by the caller. Idempotent per
  // level via submittedRef, so it's safe under StrictMode double-invocation.
  const completeLevel = useCallback((sid: string, score: number, activeMs: number, meta: LevelMeta) => {
    if (submittedRef.current.has(sid)) return;
    submittedRef.current.add(sid);
    const completedAt = Date.now();
    setTimes((t) => ({ ...t, [sid]: { activeMs, completed: true, completedAt } }));
    void submitLevelTime({
      player_name: playerRef.current || 'Anonymous',
      level_id: sid,
      level_index: meta.levelIndex,
      level_label: meta.levelLabel,
      mode: meta.challenge ? 'challenge' : 'normal',
      score,
      active_ms: activeMs,
      completed_at: new Date(completedAt).toISOString(),
    });
  }, []);

  const resetAll = useCallback(() => {
    setResults({});
    setBestStreak(0);
    setTimes({});
    submittedRef.current.clear();
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
    player,
    setPlayer,
    times,
    points,
    completedCount,
    challengeCompletedCount,
    challengeUnlocked,
    recordAnswer,
    clearScenario,
    bumpStreak,
    addSessionTime,
    completeLevel,
    resetAll,
  };
}
