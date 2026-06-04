/* Render checks for challenge-mode UI: the play screen shows the challenge
   chrome + dense excerpt, and the home card reflects locked/unlocked state. */
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PlayScreen } from './PlayScreen';
import { HomeScreen } from './HomeScreen';
import { ResultsScreen } from './ResultsScreen';
import { CHALLENGE_SCENARIOS } from '../data/challenge';
import type { Results, Settings } from '../data/types';

const noop = () => {};
const settings: Settings = { pvMode: false, pvRate: 5, sound: true };

describe('challenge PlayScreen chrome', () => {
  const html = renderToString(
    <PlayScreen
      scenario={CHALLENGE_SCENARIOS[0]}
      settings={settings}
      points={120}
      savedAnswers={{}}
      onAnswer={noop}
      onBestStreak={noop}
      onExit={noop}
      onAdvance={noop}
      isLast={false}
    />,
  );

  it('shows the challenge eyebrow, 2× pill, and the scenario fiscal note', () => {
    expect(html).toContain('Challenge ·');
    expect(html).toContain('2× pts');
    expect(html).toContain('calendar-year basis');
  });

  it('renders the dense multi-clause agreement excerpt', () => {
    expect((html.match(/§/g) || []).length).toBeGreaterThanOrEqual(5);
    expect(html).toContain('sole discretion');
  });
});

describe('HomeScreen challenge card', () => {
  it('shows a locked teaser before all levels are done', () => {
    const html = renderToString(
      <HomeScreen
        results={{}}
        points={0}
        bestStreak={0}
        completedCount={2}
        challengeUnlocked={false}
        challengeCompletedCount={0}
        settings={settings}
        setSettings={noop}
        onPlay={noop}
        onEnterChallenge={noop}
        onResults={noop}
        onReset={noop}
      />,
    );
    expect(html).toContain('to unlock two real-world grant agreements');
  });

  it('shows the unlocked challenge card with 2× points and a start CTA', () => {
    const html = renderToString(
      <HomeScreen
        results={{}}
        points={0}
        bestStreak={0}
        completedCount={6}
        challengeUnlocked={true}
        challengeCompletedCount={0}
        settings={settings}
        setSettings={noop}
        onPlay={noop}
        onEnterChallenge={noop}
        onResults={noop}
        onReset={noop}
      />,
    );
    expect(html).toContain('Challenge Mode');
    expect(html).toContain('2× POINTS');
    expect(html).toContain('Start →');
  });

  it('offers a "Review this game" button (modal closed by default)', () => {
    const html = renderToString(
      <HomeScreen
        results={{}}
        points={0}
        bestStreak={0}
        completedCount={0}
        challengeUnlocked={false}
        challengeCompletedCount={0}
        settings={settings}
        setSettings={noop}
        onPlay={noop}
        onEnterChallenge={noop}
        onResults={noop}
        onReset={noop}
      />,
    );
    expect(html).toContain('Review this game');
    expect(html).not.toContain('tally.so/embed');
  });
});

describe('ResultsScreen challenge breakdown', () => {
  const renderResults = (results: Results, completedCount: number) =>
    renderToString(
      <ResultsScreen
        results={results}
        points={0}
        bestStreak={0}
        completedCount={completedCount}
        onHome={noop}
        onReset={noop}
      />,
    );

  it('hides the challenge section before it is unlocked or attempted', () => {
    const html = renderResults({ s1: { restricted: { given: 'x', correct: true } } }, 1);
    expect(html).not.toContain('2× POINTS');
  });

  it('always offers a "Review this game" button (modal closed by default)', () => {
    const html = renderResults({ s1: { restricted: { given: 'x', correct: true } } }, 1);
    expect(html).toContain('Review this game');
    // modal is closed initially, so the embedded form is not rendered yet
    expect(html).not.toContain('tally.so/embed');
  });

  it('shows challenge scenarios and scores once attempted', () => {
    const results: Results = {
      c1: {
        restricted: { given: 'x', correct: true },
        conditional: { given: 'x', correct: true },
        type: { given: 'x', correct: true },
        period: { given: 'x', correct: true },
        total: { given: 'x', correct: true },
        recognized: { given: 'x', correct: true },
        refundable: { given: 'x', correct: true },
      },
    };
    const html = renderResults(results, 6);
    expect(html).toContain('Challenge mode');
    expect(html).toContain('2× POINTS');
    expect(html).toContain('Calloway Family Foundation Grant');
    expect(html).toContain('Whitmore Foundation Core-Support Grant');
    expect(html).toContain('7/7'); // c1 fully correct
    expect(html).toContain('—'); // c2 not attempted
  });
});
