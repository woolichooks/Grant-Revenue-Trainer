import { ArrowLeft, Swords } from 'lucide-react';
import type { Results } from '../data/types';
import { SCENARIOS } from '../data/scenarios';
import { CHALLENGE_SCENARIOS } from '../data/challenge';
import { TOPICS } from '../data/topics';
import { topicAccuracy } from '../engine/engine';
import { isComplete, scoreOf } from '../state/useGameState';
import { isChallengeId } from '../state/scoring';
import { ReviewButton } from '../components/ReviewButton';

interface ResultsScreenProps {
  results: Results;
  points: number;
  bestStreak: number;
  completedCount: number;
  onHome: () => void;
  onReset: () => void;
}

export function ResultsScreen({ results, points, bestStreak, completedCount, onHome, onReset }: ResultsScreenProps) {
  const scenarios = SCENARIOS;
  // This dashboard summarizes the 6 normal levels; challenge results are tracked
  // separately (and still count toward the doubled Points total shown above).
  const normalResults: Results = Object.fromEntries(
    Object.entries(results).filter(([sid]) => !isChallengeId(sid)),
  );
  const acc = topicAccuracy(normalResults);
  const totalAnswered = Object.values(normalResults).reduce((n, r) => n + Object.keys(r).length, 0);
  const totalRight = Object.values(normalResults).reduce(
    (n, r) => n + Object.values(r).filter((x) => x?.correct).length,
    0,
  );
  const pct = totalAnswered ? Math.round((totalRight / totalAnswered) * 100) : 0;

  // Show the challenge breakdown once it's been unlocked or attempted.
  const challengeAttempted = CHALLENGE_SCENARIOS.some((s) => !!results[s.id]);
  const showChallenge = challengeAttempted || completedCount === scenarios.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onHome}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 0,
            cursor: 'pointer',
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--ww-navy-500)',
          }}
        >
          <ArrowLeft size={16} /> Map
        </button>
        <h2
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: 'var(--ww-navy-700)',
            margin: 0,
          }}
        >
          Results dashboard
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
        {(
          [
            ['Overall', `${pct}%`],
            ['Levels', `${completedCount}/${scenarios.length}`],
            ['Points', points],
            ['Best streak', bestStreak],
          ] as const
        ).map(([k, v]) => (
          <div
            key={k}
            style={{
              background: '#fff',
              border: '1px solid var(--ww-border)',
              borderRadius: 14,
              padding: '14px 10px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: 'var(--ww-navy-700)',
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--ww-navy-300)',
              }}
            >
              {k}
            </div>
          </div>
        ))}
      </div>

      {/* Mastery by topic */}
      <div style={{ background: '#fff', border: '1px solid var(--ww-border)', borderRadius: 18, padding: '20px 22px' }}>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ww-blue)',
            marginBottom: 14,
          }}
        >
          Mastery by determination
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TOPICS.map((t) => {
            const a = acc[t.key];
            const has = a.total > 0;
            const p = has ? Math.round((a.right / a.total) * 100) : 0;
            const col = !has
              ? 'var(--ww-navy-100)'
              : p === 100
                ? 'var(--ww-success)'
                : p >= 50
                  ? 'var(--ww-blue)'
                  : 'var(--ww-error)';
            return (
              <div key={t.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: 'var(--ww-navy)',
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: has ? 'var(--ww-navy-500)' : 'var(--ww-navy-300)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {has ? `${a.right}/${a.total} · ${p}%` : 'not attempted'}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--ww-navy-050)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${has ? p : 0}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: col,
                      transition: 'width 400ms var(--ww-ease)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-scenario */}
      <div style={{ background: '#fff', border: '1px solid var(--ww-border)', borderRadius: 18, padding: '12px 14px' }}>
        {scenarios.map((s, i) => {
          const done = isComplete(results, s.id);
          const sc = scoreOf(results, s.id);
          const attempted = !!results[s.id];
          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 6px',
                borderBottom: i < scenarios.length - 1 ? '1px solid var(--ww-border)' : 'none',
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: done ? 'var(--ww-success)' : 'var(--ww-navy-100)',
                  color: done ? '#fff' : 'var(--ww-navy-300)',
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                {s.levelIndex}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: 'var(--ww-navy-700)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ww-navy-300)' }}>{s.level}</div>
              </div>
              <span
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  color: attempted ? (sc === 7 ? 'var(--ww-success)' : 'var(--ww-navy)') : 'var(--ww-navy-300)',
                }}
              >
                {attempted ? `${sc}/7` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Challenge mode breakdown */}
      {showChallenge && (
        <div style={{ background: '#fff', border: '1px solid var(--ww-border)', borderRadius: 18, padding: '14px 14px 12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 6px 10px',
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ww-yellow-700)',
            }}
          >
            <Swords size={14} color="var(--ww-yellow-700)" />
            Challenge mode
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 999,
                background: 'var(--ww-yellow-100)',
                color: 'var(--ww-yellow-700)',
                letterSpacing: '0.04em',
              }}
            >
              2× POINTS
            </span>
          </div>
          {CHALLENGE_SCENARIOS.map((s) => {
            const done = isComplete(results, s.id);
            const sc = scoreOf(results, s.id);
            const attempted = !!results[s.id];
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 6px',
                  borderTop: '1px solid var(--ww-border)',
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: done ? 'var(--ww-yellow)' : 'var(--ww-navy-100)',
                    color: done ? 'var(--ww-navy)' : 'var(--ww-navy-300)',
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                  }}
                >
                  {s.levelIndex}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: 'var(--ww-navy-700)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ww-navy-300)' }}>{s.level}</div>
                </div>
                <span
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    color: attempted ? (sc === 7 ? 'var(--ww-yellow-700)' : 'var(--ww-navy)') : 'var(--ww-navy-300)',
                  }}
                >
                  {attempted ? `${sc}/7` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={onHome}
          style={{
            flex: 1,
            minWidth: 150,
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 15,
            border: 0,
            borderRadius: 999,
            padding: '14px',
            cursor: 'pointer',
            background: 'var(--ww-blue)',
            color: '#fff',
            boxShadow: 'var(--ww-shadow-md)',
          }}
        >
          Back to level map
        </button>
        <ReviewButton />
        <button
          onClick={onReset}
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 999,
            padding: '14px 22px',
            cursor: 'pointer',
            background: '#fff',
            color: 'var(--ww-navy)',
            border: '1.5px solid var(--ww-navy)',
          }}
        >
          Reset all
        </button>
      </div>
    </div>
  );
}
