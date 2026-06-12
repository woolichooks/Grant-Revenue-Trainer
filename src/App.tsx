import { useState } from 'react';
import { SCENARIOS } from './data/scenarios';
import { CHALLENGE_SCENARIOS } from './data/challenge';
import { useGameState, isComplete } from './state/useGameState';
import { HomeScreen } from './screens/HomeScreen';
import { PlayScreen } from './screens/PlayScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { NameGate } from './components/NameGate';

type Screen = 'home' | 'play' | 'results';
type Mode = 'normal' | 'challenge';

export default function App() {
  const game = useGameState();
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('normal');
  const [level, setLevel] = useState(0);

  const activeScenarios = mode === 'challenge' ? CHALLENGE_SCENARIOS : SCENARIOS;

  function go(next: Screen) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  // Start (or resume) a scenario in the given mode. `replay` clears its saved
  // answers first so it begins fresh.
  function start(i: number, replay: boolean, m: Mode) {
    const list = m === 'challenge' ? CHALLENGE_SCENARIOS : SCENARIOS;
    if (replay) game.clearScenario(list[i].id);
    setMode(m);
    setLevel(i);
    setScreen('play');
    window.scrollTo(0, 0);
  }

  function playLevel(i: number, replay: boolean) {
    start(i, replay, 'normal');
  }

  // Enter challenge mode from the home card: resume at the first incomplete
  // challenge scenario, or restart both if the challenge is already finished.
  function enterChallenge() {
    const allComplete = CHALLENGE_SCENARIOS.every((s) => isComplete(game.results, s.id));
    if (allComplete) {
      CHALLENGE_SCENARIOS.forEach((s) => game.clearScenario(s.id));
      start(0, false, 'challenge');
    } else {
      const idx = CHALLENGE_SCENARIOS.findIndex((s) => !isComplete(game.results, s.id));
      start(idx < 0 ? 0 : idx, false, 'challenge');
    }
  }

  function advance() {
    if (level < activeScenarios.length - 1) {
      start(level + 1, true, mode);
    } else {
      setScreen('results');
      window.scrollTo(0, 0);
    }
  }

  function goHome() {
    setMode('normal');
    setScreen('home');
    window.scrollTo(0, 0);
  }

  function reset() {
    if (window.confirm('Reset all progress?')) {
      game.resetAll();
      goHome();
    }
  }

  const scenario = activeScenarios[level];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ww-navy-050)',
        display: 'flex',
        justifyContent: 'center',
        padding: '28px 16px 56px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 640 }}>
        {!game.player ? (
          <NameGate onSubmit={game.setPlayer} />
        ) : (
        <>
        {screen === 'home' && (
          <HomeScreen
            results={game.results}
            times={game.times}
            player={game.player}
            onChangePlayer={game.setPlayer}
            points={game.points}
            bestStreak={game.bestStreak}
            completedCount={game.completedCount}
            challengeUnlocked={game.challengeUnlocked}
            challengeCompletedCount={game.challengeCompletedCount}
            settings={game.settings}
            setSettings={game.setSettings}
            onPlay={playLevel}
            onEnterChallenge={enterChallenge}
            onResults={() => go('results')}
            onReset={reset}
          />
        )}
        {screen === 'play' && (
          <PlayScreen
            key={scenario.id}
            scenario={scenario}
            settings={game.settings}
            points={game.points}
            savedAnswers={game.results[scenario.id] || {}}
            levelTime={game.times[scenario.id]}
            onAnswer={game.recordAnswer}
            onBestStreak={game.bumpStreak}
            onSessionTime={(ms) => game.addSessionTime(scenario.id, ms)}
            onLevelComplete={(score, activeMs) =>
              game.completeLevel(scenario.id, score, activeMs, {
                levelIndex: scenario.levelIndex ?? null,
                levelLabel: scenario.title,
                challenge: !!scenario.challenge,
              })
            }
            onExit={goHome}
            onAdvance={advance}
            isLast={level === activeScenarios.length - 1}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={game.results}
            points={game.points}
            bestStreak={game.bestStreak}
            completedCount={game.completedCount}
            onHome={goHome}
            onReset={reset}
          />
        )}
        </>
        )}
      </div>
    </div>
  );
}
