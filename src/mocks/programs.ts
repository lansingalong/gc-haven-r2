/**
 * Mock response for Programs (HealthEdge programs API)
 * Member: Jackson Lee Thomas (AH58319473)
 */

export interface ProgramActivity {
  activityType: string
  scriptName: string
  dueDate: string
  outcomeType: string
  contactType: string
  status: string
}

export interface Program {
  program: string
  startDate: string
  endDate: string | null
  status: string
  statusDescription: string
  referralSource: string
  eligibility: string
  createdBy: string
  createdOn: string
  updatedBy: string
  updatedOn: string
  requiredActivities: ProgramActivity[]
}

export const mockPrograms: Program[] = [
  {
    program: 'Recent ER Visit on 05/19/2026',
    startDate: '2026-05-22',
    endDate: null,
    status: 'Active',
    statusDescription: 'Member enrolled and actively engaged post-discharge',
    referralSource: 'Dr. Angela Reeves',
    eligibility: 'Ambetter Health (AMB) >> Tennessee (TN) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: 'maria.santos',
    createdOn: '2026-05-22',
    updatedBy: 'maria.santos',
    updatedOn: '2026-06-10',
    requiredActivities: [
      {
        activityType: 'Outreach',
        scriptName: 'Post-Discharge Follow-Up Call',
        dueDate: '2026-05-26',
        outcomeType: 'Completed',
        contactType: 'Phone',
        status: 'Completed',
      },
      {
        activityType: 'Assessment',
        scriptName: 'Diabetes Self-Management Assessment',
        dueDate: '2026-06-20',
        outcomeType: 'Pending',
        contactType: 'Phone',
        status: 'Pending',
      },
    ],
  },
  {
    program: 'Chronic Disease Management — Diabetes',
    startDate: '2022-01-10',
    endDate: null,
    status: 'Active',
    statusDescription: 'Enrolled in Type 2 Diabetes and hypertension management track',
    referralSource: 'PCP Referral',
    eligibility: 'Ambetter Health (AMB) >> Tennessee (TN) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: 'maria.santos',
    createdOn: '2022-01-10',
    updatedBy: 'maria.santos',
    updatedOn: '2026-06-10',
    requiredActivities: [
      {
        activityType: 'Assessment',
        scriptName: 'Annual Chronic Care Assessment',
        dueDate: '2026-03-01',
        outcomeType: 'Completed',
        contactType: 'Phone',
        status: 'Completed',
      },
      {
        activityType: 'Education',
        scriptName: 'Diabetes Self-Management Education Referral',
        dueDate: '2026-07-01',
        outcomeType: 'Pending',
        contactType: 'In Person',
        status: 'Pending',
      },
    ],
  },
  {
    program: 'Diabetes Prevention Program (DPP)',
    startDate: '',
    endDate: null,
    status: 'Eligible – Not Enrolled',
    statusDescription: 'Member meets criteria (BMI ≥30, A1C 9.8%)',
    referralSource: '',
    eligibility: 'Ambetter Health (AMB) >> Tennessee (TN) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    requiredActivities: [],
  },
]
