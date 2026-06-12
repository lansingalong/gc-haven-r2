import { useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './CarePlanSummaryCard.module.css'
import { mockCarePlan } from '@/mocks'

const STATUS_OPTIONS = ['New', 'In Progress', 'On Hold', 'Completed', 'Closed'] as const
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const
const ACTIVITY_TYPE_OPTIONS = ['Call member', 'Doctor Appointment', 'Education Session', 'Care Plan Review', 'Follow-up', 'Medication Review'] as const

const REASON_OPTIONS = ['Goal met', 'Deceased', 'Declined', 'Goal not met-adherence', 'Goal partially met', 'Other', 'Termed Coverage', 'Unable to contact'] as const
const TODAY = new Date().toISOString().split('T')[0]

interface ItemState {
  status: string
  priority: string
  targetDate: string
  completionNote: string
  resolvedDate: string
  resolvedReason: string
  saved: boolean
  activityType: string
  scheduledDate: string
  dueDate: string
  activityNote: string
  activityAdded: boolean
}

function rowVariant(state: ItemState): string {
  if (state.status === 'Completed' || state.status === 'Closed') return styles.rowDone
  if (state.priority === 'High') return styles.rowHigh
  if (state.priority === 'Medium') return styles.rowMedium
  return styles.rowPending
}

function statusBadgeClass(status: string): string {
  if (status === 'Completed' || status === 'Closed') return styles.badgeDone
  if (status === 'In Progress') return styles.badgeInProgress
  if (status === 'New') return styles.badgeNew
  return styles.badgePending
}

function dotClass(status: string): string {
  if (status === 'Completed' || status === 'Closed') return styles.dotDone
  if (status === 'In Progress') return styles.dotInProgress
  return styles.dotPending
}

export function CarePlanSummaryCard() {
  const [expandedIntervention, setExpandedIntervention] = useState<number | null>(null)
  const [expandedMemberAction, setExpandedMemberAction] = useState<number | null>(null)
  const [states, setStates] = useState<ItemState[]>(
    mockCarePlan.map(c => ({ status: c.status, priority: c.priority, targetDate: c.targetDate, completionNote: '', resolvedDate: TODAY, resolvedReason: 'Goal met', saved: false, activityType: 'Follow-up', scheduledDate: '', dueDate: '', activityNote: '', activityAdded: false }))
  )

  const update = (idx: number, field: keyof ItemState, value: string | boolean) => {
    setStates(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const activeCount = mockCarePlan.filter(c => c.status !== 'Closed').length
  const categoryCount = new Set(mockCarePlan.map(c => c.category)).size
  const completedCount = mockCarePlan.filter(c => c.status === 'Completed').length
  const highInProgress = mockCarePlan.filter((c, i) =>
    states[i]?.priority === 'High' && states[i]?.status !== 'Completed' && states[i]?.status !== 'Closed'
  ).length

  return (
    <div className={styles.root}>

      {/* Header */}
      <div className={styles.card}>
        <div className={styles.header}>
          <Icon name="Assignment" size="sm" color="primary" />
          <span className={styles.headerTitle}>Plan of Care Summary</span>
          <span className={styles.aiBadge}>AI</span>
        </div>

        {/* Overview */}
        <div className={styles.overview}>
          <div className={styles.overviewLabel}>
            <Icon name="Summarize" size="xs" color="action" />
            Overview
          </div>
          <p className={styles.overviewText}>
            Managing <strong>{activeCount} active records</strong> across{' '}
            <strong>{categoryCount} categories</strong>.{' '}
            {highInProgress > 0 && (
              <>{highInProgress} high-priority goal{highInProgress !== 1 ? 's' : ''} in progress. </>
            )}
            {completedCount > 0 && (
              <>{completedCount} goal{completedCount !== 1 ? 's' : ''} completed. </>
            )}
            Primary conditions being managed: Type 2 Diabetes, Essential Hypertension, Obesity, and Behavioral Health.
          </p>
        </div>
      </div>

      {/* Clinical Interventions */}
      <div className={styles.card}>
      <div className={styles.header}>
        <Icon name="MedicalServices" size="sm" color="primary" />
        <span className={styles.headerTitle}>Clinical Interventions</span>
      </div>
      <div className={styles.section}>
        {mockCarePlan.map((item, idx) => {
          const state = states[idx]
          const isOpen = expandedIntervention === idx
          const panelId = `cpc-ci-panel-${idx}`
          return (
            <div key={idx} className={`${styles.row} ${rowVariant(state)}`}>
              <button
                type="button"
                className={styles.rowHeader}
                onClick={() => setExpandedIntervention(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <div className={styles.rowLeft}>
                  <span className={`${styles.dot} ${dotClass(state.status)}`} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{item.opportunityAlias}</span>
                    <span className={styles.rowSub}>{item.category}</span>
                  </div>
                </div>
                <div className={styles.rowRight}>
                  <span className={`${styles.badge} ${statusBadgeClass(state.status)}`}>{item.dueLabel && state.status === 'In Progress' ? item.dueLabel : state.status}</span>
                  <Icon name={isOpen ? 'ExpandMore' : 'ChevronRight'} size="xs" color="action" aria-hidden />
                </div>
              </button>

              {isOpen && (
                <div id={panelId} className={styles.rowDetail}>
                  <p className={styles.detailIntervention}>{item.intervention}</p>
                  {item.task && (
                    <p className={styles.detailTask}>
                      <strong>Next task:</strong> {item.task}
                    </p>
                  )}
                  <div className={styles.activityForm}>
                    <div className={styles.fields}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor={`act-type-${idx}`}>Activity type</label>
                        <select
                          id={`act-type-${idx}`}
                          className={styles.select}
                          value={state.activityType}
                          onChange={e => update(idx, 'activityType', e.target.value)}
                        >
                          {ACTIVITY_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor={`act-sched-${idx}`}>Scheduled date</label>
                        <input
                          id={`act-sched-${idx}`}
                          type="date"
                          className={styles.dateInput}
                          value={state.scheduledDate}
                          onChange={e => update(idx, 'scheduledDate', e.target.value)}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor={`act-due-${idx}`}>Due date</label>
                        <input
                          id={`act-due-${idx}`}
                          type="date"
                          className={styles.dateInput}
                          value={state.dueDate}
                          onChange={e => update(idx, 'dueDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <textarea
                      className={styles.completionNote}
                      placeholder="Add a note..."
                      value={state.activityNote}
                      onChange={e => { update(idx, 'activityNote', e.target.value); update(idx, 'activityAdded', false) }}
                      rows={2}
                      aria-label="Activity note"
                    />
                    <div className={styles.completionActions}>
                      <button
                        type="button"
                        className={state.activityAdded ? styles.savedBtn : styles.saveBtn}
                        onClick={() => update(idx, 'activityAdded', true)}
                      >
                        {state.activityAdded
                          ? <><Icon name="CheckCircle" size="xs" color="success" /> Added</>
                          : 'Add'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>

      {/* Member Actions */}
      <div className={styles.card}>
      <div className={styles.header}>
        <Icon name="Person" size="sm" color="primary" />
        <span className={styles.headerTitle}>Member Actions</span>
      </div>
      <div className={styles.section}>
        {mockCarePlan.map((item, idx) => {
          const state = states[idx]
          if (!item.memberPlan) return null
          const isOpen = expandedMemberAction === idx
          const panelId = `cpc-ma-panel-${idx}`
          return (
            <div key={idx} className={`${styles.row} ${rowVariant(state)}`}>
              <button
                type="button"
                className={styles.rowHeader}
                onClick={() => setExpandedMemberAction(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <div className={styles.rowLeft}>
                  <span className={`${styles.dot} ${dotClass(state.status)}`} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{item.opportunityAlias}</span>
                    <span className={styles.rowSub}>{item.category}</span>
                  </div>
                </div>
                <div className={styles.rowRight}>
                  <span className={`${styles.badge} ${statusBadgeClass(state.status)}`}>{item.dueLabel && state.status === 'In Progress' ? item.dueLabel : state.status}</span>
                  <Icon name={isOpen ? 'ExpandMore' : 'ChevronRight'} size="xs" color="action" aria-hidden />
                </div>
              </button>

              {isOpen && (
                <div id={panelId} className={styles.rowDetail}>
                  <p className={styles.detailIntervention}>{item.memberPlan}</p>
                  {item.memberGoal && (
                    <p className={styles.detailTask}>"{item.memberGoal}"</p>
                  )}
                  {item.task && (
                    <p className={styles.detailTask}>
                      <strong>Next task:</strong> {item.task}
                    </p>
                  )}
                  <div className={styles.fields}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor={`ma-date-${idx}`}>Target date</label>
                      <input
                        id={`ma-date-${idx}`}
                        type="date"
                        className={styles.dateInput}
                        value={state.targetDate}
                        onChange={e => update(idx, 'targetDate', e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor={`ma-status-${idx}`}>Status</label>
                      <select
                        id={`ma-status-${idx}`}
                        className={styles.select}
                        value={state.status}
                        onChange={e => update(idx, 'status', e.target.value)}
                      >
                        {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor={`ma-priority-${idx}`}>Priority</label>
                      <select
                        id={`ma-priority-${idx}`}
                        className={styles.select}
                        value={state.priority}
                        onChange={e => update(idx, 'priority', e.target.value)}
                      >
                        {PRIORITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  {state.status === 'Completed' && (
                    <div className={styles.completionForm}>
                      <textarea
                        className={styles.completionNote}
                        placeholder="Add a note for this completed action..."
                        value={state.completionNote}
                        onChange={e => { update(idx, 'completionNote', e.target.value); update(idx, 'saved', false) }}
                        rows={3}
                        aria-label="Completion note"
                      />
                      <div className={styles.fields}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor={`ma-resolved-${idx}`}>Resolved on</label>
                          <input
                            id={`ma-resolved-${idx}`}
                            type="date"
                            className={styles.dateInput}
                            value={state.resolvedDate}
                            onChange={e => { update(idx, 'resolvedDate', e.target.value); update(idx, 'saved', false) }}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor={`ma-reason-${idx}`}>Reason</label>
                          <select
                            id={`ma-reason-${idx}`}
                            className={styles.select}
                            value={state.resolvedReason}
                            onChange={e => { update(idx, 'resolvedReason', e.target.value); update(idx, 'saved', false) }}
                          >
                            {REASON_OPTIONS.map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className={styles.completionActions}>
                        <button
                          type="button"
                          className={state.saved ? styles.savedBtn : styles.saveBtn}
                          onClick={() => update(idx, 'saved', true)}
                          aria-label="Save completion"
                        >
                          {state.saved
                            ? <><Icon name="CheckCircle" size="xs" color="success" /> Saved</>
                            : <><Icon name="Save" size="xs" color="inverse" /> Save</>
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className={styles.aiNote}>Generated from GC Plan of Care API · Updated automatically</p>
      </div>

    </div>
  )
}
