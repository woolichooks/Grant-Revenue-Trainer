/* ============================================================
   Grant Revenue Recognition Trainer — content
   6 grant scenarios, ramping in difficulty, each tested across
   7 determinations. Org fiscal year ends June 30.

   Accounting grounded in the attached FASB standards:
     • ASU 2016-14  (net asset classification)
     • ASU 2018-08 / ASC 958-605 (conditional vs unconditional)

   NOTE: Scenario `id`s are persistence keys — keep them stable.
   Display order is driven by `levelIndex`, not array position
   (the Project scenario `s6` is level 5; `s5` is level 6).
   ============================================================ */
import type { Scenario } from './types';
import { CITE } from './citations';
import { PERIOD, PERIOD_OPTIONS } from './topics';

export const SCENARIOS: Scenario[] = [
  /* ---------------------------------------------------------- 1 */
  {
    id: 's1',
    level: 'Warm-up',
    levelIndex: 1,
    title: 'Unrestricted Operating Gift',
    funder: 'Margaret Ellison (individual donor)',
    instrument: 'Gift acknowledgment letter',
    tag: 'Gift',
    received: 'Check received and deposited September 12, 2025 (FY2026)',
    excerpt: [
      {
        meta: [
          ['Donor', 'Margaret Ellison'],
          ['Date', 'September 12, 2025'],
          ['Amount', '$25,000'],
        ],
      },
      {
        p: 'Dear Friends, Please accept the enclosed gift of $25,000 in support of your wonderful work. I have admired this organization for years and trust your team to put these funds wherever the need is greatest.',
      },
      {
        p: 'There are no conditions attached to this gift, and I do not require any reports. Keep up the great work!',
      },
      { sig: 'With warm regards, Margaret Ellison' },
    ],
    determinations: {
      restricted: {
        answer: 'Without donor restrictions',
        explain:
          'The donor explicitly directs the gift to "wherever the need is greatest" — that is no narrower than the organization’s broad mission, so it is not a donor-imposed restriction. Record as revenue without donor restrictions.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Unconditional',
        explain:
          'There is no barrier to overcome and no right of return. With neither element present, the gift is unconditional and is recognized immediately.',
        cites: [CITE.condTest],
      },
      type: {
        answer: 'None (unrestricted)',
        explain:
          '"Wherever the need is greatest" imposes no purpose, time, or other limit, so there is no restriction type to assign.',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.na,
        options: PERIOD_OPTIONS,
        explain:
          'The gift carries no purpose, time, or other restriction, so there is no grant period to track — the determination is Not Applicable. (The revenue is still recognized in full in FY2026 when received; that is the current-year revenue determination, a separate question.)',
        cites: [],
      },
      total: { answer: 25000, explain: 'A single $25,000 gift. The full amount is the award.', cites: [] },
      recognized: {
        answer: 25000,
        explain:
          'Unconditional and unrestricted — the entire $25,000 is recognized as contribution revenue in FY2026 when received.',
        cites: [CITE.uncondRec],
      },
      refundable: {
        answer: 'No',
        explain:
          'A refundable advance only arises when cash is received under an unmet condition. There is no condition here, so nothing is a refundable advance.',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- 2 */
  {
    id: 's2',
    level: 'Foundations',
    levelIndex: 2,
    title: 'Youth Literacy Program Grant',
    funder: 'Riverside Community Trust',
    instrument: 'Grant award letter',
    tag: 'Grant',
    received: 'Full $40,000 wired October 3, 2025 (FY2026)',
    excerpt: [
      {
        meta: [
          ['Grantor', 'Riverside Community Trust'],
          ['Award', '$40,000'],
          ['Date', 'October 3, 2025'],
        ],
      },
      {
        p: 'The Trust is pleased to award your organization $40,000. These funds are to be used solely to support your Youth Literacy Program.',
      },
      {
        p: 'We ask for a brief narrative summary at year-end describing the program’s activities. This report is for our records and does not affect the award. No portion of the grant is refundable.',
      },
      { sig: 'Riverside Community Trust · Grants Office' },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'The grant must be used "solely" for the Youth Literacy Program — a purpose narrower than the org’s overall mission. That is a donor-imposed restriction, so record as revenue with donor restrictions (released as the program funds are spent).',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Unconditional',
        explain:
          'A narrative summary "for our records" is not a measurable barrier, and the funds are explicitly non-refundable (no right of return). Without both a barrier and a right of return, the grant is unconditional — a purpose restriction is not a condition.',
        cites: [CITE.condTest, CITE.barrier],
      },
      type: {
        answer: 'Program',
        explain:
          'The funds are tied to a specific program (Youth Literacy) — not to particular expense line items, a department, a discrete project, or a time period. That maps to a Program restriction.',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.fy26,
        options: PERIOD_OPTIONS,
        explain:
          'The award letter sets no multi-year schedule; it is a single-year program grant recognized in FY2026 (Jul 1, 2025 – Jun 30, 2026).',
        cites: [],
      },
      total: { answer: 40000, explain: 'A single $40,000 award.', cites: [] },
      recognized: {
        answer: 40000,
        explain:
          'Unconditional contributions are recognized in full when received, even if restricted. The entire $40,000 is FY2026 revenue (with donor restrictions); the restriction releases as the program spends the money.',
        cites: [CITE.uncondRec],
      },
      refundable: {
        answer: 'No',
        explain:
          'No condition exists and the grant is explicitly non-refundable, so none of it is a refundable advance.',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- 3 */
  {
    id: 's3',
    level: 'The multi-year trap',
    levelIndex: 3,
    title: '3-Year General Operating Pledge',
    funder: 'Hartwell Family Foundation',
    instrument: 'Signed pledge agreement',
    tag: 'Pledge',
    pvEligible: true,
    pvSchedule: [30000, 30000, 30000],
    received: '$30,000 received July 2025 (FY2026); two installments remain unpaid',
    excerpt: [
      {
        meta: [
          ['Foundation', 'Hartwell Family Foundation'],
          ['Total pledge', '$90,000'],
          ['Schedule', '$30,000 / year · FY2026, FY2027, FY2028'],
        ],
      },
      {
        p: 'The Foundation hereby unconditionally pledges $90,000 in unrestricted general operating support, payable in three equal annual installments of $30,000 beginning in your fiscal year 2026 (which starts July 1, 2025).',
      },
      {
        p: 'This pledge is irrevocable and carries no performance requirements, reporting milestones, or right of return. The Foundation will remit each installment at the start of the applicable fiscal year.',
      },
      { sig: 'Hartwell Family Foundation · Board of Trustees' },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'Even though the support is "unrestricted" as to purpose, the installments due in FY2027 and FY2028 are not available until those future years. That implied time restriction makes the pledge a contribution with donor restrictions.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Unconditional',
        explain:
          'The pledge is explicitly irrevocable with no performance barrier and no right of return — so it is unconditional, and is recognized now even though most of the cash arrives later.',
        cites: [CITE.condTest],
      },
      type: {
        answer: 'Time',
        explain:
          'The only thing limiting use is timing — funds for later years aren’t available until those years. Purpose is unrestricted, so the restriction type is Time, not Program/Department/Project/Expense.',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.fy26_28,
        options: PERIOD_OPTIONS,
        explain:
          'The installments span FY2026 through FY2028 — a three-year promise (Jul 1, 2025 – Jun 30, 2028).',
        cites: [],
      },
      total: { answer: 90000, explain: '$30,000 per year × 3 years = $90,000 total pledged.', cites: [] },
      recognized: {
        answer: 90000,
        explain:
          'The trap: because the promise is unconditional, the FULL $90,000 is recognized as FY2026 revenue — not just the $30,000 collected this year. The future installments sit in net assets with donor restrictions and release over time. (Turn on present-value discounting in settings to recognize the discounted amount instead.)',
        cites: [CITE.uncondRec],
      },
      refundable: {
        answer: 'No',
        explain:
          'Nothing is conditional, so no refundable advance. (The uncollected installments are a pledge receivable, not a liability.)',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- 4 */
  {
    id: 's4',
    level: 'Cost reimbursement',
    levelIndex: 4,
    title: 'Immunization Outreach Grant',
    funder: 'State Department of Public Health',
    instrument: 'Cost-reimbursement government contract',
    tag: 'Gov. grant',
    received: '$120,000 advanced; $110,000 of allowable costs incurred by Jun 30, 2026',
    excerpt: [
      {
        meta: [
          ['Agency', 'State Dept. of Public Health'],
          ['Award ceiling', 'Up to $150,000'],
          ['Period', 'July 1, 2025 – June 30, 2026'],
        ],
      },
      {
        p: 'The State will reimburse the Subrecipient for actual, allowable costs incurred in delivering immunization outreach, up to a maximum of $150,000. Funds are advanced quarterly based on a projected budget.',
      },
      {
        clause: '§ 7.2',
        text: 'The Subrecipient is entitled to retain funds only to the extent of allowable costs properly incurred and documented. Any advanced funds not expended on allowable costs, or later disallowed on audit, must be returned to the State.',
      },
      {
        note: 'By fiscal year-end (June 30, 2026) the organization had incurred $110,000 of allowable costs and had received $120,000 in quarterly advances.',
      },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'Funds may only be spent on the specified immunization-outreach costs — a purpose restriction. (In practice the restriction is met in the same period the cost is incurred, so many NFPs show a simultaneous release; the underlying classification is still with donor restrictions.)',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Conditional',
        explain:
          'Both elements are present: a measurable barrier (entitlement only to the extent of allowable costs incurred) AND a right of return (unspent or disallowed funds must be returned). That makes it a conditional contribution.',
        cites: [CITE.condTest, CITE.barrier],
      },
      type: {
        answer: 'Expense',
        explain:
          'Entitlement is tied to specific allowable cost categories reimbursed dollar-for-dollar — an Expense (cost-reimbursement) restriction, distinct from a broad Program or a discrete Project.',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.fy26,
        options: PERIOD_OPTIONS,
        explain: 'The contract period is July 1, 2025 – June 30, 2026 — exactly FY2026.',
        cites: [],
      },
      total: {
        answer: 150000,
        explain: 'The award ceiling is $150,000. Note this is a maximum, not a promise — entitlement depends on costs incurred.',
        cites: [],
      },
      recognized: {
        answer: 110000,
        explain:
          'Conditional revenue is recognized only as the barrier is overcome. The barrier here is incurring allowable costs, so revenue equals the $110,000 of allowable costs incurred — not the $120,000 advanced and not the $150,000 ceiling.',
        cites: [CITE.condRec],
      },
      refundable: {
        answer: 'Yes',
        explain:
          'Yes — $10,000. The org received $120,000 but earned only $110,000, so the unspent $10,000 advance is a refundable advance (a liability) until it is spent on allowable costs or returned.',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- 5  (PROJECT) */
  {
    id: 's6',
    level: 'Capital project',
    levelIndex: 5,
    title: 'New Education Wing Capital Grant',
    funder: 'The Lindgren Foundation',
    instrument: 'Capital project grant agreement',
    tag: 'Capital',
    received: 'First $200,000 milestone payment received April 2026; no further milestones met',
    excerpt: [
      {
        meta: [
          ['Foundation', 'The Lindgren Foundation'],
          ['Total award', '$600,000'],
          ['Use', 'Construction of the new Education Wing'],
        ],
      },
      {
        p: 'The Foundation commits $600,000 toward the construction of your new Education Wing, restricted exclusively to that project. The award is paid in installments tied to construction milestones.',
      },
      {
        clause: '§ 3.1',
        text: 'The first installment of $200,000 will be released only upon the Foundation’s approval of architectural drawings that satisfy the specified LEED green-building requirements. Subsequent installments are released as later construction milestones are certified.',
      },
      {
        clause: '§ 8.4',
        text: 'If a milestone is not achieved, the Foundation is released from any obligation to pay the related installment.',
      },
      {
        note: 'By June 30, 2026 the organization had submitted approved drawings and received the first $200,000 installment. No further milestones had been met. There is no fixed end date — payments follow construction milestones.',
      },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'The award is restricted "exclusively" to the Education Wing project — a purpose far narrower than the org’s mission. Record amounts recognized as revenue with donor restrictions.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Conditional',
        explain:
          'Each installment has a measurable barrier (approved drawings meeting LEED requirements / certified milestones) and a right of release (the Foundation is released if a milestone isn’t met). Both elements present → conditional. This mirrors the FASB museum-wing example.',
        cites: [CITE.condTest, CITE.milestone],
      },
      type: {
        answer: 'Project',
        explain:
          'Funds are confined to a discrete, one-time capital build — the Education Wing. That is a Project restriction. Contrast with Department (a standing organizational unit) or Program (an ongoing service line).',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.none,
        options: PERIOD_OPTIONS,
        explain:
          'There is no fiscal-year term. Entitlement is driven by construction milestones, not a calendar — so the grant has no fixed period.',
        cites: [],
      },
      total: { answer: 600000, explain: 'The Foundation commits $600,000 in total toward the project.', cites: [] },
      recognized: {
        answer: 200000,
        explain:
          'Only the first milestone’s barrier was overcome (approved LEED drawings), releasing $200,000. The remaining $400,000 stays conditional until its milestones are certified, so FY2026 revenue is $200,000.',
        cites: [CITE.condRec, CITE.milestone],
      },
      refundable: {
        answer: 'No',
        explain:
          'The $200,000 arrived only after its milestone barrier was already cleared, so it was earned on receipt — not a refundable advance. (Cash received before clearing a milestone would be.)',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- 6  (MULTI-ELEMENT / DEPARTMENT) */
  {
    id: 's5',
    level: 'Multi-element',
    levelIndex: 6,
    title: 'STEM Department Multi-Year Grant',
    funder: 'Galloway Foundation',
    instrument: 'Multi-year program grant agreement',
    tag: 'Grant',
    received: 'Year-1 $150,000 advanced July 2025; 520 students served by Jun 30, 2026',
    excerpt: [
      {
        meta: [
          ['Foundation', 'Galloway Foundation'],
          ['Total award', '$300,000 ($150,000 / year)'],
          ['Term', 'FY2026 – FY2027 (Jul 1, 2025 – Jun 30, 2027)'],
        ],
      },
      {
        p: 'The Foundation awards $300,000 over two years to support the organization’s STEM Education Department and its after-school robotics initiative.',
      },
      {
        clause: '§ 4.1',
        text: 'Each annual installment of $150,000 is earned only if the STEM Education Department serves at least 500 students during that fiscal year. Progress reports are due quarterly.',
      },
      {
        clause: '§ 9.3',
        text: 'Funds not used in accordance with this agreement, or any installment for which the 500-student threshold is not met, must be returned to the Foundation.',
      },
      {
        note: 'The Foundation advanced the Year-1 $150,000 at the start of FY2026 (July 2025). By June 30, 2026 the department had served 520 students. Year-2 funds have not been advanced.',
      },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'Use is confined to the STEM Education Department’s robotics work — narrower than the org’s mission. Once a barrier is overcome the recognized revenue is classified with donor restrictions and released as the purpose is fulfilled.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Conditional',
        explain:
          'A measurable performance barrier (serve ≥ 500 students per year) plus a right of return (unmet installments must be returned) = a conditional contribution. Each year’s installment is evaluated on its own.',
        cites: [CITE.condTest, CITE.barrier],
      },
      type: {
        answer: 'Department',
        explain:
          'The funds are bound to a specific organizational unit — the STEM Education Department. That is a Department restriction. (If the agreement had named a discrete, time-boxed initiative rather than the standing department, Project would fit better — a useful contrast.)',
        cites: [CITE.restrDef],
      },
      period: {
        answer: PERIOD.fy26_27,
        options: PERIOD_OPTIONS,
        explain: 'The grant term is two fiscal years: FY2026 and FY2027 (Jul 1, 2025 – Jun 30, 2027).',
        cites: [],
      },
      total: { answer: 300000, explain: '$150,000 per year × 2 years = $300,000 total award.', cites: [] },
      recognized: {
        answer: 150000,
        explain:
          'Year-1’s barrier is met (520 ≥ 500), so the $150,000 Year-1 installment is recognized as FY2026 revenue. Year-2’s $150,000 is still conditional (that barrier hasn’t been tested yet) and is NOT recognized — so $150,000, not $300,000.',
        cites: [CITE.condRec],
      },
      refundable: {
        answer: 'No',
        explain:
          'The $150,000 advance WAS a refundable advance during the year — but once the 500-student barrier was overcome by year-end, the condition was met and it flips from liability to revenue. No refundable advance remains at June 30, 2026.',
        cites: [CITE.refAdv],
      },
    },
  },
];
