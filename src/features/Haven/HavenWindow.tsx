import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Icon, AiAssistant } from '@/components/Icons'
import { MemberHeader } from './MemberHeader'
import { ChatWelcome } from './ChatWelcome'
import { MemberDetailMenu } from './MemberDetailMenu'
import { SummarizeMenu } from './SummarizeMenu'
import { ComplianceMenu } from './ComplianceMenu'
import { DocumentMenu } from './DocumentMenu'
import { ChatMessages, type Message, type FollowUpChip } from './ChatMessages'
import { AskHavenInput } from './AskHavenInput'
import styles from './HavenWindow.module.css'
import panelStyles from './HavenPanel.module.css'
import { getMockReply, getFollowUp, getFollowUpQuery, getGuardrailMessage, getRecommendedActionsFromNote, getLastUpdateData, getOpenCareGaps } from './mockReplies'
import { type SmartGoalData } from './SmartGoalCard'
import { type MedicationsCardData } from './MedicationsCard'
import { type ContactHistoryCardData } from './ContactHistoryCard'
import { type OGICardData } from './OGICard'
import { type CareGapsCardData } from './CareGapsCard'
import { type ConditionsCardData } from './ConditionsCard'
import { type AuthorizationsCardData } from './AuthorizationsCard'
import { type AssessmentsCardData } from './AssessmentsCard'
import { type EligibilityCardData } from './EligibilityCard'
import { type RiskLevelCardData } from './RiskLevelCard'
import { type OutstandingActivitiesCardData } from './OutstandingActivitiesCard'
import { type PreCallBriefCardData } from './PreCallBriefCard'
import {
  mockMedications, mockVisits, mockDiagnosis, mockGapsInCare,
  mockEligibility, mockActivitySummary, mockCarePlan, mockPrograms,
} from '@/mocks'
import {
  lisaMedications, lisaVisits, lisaDiagnosis, lisaGapsInCare,
  lisaEligibility, lisaActivitySummary, lisaCarePlan, lisaPrograms,
  lisaMemberDetail,
} from '@/mocks/lisaThompson'
import { mockMemberDetail } from '@/mocks/memberDetail'
import { HomeWelcome, MariaTodaysTasks } from './HomeWelcome'
import { MemberChatWindow } from './MemberChatWindow'
import { SukiWindow, type Alert as SukiAlert } from './SukiWindow'
import { ChatHistoryDrawer } from './ChatHistoryDrawer'
import { PresetPromptsPanel } from './PresetPromptsPanel'
import { SettingsPanel } from './SettingsPanel'
import { useHavenSettings } from './useHavenSettings'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { CallInsightsCard } from './CallInsightsCard'
import { AddActivityModal, type ActivityConfig } from './AddActivityModal'
import { Alert } from '@/components'
import { useChatHistory } from './useChatHistory'
import chatIcon from '@/assets/chat.png'
import chevronForwardIcon from '@/assets/chevron_forward.png'

const FONT_MAP: Record<string, string> = {
  default:  '"Roboto", sans-serif',
  serif:    'Georgia, serif',
  dyslexic: '"OpenDyslexic", sans-serif',
}

/* ── Card data builders ─────────────────────────────────────────────────── */

function getMedicationsCardData(firstName: string, memberId: string): MedicationsCardData {
  const meds = memberId === 'AH72940158' ? lisaMedications : mockMedications
  return {
    memberFirstName: firstName,
    medications: meds.map(m => ({ ...m })),
    lastReconDate: meds.find(m => m.isCurrent)?.lastReconDate,
  }
}

function getContactHistoryCardData(firstName: string, memberId: string): ContactHistoryCardData {
  const isLisa = memberId === 'AH72940158'
  const detail = isLisa ? lisaMemberDetail : mockMemberDetail
  const preferred = detail.phones.find(p => p.isPreferred)
  return {
    memberFirstName: firstName,
    contacts: isLisa ? [
      { date: '2026-03-10', type: 'connected', channel: 'Phone', timeOfDay: 'Morning', summary: 'Vital check, medication review, care plan goals reviewed' },
      { date: '2026-02-14', type: 'connected', channel: 'Phone', timeOfDay: 'Morning', summary: 'PHQ-9 administered (score 9), flu vaccine discussed' },
      { date: '2026-01-15', type: 'connected', channel: 'Phone', timeOfDay: 'Morning', summary: 'Post-discharge follow-up call (CHF hospitalization 12/2025)' },
    ] : [
      { date: '2026-02-20', type: 'connected', channel: 'Phone', timeOfDay: 'Afternoon', summary: 'Medication check-in, A1C results reviewed, DPP program discussed' },
      { date: '2026-03-10', type: 'missed', channel: 'Phone', timeOfDay: 'Morning', summary: undefined },
      { date: '2026-01-25', type: 'connected', channel: 'Phone', timeOfDay: 'Afternoon', summary: 'Upcoming PCP visit confirmed, transportation barrier noted' },
      { date: '2026-01-10', type: 'connected', channel: 'Phone', timeOfDay: 'Afternoon', summary: 'Care plan review, goals discussed' },
    ],
    preferredPhone: preferred?.phoneNumber ?? 'N/A',
    preferredTime: preferred?.bestTimeToCall ?? 'N/A',
    communicationImpairments: detail.communicationImpairments,
  }
}

function getOGICardData(firstName: string, memberId: string): OGICardData {
  const plan = memberId === 'AH72940158' ? lisaCarePlan : mockCarePlan
  return {
    memberFirstName: firstName,
    ogis: plan.map(c => ({
      category: c.category,
      opportunity: c.opportunity,
      goal: c.goal,
      intervention: c.intervention,
      status: c.status,
      priority: c.priority,
      targetDate: c.targetDate,
      term: c.term,
      barriers: c.barriers.filter(b => b.status === 'Active').map(b => b.barrier),
    })),
  }
}

function getCareGapsCardData(firstName: string, memberId: string): CareGapsCardData {
  const gaps = memberId === 'AH72940158' ? lisaGapsInCare : mockGapsInCare
  return {
    memberFirstName: firstName,
    gaps: gaps.map(g => ({
      opportunity: g.opportunity,
      measureCode: g.measureCode,
      measureCategory: g.measureCategory,
      ncqaGrouping: g.ncqaGrouping,
      measureDescription: g.measureDescription,
      opportunityStatus: g.opportunityStatus as 'Open' | 'Closed',
      identifiedDate: g.identifiedDate,
      updatedOn: g.updatedOn,
    })),
  }
}

function getConditionsCardData(firstName: string, memberId: string): ConditionsCardData {
  const dx = memberId === 'AH72940158' ? lisaDiagnosis : mockDiagnosis
  const visits = memberId === 'AH72940158' ? lisaVisits : mockVisits
  return {
    memberFirstName: firstName,
    conditions: dx.map(d => ({
      diagnosisCode: d.diagnosisCode,
      condition: d.condition,
      category: d.category,
      level: d.level,
      startDate: d.startDate,
      isPrimaryDiagnosis: d.isPrimaryDiagnosis,
    })),
    lastUpdated: visits[0]?.serviceFrom,
  }
}

function getAuthorizationsCardData(firstName: string, memberId: string): AuthorizationsCardData {
  const visits = memberId === 'AH72940158' ? lisaVisits : mockVisits
  return {
    memberFirstName: firstName,
    claims: visits.map(v => ({
      visitType: v.visitType,
      serviceFrom: v.serviceFrom,
      serviceTo: v.serviceTo,
      reasonForVisit: v.reasonForVisit,
      providerName: v.providerName,
      procedureCode: v.procedureCode,
      diagnosisCode: v.diagnosisCode,
      payor: v.payor,
      lengthOfStay: v.lengthOfStay,
    })),
  }
}

function getAssessmentsCardData(firstName: string, memberId: string): AssessmentsCardData {
  const summary = memberId === 'AH72940158' ? lisaActivitySummary : mockActivitySummary
  const programs = memberId === 'AH72940158' ? lisaPrograms : mockPrograms
  return {
    memberFirstName: firstName,
    assessments: summary.map(a => ({
      submissionId: a.submissionId,
      assessmentName: a.assessmentName,
      assessmentStatus: a.assessmentStatus,
      completedDate: a.assessmentCompletedDateTime,
      performedBy: a.performedBy,
      contactType: a.contactType,
      score: a.assessmentScore,
      outcome: a.activityOutcome,
      duration: a.actualDuration,
      programName: a.programName ?? programs[0]?.program ?? 'Care Coordination',
    })),
  }
}

function getEligibilityCardData(firstName: string, memberId: string): EligibilityCardData {
  const elig = memberId === 'AH72940158' ? lisaEligibility : mockEligibility
  return {
    memberFirstName: firstName,
    memberDOB: elig.memberDOB,
    gender: elig.gender,
    medicareId: elig.medicareID,
    eligibilities: elig.eligibilities.map(e => ({
      eligibilityPath: e.eligibilityPath,
      planType: e.planType,
      startDate: e.startDate,
      endDate: e.endDate,
      status: e.status,
      policyNumber: e.additionalIdentifiers.find(i => i.identifierName.includes('NO') || i.identifierName.includes('SUBSCRIBER'))?.identifierValue,
    })),
  }
}

