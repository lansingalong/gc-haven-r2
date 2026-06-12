/**
 * Mock response for /v2/Member/Medication/Manual
 * Member: Henry Tom Garcia (AH0000007)
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
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'PO',
    startDate: '2019-03-15',
    endDate: null,
    dispensedDate: '2024-02-01',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Reyes',
    pharmacy: 'CVS Pharmacy – Reston, VA',
    quantity: 60,
    diagnosis: 'Type 2 Diabetes Mellitus (E11.9)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'ACE Inhibitor',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'PO',
    startDate: '2020-06-01',
    endDate: null,
    dispensedDate: '2024-02-01',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Reyes',
    pharmacy: 'CVS Pharmacy – Reston, VA',
    quantity: 30,
    diagnosis: 'Essential Hypertension (I10)',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Statin',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    route: 'PO',
    startDate: '2020-06-01',
    endDate: null,
    dispensedDate: '2024-02-01',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Patel',
    pharmacy: 'CVS Pharmacy – Reston, VA',
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
    startDate: '2020-06-01',
    endDate: null,
    dispensedDate: '2024-02-01',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Reyes',
    pharmacy: 'CVS Pharmacy – Reston, VA',
    quantity: 30,
    diagnosis: 'Cardiovascular prophylaxis',
    isCurrent: true,
    source: 'Prescribed',
  },
  {
    medicationClass: 'Short-Acting Beta Agonist',
    medicationName: 'Albuterol',
    dosage: '90mcg',
    frequency: 'Every 4–6 hrs as needed',
    route: 'Inhalation',
    startDate: '2015-04-10',
    endDate: null,
    dispensedDate: '2024-01-15',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Nguyen',
    pharmacy: 'CVS Pharmacy – Reston, VA',
    quantity: 1,
    diagnosis: 'Mild persistent asthma (J45.30)',
    isCurrent: true,
    source: 'Prescribed',
    takeAsNeededFor: 'Asthma / shortness of breath',
  },
  {
    medicationClass: 'SSRI',
    medicationName: 'Sertraline',
    dosage: '50mg',
    frequency: 'Once daily',
    route: 'PO',
    startDate: '2022-03-01',
    endDate: '2023-09-01',
    dispensedDate: '2023-08-01',
    lastReconDate: '2024-02-14',
    prescribedBy: 'Dr. Williams',
    pharmacy: 'Walgreens – Reston, VA',
    quantity: 30,
    diagnosis: 'Moderate depression (F32.4)',
    isCurrent: false,
    source: 'Prescribed',
  },
]
