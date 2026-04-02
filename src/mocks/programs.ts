/**
 * Mock response for Programs (HealthEdge programs API)
 * Member: Henry Tom Garcia (AH0000007)
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
    program: 'Care Coordination',
    startDate: '2024-03-01',
    endDate: null,
    status: 'Active',
    statusDescription: 'Member enrolled and actively engaged',
    referralSource: 'Care Manager',
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: 'prudhvi.rajan',
    createdOn: '2024-03-01',
    updatedBy: 'prudhvi.rajan',
    updatedOn: '2024-03-10',
    requiredActivities: [
      {
        activityType: 'Assessment',
        scriptName: 'Health Risk Assessment (HRA)',
        dueDate: '2024-05-01',
        outcomeType: 'Completed',
        contactType: 'Phone',
        status: 'Completed',
      },
      {
        activityType: 'Outreach',
        scriptName: 'Monthly Care Coordination Check-In',
        dueDate: '2024-04-01',
        outcomeType: 'Pending',
        contactType: 'Phone',
        status: 'Pending',
      },
    ],
  },
  {
    program: 'Chronic Disease Management',
    startDate: '2024-01-15',
    endDate: null,
    status: 'Active',
    statusDescription: 'Enrolled in diabetes and hypertension track',
    referralSource: 'PCP Referral',
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: 'prudhvi.rajan',
    createdOn: '2024-01-15',
    updatedBy: 'prudhvi.rajan',
    updatedOn: '2024-02-14',
    requiredActivities: [
      {
        activityType: 'Assessment',
        scriptName: 'Adult LTSS Reassessment',
        dueDate: '2024-04-15',
        outcomeType: 'Completed',
        contactType: 'In Person',
        status: 'Completed',
      },
      {
        activityType: 'Education',
        scriptName: 'Diabetes Self-Management Education Referral',
        dueDate: '2024-05-15',
        outcomeType: 'Pending',
        contactType: 'In Person',
        status: 'Pending',
      },
    ],
  },
  {
    program: 'Diabetes Self-Management Education (DSME)',
    startDate: '',
    endDate: null,
    status: 'Eligible – Not Enrolled',
    statusDescription: 'Member meets criteria but has not enrolled',
    referralSource: '',
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    requiredActivities: [],
  },
  {
    program: 'Diabetes Prevention Program (DPP)',
    startDate: '',
    endDate: null,
    status: 'Eligible – Not Enrolled',
    statusDescription: 'Member meets criteria (BMI ≥25, prediabetes risk)',
    referralSource: '',
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    requiredActivities: [],
  },
  {
    program: 'Behavioral Health Integration',
    startDate: '',
    endDate: null,
    status: 'Eligible – Not Enrolled',
    statusDescription: 'Eligible based on depression diagnosis (F32.4)',
    referralSource: '',
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    requiredActivities: [],
  },
]
