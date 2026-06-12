/**
 * Mock response for /v2/Member/Detail + /v2/Member/Eligibility
 * Member: Henry Tom Garcia (AH0000007)
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
  memberFirstName: 'Henry',
  memberMiddleName: 'Tom',
  memberLastName: 'Garcia',
  preferredName: 'Henry',
  dateOfBirth: '01/01/2001',
  gender: 'Male',
  preferredPronouns: 'He/him/his',
  preferredContactFormat: 'Phone',

  clientPatientId: 'AH0000007',
  managedCareCode: 'MC-CA-001',
  primaryLineOfBusiness: 'Medicaid',
  secondaryLineOfBusiness: 'Medicare',
  subscriberNumber: 'SUB-987654',
  assignedCareManager: 'Prudhvi Rajan',
  status: 'Active',
  enrollment: 'Enrolled',

  primaryInsurance: 'Ambetter Health',
  primaryPolicyNumber: 'AMB-CA-2024-HG',
  secondaryInsurance: 'Virginia Medicaid Managed Care',
  secondaryPolicyNumber: 'MCD-20191-HG001',

  primaryLanguage: 'English',
  preferredWrittenLanguages: ['Spanish'],
  preferredSpokenLanguages: ['English'],
  communicationImpairments: [
    'Visually Impaired',
    'Large Font',
    'Hard of Hearing',
    'Interpreter Needed',
  ],

  ethnicity: ['Hispanic or Latino'],
  maritalStatus: 'Single',
  residenceStatus: 'Community',

  sensitiveDiagnosis: false,

  phones: [
    {
      phoneType: 'Cell',
      phoneNumber: '909-851-3064',
      isPreferred: true,
      bestTimeToCall: 'M-F 12pm-1pm',
    },
    {
      phoneType: 'Primary',
      phoneNumber: '259-391-3698',
      isPreferred: false,
    },
    {
      phoneType: 'Alternate',
      phoneNumber: '909-851-3064',
      isPreferred: false,
    },
    {
      phoneType: 'Fax',
      phoneNumber: '233-366-6778',
      isPreferred: false,
    },
  ],

  addresses: [
    {
      addressType: 'Home',
      address1: '4821 Maple Grove Dr',
      city: 'Reston',
      state: 'VA',
      county: 'ADA COUNTY',
      zip: '20191',
      isPrimary: true,
      isPreferred: true,
    },
    {
      addressType: 'Mailing',
      address1: 'PO Box 1142',
      city: 'Reston',
      state: 'VA',
      county: 'ADA COUNTY',
      zip: '20191',
      isPrimary: false,
      isPreferred: false,
    },
  ],

  familyMembers: [
    {
      relationship: 'Spouse',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '03/15/1999',
      gender: 'Female',
      primaryLanguage: 'Spanish',
      assignedCareManager: 'Prudhvi Rajan',
      insurance: 'Ambetter',
      insuranceType: 'Commercial',
      familyUnit: 'FAM-001',
    },
    {
      relationship: 'Child',
      firstName: 'Lucas',
      lastName: 'Garcia',
      dateOfBirth: '06/22/2020',
      gender: 'Male',
      primaryLanguage: 'English',
      assignedCareManager: 'Prudhvi Rajan',
      insurance: 'Medicaid',
      insuranceType: 'Government',
      familyUnit: 'FAM-001',
    },
  ],

  additionalIdentifiers: [
    { identifierName: 'SUBSCRIBER_NO',           identifierValue: 'SUB-987654' },
    { identifierName: 'MEDICAID_NO',             identifierValue: 'MCD-20191-HG001' },
    { identifierName: 'MEDICARE_NO',             identifierValue: 'MCR-HG-2024-001' },
    { identifierName: 'Medicaid Subscriber ID',  identifierValue: 'MCD-SUB-HG-0007' },
    { identifierName: 'FAMILY_LINK_ID',          identifierValue: 'FAM-001' },
    { identifierName: 'VSP_ASPFN_ID',            identifierValue: 'VSP-HG-00789' },
    { identifierName: 'MEMBER_NAME',             identifierValue: 'Henry Tom Garcia' },
    { identifierName: 'TFN',                     identifierValue: '800-555-0147' },
    { identifierName: 'MRN',                     identifierValue: 'MRN-789456' },
    { identifierName: 'MACRAE_ID',               identifierValue: 'MAC-HG-2024-0007' },
    { identifierName: 'MemberID',                identifierValue: 'AH0000007' },
    { identifierName: 'CARRIER_MEMBER_ID',       identifierValue: 'AMB-CA-2024-HG' },
    { identifierName: 'MBR #',                   identifierValue: '1EG4-TE5-MK72' },
    { identifierName: 'MCO Assigned Member ID',  identifierValue: 'MCO-HG-0007' },
  ],
}
