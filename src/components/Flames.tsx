import { Flame } from 'lucide-react';

/** Streak indicator — up to 5 flames, min(streak, 5) filled yellow. */
export function Flames({ streak }: { streak: number }) {
  const lit = Math.min(streak, 5);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }} title={`Streak: ${streak}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = i < lit;
        return (
          <Flame
            key={i}
            size={17}
            strokeWidth={2}
            color={on ? 'var(--ww-yellow)' : 'var(--ww-navy-100)'}
            fill={on ? 'var(--ww-yellow)' : 'none'}
            style={{ transition: 'all 200ms' }}
          />
        );
      })}
    </span>
  );
}
