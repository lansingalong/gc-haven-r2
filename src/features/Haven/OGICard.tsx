import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface OGIRow {
  category: string
  opportunity: string
  goal: string
  intervention: string
  status: string
  priority: string
  targetDate: string
  term: string
  barriers: string[]
}

export interface OGICardData {
  memberFirstName: string
  ogis: OGIRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function statusBadgeClass(s: string): string {
  if (s === 'Completed' || s === 'Closed') return styles.badgeDone
  if (s === 'In Progress') return styles.badgeInProgress
  if (s === 'New') return styles.badgeNew
  return styles.badgePending
}

export function OGICard({ data }: { data: OGICardData }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const active = data.ogis.filter(o => o.status !== 'Closed')
  const shortTerm = active.filter(o => o.term === 'Short-term')
  const longTerm = active.filter(o => o.term !== 'Short-term')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Opportunities, Goals & Interventions</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit OGIs">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy OGIs">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Active OGIs</span>
              <div className={styles.activeValue}>
                <Icon name="CheckCircle" size="sm" aria-hidden />
                {active.length} active
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Care categories</span>
              <span className={styles.fieldValue}>{new Set(active.map(o => o.category)).size}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Short-term</span>
              <span className={styles.fieldValue}>{shortTerm.length}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Long-term</span>
              <span className={styles.fieldValue}>{longTerm.length}</span>
            </div>
          </div>

          {[{ label: 'Short-term', items: shortTerm }, { label: 'Long-term', items: longTerm }].map(group =>
            group.items.length > 0 && (
              <div key={group.label}>
                <hr className={styles.sectionDivider} />
                <div className={styles.sectionTitle}>{group.label}</div>
                {group.items.map((ogi) => {
                  const absIdx = data.ogis.indexOf(ogi)
                  const isOpen = expanded === absIdx
                  const panelId = `ogi-panel-${absIdx}`
                  return (
                    <div key={absIdx} className={styles.itemBlock}>
                      <div className={styles.itemHeader}>
                        <div>
                          <div className={styles.itemTitle}>{ogi.opportunity}</div>
                          <div className={styles.itemSubtitle}>{ogi.category} · Target {fmtDate(ogi.targetDate)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`${styles.badge} ${statusBadgeClass(ogi.status)}`}>{ogi.status}</span>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => setExpanded(isOpen ? null : absIdx)}
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
                            <span className={styles.fieldLabel}>Goal</span>
                            <span className={styles.fieldValueSm}>{ogi.goal}</span>
                          </div>
                          <div className={styles.field}>
                            <span className={styles.fieldLabel}>Intervention</span>
                            <span className={styles.fieldValueSm}>{ogi.intervention}</span>
                          </div>
                          {ogi.barriers.length > 0 && (
                            <div className={styles.field}>
                              <span className={styles.fieldLabel}>Active barriers</span>
                              <span className={styles.fieldValueSm}>{ogi.barriers.join(' · ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Plan of Care API · Updated automatically</p>
      </div>
    </div>
  )
}
