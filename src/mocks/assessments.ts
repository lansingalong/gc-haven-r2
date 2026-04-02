/**
 * Mock responses for:
 *   /v2/ActivitySummary/Script?clientPatientID=AH0000007
 *   /v2/Assessment/Submission/{submissionId}
 * Member: Henry Tom Garcia (AH0000007)
 */

export interface ScriptSummary {
  submissionId: string
  assessmentName: string
  assessmentStatus: string
  assessmentCompletedDateTime: string
  performedOn: string
  performedBy: string
  programName: string
  eligibilityPath: string
  assessmentScore: number
  careActivityType: string
  activityOutcome: string
  contactType: string
  actualDuration: number
}

export interface AssessmentQuestion {
  questionText: string
  optionText: string
  subOptionText?: string
}

export interface AssessmentSubmission {
  submissionId: string
  assessmentName: string
  assessmentStatus: string
  assessmentCompletedDateTime: string
  performedBy: string
  contactType: string
  actualDuration: number
  assessmentScore: number
  activityOutcome: string
  careActivityType: string
  questions: AssessmentQuestion[]
}

// Activity summary list — /v2/ActivitySummary/Script
export const mockActivitySummary: ScriptSummary[] = [
  {
    submissionId: 'SUB-2024-001',
    assessmentName: 'Health Risk Assessment (HRA)',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2024-02-14T14:30:00.000Z',
    performedOn: '2024-02-14T14:00:00.000Z',
    performedBy: 'prudhvi.rajan',
    programName: 'Care Coordination',
    eligibilityPath: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    assessmentScore: 72,
    careActivityType: 'Assessment',
    activityOutcome: 'Completed - Member Engaged',
    contactType: 'Phone',
    actualDuration: 35,
  },
  {
    submissionId: 'SUB-2024-002',
    assessmentName: 'Adult LTSS Reassessment',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2024-01-10T10:15:00.000Z',
    performedOn: '2024-01-10T09:45:00.000Z',
    performedBy: 'prudhvi.rajan',
    programName: 'Chronic Disease Management',
    eligibilityPath: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    assessmentScore: 68,
    careActivityType: 'Assessment',
    activityOutcome: 'Completed - Member Engaged',
    contactType: 'In Person',
    actualDuration: 45,
  },
  {
    submissionId: 'SUB-2023-012',
    assessmentName: 'PHQ-9 Depression Screening',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2023-11-20T13:00:00.000Z',
    performedOn: '2023-11-20T12:30:00.000Z',
    performedBy: 'prudhvi.rajan',
    programName: 'Behavioral Health Integration',
    eligibilityPath: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    assessmentScore: 6,
    careActivityType: 'Assessment',
    activityOutcome: 'Completed - Member Engaged',
    contactType: 'Phone',
    actualDuration: 20,
  },
  {
    submissionId: 'SUB-2023-008',
    assessmentName: 'SDOH Screening',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2023-12-15T11:00:00.000Z',
    performedOn: '2023-12-15T10:30:00.000Z',
    performedBy: 'prudhvi.rajan',
    programName: 'Care Coordination',
    eligibilityPath: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    assessmentScore: 3,
    careActivityType: 'Assessment',
    activityOutcome: 'Completed - Referral Submitted',
    contactType: 'Phone',
    actualDuration: 25,
  },
]

// Full submission detail — /v2/Assessment/Submission/SUB-2024-001
export const mockAssessmentSubmissions: Record<string, AssessmentSubmission> = {
  'SUB-2024-001': {
    submissionId: 'SUB-2024-001',
    assessmentName: 'Health Risk Assessment (HRA)',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2024-02-14T14:30:00.000Z',
    performedBy: 'prudhvi.rajan',
    contactType: 'Phone',
    actualDuration: 35,
    assessmentScore: 72,
    activityOutcome: 'Completed - Member Engaged',
    careActivityType: 'Assessment',
    questions: [
      {
        questionText: 'How would you rate your overall health?',
        optionText: 'Fair',
      },
      {
        questionText: 'Do you have difficulty performing Activities of Daily Living (ADLs)?',
        optionText: 'Yes - Some difficulty',
        subOptionText: 'Bathing, Dressing',
      },
      {
        questionText: 'What is your most recent A1C value?',
        optionText: '7.8%',
      },
      {
        questionText: 'Are you currently taking all prescribed medications?',
        optionText: 'Sometimes',
        subOptionText: 'Reports difficulty affording Metformin refill',
      },
      {
        questionText: 'Do you have reliable transportation to medical appointments?',
        optionText: 'No',
        subOptionText: 'Relies on family; misses appointments when unavailable',
      },
      {
        questionText: 'In the past 12 months, were there times when you did not have enough food?',
        optionText: 'Yes',
        subOptionText: 'Skips meals 2-3 times per week',
      },
      {
        questionText: 'Do you currently smoke or use tobacco products?',
        optionText: 'No',
      },
      {
        questionText: 'How many alcoholic drinks do you have per week?',
        optionText: '1-2 drinks',
      },
    ],
  },
  'SUB-2024-002': {
    submissionId: 'SUB-2024-002',
    assessmentName: 'Adult LTSS Reassessment',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2024-01-10T10:15:00.000Z',
    performedBy: 'prudhvi.rajan',
    contactType: 'In Person',
    actualDuration: 45,
    assessmentScore: 68,
    activityOutcome: 'Completed - Member Engaged',
    careActivityType: 'Assessment',
    questions: [
      {
        questionText: 'Can you dress yourself without assistance?',
        optionText: 'With some help',
      },
      {
        questionText: 'Can you bathe yourself without assistance?',
        optionText: 'With some help',
      },
      {
        questionText: 'Can you prepare your own meals?',
        optionText: 'Yes, independently',
      },
      {
        questionText: 'Can you manage your own medications?',
        optionText: 'With reminders',
      },
      {
        questionText: 'Do you need help with housework?',
        optionText: 'Yes',
      },
    ],
  },
  'SUB-2023-012': {
    submissionId: 'SUB-2023-012',
    assessmentName: 'PHQ-9 Depression Screening',
    assessmentStatus: 'Completed',
    assessmentCompletedDateTime: '2023-11-20T13:00:00.000Z',
    performedBy: 'prudhvi.rajan',
    contactType: 'Phone',
    actualDuration: 20,
    assessmentScore: 6,
    activityOutcome: 'Completed - Member Engaged',
    careActivityType: 'Assessment',
    questions: [
      {
        questionText: 'Little interest or pleasure in doing things',
        optionText: 'Several days',
      },
      {
        questionText: 'Feeling down, depressed, or hopeless',
        optionText: 'Not at all',
      },
      {
        questionText: 'Trouble falling or staying asleep, or sleeping too much',
        optionText: 'Several days',
      },
      {
        questionText: 'Feeling tired or having little energy',
        optionText: 'More than half the days',
      },
      {
        questionText: 'Poor appetite or overeating',
        optionText: 'Not at all',
      },
      {
        questionText: 'Feeling bad about yourself',
        optionText: 'Not at all',
      },
      {
        questionText: 'Trouble concentrating on things',
        optionText: 'Several days',
      },
      {
        questionText: 'Moving or speaking slowly, or being fidgety',
        optionText: 'Not at all',
      },
      {
        questionText: 'Thoughts of being better off dead or hurting yourself',
        optionText: 'Not at all',
      },
    ],
  },
}
