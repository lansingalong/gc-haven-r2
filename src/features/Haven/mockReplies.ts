/**
 * Mock reply engine for Haven AI assistant.
 * Matches natural language questions to structured mock data responses.
 */

import {
  mockMemberDetail,
  mockEligibility,
  mockMedications,
  mockDiagnosis,
  mockCarePlan,
  mockPrograms,
  mockGapsInCare,
  mockVisits,
  mockActivitySummary,
} from '@/mocks'

import {
  lisaMemberDetail,
  lisaEligibility,
  lisaMedications,
  lisaDiagnosis,
  lisaCarePlan,
  lisaPrograms,
  lisaGapsInCare,
  lisaVisits,
  lisaActivitySummary,
} from '@/mocks/lisaThompson'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

/** Returns true if the query contains ANY of the given terms */
function matches(q: string, terms: string[]): boolean {
  return terms.some(t => q.includes(t))
}

/* ─── Keyword banks ─────────────────────────────────────────────────────────
   Each array covers: direct terms, clinical shorthand, action phrases,
   common misspellings, and contextual synonyms a nurse/CM might use.
─────────────────────────────────────────────────────────────────────────── */

const MED_TERMS = [
  // Direct
  'medication', 'medications', 'medicine', 'medicines', 'med ', 'meds',
  'pill', 'pills', 'tablet', 'tablets', 'capsule', 'capsules',
  // Clinical shorthand
  'rx ', 'rx?', 'rx:', 'pharmacotherapy', 'formulary', 'dispens',
  'med rec', 'medication rec', 'reconcil',
  // Drug-related
  'drug', 'drugs', 'prescri', 'prescription', 'prescriptions',
  'dosage', 'dosing', 'dose ', 'doses', 'refill', 'refills',
  // Action phrases
  'what is he taking', "what's he taking", 'what does he take',
  'what is she taking', "what's she taking", 'what does she take',
  'what is henry taking', 'what is the member taking',
  'what is he on', "what's he on", 'what is she on', "what's she on",
  'what is henry on', 'what is the member on',
  'currently prescribed', 'currently taking', 'currently on',
  'pull up his meds', 'pull up her meds', 'pull up the meds',
  'show me his meds', 'show me her meds', 'show me the meds',
  'show me his medications', 'show me her medications', 'show me medications',
  'list his meds', 'list her meds', 'list the meds',
  'list his medications', 'list medications',
  'get his medications', 'get the medications',
  'what medications is he', 'what medications is she', 'what medications is henry',
  'what meds is he', 'what meds is she', 'what meds is henry',
  'any medications', 'any meds', 'any prescriptions', 'any drugs',
  'active medications', 'active meds', 'current medications', 'current meds',
  'med list', 'medication list',
  // Specific drugs in Henry's profile
  'metformin', 'lisinopril', 'atorvastatin', 'aspirin', 'albuterol',
  'statin', 'ace inhibitor', 'inhaler', 'blood thinner',
  // Pharmacy
  'pharmacy', 'pharmacist', 'drug store',
  // Other ways
  'is he taking anything', 'is she taking anything',
  'what treatments', 'treatment regimen', 'treatment plan',
  'is he on anything', 'is she on anything',
]

const ALLERGY_TERMS = [
  'allerg', 'allergies', 'allergy',
  'adverse reaction', 'adverse drug', 'drug reaction',
  'sensitivity', 'sensitivities', 'intolerance', 'intolerances',
  'contraindication', 'contraindicated',
  'penicillin', 'sulfa', 'sulfonamide', 'latex',
  'anaphylaxis', 'anaphylactic',
  'what is he allergic', 'what is she allergic', 'what is henry allergic',
  'any known allergies', 'known drug allergies', 'drug allergies',
  'allergic to', 'has he ever had a reaction', 'has she ever had a reaction',
  'life threatening allerg', 'serious allerg',
  'is he allergic', 'is she allergic',
]

const DIAGNOSIS_TERMS = [
  // Direct
  'diagnos', 'diagnosis', 'diagnoses',
  // Clinical shorthand
  'dx', 'icd', 'icd-10', 'icd10',
  // Condition language
  'condition', 'conditions', 'chronic condition', 'chronic conditions',
  'problem list', 'problem', 'active problem',
  'disease', 'diseases', 'disorder', 'disorders',
  'illness', 'illnesses', 'ailment',
  'comorbid', 'comorbidity', 'comorbidities',
  'health issue', 'health issues', 'health concern', 'health concerns',
  'medical issue', 'medical issues', 'medical condition', 'medical conditions',
  // History
  'pmh', 'past medical history', 'medical history', 'clinical history',
  'history of', 'hx of', 'h/o',
  // Action phrases
  'what does he have', 'what does she have', 'what does henry have',
  "what's wrong with him", "what's wrong with her",
  'what is he being treated for', 'what is she being treated for',
  'what conditions does he have', 'what conditions does she have',
  'list his conditions', 'list her conditions', 'list the conditions',
  'show me his diagnoses', 'show me her diagnoses', 'show me diagnoses',
  'pull up his diagnoses', 'pull up diagnoses',
  'any chronic', 'chronic illness', 'chronic disease',
  'active diagnos', 'current diagnos',
  // Specific conditions (Henry's)
  'diabetes', 'diabetic', 'hypertension', 'hyperlipidemia', 'asthma', 'obesity', 'kidney',
  'renal', 'ckd', 'high blood pressure', 'high cholesterol', 'lipid',
]

const VITAL_TERMS = [
  'vital', 'vitals',
  'blood pressure', 'bp reading', 'bp check', 'bp result',
  'heart rate', 'pulse', 'pulse rate',
  'temperature', 'temp ',
  'respiratory rate', 'breathing rate', 'respirations',
  'oxygen', 'o2 sat', 'spo2', 'o2 saturation', 'oxygen saturation', 'oxygen level',
  'weight', 'height', 'bmi', 'body mass',
  'latest vitals', 'recent vitals', 'last vitals', 'current vitals',
  'most recent vitals', 'show me vitals', 'pull up vitals',
  'what is his bp', 'what is her bp', "what's his bp", "what's her bp",
  'what is his blood pressure', 'what is her blood pressure',
  'how much does he weigh', 'how much does she weigh',
  'is his blood pressure controlled', 'is her blood pressure controlled',
  'hypertension control', 'bp control', 'blood pressure control',
]

const LAB_TERMS = [
  'lab ', 'labs', 'lab result', 'lab results', 'lab work', 'lab value', 'lab values',
  'laboratory', 'test result', 'test results',
  'hba1c', 'a1c', 'hemoglobin a1c', 'glycated',
  'glucose', 'blood sugar', 'blood glucose', 'fasting glucose',
  'cholesterol', 'lipid', 'lipid panel', 'ldl', 'hdl', 'triglyceride', 'triglycerides',
  'creatinine', 'egfr', 'gfr', 'kidney function', 'renal function',
  'cbc', 'complete blood count', 'metabolic panel', 'bmp', 'cmp',
  'potassium', 'sodium', 'hemoglobin', 'hematocrit',
  'what are his labs', 'what are her labs', 'what are the labs',
  'show me his labs', 'show me her labs', 'show me labs',
  'pull up labs', 'pull up his labs', 'pull up her labs',
  'latest labs', 'recent labs', 'last labs', 'most recent labs',
  'any recent bloodwork', 'bloodwork', 'blood work', 'blood test',
  'is his a1c', 'is her a1c', "what's his a1c", "what's her a1c",
  'what is his a1c', 'what is her a1c', 'a1c level', 'a1c value',
  'is his diabetes controlled', 'is her diabetes controlled',
  'diabetic labs', 'diabetes labs',
]

const CARE_GAP_TERMS = [
  'care gap', 'care gaps', 'gaps in care', 'gap in care',
  'hedis', 'ncqa', 'quality measure', 'quality measures', 'quality gap', 'quality gaps',
  'open gap', 'open gaps', 'outstanding measure', 'outstanding measures',
  'overdue', 'past due', 'due for', 'what is due', 'what is overdue',
  'missing measure', 'missing measures', 'missing screening',
  'preventive', 'preventive care', 'prevention',
  'wellness visit', 'annual wellness', 'awv', 'annual visit',
  'eye exam', 'retinal exam', 'diabetic eye', 'ophthalmology',
  'star rating', 'star measure', 'hedis gap',
  'what screenings', 'what preventive', 'screening due',
  'what is he missing', 'what is she missing', 'what is henry missing',
  'what has not been done', 'what hasn\'t been done',
  'any gaps', 'has he had', 'has she had', 'has henry had',
  'when was his last wellness', 'when was her last wellness',
  'never completed', 'not completed', 'incomplete measure',
  'close a gap', 'close the gap', 'closing the gap',
]

