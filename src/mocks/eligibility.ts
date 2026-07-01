/**
 * Mock response for /v2/Member/Eligibility
 * Member: Jackson Lee Thomas (AH58319473)
 */

export interface EligibilityRecord {
  level: number
  code: string
  desc: string
}

export interface EligibilityAdditionalIdentifier {
  identifierName: string
  identifierValue: string
}

export interface EligibilityEntry {
  lobBenID: number
  uniqueEligibilityID: string
  eligiblityRecords: EligibilityRecord[]
  startDate: string
  endDate: string
  status: string
  eligibilityPath: string
  planType: string
  additionalIdentifiers: EligibilityAdditionalIdentifier[]
}

export interface MemberEligibility {
  memberFirstName: string
  memberMiddleName: string
  memberLastName: string
  gender: string
  memberDOB: string
  clientPatientId: string
  medicareID: string
  eligibilities: EligibilityEntry[]
}

export const mockEligibility: MemberEligibility = {
  memberFirstName: 'Jackson',
  memberMiddleName: 'Lee',
  memberLastName: 'Thomas',
  gender: 'M',
  memberDOB: '1971-03-14T00:00:00.000Z',
  clientPatientId: 'AH58319473',
  medicareID: '',
  eligibilities: [
    {
      lobBenID: 1,
      uniqueEligibilityID: 'eligibility-AH58319473-20260101',
      eligiblityRecords: [
        { level: 1, code: 'AMB', desc: 'Ambetter Health' },
        { level: 2, code: 'TN', desc: 'Tennessee' },
        { level: 3, code: 'SLV', desc: 'Ambetter Enhanced Care (Silver)' },
      ],
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'Active',
      eligibilityPath: 'Ambetter Health (AMB) >> Tennessee (TN) >> Ambetter Enhanced Care Silver (SLV)',
      planType: 'Commercial',
      additionalIdentifiers: [
        { identifierName: 'Plan_Type', identifierValue: 'Commercial' },
        { identifierName: 'SUBSCRIBER_NO', identifierValue: 'SUB-583194' },
      ],
    },
  ],
}
