import { CURRENT_FY } from '../data/topics';

/** Fiscal-year pill — FY2026 · Jul 1, 2025 – Jun 30, 2026 with a yellow dot. */
export function FYChip({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.12)' : 'var(--ww-blue-100)',
        color: dark ? '#fff' : 'var(--ww-blue-700)',
        fontFamily: "'Montserrat',sans-serif",
        fontWeight: 700,
        fontSize: 12.5,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--ww-yellow)' }} />
      {CURRENT_FY.label} · {CURRENT_FY.range}
    </span>
  );
}
