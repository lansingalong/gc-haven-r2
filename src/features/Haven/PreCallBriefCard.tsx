import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface PreCallBriefEligibility {
  status: string
  startDate: string
  planName: string
  lineOfBusiness: string
}

export interface PreCallBriefCondition {
  condition: string
  code: string
  level: string
  isPrimary?: boolean
  isNew?: boolean
}

export interface PreCallBriefClaim {
  visitType: string
  date: string
  provider: string
  procedureCode: string
  reasonForVisit: string
}

export interface PreCallBriefOGI {
  opportunity: string
  category: string
  status: string
  targetDate: string
}

export interface PreCallBriefCardData {
  memberFirstName: string

  // Referral
  referralProgram: string
  referralBy: string
  referralDate: string
  referralLastUpdated: string

  // Eligibility
  eligibilities: PreCallBriefEligibility[]
  eligibilityLastUpdated: string

  // Risk
  riskTier: string
  riskLabel: string
  riskScore?: number
  riskScoreMax?: number
  riskDrivers: Array<{ condition: string; detail: string }>
  riskLastUpdated: string

  // Medications
  activeMedCount: number
  keyMedications: Array<{
    name: string
    dosage: string
    frequency: string
    medicationClass: string
    prescribedBy: string
    startDate: string
    dispensedDate: string
  }>
  medsLastUpdated: string
  discontinuedMedications: Array<{
    name: string
    dosage: string
    endDate: string
    prescribedBy: string
  }>

  // Claims
  recentClaims: PreCallBriefClaim[]
  claimsApproved: number
  claimsPending: number
  claimsDenied: number
  claimsTypeBreakdown: Array<{ type: string; count: number }>

  // Conditions
  conditions: PreCallBriefCondition[]

  // Care gaps
  openCareGaps: Array<{ opportunity: string; measureCode: string }>

  // OGIs
  activeOGIs: PreCallBriefOGI[]

  // Preferences
  preferredPhone: string
  bestTimeToCall: string
  communicationImpairments: string[]
  preferredLanguage: string
  preferredContactFormat: string

  // Last update
  lastRecordUpdate: string
}

function fmtDate(iso: string): string {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function riskBadgeClass(label: string) {
  const lc = label.toLowerCase()
  if (lc.includes('high')) return styles.badgeHigh
  if (lc.includes('moderate')) return styles.badgeWarning
  return styles.badgeDone
}

function riskBannerClass(label: string) {
  const lc = label.toLowerCase()
  if (lc.includes('high')) return styles.riskHigh
  if (lc.includes('moderate')) return styles.riskMedium
  return styles.riskLow
}

/* Shared card footer */
function CardFooter({ href, lastUpdated }: { href: string; lastUpdated: string }) {
  return (
    <div className={styles.cardFooter}>
      <a href={href} target="_blank" rel="noreferrer" className={styles.cardFooterLink}>
        View full details
      </a>
      <span className={styles.cardFooterLastUpdated}>Last updated {lastUpdated}</span>
    </div>
  )
}

/* Shared card action buttons */
function CardActions({ editing, onEdit, onSave }: { editing: boolean; onEdit: () => void; onSave: () => void }) {
  return (
    <div className={styles.cardActions}>
      {editing ? (
        <button type="button" className={styles.iconBtnCheck} aria-label="Save" onClick={onSave}>
          <Icon name="Check" size="sm" aria-hidden />
        </button>
      ) : (
        <button type="button" className={styles.iconBtn} aria-label="Edit" onClick={onEdit}>
          <Icon name="Edit" size="sm" aria-hidden />
        </button>
      )}
      <button type="button" className={styles.iconBtn} aria-label="Copy">
        <Icon name="ContentCopy" size="sm" aria-hidden />
      </button>
    </div>
  )
}

/* ── Card 1: Referral Reason ── */
function ReferralCard({ data }: { data: PreCallBriefCardData }) {
  const [editing, setEditing] = useState(false)
  const [fields, setFields] = useState({
    referralProgram: data.referralProgram,
    referralBy: data.referralBy,
    referralDate: data.referralDate,
  })
  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="PersonAdd" size="sm" color="primary" aria-hidden />
            <span className={styles.cardTitle}>Referral Overview</span>
          </div>
          <CardActions editing={editing} onEdit={() => setEditing(true)} onSave={() => setEditing(false)} />
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Referral reason</span>
            {editing
              ? <input className={styles.editInput} aria-label="Referral reason" value={fields.referralProgram} onChange={set('referralProgram')} />
              : <span className={styles.fieldValue}>{fields.referralProgram}</span>}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Referred by</span>
            {editing
              ? <input className={styles.editInput} aria-label="Referred by" value={fields.referralBy} onChange={set('referralBy')} />
              : <span className={styles.fieldValue}>{fields.referralBy || 'N/A'}</span>}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Referral date</span>
            {editing
              ? <input className={styles.editInput} aria-label="Referral date" value={fields.referralDate} onChange={set('referralDate')} />
              : <span className={styles.fieldValue}>{fmtDate(fields.referralDate) || 'N/A'}</span>}
          </div>
        </div>
      </div>
      <CardFooter href="#programs" lastUpdated={fmtDate(fields.referralDate)} />
    </div>
  )
}

