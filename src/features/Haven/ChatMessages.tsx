import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Icon } from '@/components/Icons'
import contentCopy from '@/assets/content_copy.png'
import checkIcon from '@/assets/check.png'
import thumbUp from '@/assets/thumb_up.png'
import thumbUpFill from '@/assets/thumb_up_fill.png'
import thumbDown from '@/assets/thumb_down.png'
import thumbDownFill from '@/assets/thumb_down_fill.png'
import styles from './ChatMessages.module.css'
import { SmartGoalCard, type SmartGoalData, type SmartGoalAddedPayload } from './SmartGoalCard'
import { UracChecklistCard } from './UracChecklistCard'
import { CarePlanSummaryCard } from './CarePlanSummaryCard'
import { LastUpdateCard, type LastUpdateData } from './LastUpdateCard'

export interface FollowUpChip {
  label: string
  query: string
  isComplete?: boolean
  inlineRow?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
  feedback?: 'up' | 'down' | null
  followUp?: string
  followUpQuery?: string
  followUpChips?: FollowUpChip[]
  smartGoal?: SmartGoalData
  uracChecklist?: true
  carePlanSummary?: true
  lastUpdate?: LastUpdateData
}

export interface ChatMessagesProps {
  messages: Message[]
  loading: boolean
  thinkingSteps?: string[] | null
  onFeedback?: (id: string, value: 'up' | 'down') => void
  onGoalAdded?: (payload: SmartGoalAddedPayload) => void
  onFollowUpChip?: (query: string) => void
  onNavigateNote?: () => void
  onNavigateActivity?: () => void
}