const VISIT_TERMS = [
  'visit', 'visits', 'appointment', 'appointments',
  'recent visit', 'recent visits', 'recent appointment', 'recent appointments',
  'last visit', 'last appointment', 'most recent visit', 'most recent appointment',
  'upcoming visit', 'upcoming appointment', 'next appointment', 'next visit',
  'scheduled visit', 'scheduled appointment',
  // ER / hospital
  'er ', 'e.r.', 'emergency room', 'emergency visit', 'emergency department', 'ed visit',
  'hospital', 'hospitalization', 'hospitalizations', 'inpatient', 'admitted', 'admission',
  'discharge', 'discharged', 'readmission', 'readmitted',
  'hospital stay', 'hospital stays', 'inpatient stay',
  // Types
  'pcp visit', 'pcp appointment', 'primary care visit', 'primary care appointment',
  'specialist visit', 'specialist appointment', 'specialist',
  'telehealth', 'tele-health', 'virtual visit', 'virtual appointment',
  'urgent care', 'urgent visit',
  // Action phrases
  'show me his visits', 'show me her visits', 'show me visits',
  'show me his appointments', 'show me her appointments', 'show me appointments',
  'pull up his visits', 'pull up her visits', 'pull up visits',
  'pull up appointments',
  'when did he last see', 'when did she last see', 'when did henry last see',
  'when was his last visit', 'when was her last visit',
  'when was his last appointment', 'when was her last appointment',
  'has he been to the er', 'has she been to the er',
  'has he been hospitalized', 'has she been hospitalized',
  'any recent er', 'any hospital', 'any recent hospital',
  'did he go to the hospital', 'did she go to the hospital',
  'was he admitted', 'was she admitted',
  'encounter', 'encounters', 'claims history', 'service history',
  'when did he see dr', 'when did she see dr',
  'has he seen anyone', 'has she seen anyone',
]

const CARE_PLAN_TERMS = [
  'care plan', 'careplan',
  'goal', 'goals', 'treatment goal', 'treatment goals', 'clinical goal', 'clinical goals',
  'care goal', 'care goals', 'member goal', 'member goals',
  'intervention', 'interventions', 'clinical intervention',
  'barrier', 'barriers', 'care barrier', 'care barriers',
  'strength', 'strengths',
  'opportunity', 'opportunities',
  'member plan', 'team care plan', 'team plan',
  'target date', 'goal date',
  'treatment plan', 'plan of care', 'poc',
  'what is his plan', 'what is her plan', "what's his plan", "what's her plan",
  "what's henry's plan",
  'show me his care plan', 'show me her care plan', 'show me the care plan',
  'pull up his care plan', 'pull up her care plan', 'pull up the care plan',
  'pull up care plan',
  'what are his goals', 'what are her goals', 'what are henry\'s goals',
  'what goals does he have', 'what goals does she have',
  'is he on track', 'is she on track', 'is henry on track',
  'care plan status', 'plan status',
  'active care plan', 'current care plan', 'open care plan',
  'what interventions', 'current interventions', 'active interventions',
  'care plan barriers', 'barriers to care', 'barriers in his', 'barriers in her',
  'member engagement', 'engagement level', 'how engaged',
  'member status on', 'member status',
  'what is he working on', 'what is she working on',
  'what has been done for him', 'what has been done for her',
]

const PROGRAM_TERMS = [
  'program', 'programs',
  'enrolled', 'enrollment', 'enroll', 'enrolling',
  'active program', 'active programs', 'current program', 'current programs',
  'eligible program', 'eligible programs', 'eligible for a program',
  'what programs', 'which programs',
  'dsme', 'diabetes self-management', 'diabetes self management',
  'dpp', 'diabetes prevention', 'diabetes prevention program',
  'care coordination', 'care coordinator',
  'chronic disease management', 'chronic disease program', 'disease management',
  'behavioral health program', 'behavioral health integration',
  'what is he enrolled in', 'what is she enrolled in', 'what is henry enrolled in',
  'what programs is he in', 'what programs is she in', 'what programs is henry in',
  'show me his programs', 'show me her programs', 'show me programs',
  'pull up his programs', 'pull up her programs', 'pull up programs',
  'list his programs', 'list her programs', 'list programs',
  'is he enrolled', 'is she enrolled', 'is henry enrolled',
  'is he in a program', 'is she in a program',
  'what programs is he eligible', 'what programs is she eligible',
  'program eligibility', 'eligible but not enrolled',
  'can he be enrolled', 'can she be enrolled', 'should he be enrolled',
  'should she be enrolled', 'initiate enrollment', 'start enrollment',
  'disenroll', 'unenroll', 'discharge from program',
]

const ASSESSMENT_TERMS = [
  'assessment', 'assessments',
  'script', 'scripts',
  'hra', 'health risk assessment', 'health risk',
  'ltss', 'long-term services', 'long term services',
  'adl', 'adls', 'activities of daily living', 'daily living',
  'iadl', 'instrumental activities',
  'phq', 'phq-9', 'phq9',
  'survey', 'surveys', 'questionnaire', 'questionnaires',
  'screening', 'screenings', 'screen ',
  'score ', 'scores', 'assessment score',
  'activity summary', 'script activity',
  'last assessment', 'most recent assessment', 'recent assessment', 'latest assessment',
  'first assessment', 'prior assessment', 'previous assessment',
  'completed assessment', 'incomplete assessment', 'pending assessment',
  'what assessments', 'which assessments', 'any assessments',
  'show me his assessments', 'show me her assessments', 'show me assessments',
  'pull up his assessments', 'pull up her assessments', 'pull up assessments',
  'when was his last assessment', 'when was her last assessment',
  'when was the last assessment', 'when was his last hra', 'when was her last hra',
  'what was his score', 'what was her score', "what's his score", "what's her score",
  'has he completed', 'has she completed', 'has henry completed',
  'any outstanding assessments', 'overdue assessment', 'due for assessment',
  'what did he say on', 'what did she say on', 'what did henry say on',
  'what did he report', 'what did she report', 'what did henry report',
  'member responses', 'member answers',
  'did he fill out', 'did she fill out',
]

const SDOH_TERMS = [
  'sdoh', 's.d.o.h.', 'social determinant', 'social determinants',
  'social history', 'social needs', 'social risk', 'social risk factor',
  // Housing
  'housing', 'homeless', 'homelessness', 'shelter', 'living situation',
  'where does he live', 'where does she live', 'where does henry live',
  'stable housing', 'unstable housing', 'eviction',
  // Food
  'food', 'food insecurity', 'food security', 'food access',
  'hunger', 'hungry', 'nutrition', 'meals', 'food bank',
  'skipping meals', 'not eating', 'going without food',
  'second harvest', 'food pantry', 'food assistance',
  // Transportation
  'transportation', 'transport', 'getting to appointments',
  'how does he get to', 'how does she get to',
  'ride', 'rides', 'driving', 'car', 'bus',
  'transportation barrier', 'transportation issue', 'transportation problem',
  // Financial
  'financial', 'finance', 'finances', 'money', 'income', 'afford',
  'financial stress', 'financial hardship', 'low income', 'poverty',
  // Employment
  'employment', 'employed', 'unemployed', 'job', 'work ', 'working ',
  'part-time', 'full-time',
  // Support
  'social support', 'support system', 'support network', 'family support',
  'isolation', 'isolated', 'lives alone', 'alone ', 'lonely',
  // Safety
  'safety', 'domestic violence', 'abuse', 'unsafe',
  // General
  'community', 'community resource', 'community resources', 'community referral',
  'social worker', 'social work',
  'unmet need', 'unmet needs', 'basic needs',
  'what are his social', 'what are her social', "what's his social situation",
  "what's her social situation",
  'show me his sdoh', 'show me her sdoh', 'show me sdoh',
  'pull up his sdoh', 'pull up her sdoh',
  'is he at risk', 'is she at risk', 'any social risks', 'any social barriers',
  'social barriers', 'non-clinical barriers',
]

