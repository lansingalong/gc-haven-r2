import { useState, useEffect } from 'react'
import { Icon } from '@/components/Icons'
import { type Alert as SukiAlert } from './SukiWindow'
import styles from './CallInsightsCard.module.css'

const SUMMARY_TEXT =
  "The care manager conducted a check-in call with the member regarding ongoing management of Type 2 diabetes mellitus and essential hypertension. The member reported intermittent medication adherence and difficulty with dietary modifications. Fasting glucose has been elevated, averaging approximately 180 mg/dL. Blood pressure was self-reported at 142/88 mmHg.\n\nThe member expressed interest in speaking with a nutritionist and raised concerns about knee pain limiting physical activity. Care gaps reviewed include overdue HbA1c lab work and a pending cardiology follow-up. The member agreed to schedule an appointment with their PCP within the next two weeks and confirmed willingness to participate in a structured care plan review."

const DEFAULT_ALERTS: SukiAlert[] = [
  {
    id: 'med-adherence',
    label: 'Medication adherence issue detected',
    detail: 'Member reports missing evening Metformin doses - not documented in care plan.',
    tasks: [
      'Add medication adherence barrier to care plan',
      'Schedule pharmacist medication review',
      'Set up evening dose reminder in care plan',
    ],
  },
  {
    id: 'transportation',
    label: 'New issue identified: Transportation barrier',
    detail: 'Member reports no personal vehicle - not documented as a care barrier.',
    tasks: [
      'Add transportation barrier to care plan',
      'Research non-emergency medical transport options',
      'Document SDOH transportation flag in member record',
    ],
  },
]

interface AlertTasksProps {
  alert: SukiAlert
}

function AlertTasks({ alert }: AlertTasksProps) {
  const [tasks, setTasks] = useState<string[]>(alert.tasks)
  const [expanded, setExpanded] = useState(false)
  const [added, setAdded] = useState<Set<number>>(new Set())

  return (
    <div className={styles.alertCardInner}>
      <div className={styles.alertCardTop}>
        <span className={styles.alertDot} aria-hidden="true" />
        <div className={styles.alertCardBody}>
          <p className={styles.alertTitle}>{alert.label}</p>
          <p className={styles.alertDetail}>{alert.detail}</p>
          <button
            type="button"
            className={styles.alertTasksToggle}
            aria-expanded={expanded}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Hide recommended tasks' : `Show recommended tasks (${tasks.length})`}
            <Icon name={expanded ? 'ExpandLess' : 'ExpandMore'} size="xs" color="inherit" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.alertTaskList}>
          {tasks.map((task, idx) => (
            <div key={idx} className={styles.alertTaskRow}>
              <button
                type="button"
                className={`${styles.alertTaskCheck}${added.has(idx) ? ` ${styles.alertTaskCheckAdded}` : ''}`}
                aria-label={added.has(idx) ? 'Remove task' : 'Add task'}
                onClick={() => setAdded(prev => {
                  const next = new Set(prev)
                  prev.has(idx) ? next.delete(idx) : next.add(idx)
                  return next
                })}
              >
                <Icon name={added.has(idx) ? 'CheckCircle' : 'RadioButtonUnchecked'} size="sm" color={added.has(idx) ? 'success' : 'action'} />
              </button>
              <input
                className={`${styles.alertTaskInput}${added.has(idx) ? ` ${styles.alertTaskInputDone}` : ''}`}
                type="text"
                value={task}
                aria-label={`Task ${idx + 1}`}
                onChange={e => setTasks(prev => {
                  const next = [...prev]
                  next[idx] = e.target.value
                  return next
                })}
              />
            </div>
          ))}
          <button
            type="button"
            className={styles.alertAddTaskBtn}
            onClick={() => {
              setTasks(prev => [...prev, ''])
              setExpanded(true)
            }}
          >
            <Icon name="AddCircleOutline" size="sm" color="primary" />
            Add your own task
          </button>
        </div>
      )}
    </div>
  )
}

