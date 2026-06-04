import { useState } from 'react';
import type { CSSProperties } from 'react';
import { MessageSquare } from 'lucide-react';
import { Modal } from './Modal';

// Player feedback form (Tally). The /embed URL renders without Tally's page
// chrome; /r is the standalone page used as an "open in new tab" fallback.
const REVIEW_EMBED_URL = 'https://tally.so/embed/xXzM6J?transparentBackground=1&alignLeft=1';
const REVIEW_PAGE_URL = 'https://tally.so/r/xXzM6J';

interface ReviewButtonProps {
  label?: string;
  /** Per-location style overrides merged over the default outline-pill look. */
  style?: CSSProperties;
}

/** "Review this game" button that opens the feedback form in an in-app modal.
 *  Self-contained (owns its open state) so any screen can drop it in. */
export function ReviewButton({ label = 'Review this game', style }: ReviewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 700,
          fontSize: 15,
          borderRadius: 999,
          padding: '14px 20px',
          cursor: 'pointer',
          background: '#fff',
          color: 'var(--ww-blue)',
          border: '1.5px solid var(--ww-blue)',
          ...style,
        }}
      >
        <MessageSquare size={16} /> {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Review this game">
        <p
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 13.5,
            lineHeight: 1.55,
            color: 'var(--ww-navy-500)',
            margin: '0 0 14px',
          }}
        >
          We’d love your feedback on the Grant Trainer — it takes about a minute.
        </p>
        <iframe
          src={REVIEW_EMBED_URL}
          title="Grant Trainer review form"
          loading="lazy"
          style={{
            width: '100%',
            height: 'min(64vh, 520px)',
            border: '1px solid var(--ww-border)',
            borderRadius: 12,
          }}
        />
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <a
            href={REVIEW_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--ww-blue)',
            }}
          >
            Open the form in a new tab ↗
          </a>
        </div>
      </Modal>
    </>
  );
}