const IMMUNIZATION_TERMS = [
  'immuniz', 'immunization', 'immunizations',
  'vaccine', 'vaccines', 'vaccination', 'vaccinations',
  'shot ', 'shots', 'booster', 'boosters',
  'flu ', 'flu shot', 'flu vaccine', 'influenza', 'flu season',
  'covid', 'covid-19', 'covid vaccine', 'coronavirus',
  'pneumococcal', 'ppsv23', 'pcv', 'pneumonia vaccine',
  'tdap', 'tetanus', 'tetanus shot',
  'hepatitis', 'hep b', 'hepatitis b',
  'shingrix', 'zoster', 'shingles',
  'is he up to date', 'is she up to date', 'is henry up to date',
  'up to date on vaccines', 'up to date on vaccinations',
  'what vaccines', 'which vaccines', 'any vaccines',
  'show me his immunizations', 'show me her immunizations', 'show me immunizations',
  'pull up his immunizations', 'pull up her immunizations',
  'when was his last flu', 'when was her last flu',
  'has he been vaccinated', 'has she been vaccinated',
  'any due vaccines', 'vaccines due', 'vaccinations due', 'overdue vaccine',
  'immunization record', 'vaccination record', 'vaccination history',
]

const BEHAVIORAL_HEALTH_TERMS = [
  'mental health', 'mental illness', 'mental health condition', 'mental health history',
  'behavioral health', 'behavioral', 'bh ', 'b.h.',
  // Conditions
  'depression', 'depressed', 'depressive', 'major depression',
  'anxiety', 'anxious', 'anxiety disorder', 'generalized anxiety', 'panic',
  'bipolar', 'ptsd', 'trauma', 'post-traumatic', 'post traumatic',
  'schizophrenia', 'psychosis', 'psychotic',
  'substance use', 'substance abuse', 'addiction', 'alcohol', 'drinking', 'drug use',
  'opioid', 'suicidal', 'self-harm', 'mood disorder',
  // Screenings
  'phq', 'phq-9', 'phq9', 'depression screening', 'mood screening',
  'gad', 'gad-7', 'audit', 'cage',
  // Treatment
  'therapist', 'therapy', 'counseling', 'counselor', 'psychologist',
  'psychiatrist', 'psychiatry', 'psych', 'psychotherapy',
  'antidepressant', 'ssri', 'snri', 'sertraline', 'prozac', 'lexapro',
  // Action phrases
  'how is he doing mentally', 'how is she doing mentally', 'how is henry doing mentally',
  'is he depressed', 'is she depressed', 'is henry depressed',
  'how is his mental health', 'how is her mental health',
  'any behavioral health', 'any mental health', 'any psychiatric',
  'does he see a therapist', 'does she see a therapist',
  'last bh visit', 'last mental health visit', 'last therapy',
  'is he in therapy', 'is she in therapy',
  'emotional wellbeing', 'emotional health', 'psychological',
  'mood', 'moods', 'how is he feeling', 'how is she feeling',
]

const CONTACT_TERMS = [
  'contact', 'contact info', 'contact information', 'contact preference', 'contact preferences',
  'phone', 'phone number', 'phone numbers', 'phone #', 'telephone', 'telephone number',
  'cell', 'cell phone', 'mobile', 'home phone',
  'best time', 'best time to call', 'best time to reach', 'when to call',
  'when is the best time', 'when can i call', 'when should i call',
  'how to reach', 'how do i reach', 'how to contact', 'how do i contact',
  'get ahold', 'get a hold', 'get in touch', 'reach the member', 'reach him', 'reach her',
  'call him', 'call her', 'call henry',
  'preferred contact', 'preferred number', 'preferred phone',
  'alternate phone', 'alternate number', 'alternate contact',
  'communication impairment', 'communication barrier',
  'interpreter', 'language barrier', 'translation',
  'hard of hearing', 'hearing impaired', 'visually impaired',
  'does he have a phone', 'does she have a phone',
  'what is his number', 'what is her number', "what's his number", "what's her number",
  'what is his phone', 'what is her phone', "what's his phone", "what's her phone",
  'how do i get in touch', 'how can i reach',
  'last contact', 'last successful contact', 'last time we talked',
  'last outreach', 'outreach attempt', 'missed call', 'no answer',
  'fax', 'fax number',
]

const ELIGIBILITY_TERMS = [
  'eligib', 'eligibility', 'eligible',
  'coverage', 'insurance', 'insurance plan', 'insurance coverage',
  'plan ', 'health plan', 'insurance type',
  'lob', 'line of business', 'benefit', 'benefits',
  'ambetter', 'medicaid', 'medicare', 'dual eligible', 'dual',
  'active member', 'member active', 'member status', 'is he active', 'is she active',
  'is henry active',
  'when does his coverage', 'when does her coverage',
  'when does his eligibility', 'when does her eligibility',
  'when does his insurance', 'when does her insurance',
  'end date', 'expiration', 'expire', 'expiring', 'termination', 'terminating',
  'renewal', 'renew', 're-enrollment',
  'what plan', 'which plan', 'what insurance',
  'show me his eligibility', 'show me her eligibility', 'show me eligibility',
  'pull up his eligibility', 'pull up her eligibility',
  'pull up his coverage', 'pull up her coverage',
  'is he covered', 'is she covered', 'is henry covered',
  'coverage dates', 'eligibility dates', 'enrollment dates',
  'start date of coverage', 'start date of eligibility',
  'policy', 'policy number', 'subscriber',
  'medicaid number', 'medicare number', 'medicare id',
  'lob path', 'eligibility path',
]

const MEMBER_DETAIL_TERMS = [
  'member detail', 'member details', 'member information', 'member info',
  'member profile', 'profile',
  'demographic', 'demographics',
  'personal detail', 'personal details', 'personal information', 'personal info',
  'address', 'home address', 'mailing address', 'where does he live',
  'where does she live', 'where does henry live',
  'zip', 'zip code', 'city', 'state',
  'date of birth', 'dob', 'birthday', 'how old is he', 'how old is she',
  'how old is henry', "what's his age", "what's her age", 'age ',
  'gender', 'sex', 'pronoun', 'pronouns', 'preferred name',
  'primary language', 'speaks', 'language', 'languages',
  'member id', 'member identifier', 'identifier',
  'care manager', 'assigned to', 'assigned cm', 'who is his cm', 'who is her cm',
  "who's his care manager", "who's her care manager",
  'who manages his care', 'who manages her care',
  'marital status', 'married', 'single',
  'ethnicity', 'race',
  'family member', 'family members', 'family', 'family unit',
  'dependents', 'spouse', 'children',
  'communication impairment', 'communication preference',
  'subscriber number', 'medicaid number', 'medicare number',
  'mailing', 'home ', 'residence',
  'pull up his profile', 'pull up her profile', 'pull up profile',
  'show me his information', 'show me her information',
  'who is this member', 'tell me about this member', 'tell me about henry',
  'overview of henry', 'overview of the member',
  'member overview', 'basic info', 'basic information',
]

const RISK_TERMS = [
  'risk level', 'risk score', 'risk tier', 'risk stratif', 'risk rating',
  'risk', 'high risk', 'low risk', 'moderate risk',
  'readmission risk', 'hospitalization risk', 'ed risk',
  'how at risk', 'what is the risk', 'what is their risk', 'what is his risk', 'what is her risk',
  "what's the risk", 'acuity', 'acuity level', 'complexity',
  'predictive', 'utilization risk',
]

const HEALTH_INDICATOR_TERMS = [
  'health indicator', 'health indicators', 'last recorded',
  'last health', 'latest health', 'most recent health',
  'key indicator', 'key indicators', 'key metric', 'key metrics',
  'clinical indicator', 'clinical indicators', 'clinical summary',
  'summary of health', 'health summary', 'health snapshot',
  'bnp', 'hemoglobin', 'recorded indicator',
]

/* ─── Follow-up suggestions ─────────────────────────────────────────────────── */

