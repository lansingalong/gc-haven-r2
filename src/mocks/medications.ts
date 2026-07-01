/**
 * Mock response for /v2/Member/Medication/Manual
 * Member: Jackson Lee Thomas (AH58319473)
 */

export interface Medication {
  medicationClass: string
  medicationName: string
  dosage: string
  frequency: string
  route: string
  startDate: string
  endDate: string | null
  dispensedDate: string
  lastReconDate: string
  prescribedBy: string
  pharmacy: string
  quantity: number
  diagnosis: string
  isCurrent: boolean
  source: string
  takeAsNeededFor?: string
}

export const mockMedications: Medication[] = [
  {
    medicationClass: 'Biguanide',
    medicationName: 'Metformin',
    dosage: '1000mg',
    frequency: 'Twice daily with meals',
    route: 'PO',
    startDate: '2014-09-01',
    endDate: null,
    dispensedDate: '2026-06-01',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 60,
    diagnosis: 'Type 2 Diabetes Mellitus (E11.65)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Long-Acting Insulin',
    medicationName: 'Insulin Glargine (Lantus)',
    dosage: '30 units',
    frequency: 'Once daily at bedtime',
    route: 'Subcutaneous',
    startDate: '2026-05-21',
    endDate: null,
    dispensedDate: '2026-05-22',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Priya Nair',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 5,
    diagnosis: 'Type 2 Diabetes Mellitus with Hyperglycemia (E11.65)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'ACE Inhibitor',
    medicationName: 'Lisinopril',
    dosage: '20mg',
    frequency: 'Once daily',
    route: 'PO',
    startDate: '2016-03-10',
    endDate: null,
    dispensedDate: '2026-06-01',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 30,
    diagnosis: 'Essential Hypertension (I10)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Statin',
    medicationName: 'Atorvastatin',
    dosage: '40mg',
    frequency: 'Once daily at bedtime',
    route: 'PO',
    startDate: '2016-03-10',
    endDate: null,
    dispensedDate: '2026-05-28',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 30,
    diagnosis: 'Hyperlipidemia (E78.5)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Antiplatelet',
    medicationName: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    route: 'PO',
    startDate: '2018-01-15',
    endDate: null,
    dispensedDate: '2026-06-01',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 90,
    diagnosis: 'Cardiovascular risk reduction',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Neuropathic Pain Agent',
    medicationName: 'Gabapentin',
    dosage: '300mg',
    frequency: 'Three times daily',
    route: 'PO',
    startDate: '2023-06-01',
    endDate: null,
    dispensedDate: '2026-05-30',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 90,
    diagnosis: 'Diabetic Peripheral Neuropathy (E11.40)',
    isCurrent: true,
    source: 'Prescribed',
  },
  // Discontinued
  {
    medicationClass: 'Sulfonylurea',
    medicationName: 'Glipizide',
    dosage: '10mg',
    frequency: 'Twice daily',
    route: 'PO',
    startDate: '2018-04-01',
    endDate: '2026-05-21',
    dispensedDate: '2026-03-15',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Angela Reeves',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 60,
    diagnosis: 'Type 2 Diabetes Mellitus (E11.65)',
    isCurrent: false,
    source: 'Prescribed',
  },
  {
    medicationClass: 'GLP-1 Receptor Agonist',
    medicationName: 'Semaglutide (Ozempic)',
    dosage: '0.5mg',
    frequency: 'Once weekly',
    route: 'Subcutaneous',
    startDate: '2024-02-01',
    endDate: '2025-11-30',
    dispensedDate: '2025-10-01',
    lastReconDate: '2026-06-10',
    prescribedBy: 'Dr. Priya Nair',
    pharmacy: 'Walgreens – Nashville, TN',
    quantity: 4,
    diagnosis: 'Type 2 Diabetes Mellitus (E11.65)',
    isCurrent: false,
    source: 'Prescribed',
  },
]
