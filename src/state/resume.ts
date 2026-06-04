/* ============================================================
   Resume helper — given a scenario's built questions and the
   answers already saved for it, work out where to drop the
   learner back in: the first unanswered question, and the
   in-run streak rebuilt from the answered prefix.
   ============================================================ */
import type { AnswerRecord, Question, TopicKey } from '../data/types';

export interface ResumePosition {
  /** Index of the first unanswered question; questions.length if all answered. */
  qIdx: number;
  /** Streak rebuilt by walking the answered prefix (resets to 0 on a wrong answer). */
  streak: number;
}

export function resumeFrom(
  questions: Question[],
  saved: Partial<Record<TopicKey, AnswerRecord>>,
): ResumePosition {
  const firstUnanswered = questions.findIndex((q) => !saved[q.topic]);
  const qIdx = firstUnanswered === -1 ? questions.length : firstUnanswered;

  let streak = 0;
  for (const q of questions) {
    const r = saved[q.topic];
    if (!r) break; // stop at the first gap — only the contiguous answered prefix counts
    streak = r.correct ? streak + 1 : 0;
  }
  return { qIdx, streak };
}