function getRiskLevelCardData(firstName: string, memberId: string): RiskLevelCardData {
  const isLisa = memberId === 'AH72940158'
  return isLisa ? {
    memberFirstName: firstName,
    riskTier: 'Tier 4',
    riskLabel: 'High',
    riskScore: 88,
    riskScoreMax: 100,
    readmissionRisk: 'High',
    hospitalizationRisk: 'High',
    lastAssessmentDate: '03/2026',
    drivers: [
      { condition: 'Congestive Heart Failure', detail: 'BNP 420 pg/mL, recent hospitalization 12/2025' },
      { condition: 'COPD', detail: 'O₂ saturation 94%, below goal (≥96%)' },
      { condition: 'Type 2 Diabetes', detail: 'A1C 8.2%, above goal' },
      { condition: 'CKD Stage 3', detail: 'eGFR 48, monitor for progression' },
    ],
  } : {
    memberFirstName: firstName,
    riskTier: 'Tier 4',
    riskLabel: 'High',
    riskScore: 82,
    riskScoreMax: 100,
    readmissionRisk: 'High',
    hospitalizationRisk: 'High',
    lastAssessmentDate: '06/2026',
    drivers: [
      { condition: 'Type 2 Diabetes with DKA', detail: 'A1C 9.8%, recent DKA hospitalization 05/2026; now on basal insulin' },
      { condition: 'Essential Hypertension', detail: 'BP 144/92 at last visit, above target (<130/80)' },
      { condition: 'Diabetic Nephropathy (Stage G2)', detail: 'eGFR 68, elevated urine albumin-creatinine ratio' },
      { condition: 'Diabetic Peripheral Neuropathy', detail: 'Bilateral foot numbness, fall risk — podiatry not yet scheduled' },
      { condition: 'Hyperlipidemia', detail: 'LDL 128 mg/dL on statin, not at goal (<70 mg/dL for high-risk)' },
    ],
  }
}

function getPreCallBriefCardData(firstName: string, memberId: string): PreCallBriefCardData {
  const isLisa = memberId === 'AH72940158'
  const detail = isLisa ? lisaMemberDetail : mockMemberDetail
  const elig = isLisa ? lisaEligibility : mockEligibility
  const meds = isLisa ? lisaMedications : mockMedications
  const visits = isLisa ? lisaVisits : mockVisits
  const dx = isLisa ? lisaDiagnosis : mockDiagnosis
  const gaps = isLisa ? lisaGapsInCare : mockGapsInCare
  const plan = isLisa ? lisaCarePlan : mockCarePlan
  const programs = isLisa ? lisaPrograms : mockPrograms

  const preferred = detail.phones.find(p => p.isPreferred)
  const primaryProgram = programs.find(p => p.status === 'Active') ?? programs[0]
  const activeMeds = meds.filter(m => m.isCurrent)
  const openGaps = gaps.filter(g => g.opportunityStatus === 'Open')
  const activeOGIs = plan.filter(o => o.status !== 'Closed')
  const recentVisits = [...visits].sort((a, b) => b.serviceFrom.localeCompare(a.serviceFrom))

  const riskData = isLisa
    ? {
        riskTier: 'Tier 4', riskLabel: 'High', riskScore: 88, riskScoreMax: 100,
        riskDrivers: [
          { condition: 'Congestive Heart Failure', detail: 'BNP 420 pg/mL, recent hospitalization 12/2025' },
          { condition: 'COPD', detail: 'O₂ saturation 94%, below goal (≥96%)' },
          { condition: 'Type 2 Diabetes', detail: 'A1C 8.2%, above goal' },
          { condition: 'CKD Stage 3', detail: 'eGFR 48, monitor for progression' },
        ],
      }
    : {
        riskTier: 'Tier 4', riskLabel: 'High', riskScore: 82, riskScoreMax: 100,
        riskDrivers: [
          { condition: 'Type 2 Diabetes with DKA', detail: 'A1C 9.8%, recent DKA hospitalization 05/2026; now on basal insulin' },
          { condition: 'Essential Hypertension', detail: 'BP 144/92 at last visit, above target (<130/80)' },
          { condition: 'Diabetic Nephropathy (Stage G2)', detail: 'eGFR 68, elevated urine albumin-creatinine ratio' },
          { condition: 'Diabetic Peripheral Neuropathy', detail: 'Bilateral foot numbness, fall risk — podiatry not yet scheduled' },
          { condition: 'Hyperlipidemia', detail: 'LDL 128 mg/dL on statin, not at goal (<70 mg/dL for high-risk)' },
        ],
      }

  const lastUpdate = recentVisits[0]?.serviceFrom ?? plan[0]?.targetDate ?? ''

  return {
    memberFirstName: firstName,
    referralProgram: primaryProgram?.program ?? 'Care Coordination',
    referralBy: primaryProgram?.referralSource ?? 'Care Manager',
    referralDate: primaryProgram?.startDate ?? '',
    referralLastUpdated: primaryProgram?.updatedOn ?? primaryProgram?.startDate ?? '',
    eligibilityLastUpdated: elig.eligibilities[0]?.endDate ?? elig.eligibilities[0]?.startDate ?? '',
    eligibilities: elig.eligibilities.slice(0, 1).map(e => {
      const pathParts = e.eligibilityPath.split('>>')
      const planName = pathParts[pathParts.length - 1]?.trim() ?? e.eligibilityPath
      const lineOfBusiness = pathParts[0]?.trim().replace(/\s*\(.*?\)/, '') ?? 'Ambetter Health'
      return {
        status: 'Active',
        startDate: e.startDate,
        planName,
        lineOfBusiness,
      }
    }),
    riskTier: riskData.riskTier,
    riskLabel: riskData.riskLabel,
    riskScore: riskData.riskScore,
    riskScoreMax: riskData.riskScoreMax,
    riskDrivers: riskData.riskDrivers,
    riskLastUpdated: isLisa ? '06/10/2026' : '06/10/2026',
    activeMedCount: activeMeds.length,
    medsLastUpdated: activeMeds[0]?.lastReconDate ?? '',
    keyMedications: activeMeds.slice(0, 6).map(m => ({
      name: m.medicationName,
      dosage: m.dosage,
      frequency: m.frequency,
      medicationClass: m.medicationClass,
      prescribedBy: m.prescribedBy,
      startDate: m.startDate,
      dispensedDate: m.dispensedDate,
    })),
    discontinuedMedications: meds.filter(m => !m.isCurrent && m.endDate).map(m => ({
      name: m.medicationName,
      dosage: m.dosage,
      endDate: m.endDate!,
      prescribedBy: m.prescribedBy,
    })),
    recentClaims: recentVisits.slice(0, 5).map(v => ({
      visitType: v.visitType,
      date: v.serviceFrom,
      provider: v.providerName,
      procedureCode: v.procedureCode,
      reasonForVisit: v.reasonForVisit,
    })),
    claimsApproved: Math.max(0, recentVisits.length - 1),
    claimsPending: recentVisits.length > 0 ? 1 : 0,
    claimsDenied: 0,
    claimsTypeBreakdown: (() => {
      const counts: Record<string, number> = {}
      recentVisits.forEach(v => {
        const type = v.visitType.includes('Emergency') ? 'ER'
          : v.visitType.includes('Pharmacy') ? 'Pharmacy'
          : v.visitType.includes('Telehealth') ? 'Telehealth'
          : v.visitType.includes('Inpatient') ? 'Inpatient'
          : v.visitType.includes('Specialist') ? 'Specialist'
          : 'PCP'
        counts[type] = (counts[type] ?? 0) + 1
      })
      return Object.entries(counts).map(([type, count]) => ({ type, count }))
    })(),
    conditions: dx.map(d => ({
      condition: d.condition,
      code: d.diagnosisCode,
      level: d.level,
      isPrimary: d.isPrimaryDiagnosis,
      isNew: false,
    })),
    openCareGaps: openGaps.map(g => ({
      opportunity: g.opportunity,
      measureCode: g.measureCode,
    })),
    activeOGIs: activeOGIs.map(o => ({
      opportunity: o.opportunity,
      category: o.category,
      status: o.status,
      targetDate: o.targetDate,
    })),
    preferredPhone: preferred?.phoneNumber ?? 'N/A',
    bestTimeToCall: preferred?.bestTimeToCall ?? 'N/A',
    communicationImpairments: detail.communicationImpairments,
    preferredLanguage: detail.primaryLanguage,
    preferredContactFormat: detail.preferredContactFormat,
    lastRecordUpdate: lastUpdate,
  }
}