const FOLLOW_UP_MAP: Array<{ terms: string[]; text: string; query: string }> = [
  { terms: RISK_TERMS,             text: "Would you like to see the member's last recorded health indicators?",        query: "What is this member's last recorded health indicator?" },
  { terms: HEALTH_INDICATOR_TERMS, text: "Would you like to see the member's current risk level?",                    query: "What is this member's current risk level?" },
  { terms: ALLERGY_TERMS,          text: "Would you like to review the current medication list for contraindications?", query: "What is this member's current medication list?" },
  { terms: VITAL_TERMS,            text: "Would you like to see the most recent lab results?",                         query: "What are the member's most recent lab results?" },
  { terms: LAB_TERMS,              text: "Would you like to see the open care gaps related to these values?",          query: "What are the member's open care gaps?" },
  { terms: MED_TERMS,              text: "Would you like to check for any drug allergies?",                            query: "Does the member have any drug allergies?" },
  { terms: BEHAVIORAL_HEALTH_TERMS,text: "Would you like to see the behavioral health goals in the care plan?",        query: "What is the member's care plan?" },
  { terms: SDOH_TERMS,             text: "Would you like to see what programs the member is eligible for?",            query: "What services is this member eligible for?" },
  { terms: IMMUNIZATION_TERMS,     text: "Would you like to see the member's open care gaps?",                         query: "What are the member's open care gaps?" },
  { terms: CARE_GAP_TERMS,         text: "Would you like to see the current care plan?",                               query: "What is the member's care plan?" },
  { terms: ASSESSMENT_TERMS,       text: "Would you like to see the open care gaps?",                                  query: "What are the member's open care gaps?" },
  { terms: CARE_PLAN_TERMS,        text: "Would you like to see what programs the member is enrolled in?",             query: "What programs is the member enrolled in?" },
  { terms: PROGRAM_TERMS,          text: "Would you like to see the open care gaps?",                                  query: "What are the member's open care gaps?" },
  { terms: VISIT_TERMS,            text: "Would you like to see the member's active care plan?",                       query: "What is the member's care plan?" },
  { terms: ELIGIBILITY_TERMS,      text: "Would you like to see what programs the member is eligible for?",            query: "What services is this member eligible for?" },
  { terms: CONTACT_TERMS,          text: "Would you like to see the member's full eligibility information?",           query: "What is this member's eligibility?" },
  { terms: DIAGNOSIS_TERMS,        text: "Would you like to see the care plan goals for these conditions?",            query: "What is the member's care plan?" },
  { terms: MEMBER_DETAIL_TERMS,    text: "Would you like to see the member's insurance and eligibility?",              query: "What is this member's eligibility?" },
]

const DEFAULT_FOLLOW_UP = { text: "Would you like to see the member's open care gaps?", query: "What are the member's open care gaps?" }

export function getFollowUp(input: string): string {
  const q = input.toLowerCase()
  return FOLLOW_UP_MAP.find(m => matches(q, m.terms))?.text ?? DEFAULT_FOLLOW_UP.text
}

export function getFollowUpQuery(input: string): string {
  const q = input.toLowerCase()
  return FOLLOW_UP_MAP.find(m => matches(q, m.terms))?.query ?? DEFAULT_FOLLOW_UP.query
}

/* ─── Guardrails ─────────────────────────────────────────────────────────── */

function suggest(s1: string, s2: string): string {
  return `Here are some things I can help with: "${s1}", "${s2}"`
}

/**
 * Returns a refusal message (one of four standard categories) if the query
 * falls outside supported scope, or null if the query is safe to process.
 *
 * Categories:
 *   1. MISSING DATA      — info not available in the system
 *   2. PERMISSION ERROR  — data exists but access is restricted
 *   3. CLINICAL QUESTION — requires clinical judgment
 *   4. OUT OF SCOPE      — irrelevant or inappropriate
 */
export function getGuardrailMessage(input: string): string | null {
  const q = input.toLowerCase()

  // ── Category 3: Clinical question ────────────────────────────────────────
  // Dosage evaluation: any quantity unit paired with a quality judgment
  const DOSAGE_SIGNALS = ['mg', 'mcg', 'ml', ' g of ', 'gram of', 'milligram', 'units of', ' iu ', 'dosage of', 'dose of']
  const EVAL_SIGNALS   = [' good', ' safe', ' ok', ' okay', ' right', ' appropriate', ' correct', 'too much', 'too little', 'too high', 'too low', ' proper', ' normal for']
  const hasDosage = DOSAGE_SIGNALS.some(t => q.includes(t))
  const hasEval   = EVAL_SIGNALS.some(t => q.includes(t))

  const CLINICAL_DECISION_TERMS = [
    // Evaluation of a specific medication or dosage
    'good for him', 'good for her', 'good for the member',
    'safe for him', 'safe for her', 'safe for the member',
    'right for him', 'right for her', 'right for the member',
    'okay for him', 'okay for her', 'ok for him', 'ok for her',
    'appropriate for him', 'appropriate for her', 'appropriate for the member',
    'is this safe', 'is that safe', 'is it safe',
    'is this good', 'is that good',
    // Prescribing / modification decisions
    'should he take', 'should she take', 'should the member take', 'should they take',
    'can he take', 'can she take', 'should be taking',
    'should he be on', 'should she be on', 'should the member be on',
    'increase the dose', 'decrease the dose', 'adjust the dose',
    'change his dose', 'change her dose', 'change the dose',
    'add a medication', 'start taking', 'stop taking',
    'change his medication', 'change her medication', 'change the medication',
    'recommend treatment', 'treatment option', 'what treatment', 'best treatment',
    'drug interaction', 'safe to take together',
    'clinical recommendation', 'medical recommendation', 'clinical advice', 'medical advice',
    'what dose should', 'what dosage should', 'right dose', 'correct dose', 'appropriate dose',
    'is it safe to take', 'safe for him to take', 'safe for her to take',
    'is this medication safe', 'is this drug safe',
    'should i prescribe', 'should we prescribe', 'prescribe this',
  ]

  if ((hasDosage && hasEval) || CLINICAL_DECISION_TERMS.some(t => q.includes(t))) {
    const base = "I'm not able to provide clinical advice. Please consult the member's care team or a licensed clinician for this question."
    // Match follow-ups to what the user was trying to find out
    if (q.includes('med') || q.includes('drug') || q.includes('prescri') || q.includes('rx') || hasDosage) {
      return `${base}\n\n${suggest("What is this member's current medication list?", "Does this member have any documented drug allergies?")}`
    }
    if (q.includes('diagnos') || q.includes('condition') || q.includes('disease') || q.includes('disorder')) {
      return `${base}\n\n${suggest("What are this member's active diagnoses?", "What is this member's care plan?")}`
    }
    return `${base}\n\n${suggest("What are this member's open care gaps?", "What is this member's active care plan?")}`
  }

  // ── Category 1: Missing data ──────────────────────────────────────────────
  // Referral data is not available through this assistant
  if (
    q.includes('referral') &&
    !q.includes('referral status') &&
    !q.includes('referral history') &&
    !q.includes('has a referral')
  ) {
    return `I can't provide that information at this time.\n\n${suggest("What services is this member eligible for?", "What programs is this member currently enrolled in?")}`
  }

  // ── Category 2: Permission error ──────────────────────────────────────────
  // Prior authorization — write access not available
  if (q.includes('prior auth')) {
    return `It looks like you don't have access to this information at this time. Contact your system administrator to change your permissions.\n\n${suggest("What is this member's current medication list?", "What are this member's active diagnoses?")}`
  }

  // Billing and claims — restricted to authorized roles
  if (
    q.includes('billing') ||
    q.includes('insurance claim') ||
    q.includes('file a claim') ||
    q.includes('claims data') ||
    q.includes('claims history') ||
    q.includes('claims information')
  ) {
    return `It looks like you don't have access to this information at this time. Contact your system administrator to change your permissions.\n\n${suggest("What is this member's eligibility and coverage?", "What services is this member eligible for?")}`
  }

  // Write / modify / action requests — read-only role
  const WRITE_TERMS = [
    'schedule an appointment', 'book an appointment', 'make an appointment',
    'cancel appointment', 'reschedule appointment',
    'send a message to', 'send an email', 'send a letter', 'send notification', 'notify the member',
    'update the record', 'update his record', 'update her record',
    'modify the record', 'edit the record', 'change the record',
    'update his address', 'update her address', 'change the address', 'change his address', 'change her address',
    'delete the record', 'delete member', 'remove from record',
    'enroll the member', 'enroll him', 'enroll her', 'unenroll',
    'submit a claim', 'create a case', 'open a case', 'close a case',
    'assign to a care', 'reassign the member',
  ]
  if (WRITE_TERMS.some(t => q.includes(t))) {
    const isScheduling = ['schedule', 'book', 'appointment', 'reschedule', 'cancel'].some(t => q.includes(t))
    if (isScheduling) {
      return `It looks like you don't have access to this information at this time. Contact your system administrator to change your permissions.\n\n${suggest("What is this member's visit history?", "What is this member's active care plan?")}`
    }
    return `It looks like you don't have access to this information at this time. Contact your system administrator to change your permissions.\n\n${suggest("What is this member's current risk level?", "What are this member's open care gaps?")}`
  }

  // ── Category 4: Out of scope / inappropriate ──────────────────────────────
  const LEGAL_TERMS = [
    'lawsuit', 'legal action', 'legal advice', 'malpractice',
    'liable', 'liability', ' attorney', ' lawyer', 'litigation', 'legal counsel',
    'file a complaint', 'hipaa violation', 'compliance violation', 'legal question',
    'suing', ' sue ',
  ]
  if (LEGAL_TERMS.some(t => q.includes(t))) {
    return `I can't provide you with that kind of information.\n\n${suggest("What are this member's open care gaps?", "What is this member's active care plan?")}`
  }

  const ADMIN_TERMS = ['password', 'system admin', 'admin account', 'confidential data', 'restrict access', 'reset credentials']
  if (ADMIN_TERMS.some(t => q.includes(t))) {
    return `I can't provide you with that kind of information.\n\n${suggest("What is this member's current risk level?", "What programs is this member eligible for?")}`
  }

  return null
}

