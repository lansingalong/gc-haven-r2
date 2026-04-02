/**
 * Mock data for Gaps In Care
 * Loaded via batch interface (not a direct API call) — source: CarePlans → Guiding Opportunities → Source DD = External quality measures
 * Member: Henry Tom Garcia (AH0000007)
 */

export interface GapInCare {
  opportunity: string
  opportunityStatus: string
  measureCode: string
  measureCategory: string
  ncqaGrouping: string
  measureDescription: string
  identifiedDate: string
  updatedOn: string
  updatedBy: string
}

export const mockGapsInCare: GapInCare[] = [
  {
    opportunity: 'Annual Wellness Visit',
    opportunityStatus: 'Open',
    measureCode: 'AWV',
    measureCategory: 'Preventive Care',
    ncqaGrouping: 'Preventive Screening',
    measureDescription: 'Member has not completed an Annual Wellness Visit in the current measurement year. Last completed March 2023.',
    identifiedDate: '2024-01-01',
    updatedOn: '2024-01-01',
    updatedBy: 'batch.interface',
  },
  {
    opportunity: 'Diabetic Eye Exam (Retinal Screening)',
    opportunityStatus: 'Open',
    measureCode: 'EED',
    measureCategory: 'Diabetes Management',
    ncqaGrouping: 'HEDIS — Diabetes',
    measureDescription: 'No retinal or dilated eye exam on record. Required annually for members with Type 2 Diabetes.',
    identifiedDate: '2024-01-01',
    updatedOn: '2024-01-01',
    updatedBy: 'batch.interface',
  },
  {
    opportunity: 'Depression Screening (PHQ-9)',
    opportunityStatus: 'Open',
    measureCode: 'DSF',
    measureCategory: 'Behavioral Health',
    ncqaGrouping: 'HEDIS — Behavioral Health',
    measureDescription: 'PHQ-9 last completed November 2022. Annual re-screening is due.',
    identifiedDate: '2024-01-01',
    updatedOn: '2024-01-01',
    updatedBy: 'batch.interface',
  },
  {
    opportunity: 'HbA1c Testing',
    opportunityStatus: 'Closed',
    measureCode: 'HBA1C',
    measureCategory: 'Diabetes Management',
    ncqaGrouping: 'HEDIS — Diabetes',
    measureDescription: 'HbA1c tested 02/01/2024. Result: 7.8% — above goal but measure fulfilled for current period.',
    identifiedDate: '2024-01-01',
    updatedOn: '2024-02-01',
    updatedBy: 'prudhvi.rajan',
  },
  {
    opportunity: 'Kidney Health Evaluation',
    opportunityStatus: 'Open',
    measureCode: 'KED',
    measureCategory: 'Diabetes Management',
    ncqaGrouping: 'HEDIS — Diabetes',
    measureDescription: 'Annual urine albumin-to-creatinine ratio (uACR) test not yet completed for current measurement year.',
    identifiedDate: '2024-01-01',
    updatedOn: '2024-01-01',
    updatedBy: 'batch.interface',
  },
  {
    opportunity: 'Statin Therapy for Cardiovascular Disease',
    opportunityStatus: 'Closed',
    measureCode: 'SPC',
    measureCategory: 'Cardiovascular',
    ncqaGrouping: 'HEDIS — Cardiovascular',
    measureDescription: 'Member is currently prescribed Atorvastatin 20mg. Measure fulfilled.',
    identifiedDate: '2023-01-01',
    updatedOn: '2024-02-14',
    updatedBy: 'prudhvi.rajan',
  },
]
