/* ============================================================
   Reusable FASB citation snippets (short paraphrases, not verbatim).
   Grounded in the attached standards:
     • ASU 2016-14         — net asset classification (ASC 958-205-45)
     • ASU 2018-08 / 958-605 — conditional vs unconditional contributions
   Verified against the source PDFs during the content port.
   ============================================================ */
import type { Cite } from './types';

export const CITE = {
  netAssets: {
    code: 'ASU 2016-14 · ASC 958-205-45',
    text: 'NFPs report just two classes of net assets — with donor restrictions and without donor restrictions — replacing the old unrestricted / temporarily / permanently restricted split.',
  },
  restrDef: {
    code: 'Master Glossary · Donor-Imposed Restriction',
    text: 'A restriction is a donor stipulation that limits use more narrowly than the entity’s broad mission — e.g. a specific purpose, or availability only after a specified date.',
  },
  condTest: {
    code: 'ASC 958-605-25-5A',
    text: 'A contribution is conditional only if the agreement contains BOTH (a) a barrier the recipient must overcome and (b) a right of return of assets / right of release of the promisor.',
  },
  barrier: {
    code: 'ASC 958-605-25-5C',
    text: 'Indicators of a barrier include a measurable performance-related barrier (e.g. a service level, output, or matching requirement), a stipulation that limits the recipient’s discretion, and stipulations tied to the purpose of the agreement.',
  },
  refAdv: {
    code: 'ASC 958-605-25-5F (formerly 25-13)',
    text: 'Assets received under a conditional promise are recorded as a refundable advance (a liability) until the conditions are substantially met or explicitly waived.',
  },
  uncondRec: {
    code: 'ASC 958-605-25-1',
    text: 'An unconditional promise to give is recognized as contribution revenue when promised — including the full amount of a multi-year pledge, measured at present value.',
  },
  condRec: {
    code: 'ASC 958-605-25-5F',
    text: 'Revenue from a conditional contribution is recognized only as the barrier(s) are overcome — not when the promise is made and not pro-rata before the barrier is met.',
  },
  milestone: {
    code: 'ASC 958-605-55-70O (Example 19)',
    text: 'A capital grant paid in installments upon meeting building/design milestones, where failure releases the donor from paying, is conditional — each installment is recognized as its milestone barrier is overcome.',
  },
  pv: {
    code: 'ASC 958-605-30-6 · 958-310-35',
    text: 'Unconditional promises collectible beyond one year are measured at the present value of estimated future cash flows; the discount is accreted and reported as additional contribution revenue (not interest income) over the collection period.',
  },
} satisfies Record<string, Cite>;
