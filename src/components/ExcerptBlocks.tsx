import { Fragment } from 'react';
import type { ExcerptBlock } from '../data/types';

/** Renders the grant-agreement excerpt: meta box, paragraphs, numbered
 *  clauses, yellow "Facts" notes, blue "Policy" notes (PV mode), signatures. */
export function ExcerptBlocks({ blocks }: { blocks: ExcerptBlock[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {blocks.map((b, i) => {
        if ('meta' in b) {
          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '6px 16px',
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--ww-navy-050)',
                border: '1px solid var(--ww-border)',
              }}
            >
              {b.meta.map(([k, v], j) => (
                <Fragment key={j}>
                  <div
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--ww-navy-300)',
                      alignSelf: 'center',
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: 'var(--ww-navy)',
                    }}
                  >
                    {v}
                  </div>
                </Fragment>
              ))}
            </div>
          );
        }
        if ('clause' in b) {
          return (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <span
                style={{
                  fontFamily: "'SF Mono', ui-monospace, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--ww-blue)',
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                {b.clause}
              </span>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.62,
                  color: 'var(--ww-navy)',
                  margin: 0,
                }}
              >
                {b.text}
              </p>
            </div>
          );
        }
        if ('note' in b) {
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 9,
                alignItems: 'flex-start',
                padding: '11px 13px',
                borderRadius: 10,
                background: 'var(--ww-yellow-100)',
                border: '1px solid rgba(242,182,4,0.4)',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Montserrat',sans-serif",
                  color: 'var(--ww-yellow-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                Facts
              </span>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: 'var(--ww-navy)',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {b.note}
              </p>
            </div>
          );
        }
        if ('policy' in b) {
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 9,
                alignItems: 'flex-start',
                padding: '11px 13px',
                borderRadius: 10,
                background: 'var(--ww-blue-100)',
                border: '1px solid rgba(25,90,241,0.28)',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Montserrat',sans-serif",
                  color: 'var(--ww-blue-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                Policy
              </span>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: 'var(--ww-navy)',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {b.policy}
              </p>
            </div>
          );
        }
        if ('sig' in b) {
          return (
            <p
              key={i}
              style={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: 13,
                fontStyle: 'italic',
                color: 'var(--ww-navy-500)',
                margin: '2px 0 0',
              }}
            >
              {b.sig}
            </p>
          );
        }
        return (
          <p
            key={i}
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 13.5,
              lineHeight: 1.65,
              color: 'var(--ww-navy)',
              margin: 0,
            }}
          >
            {b.p}
          </p>
        );
      })}
    </div>
  );
}
