/* Integration check: PlayScreen mounted with saved answers must render the
   first UNANSWERED question, proving click-away/return resumes mid-level. */
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PlayScreen } from './PlayScreen';
import { SCENARIOS } from '../data/scenarios';
import type { AnswerRecord, TopicKey } from '../data/types';

const noop = () => {};
const a: AnswerRecord = { given: 'x', correct: true };

function render(saved: Partial<Record<TopicKey, AnswerRecord>>) {
  return renderToString(
    <PlayScreen
      scenario={SCENARIOS[0]}
      settings={{ pvMode: false, pvRate: 5 }}
      points={0}
      savedAnswers={saved}
      onAnswer={noop}
      onBestStreak={noop}
      onExit={noop}
      onAdvance={noop}
      isLast={false}
    />,
  );
}

describe('PlayScreen resume', () => {
  it('shows question 1 when nothing is saved', () => {
    const html = render({});
    expect(html).toContain('Net asset classification'); // determination #1 prompt
    expect(html).toContain('Restriction status'); // topic eyebrow for Q1
  });

  it('resumes at the first unanswered question (4) when the first three are saved', () => {
    const html = render({ restricted: a, conditional: a, type: a });
    expect(html).toContain('What is the grant period?'); // determination #4 prompt
    expect(html).toContain('Streak: 3'); // streak rebuilt from the answered prefix
    // the answered ones are not re-presented as the active question
    expect(html).not.toContain('Net asset classification — is this revenue restricted?');
  });

  it('lands on the level-complete summary when all seven are saved', () => {
    const all = Object.fromEntries(
      ['restricted', 'conditional', 'type', 'period', 'total', 'recognized', 'refundable'].map((k) => [k, a]),
    ) as Partial<Record<TopicKey, AnswerRecord>>;
    const html = render(all);
    expect(html).toContain('complete!');
  });
});
