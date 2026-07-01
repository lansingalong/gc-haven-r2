import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface ConditionRow {
  diagnosisCode: string
  condition: string
  category: string
  level: string
  startDate: string
  isPrimaryDiagnosis: boolean
  isNew?: boolean
}

export interface ConditionsCardData {
  memberFirstName: string
  conditions: ConditionRow[]
  lastUpdated?: string
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function levelBadgeClass(level: string): string {
  if (level === 'Chronic') return styles.badgeWarning
  if (level === 'Managed') return styles.badgeDone
  return styles.badgePending
}

export function ConditionsCard({ data }: { data: ConditionsCardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const primary = data.conditions.filter(c => c.isPrimaryDiagnosis)
  const secondary = data.conditions.filter(c => !c.isPrimaryDiagnosis)
  const newConditions = data.conditions.filter(c => c.isNew)
  const categories = new Set(data.conditions.map(c => c.category))

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Conditions & Clinical Changes</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit conditions">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy conditions">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Total conditions</span>
              <span className={styles.fieldValue}>{data.conditions.length}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Care categories</span>
              <span className={styles.fieldValue}>{categories.size}</span>
            </div>
            {newConditions.length > 0 && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>New since last review</span>
                <span className={`${styles.badge} ${styles.badgeNew}`} style={{ alignSelf: 'flex-start', marginTop: 2 }}>{newConditions.length} new</span>
              </div>
            )}
            {data.lastUpdated && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Last updated</span>
                <span className={styles.fieldValue}>{fmtDate(data.lastUpdated)}</span>
              </div>
            )}
          </div>

          {primary.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Primary Diagnosis</div>
              {primary.map((c, idx) => {
                const isOpen = expanded === idx
                const panelId = `cond-primary-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>
                          {c.condition}
                          {c.isNew && <span className={`${styles.badge} ${styles.badgeNew}`} style={{ marginLeft: 8 }}>New</span>}
                        </div>
                        <div className={styles.itemSubtitle}>{c.diagnosisCode} · {c.category}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${levelBadgeClass(c.level)}`}>{c.level}</span>
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
                        <div className={styles.field}><span className={styles.fieldLabel}>ICD-10</span><span className={styles.fieldValueSm}>{c.diagnosisCode}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Category</span><span className={styles.fieldValueSm}>{c.category}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Level</span><span className={styles.fieldValueSm}>{c.level}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Onset</span><span className={styles.fieldValueSm}>{fmtDate(c.startDate)}</span></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {secondary.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Secondary Conditions ({secondary.length})</div>
              {secondary.map((c, idx) => {
                const key = primary.length + idx
                const isOpen = expanded === key
                const panelId = `cond-sec-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>
                          {c.condition}
                          {c.isNew && <span className={`${styles.badge} ${styles.badgeNew}`} style={{ marginLeft: 8 }}>New</span>}
                        </div>
                        <div className={styles.itemSubtitle}>{c.diagnosisCode} · {c.category}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${levelBadgeClass(c.level)}`}>{c.level}</span>
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
                        <div className={styles.field}><span className={styles.fieldLabel}>ICD-10</span><span className={styles.fieldValueSm}>{c.diagnosisCode}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Category</span><span className={styles.fieldValueSm}>{c.category}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Level</span><span className={styles.fieldValueSm}>{c.level}</span></div>
                        <div className={styles.field}><span className={styles.fieldLabel}>Onset</span><span className={styles.fieldValueSm}>{fmtDate(c.startDate)}</span></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Diagnosis API · Verify with clinical record</p>
      </div>
    </div>
  )
}
