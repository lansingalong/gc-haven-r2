import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface MedicationRow {
  medicationName: string
  dosage: string
  frequency: string
  route: string
  diagnosis: string
  prescribedBy: string
  lastReconDate: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  source: string
  pharmacy: string
  medicationClass: string
}

export interface MedicationsCardData {
  memberFirstName: string
  medications: MedicationRow[]
  lastReconDate?: string
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export function MedicationsCard({ data }: { data: MedicationsCardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const active = data.medications.filter(m => m.isCurrent)
  const inactive = data.medications.filter(m => !m.isCurrent)
  const lastRecon = data.lastReconDate ?? active[0]?.lastReconDate

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Medications</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit medications">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy medications">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Active medications</span>
              <div className={styles.activeValue}>
                <Icon name="CheckCircle" size="sm" aria-hidden />
                {active.length} active
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Discontinued</span>
              <span className={styles.fieldValue}>{inactive.length}</span>
            </div>
            {lastRecon && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Last reconciled</span>
                <span className={styles.fieldValue}>{fmtDate(lastRecon)}</span>
              </div>
            )}
          </div>

          {active.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Active ({active.length})</div>
              {active.map((m, idx) => {
                const isOpen = expanded === idx
                const panelId = `med-active-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>
                          <span style={{ color: 'var(--color-success)', marginRight: 6, display: 'inline-flex', verticalAlign: 'middle' }}>
                            <Icon name="CheckCircle" size="xs" aria-hidden />
                          </span>
                          {m.medicationName} {m.dosage}
                        </div>
                        <div className={styles.itemSubtitle}>{m.frequency} · {m.medicationClass}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setExpanded(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          aria-label={isOpen ? 'Collapse' : 'Expand'}
                        >
                          <Icon name={isOpen ? 'ExpandMore' : 'ChevronRight'} size="xs" aria-hidden />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div id={panelId} className={styles.fieldGrid} style={{ marginTop: 12 }}>
                        <div className={styles.field}><span className={styles.fieldLabel}>Route</span><span className={styles.fieldValueSm}>{m.route}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Prescribed by</span><span className={styles.fieldValueSm}>{m.prescribedBy}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Pharmacy</span><span className={styles.fieldValueSm}>{m.pharmacy}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Diagnosis</span><span className={styles.fieldValueSm}>{m.diagnosis}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Start date</span><span className={styles.fieldValueSm}>{fmtDate(m.startDate)}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Last recon</span><span className={styles.fieldValueSm}>{fmtDate(m.lastReconDate)}</span></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {inactive.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Discontinued ({inactive.length})</div>
              {inactive.map((m, idx) => {
                const key = active.length + idx
                const isOpen = expanded === key
                const panelId = `med-inactive-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>{m.medicationName} {m.dosage}</div>
                        <div className={styles.itemSubtitle}>Discontinued {fmtDate(m.endDate ?? '')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${styles.badgeInactive}`}>Discontinued</span>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => setExpanded(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          aria-label={isOpen ? 'Collapse' : 'Expand'}
                        >
                          <Icon name={isOpen ? 'ExpandMore' : 'ChevronRight'} size="xs" aria-hidden />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div id={panelId} className={styles.fieldGrid} style={{ marginTop: 12 }}>
                        <div className={styles.field}><span className={styles.fieldLabel}>Diagnosis</span><span className={styles.fieldValueSm}>{m.diagnosis}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Prescribed by</span><span className={styles.fieldValueSm}>{m.prescribedBy}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>End date</span><span className={styles.fieldValueSm}>{fmtDate(m.endDate ?? '')}</span></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Medication API · Verify with dispensing pharmacy before clinical decisions</p>
      </div>
    </div>
  )
}