interface CallInsightsCardProps {
  memberFirstName?: string
  memberName?: string
  alerts?: SukiAlert[]
  onDismiss?: () => void
}

export function CallInsightsCard({ memberFirstName = 'Jackson', memberName = 'Jackson Thomas', alerts, onDismiss }: CallInsightsCardProps) {
  const displayAlerts = alerts && alerts.length > 0 ? alerts : DEFAULT_ALERTS
  const [reminderSent, setReminderSent] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'SUKI_NOTE_SAVED') setNoteSaved(true)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const handleSaveNote = () => {
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(f => f.contentWindow?.postMessage({ type: 'SUKI_NOTE_READY', noteText: SUMMARY_TEXT }, '*'))
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Icon name="AutoAwesome" size="sm" color="primary" />
        <span className={styles.headerTitle}>Haven - Call summary</span>
        <button type="button" className={styles.dismissBtn} aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="Close" size="xs" color="action" />
        </button>
      </div>

      {/* AI summary */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          <Icon name="Summarize" size="xs" color="action" />
          AI summary
        </div>
        <p className={styles.summaryText}>{SUMMARY_TEXT}</p>
      </div>

      {/* Alerts from this call */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          <Icon name="Warning" size="xs" color="warning" />
          Alerts from this call
        </div>
        <div className={styles.alertStack}>
          {displayAlerts.map(alert => (
            <div key={alert.id} className={styles.alertCard}>
              <AlertTasks alert={alert} />
            </div>
          ))}
        </div>
      </div>

      {/* Haven insights */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          <Icon name="Lightbulb" size="xs" color="primary" />
          Insights
        </div>
        <div className={styles.insightStack}>
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>A1C trending up</p>
            <p className={styles.insightDetail}>Fasting glucose reported at ~180 mg/dL. Last A1C was 7.8% (Feb 2024), up from 7.2% (Aug 2023). Consider escalating glycemic management discussion.</p>
          </div>
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>Blood pressure above goal</p>
            <p className={styles.insightDetail}>Self-reported BP 142/88 mmHg - above the 130/80 target. Confirm Lisinopril adherence at next contact.</p>
          </div>
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>DPP enrollment opportunity</p>
            <p className={styles.insightDetail}>Member is eligible for the Diabetes Prevention Program and expressed interest in dietary support. Good moment to introduce referral.</p>
          </div>
        </div>
      </div>

      {/* Not yet covered */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          <Icon name="PendingActions" size="xs" color="warning" />
          Not yet covered this call
        </div>
        <div className={styles.missedCard}>
          <div className={styles.missedCardHeader}>
            <span className={styles.missedCardTitle}>Wellframe diabetes assessment</span>
            <span className={styles.missedCardTag}>Pending from last call</span>
          </div>
          <p className={styles.missedCardDetail}>
            On 02/20/2024, {memberFirstName} agreed to complete the diabetes self-management assessment in Wellframe. It has not been completed yet.
          </p>
          <button
            type="button"
            className={`${styles.missedCardBtn}${reminderSent ? ` ${styles.missedCardBtnDone}` : ''}`}
            disabled={reminderSent}
            onClick={() => setReminderSent(true)}
          >
            {reminderSent
              ? <><Icon name="Check" size="xs" color="success" /> Reminder sent to {memberFirstName}</>
              : `Send reminder to complete in Wellframe`
            }
          </button>
        </div>
      </div>

      {/* Save to GuidingCare */}
      <div className={styles.saveFooter}>
        <button
          type="button"
          className={`${styles.saveBtn}${noteSaved ? ` ${styles.saveBtnDone}` : ''}`}
          onClick={handleSaveNote}
          disabled={noteSaved}
        >
          <Icon name={noteSaved ? 'Check' : 'Save'} size="sm" color="inverse" />
          {noteSaved ? 'Saved to GuidingCare' : 'Save note to GuidingCare'}
        </button>
      </div>
    </div>
  )
}