function getOutstandingActivitiesCardData(firstName: string, memberId: string): OutstandingActivitiesCardData {
  const programs = memberId === 'AH72940158' ? lisaPrograms : mockPrograms
  const activities = programs.flatMap(p =>
    p.requiredActivities.map(a => ({
      activityType: a.activityType,
      scriptName: a.scriptName,
      dueDate: a.dueDate,
      status: a.status,
      contactType: a.contactType,
      outcomeType: a.outcomeType,
      programName: p.program,
    }))
  )
  return { memberFirstName: firstName, activities }
}

const JACKSON_SMART_GOAL: SmartGoalData = {
  goals: [
    {
      name: 'Blood Sugar Monitoring',
      description: 'Daily glucose logging to support A1C reduction',
      iconName: 'MonitorHeart',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Check blood sugar and log readings twice daily, before breakfast and before dinner' },
        { label: 'How will you and the member know progress is being made?', value: 'Twice daily readings logged in Wellframe and A1C target below 8.0% at next lab visit.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member agreed and has no major barriers.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Supports A1C reduction from 9.2%, consistent monitoring is the primary identified opportunity.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Wellframe app logging, phone calls, text.' },
      ],
    },
    {
      name: 'Medication Adherence',
      description: 'Consistent use of prescribed diabetes medications',
      iconName: 'Medication',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Take metformin as prescribed twice daily with meals and refill before running out' },
        { label: 'How will you and the member know progress is being made?', value: 'Member self-reports adherence weekly via Wellframe and pharmacy refill history shows no gaps.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has pharmacy coverage and is motivated to manage diabetes.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Medication adherence is essential to achieving A1C target and preventing complications.' },
        { label: 'What is the timeframe for this goal?', value: '60 days' },
        { label: 'How will progress be tracked?', value: 'Pharmacy refill data, Wellframe check-ins, care manager follow-up calls.' },
      ],
    },
    {
      name: 'Foot Care & Exam',
      description: 'Preventive foot care to reduce complication risk',
      iconName: 'HealthAndSafety',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Complete annual podiatry exam and perform daily foot inspection at home' },
        { label: 'How will you and the member know progress is being made?', value: 'Podiatry appointment scheduled and completed; member demonstrates daily inspection routine.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has transportation access and podiatry is covered under their plan.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Addresses open HEDIS gap for diabetic foot exam and reduces risk of amputation.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Appointment confirmation, HEDIS gap closure, member self-report.' },
      ],
    },
  ],
}

const MARIA_SMART_GOAL: SmartGoalData = {
  goals: [
    {
      name: 'Personal Care Aide Visits',
      description: 'Maintain aide support for ADLs and independent living',
      iconName: 'SupportAgent',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Participate in at least 3 approved personal care aide visits per week to assist with bathing, dressing, and meal preparation' },
        { label: 'How will you and the member know progress is being made?', value: 'Care aide visit logs completed weekly and member reports ability to complete 2+ ADLs independently by next assessment.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has authorized aide services and caregiver support at home.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Supports LTSS care plan objective to maintain independent living and prevent nursing facility placement.' },
        { label: 'What is the timeframe for this goal?', value: '60 days' },
        { label: 'How will progress be tracked?', value: 'Aide visit logs, monthly care manager check-ins, ADL reassessment.' },
      ],
    },
    {
      name: 'Home Safety & Fall Prevention',
      description: 'Reduce fall risk and improve safety in the home',
      iconName: 'HomeWork',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Complete a home safety assessment and implement at least 2 recommended modifications (e.g. grab bars, removal of tripping hazards)' },
        { label: 'How will you and the member know progress is being made?', value: 'Home safety checklist completed and modifications confirmed at next care manager visit.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has family support and modifications are covered under LTSS waiver.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Addresses fall risk identified in ADL assessment and supports continued community living.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Care manager home visit, member and caregiver self-report.' },
      ],
    },
  ],
}

function postToIframe(data: object) {
  const iframes = document.querySelectorAll('iframe')
  iframes.forEach(f => f.contentWindow?.postMessage(data, '*'))
}

export interface HavenWindowProps {
  memberName?: string
  phone?: string
  memberId?: string
  pcp?: string
  /** Provide to wire a real AI backend; omit to use built-in demo replies */
  onSend?: (value: string) => Promise<string>
  onLearnMore?: () => void
  defaultRight?: number
  defaultBottom?: number
  defaultWidth?: number
  defaultHeight?: number
  /** Member ID used to select the correct mock data set */
  mockMemberId?: string
  /** Whether clinical data is available for this member in Haven */
  hasData?: boolean
  /** Confirmation message shown when the window is first opened after a member switch */
  switchConfirmation?: string
  /** True when the care manager is on the home dashboard (no active member) */
  isHome?: boolean
  age?: string
  gender?: string
  dob?: string
  /** Which demo day is active — auto-opens Haven on home view */
  day?: 0 | 1 | 2 | 3 | 4 | 'intake'
}

type WindowState = 'open' | 'minimized' | 'closed'
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_W = 360
const MIN_H = 300

