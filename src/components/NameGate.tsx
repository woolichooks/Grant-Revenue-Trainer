/* ============================================================
   One-time name prompt. Shown when no player name is stored yet; the name
   is remembered (localStorage) and attached to every solve-time submission.
   ============================================================ */
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NameGateProps {
  onSubmit: (name: string) => void;
}

export function NameGate({ onSubmit }: NameGateProps) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  function submit() {
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src="assets/woolichooks-monogram.png"
          alt="Woolichooks"
          style={{ width: 56, height: 56, borderRadius: 14, display: 'inline-block', marginBottom: 14 }}
        />
        <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 30, color: 'var(--ww-blue)', lineHeight: 1 }}>
          Grant Trainer
        </div>
        <h1
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 25,
            color: 'var(--ww-navy-700)',
            margin: '10px 0 6px',
            letterSpacing: '-0.02em',
          }}
        >
          Before you start
        </h1>
        <p
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 14.5,
            color: 'var(--ww-navy-500)',
            maxWidth: 420,
            margin: '0 auto',
            lineHeight: 1.55,
          }}
        >
          Enter your name so your solve times for each level can be recorded. You only need to do this once.
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--ww-border)', borderRadius: 18, padding: '20px 20px 22px', boxShadow: 'var(--ww-shadow-sm)' }}>
        <label
          htmlFor="player-name"
          style={{
            display: 'block',
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ww-navy-300)',
            marginBottom: 8,
          }}
        >
          Your name
        </label>
        <input
          id="player-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="e.g. Jordan P."
          autoFocus
          maxLength={60}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--ww-navy-700)',
            padding: '13px 15px',
            borderRadius: 13,
            border: '2px solid var(--ww-navy-100)',
            outline: 'none',
          }}
        />
        <button
          onClick={submit}
          disabled={!trimmed}
          style={{
            marginTop: 14,
            width: '100%',
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 16,
            border: 0,
            borderRadius: 14,
            padding: '14px',
            cursor: trimmed ? 'pointer' : 'not-allowed',
            background: trimmed ? 'var(--ww-blue)' : 'var(--ww-navy-100)',
            color: trimmed ? '#fff' : 'var(--ww-navy-300)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Start training <ArrowRight size={16} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}
