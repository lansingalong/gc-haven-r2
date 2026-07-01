/**
 * Mock response for Visits (Claims)
 * Member: Jackson Lee Thomas (AH58319473)
 * ER story: URI triggered blood sugar spike → DKA → ER 05/19/2026 → admitted 2 days
 */

export interface Visit {
  visitType: string
  serviceFrom: string
  serviceTo: string
  lengthOfStay: number | null
  reasonForVisit: string
  providerName: string
  procedureCode: string
  diagnosisCode: string
  payor: string
}

export const mockVisits: Visit[] = [
  {
    visitType: 'Emergency Room',
    serviceFrom: '2026-05-19',
    serviceTo: '2026-05-19',
    lengthOfStay: null,
    reasonForVisit: 'Diabetic ketoacidosis — blood glucose 510 mg/dL, nausea, vomiting; triggered by upper respiratory infection',
    providerName: 'Vanderbilt University Medical Center — Emergency Dept.',
    procedureCode: '99285',
    diagnosisCode: 'E11.10',
    payor: 'Ambetter',
  },
  {
    visitType: 'Inpatient Hospitalization',
    serviceFrom: '2026-05-19',
    serviceTo: '2026-05-21',
    lengthOfStay: 2,
    reasonForVisit: 'DKA management — IV insulin drip, IV fluids, electrolyte correction; transitioned to subcutaneous insulin on day 2',
    providerName: 'Vanderbilt University Medical Center',
    procedureCode: '99232',
    diagnosisCode: 'E11.10',
    payor: 'Ambetter',
  },
  {
    visitType: 'PCP Office Visit',
    serviceFrom: '2026-05-27',
    serviceTo: '2026-05-27',
    lengthOfStay: null,
    reasonForVisit: 'Post-discharge follow-up — insulin regimen review, blood glucose log review, wound check on right foot',
    providerName: 'Dr. Angela Reeves — Cornerstone Family Medicine',
    procedureCode: '99214',
    diagnosisCode: 'E11.65',
    payor: 'Ambetter',
  },
  {
    visitType: 'Specialist Visit',
    serviceFrom: '2026-06-03',
    serviceTo: '2026-06-03',
    lengthOfStay: null,
    reasonForVisit: 'Endocrinology follow-up — A1C 9.8%, insulin titration, CGM initiation discussion',
    providerName: 'Dr. Priya Nair — Nashville Endocrinology Associates',
    procedureCode: '99214',
    diagnosisCode: 'E11.65',
    payor: 'Ambetter',
  },
  {
    visitType: 'Telehealth Visit',
    serviceFrom: '2026-06-10',
    serviceTo: '2026-06-10',
    lengthOfStay: null,
    reasonForVisit: 'Blood pressure recheck and diabetes medication reconciliation following hospitalization',
    providerName: 'Dr. Angela Reeves — Cornerstone Family Medicine',
    procedureCode: '99213',
    diagnosisCode: 'I10',
    payor: 'Ambetter',
  },
]