export function HavenWindow({
  memberName = 'Henry Tom Garcia',
  phone = '909-851-3064',
  memberId = 'AH58319473',
  pcp = 'Ambetter',
  onSend,
  defaultRight = 24,
  defaultBottom = 118,
  defaultWidth = 500,
  defaultHeight = 657,
  mockMemberId = 'AH58319473',
  hasData = true,
  switchConfirmation,
  isHome = false,
  age = '26',
  gender = 'Male',
  dob = '03/01/1989',
  day = 1 as 1 | 2 | 3 | 'intake',
}: HavenWindowProps) {
  const [winState, setWinState] = useState<WindowState>(isHome ? 'open' : 'closed')
  const [menuOpen, setMenuOpen] = useState(false)
  const [summarizeMenuOpen, setSummarizeMenuOpen] = useState(false)
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(false)
  const [documentMenuOpen, setDocumentMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [memberChatOpen, setMemberChatOpen] = useState(false)
  const [sukiOpen, setSukiOpen] = useState(false)
  const [fabExpanded, setFabExpanded] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [fromPresets, setFromPresets] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings, updateSettings } = useHavenSettings()
  const [previewFont, setPreviewFont] = useState<string | null>(null)
  const [sukiActionsReady, setSukiActionsReady] = useState(false)
  const [callInsightsOpen, setCallInsightsOpen] = useState(false)
  const [liveAlerts, setLiveAlerts] = useState<SukiAlert[]>([])
  const [alertTaskLabels, setAlertTaskLabels] = useState<Record<string, string[]>>({})
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)
  const [alertTaskView, setAlertTaskView] = useState<string | null>(null) // alert id in task-list view
  const [addedAlertTasks, setAddedAlertTasks] = useState<Set<string>>(new Set())
  const [skipWelcome, setSkipWelcome] = useState(false)
  const [doneAlertTasks, setDoneAlertTasks] = useState<Set<string>>(new Set())
  const [openAlertModal, setOpenAlertModal] = useState<{ alertId: string; taskIdx: number; task: string } | null>(null)

  const { getSessionsForMember, saveSession, upsertSession, deleteSession, toggleFavorite, clearAllForMember } = useChatHistory()
  const [historyVersion, setHistoryVersion] = useState(0)
  const refreshHistory = () => setHistoryVersion(v => v + 1)
  const historySessions = useMemo(() => getSessionsForMember(memberId), [getSessionsForMember, memberId, historyVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stable ID for the current in-progress conversation — reset on new chat / member switch
  const currentSessionId = useRef(`session-${Date.now()}`)

  // Auto-save after every assistant reply
  useEffect(() => {
    const hasAssistantReply = messages.some(m => m.role === 'assistant')
    if (!hasAssistantReply) return
    upsertSession(currentSessionId.current, memberId, memberName, messages)
    refreshHistory()
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  // Refs so the unmount cleanup can read the latest values without stale closures
  const messagesRef = useRef<Message[]>([])
  const memberIdRef = useRef(memberId)
  const memberNameRef = useRef(memberName)
  const saveSessionRef = useRef(saveSession)
  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => { memberIdRef.current = memberId }, [memberId])
  useEffect(() => { memberNameRef.current = memberName }, [memberName])
  useEffect(() => { saveSessionRef.current = saveSession }, [saveSession])

  // Save session when member switches (component unmounts due to key change in App)
  useEffect(() => {
    return () => {
      saveSessionRef.current(memberIdRef.current, memberNameRef.current, messagesRef.current)
    }
  }, [])

  const [pos, setPos] = useState(() => ({
    left: window.innerWidth  - defaultRight  - defaultWidth,
    top:  window.innerHeight - defaultBottom - defaultHeight,
  }))
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight })
  const windowRef = useRef<HTMLDivElement>(null)

  // Set to true on unmount so any in-progress async response is discarded (member switched)
  const cancelledRef = useRef(false)
  // Prevents showing the open-time message more than once per member instance
  const openMsgShownRef = useRef(false)
  // Saved window state - restored when FAB is re-expanded
  const savedFabStateRef = useRef<{ winState: WindowState; memberChatOpen: boolean; sukiOpen: boolean } | null>(null)

  useEffect(() => {
    cancelledRef.current = false
    // On unmount (member switch), cancel any in-flight response
    return () => { cancelledRef.current = true }
  }, [])

  /* ── Show confirmation or no-data message on first open ── */
  useEffect(() => {
    if (winState !== 'open' || openMsgShownRef.current) return
    openMsgShownRef.current = true

    if (!hasData) {
      // Restricted member: surface a clear no-data message, enforce restricted context
      setMessages([{
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `No clinical data is currently available for ${memberName} in Haven.\n\nPlease verify the member's record in GuidingCare before proceeding. Haven cannot answer clinical questions for this member until their data is available in the system.`,
        isError: true,
      }])
    } else if (switchConfirmation) {
      // Acknowledge the member switch
      setMessages([{
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: switchConfirmation,
      }])
    }
  }, [winState, hasData, memberName, switchConfirmation])

  /* ── Learn more ── */
  const handleLearnMore = useCallback(() => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: 'What does Haven have access to?' }
    const replyMsg: Message = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      content: `**I have access to:**\n• Member demographics\n• Clinical history\n• Care plan (goals, interventions)\n• Assessments\n• Eligibility\n• Care gaps\n• Claims data\n\n**I cannot help with:**\n• Clinical decisions or diagnosis\n• Systems outside this platform\n• Guaranteed accurate information, always verify yourself`,
    }
    setMessages(prev => [...prev, userMsg, replyMsg])
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setLearnMoreOpen(true)
  }, [])

  /* ── Send a message ── */
  const sendMessage = useCallback(async (text: string, _fromPresetPanel = false) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    cancelledRef.current = false
    setSkipWelcome(false)
    if (!_fromPresetPanel) setFromPresets(false)

    // No-data members: block queries and surface a clear message
    if (!hasData) {
      setMessages(prev => [...prev,
        { id: `u-${Date.now()}`, role: 'user', content: trimmed },
        {
          id: `a-${Date.now() + 1}`,
          role: 'assistant',
          content: `Haven does not have clinical data available for ${memberName}. Questions about this member cannot be answered until their record is available in the system.`,
          isError: true,
        },
      ])
      return
    }

    // If user says "yes", resolve against the last assistant message's follow-up query
    const isYes = /^yes[.!]?\s*$/i.test(trimmed)
    const lastFollowUpQuery = isYes
      ? [...messages].reverse().find(m => m.role === 'assistant' && m.followUpQuery)?.followUpQuery
      : undefined
    const resolvedText = lastFollowUpQuery ?? trimmed

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed }

    // ER discharge — detect free-text custom time entry after the custom time prompt
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant')
    const awaitingCustomErTime = lastAssistantMsg?.content?.includes('What date and time works for you?')
    if (awaitingCustomErTime && !resolvedText.startsWith('__')) {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      if (cancelledRef.current) return
      postToIframe({ type: 'HAVEN_ADD_ACTIVITY', activityType: 'Follow-up Call', contactType: 'Member - Phone', scheduledDate: resolvedText })
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `Follow-up call scheduled for ${firstName} on ${resolvedText}.\n\nI've added this to your activity list. A few things to confirm on the call:\n• Furosemide 40mg — confirm she filled and started the prescription\n• Daily weight log — she should alert her care team if she gains 2+ lbs in a day\n• Red flag symptoms — shortness of breath, swelling, or chest pain means go back to the ER\n• Cardiologist follow-up — confirm she has an appointment scheduled`,
        followUp: 'Would you like to do anything else to prep for this call?',
        followUpChips: [
          { label: 'Prepare me for the call', query: 'Prepare me for a follow-up call' },
          { label: "See Maria's medications", query: "What is Maria's current medication list?" },
          { label: "See Maria's care plan", query: "Review member's current care plan" },
        ],
      }])
      return
    }

    // Real backend: show typing indicator while awaiting the network call
    if (onSend) {
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      try {
        const reply = await onSend(resolvedText)
        if (cancelledRef.current) return
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          followUp: getFollowUp(resolvedText),
          followUpQuery: getFollowUpQuery(resolvedText),
        }])
      } finally {
        if (!cancelledRef.current) setLoading(false)
      }
      return
    }

    // Last update - early return with card
    if (/show me the last update/i.test(resolvedText)) {
      const lastUpdate = getLastUpdateData(memberName, mockMemberId)
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant' as const, content: '', lastUpdate }])
      return
    }

    // URAC checklist - early return with interactive card
    if (resolvedText.toLowerCase().includes('urac')) {
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here are the remaining tasks to complete for URAC compliance. Items already completed based on ${memberName.split(' ')[0]}'s record are checked off.`,
        uracChecklist: true,
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // "Prepare me for a member call" — return follow-up question with multiple choice
    if (/^prepare me for a member call$/i.test(resolvedText.trim())) {
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Is this your first outreach, an intake or a follow-up call?',
        followUpChips: [
          { label: 'First outreach', query: 'Prepare me for a first outreach call' },
          { label: 'Intake', query: 'Prepare me for an intake call' },
          { label: 'Follow-up call', query: 'Prepare me for a follow-up call' },
        ],
      }])
      return
    }

    // "Catch me up on member's care" — return follow-up question with multiple choice
    if (/^catch me up on member'?s care$/i.test(resolvedText.trim())) {
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: 'What do you want to focus on?',
        followUpChips: [
          { label: 'A care plan review', query: "Review member's current care plan" },
          { label: 'A recent ER visit or hospitalization', query: 'Catch me up on recent ER visits or hospitalizations' },
          { label: 'Overall activity and goals', query: 'Catch me up on overall activity and goals' },
        ],
      }])
      return
    }

    // "Help me with admin for this member" — return follow-up question with multiple choice
    if (/^help me with admin for this member$/i.test(resolvedText.trim())) {
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: 'What do you need?',
        followUpChips: [
          { label: 'A compliance audit', query: 'Help me with a compliance audit for this member' },
          { label: 'A handoff summary', query: 'Help me with a handoff summary for this member' },
          { label: 'Help with closing this case', query: 'Help me with closing this case' },
        ],
      }])
      return
    }

    // ER discharge follow-up scheduling flow
    if (/^schedule a follow-up call to review discharge plan$/i.test(resolvedText.trim())) {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `${firstName} was discharged on June 9th after an ER visit for fluid overload. Post-discharge protocol recommends a follow-up call within 72 hours to review her discharge plan, new Furosemide prescription, and daily weight monitoring.\n\nWhat do you want to cover on this call?`,
        followUpChips: [
          { label: 'Discharge instructions & Furosemide', query: '__ER_FOCUS__discharge instructions and the new Furosemide prescription' },
          { label: 'Daily weight monitoring', query: '__ER_FOCUS__daily weight monitoring and fluid management' },
          { label: 'Full discharge review', query: '__ER_FOCUS__a full discharge review including medications, weight monitoring, and red flag symptoms' },
        ],
      }])
      return
    }

    // ER discharge — focus selected, now recommend times
    if (resolvedText.startsWith('__ER_FOCUS__')) {
      const focus = resolvedText.slice('__ER_FOCUS__'.length)
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, { ...userMsg, content: focus }])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `Got it — I'll focus the call on ${focus}.\n\n${firstName}'s preferred contact time is mid-morning. Here are some available slots:\n\n• Thu, Jun 12 · 10:00 AM\n• Thu, Jun 12 · 11:30 AM\n• Fri, Jun 13 · 9:30 AM\n• Fri, Jun 13 · 10:30 AM\n\nWhich time works best, or enter your own?`,
        followUpChips: [
          { label: 'Thu Jun 12 · 10:00 AM', query: `__ER_SCHEDULE__Thu, Jun 12 at 10:00 AM__${focus}`, inlineRow: true },
          { label: 'Thu Jun 12 · 11:30 AM', query: `__ER_SCHEDULE__Thu, Jun 12 at 11:30 AM__${focus}`, inlineRow: true },
          { label: 'Fri Jun 13 · 9:30 AM', query: `__ER_SCHEDULE__Fri, Jun 13 at 9:30 AM__${focus}`, inlineRow: true },
          { label: 'Fri Jun 13 · 10:30 AM', query: `__ER_SCHEDULE__Fri, Jun 13 at 10:30 AM__${focus}`, inlineRow: true },
          { label: 'Choose my own time', query: '__ER_CUSTOM__' },
        ],
      }])
      return
    }

    // ER discharge — custom time prompt
    if (resolvedText === '__ER_CUSTOM__') {
      setMessages(prev => [...prev, { ...userMsg, content: 'Choose my own time' }])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: 'What date and time works for you? You can type it in any format, e.g. "Monday June 16 at 2pm".',
      }])
      return
    }

    // ER discharge — time confirmed (chip selection)
    if (resolvedText.startsWith('__ER_SCHEDULE__')) {
      const parts = resolvedText.slice('__ER_SCHEDULE__'.length).split('__')
      const time = parts[0]
      const focus = parts[1] ?? 'discharge plan review'
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, { ...userMsg, content: time }])
      setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      if (cancelledRef.current) return
      postToIframe({ type: 'HAVEN_ADD_ACTIVITY', activityType: 'Follow-up Call', contactType: 'Member - Phone', scheduledDate: time })
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `Follow-up call scheduled for ${firstName} on ${time}.\n\nFocus: ${focus}\n\nI've added this to your activity list. A few things to confirm on the call:\n• Furosemide 40mg — confirm she filled and started the prescription\n• Daily weight log — she should alert her care team if she gains 2+ lbs in a day\n• Red flag symptoms — shortness of breath, swelling, or chest pain means go back to the ER\n• Cardiologist follow-up — confirm she has an appointment scheduled`,
        followUp: 'Would you like to do anything else to prep for this call?',
        followUpChips: [
          { label: 'Prepare me for the call', query: 'Prepare me for a follow-up call' },
          { label: "See Maria's medications", query: "What is Maria's current medication list?" },
          { label: "See Maria's care plan", query: "Review member's current care plan" },
        ],
      }])
      return
    }

    // Care plan summary - early return with interactive card (Jackson / Henry only)
    const isCarePlanReview = /review.*care plan|care plan.*review|review.*member.*care|review.*current.*care/i.test(resolvedText)
    if (isCarePlanReview && mockMemberId === 'AH58319473') {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here's a summary of ${firstName}'s current plan of care. You can update status, priority, and target dates inline.`,
        carePlanSummary: true,
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // SMART goal - early return with interactive card
    const smartGoalData = resolvedText.toLowerCase().includes('smart goal')
      ? mockMemberId === 'AH58319473' ? JACKSON_SMART_GOAL
      : mockMemberId === 'AH72940158' ? MARIA_SMART_GOAL
      : null
      : null
    if (smartGoalData) {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here's a SMART goal based on ${firstName}'s current care plan. Review and edit each field, then add to the care plan.`,
        smartGoal: smartGoalData,
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // Care gaps - append follow-up chips to add each open gap to the care plan
    const isCareGapsQuery = /missing care gap|care gap|gaps in care|open gap/i.test(resolvedText)
    if (isCareGapsQuery) {
      const replyContent = getMockReply(resolvedText, memberName, mockMemberId)
      const openGaps = getOpenCareGaps(mockMemberId).slice(0, 3)
      const chips: FollowUpChip[] = openGaps.map(gap => ({
        label: `Add "${gap.opportunity}" to care plan`,
        query: `__ADD_CARE_GAP__${JSON.stringify({ opportunity: gap.opportunity, goal: gap.goal, category: gap.category })}`,
      }))
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: replyContent,
        followUpChips: chips,
      }])
      return
    }

    // Add gap to care plan - post to CWF and confirm
    if (resolvedText.startsWith('__ADD_CARE_GAP__')) {
      const gap = JSON.parse(resolvedText.slice('__ADD_CARE_GAP__'.length)) as { opportunity: string; goal: string; category: string }
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, { ...userMsg, content: `Add "${gap.opportunity}" to care plan` }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      postToIframe({ type: 'HAVEN_ADD_CARE_GAP', opportunity: gap.opportunity, goal: gap.goal, category: gap.category })
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `"${gap.opportunity}" has been added to ${firstName}'s care plan.`,
      }])
      return
    }

    // Preset prompt card routing — intercept specific queries and return rich cards
    const closeMenus = () => { setMenuOpen(false); setSummarizeMenuOpen(false); setComplianceMenuOpen(false); setDocumentMenuOpen(false); setLearnMoreOpen(false) }
    const q = resolvedText.toLowerCase().trim()
    const firstName = memberName.split(' ')[0]

    type CardKey = 'preCallBriefCard' | 'medicationsCard' | 'contactHistoryCard' | 'ogiCard' | 'careGapsCard' | 'conditionsCard' | 'authorizationsCard' | 'assessmentsCard' | 'eligibilityCard' | 'riskLevelCard' | 'outstandingActivitiesCard'
    type CardEntry = { key: CardKey; data: unknown; summary: string }

    let cardEntry: CardEntry | null = null

    if (/prepare.*call|pre.?call brief|first outreach|member call/i.test(q)) {
      const data = getPreCallBriefCardData(firstName, mockMemberId ?? '')
      setMessages(prev => [...prev, userMsg])
      closeMenus()
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `Here's a summary of what you might need for a first outreach call.`,
        preCallBriefCard: data,
        followUp: 'Would you like to see more?',
        followUpChips: [
          { label: 'Health history', query: `What are ${firstName}'s current conditions and diagnoses?`, inlineRow: true },
          { label: 'New conditions', query: `What are ${firstName}'s new conditions and clinical changes?`, inlineRow: true },
          { label: 'Care gaps', query: `Are there any care gaps for ${firstName}?`, inlineRow: true },
          { label: 'Recent authorizations', query: `Show me ${firstName}'s authorization and claims history`, inlineRow: true },
          { label: 'OGIs', query: `What are ${firstName}'s current OGIs?`, inlineRow: true },
          { label: 'Claims, approvals & denials', query: `Show me ${firstName}'s authorization and claims history`, inlineRow: true },
          { label: 'Preferences', query: `Show me ${firstName}'s last contact and interaction history`, inlineRow: true },
          { label: 'Last member record update', query: `Show me ${firstName}'s last contact and interaction history`, inlineRow: true },
        ],
      }])
      return
    } else if (/medication|med list|current medication|meds/i.test(q) && !/allerg|prior auth/i.test(q)) {
      const data = getMedicationsCardData(firstName, mockMemberId ?? '')
      const active = data.medications.filter(m => m.isCurrent).length
      cardEntry = { key: 'medicationsCard', data, summary: `Here are ${firstName}'s medications — ${active} active.` }
    } else if (/last contact|contact.*history|interaction history|outreach history|when did we last|last call/i.test(q)) {
      const data = getContactHistoryCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'contactHistoryCard', data, summary: `Here's ${firstName}'s contact and interaction history.` }
    } else if (/\bogi\b|opportunity.*goal|goal.*intervention|current ogi|recommended ogi/i.test(q)) {
      const data = getOGICardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'ogiCard', data, summary: `Here are ${firstName}'s current and recommended OGIs.` }
    } else if (/care gap|gaps in care|open gap|hedis|missing.*screening/i.test(q) && !/add.*care gap/i.test(q)) {
      const data = getCareGapsCardData(firstName, mockMemberId ?? '')
      const openCount = data.gaps.filter(g => g.opportunityStatus === 'Open').length
      cardEntry = { key: 'careGapsCard', data, summary: `${firstName} has ${openCount} open care gap${openCount !== 1 ? 's' : ''} for the current measurement year.` }
    } else if (/diagnos|condition|new condition|clinical change|problem list/i.test(q) && !/care plan/i.test(q)) {
      const data = getConditionsCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'conditionsCard', data, summary: `Here are ${firstName}'s current diagnoses and clinical conditions.` }
    } else if (/authorization|claim|visit history|encounter|service history/i.test(q) && !/prior auth/i.test(q)) {
      const data = getAuthorizationsCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'authorizationsCard', data, summary: `Here's ${firstName}'s authorization and claims history.` }
    } else if (/assessment|hra|health risk|ltss|phq|screening|script/i.test(q) && !/smart goal/i.test(q)) {
      const data = getAssessmentsCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'assessmentsCard', data, summary: `Here are ${firstName}'s completed assessments.` }
    } else if (/eligib|coverage|insurance|active coverage|current.*eligib/i.test(q)) {
      const data = getEligibilityCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'eligibilityCard', data, summary: `Here's ${firstName}'s current eligibility and coverage.` }
    } else if (/risk level|risk score|risk tier|risk stratif|current risk/i.test(q)) {
      const data = getRiskLevelCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'riskLevelCard', data, summary: `Here's ${firstName}'s current risk level and stratification.` }
    } else if (/outstanding activit|pending activit|activities.*due|what activities/i.test(q)) {
      const data = getOutstandingActivitiesCardData(firstName, mockMemberId ?? '')
      cardEntry = { key: 'outstandingActivitiesCard', data, summary: `Here are ${firstName}'s outstanding activities.` }
    }

    if (cardEntry) {
      const { key, data, summary } = cardEntry
      setMessages(prev => [...prev, userMsg])
      closeMenus()
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: summary,
        [key]: data,
      }])
      return
    }

    // Mock path: show typing indicator briefly before resolving
    const guardrail = getGuardrailMessage(resolvedText)
    const replyContent = guardrail ?? getMockReply(resolvedText, memberName, mockMemberId)
    setMessages(prev => [...prev, userMsg])
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setLearnMoreOpen(false)
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    setLoading(false)
    if (cancelledRef.current) return
    setMessages(prev => [...prev, {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: replyContent,
      followUp: guardrail ? undefined : getFollowUp(resolvedText),
      followUpQuery: guardrail ? undefined : getFollowUpQuery(resolvedText),
    }])
  }, [loading, hasData, memberName, memberId, mockMemberId, onSend, messages])

  /* ── Geometry ref — single source of truth during gestures ── */
  // We keep a mutable ref that mirrors pos/size. During drag/resize we mutate ONLY
  // the ref and write directly to the DOM — no setState, no React re-render mid-gesture.
  // On mouseUp we commit to state so React re-renders with the final position.
  const geo = useRef({ left: 0, top: 0, w: defaultWidth, h: defaultHeight })

  // Sync geo ref whenever React state settles (mount / mouseUp)
  useLayoutEffect(() => { geo.current.left = pos.left; geo.current.top = pos.top }, [pos])
  useLayoutEffect(() => { geo.current.w = size.w; geo.current.h = size.h }, [size])

  // Move-only: transform is compositor-only — zero layout, zero paint.
  const applyPos = useCallback(() => {
    const el = windowRef.current
    if (!el) return
    el.style.transform = `translate(${geo.current.left}px,${geo.current.top}px)`
  }, [])

  // Full geometry: also sets width/height (triggers layout — use only at rest or during resize).
  const applyGeo = useCallback((minimized: boolean) => {
    const el = windowRef.current
    if (!el) return
    el.style.transform = `translate(${geo.current.left}px,${geo.current.top}px)`
    el.style.width     = `${geo.current.w}px`
    el.style.height    = minimized ? '28px' : `${geo.current.h}px`
  }, [])

  // After every render, re-apply geo so React never clobbers our direct DOM writes
  useLayoutEffect(() => { applyGeo(winState === 'minimized') })

  /* Clamp window back into viewport whenever the browser is resized */
  useEffect(() => {
    const onResize = () => {
      setPos(p => ({
        left: Math.max(0, Math.min(window.innerWidth  - geo.current.w,  p.left)),
        top:  Math.max(0, Math.min(window.innerHeight - 28, p.top)),
      }))
      setSize(s => ({
        w: Math.min(s.w, window.innerWidth),
        h: Math.min(s.h, window.innerHeight - 28),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── Drag ── */
  const dragState = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null)

  const onChromeMouseDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragState.current = {
      startX: e.clientX, startY: e.clientY,
      startLeft: geo.current.left, startTop: geo.current.top,
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const d = dragState.current
      if (!d || !windowRef.current) return
      const maxLeft = window.innerWidth  - geo.current.w
      const maxTop  = window.innerHeight - 28
      geo.current.left = Math.max(0, Math.min(maxLeft, d.startLeft + (e.clientX - d.startX)))
      geo.current.top  = Math.max(0, Math.min(maxTop,  d.startTop  + (e.clientY - d.startY)))
      applyPos()
    }
    const onMouseUp = (e: MouseEvent) => {
      if (!dragState.current) return
      const d = dragState.current
      dragState.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      const maxLeft = window.innerWidth  - geo.current.w
      const maxTop  = window.innerHeight - 28
      setPos({
        left: Math.max(0, Math.min(maxLeft, d.startLeft + (e.clientX - d.startX))),
        top:  Math.max(0, Math.min(maxTop,  d.startTop  + (e.clientY - d.startY))),
      })
    }
    document.addEventListener('pointermove', onMouseMove)
    document.addEventListener('pointerup',   onMouseUp)
    return () => {
      document.removeEventListener('pointermove', onMouseMove)
      document.removeEventListener('pointerup',   onMouseUp)
    }
  }, [applyPos])

  /* ── Resize ── */
  const resizeState = useRef<{
    dir: ResizeDir
    startX: number; startY: number
    startLeft: number; startTop: number
    startW: number; startH: number
  } | null>(null)

  const onResizeMouseDown = useCallback((dir: ResizeDir) => (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    resizeState.current = {
      dir,
      startX: e.clientX, startY: e.clientY,
      startLeft: geo.current.left, startTop: geo.current.top,
      startW: geo.current.w,       startH: geo.current.h,
    }
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const calcResize = (clientX: number, clientY: number) => {
      const r = resizeState.current
      if (!r) return null
      const dx = clientX - r.startX
      const dy = clientY - r.startY
      let newLeft = r.startLeft, newTop = r.startTop, newW = r.startW, newH = r.startH

      if (r.dir.includes('e')) {
        newW = Math.max(MIN_W, Math.min(r.startW + dx, window.innerWidth - r.startLeft))
      }
      if (r.dir.includes('s')) {
        newH = Math.max(MIN_H, Math.min(r.startH + dy, window.innerHeight - 28 - r.startTop))
      }
      if (r.dir.includes('w')) {
        const rawW = r.startW - dx
        newW    = Math.max(MIN_W, rawW)
        newLeft = Math.max(0, r.startLeft + r.startW - newW)
        newW    = r.startLeft + r.startW - newLeft   // recompute after clamping left
      }
      if (r.dir.includes('n')) {
        const rawH = r.startH - dy
        newH    = Math.max(MIN_H, rawH)
        newTop  = Math.max(0, r.startTop + r.startH - newH)
        newH    = r.startTop + r.startH - newTop     // recompute after clamping top
      }
      return { newLeft, newTop, newW, newH }
    }

    const onMouseMove = (e: MouseEvent) => {
      const v = calcResize(e.clientX, e.clientY)
      if (!v || !windowRef.current) return
      geo.current.left = v.newLeft
      geo.current.top  = v.newTop
      geo.current.w    = v.newW
      geo.current.h    = v.newH
      const el = windowRef.current
      el.style.transform = `translate(${v.newLeft}px,${v.newTop}px)`
      el.style.width     = `${v.newW}px`
      el.style.height    = `${v.newH}px`
    }
    const onMouseUp = (e: MouseEvent) => {
      const v = calcResize(e.clientX, e.clientY)
      resizeState.current = null
      document.body.style.userSelect = ''
      if (v) {
        setPos({ left: v.newLeft, top: v.newTop })
        setSize({ w: v.newW, h: v.newH })
      }
    }
    document.addEventListener('pointermove', onMouseMove)
    document.addEventListener('pointerup',   onMouseUp)
    return () => {
      document.removeEventListener('pointermove', onMouseMove)
      document.removeEventListener('pointerup',   onMouseUp)
    }
  }, [])

  /* ── Window controls ── */
  const handleClose    = () => {
    saveSession(memberId, memberName, messages)
    setWinState('closed')
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setMessages([])
  }
  const handleMinimize = () => setWinState(s => s === 'minimized' ? 'open' : 'minimized')
  const handleMaximize = () => { if (winState === 'minimized') setWinState('open') }

  const openWindow = useCallback(() => {
    setPos({ left: window.innerWidth - defaultRight - defaultWidth, top: window.innerHeight - defaultBottom - defaultHeight })
    setWinState('open')
  }, [defaultRight, defaultWidth, defaultBottom, defaultHeight])

  const openMemberChat = useCallback(() => {
    setMemberChatOpen(true)
  }, [])

  const handleActivityAdded = useCallback((config: ActivityConfig, _destination: 'activities' | 'care-plan') => {
    postToIframe({ type: 'HAVEN_ADD_ACTIVITY', activityType: config.activityType, contactType: config.contactType })
  }, [])

  // Bottom edge of the Haven window (px from viewport top) - used to align MemberChatWindow
  const havenBottomY = pos.top + size.h

  const memberChat = !isHome && memberChatOpen ? (
    <MemberChatWindow
      memberName={memberName}
      memberKey={memberId}
      onClose={() => setMemberChatOpen(false)}
      havenBottomY={havenBottomY}
      zIndex={sukiOpen ? 800 : undefined}
    />
  ) : null

  /* ── FAB minimize / expand ── */
  const minimizeFab = useCallback(() => {
    savedFabStateRef.current = { winState, memberChatOpen, sukiOpen }
    setWinState('closed')
    setMemberChatOpen(false)
    setSukiOpen(false)
    setFabExpanded(false)
  }, [winState, memberChatOpen, sukiOpen])

  const expandFab = useCallback(() => {
    if (savedFabStateRef.current) {
      const { winState: sw, memberChatOpen: sm, sukiOpen: ss } = savedFabStateRef.current
      setWinState(sw)
      setMemberChatOpen(sm)
      setSukiOpen(ss)
    }
    setFabExpanded(true)
  }, [])

  // ── FAB - always rendered ──
  const fabStyle: React.CSSProperties = sukiOpen ? { zIndex: 800 } : {}

  const fab = isHome ? (
    <div className={styles.fabCard}>
      <button className={winState === 'closed' ? styles.fabHavenFilled : styles.fabHaven} onClick={openWindow} type="button" aria-label="Open Haven AI assistant">
        <Icon name="AutoAwesome" size="md" color={winState === 'closed' ? 'inverse' : 'primary'} />
        Haven
      </button>
    </div>
  ) : !fabExpanded ? (
    <button
      className={styles.fabMinimized}
      style={fabStyle}
      onClick={expandFab}
      type="button"
      aria-label="Expand"
    >
      <img src={chevronForwardIcon} width={29} height={29} alt="" aria-hidden="true" className={styles.fabChevronMin} style={{ transform: 'rotate(180deg)' }} />
    </button>
  ) : (
    <div className={styles.fabCard} style={fabStyle}>
      <button
        className={styles.fabChevronBtn}
        onClick={minimizeFab}
        type="button"
        aria-label="Minimize"
      >
        <img src={chevronForwardIcon} width={29} height={29} alt="" aria-hidden="true" className={styles.fabChevron} />
      </button>
      <div className={styles.fabDivider} />
      <button className={styles.fabMember} onClick={openMemberChat} type="button" aria-label={`Message ${memberName}`}>
        <img src={chatIcon} width={33} height={33} alt="" aria-hidden="true" />
        <span className={styles.fabMemberName}>{memberName}</span>
      </button>
      <div className={styles.fabDivider} />
      <button className={winState === 'closed' ? styles.fabHavenFilled : styles.fabHaven} onClick={openWindow} type="button" aria-label="Open Haven AI assistant">
        <Icon name="AutoAwesome" size="md" color={winState === 'closed' ? 'inverse' : 'primary'} />
        Haven
      </button>
    </div>
  )

  const sukiNode = sukiOpen && !isHome ? (
    <SukiWindow
      onClose={() => { setSukiOpen(false); setAlertTaskLabels({}); setExpandedAlertId(null) }}
      onNoteSent={() => {
        setSukiOpen(false)
        setCallInsightsOpen(true)
        openMsgShownRef.current = true
        setWinState('open')
      }}
      onAlert={(alert) => {
        setLiveAlerts(prev => prev.some(a => a.id === alert.id) ? prev : [...prev, alert])
      }}
      memberName={memberName}
      memberId={memberId}
      phone={phone}
      pcp={pcp}
      age={age}
      gender={gender}
      dob={dob}
      havenLeft={pos.left}
      havenTop={pos.top}
    />
  ) : null

  if (winState === 'closed') {
    return (
      <>
        {memberChat}
        {fab}
        {sukiNode}
      </>
    )
  }

  const isMinimized = winState === 'minimized'
  // Geometry (left/top/width/height) is owned exclusively by applyGeo() via useLayoutEffect.
  // windowStyle only carries non-geometry properties so React never clobbers our DOM writes.
  const windowStyle: React.CSSProperties = {
    ...(sukiOpen ? { zIndex: 800, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, transition: 'border-radius 0.18s ease' } : { transition: 'border-radius 0.18s ease' }),
  }

  const hasMessages = messages.length > 0 || loading

  return (
    <>
    {memberChat}
    {fab}
    {sukiNode}
    <div ref={windowRef} className={styles.window} style={{ ...windowStyle, '--font-family-base': previewFont ?? FONT_MAP[settings.fontStyle] } as React.CSSProperties} role="dialog" aria-label="Haven AI assistant" aria-modal="false">
      {/* Resize handles */}
      {!isMinimized && (
        <>
          <div className={styles.resizeN}  onPointerDown={onResizeMouseDown('n')}  />
          <div className={styles.resizeS}  onPointerDown={onResizeMouseDown('s')}  />
          <div className={styles.resizeE}  onPointerDown={onResizeMouseDown('e')}  />
          <div className={styles.resizeW}  onPointerDown={onResizeMouseDown('w')}  />
          <div className={styles.resizeNE} onPointerDown={onResizeMouseDown('ne')} />
          <div className={styles.resizeNW} onPointerDown={onResizeMouseDown('nw')} />
          <div className={styles.resizeSE} onPointerDown={onResizeMouseDown('se')} />
          <div className={styles.resizeSW} onPointerDown={onResizeMouseDown('sw')} />
        </>
      )}

      {/* Chrome bar */}
      <div className={styles.chrome} onPointerDown={onChromeMouseDown}>
        <div className={styles.trafficLights}>
          <button className={`${styles.trafficBtn} ${styles.btnClose}`}  onClick={handleClose}    type="button" aria-label="Close"    title="Close"    />
          <button className={`${styles.trafficBtn} ${styles.btnMin}`}    onClick={handleMinimize} type="button" aria-label={isMinimized ? 'Restore' : 'Minimize'} title={isMinimized ? 'Restore' : 'Minimize'} />
          <button className={`${styles.trafficBtn} ${styles.btnMax}`}    onClick={handleMaximize} type="button" aria-label="Maximize"  title="Maximize"  />
        </div>
        <span className={styles.chromeTitle}>Haven</span>
      </div>

      {/* Window body */}
      {!isMinimized && (
        <div className={styles.body}>
          {!isHome && <MemberHeader memberName={memberName} phone={phone} memberId={memberId} pcp={pcp} onSukiClick={() => setSukiOpen(true)} onPresetsClick={() => setPresetsOpen(true)} onHistoryClick={() => setHistoryOpen(true)} />}

          <div className={panelStyles.chatArea}>
            {/* Back button - learn more only */}
            {learnMoreOpen && (
              <button
                type="button"
                className={panelStyles.backBtn}
                onClick={() => { setMessages([]); setLearnMoreOpen(false) }}
                aria-label="Back"
              >
                <Icon name="ArrowBack" size="sm" sx={{ color: '#1B456F' }} />
                Back
              </button>
            )}

            {/* Back button - from preset prompt */}
            {fromPresets && !learnMoreOpen && (
              <button
                type="button"
                className={panelStyles.backBtn}
                onClick={() => { setMessages([]); setFromPresets(false); setPresetsOpen(true) }}
                aria-label="Back to prompts"
              >
                <Icon name="ArrowBack" size="sm" sx={{ color: '#1B456F' }} />
                Back
              </button>
            )}

            {/* Scroll area */}
            <div className={panelStyles.chatScroll}>
              {/* Live call alerts from Suki - only shown after the call ends */}
              {liveAlerts.length > 0 && !isHome && !sukiOpen && !callInsightsOpen && (() => {
                // All tasks added across every alert (keyed by alertId:idx)
                const allAddedEntries = liveAlerts.flatMap(a => {
                  const labels = alertTaskLabels[a.id] ?? a.tasks
                  return labels
                    .map((label, idx) => ({ alertId: a.id, task: label, taskKey: `${a.id}:${idx}` }))
                    .filter(({ taskKey }) => addedAlertTasks.has(taskKey))
                })
                const hasAdded = allAddedEntries.length > 0

                if (alertTaskView === 'unified') {
                  return (
                    <div className={panelStyles.insightsWrap}>
                      <div className={panelStyles.liveAlertStack}>
                        <div className={panelStyles.liveAlertTaskListCard}>
                          <div className={panelStyles.liveAlertTaskListHeader}>
                            <button type="button" className={panelStyles.liveAlertBackBtn} onClick={() => setAlertTaskView(null)}>
                              <Icon name="ArrowBack" size="xs" color="action" />
                            </button>
                            <Icon name="TaskAlt" size="sm" color="primary" />
                            <span className={panelStyles.liveAlertTaskListTitle}>Task List</span>
                          </div>
                          <div className={panelStyles.liveAlertTasks}>
                            {allAddedEntries.map(({ alertId, task, taskKey }) => {
                              const isDone = doneAlertTasks.has(taskKey)
                              return (
                                <div key={taskKey} className={`${panelStyles.liveAlertTask} ${isDone ? panelStyles.liveAlertTaskDone : ''}`}>
                                  <span className={panelStyles.liveAlertTaskIcon}>
                                    <Icon name={isDone ? 'CheckCircle' : 'RadioButtonUnchecked'} size="md" color={isDone ? 'success' : 'action'} />
                                  </span>
                                  <button
                                    type="button"
                                    className={`${panelStyles.liveAlertTaskLink}${isDone ? ` ${panelStyles.liveAlertTaskLinkDone}` : ''}`}
                                    onClick={() => setOpenAlertModal({ alertId, taskIdx: parseInt(taskKey.split(':')[1]), task })}
                                  >
                                    {task}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className={panelStyles.insightsWrap}>
                    <div className={panelStyles.liveAlertStack}>
                    {liveAlerts.map(alert => {
                      const labels = alertTaskLabels[alert.id] ?? alert.tasks
                      return (
                        <Alert
                          key={alert.id}
                          severity="warning"
                          title={alert.label}
                          onClose={() => {
                            setLiveAlerts(prev => prev.filter(a => a.id !== alert.id))
                            if (expandedAlertId === alert.id) setExpandedAlertId(null)
                          }}
                          action={
                            expandedAlertId === alert.id ? (
                              <div className={panelStyles.liveAlertExpanded}>
                                <p className={panelStyles.liveAlertDetail}>{alert.detail}</p>
                                <div className={panelStyles.liveAlertTasks}>
                                  {labels.map((label, idx) => {
                                    const taskKey = `${alert.id}:${idx}`
                                    const added = addedAlertTasks.has(taskKey)
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={`${panelStyles.liveAlertTask}${added ? ` ${panelStyles.liveAlertTaskAdded}` : ''}`}
                                        onClick={() => setAddedAlertTasks(prev => {
                                          const next = new Set(prev)
                                          added ? next.delete(taskKey) : next.add(taskKey)
                                          return next
                                        })}
                                      >
                                        <input
                                          className={panelStyles.liveAlertTaskInput}
                                          type="text"
                                          value={label}
                                          placeholder="Describe the task…"
                                          aria-label={`Task ${idx + 1}`}
                                          onClick={e => e.stopPropagation()}
                                          onChange={e => {
                                            e.stopPropagation()
                                            setAlertTaskLabels(prev => {
                                              const updated = [...(prev[alert.id] ?? alert.tasks)]
                                              updated[idx] = e.target.value
                                              return { ...prev, [alert.id]: updated }
                                            })
                                          }}
                                        />
                                        <span
                                          className={`${panelStyles.liveAlertTaskAddBtn}${added ? ` ${panelStyles.liveAlertTaskAddBtnAdded}` : ''}`}
                                          aria-hidden="true"
                                        >
                                          {added ? '✓' : '+'}
                                        </span>
                                      </button>
                                    )
                                  })}
                                  <button
                                    type="button"
                                    className={panelStyles.liveAlertAddTaskBtn}
                                    onClick={() => setAlertTaskLabels(prev => ({
                                      ...prev,
                                      [alert.id]: [...(prev[alert.id] ?? alert.tasks), ''],
                                    }))}
                                  >
                                    <Icon name="AddCircleOutline" size="sm" color="primary" />
                                    Add your own task
                                  </button>
                                </div>
                                <button type="button" className={panelStyles.liveAlertCollapseBtn} onClick={() => setExpandedAlertId(null)}>Hide actions</button>
                              </div>
                            ) : (
                              <button type="button" className={panelStyles.liveAlertReviewBtn} onClick={() => setExpandedAlertId(alert.id)}>
                                Review actions
                              </button>
                            )
                          }
                        />
                      )
                    })}
                    {hasAdded && (
                      <button type="button" className={panelStyles.liveAlertFinishBtn} onClick={() => setAlertTaskView('unified')}>
                        <Icon name="TaskAlt" size="sm" color="inherit" />
                        View Task List ({allAddedEntries.length})
                      </button>
                    )}
                    </div>
                  </div>
                )
              })()}
              {openAlertModal && (() => {
                const taskKey = `${openAlertModal.alertId}:${openAlertModal.taskIdx}`
                const activityConfig: ActivityConfig = {
                  title: 'Add Activity',
                  activityType: 'Follow-up',
                  contactType: 'Member - Phone',
                  scheduledDate: '',
                }
                return (
                  <AddActivityModal
                    config={activityConfig}
                    memberName={memberName}
                    onClose={() => setOpenAlertModal(null)}
                    onAdd={() => {
                      setDoneAlertTasks(prev => new Set(prev).add(taskKey))
                      handleActivityAdded(activityConfig, 'activities')
                      setOpenAlertModal(null)
                    }}
                  />
                )
              })()}
              {callInsightsOpen && !isHome && (
                <div className={panelStyles.insightsWrap}>
                  <CallInsightsCard
                    memberFirstName={memberName.split(' ')[0]}
                    memberName={memberName}
                    alerts={liveAlerts}
                    onDismiss={() => { setCallInsightsOpen(false); setLiveAlerts([]) }}
                  />
                </div>
              )}
              {sukiActionsReady && !isHome && (
                <RecommendedActionsCard
                  memberName={memberName}
                  onDismiss={() => setSukiActionsReady(false)}
                  onActivityAdded={handleActivityAdded}
                  onNavigate={(dest) => {
                    postToIframe({ type: dest === 'activities' ? 'HAVEN_NAVIGATE_OUTSTANDING' : 'HAVEN_NAVIGATE_CARE_PLAN' })
                  }}
                />
              )}
              {hasMessages ? (
                <ChatMessages
                  messages={messages}
                  loading={loading}
                  onGoalAdded={(payload) => {
                    postToIframe({ type: 'HAVEN_ADD_SMART_GOAL', ...payload })
                  }}
                  onFollowUpChip={(query) => sendMessage(query)}
                  onNavigateNote={() => postToIframe({ type: 'HAVEN_NAVIGATE_NOTES' })}
                  onNavigateActivity={() => postToIframe({ type: 'HAVEN_NAVIGATE_OUTSTANDING' })}
                />
              ) : (
                !skipWelcome && !sukiActionsReady && liveAlerts.length === 0 && !callInsightsOpen && (
                  <div className={panelStyles.welcomeWrap}>
                    {isHome
                      ? <HomeWelcome onPrompt={sendMessage} onPresetsClick={() => setPresetsOpen(true)} day={day} />
                      : mockMemberId === 'AH0000023'
                        ? <MariaTodaysTasks onPrompt={sendMessage} />
                        : <ChatWelcome onMemberDetails={() => setMenuOpen(true)} onSummarizeMenu={() => setSummarizeMenuOpen(true)} language={settings.language} />
                    }
                  </div>
                )
              )}
            </div>

            {/* Member detail menu - floats above input bar (member view only) */}
            {!isHome && menuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setMenuOpen(false)} aria-label="Close">
                  <Icon name="Close" size="sm" color="action" />
                  Close
                </button>
                <div className={panelStyles.menuCard}>
                  <MemberDetailMenu onClose={() => setMenuOpen(false)} onSelect={sendMessage} memberId={memberId} />
                </div>
              </div>
            )}

            {/* Summarize menu - floats above input bar (member view only) */}
            {!isHome && summarizeMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setSummarizeMenuOpen(false)} aria-label="Close">
                  <Icon name="Close" size="sm" color="action" />
                  Close
                </button>
                <div className={panelStyles.menuCard}>
                  <SummarizeMenu onClose={() => setSummarizeMenuOpen(false)} onSelect={sendMessage} />
                </div>
              </div>
            )}

            {/* Compliance menu - floats above input bar (member view only) */}
            {!isHome && complianceMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setComplianceMenuOpen(false)} aria-label="Close">
                  <Icon name="Close" size="sm" color="action" />
                  Close
                </button>
                <div className={panelStyles.menuCard}>
                  <ComplianceMenu onClose={() => setComplianceMenuOpen(false)} onSelect={sendMessage} memberId={memberId} />
                </div>
              </div>
            )}

            {/* Document menu - floats above input bar (member view only) */}
            {!isHome && documentMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setDocumentMenuOpen(false)} aria-label="Close">
                  <Icon name="Close" size="sm" color="action" />
                  Close
                </button>
                <div className={panelStyles.menuCard}>
                  <DocumentMenu onClose={() => setDocumentMenuOpen(false)} onSelect={sendMessage} />
                </div>
              </div>
            )}

            {/* Input + disclaimer */}
            <div className={panelStyles.bottom}>
              <AskHavenInput onSubmit={sendMessage} language={settings.language} />
              <p className={panelStyles.disclaimer}>
                Once closed, a chat can't be continued.{' '}
                Check your responses for accuracy.{' '}
                <button type="button" className={panelStyles.disclaimerLink} onClick={handleLearnMore}>
                  What this assistant has access to
                </button>
              </p>
            </div>
          </div>

          {/* Preset prompts panel */}
          {presetsOpen && (
            <PresetPromptsPanel
              onClose={() => setPresetsOpen(false)}
              onSelectPrompt={(text) => { sendMessage(text, true); setPresetsOpen(false); setFromPresets(true) }}
              memberName={memberName}
              memberId={memberId}
              language={settings.language}
            />
          )}

          {/* Chat history drawer - covers entire body including member header */}
          {historyOpen && !isHome && (
            <ChatHistoryDrawer
              sessions={historySessions}
              onClose={() => setHistoryOpen(false)}
              onSelectSession={(msgs, id) => { currentSessionId.current = id; setMessages(msgs); setLearnMoreOpen(false); setSkipWelcome(false) }}
              onNewConversation={() => {
                currentSessionId.current = `session-${Date.now()}`
                setMessages([])
                setLearnMoreOpen(false)
                setFromPresets(false)
                setSkipWelcome(true)
              }}
              onDelete={(id) => { deleteSession(id); refreshHistory() }}
              onToggleFavorite={(id) => { toggleFavorite(id); refreshHistory() }}
              onClearHistory={() => { clearAllForMember(memberId); refreshHistory() }}
              onLearnMore={handleLearnMore}
              onOpenSettings={() => { setHistoryOpen(false); setSettingsOpen(true) }}
              language={settings.language}
            />
          )}

          {/* Settings - full page overlay */}
          {settingsOpen && (
            <SettingsPanel
              settings={settings}
              onUpdate={(patch) => { updateSettings(patch); if (patch.fontStyle) setPreviewFont(FONT_MAP[patch.fontStyle]) }}
              onBack={() => { setSettingsOpen(false); setPreviewFont(FONT_MAP[settings.fontStyle]) }}
              onFontPreview={(fontStyle) => setPreviewFont(FONT_MAP[fontStyle])}
              language={settings.language}
            />
          )}
        </div>
      )}
    </div>
    </>
  )
}
