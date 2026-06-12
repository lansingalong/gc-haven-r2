import { Icon } from '@/components/Icons'
import styles from './LastUpdateCard.module.css'

export interface LastUpdateData {
  firstName: string
  callDate: string
  note: {
    date: string
    author: string
    role: string
    body: string
  }
  activity: {
    type: string
    date: string
    assignedTo: string
    priority: string
    status: string
    due: string
  }
}

interface LastUpdateCardProps {
  data: LastUpdateData
  onNavigateNote?: () => void
  onNavigateActivity?: () => void
}

export function LastUpdateCard({ data, onNavigateNote, onNavigateActivity }: LastUpdateCardProps) {
  return (
    <div className={styles.root}>
      <p className={styles.summary}>
        You last called <strong>{data.firstName}</strong> on {data.callDate}, and added a clinical note and a follow-up activity.
      </p>

      {/* Note */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Icon name="Description" size="sm" color="primary" />
          <span className={styles.cardTitle}>Clinical Note - {data.note.date}</span>
          {onNavigateNote && (
            <button type="button" className={styles.linkBtn} onClick={onNavigateNote}>
              View
            </button>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.meta}>{data.note.author} · {data.note.role}</span>
          <p className={styles.bodyText}>{data.note.body}</p>
        </div>
      </div>

      {/* Activity */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Icon name="CheckCircleOutline" size="sm" color="primary" />
          <span className={styles.cardTitle}>{data.activity.type} - {data.activity.date}</span>
          {onNavigateActivity && (
            <button type="button" className={styles.linkBtn} onClick={onNavigateActivity}>
              View
            </button>
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <Icon name="Person" size="xs" color="action" />
              {data.activity.assignedTo}
            </span>
            <span className={styles.metaItem}>
              <Icon name="FlagOutlined" size="xs" color="action" />
              {data.activity.priority} priority
            </span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <Icon name="RadioButtonChecked" size="xs" color="action" />
              {data.activity.status}
            </span>
            <span className={styles.metaItem}>
              <Icon name="CalendarToday" size="xs" color="action" />
              Due {data.activity.due}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
