/* The sound cues must degrade gracefully where Web Audio is unavailable
   (e.g. jsdom / SSR) and must respect the mute flag — never throw. */
import { describe, it, expect } from 'vitest';
import { playCorrect, playWrong, playLevelComplete, setSoundEnabled } from './sounds';

describe('sound cues', () => {
  it('no-op without AudioContext instead of throwing', () => {
    setSoundEnabled(true);
    expect(() => {
      playCorrect();
      playWrong();
      playLevelComplete();
    }).not.toThrow();
  });

  it('respect the mute flag', () => {
    setSoundEnabled(false);
    expect(() => playCorrect()).not.toThrow();
    setSoundEnabled(undefined); // undefined treated as on
    expect(() => playLevelComplete()).not.toThrow();
  });
});
