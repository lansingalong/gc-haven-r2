import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface CareGapRow {
  opportunity: string
  measureCode: string
  measureCategory: string
  ncqaGrouping: string
  measureDescription: string
  opportunityStatus: 'Open' | 'Closed'
  identifiedDate: string
  updatedOn: string
}

export interface CareGapsCardData {
  memberFirstName: string
  gaps: CareGapRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export function CareGapsCard({ data }: { data: CareGapsCardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const open = data.gaps.filter(g => g.opportunityStatus === 'Open')
  const closed = data.gaps.filter(g => g.opportunityStatus === 'Closed')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Care Gaps</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit care gaps">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy care gaps">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Open gaps</span>
              <span className={styles.fieldValue} style={{ color: open.length > 0 ? 'var(--color-warning)' : undefined }}>
                {open.length}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Fulfilled</span>
              {closed.length > 0
                ? <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />{closed.length} fulfilled</div>
                : <span className={styles.fieldValue}>0</span>
              }
            </div>
          </div>

          {open.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Open ({open.length})</div>
              {open.map((g, idx) => {
                const isOpen = expanded === idx
                const panelId = `gap-open-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>{g.opportunity}</div>
                        <div className={styles.itemSubtitle}>{g.ncqaGrouping} · {g.measureCode}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>Open</span>
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
                          <span className={styles.fieldLabel}>Description</span>
                          <span className={styles.fieldValueSm}>{g.measureDescription}</span>
                        </div>
                        <div className={styles.fieldGrid}>
                          <div className={styles.field}><span className={styles.fieldLabel}>Category</span><span className={styles.fieldValueSm}>{g.measureCategory}</span></div>
                          <div className={styles.field}><span className={styles.fieldLabel}>Identified</span><span className={styles.fieldValueSm}>{fmtDate(g.identifiedDate)}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {closed.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Fulfilled ({closed.length})</div>
              {closed.map((g, idx) => {
                const key = open.length + idx
                const isOpen = expanded === key
                const panelId = `gap-closed-panel-${idx}`
                return (
                  <div key={idx} className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <div>
                        <div className={styles.itemTitle}>
                          <span style={{ color: 'var(--color-success)', marginRight: 6, display: 'inline-flex', verticalAlign: 'middle' }}>
                            <Icon name="CheckCircle" size="xs" aria-hidden />
                          </span>
                          {g.opportunity}
                        </div>
                        <div className={styles.itemSubtitle}>{g.ncqaGrouping} · {g.measureCode}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.badge} ${styles.badgeDone}`}>Fulfilled</span>
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
                      <div id={panelId} className={styles.fieldGridFull} style={{ marginTop: 12 }}>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Description</span>
                          <span className={styles.fieldValueSm}>{g.measureDescription}</span>
                        </div>
                        <div className={styles.fieldGrid}>
                          <div className={styles.field}><span className={styles.fieldLabel}>Category</span><span className={styles.fieldValueSm}>{g.measureCategory}</span></div>
                          <div className={styles.field}><span className={styles.fieldLabel}>Updated</span><span className={styles.fieldValueSm}>{fmtDate(g.updatedOn)}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Gaps In Care API · Closing gaps supports HEDIS compliance</p>
      </div>
    </div>
  )
}
