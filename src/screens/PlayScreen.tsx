import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Trophy, X } from 'lucide-react';
import type { AnswerRecord, Scenario, Settings, TopicKey } from '../data/types';
import { buildQuestions, isCorrect } from '../engine/engine';
import { FYE_NOTE } from '../data/topics';
import { Pill } from '../components/Pill';
import { Flames } from '../components/Flames';
import { Feedback } from '../components/Feedback';
import { ExcerptBlocks } from '../components/ExcerptBlocks';
import { MoneyInput } from '../components/MoneyInput';
import { playCorrect, playWrong, playLevelComplete, setSoundEnabled } from '../audio/sounds';
import { resumeFrom } from '../state/resume';

interface PlayScreenProps {
  scenario: Scenario;
  settings: Settings;
  points: number;
  /** Answers already saved for this scenario — used to resume mid-level. */
  savedAnswers: Partial<Record<TopicKey, AnswerRecord>>;
  onAnswer: (sid: string, topic: TopicKey, val: AnswerRecord) => void;
  onBestStreak: (n: number) => void;
  onExit: () => void;
  onAdvance: () => void;
  isLast: boolean;
}

export function PlayScreen({
  scenario,
  settings,
  points,
  savedAnswers,
  onAnswer,
  onBestStreak,
  onExit,
  onAdvance,
  isLast,
}: PlayScreenProps) {
  const questions = useMemo(
    () => buildQuestions(scenario, settings),
    [scenario.id, settings.pvMode, settings.pvRate],
  );
  const pvActive = !!(settings.pvMode && scenario.pvEligible && scenario.pvSchedule);
  const isChallenge = !!scenario.challenge;
  const docBlocks = pvActive
    ? [
        ...scenario.excerpt,
        {
          policy: `For revenue recognition, discount this unconditional multi-year promise to present value at ${settings.pvRate}% per year. The first installment is received now (undiscounted); each later installment is discounted by the number of years until it is collected.`,
        },
      ]
    : scenario.excerpt;

  // Resume from whatever was already saved for this scenario, so clicking
  // away and coming back drops the learner at the first unanswered question
  // instead of restarting. (Lazy initializers run once at mount; PlayScreen
  // is keyed by scenario id, so it re-mounts and re-resumes per level.)
  const resume = resumeFrom(questions, savedAnswers);
  const [qIdx, setQIdx] = useState(() => resume.qIdx);
  const [given, setGiven] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [streak, setStreak] = useState(() => resume.streak);
  const [showDoc, setShowDoc] = useState(true);
  const [perTopic, setPerTopic] = useState<Partial<Record<TopicKey, AnswerRecord>>>(() => ({
    ...savedAnswers,
  }));

  const atSummary = qIdx >= questions.length;
  const q = questions[qIdx];

  // Keep the audio engine's mute state in sync with the persisted setting.
  useEffect(() => {
    setSoundEnabled(settings.sound);
  }, [settings.sound]);

  function grade(val: string | null) {
    if (submitted || val === null || val === '') return;
    const correct = isCorrect(q, val);
    setGiven(val);
    setLastCorrect(correct);
    setSubmitted(true);
    setPerTopic((p) => ({ ...p, [q.topic]: { given: val, correct } }));
    onAnswer(scenario.id, q.topic, { given: val, correct });
    if (correct) {
      const ns = streak + 1;
      setStreak(ns);
      onBestStreak(ns);
      playCorrect();
    } else {
      setStreak(0);
      playWrong();
    }
  }

  function next() {
    if (qIdx + 1 >= questions.length) playLevelComplete();
    setQIdx((i) => i + 1);
    setGiven(null);
    setSubmitted(false);
  }

  const caseRight = Object.values(perTopic).filter((x) => x?.correct).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button
            onClick={onExit}
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
          <div style={{ textAlign: 'center', minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--ww-blue)',
              }}
            >
              {isChallenge ? `Challenge · ${scenario.level}` : `Level ${scenario.levelIndex} · ${scenario.level}`}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isChallenge && (
              <Pill bg="var(--ww-yellow-100)" color="var(--ww-yellow-700)">
                2× pts
              </Pill>
            )}
            {pvActive && (
              <Pill bg="var(--ww-blue-100)" color="var(--ww-blue-700)">
                PV @ {settings.pvRate}%
              </Pill>
            )}
            <Flames streak={streak} />
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: 'var(--ww-navy-700)',
              }}
            >
              {points}
              <span style={{ fontSize: 11, color: 'var(--ww-navy-300)', fontWeight: 600 }}> pts</span>
            </span>
          </div>
        </div>
        {/* progress */}
        <div style={{ display: 'flex', gap: 5 }}>
          {questions.map((qq, i) => {
            const r = perTopic[qq.topic];
            const bg = r
              ? r.correct
                ? 'var(--ww-success)'
                : 'var(--ww-error)'
              : i === qIdx && !atSummary
                ? 'var(--ww-blue)'
                : 'var(--ww-navy-100)';
            return <div key={qq.topic} style={{ flex: 1, height: 6, borderRadius: 999, background: bg, transition: 'all 200ms' }} />;
          })}
        </div>
      </div>

      {/* Agreement */}
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          border: '1px solid var(--ww-border)',
          boxShadow: 'var(--ww-shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setShowDoc((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'none',
            border: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
            <FileText size={18} color="var(--ww-blue)" />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  color: 'var(--ww-navy-700)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {scenario.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ww-navy-500)' }}>{scenario.funder}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Pill bg="var(--ww-blue-100)" color="var(--ww-blue-700)">
              {scenario.tag}
            </Pill>
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: 'var(--ww-navy-300)',
              }}
            >
              {showDoc ? '▴' : '▾'}
            </span>
          </div>
        </button>
        {showDoc && (
          <div style={{ padding: '4px 18px 18px', borderTop: '1px solid var(--ww-border)' }}>
            <div style={{ paddingTop: 14 }}>
              <ExcerptBlocks blocks={docBlocks} />
            </div>
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px dashed var(--ww-navy-100)',
                fontSize: 12,
                color: 'var(--ww-navy-500)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--ww-navy)' }}>Status:</strong> {scenario.received}
              <br />
              <strong style={{ color: 'var(--ww-navy)' }}>{scenario.fyeNote || FYE_NOTE}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Question / summary */}
      {!atSummary ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid var(--ww-border)',
            boxShadow: 'var(--ww-shadow-md)',
            padding: '22px 22px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ww-blue)',
              }}
            >
              {q.topicLabel}
            </span>
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: 'var(--ww-navy-300)',
              }}
            >
              {qIdx + 1}/{questions.length}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: 'var(--ww-navy-700)',
              lineHeight: 1.22,
              margin: '0 0 18px',
            }}
          >
            {q.prompt}
          </h3>

          {q.kind === 'mc' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {q.options.map((opt) => {
                const sel = given === opt;
                let bd = 'var(--ww-navy-100)';
                let bg = '#fff';
                let col = 'var(--ww-navy)';
                if (submitted) {
                  if (opt === q.answer) {
                    bd = 'var(--ww-success)';
                    bg = 'rgba(26,135,84,0.08)';
                    col = 'var(--ww-success)';
                  } else if (sel) {
                    bd = 'var(--ww-error)';
                    bg = 'rgba(217,45,32,0.06)';
                    col = 'var(--ww-error)';
                  }
                }
                return (
                  <button
                    key={opt}
                    disabled={submitted}
                    onClick={() => grade(opt)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: `2px solid ${bd}`,
                      background: bg,
                      cursor: submitted ? 'default' : 'pointer',
                      fontFamily: "'Open Sans',sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: col,
                      transition: 'all 150ms',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <span>{opt}</span>
                    {submitted && opt === q.answer && <Check size={19} strokeWidth={3} color="var(--ww-success)" />}
                    {submitted && sel && opt !== q.answer && <X size={19} strokeWidth={3} color="var(--ww-error)" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <MoneyInput
                value={given || ''}
                onChange={setGiven}
                onEnter={() => given && grade(given)}
                disabled={submitted}
                big
                autoFocus
              />
              {!submitted && (
                <button
                  onClick={() => given && grade(given)}
                  disabled={!given}
                  style={{
                    marginTop: 12,
                    width: '100%',
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    border: 0,
                    borderRadius: 14,
                    padding: '14px',
                    cursor: given ? 'pointer' : 'not-allowed',
                    background: given ? 'var(--ww-blue)' : 'var(--ww-navy-100)',
                    color: given ? '#fff' : 'var(--ww-navy-300)',
                  }}
                >
                  Lock it in
                </button>
              )}
            </div>
          )}

          {submitted && (
            <div style={{ marginTop: 16, animation: 'gtRise 250ms cubic-bezier(0.4,0,0.2,1)' }}>
              <Feedback correct={lastCorrect} q={q} compact />
              <button
                onClick={next}
                style={{
                  marginTop: 14,
                  width: '100%',
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  border: 0,
                  borderRadius: 14,
                  padding: '15px',
                  cursor: 'pointer',
                  background: 'var(--ww-navy)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {qIdx === questions.length - 1 ? 'Finish level' : 'Next determination'}{' '}
                <ArrowRight size={16} strokeWidth={2.6} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--ww-blue)',
            borderRadius: 22,
            boxShadow: 'var(--ww-shadow-blue)',
            padding: '30px 26px',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Trophy size={44} color="var(--ww-yellow)" style={{ margin: '0 auto' }} />
          <div style={{ fontFamily: "'Pacifico',cursive", fontSize: 28, margin: '8px 0 2px' }}>
            {isChallenge ? 'Challenge complete!' : `Level ${scenario.levelIndex} complete!`}
          </div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 46, lineHeight: 1 }}>
            {caseRight}
            <span style={{ fontSize: 22, opacity: 0.7 }}>/7</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4, marginBottom: 20 }}>{scenario.title}</div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24 }}
          >
            {questions.map((qq) => {
              const r = perTopic[qq.topic];
              return (
                <span
                  key={qq.topic}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    padding: '6px 11px',
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {r?.correct ? (
                    <Check size={12} strokeWidth={3} color="var(--ww-yellow)" />
                  ) : (
                    <X size={12} strokeWidth={3} color="#fff" />
                  )}
                  {qq.topicShort}
                </span>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onAdvance}
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                border: 0,
                borderRadius: 999,
                padding: '13px 26px',
                cursor: 'pointer',
                background: 'var(--ww-yellow)',
                color: 'var(--ww-navy)',
              }}
            >
              {isLast ? 'See results →' : isChallenge ? 'Next challenge →' : 'Next level →'}
            </button>
            <button
              onClick={onExit}
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 999,
                padding: '13px 22px',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.14)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
            >
              Back to map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