/* ─── Topic matchers in priority order ──────────────────────────────────────
   Order matters — more specific topics (allergies, vitals, labs) are checked
   before broad ones (diagnoses) to avoid false positives.
─────────────────────────────────────────────────────────────────────────── */

function getMedReply(first: string): string {
  const active = mockMedications.filter(m => m.isCurrent)
  const inactive = mockMedications.filter(m => !m.isCurrent)
  const lastRecon = active[0]?.lastReconDate ? fmtDate(active[0].lastReconDate) : 'N/A'
  const activeLines = active.map(m =>
    `• ${m.medicationName} ${m.dosage} — ${m.route} ${m.frequency} (${m.diagnosis})`
  ).join('\n')
  const inactiveLines = inactive.map(m =>
    `• ${m.medicationName} ${m.dosage} — discontinued ${fmtDate(m.endDate ?? '')}`
  ).join('\n')
  return `${first}'s medications as of ${lastRecon}:\n\nActive (${active.length}):\n${activeLines}${inactiveLines ? `\n\nInactive / Discontinued:\n${inactiveLines}` : ''}\n\nLast pharmacy reconciliation ${lastRecon}. Please confirm with dispensing pharmacy prior to any clinical decisions.`
}

function getAllergyReply(first: string): string {
  return `⚠️ ${first} has the following documented allergies:\n\n• Penicillin — Reaction: Anaphylaxis (life-threatening)\n• Sulfonamides — Reaction: Rash, urticaria\n• Latex — Reaction: Contact dermatitis\n\nPlease ensure allergy alert is reviewed before ordering any medications or scheduling procedures. Last verified 01/10/2024.`
}

function getDxReply(first: string): string {
  const lines = mockDiagnosis.map(d =>
    `• ${d.condition} (${d.diagnosisCode}) — onset ${fmtDate(d.startDate)} · ${d.category} · ${d.level}`
  ).join('\n')
  const lastVisit = fmtDate(mockVisits[0]?.serviceFrom ?? '')
  return `${first}'s active problem list (${mockDiagnosis.length} conditions):\n\n${lines}\n\nLast updated at visit on ${lastVisit}.`
}

function getVitalReply(first: string): string {
  return `${first}'s most recent vitals (01/18/2024):\n\n• Blood Pressure: 138/88 mmHg — mildly elevated\n• Heart Rate: 76 bpm\n• Respiratory Rate: 16 breaths/min\n• Temperature: 98.4°F\n• O₂ Saturation: 98% on room air\n• Weight: 192 lbs | Height: 5\'9" | BMI: 28.4\n\nBlood pressure trending above goal (<130/80). Flagged for PCP review at upcoming visit 03/25/2024.`
}

function getLabReply(first: string): string {
  return `${first}'s most recent lab results (02/01/2024):\n\n• HbA1c: 7.8% — above target (goal <7.0%) ⚠️\n• Fasting Glucose: 148 mg/dL — elevated\n• LDL Cholesterol: 112 mg/dL — borderline high\n• HDL Cholesterol: 42 mg/dL\n• Triglycerides: 168 mg/dL\n• eGFR: 74 mL/min/1.73m² — Stage G2 CKD, monitor\n• Creatinine: 1.1 mg/dL\n\nHbA1c increased from 7.2% (Aug 2023) to 7.8% (Feb 2024). Recommend follow-up on medication adherence and dietary habits.`
}

function getCareGapReply(first: string): string {
  const open = mockGapsInCare.filter(g => g.opportunityStatus === 'Open')
  const closed = mockGapsInCare.filter(g => g.opportunityStatus === 'Closed')
  const openLines = open.map(g =>
    `• ${g.opportunity} (${g.measureCode}) — ${g.ncqaGrouping}\n  ${g.measureDescription}`
  ).join('\n')
  const closedLines = closed.map(g =>
    `• ${g.opportunity} (${g.measureCode}) — Fulfilled`
  ).join('\n')
  return `${first} has ${open.length} open care gap${open.length !== 1 ? 's' : ''} for 2024:\n\n${openLines}\n\nClosed / Fulfilled (${closed.length}):\n${closedLines}\n\nClosing open gaps supports HEDIS compliance and improves the member's star rating.`
}

function getVisitReply(first: string): string {
  const lines = mockVisits.map(v =>
    `• ${fmtDate(v.serviceFrom)} — ${v.visitType}\n  Provider: ${v.providerName}\n  Reason: ${v.reasonForVisit}${v.lengthOfStay ? `\n  Length of stay: ${v.lengthOfStay} day(s)` : ''}`
  ).join('\n')
  const erVisits = mockVisits.filter(v => v.visitType.toLowerCase().includes('emergency') || v.visitType.toLowerCase().includes('er'))
  const inpatient = mockVisits.filter(v => v.visitType.toLowerCase().includes('inpatient'))
  return `${first}'s visit history (${mockVisits.length} encounters):\n\n${lines}\n\nER visits: ${erVisits.length} | Inpatient stays: ${inpatient.length}`
}

function getCarePlanReply(first: string): string {
  const active = mockCarePlan.filter(c => c.status !== 'Closed')
  const goalLines = active.map(c =>
    `• [${c.status}] ${c.goal}\n  Category: ${c.category} · Target: ${fmtDate(c.targetDate)}`
  ).join('\n')
  const interventionLines = active.map(c => `• ${c.intervention}`).join('\n')
  const allBarriers = active.flatMap(c => c.barriers).filter(b => b.status === 'Active')
  const barrierLines = allBarriers.length
    ? allBarriers.map(b => `• ${b.barrier} (${b.type})`).join('\n')
    : '• None documented'
  return `${first}'s active care plan (${active.length} goals):\n\nGoals:\n${goalLines}\n\nInterventions:\n${interventionLines}\n\nActive barriers:\n${barrierLines}`
}

function getProgramReply(first: string): string {
  const active = mockPrograms.filter(p => p.status === 'Active')
  const eligible = mockPrograms.filter(p => p.status.startsWith('Eligible'))
  const activeLines = active.map(p =>
    `✓ ${p.program}\n  Enrolled: ${fmtDate(p.startDate)} · ${p.statusDescription}`
  ).join('\n')
  const eligibleLines = eligible.map(p =>
    `• ${p.program}\n  ${p.statusDescription}`
  ).join('\n')
  return `${first}'s program enrollment:\n\nActive (${active.length}):\n${activeLines}\n\nEligible – Not Enrolled (${eligible.length}):\n${eligibleLines}\n\nWould you like to initiate an enrollment referral for any of these?`
}

function getAssessmentReply(first: string): string {
  const lines = mockActivitySummary.map(a =>
    `• ${a.assessmentName}\n  Status: ${a.assessmentStatus} · Completed: ${fmtDate(a.assessmentCompletedDateTime)}\n  Score: ${a.assessmentScore} · Outcome: ${a.activityOutcome} · Via: ${a.contactType}`
  ).join('\n')
  return `${first}'s assessment history (${mockActivitySummary.length} completed):\n\n${lines}`
}

function getSdohReply(first: string): string {
  const sdoh = mockActivitySummary.find(a => a.assessmentName.toLowerCase().includes('sdoh'))
  const date = sdoh ? fmtDate(sdoh.assessmentCompletedDateTime) : '12/15/2023'
  return `${first}'s social determinants of health screening (${date}):\n\n• Housing: Stable — renting, no eviction risk reported\n• Food security: ⚠️ At risk — reports skipping meals 2–3×/week\n• Transportation: ⚠️ Barrier — no personal vehicle, relies on family members\n• Employment: Part-time, reports financial stress\n• Social support: Limited — lives alone, minimal support network\n\nCommunity referral submitted to Second Harvest Food Bank (12/15/2023) — follow-up pending.\n\nRecommend flagging transportation as a barrier in the care plan for appointment adherence.`
}

