import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Accessible modal overlay: Escape + backdrop click close it, and body
 *  scrolling is locked while it's open. Renders nothing when closed. */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(27,36,64,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'gtRise 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 20,
          boxShadow: 'var(--ww-shadow-xl)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '16px 18px',
            borderBottom: '1px solid var(--ww-border)',
            flexShrink: 0,
          }}
        >
          {title && (
            <h3
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: 'var(--ww-navy-700)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 32,
              height: 32,
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: 'var(--ww-navy-050)',
              color: 'var(--ww-navy-500)',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 18, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
