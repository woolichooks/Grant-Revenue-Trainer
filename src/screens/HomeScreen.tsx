import { Check, Lock, Swords, Trophy, Volume2, VolumeX } from 'lucide-react';
import type { Results, Settings } from '../data/types';
import { SCENARIOS } from '../data/scenarios';
import { CHALLENGE_SCENARIOS } from '../data/challenge';
import { isComplete, scoreOf } from '../state/useGameState';
import { FYChip } from '../components/FYChip';
import { Toggle } from '../components/Toggle';
import { ReviewButton } from '../components/ReviewButton';

interface HomeScreenProps {
  results: Results;
  points: number;
  bestStreak: number;
  completedCount: number;
  challengeUnlocked: boolean;
  challengeCompletedCount: number;
  settings: Settings;
  setSettings: (fn: (s: Settings) => Settings) => void;
  onPlay: (level: number, replay: boolean) => void;
  onEnterChallenge: () => void;
  onResults: () => void;
  onReset: () => void;
}

function ChallengeCard({
  results,
  unlocked,
  completedCount,
  onEnter,
}: {
  results: Results;
  unlocked: boolean;
  completedCount: number;
  onEnter: () => void;
}) {
  const total = CHALLENGE_SCENARIOS.length;
  const started = CHALLENGE_SCENARIOS.some((s) => results[s.id]);

  if (!unlocked) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 18px',
          borderRadius: 16,
          background: 'var(--ww-navy-050)',
          border: '1px dashed var(--ww-navy-100)',
          opacity: 0.85,
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--ww-navy-100)',
          }}
        >
          <Lock size={18} color="var(--ww-navy-300)" />
        </span>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 800,
              fontSize: 15.5,
              color: 'var(--ww-navy-500)',
            }}
          >
            Challenge Mode
          </div>
          <div style={{ fontFamily: "'Open Sans',sans-serif", fontSize: 12.5, color: 'var(--ww-navy-300)', lineHeight: 1.5 }}>
            Complete all {SCENARIOS.length} levels to unlock two real-world grant agreements — worth 2× points.
          </div>
        </div>
      </div>
    );
  }

  const done = completedCount === total;
  return (
    <button
      onClick={onEnter}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        padding: '16px 18px',
        borderRadius: 16,
        background: 'var(--ww-blue)',
        border: 0,
        boxShadow: 'var(--ww-shadow-blue)',
        color: '#fff',
      }}
    >
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--ww-yellow)',
        }}
      >
        <Swords size={20} color="var(--ww-navy)" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ww-yellow)',
            }}
          >
            Challenge Mode
          </span>
          <span
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 10.5,
              padding: '2px 7px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
            }}
          >
            2× POINTS
          </span>
        </div>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15.5, marginTop: 2 }}>
          Two real grant agreements
        </div>
        <div style={{ fontFamily: "'Open Sans',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.82)', marginTop: 1 }}>
          Dense, real-world legalese — read carefully.
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15 }}>
          {completedCount}/{total}
        </div>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11.5, color: 'var(--ww-yellow)' }}>
          {done ? 'Replay' : started ? 'Resume →' : 'Start →'}
        </div>
      </div>
    </button>
  );
}

function SettingsCard({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: (fn: (s: Settings) => Settings) => void;
}) {
  const soundOn = settings.sound !== false;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--ww-border)', borderRadius: 16, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 14.5,
              color: 'var(--ww-navy-700)',
            }}
          >
            Present-value discounting
          </div>
          <div
            style={{
              fontFamily: "'Open Sans',sans-serif",
              fontSize: 12.5,
              color: 'var(--ww-navy-500)',
              lineHeight: 1.5,
              marginTop: 2,
            }}
          >
            Discount <strong>unconditional</strong> multi-year pledges (Level 3) to present value. The gross promise
            stays the award; revenue is the discounted figure.
          </div>
        </div>
        <Toggle on={settings.pvMode} onChange={(v) => setSettings((s) => ({ ...s, pvMode: v }))} />
      </div>
      {settings.pvMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--ww-border)',
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 600,
              fontSize: 12.5,
              color: 'var(--ww-navy-500)',
            }}
          >
            Discount rate
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {([3, 5, 7] as const).map((r) => {
              const active = settings.pvRate === r;
              return (
                <button
                  key={r}
                  onClick={() => setSettings((s) => ({ ...s, pvRate: r }))}
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '7px 16px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    border: active ? '1.5px solid var(--ww-blue)' : '1.5px solid var(--ww-navy-100)',
                    background: active ? 'var(--ww-blue)' : '#fff',
                    color: active ? '#fff' : 'var(--ww-navy)',
                    transition: 'all 150ms',
                  }}
                >
                  {r}%
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sound effects */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px solid var(--ww-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {soundOn ? (
            <Volume2 size={18} color="var(--ww-blue)" />
          ) : (
            <VolumeX size={18} color="var(--ww-navy-300)" />
          )}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 14.5,
                color: 'var(--ww-navy-700)',
              }}
            >
              Sound effects
            </div>
            <div
              style={{
                fontFamily: "'Open Sans',sans-serif",
                fontSize: 12.5,
                color: 'var(--ww-navy-500)',
                lineHeight: 1.5,
                marginTop: 2,
              }}
            >
              Play short cues on correct / incorrect answers and level completion.
            </div>
          </div>
        </div>
        <Toggle on={soundOn} onChange={(v) => setSettings((s) => ({ ...s, sound: v }))} />
      </div>
    </div>
  );
}

