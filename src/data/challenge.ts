/* ============================================================
   Challenge Mode — two real-world grant agreements.
   Unlocked after Level 6. Worth 2× points.

   These are deliberately HARDER than the tutorial levels: the
   excerpts are long, dense, and full of boilerplate, so the
   determinative facts must be dug out of realistic legalese.

   The pedagogical pairing:
     • Calloway  — CONDITIONAL: discretionary, report-gated future
       installments + a right of return. Recognize only the first
       installment whose sole barrier (signing) is met.
     • Whitmore  — UNCONDITIONAL (the trap): a right of return of
       unexpended funds but NO barrier, so the full multi-year
       promise is recognized now.

   Grounded in ASC 958-605 / ASU 2018-08 and ASU 2016-14. ids are
   persistence keys — keep them stable.
   ============================================================ */
import type { Scenario } from './types';
import { CITE } from './citations';

// Dated period options are scenario-specific here (the grantees use
// different fiscal years from the tutorial org), so they live inline.
const CALLOWAY_PERIODS = [
  '2026 only (Jan 1 – Dec 31, 2026)',
  '2026 – 2028 (3 years)',
  '2026 – 2030 (5 years)',
  'No fixed period (discretionary renewals)',
];
const WHITMORE_PERIODS = [
  'FY2027 only (Jul 1, 2026 – Jun 30, 2027)',
  'FY2027 – FY2028 (Jul 1, 2026 – Jun 30, 2028)',
  'FY2027 – FY2029 (Jul 1, 2026 – Jun 30, 2029)',
  'No fixed period (milestone-based)',
];

