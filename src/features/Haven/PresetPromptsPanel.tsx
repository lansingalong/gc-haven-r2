import { useState } from 'react'
import styles from './PresetPromptsPanel.module.css'
import { Icon } from '@/components/Icons'
import { T, type Language } from './translations'

const MEMBER_DETAIL_EXTRAS: Record<string, string[]> = {
  'maria-rivera':   ["What is the member's ADL or IADL status?"],
}


interface PresetPromptsPanelProps {
  onClose: () => void
  onSelectPrompt: (text: string) => void
  memberName?: string
  memberId?: string
  language?: Language
}

const DEFAULT_VISIBLE = 3

function getCategories(firstName: string, memberId: string, t: typeof T['english']) {
  return [
    {
      icon: 'AccountCircle' as const,
      key: 'Get Member Details',
      label: t.getPrompts,
      prompts: [
        `What is ${firstName}'s current risk level?`,
        `What is ${firstName}'s current medication list?`,
        `What services is ${firstName} eligible for?`,
        `Show me ${firstName}'s last contact and interaction history`,
        `What are ${firstName}'s current OGIs?`,
        `What are ${firstName}'s current conditions and diagnoses?`,
        `Show me ${firstName}'s authorization and claims history`,
        `What assessments has ${firstName} completed?`,
        `What are ${firstName}'s outstanding activities?`,
        ...(MEMBER_DETAIL_EXTRAS[memberId] ?? []),
      ],
    },
    {
      icon: 'Article' as const,
      key: 'Summarize for Me',
      label: t.summarizePrompts,
      prompts: [
        'Prepare me for a member call',
        "Catch me up on member's care",
        'Help me with admin for this member',
        "Review member's current care plan",
        'Show me the last update I did for the member',
      ],
    },
  ]
}

export function PresetPromptsPanel({ onClose, onSelectPrompt, memberName = '', memberId = '', language = 'english' }: PresetPromptsPanelProps) {
  const t = T[language]
  const firstName = memberName.split(' ')[0] || 'this member'
  const categories = getCategories(firstName, memberId, t)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Get Member Details': false,
    'Summarize for Me': false,
  })

  function handleSelect(prompt: string) {
    onSelectPrompt(prompt)
    onClose()
  }

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close">
          <Icon name="Close" size="md" color="action" />
        </button>
      </div>


      <div className={styles.content}>
        {categories.map(cat => {
          const isExpanded = !!expanded[cat.key]
          const visible = isExpanded ? cat.prompts : cat.prompts.slice(0, DEFAULT_VISIBLE)
          const hasMore = cat.prompts.length > DEFAULT_VISIBLE

          return (
            <div key={cat.key} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  <Icon name={cat.icon} size="md" color="primary" />
                  <span>{cat.label}</span>
                </div>
                {hasMore && (
                  <button
                    className={styles.moreLink}
                    type="button"
                    onClick={() => setExpanded(prev => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                  >
                    {isExpanded ? 'Less prompts' : 'More prompts'}
                  </button>
                )}
              </div>

              <div className={styles.bubbles}>
                {visible.map(prompt => (
                  <button
                    key={prompt}
                    className={styles.bubble}
                    type="button"
                    onClick={() => handleSelect(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