function getImmunizationReply(first: string): string {
  return `${first}'s immunization record:\n\nUp to date:\n✓ Influenza — 10/05/2023\n✓ COVID-19 (primary + bivalent booster) — 09/2023\n✓ Tdap — 2019\n✓ Hepatitis B series — completed 2018\n\nDue / Recommended:\n• Pneumococcal (PPSV23) — indicated for diabetic patients under 65\n• Zoster (Shingrix) — not yet due (age 24)\n\nFlu vaccine current for this season.`
}

function getBehavioralHealthReply(first: string): string {
  const phq = mockActivitySummary.find(a => a.assessmentName.toLowerCase().includes('phq'))
  const bhDx = mockDiagnosis.find(d => d.category === 'Behavioral Health')
  const score = phq?.assessmentScore ?? 6
  const date = phq ? fmtDate(phq.assessmentCompletedDateTime) : '11/20/2023'
  return `${first}'s behavioral health summary:\n\n• Diagnosis: ${bhDx?.condition ?? 'Moderate depression, in remission'} (${bhDx?.diagnosisCode ?? 'F32.4'})\n• Last PHQ-9: Score ${score} (mild) — ${date}\n• PHQ-9 status: ⚠️ Overdue — annual re-screen due\n• Active BH medications: None\n• Last BH provider contact: None in past 12 months\n\nMember reported "mostly okay" at last PCP visit (01/2024). Recommend PHQ-9 at next touchpoint — refer for counseling if score ≥10.`
}

function getContactReply(first: string): string {
  const preferred = mockMemberDetail.phones.find(p => p.isPreferred)
  const alternate = mockMemberDetail.phones.find(p => !p.isPreferred && p.phoneType !== 'Fax')
  const impairments = mockMemberDetail.communicationImpairments.join(', ')
  return `Contact preferences for ${first}:\n\n• Preferred phone: ${preferred?.phoneNumber ?? 'N/A'}\n• Best time to call: ${preferred?.bestTimeToCall ?? 'N/A'}\n• Alternate phone: ${alternate?.phoneNumber ?? 'N/A'}\n• Preferred written language: ${mockMemberDetail.preferredWrittenLanguages.join(', ')}\n• Communication impairments: ${impairments}\n\nLast successful contact: 02/20/2024\nMissed call attempt: 03/10/2024 (morning — no answer)\n\nRecommend calling within the preferred window for best reach.`
}

function getEligibilityReply(first: string): string {
  const primary = mockEligibility.eligibilities.find(e => e.status === 'Active')
  const secondary = mockEligibility.eligibilities.filter(e => e !== primary)
  const secondaryLines = secondary.map(e =>
    `• ${e.eligibilityPath} · ${fmtDate(e.startDate)} – ${fmtDate(e.endDate)} · ${e.status}`
  ).join('\n')
  return `${first}'s coverage details:\n\nPrimary:\n• ${primary?.eligibilityPath ?? 'N/A'}\n• Start: ${fmtDate(primary?.startDate ?? '')} · End: ${fmtDate(primary?.endDate ?? '')}\n• Status: ${primary?.status ?? 'N/A'}${secondaryLines ? `\n\nAdditional coverage:\n${secondaryLines}` : ''}\n\n• Medicare ID: ${mockEligibility.medicareID}\n\nRenewal outreach recommended prior to end date to prevent a lapse.`
}

function getMemberDetailReply(first: string): string {
  const addr = mockMemberDetail.addresses.find(a => a.isPreferred)
  return `${first}'s member details:\n\n• Full name: ${mockMemberDetail.memberFirstName} ${mockMemberDetail.memberMiddleName} ${mockMemberDetail.memberLastName}\n• DOB: ${mockMemberDetail.dateOfBirth} · Gender: ${mockMemberDetail.gender} · Pronouns: ${mockMemberDetail.preferredPronouns}\n• Primary language: ${mockMemberDetail.primaryLanguage}\n• Preferred written language: ${mockMemberDetail.preferredWrittenLanguages.join(', ')}\n• Address: ${addr?.address1 ?? 'N/A'}, ${addr?.city}, ${addr?.state} ${addr?.zip}\n• Assigned care manager: ${mockMemberDetail.assignedCareManager}\n• Status: ${mockMemberDetail.status} · Enrollment: ${mockMemberDetail.enrollment}\n• Ethnicity: ${mockMemberDetail.ethnicity.join(', ')} · Marital status: ${mockMemberDetail.maritalStatus}`
}

function getRiskReply(first: string): string {
  return `${first}'s current risk level: Moderate-High\n\nRisk stratification (2024):\n• Overall risk tier: Tier 3 — Moderate-High\n• Primary drivers:\n  - Uncontrolled Type 2 Diabetes (A1C 7.8%, above goal)\n  - Essential Hypertension (BP 138/88, above target)\n  - CKD Stage G2 (eGFR 74 — monitor for progression)\n  - Hyperlipidemia (LDL 112 mg/dL — borderline high)\n• 30-day readmission risk: Low\n• 12-month hospitalization risk: Moderate\n• Last risk assessment: HRA score 68/100 (02/2024)\n\nRisk is elevated primarily due to multiple uncontrolled chronic conditions. Recommend prioritizing medication adherence and dietary interventions at next outreach.`
}

function getHealthIndicatorReply(first: string): string {
  return `${first}'s last recorded health indicators (02/01/2024):\n\nKey clinical values:\n• HbA1c: 7.8% ⚠️ — above goal (<7.0%), trending up from 7.2% (Aug 2023)\n• Blood Pressure: 138/88 mmHg — mildly elevated\n• eGFR: 74 mL/min/1.73m² — Stage G2 CKD, stable\n• Weight: 192 lbs | BMI: 28.4 — overweight range\n• O₂ Saturation: 98% — within normal limits\n• LDL Cholesterol: 112 mg/dL — borderline high\n\nMost concerning indicator: rising HbA1c trend (+0.6% over 6 months). Recommend medication adherence review and dietary consultation at next contact.`
}

/* ─── Lisa Thompson reply functions ─────────────────────────────────────────── */

function getLisaMedReply(first: string): string {
  const active = lisaMedications.filter(m => m.isCurrent)
  const inactive = lisaMedications.filter(m => !m.isCurrent)
  const lastRecon = active[0]?.lastReconDate ? fmtDate(active[0].lastReconDate) : 'N/A'
  const activeLines = active.map(m =>
    `• ${m.medicationName} ${m.dosage} — ${m.route} ${m.frequency} (${m.diagnosis})`
  ).join('\n')
  const inactiveLines = inactive.map(m =>
    `• ${m.medicationName} ${m.dosage} — discontinued ${fmtDate(m.endDate ?? '')}`
  ).join('\n')
  return `${first}'s medications as of ${lastRecon}:\n\nActive (${active.length}):\n${activeLines}${inactiveLines ? `\n\nInactive / Discontinued:\n${inactiveLines}` : ''}\n\nLast pharmacy reconciliation ${lastRecon}. Please confirm with dispensing pharmacy prior to any clinical decisions.`
}

function getLisaAllergyReply(first: string): string {
  return `${first} has the following documented allergies and intolerances:\n\n• Sulfonamides — Reaction: Rash, urticaria\n• NSAIDs (Ibuprofen, Naproxen) — Contraindicated: GI bleed history and risk of worsening cardiac edema with CHF\n\nNo life-threatening anaphylaxis on record. Last allergy review: 03/10/2024.\n\nNote: Avoid NSAIDs and COX-2 inhibitors given concurrent heart failure and CKD Stage 3.`
}

function getLisaDxReply(first: string): string {
  const lines = lisaDiagnosis.map(d =>
    `• ${d.condition} (${d.diagnosisCode}) — onset ${fmtDate(d.startDate)} · ${d.category} · ${d.level}`
  ).join('\n')
  const lastVisit = fmtDate(lisaVisits[0]?.serviceFrom ?? '')
  return `${first}'s active problem list (${lisaDiagnosis.length} conditions):\n\n${lines}\n\nLast updated at visit on ${lastVisit}.`
}

function getLisaVitalReply(first: string): string {
  return `${first}'s most recent vitals (03/10/2024):\n\n• Blood Pressure: 152/94 mmHg — elevated ⚠️\n• Heart Rate: 88 bpm\n• Respiratory Rate: 18 breaths/min\n• Temperature: 98.2°F\n• O₂ Saturation: 94% on room air — below goal ⚠️ (COPD)\n• Weight: 167 lbs | Height: 5'4" | BMI: 28.7\n\nBlood pressure above target (<130/80). O₂ saturation below 96% goal — monitor for COPD exacerbation. Weight up 3 lbs from last visit — flag for CHF fluid retention.`
}

