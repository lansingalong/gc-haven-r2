import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface EligibilityEntryRow {
  eligibilityPath: string
  planType: string
  startDate: string
  endDate: string
  status: string
  policyNumber?: string
}

export interface EligibilityCardData {
  memberFirstName: string
  memberDOB: string
  gender: string
  medicareId?: string
  eligibilities: EligibilityEntryRow[]
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export function EligibilityCard({ data }: { data: EligibilityCardData }) {
  const active = data.eligibilities.filter(e => e.status === 'Active')
  const inactive = data.eligibilities.filter(e => e.status !== 'Active')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Eligibility</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit eligibility">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy eligibility">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Coverage status</span>
              {active.length > 0
                ? <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />Active</div>
                : <span className={styles.fieldValue} style={{ color: 'var(--color-error)' }}>Inactive</span>
              }
            </div>
            {active[0] && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Primary plan</span>
                <span className={styles.fieldValue}>{active[0].planType}</span>
              </div>
            )}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Date of birth</span>
              <span className={styles.fieldValue}>{fmtDate(data.memberDOB)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Gender</span>
              <span className={styles.fieldValue}>{data.gender}</span>
            </div>
            {data.medicareId && (
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <span className={styles.fieldLabel}>Medicare ID</span>
                <span className={styles.fieldValue}>{data.medicareId}</span>
              </div>
            )}
          </div>

          {active.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Active Coverage</div>
              {active.map((e, idx) => (
                <div key={idx} className={styles.itemBlock}>
                  <div className={styles.itemHeader}>
                    <div>
                      <div className={styles.itemTitle}>
                        <span style={{ color: 'var(--color-success)', marginRight: 6, display: 'inline-flex', verticalAlign: 'middle' }}>
                          <Icon name="CheckCircle" size="xs" aria-hidden />
                        </span>
                        {e.eligibilityPath}
                      </div>
                      <div className={styles.itemSubtitle}>{e.planType}</div>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                  </div>
                  <div className={styles.fieldGrid} style={{ marginTop: 10 }}>
                    <div className={styles.field}><span className={styles.fieldLabel}>Start date</span><span className={styles.fieldValueSm}>{fmtDate(e.startDate)}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>End date</span><span className={styles.fieldValueSm}>{fmtDate(e.endDate)}</span></div>
                    {e.policyNumber && <div className={styles.field}><span className={styles.fieldLabel}>Policy #</span><span className={styles.fieldValueSm}>{e.policyNumber}</span></div>}
                  </div>
                </div>
              ))}
            </>
          )}

          {inactive.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Inactive ({inactive.length})</div>
              {inactive.map((e, idx) => (
                <div key={idx} className={styles.itemBlock}>
                  <div className={styles.itemHeader}>
                    <div>
                      <div className={styles.itemTitle}>{e.eligibilityPath}</div>
                      <div className={styles.itemSubtitle}>{e.planType}</div>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeInactive}`}>{e.status}</span>
                  </div>
                  <div className={styles.fieldGrid} style={{ marginTop: 10 }}>
                    <div className={styles.field}><span className={styles.fieldLabel}>Start</span><span className={styles.fieldValueSm}>{fmtDate(e.startDate)}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>End</span><span className={styles.fieldValueSm}>{fmtDate(e.endDate)}</span></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Eligibility API · Renewal outreach recommended prior to end date</p>
      </div>
    </div>
  )
}
