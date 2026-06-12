import { useState } from 'react'
import { Icon } from '@/components/Icons'
import type { HavenSettings } from './useHavenSettings'
import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  settings: HavenSettings
  onUpdate: (patch: Partial<HavenSettings>) => void
  onBack: () => void
  onClearHistory: () => void
  sessionCount: number
  onLearnMore: () => void
}

const RESPONSE_OPTIONS: { value: HavenSettings['responseDetail']; label: string }[] = [
  { value: 'concise',  label: 'Concise'  },
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
]

const RETENTION_OPTIONS: { value: HavenSettings['historyRetention']; label: string }[] = [
  { value: '30days',  label: '30 days' },
  { value: '90days',  label: '90 days' },
  { value: 'forever', label: 'Forever' },
]

export function SettingsPanel({ settings, onUpdate, onBack, onClearHistory, sessionCount, onLearnMore }: SettingsPanelProps) {
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClearClick = () => {
    if (confirmClear) {
      onClearHistory()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={onBack}
          type="button"
          aria-label="Back to chat history"
        >
          <Icon name="ArrowBack" size="sm" color="action" />
        </button>
        <span className={styles.title}>Settings</span>
      </div>

      <div className={styles.content}>

        {/* ── Response ── */}
        <section className={styles.section} aria-labelledby="setting-response">
          <p className={styles.sectionLabel} id="setting-response">Response</p>

          <div className={styles.row}>
            <div className={styles.rowText}>
              <span className={styles.rowLabel}>Response detail</span>
              <span className={styles.rowDesc}>How much detail Haven includes in each answer</span>
            </div>
          </div>
          <div className={styles.segmented} role="radiogroup" aria-label="Response detail">
            {RESPONSE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                role="radio"
                aria-checked={settings.responseDetail === opt.value}
                className={`${styles.segBtn} ${settings.responseDetail === opt.value ? styles.segBtnActive : ''}`}
                onClick={() => onUpdate({ responseDetail: opt.value })}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Suggestions ── */}
        <section className={styles.section} aria-labelledby="setting-suggestions">
          <p className={styles.sectionLabel} id="setting-suggestions">Suggestions</p>

          <div className={styles.toggleRow}>
            <div className={styles.rowText}>
              <span className={styles.rowLabel}>Follow-up prompts</span>
              <span className={styles.rowDesc}>Show suggested questions after each response</span>
            </div>
            <button
              role="switch"
              aria-checked={settings.showFollowUps}
              className={`${styles.toggle} ${settings.showFollowUps ? styles.toggleOn : ''}`}
              onClick={() => onUpdate({ showFollowUps: !settings.showFollowUps })}
              type="button"
              aria-label="Toggle follow-up prompts"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </section>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Chat History ── */}
        <section className={styles.section} aria-labelledby="setting-history">
          <p className={styles.sectionLabel} id="setting-history">Chat History</p>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Keep conversations for</span>
          </div>
          <div className={styles.segmented} role="radiogroup" aria-label="History retention period">
            {RETENTION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                role="radio"
                aria-checked={settings.historyRetention === opt.value}
                className={`${styles.segBtn} ${settings.historyRetention === opt.value ? styles.segBtnActive : ''}`}
                onClick={() => onUpdate({ historyRetention: opt.value })}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className={styles.clearSection}>
            {confirmClear ? (
              <>
                <p className={styles.clearWarning}>
                  This will delete {sessionCount} saved conversation{sessionCount !== 1 ? 's' : ''} for this member. This can't be undone.
                </p>
                <div className={styles.clearActions}>
                  <button
                    className={styles.clearCancelBtn}
                    onClick={() => setConfirmClear(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.clearConfirmBtn}
                    onClick={handleClearClick}
                    type="button"
                  >
                    Delete all
                  </button>
                </div>
              </>
            ) : (
              <button className={styles.clearBtn} onClick={handleClearClick} type="button">
                <Icon name="DeleteOutlined" size="sm" color="error" />
                Clear conversation history
              </button>
            )}
          </div>
        </section>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── About ── */}
        <section className={styles.section} aria-labelledby="setting-about">
          <p className={styles.sectionLabel} id="setting-about">About</p>

          <div className={styles.aboutRow}>
            <Icon name="AutoAwesome" size="sm" color="primary" />
            <span className={styles.aboutVersion}>Haven · v2 Beta</span>
          </div>

          <button className={styles.learnMoreBtn} onClick={onLearnMore} type="button">
            What Haven can and cannot do
            <Icon name="ChevronRight" size="sm" color="action" />
          </button>
        </section>

      </div>
    </div>
  )
}
