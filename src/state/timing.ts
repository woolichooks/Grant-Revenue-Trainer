/* ============================================================
   Per-level solve timing. We accumulate active play time per scenario
   (banked across resume sessions) and stamp completion. Persisted alongside
   the rest of the game state in localStorage.
   ============================================================ */

export interface LevelTime {
  /** Accumulated active play time for the level, in milliseconds. */
  activeMs: number;
  /** True once the level has been completed (and its time submitted). */
  completed: boolean;
  /** Epoch ms of first completion. */
  completedAt?: number;
}

/** times[scenarioId] = LevelTime */
export type LevelTimes = Record<string, LevelTime>;

/** Format a duration in ms as M:SS (or H:MM:SS past an hour). */
export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
