/* ============================================================
   Determination topic metadata, dated period options, prompts,
   and per-topic input kinds. Org fiscal year ends June 30.
   ============================================================ */
import type { Topic, TopicKey, QuestionKindMeta } from './types';

// Option sets reused across questions
export const OPT_RESTRICT = ['Without donor restrictions', 'With donor restrictions'];
export const OPT_COND = ['Unconditional', 'Conditional'];
export const OPT_TYPE = ['None (unrestricted)', 'Expense', 'Time', 'Program', 'Department', 'Project'];
export const OPT_YESNO = ['No', 'Yes'];

// Dated grant-period options (org fiscal year ends June 30)
export const PERIOD = {
  fy26: 'FY2026 only (Jul 1, 2025 – Jun 30, 2026)',
  fy26_27: 'FY2026 – FY2027 (Jul 1, 2025 – Jun 30, 2027)',
  fy26_28: 'FY2026 – FY2028 (Jul 1, 2025 – Jun 30, 2028)',
  none: 'No fixed period (milestone-based)',
  na: 'Not Applicable',
} as const;
export const PERIOD_OPTIONS = [PERIOD.fy26, PERIOD.fy26_27, PERIOD.fy26_28, PERIOD.none, PERIOD.na];

export const FYE_NOTE =
  'Your organization’s fiscal year ends June 30. The current fiscal year is FY2026 — July 1, 2025 through June 30, 2026.';
export const CURRENT_FY = { label: 'FY2026', range: 'Jul 1, 2025 – Jun 30, 2026' };

// Determination topics (drives per-topic accuracy + labels), in fixed order.
export const TOPICS: Topic[] = [
  { key: 'restricted', label: 'Restriction status', short: 'Restricted?' },
  { key: 'conditional', label: 'Condition', short: 'Conditional?' },
  { key: 'type', label: 'Restriction type', short: 'Type' },
  { key: 'period', label: 'Grant period', short: 'Period' },
  { key: 'total', label: 'Total award', short: 'Total' },
  { key: 'recognized', label: 'Current-year revenue', short: 'FY2026 rev.' },
  { key: 'refundable', label: 'Refundable advance', short: 'Ref. advance' },
];

export const QUESTION_PROMPTS: Record<TopicKey, string> = {
  restricted: 'Net asset classification — is this revenue restricted?',
  conditional: 'Is this contribution conditional or unconditional?',
  type: 'What type of restriction applies?',
  period: 'What is the grant period?',
  total: 'What is the total award amount?',
  recognized: 'How much is recognized as revenue in FY2026 (Jul 1, 2025 – Jun 30, 2026)?',
  refundable: 'Is any portion a refundable advance?',
};

export const QUESTION_KIND: Record<TopicKey, QuestionKindMeta> = {
  restricted: { kind: 'mc', options: OPT_RESTRICT },
  conditional: { kind: 'mc', options: OPT_COND },
  type: { kind: 'mc', options: OPT_TYPE },
  period: { kind: 'mc' }, // options live on the determination
  total: { kind: 'num', prefix: '$' },
  recognized: { kind: 'num', prefix: '$' },
  refundable: { kind: 'mc', options: OPT_YESNO },
};