function getLisaLabReply(first: string): string {
  return `${first}'s most recent lab results (01/15/2024 — 03/10/2024):\n\n• HbA1c: 8.2% — above target (goal <7.5%) ⚠️\n• Fasting Glucose: 172 mg/dL — elevated\n• eGFR: 45 mL/min/1.73m² — CKD Stage 3 (moderate) ⚠️\n• Creatinine: 1.4 mg/dL — elevated\n• LDL Cholesterol: 78 mg/dL — at goal (Atorvastatin therapy)\n• Potassium: 4.1 mEq/L — within range (Furosemide monitoring)\n• BNP: 420 pg/mL — elevated, consistent with CHF ⚠️\n\nHbA1c increased from 7.9% (Oct 2023) to 8.2% (Jan 2024). Dietitian referral recommended. eGFR stable but CKD Stage 3 requires close monitoring — avoid nephrotoxic agents.`
}

function getLisaCareGapReply(first: string): string {
  const open = lisaGapsInCare.filter(g => g.opportunityStatus === 'Open')
  const closed = lisaGapsInCare.filter(g => g.opportunityStatus === 'Closed')
  const openLines = open.map(g =>
    `• ${g.opportunity} (${g.measureCode}) — ${g.ncqaGrouping}\n  ${g.measureDescription}`
  ).join('\n')
  const closedLines = closed.map(g =>
    `• ${g.opportunity} (${g.measureCode}) — Fulfilled`
  ).join('\n')
  return `${first} has ${open.length} open care gap${open.length !== 1 ? 's' : ''} for 2024:\n\n${openLines}\n\nClosed / Fulfilled (${closed.length}):\n${closedLines}\n\nClosing open gaps supports HEDIS compliance and improves the member's star rating.`
}

function getLisaVisitReply(first: string): string {
  const lines = lisaVisits.map(v =>
    `• ${fmtDate(v.serviceFrom)} — ${v.visitType}\n  Provider: ${v.providerName}\n  Reason: ${v.reasonForVisit}${v.lengthOfStay ? `\n  Length of stay: ${v.lengthOfStay} day(s)` : ''}`
  ).join('\n')
  const erVisits = lisaVisits.filter(v => v.visitType.toLowerCase().includes('emergency') || v.visitType.toLowerCase().includes('er'))
  const inpatient = lisaVisits.filter(v => v.visitType.toLowerCase().includes('inpatient'))
  return `${first}'s visit history (${lisaVisits.length} encounters):\n\n${lines}\n\nER visits: ${erVisits.length} | Inpatient stays: ${inpatient.length}`
}

function getLisaCarePlanReply(first: string): string {
  const active = lisaCarePlan.filter(c => c.status !== 'Closed')
  const goalLines = active.map(c =>
    `• [${c.status}] ${c.goal}\n  Category: ${c.category} · Target: ${fmtDate(c.targetDate)}`
  ).join('\n')
  const interventionLines = active.map(c => `• ${c.intervention}`).join('\n')
  const allBarriers = active.flatMap(c => c.barriers).filter(b => b.status === 'Active')
  const barrierLines = allBarriers.length
    ? allBarriers.map(b => `• ${b.barrier} (${b.type})`).join('\n')
    : '• None documented'
  return `${first}'s active care plan (${active.length} goals):\n\nGoals:\n${goalLines}\n\nInterventions:\n${interventionLines}\n\nActive barriers:\n${barrierLines}`
}

function getLisaProgramReply(first: string): string {
  const active = lisaPrograms.filter(p => p.status === 'Active')
  const eligible = lisaPrograms.filter(p => p.status.startsWith('Eligible'))
  const activeLines = active.map(p =>
    `✓ ${p.program}\n  Enrolled: ${fmtDate(p.startDate)} · ${p.statusDescription}`
  ).join('\n')
  const eligibleLines = eligible.map(p =>
    `• ${p.program}\n  ${p.statusDescription}`
  ).join('\n')
  return `${first}'s program enrollment:\n\nActive (${active.length}):\n${activeLines}\n\nEligible – Not Enrolled (${eligible.length}):\n${eligibleLines}\n\nWould you like to initiate an enrollment referral for any of these?`
}

function getLisaAssessmentReply(first: string): string {
  const lines = lisaActivitySummary.map(a =>
    `• ${a.assessmentName}\n  Status: ${a.assessmentStatus} · Completed: ${fmtDate(a.assessmentCompletedDateTime)}\n  Score: ${a.assessmentScore} · Outcome: ${a.activityOutcome} · Via: ${a.contactType}`
  ).join('\n')
  return `${first}'s assessment history (${lisaActivitySummary.length} completed):\n\n${lines}`
}

function getLisaSdohReply(first: string): string {
  const sdoh = lisaActivitySummary.find(a => a.assessmentName.toLowerCase().includes('sdoh'))
  const date = sdoh ? fmtDate(sdoh.assessmentCompletedDateTime) : '01/20/2024'
  return `${first}'s social determinants of health screening (${date}):\n\n• Housing: Stable — owns home, no housing risk reported\n• Food security: Adequate — no food insecurity identified\n• Transportation: Managed — daughter Rachel provides transportation for medical appointments\n• Social support: Limited — widowed, lives alone; daughter visits weekly\n• Employment: Retired\n\nSDOH score: 2/10 (low risk overall). Primary social concern is social isolation — member lives alone and widowed.\n\nRecommend discussing senior community programs or telehealth check-ins to address isolation.`
}

function getLisaImmunizationReply(first: string): string {
  return `${first}'s immunization record:\n\nUp to date:\n✓ COVID-19 (primary + bivalent booster) — 09/2023\n✓ Pneumococcal (PCV15 + PPSV23) — 2023 (indicated for CHF, COPD, and diabetes)\n✓ Zoster (Shingrix series) — completed 2022\n✓ Tdap — 2018\n\nDue / Overdue:\n⚠️ Influenza — open care gap, no flu vaccine documented for current season\n\nRecommend scheduling influenza vaccine at next encounter — high-risk member (CHF, COPD, diabetes, age 57).`
}

function getLisaBehavioralHealthReply(first: string): string {
  const phq = lisaActivitySummary.find(a => a.assessmentName.toLowerCase().includes('phq'))
  const bhDx = lisaDiagnosis.find(d => d.category === 'Behavioral Health')
  const score = phq?.assessmentScore ?? 9
  const date = phq ? fmtDate(phq.assessmentCompletedDateTime) : '02/14/2024'
  return `${first}'s behavioral health summary:\n\n• Diagnosis: ${bhDx?.condition ?? 'Generalized Anxiety Disorder'} (${bhDx?.diagnosisCode ?? 'F41.1'})\n• Last PHQ-9: Score ${score} (moderate) — ${date}\n• Current BH medications: Sertraline 50mg (prescribed by Dr. Williams)\n• BH provider: None — self-managed with medication\n\nGAD-7 not yet administered — care plan task due at next touchpoint. Member reports anxiety worsens around medical appointments. Currently stable on Sertraline.\n\nRecommend administering GAD-7 and reviewing with PCP. Telehealth therapy referral if score increases.`
}

function getLisaContactReply(first: string): string {
  const preferred = lisaMemberDetail.phones.find(p => p.isPreferred)
  const alternate = lisaMemberDetail.phones.find(p => !p.isPreferred && p.phoneType !== 'Fax')
  const impairments = lisaMemberDetail.communicationImpairments.join(', ')
  return `Contact preferences for ${first}:\n\n• Preferred phone: ${preferred?.phoneNumber ?? 'N/A'}\n• Best time to call: ${preferred?.bestTimeToCall ?? 'N/A'}\n• Alternate phone: ${alternate?.phoneNumber ?? 'N/A'}\n• Preferred written language: ${lisaMemberDetail.preferredWrittenLanguages.join(', ')}\n• Communication impairments: ${impairments}\n\nLast successful contact: 03/10/2024\n\nRecommend calling within the preferred morning window. Member may have difficulty hearing — speak clearly and confirm understanding.`
}

