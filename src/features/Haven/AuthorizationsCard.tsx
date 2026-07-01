import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface VisitClaimRow {
  visitType: string
  serviceFrom: string
  serviceTo: string
  reasonForVisit: string
  providerName: string
  procedureCode: string
  diagnosisCode: string
  payor: string
  lengthOfStay: number | null
}

export interface AuthorizationsCardData {
  memberFirstName: string
  claims: VisitClaimRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function visitIcon(vt: string): string {
  const lc = vt.toLowerCase()
  if (lc.includes('emergency') || lc.includes('er')) return 'LocalHospital'
  if (lc.includes('inpatient')) return 'SingleBed'
  if (lc.includes('telehealth') || lc.includes('virtual')) return 'Videocam'
  return 'MedicalServices'
}

function visitBadgeClass(vt: string): string {
  const lc = vt.toLowerCase()
  if (lc.includes('emergency') || lc.includes('er')) return styles.badgeHigh
  if (lc.includes('inpatient')) return styles.badgeWarning
  return styles.badgePending
}

export function AuthorizationsCard({ data }: { data: AuthorizationsCardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const erVisits = data.claims.filter(c => c.visitType.toLowerCase().includes('emergency') || c.visitType.toLowerCase().includes('er'))
  const inpatient = data.claims.filter(c => c.visitType.toLowerCase().includes('inpatient'))

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Authorizations & Claims</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit authorizations">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy authorizations">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Total encounters</span>
              <span className={styles.fieldValue}>{data.claims.length}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>ER visits</span>
              <span className={styles.fieldValue} style={{ color: erVisits.length > 0 ? 'var(--color-error)' : undefined }}>
                {erVisits.length}
              </span>
            </div>
            {inpatient.length > 0 && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Inpatient stays</span>
                <span className={styles.fieldValue}>{inpatient.length}</span>
              </div>
            )}
          </div>

          <hr className={styles.sectionDivider} />
          <div className={styles.sectionTitle}>Encounter History</div>

          {data.claims.map((c, idx) => {
            const isOpen = expanded === idx
            const panelId = `auth-panel-${idx}`
            return (
              <div key={idx} className={styles.itemBlock}>
                <div className={styles.itemHeader}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: 'var(--color-text-secondary)', marginTop: 1, display: 'flex' }}>
                      <Icon name={visitIcon(c.visitType)} size="sm" aria-hidden />
                    </span>
                    <div>
                      <div className={styles.itemTitle}>{c.visitType}</div>
                      <div className={styles.itemSubtitle}>{fmtDate(c.serviceFrom)} · {c.payor}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`${styles.badge} ${visitBadgeClass(c.visitType)}`}>{c.procedureCode}</span>
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
                  <div id={panelId} className={styles.fieldGridFull} style={{ marginTop: 12 }}>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Reason for visit</span>
                      <span className={styles.fieldValueSm}>{c.reasonForVisit}</span>
                    </div>
                    <div className={styles.fieldGrid}>
                      <div className={styles.field}><span className={styles.fieldLabel}>Provider</span><span className={styles.fieldValueSm}>{c.providerName}</span></div>
                      <div className={styles.field}><span className={styles.fieldLabel}>Diagnosis</span><span className={styles.fieldValueSm}>{c.diagnosisCode}</span></div>
                      <div className={styles.field}><span className={styles.fieldLabel}>Service dates</span><span className={styles.fieldValueSm}>{fmtDate(c.serviceFrom)}{c.serviceTo !== c.serviceFrom ? ` – ${fmtDate(c.serviceTo)}` : ''}</span></div>
                      {c.lengthOfStay != null && (
                        <div className={styles.field}><span className={styles.fieldLabel}>Length of stay</span><span className={styles.fieldValueSm}>{c.lengthOfStay} day{c.lengthOfStay !== 1 ? 's' : ''}</span></div>
                      )}
                      <div className={styles.field}><span className={styles.fieldLabel}>Payor</span><span className={styles.fieldValueSm}>{c.payor}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className={styles.footerNote}>Generated from GC Claims/Visits API · Confirm with billing for prior authorization status</p>
      </div>
    </div>
  )
}
