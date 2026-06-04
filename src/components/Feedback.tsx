import { Check, X } from 'lucide-react';
import type { Question } from '../data/types';
import { displayAnswer } from '../engine/engine';
import { CiteCard } from './CiteCard';

interface FeedbackProps {
  correct: boolean;
  q: Question;
  compact?: boolean;
}

/** Post-answer banner: correct/incorrect, the canonical answer, explanation, citations. */
export function Feedback({ correct, q, compact = false }: FeedbackProps) {
  const c = correct;
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1.5px solid ${c ? 'rgba(26,135,84,0.35)' : 'rgba(217,45,32,0.30)'}`,
        background: c ? 'rgba(26,135,84,0.06)' : 'rgba(217,45,32,0.05)',
        padding: compact ? '12px 14px' : '16px 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: c ? 'var(--ww-success)' : 'var(--ww-error)',
            flexShrink: 0,
          }}
        >
          {c ? <Check size={15} strokeWidth={3} color="#fff" /> : <X size={15} strokeWidth={3} color="#fff" />}
        </span>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: c ? 'var(--ww-success)' : 'var(--ww-error)',
          }}
        >
          {c ? 'Correct' : 'Not quite'}
        </span>
        {!c && (
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13.5, color: 'var(--ww-navy-500)' }}>
            Answer: <strong style={{ color: 'var(--ww-navy)' }}>{displayAnswer(q)}</strong>
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: 'var(--ww-navy)',
          margin: '0 0 10px',
        }}
      >
        {q.explain}
      </p>
      {q.cites && q.cites.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {q.cites.map((ct, i) => (
            <CiteCard key={i} cite={ct} />
          ))}
        </div>
      )}
    </div>
  );
}