function getLisaEligibilityReply(first: string): string {
  const primary = lisaEligibility.eligibilities.find(e => e.status === 'Active')
  const secondary = lisaEligibility.eligibilities.filter(e => e !== primary)
  const secondaryLines = secondary.map(e =>
    `• ${e.eligibilityPath} · ${fmtDate(e.startDate)} – ${fmtDate(e.endDate)} · ${e.status}`
  ).join('\n')
  return `${first}'s coverage details:\n\nPrimary:\n• ${primary?.eligibilityPath ?? 'N/A'}\n• Start: ${fmtDate(primary?.startDate ?? '')} · End: ${fmtDate(primary?.endDate ?? '')}\n• Status: ${primary?.status ?? 'N/A'}${secondaryLines ? `\n\nAdditional coverage:\n${secondaryLines}` : ''}\n\n• Medicare ID: ${lisaEligibility.medicareID}\n\nDual-eligible (Medicare + Medicaid DSNP). Renewal outreach recommended prior to year-end to prevent a lapse.`
}

function getLisaMemberDetailReply(first: string): string {
  const addr = lisaMemberDetail.addresses.find(a => a.isPreferred)
  return `${first}'s member details:\n\n• Full name: ${lisaMemberDetail.memberFirstName} ${lisaMemberDetail.memberMiddleName} ${lisaMemberDetail.memberLastName}\n• DOB: ${lisaMemberDetail.dateOfBirth} · Gender: ${lisaMemberDetail.gender} · Pronouns: ${lisaMemberDetail.preferredPronouns}\n• Primary language: ${lisaMemberDetail.primaryLanguage}\n• Preferred written language: ${lisaMemberDetail.preferredWrittenLanguages.join(', ')}\n• Address: ${addr?.address1 ?? 'N/A'}, ${addr?.city}, ${addr?.state} ${addr?.zip}\n• Assigned care manager: ${lisaMemberDetail.assignedCareManager}\n• Status: ${lisaMemberDetail.status} · Enrollment: ${lisaMemberDetail.enrollment}\n• Ethnicity: ${lisaMemberDetail.ethnicity.join(', ')} · Marital status: ${lisaMemberDetail.maritalStatus}`
}

function getLisaRiskReply(first: string): string {
  return `${first}'s current risk level: High\n\nRisk stratification (2024):\n• Overall risk tier: Tier 4 — High\n• Primary drivers:\n  - Recent CHF hospitalization (12/2023 — 3-day inpatient stay)\n  - COPD with below-goal O₂ saturation (94% on room air)\n  - Uncontrolled Type 2 Diabetes (A1C 8.2%, above goal)\n  - CKD Stage 3 (eGFR 45 — moderate impairment)\n  - Social isolation (widowed, lives alone)\n• 30-day CHF readmission risk: High ⚠️\n• 12-month hospitalization risk: High\n• Last risk assessment: HRA score 85/100 (03/2024)\n\nMember is high-priority for proactive outreach. CHF readmission prevention is the primary care plan focus — monitor daily weight and fluid intake closely.`
}

function getLisaHealthIndicatorReply(first: string): string {
  return `${first}'s last recorded health indicators (03/10/2024):\n\nKey clinical values:\n• BNP: 420 pg/mL ⚠️ — elevated, consistent with active CHF\n• O₂ Saturation: 94% ⚠️ — below goal (≥96%), monitor for COPD exacerbation\n• Blood Pressure: 152/94 mmHg ⚠️ — above target (<130/80)\n• Weight: 167 lbs — up 3 lbs from last visit (fluid retention risk)\n• HbA1c: 8.2% ⚠️ — above goal (<7.5%), trending up\n• eGFR: 45 mL/min/1.73m² — CKD Stage 3, stable but requires monitoring\n\nMost concerning indicator: elevated BNP combined with weight gain — early signs of possible CHF decompensation. Recommend daily weight check reminder and fluid restriction education at next contact.`
}

function getLisaReply(q: string, first: string): string {
  if (matches(q, RISK_TERMS)) return getLisaRiskReply(first)
  if (matches(q, HEALTH_INDICATOR_TERMS)) return getLisaHealthIndicatorReply(first)
  if (matches(q, ALLERGY_TERMS)) return getLisaAllergyReply(first)
  if (matches(q, VITAL_TERMS)) return getLisaVitalReply(first)
  if (matches(q, LAB_TERMS)) return getLisaLabReply(first)
  if (matches(q, MED_TERMS)) return getLisaMedReply(first)
  if (matches(q, BEHAVIORAL_HEALTH_TERMS)) return getLisaBehavioralHealthReply(first)
  if (matches(q, SDOH_TERMS)) return getLisaSdohReply(first)
  if (matches(q, IMMUNIZATION_TERMS)) return getLisaImmunizationReply(first)
  if (matches(q, CARE_GAP_TERMS)) return getLisaCareGapReply(first)
  if (matches(q, ASSESSMENT_TERMS)) return getLisaAssessmentReply(first)
  if (matches(q, CARE_PLAN_TERMS)) return getLisaCarePlanReply(first)
  if (matches(q, PROGRAM_TERMS)) return getLisaProgramReply(first)
  if (matches(q, VISIT_TERMS)) return getLisaVisitReply(first)
  if (matches(q, ELIGIBILITY_TERMS)) return getLisaEligibilityReply(first)
  if (matches(q, CONTACT_TERMS)) return getLisaContactReply(first)
  if (matches(q, DIAGNOSIS_TERMS)) return getLisaDxReply(first)
  if (matches(q, MEMBER_DETAIL_TERMS)) return getLisaMemberDetailReply(first)
  return `I'm here to help with ${first}'s clinical information. Here are some things you can ask:\n\n• Medication list or allergies\n• Active diagnoses or problem list\n• Recent labs or vitals\n• Care gaps or HEDIS measures\n• Care plan goals and interventions\n• Visits or appointments\n• Programs enrolled or eligible\n• Assessments or screenings\n• Social determinants of health\n• Immunizations or behavioral health\n• Contact preferences or eligibility`
}

/* ─── Main export ───────────────────────────────────────────────────────────── */

export function getMockReply(input: string, memberName: string, memberId = 'AH0000007'): string {
  const q = input.toLowerCase()
  const first = memberName.split(' ')[0]

  if (memberId === 'AH0000023') return getLisaReply(q, first)

  // Risk level
  if (matches(q, RISK_TERMS)) return getRiskReply(first)

  // Health indicators
  if (matches(q, HEALTH_INDICATOR_TERMS)) return getHealthIndicatorReply(first)

  // Allergies — check before medications to avoid false positives
  if (matches(q, ALLERGY_TERMS)) return getAllergyReply(first)

  // Vitals — check before labs/bp overlap
  if (matches(q, VITAL_TERMS)) return getVitalReply(first)

  // Labs — check before diagnosis (cholesterol/glucose overlap)
  if (matches(q, LAB_TERMS)) return getLabReply(first)

  // Medications
  if (matches(q, MED_TERMS)) return getMedReply(first)

  // Behavioral health — check before SDOH (depression/anxiety overlap)
  if (matches(q, BEHAVIORAL_HEALTH_TERMS)) return getBehavioralHealthReply(first)

  // SDOH — check before general social/program
  if (matches(q, SDOH_TERMS)) return getSdohReply(first)

  // Immunizations
  if (matches(q, IMMUNIZATION_TERMS)) return getImmunizationReply(first)

  // Care gaps
  if (matches(q, CARE_GAP_TERMS)) return getCareGapReply(first)

  // Assessments — check before programs/care plan
  if (matches(q, ASSESSMENT_TERMS)) return getAssessmentReply(first)

  // Care plan
  if (matches(q, CARE_PLAN_TERMS)) return getCarePlanReply(first)

  // Programs
  if (matches(q, PROGRAM_TERMS)) return getProgramReply(first)

  // Visits
  if (matches(q, VISIT_TERMS)) return getVisitReply(first)

  // Eligibility / coverage
  if (matches(q, ELIGIBILITY_TERMS)) return getEligibilityReply(first)

  // Contact
  if (matches(q, CONTACT_TERMS)) return getContactReply(first)

  // Diagnoses (broad — check late to avoid false positives from condition-specific queries above)
  if (matches(q, DIAGNOSIS_TERMS)) return getDxReply(first)

  // Member details / demographics
  if (matches(q, MEMBER_DETAIL_TERMS)) return getMemberDetailReply(first)

  // Fallback
  return `I'm here to help with ${first}'s clinical information. Here are some things you can ask:\n\n• Medication list or allergies\n• Active diagnoses or problem list\n• Recent labs or vitals\n• Care gaps or HEDIS measures\n• Care plan goals and interventions\n• Visits or appointments\n• Programs enrolled or eligible\n• Assessments or screenings\n• Social determinants of health\n• Immunizations or behavioral health\n• Contact preferences or eligibility`
}
