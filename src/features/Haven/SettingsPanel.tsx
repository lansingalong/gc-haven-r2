import { useState } from 'react'
import { Icon } from '@/components/Icons'
import type { HavenSettings } from './useHavenSettings'
import { T, type Language } from './translations'
import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  settings: HavenSettings
  onUpdate: (patch: Partial<HavenSettings>) => void
  onBack: () => void
  onFontPreview?: (fontStyle: HavenSettings['fontStyle']) => void
  onClearHistory?: () => void
  sessionCount?: number
  onLearnMore?: () => void
  language?: Language
}

const TONE_EXAMPLES: Record<HavenSettings['styleAndTone'], { label: string; text: string }> = {
  casual: {
    label: 'Casual Style Example',
    text: "Found out they have Type 2 diabetes about 8 months back. They manage a restaurant, so their schedule is all over the place and pretty stressful. They're on metformin—1000mg twice a day.",
  },
  professional: {
    label: 'Professional Style Example',
    text: 'Member was diagnosed with Type 2 diabetes approximately 8 months ago. They are employed as a restaurant manager with a demanding and irregular schedule. Current medication includes metformin 1000mg BID.',
  },
  clinical: {
    label: 'Clinical Style Example',
    text: 'Dx: T2DM (8 mo). Occupation: restaurant manager; high-stress, variable schedule. Rx: metformin 1000mg PO BID.',
  },
}

const MOCK_USAGE = {
  session: { used: 4,  limit: 20,  resetsInHours: 6  },
  weekly:  { used: 38, limit: 100, resetsInHours: 14 },
}

function UsageBar({ label, resetsLabel, used, limit, queries }: { label: string; resetsLabel: string; used: number; limit: number; queries: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const warn = pct >= 80
  return (
    <div className={styles.usageBar}>
      <div className={styles.usageBarHeader}>
        <span className={styles.usageBarLabel}>{label}</span>
        <span className={styles.usageResets}>{resetsLabel}</span>
      </div>
      <div className={styles.usageBarCount}>
        {used} <span className={styles.usageBarOf}>/ {limit} {queries}</span>
      </div>
      <div className={styles.usageTrack}>
        <div
          className={`${styles.usageFill} ${warn ? styles.usageFillWarn : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function UsagePage({ t }: { t: typeof T['english'] }) {
  const { session, weekly } = MOCK_USAGE
  return (
    <div className={styles.usagePage}>
      <UsageBar label={t.currentSession} resetsLabel={t.resetsIn(session.resetsInHours)} used={session.used} limit={session.limit} queries={t.queries} />
      <UsageBar label={t.weekly} resetsLabel={t.resetsIn(weekly.resetsInHours)} used={weekly.used} limit={weekly.limit} queries={t.queries} />
    </div>
  )
}

export function SettingsPanel({ settings, onUpdate, onBack, onFontPreview, language = 'english' }: SettingsPanelProps) {
  const t = T[language]
  const [tab, setTab] = useState<'settings' | 'usage'>('settings')
  const [draft, setDraft] = useState<HavenSettings>({ ...settings })
  const [saved, setSaved] = useState(false)
  const example = TONE_EXAMPLES[draft.styleAndTone]

  function handleSave() {
    onUpdate(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onBack} type="button" aria-label="Close">
          <Icon name="Close" size="sm" sx={{ color: '#5F6368' }} />
          <span className={styles.closeLabel}>Close</span>
        </button>
      </div>
      <div className={styles.headerDivider} aria-hidden="true" />

      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'settings'}
          className={`${styles.tab} ${tab === 'settings' ? styles.tabActive : ''}`}
          type="button"
          onClick={() => setTab('settings')}
        >
          {t.settingsTab}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'usage'}
          className={`${styles.tab} ${tab === 'usage' ? styles.tabActive : ''}`}
          type="button"
          onClick={() => setTab('usage')}
        >
          {t.usageTab}
        </button>
      </div>

      {tab === 'usage' ? (
        <UsagePage t={t} />
      ) : (
        <>
          <div className={styles.content}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="setting-preferred-name">{t.preferredName}</label>
              <input
                id="setting-preferred-name"
                className={styles.textInput}
                type="text"
                value={draft.preferredName}
                onChange={e => setDraft(d => ({ ...d, preferredName: e.target.value }))}
                placeholder={t.preferredNamePlaceholder}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="setting-role">{t.roleDescription}</label>
              <textarea
                id="setting-role"
                className={styles.textarea}
                value={draft.roleDescription}
                onChange={e => setDraft(d => ({ ...d, roleDescription: e.target.value }))}
                placeholder={t.roleDescriptionPlaceholder}
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="setting-work-type">{t.workType}</label>
              <div className={styles.selectWrap}>
                <select
                  id="setting-work-type"
                  className={styles.select}
                  value={draft.workType}
                  onChange={e => setDraft(d => ({ ...d, workType: e.target.value as HavenSettings['workType'] }))}
                >
                  <option value="clinician">{t.clinician}</option>
                  <option value="care-coordinator">{t.careCoordinator}</option>
                  <option value="case-manager">{t.caseManager}</option>
                  <option value="admin">{t.admin}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="setting-font">{t.fontStyle}</label>
              <div className={styles.selectWrap}>
                <select
                  id="setting-font"
                  className={styles.select}
                  value={draft.fontStyle}
                  onChange={e => {
                    const v = e.target.value as HavenSettings['fontStyle']
                    setDraft(d => ({ ...d, fontStyle: v }))
                    onFontPreview?.(v)
                  }}
                >
                  <option value="default">{t.defaultFont}</option>
                  <option value="serif">{t.serifFont}</option>
                  <option value="dyslexic">{t.dyslexicFont}</option>
                </select>
              </div>
            </div>


            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="setting-tone">{t.styleAndTone}</label>
              <div className={styles.selectWrap}>
                <select
                  id="setting-tone"
                  className={styles.select}
                  value={draft.styleAndTone}
                  onChange={e => setDraft(d => ({ ...d, styleAndTone: e.target.value as HavenSettings['styleAndTone'] }))}
                >
                  <option value="casual">{t.casual}</option>
                  <option value="professional">{t.professional}</option>
                  <option value="clinical">{t.clinical}</option>
                </select>
              </div>
              <div className={styles.exampleCard}>
                <p className={styles.exampleLabel}>{example.label}</p>
                <p className={styles.exampleText}>{example.text}</p>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            {saved && (
              <span className={styles.savedMsg}>
                <Icon name="CheckCircleOutline" size="sm" sx={{ color: 'var(--color-success)' }} />
                {t.saved}
              </span>
            )}
            <button className={styles.saveBtn} type="button" onClick={handleSave}>{t.save}</button>
          </div>
        </>
      )}
    </div>
  )
}
