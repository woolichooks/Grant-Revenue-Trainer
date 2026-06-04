/* ============================================================
   Synthesized sound effects via the Web Audio API.
   No audio assets — each cue is a short oscillator envelope, so
   there is nothing to license and effectively zero bundle cost.

   Browsers only allow audio after a user gesture; every cue here
   fires from a click/Enter handler (answer grading, level finish),
   and we resume() the context defensively before each cue.
   ============================================================ */

let ctx: AudioContext | null = null;
let enabled = true;

/** Wire the mute toggle from settings. `undefined` is treated as on. */
export function setSoundEnabled(on: boolean | undefined): void {
  enabled = on !== false;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

interface NoteOpts {
  type?: OscillatorType;
  gain?: number;
}

/** Schedule one note with a short attack + exponential decay envelope. */
function note(c: AudioContext, freq: number, start: number, dur: number, opts: NoteOpts = {}): void {
  const { type = 'sine', gain = 0.2 } = opts;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

/** Resolve a context that is ready to play, or null if unavailable/disabled. */
function ready(): AudioContext | null {
  if (!enabled) return null;
  const c = getCtx();
  if (!c) return null;
  if (c.state === 'suspended') void c.resume();
  return c;
}

/** Bright rising two-note chime for a correct answer. */
export function playCorrect(): void {
  const c = ready();
  if (!c) return;
  note(c, 659.25, 0, 0.16, { type: 'sine', gain: 0.18 }); // E5
  note(c, 987.77, 0.085, 0.22, { type: 'sine', gain: 0.16 }); // B5
}

/** Soft low two-note descent for a wrong answer — gentle, not harsh. */
export function playWrong(): void {
  const c = ready();
  if (!c) return;
  note(c, 196.0, 0, 0.2, { type: 'triangle', gain: 0.16 }); // G3
  note(c, 146.83, 0.09, 0.26, { type: 'triangle', gain: 0.14 }); // D3
}

/** Ascending major arpeggio fanfare when a level is completed. */
export function playLevelComplete(): void {
  const c = ready();
  if (!c) return;
  const seq = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  seq.forEach((f, i) => note(c, f, i * 0.11, 0.3, { type: 'triangle', gain: 0.16 }));
}
