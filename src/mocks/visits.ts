/**
 * Mock response for Visits (Claims)
 * Member: Henry Tom Garcia (AH0000007)
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
    visitType: 'PCP Office Visit',
    serviceFrom: '2024-01-18',
    serviceTo: '2024-01-18',
    lengthOfStay: null,
    reasonForVisit: 'Routine chronic disease follow-up (diabetes, hypertension)',
    providerName: 'Dr. Reyes — Ambetter Health',
    procedureCode: '99213',
    diagnosisCode: 'E11.9',
    payor: 'Ambetter',
  },
  {
    visitType: 'Specialist Visit',
    serviceFrom: '2023-11-14',
    serviceTo: '2023-11-14',
    lengthOfStay: null,
    reasonForVisit: 'Endocrinology follow-up — diabetes management',
    providerName: 'Dr. Patel — Inland Endocrinology Associates',
    procedureCode: '99214',
    diagnosisCode: 'E11.9',
    payor: 'Ambetter',
  },
  {
    visitType: 'Emergency Room',
    serviceFrom: '2023-09-05',
    serviceTo: '2023-09-05',
    lengthOfStay: null,
    reasonForVisit: 'Chest tightness — evaluated and resolved, no acute cardiac event',
    providerName: 'Inland Valley Medical Center — Emergency Dept.',
    procedureCode: '99283',
    diagnosisCode: 'R07.9',
    payor: 'Ambetter',
  },
  {
    visitType: 'Inpatient Hospitalization',
    serviceFrom: '2022-07-12',
    serviceTo: '2022-07-15',
    lengthOfStay: 3,
    reasonForVisit: 'Poorly controlled diabetes with hyperglycemia',
    providerName: 'Reston Regional Medical Center',
    procedureCode: '99232',
    diagnosisCode: 'E11.65',
    payor: 'Medicaid',
  },
  {
    visitType: 'PCP Office Visit',
    serviceFrom: '2023-08-10',
    serviceTo: '2023-08-10',
    lengthOfStay: null,
    reasonForVisit: 'Lab review — HbA1c follow-up, medication adjustment',
    providerName: 'Dr. Reyes — Ambetter Health',
    procedureCode: '99213',
    diagnosisCode: 'E11.9',
    payor: 'Ambetter',
  },
  {
    visitType: 'Telehealth Visit',
    serviceFrom: '2024-03-25',
    serviceTo: '2024-03-25',
    lengthOfStay: null,
    reasonForVisit: 'Blood pressure recheck — upcoming scheduled visit',
    providerName: 'Dr. Reyes — Ambetter Health',
    procedureCode: '99213',
    diagnosisCode: 'I10',
    payor: 'Ambetter',
  },
]