export const CHALLENGE_SCENARIOS: Scenario[] = [
  /* ---------------------------------------------------------- C1 */
  {
    id: 'c1',
    level: 'Discretionary multi-year',
    levelIndex: 1,
    challenge: true,
    title: 'Calloway Family Foundation Grant',
    funder: 'The Calloway Family Foundation',
    instrument: 'Multi-year grant agreement',
    tag: 'Challenge',
    received:
      'Agreement signed; first $1,200,000 installment received April 2026. No interim reports yet approved; no further installments paid.',
    fyeNote:
      'Open Districts Education Fund reports on a calendar-year basis. This grant’s first reporting year is the year ended December 31, 2026.',
    excerpt: [
      {
        meta: [
          ['Foundation', 'The Calloway Family Foundation'],
          ['Grantee', 'Open Districts Education Fund'],
          ['Grant ID', 'CFF-2026-00514'],
          ['Amount', '$3,000,000'],
          ['Grant term', 'January 1, 2026 – December 31, 2030'],
        ],
      },
      {
        p: 'Dear Mr. Aronsohn: The Trustees of The Calloway Family Foundation have approved a $3,000,000 grant to Open Districts Education Fund. The grant is to be used to strengthen the organization’s earned-revenue capacity, long-term organizational resilience, and the depth of educational coverage available to the communities it serves. Grant payment according to the terms outlined will be released within sixty (60) days of the Foundation receiving the signed agreement. As the Relationship Manager, Marcus Bell is your primary point of contact; all reports should be uploaded to our grantee portal.',
      },
      {
        clause: '§ Working Towards Outcomes',
        text: 'To achieve the Goal, the Grantee plans to: diversify its philanthropic base (issue-specific, place-based, and education-focused funding); build a shared sponsorship and underwriting program across its websites, newsletters, and local partners to increase earned revenue; and establish a small expansion team to add regional bureaus and subject-area desks as opportunities arise.',
      },
      {
        clause: '§ Outcomes & Metrics',
        text: 'Desired outcomes and tracked metrics include: growing major-gift donors ($5K–$100K) to 80 and major-gift revenue from $300K to $1.2M annually by 2030; growing sponsorship/underwriting revenue from $600K to $1.8M; growing engaged newsletter readers from 18,000 to 90,000; growing distribution and content partners from 60 to 160; building an unrestricted operating reserve from $250K to $3.0M; and growing regional bureaus from 8 to 18 — all by 2030. The Grantee agrees that the results described are achievable and represent the terms against which it will judge the success of the project.',
      },
      {
        clause: '§ Minimum Reporting & Interactions',
        text: 'Please note that the first payment is pending receipt of the executed Grant Agreement. All other payments are subject, at a minimum, to the Foundation’s receipt and approval, in its sole discretion, of interim narrative and financial reports and other satisfactory interactions. All payments will be released within sixty (60) days of the Foundation’s approval, in its sole discretion, of the relevant reports and interactions.',
      },
      {
        clause: '§ Payment Schedule',
        text: 'Signed Agreement (Mar 1, 2026): $1,200,000. Then, against interim narrative + financial reports — Feb 28, 2027: $600,000; Feb 28, 2028: $500,000; Feb 28, 2029: $400,000; Feb 28, 2030: $300,000. Final narrative + financial reports due Feb 15, 2031: no payment.',
      },
      {
        clause: '§ Basic Grant Conditions',
        text: 'The Grantee will use the funds for the purpose(s) described in this Agreement. If the funds are not used in accordance with the terms outlined here, the Grantee must repay those funds to the Foundation. Significant budget changes must be approved in writing in advance; overhead must be specified in the budget and may not be charged as a general percentage of costs. As required by IRS rules, Foundation funds will not be used to influence legislation or elections, to make grants to individuals except as permitted under § 4945(d), or for any purpose other than those exempt under § 501(c)(3).',
      },
      {
        clause: '§ Termination',
        text: 'The Foundation, at its sole option, may terminate this Agreement, withhold or restructure payments, or both, at any time if, in its judgment, it is not satisfied with the quality of the Grantee’s progress, it believes the project has ceased to be an appropriate means of accomplishing the Goal, or the Grantee materially fails to comply with the terms, including by failing to submit reports when due. Within sixty (60) days after written request, the Grantee shall remit all unexpended Grant funds as of the effective date of termination.',
      },
      {
        clause: '§ Books & Records',
        text: 'The Grantee shall maintain a general ledger with sufficient detail to track the use of Foundation funds, retain records for at least four years after the funds are fully used, and make its books and records available for the Foundation’s financial audits or other evaluations of this Grant.',
      },
      {
        note: 'By December 31, 2026 the agreement had been signed and the first $1,200,000 installment had been received. No interim reports had yet been submitted or approved, and no further installments had been paid. The four remaining installments ($600K, $500K, $400K, $300K) each depend on the Foundation’s discretionary approval in future years.',
      },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'With donor restrictions. The funds must be used for the specific capacity-building activities described, and the award is paid over a five-year term — a purpose limit plus a time element, both narrower than the org’s general operations. Recognized amounts are classified with donor restrictions.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Conditional',
        explain:
          'Conditional. Both elements of the test are present: a right of return (funds not used in accordance with the terms must be repaid; on termination, unexpended funds are remitted) AND a barrier — every installment after the first is released only upon the Foundation’s receipt and sole-discretion approval of interim reports, so the recipient is not entitled to those funds until that barrier is overcome. (The long list of outcome metrics is aspirational, not itself the barrier.)',
        cites: [CITE.condTest, CITE.barrier],
      },
      type: {
        answer: 'Program',
        explain:
          'Program. Use is confined to the described program-capacity activities — narrower than the org’s general mission, but not tied to specific allowable expense line items, a single department, or a discrete capital project. A multi-year time element is layered on top, but the primary restriction is purpose.',
        cites: [CITE.restrDef],
      },
      period: {
        answer: '2026 – 2030 (5 years)',
        options: CALLOWAY_PERIODS,
        explain:
          'The award covers a five-year term, January 1, 2026 through December 31, 2030 (the grantee reports on a calendar-year basis).',
        cites: [],
      },
      total: {
        answer: 3000000,
        explain: '$3,000,000 is the total committed award across the five-year schedule.',
        cites: [],
      },
      recognized: {
        answer: 1200000,
        prompt: 'How much is recognized as contribution revenue in the first reporting year (calendar 2026)?',
        explain:
          'Conditional revenue is recognized only as barriers are overcome. The first $1,200,000 installment’s sole barrier — signing the agreement — was met, so $1,200,000 is recognized. The remaining $1,800,000 of future installments stays conditional (each depends on the Foundation’s discretionary approval of future reports) and is NOT recognized in year one.',
        cites: [CITE.condRec],
      },
      refundable: {
        answer: 'No',
        explain:
          'No. The $1,200,000 was received only after its barrier (signing the agreement) was already met, so it was earned on receipt. (Cash received before a barrier is overcome would be a refundable advance — not the case here.)',
        cites: [CITE.refAdv],
      },
    },
  },

  /* ---------------------------------------------------------- C2 */
  {
    id: 'c2',
    level: 'The core-support trap',
    levelIndex: 2,
    challenge: true,
    title: 'Whitmore Foundation Core-Support Grant',
    funder: 'The Whitmore Foundation',
    instrument: 'Core-support grant agreement',
    tag: 'Challenge',
    received:
      'Countersigned; first $700,000 received July 1, 2026. Second $500,000 installment scheduled for September 1, 2027.',
    fyeNote:
      'Riverlands Public Media’s fiscal year ends June 30. This grant’s first reporting year is FY2027 — July 1, 2026 through June 30, 2027.',
    excerpt: [
      {
        meta: [
          ['Foundation', 'The Whitmore Foundation for an Informed Society'],
          ['Grantee', 'Riverlands Public Media, Inc.'],
          ['Grant #', 'W-CS-26-04127'],
          ['Amount', '$1,200,000.00'],
          ['Duration', 'July 1, 2026 – June 30, 2028'],
        ],
      },
      {
        p: 'Dear Ms. Castellano: At its meeting of June 15, 2026, the board of directors of The Whitmore Foundation for an Informed Society approved a grant in the sum of $1,200,000.00 to Riverlands Public Media, Inc. This letter, together with all attachments, constitutes the Grant Agreement. By signing, you confirm that there has been no change to your organization’s tax-exempt status.',
      },
      {
        clause: '§ Grant Purpose',
        text: 'For core support of the Grantee Organization’s regional environmental and public-affairs reporting initiative (the “Project”). Grant reference document: the final proposal submitted April 30, 2026. Responsible Foundation Officer: Priya Anand.',
      },
      {
        clause: '§ Payment Schedule',
        text: 'Payments will be made according to the following schedule upon receipt of the countersigned Grant Agreement: $700,000.00 on 07/01/2026; $500,000.00 on 09/01/2027.',
      },
      {
        clause: '§ Payment Conditions',
        text: 'Grant payments will be delayed if (1) the Grantee Organization fails to submit satisfactory and timely reports on this grant or on any other Foundation grant, or (2) submitted reports indicate a substantial unexpended balance of grant funds on hand.',
      },
      {
        clause: '§ Reporting Schedule',
        text: 'Interim Report due 08/01/2027; Final Report due 09/30/2028. Please submit all reporting requirements through the grantee portal under the requirements section.',
      },
      {
        clause: '§ Use of Funds',
        text: 'The grant, together with any income earned from the investment of grant funds, (i) will be used only for the Project, which involves exclusively charitable, scientific, literary, or educational activities described in Code § 170(c)(2)(B); (ii) will be expended substantially in accordance with the budget submitted to the Foundation; and (iii) will not be expended for any other purpose without the Foundation’s prior written approval.',
      },
      {
        clause: '§ Unexpended Funds',
        text: 'The Grantee Organization agrees to return to the Foundation any unexpended funds remaining at the end of the grant period.',
      },
      {
        clause: '§ Safekeeping & Interest',
        text: 'Grant funds must be held in a risk-free account, such as a checking or savings account, preferably interest-bearing, and may not be commingled with endowment or investment funds without the Foundation’s prior written approval. Any interest earned on grant funds should be applied to the Project and reported in the grant’s final financial report.',
      },
      {
        clause: '§ Grant Cancellation',
        text: 'The Foundation reserves the right to cancel this grant if there is a change in tax-exempt status, or if it determines, in its sole discretion, that the Grantee has breached the Agreement, performed unsatisfactorily, or spent funds on activities other than the Project without prior consent. On cancellation the Grantee must (1) return any unexpended funds, (2) provide an accounting of expended funds, and (3) repay any funds spent on activities other than the Project that were not approved.',
      },
      {
        clause: '§ Representations; Artificial Intelligence',
        text: 'The Grantee represents and warrants that qualified human personnel will review all AI-generated content before publication or submission, that any AI use will comply with applicable platform terms, that it will disclose in writing any substantial AI assistance in Project results or reporting, and that it will not submit confidential information to any third-party AI service.',
      },
      {
        note: 'There are no performance milestones, output targets, service levels, or matching requirements anywhere in the agreement. By June 30, 2027 (the Grantee’s fiscal year-end) the first $700,000 had been received; the $500,000 second installment was scheduled for September 1, 2027.',
      },
    ],
    determinations: {
      restricted: {
        answer: 'With donor restrictions',
        explain:
          'With donor restrictions. The grant is for the specific reporting Project and runs two years — a purpose limit (and a time element) narrower than the org’s general operations. Recognized revenue is classified with donor restrictions.',
        cites: [CITE.netAssets, CITE.restrDef],
      },
      conditional: {
        answer: 'Unconditional',
        explain:
          'Unconditional — the trap. There is a right of return (unexpended funds are returned at the end of the grant period), but there is NO barrier: using funds for their stated purpose, filing routine reports, and a payment-timing protection (delays for a large unexpended balance) are not measurable performance barriers or limits on the recipient’s discretion. The test requires BOTH a barrier and a right of return; with only one element present, the grant is unconditional.',
        cites: [CITE.condTest, CITE.barrier],
      },
      type: {
        answer: 'Program',
        explain:
          'Program. Core support of a specific, ongoing reporting initiative is a purpose (program) restriction. It is not a discrete, one-time capital build, so “Project” is the distractor here despite the agreement’s repeated use of the word “Project.”',
        cites: [CITE.restrDef],
      },
      period: {
        answer: 'FY2027 – FY2028 (Jul 1, 2026 – Jun 30, 2028)',
        options: WHITMORE_PERIODS,
        explain:
          'The grant term is two fiscal years, July 1, 2026 through June 30, 2028 — the grantee’s FY2027 and FY2028.',
        cites: [],
      },
      total: {
        answer: 1200000,
        explain: '$1,200,000 is the total promised ($700,000 + $500,000).',
        cites: [],
      },
      recognized: {
        answer: 1200000,
        prompt:
          'How much is recognized as contribution revenue in the first fiscal year (FY2027 — Jul 1, 2026 – Jun 30, 2027)?',
        explain:
          'Because the promise is unconditional, the FULL $1,200,000 is recognized as contribution revenue in the first year — not just the $700,000 received. The uncollected $500,000 is a pledge receivable; the future-year portion sits in net assets with donor restrictions and releases over time. (If material, the multi-year promise is measured at present value.)',
        cites: [CITE.uncondRec, CITE.pv],
      },
      refundable: {
        answer: 'No',
        explain:
          'No. An unconditional grant’s receipts are earned revenue, not a refundable advance, and the uncollected installment is a pledge receivable rather than a liability. The “return unexpended funds” clause does not create a refundable advance without a barrier.',
        cites: [CITE.refAdv],
      },
    },
  },
];
