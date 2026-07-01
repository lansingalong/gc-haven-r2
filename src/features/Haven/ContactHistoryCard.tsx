import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface ContactEntry {
  date: string
  type: 'connected' | 'missed'
  channel: string
  timeOfDay?: string
  summary?: string
}

export interface ContactHistoryCardData {
  memberFirstName: string
  contacts: ContactEntry[]
  preferredPhone: string
  preferredTime: string
  communicationImpairments?: string[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export function ContactHistoryCard({ data }: { data: ContactHistoryCardData }) {
  const connected = data.contacts.filter(c => c.type === 'connected')
  const missed = data.contacts.filter(c => c.type === 'missed')
  const last = data.contacts[0]

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Last Contact & Interaction History</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit contact history">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy contact history">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Last contact</span>
              {last ? (
                last.type === 'connected'
                  ? <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />{fmtDate(last.date)}</div>
                  : <span className={styles.fieldValue}>{fmtDate(last.date)} (no answer)</span>
              ) : (
                <span className={styles.fieldValue}>No record</span>
              )}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Connected / missed</span>
              <span className={styles.fieldValue}>{connected.length} / {missed.length}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Preferred phone</span>
              <span className={styles.fieldValue}>{data.preferredPhone}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Best time to call</span>
              <span className={styles.fieldValue}>{data.preferredTime}</span>
            </div>
            {data.communicationImpairments && data.communicationImpairments.length > 0 && (
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.fieldLabel}>Communication notes</span>
                <span className={styles.fieldValue}>{data.communicationImpairments.join(', ')}</span>
              </div>
            )}
          </div>

          {data.contacts.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Contact History</div>
              {data.contacts.map((c, idx) => (
                <div key={idx} className={styles.contactEntry}>
                  <div className={styles.contactIndicator}>
                    <Icon
                      name={c.type === 'connected' ? 'Phone' : 'PhoneMissed'}
                      size="sm"
                      color={c.type === 'connected' ? 'primary' : 'error'}
                      aria-hidden
                    />
                  </div>
                  <div className={styles.contactBody}>
                    <div className={styles.contactMetaRow}>
                      <span className={styles.contactDate}>{fmtDate(c.date)}</span>
                      <span className={styles.contactSep}>·</span>
                      <span className={styles.contactChannel}>{c.channel}</span>
                      {c.timeOfDay && (
                        <>
                          <span className={styles.contactSep}>·</span>
                          <span className={styles.contactChannel}>{c.timeOfDay}</span>
                        </>
                      )}
                      <span className={`${styles.badge} ${c.type === 'connected' ? styles.badgeActive : styles.badgeInactive}`}>
                        {c.type === 'connected' ? 'Connected' : 'No answer'}
                      </span>
                    </div>
                    {c.summary && <p className={styles.contactSummary}>{c.summary}</p>}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Activity & Contact API · Last refreshed automatically</p>
      </div>
    </div>
  )
}
