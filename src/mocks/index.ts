/**
 * Haven mock data — Henry Tom Garcia (AH0000007)
 *
 * Each export mirrors the shape of the corresponding HealthEdge API response.
 * Swap these imports for real API calls when integrating with a live backend.
 *
 * APIs covered:
 *   /v2/Member/Detail             → mockMemberDetail
 *   /v2/Member/Eligibility        → mockEligibility
 *   /v2/ActivitySummary/Script    → mockActivitySummary
 *   /v2/Assessment/Submission/:id → mockAssessmentSubmissions
 *   /v2/Member/Medication/Manual  → mockMedications
 *   /v2/Member/Diagnosis          → mockDiagnosis
 *   /v2/Member/CarePlan           → mockCarePlan
 *   Programs (batch)              → mockPrograms
 *   Gaps In Care (batch)          → mockGapsInCare
 *   Visits / Claims               → mockVisits
 */

export { mockMemberDetail } from './memberDetail'
export type { MemberDetail, Phone, Address, AdditionalIdentifier, FamilyMember } from './memberDetail'

export { mockEligibility } from './eligibility'
export type { MemberEligibility, EligibilityEntry, EligibilityRecord } from './eligibility'

export { mockActivitySummary, mockAssessmentSubmissions } from './assessments'
export type { ScriptSummary, AssessmentSubmission, AssessmentQuestion } from './assessments'

export { mockMedications } from './medications'
export type { Medication } from './medications'

export { mockDiagnosis } from './diagnosis'
export type { Diagnosis } from './diagnosis'

export { mockCarePlan } from './carePlan'
export type { CarePlanItem, CarePlanBarrier, CarePlanStrength } from './carePlan'

export { mockPrograms } from './programs'
export type { Program, ProgramActivity } from './programs'

export { mockGapsInCare } from './gapsInCare'
export type { GapInCare } from './gapsInCare'

export { mockVisits } from './visits'
export type { Visit } from './visits'
