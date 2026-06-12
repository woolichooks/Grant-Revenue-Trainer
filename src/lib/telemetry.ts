/* ============================================================
   Level-time telemetry. Each time a player completes a level we insert one
   row into Supabase's `level_times` table. Inserts are best-effort: if the
   network or Supabase is unavailable the payload is parked in a localStorage
   outbox and retried the next time the app loads, so a flaky connection
   doesn't silently lose a player's result.
   ============================================================ */
import { supabase } from './supabase';

export interface LevelTimePayload {
  player_name: string;
  level_id: string;
  level_index: number | null;
  level_label: string;
  mode: 'normal' | 'challenge';
  /** Correct determinations, 0–7. */
  score: number;
  /** Accumulated active play time for the level, in milliseconds. */
  active_ms: number;
  /** ISO timestamp of when the level was completed. */
  completed_at: string;
}

const OUTBOX_KEY = 'ww-grant-trainer-outbox-v1';

function readOutbox(): LevelTimePayload[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOutbox(items: LevelTimePayload[]) {
  try {
    if (items.length) localStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
    else localStorage.removeItem(OUTBOX_KEY);
  } catch {
    /* ignore quota/availability errors */
  }
}

/** Attempt a single insert. Returns true on success, false on any failure. */
async function tryInsert(payload: LevelTimePayload): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('level_times').insert(payload);
    if (error) {
      console.warn('[telemetry] insert failed:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[telemetry] insert threw:', e);
    return false;
  }
}

/** Record one completed level. No-op when Supabase isn't configured. */
export async function submitLevelTime(payload: LevelTimePayload): Promise<void> {
  if (!supabase) return;
  const ok = await tryInsert(payload);
  if (!ok) writeOutbox([...readOutbox(), payload]);
}

/** Retry any parked submissions. Call once on app start. */
export async function flushOutbox(): Promise<void> {
  if (!supabase) return;
  const items = readOutbox();
  if (!items.length) return;
  const remaining: LevelTimePayload[] = [];
  for (const item of items) {
    if (!(await tryInsert(item))) remaining.push(item);
  }
  writeOutbox(remaining);
}
