import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface AssessmentRow {
  submissionId: string
  assessmentName: string
  assessmentStatus: string
  completedDate: string
  performedBy: string
  contactType: string
  score: number
  outcome: string
  duration: number
  programName: string
}

export interface AssessmentsCardData {
  memberFirstName: string
  assessments: AssessmentRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function scoreColor(name: string, score: number): string {
  const lc = name.toLowerCase()
  if (lc.includes('phq')) {
    if (score >= 10) return styles.scoreHigh
    if (score >= 5) return styles.scoreMedium
    return styles.scoreGood
  }
  if (score >= 70) return styles.scoreMedium
  if (score >= 50) return styles.scoreGood
  return styles.scoreHigh
}

export function AssessmentsCard({ data }: { data: AssessmentsCardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const most = data.assessments[0]

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Assessments</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit assessments">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy assessments">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Total completed</span>
              <div className={styles.activeValue}>
                <Icon name="CheckCircle" size="sm" aria-hidden />
                {data.assessments.length}
              </div>
            </div>
            {most && (
              <>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Most recent</span>
                  <span className={styles.fieldValue}>{fmtDate(most.completedDate)}</span>
                </div>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.fieldLabel}>Latest assessment</span>
                  <span className={styles.fieldValue}>{most.assessmentName}</span>
                </div>
              </>
            )}
          </div>

          <hr className={styles.sectionDivider} />
          <div className={styles.sectionTitle}>Completed Assessments</div>

          {data.assessments.map((a, idx) => {
            const isOpen = expanded === idx
            const panelId = `assess-panel-${idx}`
            return (
              <div key={idx} className={styles.itemBlock}>
                <div className={styles.itemHeader}>
                  <div>
                    <div className={styles.itemTitle}>
                      <span style={{ color: 'var(--color-success)', marginRight: 6, display: 'inline-flex', verticalAlign: 'middle' }}>
                        <Icon name="CheckCircle" size="xs" aria-hidden />
                      </span>
                      {a.assessmentName}
                    </div>
                    <div className={styles.itemSubtitle}>{fmtDate(a.completedDate)} · {a.contactType} · {a.programName}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`${styles.scoreChip} ${scoreColor(a.assessmentName, a.score)}`}>Score: {a.score}</span>
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
                    <div className={styles.field}><span className={styles.fieldLabel}>Status</span><span className={styles.fieldValueSm}>{a.assessmentStatus}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Outcome</span><span className={styles.fieldValueSm}>{a.outcome}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Performed by</span><span className={styles.fieldValueSm}>{a.performedBy}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Duration</span><span className={styles.fieldValueSm}>{a.duration} min</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Contact type</span><span className={styles.fieldValueSm}>{a.contactType}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Program</span><span className={styles.fieldValueSm}>{a.programName}</span></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className={styles.footerNote}>Generated from GC Assessment API · Updated automatically</p>
      </div>
    </div>
  )
}
