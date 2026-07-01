import { Icon } from '@/components/Icons'
import styles from './SummaryCard.module.css'

export interface RiskDriver {
  condition: string
  detail: string
}

export interface RiskLevelCardData {
  memberFirstName: string
  riskTier: string
  riskLabel: string
  riskScore?: number
  riskScoreMax?: number
  readmissionRisk: string
  hospitalizationRisk: string
  drivers: RiskDriver[]
  lastAssessmentDate: string
  lastAssessmentScore?: number
}

export function RiskLevelCard({ data }: { data: RiskLevelCardData }) {
  const isHigh = data.riskLabel.toLowerCase().includes('high')
  const isMod = data.riskLabel.toLowerCase().includes('moderate')

  const tierClass = isHigh ? styles.riskHigh : isMod ? styles.riskMedium : styles.riskLow
  const tierBadge = isHigh ? styles.badgeHigh : isMod ? styles.badgeWarning : styles.badgeDone

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Risk Level</span>
            <div className={styles.cardActions}>
              <button type="button" className={styles.iconBtn} aria-label="Edit risk level">
                <Icon name="Edit" size="sm" aria-hidden />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Copy risk level">
                <Icon name="ContentCopy" size="sm" aria-hidden />
              </button>
            </div>
          </div>

          <div className={`${styles.riskBanner} ${tierClass}`}>
            <div>
              <div className={styles.riskLabel}>Risk Tier</div>
              <div className={styles.riskValue}>{data.riskTier}</div>
            </div>
            <span className={`${styles.badge} ${tierBadge} ${styles.riskBadgeLg}`}>{data.riskLabel}</span>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>30-day readmission</span>
              <span className={styles.fieldValue}>{data.readmissionRisk}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>12-month hospitalization</span>
              <span className={styles.fieldValue}>{data.hospitalizationRisk}</span>
            </div>
            {data.riskScore !== undefined && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>HRA score</span>
                <span className={styles.fieldValue}>
                  {data.riskScore}{data.riskScoreMax ? `/${data.riskScoreMax}` : ''}
                </span>
              </div>
            )}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Last assessed</span>
              <span className={styles.fieldValue}>{data.lastAssessmentDate}</span>
            </div>
          </div>

          {data.drivers.length > 0 && (
            <>
              <hr className={styles.sectionDivider} />
              <div className={styles.sectionTitle}>Primary Risk Drivers</div>
              {data.drivers.map((d, idx) => (
                <div key={idx} className={styles.driverRow}>
                  <Icon name="Warning" size="xs" color="warning" aria-hidden />
                  <div className={styles.driverBody}>
                    <div className={styles.driverTitle}>{d.condition}</div>
                    {d.detail && <div className={styles.driverDetail}>{d.detail}</div>}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <p className={styles.footerNote}>Generated from GC Risk Stratification · Last assessed {data.lastAssessmentDate}</p>
      </div>
    </div>
  )
}
