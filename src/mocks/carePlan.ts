/**
 * Mock response for /v2/Member/CarePlan
 * Member: Henry Tom Garcia (AH58319473)
 */

export interface CarePlanItem {
  eligibility: string
  category: string
  opportunity: string
  opportunityAlias: string
  goal: string
  goalAlias: string
  intervention: string
  interventionAlias: string
  memberPlan: string
  condition: string
  targetDate: string
  status: string
  dueLabel?: string
  startDate: string
  preference: string
  task: string
  memberGoal: string
  memberStatus: string
  careStaffComments: string
  memberComments: string
  priority: string
  term: string
  barriers: CarePlanBarrier[]
  strengths: CarePlanStrength[]
}

export interface CarePlanBarrier {
  goalName: string
  priority: string
  barrier: string
  status: string
  type: string
  createdBy: string
  createdOn: string
  updatedBy: string
  updatedOn: string
}

export interface CarePlanStrength {
  goalName: string
  priority: string
  strengthName: string
  status: string
  type: string
  createdBy: string
  createdOn: string
  updatedBy: string
  updatedOn: string
}

export const mockCarePlan: CarePlanItem[] = [
  {
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    category: 'Diabetes Management',
    opportunity: 'HbA1c Control',
    opportunityAlias: 'A1C Improvement',
    goal: 'Reduce HbA1c to below 7.0% by June 2026',
    goalAlias: 'A1C Goal',
    intervention: 'Monthly care coordination check-ins focused on medication adherence and dietary habits',
    interventionAlias: 'Monthly Check-In',
    memberPlan: 'Member will track meals and take Metformin consistently',
    condition: 'Type 2 Diabetes Mellitus (E11.9)',
    targetDate: '2026-06-30',
    status: 'In Progress',
    dueLabel: 'Due in 10 days',
    startDate: '2026-01-18',
    preference: 'Phone contact preferred',
    task: 'Schedule DSME enrollment by 05/01/2026',
    memberGoal: 'I want to get my blood sugar under control so I feel less tired',
    memberStatus: 'Engaged',
    careStaffComments: 'Member reports difficulty affording Metformin. Exploring patient assistance programs.',
    memberComments: 'I sometimes forget to take my pills in the morning.',
    priority: 'High',
    term: 'Short-term',
    barriers: [
      {
        goalName: 'Reduce HbA1c',
        priority: 'High',
        barrier: 'Medication affordability',
        status: 'Active',
        type: 'Financial',
        createdBy: 'prudhvi.rajan',
        createdOn: '2026-01-18',
        updatedBy: 'prudhvi.rajan',
        updatedOn: '2026-02-14',
      },
      {
        goalName: 'Reduce HbA1c',
        priority: 'Medium',
        barrier: 'Transportation to appointments',
        status: 'Active',
        type: 'Social Determinant',
        createdBy: 'prudhvi.rajan',
        createdOn: '2026-01-18',
        updatedBy: 'prudhvi.rajan',
        updatedOn: '2026-01-18',
      },
    ],
    strengths: [
      {
        goalName: 'Reduce HbA1c',
        priority: 'High',
        strengthName: 'Member is motivated and expresses desire to improve health',
        status: 'Active',
        type: 'Motivational',
        createdBy: 'prudhvi.rajan',
        createdOn: '2026-01-18',
        updatedBy: 'prudhvi.rajan',
        updatedOn: '2026-01-18',
      },
    ],
  },
  {
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    category: 'Hypertension Management',
    opportunity: 'Blood Pressure Control',
    opportunityAlias: 'BP Goal',
    goal: 'Achieve BP consistently below 130/80 mmHg',
    goalAlias: 'BP Reduction',
    intervention: 'Medication adherence support and dietary sodium reduction education',
    interventionAlias: 'BP Education',
    memberPlan: 'Member will take Lisinopril daily and reduce salt intake',
    condition: 'Essential Hypertension (I10)',
    targetDate: '2026-09-30',
    status: 'In Progress',
    dueLabel: 'Due in 1 day',
    startDate: '2026-01-18',
    preference: 'Phone contact preferred',
    task: 'Blood pressure recheck at PCP visit 03/25/2026',
    memberGoal: 'I want to avoid having a stroke like my father did',
    memberStatus: 'Engaged',
    careStaffComments: 'BP trending above goal at 138/88 - flagged for PCP review.',
    memberComments: '',
    priority: 'High',
    term: 'Long-term',
    barriers: [],
    strengths: [
      {
        goalName: 'BP Control',
        priority: 'Medium',
        strengthName: 'Family history awareness motivates adherence',
        status: 'Active',
        type: 'Motivational',
        createdBy: 'prudhvi.rajan',
        createdOn: '2026-01-18',
        updatedBy: 'prudhvi.rajan',
        updatedOn: '2026-01-18',
      },
    ],
  },
  {
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    category: 'Physical Activity',
    opportunity: 'Exercise Engagement',
    opportunityAlias: 'Activity Goal',
    goal: 'Engage in 30 minutes of moderate exercise 3 times per week',
    goalAlias: 'Exercise Plan',
    intervention: 'Referral to community fitness program; education on low-impact exercises',
    interventionAlias: 'Exercise Referral',
    memberPlan: 'Member will walk 30 min in the neighborhood 3x per week',
    condition: 'Obesity (E66.09)',
    targetDate: '2026-06-30',
    status: 'In Progress',
    dueLabel: 'Last adjusted 29 days ago',
    startDate: '2026-01-18',
    preference: 'Phone contact preferred',
    task: 'Follow up on exercise adherence at next check-in',
    memberGoal: 'I want to lose weight and have more energy',
    memberStatus: 'Partially Engaged',
    careStaffComments: 'Member reports walking 1-2x/week. Encouraged to gradually increase.',
    memberComments: 'I get tired easily but I am trying.',
    priority: 'Medium',
    term: 'Long-term',
    barriers: [
      {
        goalName: 'Exercise Engagement',
        priority: 'Medium',
        barrier: 'Fatigue related to poorly controlled diabetes',
        status: 'Active',
        type: 'Clinical',
        createdBy: 'prudhvi.rajan',
        createdOn: '2026-01-18',
        updatedBy: 'prudhvi.rajan',
        updatedOn: '2026-02-14',
      },
    ],
    strengths: [],
  },
  {
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    category: 'Behavioral Health',
    opportunity: 'Depression Monitoring',
    opportunityAlias: 'BH Monitoring',
    goal: 'Complete annual PHQ-9 and maintain depression remission',
    goalAlias: 'PHQ-9 Annual',
    intervention: 'Administer PHQ-9 at next touchpoint; assess for counseling referral if score ≥10',
    interventionAlias: 'PHQ-9 Screening',
    memberPlan: 'Member will complete PHQ-9 at next care manager contact',
    condition: 'Moderate Depression, in remission (F32.4)',
    targetDate: '2026-05-01',
    status: 'Pending',
    startDate: '2026-01-18',
    preference: 'Phone contact preferred',
    task: 'Administer PHQ-9 by 05/01/2026',
    memberGoal: 'I want to stay feeling okay and not go back to feeling depressed',
    memberStatus: 'Pending',
    careStaffComments: 'Last PHQ-9 score was 6 (mild). Due for annual re-screen.',
    memberComments: '',
    priority: 'Medium',
    term: 'Short-term',
    barriers: [],
    strengths: [],
  },
  {
    eligibility: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    category: 'Diabetes Management',
    opportunity: 'DSME Enrollment',
    opportunityAlias: 'DSME Enrollment',
    goal: 'Enroll in Diabetes Self-Management Education program',
    goalAlias: 'DSME Goal',
    intervention: 'Provide DSME program information and complete enrollment referral',
    interventionAlias: 'DSME Referral',
    memberPlan: 'Member will attend DSME orientation session',
    condition: 'Type 2 Diabetes Mellitus (E11.9)',
    targetDate: '2026-04-01',
    status: 'Completed',
    startDate: '2026-01-18',
    preference: 'Phone contact preferred',
    task: 'DSME enrollment confirmed',
    memberGoal: 'I want to learn more about managing my diabetes',
    memberStatus: 'Completed',
    careStaffComments: 'Member enrolled in DSME as of 03/05/2026.',
    memberComments: '',
    priority: 'High',
    term: 'Short-term',
    barriers: [],
    strengths: [],
  },
]