/* ── Thinking steps ── */
function ThinkingSteps({ steps }: { steps: string[] }) {
  const [count, setCount] = useState(1)
  useEffect(() => {
    if (count >= steps.length) return
    const t = setTimeout(() => setCount(c => c + 1), 700)
    return () => clearTimeout(t)
  }, [count, steps.length])
  return (
    <div className={styles.thinkingWrap}>
      {steps.slice(0, count).map((step, i) => {
        const done = i < count - 1
        return (
          <div key={i} className={`${styles.thinkingStep} ${done ? styles.thinkingDone : styles.thinkingActive}`}>
            {done ? <Icon name="CheckCircle" size="xs" color="action" /> : <span className={styles.thinkingSpinner} />}
            <span>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Typing indicator ── */
function TypingIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.typing}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  )
}

/* ── Line renderer ── */
function renderContent(
  content: string,
  onNavigateNote?: () => void,
  onNavigateActivity?: () => void,
) {
  return content.split('\n').map((line, i) => {
    // detect by unicode code point to avoid emoji encoding issues
    const cp = line.codePointAt(0)
    const isNoteHeader     = cp === 0x1F4CB  // 📋
    const isActivityHeader = cp === 0x2705   // ✅
    const isHeader = isNoteHeader || isActivityHeader || /^[A-Z][A-Z\s&/]{2,}$/.test(line.trim())

    if (isNoteHeader && onNavigateNote) {
      return <button key={i} type="button" className={styles.activityLink} onClick={onNavigateNote}>{line}</button>
    }
    if (isActivityHeader && onNavigateActivity) {
      return <button key={i} type="button" className={styles.activityLink} onClick={onNavigateActivity}>{line}</button>
    }
    const boldMatch = line.match(/^\*\*(.+)\*\*$/)
    if (boldMatch) {
      return <span key={i} style={{ fontWeight: 600, display: 'block' }}>{boldMatch[1]}</span>
    }
    return (
      <span key={i} style={isHeader ? { fontWeight: 600, display: 'block' } : { display: 'block' }}>
        {line || ' '}
      </span>
    )
  })
}

/* ── Assistant message ── */
function AssistantMessage({
  msg,
  onFeedback,
  onGoalAdded,
  onFollowUpChip,
  onNavigateNote,
  onNavigateActivity,
}: {
  msg: Message
  onFeedback?: (id: string, value: 'up' | 'down') => void
  onGoalAdded?: (payload: SmartGoalAddedPayload) => void
  onFollowUpChip?: (query: string) => void
  onNavigateNote?: () => void
  onNavigateActivity?: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }

  if (msg.isError) {
    return (
      <div className={styles.row}>
        <div className={styles.errorBubble}>
          <div className={styles.errorHeader}>
            <Icon name="ErrorOutline" size="sm" color="error" />
            <span className={styles.errorTitle}>Unable to retrieve data</span>
          </div>
          <p className={styles.errorBody}>{msg.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.assistantGroup}>
      {msg.content && (
        <div className={styles.row}>
          <div className={styles.assistantBubble}>
            {renderContent(msg.content, onNavigateNote, onNavigateActivity)}
          </div>
        </div>
      )}
      {msg.uracChecklist && <UracChecklistCard />}
      {msg.carePlanSummary && <CarePlanSummaryCard />}
      {msg.smartGoal && <SmartGoalCard data={msg.smartGoal} onGoalAdded={onGoalAdded} />}
      {msg.lastUpdate && (
        <LastUpdateCard
          data={msg.lastUpdate}
          onNavigateNote={onNavigateNote}
          onNavigateActivity={onNavigateActivity}
        />
      )}
      {msg.followUp && <p className={styles.followUpText}>{msg.followUp}</p>}
      {msg.followUpChips && msg.followUpChips.length > 0 && (
        <div className={styles.followUpChips}>
          {(() => {
            const rows: JSX.Element[] = []
            let i = 0
            while (i < msg.followUpChips!.length) {
              const chip = msg.followUpChips![i]
              if (chip.inlineRow) {
                const group = [chip]
                let j = i + 1
                while (j < msg.followUpChips!.length && msg.followUpChips![j].inlineRow) {
                  group.push(msg.followUpChips![j])
                  j++
                }
                rows.push(
                  <div key={chip.query} className={styles.followUpChipRow}>
                    {group.map(c => (
                      <button key={c.query} type="button" className={styles.followUpChip} onClick={() => onFollowUpChip?.(c.query)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )
                i = j
              } else {
                rows.push(
                  <button key={chip.query} type="button" className={chip.isComplete ? styles.followUpChipComplete : styles.followUpChip} onClick={() => onFollowUpChip?.(chip.query)}>
                    {chip.label}
                  </button>
                )
                i++
              }
            }
            return rows
          })()}
        </div>
      )}
      <div className={styles.actions}>
        <button className={`${styles.actionBtn} ${copied ? styles.actionBtnActive : ''}`} onClick={handleCopy} type="button" aria-label="Copy response" title={copied ? 'Copied!' : 'Copy'}>
          <img src={copied ? checkIcon : contentCopy} width={16} height={16} alt="" aria-hidden="true" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <div className={styles.actionDivider} />
        <button className={`${styles.actionBtn} ${msg.feedback === 'up' ? styles.actionBtnActive : ''}`} onClick={() => onFeedback?.(msg.id, 'up')} type="button" aria-label="Helpful" title="Helpful">
          <img src={msg.feedback === 'up' ? thumbUpFill : thumbUp} width={16} height={16} alt="" aria-hidden="true" />
        </button>
        <button className={`${styles.actionBtn} ${msg.feedback === 'down' ? styles.actionBtnActive : ''}`} onClick={() => onFeedback?.(msg.id, 'down')} type="button" aria-label="Not helpful" title="Not helpful">
          <img src={msg.feedback === 'down' ? thumbDownFill : thumbDown} width={16} height={16} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ── Main component ── */
export function ChatMessages({ messages, loading, thinkingSteps, onFeedback, onGoalAdded, onFollowUpChip, onNavigateNote, onNavigateActivity }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, thinkingSteps])

  return (
    <div className={styles.list} aria-live="polite" aria-relevant="additions" aria-label="Chat messages">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <div key={msg.id} className={styles.userRow}>
            <div className={styles.userBubble}>{msg.content}</div>
          </div>
        ) : (
          <AssistantMessage
            key={msg.id}
            msg={msg}
            onFeedback={onFeedback}
            onGoalAdded={onGoalAdded}
            onFollowUpChip={onFollowUpChip}
            onNavigateNote={onNavigateNote}
            onNavigateActivity={onNavigateActivity}
          />
        )
      )}
      {thinkingSteps && thinkingSteps.length > 0 && <ThinkingSteps steps={thinkingSteps} />}
      {loading && !thinkingSteps && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
