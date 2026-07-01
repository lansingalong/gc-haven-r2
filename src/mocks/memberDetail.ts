/**
 * Mock response for /v2/Member/Detail + /v2/Member/Eligibility
 * Member: Jackson Lee Thomas (AH58319473)
 */

export interface Phone {
  phoneType: string
  phoneNumber: string
  isPreferred: boolean
  bestTimeToCall?: string
}

export interface Address {
  addressType: string
  address1: string
  city: string
  state: string
  county: string
  zip: string
  isPrimary: boolean
  isPreferred: boolean
}

export interface AdditionalIdentifier {
  identifierName: string
  identifierValue: string
}

export interface FamilyMember {
  relationship: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  primaryLanguage: string
  assignedCareManager: string
  insurance: string
  insuranceType: string
  familyUnit: string
}

export interface MemberDetail {
  // Personal Details
  memberFirstName: string
  memberMiddleName: string
  memberLastName: string
  preferredName: string
  dateOfBirth: string
  gender: string
  preferredPronouns: string
  preferredContactFormat: string

  // Member IDs
  clientPatientId: string
  managedCareCode: string
  primaryLineOfBusiness: string
  secondaryLineOfBusiness: string
  subscriberNumber: string
  assignedCareManager: string
  status: string
  enrollment: string

  // Medical IDs  (/v2/Member/Detail)
  primaryInsurance: string
  primaryPolicyNumber: string
  secondaryInsurance: string
  secondaryPolicyNumber: string

  // Languages
  primaryLanguage: string
  preferredWrittenLanguages: string[]
  preferredSpokenLanguages: string[]
  communicationImpairments: string[]

  // Demographics
  ethnicity: string[]
  maritalStatus: string
  residenceStatus: string

  // Clinical
  sensitiveDiagnosis: boolean

  // Contact
  phones: Phone[]

  // Addresses
  addresses: Address[]

  // Family
  familyMembers: FamilyMember[]

  // Identifiers  (additionalIdentifiers array from /v2/Member/Detail)
  additionalIdentifiers: AdditionalIdentifier[]
}

export const mockMemberDetail: MemberDetail = {
  memberFirstName: 'Jackson',
  memberMiddleName: 'Lee',
  memberLastName: 'Thomas',
  preferredName: 'Jackson',
  dateOfBirth: '03/14/1971',
  gender: 'Male',
  preferredPronouns: 'He/him/his',
  preferredContactFormat: 'Phone',

  clientPatientId: 'AH58319473',
  managedCareCode: 'MC-TN-004',
  primaryLineOfBusiness: 'Ambetter Health',
  secondaryLineOfBusiness: '',
  subscriberNumber: 'SUB-583194',
  assignedCareManager: 'Maria Santos',
  status: 'Active',
  enrollment: 'Enrolled',

  primaryInsurance: 'Ambetter Health',
  primaryPolicyNumber: 'AMB-TN-2026-JT',
  secondaryInsurance: '',
  secondaryPolicyNumber: '',

  primaryLanguage: 'English',
  preferredWrittenLanguages: ['English'],
  preferredSpokenLanguages: ['English'],
  communicationImpairments: [],

  ethnicity: ['Black or African American'],
  maritalStatus: 'Married',
  residenceStatus: 'Community',

  sensitiveDiagnosis: false,

  phones: [
    {
      phoneType: 'Cell',
      phoneNumber: '615-472-8831',
      isPreferred: true,
      bestTimeToCall: 'M-F 9am-11am',
    },
    {
      phoneType: 'Home',
      phoneNumber: '615-339-0042',
      isPreferred: false,
    },
  ],

  addresses: [
    {
      addressType: 'Home',
      address1: '2214 Chestnut Ridge Ln',
      city: 'Nashville',
      state: 'TN',
      county: 'DAVIDSON COUNTY',
      zip: '37211',
      isPrimary: true,
      isPreferred: true,
    },
    {
      addressType: 'Mailing',
      address1: 'PO Box 4471',
      city: 'Nashville',
      state: 'TN',
      county: 'DAVIDSON COUNTY',
      zip: '37211',
      isPrimary: false,
      isPreferred: false,
    },
  ],

  familyMembers: [
    {
      relationship: 'Spouse',
      firstName: 'Denise',
      lastName: 'Thomas',
      dateOfBirth: '07/22/1974',
      gender: 'Female',
      primaryLanguage: 'English',
      assignedCareManager: 'Maria Santos',
      insurance: 'Ambetter',
      insuranceType: 'Commercial',
      familyUnit: 'FAM-JT-001',
    },
  ],

  additionalIdentifiers: [
    { identifierName: 'SUBSCRIBER_NO',          identifierValue: 'SUB-583194' },
    { identifierName: 'MRN',                    identifierValue: 'MRN-412783' },
    { identifierName: 'MemberID',               identifierValue: 'AH58319473' },
    { identifierName: 'CARRIER_MEMBER_ID',      identifierValue: 'AMB-TN-2026-JT' },
    { identifierName: 'MBR #',                  identifierValue: '3JT7-AH5-NV91' },
    { identifierName: 'FAMILY_LINK_ID',         identifierValue: 'FAM-JT-001' },
    { identifierName: 'MEMBER_NAME',            identifierValue: 'Jackson Lee Thomas' },
    { identifierName: 'TFN',                    identifierValue: '800-555-0193' },
  ],
}
