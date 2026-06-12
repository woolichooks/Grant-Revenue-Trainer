import { describe, it, expect } from 'vitest';
import { formatDuration } from './timing';

describe('formatDuration', () => {
  it('formats sub-minute durations as M:SS', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5_000)).toBe('0:05');
    expect(formatDuration(59_000)).toBe('0:59');
  });

  it('formats minutes with zero-padded seconds', () => {
    expect(formatDuration(74_000)).toBe('1:14');
    expect(formatDuration(600_000)).toBe('10:00');
  });

  it('rolls into H:MM:SS past an hour', () => {
    expect(formatDuration(3_600_000)).toBe('1:00:00');
    expect(formatDuration(3_725_000)).toBe('1:02:05');
  });

  it('clamps negatives to zero', () => {
    expect(formatDuration(-500)).toBe('0:00');
  });
});
