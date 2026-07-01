/**
 * Mock response for /v2/Member/Diagnosis
 * Member: Jackson Lee Thomas (AH58319473)
 */

export interface Diagnosis {
  diagnosisCode: string
  description: string
  condition: string
  category: string
  level: string
  startDate: string
  endDate: string | null
  isPrimaryDiagnosis: boolean
  createdOn: string
}

export const mockDiagnosis: Diagnosis[] = [
  {
    diagnosisCode: 'E11.65',
    description: 'Type 2 diabetes mellitus with hyperglycemia',
    condition: 'Type 2 Diabetes Mellitus with Hyperglycemia',
    category: 'Endocrine / Metabolic',
    level: 'Chronic',
    startDate: '2014-08-12',
    endDate: null,
    isPrimaryDiagnosis: true,
    createdOn: '2014-08-12',
  },
  {
    diagnosisCode: 'I10',
    description: 'Essential (primary) hypertension',
    condition: 'Essential Hypertension',
    category: 'Cardiovascular',
    level: 'Chronic',
    startDate: '2016-03-05',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2016-03-05',
  },
  {
    diagnosisCode: 'E78.5',
    description: 'Hyperlipidemia, unspecified',
    condition: 'Hyperlipidemia',
    category: 'Cardiovascular',
    level: 'Chronic',
    startDate: '2016-03-05',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2016-03-05',
  },
  {
    diagnosisCode: 'E11.22',
    description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease, stage 2',
    condition: 'Diabetic Nephropathy, Stage G2',
    category: 'Renal',
    level: 'Monitoring',
    startDate: '2022-11-14',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2022-11-14',
  },
  {
    diagnosisCode: 'E11.40',
    description: 'Type 2 diabetes mellitus with diabetic neuropathy, unspecified',
    condition: 'Diabetic Peripheral Neuropathy',
    category: 'Neurological',
    level: 'Chronic',
    startDate: '2023-05-20',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2023-05-20',
  },
  {
    diagnosisCode: 'J06.9',
    description: 'Acute upper respiratory infection, unspecified',
    condition: 'Acute Upper Respiratory Infection',
    category: 'Respiratory',
    level: 'Acute',
    startDate: '2026-05-15',
    endDate: '2026-05-28',
    isPrimaryDiagnosis: false,
    createdOn: '2026-05-15',
  },
]