export function HomeScreen({
  results,
  points,
  bestStreak,
  completedCount,
  challengeUnlocked,
  challengeCompletedCount,
  settings,
  setSettings,
  onPlay,
  onEnterChallenge,
  onResults,
  onReset,
}: HomeScreenProps) {
  const scenarios = SCENARIOS;
  const anyProgress = completedCount > 0 || scenarios.some((s) => results[s.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <a
          href="https://www.newsletter.woolichooks.com/t/labs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Woolichooks Labs (opens in a new tab)"
          title="Woolichooks Labs"
          style={{ display: 'inline-block', marginBottom: 14 }}
        >
          <img
            src="assets/woolichooks-monogram.png"
            alt="Woolichooks"
            style={{ width: 56, height: 56, borderRadius: 14, display: 'block' }}
          />
        </a>
        <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 30, color: 'var(--ww-blue)', lineHeight: 1 }}>
          Grant Trainer
        </div>
        <h1
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 27,
            color: 'var(--ww-navy-700)',
            margin: '8px 0 8px',
            letterSpacing: '-0.02em',
          }}
        >
          Nonprofit Revenue Recognition
        </h1>
        <p
          style={{
            fontFamily: "'Open Sans',sans-serif",
            fontSize: 14.5,
            color: 'var(--ww-navy-500)',
            maxWidth: 460,
            margin: '0 auto 16px',
            lineHeight: 1.55,
          }}
        >
          Read a real grant agreement and make the seven calls that drive revenue recognition under ASC 958-605 and ASU
          2016-14.
        </p>
        <FYChip />
      </div>

      {/* Stats */}
      {anyProgress && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {(
            [
              ['Levels done', `${completedCount}/${scenarios.length}`],
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
                padding: '14px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  color: 'var(--ww-navy-700)',
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ww-navy-300)',
                }}
              >
                {k}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      <SettingsCard settings={settings} setSettings={setSettings} />

      {/* Levels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {scenarios.map((s, i) => {
          const done = isComplete(results, s.id);
          const unlocked = i === 0 || isComplete(results, scenarios[i - 1].id);
          const sc = scoreOf(results, s.id);
          return (
            <button
              key={s.id}
              disabled={!unlocked}
              onClick={() => unlocked && onPlay(i, done)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                textAlign: 'left',
                width: '100%',
                padding: '15px 16px',
                borderRadius: 16,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                background: unlocked ? '#fff' : 'var(--ww-navy-050)',
                opacity: unlocked ? 1 : 0.6,
                border: done ? '1.5px solid rgba(26,135,84,0.4)' : '1px solid var(--ww-border)',
                boxShadow: unlocked ? 'var(--ww-shadow-sm)' : 'none',
                transition: 'all 150ms',
                fontFamily: "'Open Sans',sans-serif",
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: done ? 'var(--ww-success)' : unlocked ? 'var(--ww-blue)' : 'var(--ww-navy-100)',
                  color: '#fff',
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                {!unlocked ? (
                  <Lock size={18} color="var(--ww-navy-300)" />
                ) : done ? (
                  <Check size={22} strokeWidth={3} />
                ) : (
                  s.levelIndex
                )}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: unlocked ? 'var(--ww-blue)' : 'var(--ww-navy-300)',
                    }}
                  >
                    Level {s.levelIndex}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ww-navy-300)', fontStyle: 'italic' }}>· {s.level}</span>
                </div>
                <div
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 700,
                    fontSize: 15.5,
                    color: 'var(--ww-navy-700)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.title}
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                {done ? (
                  <div
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 800,
                      fontSize: 15,
                      color: sc === 7 ? 'var(--ww-success)' : 'var(--ww-navy)',
                    }}
                  >
                    {sc}/7
                  </div>
                ) : unlocked ? (
                  <span
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--ww-blue)',
                    }}
                  >
                    Play →
                  </span>
                ) : null}
                {done && (
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--ww-navy-300)',
                      fontFamily: "'Montserrat',sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Replay
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Challenge mode */}
      <ChallengeCard
        results={results}
        unlocked={challengeUnlocked}
        completedCount={challengeCompletedCount}
        onEnter={onEnterChallenge}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onResults}
            disabled={!anyProgress}
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 999,
            padding: '12px 22px',
            cursor: anyProgress ? 'pointer' : 'not-allowed',
            background: anyProgress ? 'var(--ww-navy)' : 'var(--ww-navy-100)',
            color: anyProgress ? '#fff' : 'var(--ww-navy-300)',
            border: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Trophy size={15} /> Results dashboard
          </button>
          <ReviewButton style={{ fontSize: 14, padding: '12px 18px' }} />
        </div>
        {anyProgress && (
          <button
            onClick={onReset}
            style={{
              fontFamily: "'Open Sans',sans-serif",
              fontSize: 12.5,
              color: 'var(--ww-navy-300)',
              background: 'none',
              border: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Reset progress
          </button>
        )}
      </div>
    </div>
  );
}
