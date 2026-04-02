/**
 * Mock response for /v2/Member/Diagnosis
 * Member: Henry Tom Garcia (AH0000007)
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
    diagnosisCode: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    condition: 'Type 2 Diabetes Mellitus',
    category: 'Endocrine / Metabolic',
    level: 'Chronic',
    startDate: '2019-03-01',
    endDate: null,
    isPrimaryDiagnosis: true,
    createdOn: '2019-03-15',
  },
  {
    diagnosisCode: 'I10',
    description: 'Essential (primary) hypertension',
    condition: 'Essential Hypertension',
    category: 'Cardiovascular',
    level: 'Chronic',
    startDate: '2020-06-01',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2020-06-15',
  },
  {
    diagnosisCode: 'E78.5',
    description: 'Hyperlipidemia, unspecified',
    condition: 'Hyperlipidemia',
    category: 'Cardiovascular',
    level: 'Chronic',
    startDate: '2020-06-01',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2020-06-15',
  },
  {
    diagnosisCode: 'J45.30',
    description: 'Mild persistent asthma, uncomplicated',
    condition: 'Mild Persistent Asthma',
    category: 'Respiratory',
    level: 'Chronic',
    startDate: '2015-04-10',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2015-04-10',
  },
  {
    diagnosisCode: 'E66.09',
    description: 'Other obesity due to excess calories',
    condition: 'Obesity',
    category: 'Endocrine / Metabolic',
    level: 'Chronic',
    startDate: '2021-01-20',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2021-01-20',
  },
  {
    diagnosisCode: 'F32.4',
    description: 'Major depressive disorder, single episode, in full remission',
    condition: 'Moderate Depression, in remission',
    category: 'Behavioral Health',
    level: 'Managed',
    startDate: '2022-03-01',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2022-03-15',
  },
  {
    diagnosisCode: 'N18.2',
    description: 'Chronic kidney disease, stage 2 (mild)',
    condition: 'Chronic Kidney Disease, Stage G2',
    category: 'Renal',
    level: 'Monitoring',
    startDate: '2023-08-01',
    endDate: null,
    isPrimaryDiagnosis: false,
    createdOn: '2023-08-01',
  },
]
