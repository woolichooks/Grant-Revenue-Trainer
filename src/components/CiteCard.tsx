import { BookOpen } from 'lucide-react';
import type { Cite } from '../data/types';

interface CiteCardProps {
  cite: Cite;
  tone?: 'light' | 'dark';
}

/** FASB citation card — code + paraphrased text, grounded in the source standards. */
export function CiteCard({ cite, tone = 'light' }: CiteCardProps) {
  const dark = tone === 'dark';
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        background: dark ? 'rgba(255,255,255,0.08)' : 'var(--ww-blue-100)',
        border: dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(25,90,241,0.18)',
        borderRadius: 12,
        padding: '10px 12px',
      }}
    >
      <BookOpen
        size={15}
        strokeWidth={2}
        color={dark ? '#fff' : 'var(--ww-blue)'}
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div
          style={{
            fontFamily: "'SF Mono', ui-monospace, Menlo, monospace",
            fontSize: 11.5,
            fontWeight: 700,
            color: dark ? '#fff' : 'var(--ww-blue-700)',
            letterSpacing: '0.01em',
          }}
        >
          {cite.code}
        </div>
        <div
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 12.5,
            lineHeight: 1.5,
            color: dark ? 'rgba(255,255,255,0.82)' : 'var(--ww-navy-500)',
            marginTop: 3,
          }}
        >
          {cite.text}
        </div>
      </div>
    </div>
  );
}