/* ── Card 2: Current Eligibility ── */
function EligibilityCard({ data }: { data: PreCallBriefCardData }) {
  const e0 = data.eligibilities[0]

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="VerifiedUser" size="sm" color="primary" aria-hidden />
            <span className={styles.cardTitle}>Eligibility Overview</span>
          </div>
        </div>

        {!e0 ? (
          <span className={styles.fieldValueSm} style={{ color: 'var(--color-text-secondary)' }}>No active coverage on record</span>
        ) : (
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Status</span>
              <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />{e0.status}</div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Effective date</span>
              <span className={styles.fieldValue}>{fmtDate(e0.startDate)}</span>
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <span className={styles.fieldLabel}>Plan name</span>
              <span className={styles.fieldValue}>{e0.planName}</span>
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <span className={styles.fieldLabel}>Line of business</span>
              <span className={styles.fieldValue}>{e0.lineOfBusiness}</span>
            </div>
          </div>
        )}
      </div>
      <CardFooter href="#eligibility" lastUpdated={fmtDate(data.eligibilityLastUpdated)} />
    </div>
  )
}

/* ── Card 3: Risk Score ── */
function RiskScoreCard({ data }: { data: PreCallBriefCardData }) {
  const [driversOpen, setDriversOpen] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="MonitorHeart" size="sm" color="primary" aria-hidden />
            <span className={styles.cardTitle}>Risk Score Overview</span>
          </div>
        </div>

        <div className={`${styles.riskBanner} ${riskBannerClass(data.riskLabel)}`} style={{ marginBottom: 16 }}>
          <div>
            <div className={styles.riskLabel}>Risk Tier</div>
            <div className={styles.riskValue}>{data.riskTier}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {data.riskScore != null && (
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Score: <strong style={{ color: 'var(--color-text-primary)' }}>
                  {data.riskScore}{data.riskScoreMax ? `/${data.riskScoreMax}` : ''}
                </strong>
              </span>
            )}
            <span className={`${styles.badge} ${riskBadgeClass(data.riskLabel)}`}>{data.riskLabel}</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.driverToggle}
          onClick={() => setDriversOpen(o => !o)}
          aria-expanded={driversOpen}
        >
          <span>Why this score?</span>
          <Icon name={driversOpen ? 'ExpandLess' : 'ExpandMore'} size="sm" color="action" aria-hidden />
        </button>

        {driversOpen && (
          <div className={styles.driverList}>
            {data.riskDrivers.map((d, idx) => (
              <div key={idx} className={styles.driverRow}>
                <Icon name="Warning" size="xs" color="warning" aria-hidden />
                <div className={styles.driverBody}>
                  <span className={styles.driverTitle}>{d.condition}</span>
                  <span className={styles.driverDetail}>{d.detail}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CardFooter href="#risk" lastUpdated={data.riskLastUpdated} />
    </div>
  )
}

/* ── Card 4: Claims Overview ── */
function ClaimsOverviewCard({ data }: { data: PreCallBriefCardData }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="Receipt" size="sm" color="primary" aria-hidden />
            <span className={styles.cardTitle}>Claims Overview</span>
          </div>
        </div>

        <div className={styles.fieldGrid} style={{ marginBottom: 16 }}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Recent claims (last 90 days)</span>
            <span className={styles.fieldValue}>{data.recentClaims.length}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Approved</span>
            <div className={styles.activeValue}><Icon name="CheckCircle" size="sm" aria-hidden />{data.claimsApproved}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Pending</span>
            <span className={styles.fieldValue}>
              {data.claimsPending}
              {data.claimsPending > 0 && <span className={`${styles.badge} ${styles.badgeWarning}`} style={{ marginLeft: 6 }}>Pending</span>}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Denied</span>
            <span className={styles.fieldValue}>
              {data.claimsDenied}
              {data.claimsDenied > 0 && <span className={`${styles.badge} ${styles.badgeHigh}`} style={{ marginLeft: 6 }}>Denied</span>}
            </span>
          </div>
        </div>

      </div>
      <CardFooter href="#claims" lastUpdated={data.recentClaims[0] ? fmtDate(data.recentClaims[0].date) : 'N/A'} />
    </div>
  )
}

/* ── Card 5: Medications Overview ── */
function MedicationsCard({ data }: { data: PreCallBriefCardData }) {
  const [editing, setEditing] = useState(false)
  const [meds, setMeds] = useState(data.keyMedications.map(m => ({ ...m })))
  const [medsLastUpdated, setMedsLastUpdated] = useState(data.medsLastUpdated)

  const [discOpen, setDiscOpen] = useState(false)

  const setMedField = (idx: number, key: keyof typeof meds[0]) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setMeds(prev => prev.map((m, i) => i === idx ? { ...m, [key]: e.target.value } : m))

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="Medication" size="sm" color="primary" aria-hidden />
            <span className={styles.cardTitle}>Medications Overview</span>
          </div>
          <CardActions editing={editing} onEdit={() => setEditing(true)} onSave={() => setEditing(false)} />
        </div>

        {meds.length > 0 && (
          <div className={styles.medTableWrap}>
            <table className={styles.medTable}>
              <thead>
                <tr>
                  <th className={styles.medTh}>Medication</th>
                  <th className={styles.medTh}>Dosage</th>
                  <th className={styles.medTh}>Frequency</th>
                  <th className={styles.medTh}>Prescribed</th>
                  <th className={styles.medTh}>Last Refill</th>
                  <th className={styles.medTh}>Provider</th>
                </tr>
              </thead>
              <tbody>
                {meds.map((m, idx) => (
                  <tr key={idx} className={styles.medTr}>
                    {editing ? (
                      <>
                        <td className={styles.medTd}><input className={styles.editInputSm} aria-label="Medication name" value={m.name} onChange={setMedField(idx, 'name')} /></td>
                        <td className={styles.medTd}><input className={styles.editInputSm} aria-label="Dosage" value={m.dosage} onChange={setMedField(idx, 'dosage')} /></td>
                        <td className={styles.medTd}><input className={styles.editInputSm} aria-label="Frequency" value={m.frequency} onChange={setMedField(idx, 'frequency')} /></td>
                        <td className={styles.medTd}>{fmtDate(m.startDate)}</td>
                        <td className={styles.medTd}>{fmtDate(m.dispensedDate)}</td>
                        <td className={styles.medTd}><input className={styles.editInputSm} aria-label="Provider" value={m.prescribedBy} onChange={setMedField(idx, 'prescribedBy')} /></td>
                      </>
                    ) : (
                      <>
                        <td className={styles.medTd}>{m.name}</td>
                        <td className={styles.medTd}>{m.dosage}</td>
                        <td className={styles.medTd}>{m.frequency}</td>
                        <td className={styles.medTd}>{fmtDate(m.startDate)}</td>
                        <td className={styles.medTd}>{fmtDate(m.dispensedDate)}</td>
                        <td className={styles.medTd}>{m.prescribedBy}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.discontinuedMedications.length > 0 && (
          <>
            <hr className={styles.sectionDivider} />
            <button type="button" className={styles.driverToggle} onClick={() => setDiscOpen(o => !o)} aria-expanded={discOpen}>
              Discontinued ({data.discontinuedMedications.length})
              <Icon name={discOpen ? 'ExpandLess' : 'ExpandMore'} size="sm" aria-hidden />
            </button>
            {discOpen && (
              <div className={styles.medTableWrap} style={{ marginTop: 10 }}>
                <table className={styles.medTable}>
                  <thead>
                    <tr>
                      <th className={styles.medTh}>Medication</th>
                      <th className={styles.medTh}>Dosage</th>
                      <th className={styles.medTh}>Stopped</th>
                      <th className={styles.medTh}>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.discontinuedMedications.map((m, idx) => (
                      <tr key={idx} className={styles.medTr}>
                        <td className={styles.medTd}>
                          <span className={styles.medTdStrike}>{m.name}</span>
                        </td>
                        <td className={styles.medTd}>{m.dosage}</td>
                        <td className={styles.medTd}>{fmtDate(m.endDate)}</td>
                        <td className={styles.medTd}>{m.prescribedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      <CardFooter href="#medications" lastUpdated={fmtDate(medsLastUpdated)} />
    </div>
  )
}

/* ── Main export ── */
export function PreCallBriefCard({ data }: { data: PreCallBriefCardData }) {
  return (
    <div className={styles.wrapper}>
      <ReferralCard data={data} />
      <EligibilityCard data={data} />
      <RiskScoreCard data={data} />
      <ClaimsOverviewCard data={data} />
      <MedicationsCard data={data} />
    </div>
  )
}
