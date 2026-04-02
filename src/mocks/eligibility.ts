/**
 * Mock response for /v2/Member/Eligibility
 * Member: Henry Tom Garcia (AH0000007)
 * Shape based on the sample JSON in the data requirements sheet.
 */

export interface EligibilityRecord {
  level: number
  code: string
  desc: string
}

export interface EligibilityEntry {
  lobBenID: number
  uniqueEligibilityID: string
  eligiblityRecords: EligibilityRecord[]
  startDate: string
  endDate: string
  status: string
  eligibilityPath: string
}

export interface MemberEligibility {
  memberFirstName: string
  memberLastName: string
  gender: string
  memberDOB: string
  clientPatientId: string
  medicareID: string
  eligibilities: EligibilityEntry[]
}

export const mockEligibility: MemberEligibility = {
  memberFirstName: 'Henry',
  memberLastName: 'Garcia',
  gender: 'M',
  memberDOB: '2001-01-01T00:00:00.000Z',
  clientPatientId: 'AH0000007',
  medicareID: 'MCR-HG-2024-001',
  eligibilities: [
    {
      lobBenID: 1,
      uniqueEligibilityID: 'eligibility-AH0000007-20240101',
      eligiblityRecords: [
        { level: 1, code: 'AMB', desc: 'Ambetter Health' },
        { level: 2, code: 'CA', desc: 'California' },
        { level: 3, code: 'SLV', desc: 'Ambetter Enhanced Care (Silver)' },
      ],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      eligibilityPath: 'Ambetter Health (AMB) >> California (CA) >> Ambetter Enhanced Care Silver (SLV)',
    },
    {
      lobBenID: 2,
      uniqueEligibilityID: 'eligibility-AH0000007-MCD-20230101',
      eligiblityRecords: [
        { level: 1, code: 'MCD', desc: 'Medicaid' },
        { level: 2, code: 'VA', desc: 'Virginia' },
        { level: 3, code: 'MA00', desc: 'Virginia Medicaid Managed Care' },
      ],
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      eligibilityPath: 'Medicaid (MCD) >> Virginia (VA) >> Virginia Medicaid Managed Care (MA00)',
    },
  ],
}
