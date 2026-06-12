import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './SmartGoalCard.module.css'

export interface SmartGoalField {
  label: string
  value: string
}

export interface SmartGoalOption {
  name: string
  description: string
  iconName: string
  fields: SmartGoalField[]
}

export interface SmartGoalData {
  goals: SmartGoalOption[]
}

export interface SmartGoalAddedPayload {
  goalName: string
  goalDescription: string
  fields: { label: string; value: string }[]
}

export function SmartGoalCard({ data, onGoalAdded }: { data: SmartGoalData; onGoalAdded?: (payload: SmartGoalAddedPayload) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [valuesByGoal, setValuesByGoal] = useState<string[][]>(
    data.goals.map(g => g.fields.map(f => f.value))
  )
  const [addedByGoal, setAddedByGoal] = useState<boolean[]>(
    data.goals.map(() => false)
  )

  const handleAddGoal = (goalIdx: number) => {
    const next = [...addedByGoal]
    next[goalIdx] = true
    setAddedByGoal(next)
    const goal = data.goals[goalIdx]
    onGoalAdded?.({
      goalName: goal.name,
      goalDescription: goal.description,
      fields: goal.fields.map((f, i) => ({ label: f.label, value: valuesByGoal[goalIdx][i] })),
    })
  }

  /* ── Picker view ── */
  if (selected === null) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Icon name="TrackChanges" size="sm" color="primary" />
          <span className={styles.headerTitle}>Select a SMART Goal</span>
        </div>
        <div className={styles.goalList}>
          {data.goals.map((goal, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.goalCard} ${addedByGoal[i] ? styles.goalCardDone : ''}`}
              onClick={() => setSelected(i)}
            >
              <div className={styles.goalCardLeft}>
                <Icon name={goal.iconName as any} size="sm" color="primary" />
                <div className={styles.goalCardBody}>
                  <span className={styles.goalCardTitle}>{goal.name}</span>
                  <span className={styles.goalCardDesc}>{goal.description}</span>
                </div>
              </div>
              {addedByGoal[i]
                ? <Icon name="CheckCircle" size="xs" color="success" />
                : <Icon name="ChevronRight" size="xs" color="action" />
              }
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* ── Detail view ── */
  const goal = data.goals[selected]
  const values = valuesByGoal[selected]
  const added = addedByGoal[selected]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => setSelected(null)}>
          <Icon name="ArrowBack" size="xs" color="primary" />
        </button>
        <Icon name={goal.iconName as any} size="sm" color="primary" />
        <span className={styles.headerTitle}>{goal.name}</span>
      </div>

      <div className={styles.fields}>
        {goal.fields.map((field, i) => (
          <div key={i} className={styles.field}>
            <div className={styles.fieldHeader}>
              <span className={styles.fieldLabel}>{field.label}</span>
            </div>
            <textarea
              className={styles.fieldValue}
              value={values[i]}
              rows={2}
              onChange={e => {
                const next = valuesByGoal.map(v => [...v])
                next[selected][i] = e.target.value
                setValuesByGoal(next)
              }}
              aria-label={field.label}
            />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.addAllBtn}${added ? ` ${styles.addAllDone}` : ''}`}
          onClick={() => handleAddGoal(selected)}
          disabled={added}
        >
          <Icon name={added ? 'Check' : 'PlaylistAdd'} size="sm" color="inverse" />
          {added ? 'Added to Care Plan' : 'Add Goal to Care Plan'}
        </button>
      </div>
    </div>
  )
}
