import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface ActivityRow {
  activityType: string
  scriptName: string
  dueDate: string
  status: string
  contactType: string
  outcomeType: string
  programName: string
}

export interface OutstandingActivitiesCardData {
  memberFirstName: string
  activities: ActivityRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

const TYPE_ICON: Record<string, string> = {
  Assessment: 'Assignment',
  Outreach: 'Phone',
  Education: 'School',
  'Follow-up': 'Replay',
  'Care Plan Review': 'Assignment',
}

export function OutstandingActivitiesCard({ data }: { data: OutstandingActivitiesCardData }) {
  const pending = data.activities.filter(a => a.status === 'Pending')
  const completed = data.activities.filter(a => a.status === 'Completed')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Outstanding Activities</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit activities">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy activities">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Pending</span>
              <span className={styles.fieldValue} style={{ color: pending.length > 0 ? 'var(--color-warning)' : undefined }}>
                {pending.length} activit{pending.length !== 1 ? 'ies' : 'y'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Completed</span>
              {completed.length > 0
                ? <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />{completed.length}</div>
                : <span className={styles.fieldValue}>0</span>
              }
            </div>
          </div>

          {pending.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Pending ({pending.length})</div>
              {pending.map((a, idx) => (
                <div key={idx} className={styles.activityRow}>
                  <div className={styles.activityIcon}>
                    <Icon name={TYPE_ICON[a.activityType] ?? 'Event'} size="sm" color="primary" aria-hidden />
                  </div>
                  <div className={styles.activityBody}>
                    <div className={styles.activityTitle}>{a.scriptName}</div>
                    <div className={styles.activityMeta}>
                      <span>{a.activityType}</span>
                      <span className={styles.activitySep}>·</span>
                      <span>{a.contactType}</span>
                      <span className={styles.activitySep}>·</span>
                      <span>{a.programName}</span>
                    </div>
                  </div>
                  <div className={styles.activityRight}>
                    <span className={styles.activityDue}>Due {fmtDate(a.dueDate)}</span>
                    <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {completed.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Completed ({completed.length})</div>
              {completed.map((a, idx) => (
                <div key={idx} className={styles.activityRow}>
                  <div className={styles.activityIcon}>
                    <Icon name={TYPE_ICON[a.activityType] ?? 'Event'} size="sm" color="action" aria-hidden />
                  </div>
                  <div className={styles.activityBody}>
                    <div className={styles.activityTitle}>
                      <span style={{ color: 'var(--color-success)', marginRight: 6, display: 'inline-flex', verticalAlign: 'middle' }}>
                        <Icon name="CheckCircle" size="xs" aria-hidden />
                      </span>
                      {a.scriptName}
                    </div>
                    <div className={styles.activityMeta}>
                      <span>{a.activityType}</span>
                      <span className={styles.activitySep}>·</span>
                      <span>{a.programName}</span>
                    </div>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeDone}`}>Completed</span>
                </div>
              ))}
            </>
          )}

          {data.activities.length === 0 && (
            <div className={styles.emptyState}>
              <Icon name="CheckCircle" size="md" color="action" />
              <span>No outstanding activities</span>
            </div>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Activity Summary API · Updated automatically</p>
      </div>
    </div>
  )
}
