import { useState } from 'react'
import { Icon } from '@/components/Icons'
import { Typography } from '@/components'
import { AddActivityModal, type ActivityConfig } from './AddActivityModal'
import styles from './HomeWelcome.module.css'

export interface HomeWelcomeProps {
  onPrompt: (text: string) => void
  onPresetsClick: () => void
  day?: 0 | 1 | 2 | 3 | 4 | 'intake'
}

interface Alert {
  id: string
  label: string
  member: string
  memberId: string
  detail: string
  severity: 'error' | 'warning'
  action: string
  secondAction?: string
  note?: string
  automate: boolean
  medicationLink?: boolean
}

const ALERTS: Alert[] = [
  { id: 'maria-er', label: 'ER Visit', member: 'Maria Rivera', memberId: 'maria-rivera', detail: 'visited ER on 6/9', severity: 'error', action: 'Schedule a follow-up call to review discharge plan', automate: true },
  { id: 'maria-gap', label: 'Medication', member: 'Maria Rivera', memberId: 'maria-rivera', detail: 'Furosemide 40mg daily prescribed at discharge for fluid management', severity: 'warning', action: 'Add Furosemide 40mg to medication list and update care plan', automate: false, medicationLink: true },
  { id: 'jackson-rx', label: 'New Diagnosis', member: 'Jackson Thomas', memberId: 'jackson-thomas', detail: 'diabetic peripheral neuropathy diagnosed 6/7', severity: 'warning', action: 'Send member an article on managing diabetic neuropathy', automate: true },
  { id: 'jackson-hra', label: 'Assessment Overdue', member: 'Jackson Thomas', memberId: 'jackson-thomas', detail: 'HRA not completed - due 6/15', severity: 'warning', action: 'Add activity to call Jackson to take assessment', automate: true },
  { id: 'sarah-hra', label: 'Assessment Overdue', member: 'Sarah Williams', memberId: 'sarah-williams', detail: 'HRA not completed - due 6/15', severity: 'warning', action: 'Outreach with Sage', secondAction: 'Add activity to call Sarah to take assessment', note: "It looks like you've had 2 outreach attempts logged with this member to take their HRA. Sage can call the member on your behalf and tell you when the member picks up.", automate: true },
]

const DAY2_TASKS = [
  { icon: 'Phone', member: 'Maria Rivera', text: 'Follow-up call to review discharge plan', due: 'Today' },
  { icon: 'Description', member: 'Maria Rivera', text: 'Complete URAC documentation', due: 'Due in 1 week' },
]

const DAY2_NOTES = [
  {
    id: 'n-1',
    member: "James O'Connor",
    memberId: 'james-oconnor',
    daysAgo: 7,
    context: 'Follow-up call',
    insight: "During our follow-up call, James told me he doesn't have reliable transportation and has been missing lab appointments because of it. I didn't make a referral to the transportation benefit on that call and wanted to circle back.",
    followUp: 'Connect James with the plan transportation benefit',
  },
  {
    id: 'n-2',
    member: 'Dorothy Nguyen',
    memberId: 'dorothy-nguyen',
    daysAgo: 12,
    context: 'Care plan review',
    insight: "Dorothy told me she's been skipping her evening Lasix dose because it wakes her up at night. Her sodium came back elevated at the last draw - I want to make sure her PCP knows the adherence issue before attributing it to the condition alone.",
    followUp: "Flag Lasix adherence concern to Dorothy's PCP before next visit",
  },
  {
    id: 'n-3',
    member: 'Marcus Bell',
    memberId: 'marcus-bell',
    daysAgo: 18,
    context: 'Outreach call',
    insight: "Marcus mentioned he and his partner recently separated. He seemed down during the call and said he's been eating out most nights and checking his blood sugar less often. I noted it but didn't schedule anything - worth following up sooner than planned.",
    followUp: 'Schedule a check-in call with Marcus this week',
  },
  {
    id: 'n-4',
    member: 'Raymond Okafor',
    memberId: 'raymond-okafor',
    daysAgo: 23,
    context: 'Medication review',
    insight: "Raymond told me he regularly runs out of his rescue inhaler a few days before the next refill, but feels embarrassed to call the pharmacy early. He's been going without until it refills automatically. I meant to set up a proactive reminder and didn't get to it.",
    followUp: "Set up automatic refill reminders for Raymond's rescue inhaler",
  },
  {
    id: 'n-5',
    member: 'Theresa Walcott',
    memberId: 'theresa-walcott',
    daysAgo: 29,
    context: 'Health coaching call',
    insight: "Theresa was really motivated about starting a weight management program. She said evenings after 7pm are the only time she can commit because of her kids' schedules. She asked me if anything virtual was available - I told her I'd look into it and get back to her.",
    followUp: 'Send Theresa a list of virtual evening weight management programs',
  },
]

const DAY3_CONTINUE = [
  { icon: 'Assignment', text: 'Update care plan goals', detail: 'Sarah Williams - last edited yesterday' },
]

function Card({ icon, iconColor, title, defaultOpen = true, action, children }: {
  icon: string
  iconColor: 'primary' | 'error'
  title: string
  defaultOpen?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderRow}>
        <button className={styles.cardHeader} type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          <Icon name={icon as never} size="sm" color={iconColor} />
          <span className={styles.cardTitle}>{title}</span>
          <Icon name={open ? 'ExpandLess' : 'ExpandMore'} size="sm" color="action" />
        </button>
        {action && <div className={styles.cardHeaderAction}>{action}</div>}
      </div>
      {open && <div className={styles.actionList}>{children}</div>}
    </div>
  )
}

function navigateToMedications(memberId: string) {
  window.parent.postMessage({ type: 'MEMBER_SWITCH_TAB', memberId, tab: 'medications' }, '*')
}

function Day0({ onPrompt }: { onPrompt: (text: string) => void }) {
  const [notesChecked, setNotesChecked] = useState<Set<string>>(new Set())

  function toggleNote(id: string) {
    setNotesChecked(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  return (
    <>
      <Day1 onPrompt={onPrompt} />
      <div className={styles.cards}>
        <Card icon="TaskAlt" iconColor="primary" title="Today's Tasks" defaultOpen={false}>
          {DAY2_TASKS.map(t => (
            <div key={t.text} className={styles.actionRowStatic}>
              <Icon name={t.icon as never} size="sm" color="action" />
              <div className={styles.taskRowContent}>
                <span className={styles.taskRowMember}>{t.member}</span>
                <span className={styles.actionText}>{t.text}</span>
              </div>
              <span className={`${styles.dueBadge} ${t.due === 'Today' ? styles.dueToday : ''}`}>{t.due}</span>
            </div>
          ))}
        </Card>

        <Card icon="AutoAwesome" iconColor="primary" title="Recent Notes (30 days)" defaultOpen={false}>
          {DAY2_NOTES.map(n => {
            const isChecked = notesChecked.has(n.id)
            return (
              <div key={n.id} className={styles.memberGroup}>
                <div className={styles.memberGroupHeader}>
                  <Icon name="Person" size="sm" color="action" />
                  <button
                    className={styles.alertMember}
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
                    onClick={() => window.parent.postMessage({ type: 'MEMBER_SWITCH', memberId: n.memberId, memberName: n.member }, '*')}
                  >
                    {n.member}
                  </button>
                  <span className={styles.noteMeta}>{n.daysAgo === 1 ? 'Yesterday' : `${n.daysAgo} days ago`} - {n.context}</span>
                </div>
                <div className={`${styles.alertItem} ${isChecked ? styles.alertItemChecked : ''}`}>
                  <div className={styles.alertRow}>
                    <Icon name="StickyNote2" size="sm" color="action" />
                    <div className={styles.noteInsightBlock}>
                      <span className={styles.actionText}>{n.insight}</span>
                      <button
                        className={styles.noteViewLink}
                        type="button"
                        onClick={() => window.parent.postMessage({ type: 'MEMBER_SWITCH', memberId: n.memberId, memberName: n.member }, '*')}
                      >
                        View note
                        <Icon name="OpenInNew" size="xs" color="primary" />
                      </button>
                    </div>
                  </div>
                  <button
                    className={`${styles.alertAction} ${isChecked ? styles.alertActionChecked : ''}`}
                    type="button"
                    onClick={() => { toggleNote(n.id); onPrompt(`Follow up with ${n.member}: ${n.followUp}`) }}
                    aria-pressed={isChecked}
                  >
                    <Icon name={isChecked ? 'CheckBox' : 'CheckBoxOutlineBlank'} size="sm" color="action" />
                    {n.followUp}
                  </button>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </>
  )
}

function Day1({ onPrompt }: { onPrompt: (text: string) => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [automated, setAutomated] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState<Set<string>>(new Set())
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [allDone, setAllDone] = useState(false)
  const [openModal, setOpenModal] = useState<Alert | null>(null)
  const [selectedActions, setSelectedActions] = useState<Record<string, Set<string>>>({})

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleAutomate() {
    const queue = ALERTS.filter(a => a.automate && checked.has(a.id))
    if (queue.length === 0) return
    setChecked(prev => { const next = new Set(prev); queue.forEach(a => next.delete(a.id)); return next })
    setRunning(new Set(queue.map(a => a.id)))
    setCompleted(new Set())
    setAllDone(false)
    queue.forEach((a, i) => {
      setTimeout(() => {
        setRunning(prev => { const next = new Set(prev); next.delete(a.id); return next })
        setCompleted(prev => { const next = new Set(prev); next.add(a.id); return next })
        if (i === queue.length - 1) {
          setTimeout(() => {
            setAllDone(true)
            setAutomated(prev => { const next = new Set(prev); queue.forEach(q => next.add(q.id)); return next })
          }, 400)
        }
      }, (i + 1) * 1200)
    })
  }

  const uncheckedAlerts = ALERTS.filter(a => !checked.has(a.id) && !automated.has(a.id))
  function addAll() { setChecked(new Set(uncheckedAlerts.map(a => a.id))) }

  const automateQueue = ALERTS.filter(a => a.automate && checked.has(a.id))
  const reviewQueue = ALERTS.filter(a => !a.automate && checked.has(a.id))
  const automatedItems = ALERTS.filter(a => automated.has(a.id))

  return (
    <>
    <div className={styles.cards}>
      <Card icon="NotificationImportant" iconColor="error" title="Needs your attention">
        {Array.from(new Set(ALERTS.map(a => a.member))).map(member => {
          const memberAlerts = ALERTS.filter(a => a.member === member)
          return (
            <div key={member} className={styles.memberGroup}>
              <div className={styles.memberGroupHeader}>
                <Icon name="Person" size="sm" color="action" />
                <span className={styles.alertMember}>{member}</span>
              </div>
              {memberAlerts.map(a => {
                const isChecked = checked.has(a.id)
                const isDone = automated.has(a.id)
                return (
                  <div key={a.id} className={`${styles.alertItem} ${isDone ? styles.alertItemDone : ''}`}>
                    <div className={styles.alertRow}>
                      <span className={`${styles.alertDot} ${styles[a.severity]}`} aria-hidden="true" />
                      <span className={styles.actionText}>
                        <span className={styles.alertLabel}>{a.label}</span>
                        <span className={styles.alertDetail}> - {a.detail}</span>
                      </span>
                    </div>
                    {a.secondAction ? (
                      <div className={styles.radioGroup} role="group" aria-label={`Action for ${a.label}`}>
                        {[a.secondAction, a.action].map(option => {
                          const selected = selectedActions[a.id]?.has(option) ?? false
                          const isAutomateOption = option === a.action
                          return (
                            <div key={option} className={styles.radioOptionWrap}>
                              <label className={`${styles.radioOption} ${selected ? styles.radioOptionSelected : ''} ${isDone ? styles.radioOptionDone : ''}`}>
                                <input
                                  type="checkbox"
                                  value={option}
                                  checked={selected}
                                  disabled={isDone}
                                  onChange={() => {
                                    const cur = new Set(selectedActions[a.id] ?? [])
                                    cur.has(option) ? cur.delete(option) : cur.add(option)
                                    setSelectedActions(prev => ({ ...prev, [a.id]: cur }))
                                    if (cur.size > 0 && !checked.has(a.id)) toggle(a.id)
                                    if (cur.size === 0 && checked.has(a.id)) toggle(a.id)
                                  }}
                                  className={styles.radioInputHidden}
                                />
                                <Icon name={selected ? 'CheckBox' : 'CheckBoxOutlineBlank'} size="sm" color={selected ? 'primary' : 'action'} />
                                {option}
                              </label>
                              {isAutomateOption && a.note && selected && (
                                <p className={styles.alertNote}>{a.note}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <button
                        className={`${styles.alertAction} ${isChecked ? styles.alertActionChecked : ''}`}
                        type="button"
                        onClick={() => toggle(a.id)}
                        aria-pressed={isChecked}
                        disabled={isDone}
                      >
                        <Icon name={isDone || isChecked ? 'CheckBox' : 'CheckBoxOutlineBlank'} size="sm" color={isDone || isChecked ? 'primary' : 'action'} />
                        {a.action}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}

        {uncheckedAlerts.length > 0 && (
          <div className={styles.addAllRow}>
            <button className={styles.addAllBtn} type="button" onClick={addAll}>Add all</button>
          </div>
        )}

        {(automateQueue.length > 0 || running.size > 0 || completed.size > 0) && !allDone && (
          <div className={styles.queueSection}>
            <div className={styles.queueHeader}>
              <Icon name="AutoAwesome" size="sm" color="primary" />
              <span className={styles.queueTitle}>Tasks ({automateQueue.length + running.size + completed.size})</span>
              {automateQueue.length > 0 && running.size === 0 && (
                <button className={styles.automateAllBtn} type="button" onClick={handleAutomate}>
                  <Icon name="PlayArrow" size="sm" color="inverse" />
                  Run Tasks
                </button>
              )}
            </div>
            <div className={styles.queueItems}>
              {[...automateQueue, ...ALERTS.filter(a => running.has(a.id) || (completed.has(a.id) && !automated.has(a.id)))].map(a => {
                const isRunning = running.has(a.id)
                const isDone = completed.has(a.id)
                return (
                  <div key={a.id} className={`${styles.queueItem} ${isDone ? styles.queueItemDone : ''}`}>
                    {isRunning ? (
                      <span className={styles.queueItemSpinner} aria-label="Running" />
                    ) : isDone ? (
                      <Icon name="CheckCircle" size="sm" color="primary" />
                    ) : (
                      <button className={styles.queueItemCheck} type="button" onClick={() => toggle(a.id)} aria-label={`Remove ${a.action} from task list`}>
                        <Icon name="CheckBox" size="sm" color="primary" />
                      </button>
                    )}
                    <div className={styles.queueItemText}>
                      <span className={styles.queueMember}>{a.member}</span>
                      <span className={`${styles.queueAction} ${isRunning ? styles.queueActionRunning : ''}`}>
                        {selectedActions[a.id]?.size ? Array.from(selectedActions[a.id]).join(' + ') : a.action}
                      </span>
                      {(selectedActions[a.id]?.has('Outreach with Sage') || a.action === 'Outreach with Sage') && (
                        <>
                          <span className={styles.sageStepsLabel}>Sage will perform these actions:</span>
                          <ul className={styles.sageSteps}>
                            <li>Sage will call member using phone number on file.</li>
                            <li>Sage will give assessment to member on your behalf.</li>
                            <li>Sage will pick up answers and insights based on what member says.</li>
                            <li>You will get a notification after Sage is done with member call and see information.</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {allDone && (
          <div className={styles.allDoneBanner}>
            <Icon name="CheckCircle" size="sm" color="primary" />
            <span>Complete!</span>
          </div>
        )}

        {reviewQueue.length > 0 && (
          <div className={styles.queueSection}>
            <div className={`${styles.queueHeader} ${styles.queueHeaderReview}`}>
              <Icon name="PersonSearch" size="sm" color="action" />
              <span className={styles.queueTitle}>Requires your review ({reviewQueue.length})</span>
            </div>
            <div className={styles.queueItems}>
              {reviewQueue.map(a => (
                <div key={a.id} className={styles.queueItem}>
                  <button className={styles.queueItemCheck} type="button" onClick={() => toggle(a.id)} aria-label={`Remove ${a.action} from review list`}>
                    <Icon name="CheckBox" size="sm" color="primary" />
                  </button>
                  <div className={styles.queueItemText}>
                    <span className={styles.queueMember}>{a.member}</span>
                    {a.medicationLink ? (
                      <button className={styles.medicationLink} type="button" onClick={() => navigateToMedications(a.memberId)}>
                        {a.action}
                        <Icon name="OpenInNew" size="sm" color="primary" />
                      </button>
                    ) : (
                      <span className={styles.queueAction}>{a.action}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {automatedItems.length > 0 && (
          <div className={styles.automatedBanner}>
            <Icon name="CheckCircle" size="sm" color="primary" />
            <span>{automatedItems.length} task{automatedItems.length > 1 ? 's' : ''} being handled by Haven</span>
          </div>
        )}
      </Card>
    </div>

    {openModal && (
      <AddActivityModal
        config={{ title: 'Add Activity', activityType: 'Follow-up', contactType: 'Member - Phone', scheduledDate: '' } as ActivityConfig}
        memberName={openModal.member}
        onClose={() => setOpenModal(null)}
        onAdd={() => setOpenModal(null)}
      />
    )}
    </>
  )
}

function Day2({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className={styles.cards}>
      <Card icon="TaskAlt" iconColor="primary" title="Today's Tasks">
        {DAY2_TASKS.map(t => (
          <div key={t.text} className={styles.actionRowStatic}>
            <Icon name={t.icon as never} size="sm" color="action" />
            <div className={styles.taskRowContent}>
              <span className={styles.taskRowMember}>{t.member}</span>
              <span className={styles.actionText}>{t.text}</span>
            </div>
            <span className={`${styles.dueBadge} ${t.due === 'Today' ? styles.dueToday : ''}`}>{t.due}</span>
          </div>
        ))}

        <div className={styles.actionRowStatic}>
          <Icon name="AutoAwesome" size="sm" color="action" />
          <div className={styles.taskRowContent}>
            <span className={styles.taskRowMember}>Sarah Williams</span>
            <span className={styles.actionText}>Sage successfully called member. <button type="button" className={styles.inlineLink} onClick={() => onPrompt('Show me Sarah Williams assessment answers and insights from the Sage call')}>Review assessment answers and insights</button></span>
          </div>
          <span className={`${styles.dueBadge} ${styles.dueToday}`}>Today</span>
        </div>
      </Card>
    </div>
  )
}

function Day4({ onPrompt }: { onPrompt: (text: string) => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setChecked(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  return (
    <div className={styles.cards}>
      <Card icon="AutoAwesome" iconColor="primary" title="Recent Notes (30 days)">
        {DAY2_NOTES.map(n => {
          const isChecked = checked.has(n.id)
          return (
            <div key={n.id} className={styles.memberGroup}>
              <div className={styles.memberGroupHeader}>
                <Icon name="Person" size="sm" color="action" />
                <button
                  className={styles.alertMember}
                  type="button"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
                  onClick={() => window.parent.postMessage({ type: 'MEMBER_SWITCH', memberId: n.memberId, memberName: n.member }, '*')}
                >
                  {n.member}
                </button>
                <span className={styles.noteMeta}>{n.daysAgo === 1 ? 'Yesterday' : `${n.daysAgo} days ago`} - {n.context}</span>
              </div>
              <div className={`${styles.alertItem} ${isChecked ? styles.alertItemChecked : ''}`}>
                <div className={styles.alertRow}>
                  <Icon name="StickyNote2" size="sm" color="action" />
                  <div className={styles.noteInsightBlock}>
                    <span className={styles.actionText}>{n.insight}</span>
                    <button
                      className={styles.noteViewLink}
                      type="button"
                      onClick={() => window.parent.postMessage({ type: 'MEMBER_SWITCH', memberId: n.memberId, memberName: n.member }, '*')}
                    >
                      View note
                      <Icon name="OpenInNew" size="xs" color="primary" />
                    </button>
                  </div>
                </div>
                <button
                  className={`${styles.alertAction} ${isChecked ? styles.alertActionChecked : ''}`}
                  type="button"
                  onClick={() => { toggle(n.id); onPrompt(`Follow up with ${n.member}: ${n.followUp}`) }}
                  aria-pressed={isChecked}
                >
                  <Icon name={isChecked ? 'CheckBox' : 'CheckBoxOutlineBlank'} size="sm" color="action" />
                  {n.followUp}
                </button>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function Day3({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className={styles.cards}>
      <Card icon="History" iconColor="primary" title="Continue where you left off">
        {DAY3_CONTINUE.map(a => (
          <div key={a.text} className={styles.actionRowStatic}>
            <Icon name={a.icon as never} size="sm" color="action" />
            <div className={styles.taskRowContent}>
              <span className={styles.actionText}>{a.text}</span>
              <span className={styles.taskRowDetail}>{a.detail}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

interface RiskLayers {
  automated: string   // Layer 1: HCC/claims-based risk model
  assessment: string  // Layer 2: HRA / PAM engagement level
  sdoh: string        // Layer 3: SDOH + clinical context
}

interface IntakeMember {
  id: string
  memberId: string
  name: string
  dob: string
  plan: string
  condition: string
  riskScore: number
  riskLevel: 'high' | 'medium' | 'low'
  daysUntilDue: number
  snapshot: string
  reasoning: string
  layers: RiskLayers
  assignedPriority: 'high' | 'medium' | 'low' | null
}

const INTAKE_MEMBERS: IntakeMember[] = [
  // ── HIGH PRIORITY (7 members, sorted soonest due first) ──────────────────
  {
    id: 'im-1', memberId: 'frank-delgado', name: 'Frank Delgado', dob: '03/14/1961',
    plan: 'Alaska Care Plus', condition: 'CHF, Atrial Fibrillation', riskScore: 3.5, riskLevel: 'high', daysUntilDue: 2,
    snapshot: "Frank is a 65-year-old with CHF and atrial fibrillation who was discharged from the hospital three days ago after a decompensation episode. His Warfarin INR was subtherapeutic at discharge and hasn't been rechecked. He lives alone, has limited mobility, and his daughter checks in on weekends only. He agreed to care manager follow-up before leaving the hospital.",
    reasoning: 'Post-discharge INR recheck must happen within 2 days — subtherapeutic anticoagulation post-AFib hospitalization is a stroke risk. Most time-critical contact on the panel.',
    layers: {
      automated:  'HCC score 3.5 - CHF and AFib; discharged 3 days ago. INR subtherapeutic at discharge, no follow-up lab on record. Limited mobility noted in discharge summary.',
      assessment: 'HRA not completed post-discharge. PHQ-9 not yet scored this cycle. PAM unknown. Member agreed to care management follow-up before discharge.',
      sdoh:       'Lives alone; limited mobility. Daughter visits weekends only. No regular transportation — relies on daughter for appointments. Fixed income.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-2', memberId: 'adrienne-kowalski', name: 'Adrienne Kowalski', dob: '07/22/1952',
    plan: 'Alaska Premier Health', condition: 'ESRD on Dialysis, Type 2 Diabetes', riskScore: 4.3, riskLevel: 'high', daysUntilDue: 4,
    snapshot: "Adrienne is a 73-year-old on hemodialysis three times a week for end-stage renal disease, combined with poorly controlled Type 2 Diabetes (A1C 9.8%). She missed two dialysis sessions last month, which triggered a hospitalization. Transportation to dialysis is the central barrier — her son works full-time and can't always drive her. Her nephrologist flagged her for care management.",
    reasoning: 'Transportation barrier causing missed dialysis — outreach window closes in 4 days. Connecting her with a medical transport benefit could prevent another hospitalization.',
    layers: {
      automated:  'HCC score 4.3 - ESRD on HD 3x/week. A1C 9.8%. Two missed dialysis sessions last month leading to hospitalization. Son is primary transport but unreliable due to work schedule.',
      assessment: 'HRA not completed this cycle. PHQ-9 score 8. PAM score 40 (Level 2). Member willing to engage but frustrated with transportation barrier.',
      sdoh:       'Lives with son; no independent transportation. Son employed full-time — inconsistent availability for dialysis runs. Fixed income. No food insecurity.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-3', memberId: 'yolanda-reeves', name: 'Yolanda Reeves', dob: '11/08/1958',
    plan: 'Alaska Premier Health', condition: 'Stroke (3 wks post), Hypertension', riskScore: 3.7, riskLevel: 'high', daysUntilDue: 7,
    snapshot: "Yolanda is a 67-year-old who had an ischemic stroke three weeks ago and was discharged home with aphasia. Her husband manages her medications but her BP was 168/102 at the last home visit. Her amlodipine fill lapsed during the hospitalization and neurology follow-up isn't scheduled for another three weeks.",
    reasoning: 'Uncontrolled BP in the acute post-stroke window is the leading modifiable risk for a second stroke. Medication gap must be addressed within 7 days.',
    layers: {
      automated:  'HCC score 3.7 - ischemic stroke 3 weeks ago. BP 168/102 at last home visit. Amlodipine fill lapsed during hospitalization. Neurology follow-up not scheduled until 3 weeks out.',
      assessment: 'HRA not completed post-discharge. PHQ-2 positive screen. PAM not yet scored. Husband is primary caregiver and point of contact — aphasia limits direct communication.',
      sdoh:       'Lives with husband; strong caregiver support. Aphasia limits phone communication — husband must be primary contact. No food or housing concerns.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-4', memberId: 'carol-petersen', name: 'Carol Petersen', dob: '11/22/1961',
    plan: 'Alaska Premier Health', condition: 'Breast Cancer (remission), Anxiety', riskScore: 3.1, riskLevel: 'high', daysUntilDue: 10,
    snapshot: "Carol is a 64-year-old who completed breast cancer treatment two years ago and is in remission. She's on an aromatase inhibitor and is due for oncology surveillance that is now six weeks overdue. She has moderate anxiety (GAD-7 of 14) that makes it hard for her to initiate appointments on her own. She returned to part-time work after treatment and has financial stress from outstanding medical bills, but has a supportive sister nearby.",
    reasoning: 'Oncology surveillance follow-up is 6 weeks overdue and must be completed within 10 days to meet HEDIS requirements. Anxiety is limiting her ability to self-schedule. A single care manager call to coordinate the appointment has a high likelihood of closing this gap.',
    layers: {
      automated:  'HCC score 3.1 - breast cancer in remission (2 years) with ongoing surveillance. 6 active prescriptions including aromatase inhibitor. Post-treatment oncology follow-up overdue by 6 weeks.',
      assessment: 'HRA completed 5/2026. GAD-7 score 14 (moderate anxiety). PHQ-9 score 8. PAM score 61 (Level 3 - moderate activation). Member wants to stay engaged but reports anxiety limiting her ability to initiate appointments.',
      sdoh:       'Returned to part-time work after treatment. Reports financial stress from medical bills still outstanding. Strong informal support network (sister nearby). No housing or food concerns.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-5', memberId: 'marta-goldstein', name: 'Marta Goldstein', dob: '09/17/1947',
    plan: 'Alaska Premier Health', condition: 'COPD, Pulmonary Hypertension', riskScore: 3.6, riskLevel: 'high', daysUntilDue: 14,
    snapshot: "Marta is a 78-year-old with severe COPD and pulmonary hypertension on supplemental oxygen. She's had two hospitalizations for exacerbations in the past six months and her rescue inhaler fill rate is 5x expected. She lives with her adult daughter who is overwhelmed managing caregiving while working. Marta is engaged and anxious about her prognosis.",
    reasoning: 'Oxygen overuse and inhaler spiking signal an escalating exacerbation pattern. Outreach due in 14 days — pulmonologist coordination and caregiver support are both needed.',
    layers: {
      automated:  'HCC score 3.6 - severe COPD + pulmonary HTN on supplemental O2. Two hospitalizations for exacerbations in past 6 months. Rescue inhaler fills 5x expected rate.',
      assessment: 'HRA completed 3/2026. PHQ-9 score 9. PAM score 44 (Level 2). Member engaged but anxious; caregiver daughter is overwhelmed.',
      sdoh:       'Lives with adult daughter who is primary caregiver. Daughter working full-time — reports burnout. No food or housing concerns. Telehealth-capable.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-6', memberId: 'elena-vasquez', name: 'Elena Vasquez', dob: '06/30/1953',
    plan: 'Alaska Premier Health', condition: 'Stroke (6 wks post), Hypertension', riskScore: 3.6, riskLevel: 'high', daysUntilDue: 18,
    snapshot: "Elena is a 72-year-old who had a stroke six weeks ago and was discharged home. Her BP was 162/98 at the last reading and she has a fill gap on her amlodipine — last filled in April. Neurology follow-up hasn't been scheduled yet. She has limited English proficiency and her daughter is the primary caregiver and main point of contact. An interpreter is needed for all calls.",
    reasoning: 'Six weeks post-stroke with outreach due in 18 days. Antihypertensive fill gap identified last week — unmanaged BP is the primary secondary stroke risk factor. Neurology follow-up not yet scheduled; care manager coordination is the key action this cycle.',
    layers: {
      automated:  'HCC score 3.6 - stroke 6 weeks ago; discharged to home with PT order. BP 162/98 at last reading. Antihypertensive fill gap for amlodipine (last filled 4/2026). Neurology follow-up not on record.',
      assessment: 'HRA not completed post-discharge. PHQ-2 score 3 (positive screen for depression). PAM not yet scored. Daughter is primary caregiver and engaged with care team.',
      sdoh:       'Lives with daughter; strong caregiver support. Spanish preferred. Limited English proficiency — interpreter needed for all contacts. No food or housing concerns.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-7', memberId: 'harold-simmons', name: 'Harold Simmons', dob: '01/17/1945',
    plan: 'Alaska Care Plus', condition: 'Heart Failure, COPD, CKD Stage II', riskScore: 4.1, riskLevel: 'high', daysUntilDue: 22,
    snapshot: "Harold is an 81-year-old managing heart failure, COPD, and CKD Stage II. Remote monitoring flagged a 4 lb weight gain in 48 hours last week — his PCP was notified but he hasn't been contacted by care management yet. His loop diuretic fill rate is 71% and his kidney function has declined over the past 90 days. He's had two hospitalizations in the past year. He lives in a rural area 60 miles from the nearest hospital but is telehealth-capable. His wife helps with scheduling.",
    reasoning: 'Highest HCC score on the panel — three major chronic conditions with compounding risk. Outreach window is 22 days. Remote monitoring flagged a 4 lb weight gain in 48 hours last week; PCP was notified but member has not yet been contacted by care management.',
    layers: {
      automated:  'HCC score 4.1 - 3 major conditions. Remote monitoring alert: 4 lb weight gain in 48 hrs (6/8/2026). Loop diuretic fill rate 71%. CKD progression noted in last labs (GFR dropped from 52 to 44 in 90 days). Two hospitalizations in past year.',
      assessment: 'HRA completed 3/2026. PHQ-9 score 7. PAM score 45 (Level 2). Member receptive on calls but requires significant support to execute follow-through. Wife assists with scheduling.',
      sdoh:       'Retired; wife is primary support. Fixed income — reports concern about copay costs. No food insecurity. Lives in rural area, 60 min from nearest hospital. Telehealth-capable.',
    },
    assignedPriority: null,
  },

  // ── MEDIUM PRIORITY (7 members, sorted soonest due first) ────────────────
  {
    id: 'im-8', memberId: 'priya-mehta', name: 'Priya Mehta', dob: '06/03/1982',
    plan: 'Alaska Premier Health', condition: 'Lupus (SLE), Depression', riskScore: 2.2, riskLevel: 'medium', daysUntilDue: 5,
    snapshot: "Priya is a 44-year-old with systemic lupus erythematosus managed on hydroxychloroquine and periodic steroids. She had a minor flare last month and her rheumatologist increased her prednisone dose temporarily. Her PHQ-9 is 11 — depression is a known comorbidity with lupus flares. A behavioral health screen is due this cycle. She's employed as a teacher and finds it hard to take time off for appointments.",
    reasoning: 'Behavioral health screen due in 5 days following the recent flare. Depression during lupus flares can accelerate disease progression — timely screening is clinically important.',
    layers: {
      automated:  'HCC score 2.2 - SLE on hydroxychloroquine; prednisone dose increased last month for minor flare. PHQ-9 score 11 at last contact. Behavioral health screen due this cycle.',
      assessment: 'HRA completed 3/2026. PHQ-9 score 11 (moderate depression). PAM score 61 (Level 3). Member motivated but limited availability due to teaching schedule.',
      sdoh:       'Employed full-time as teacher. Reports difficulty taking time off for appointments. No food or housing concerns. Spouse supportive.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-9', memberId: 'deshawn-holloway', name: 'DeShawn Holloway', dob: '02/19/1976',
    plan: 'Alaska Care Plus', condition: 'HIV, Hypertension', riskScore: 1.9, riskLevel: 'medium', daysUntilDue: 9,
    snapshot: "DeShawn is a 50-year-old with HIV on ART — his last viral load was undetectable. He also has hypertension that's been harder to control recently, with BP averaging 146/90 over the past 30 days. His CD4 and viral load labs are due this cycle and haven't been ordered yet. He's engaged with his HIV specialist but less connected to primary care. He prefers low-contact outreach and values privacy.",
    reasoning: 'CD4 and viral load labs are due and BP trending up — outreach window closes in 9 days. One well-coordinated contact can close both gaps.',
    layers: {
      automated:  'HCC score 1.9 - HIV on ART (last VL undetectable). BP averaging 146/90 past 30 days. CD4 and viral load labs due this cycle, not yet ordered.',
      assessment: 'HRA completed 2/2026. PHQ-9 score 5. PAM score 68 (Level 3). Engaged with HIV specialist; less connected to primary care. Values privacy — avoid HIV disclosure in voicemails.',
      sdoh:       'Employed; stable housing. No food insecurity. Prefers minimal contact outreach. No transportation barriers.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-10', memberId: 'ingrid-sorensen', name: 'Ingrid Sorensen', dob: '04/27/1970',
    plan: 'Alaska Premier Health', condition: 'Multiple Sclerosis, Anxiety', riskScore: 2.0, riskLevel: 'medium', daysUntilDue: 13,
    snapshot: "Ingrid is a 56-year-old with relapsing-remitting MS on Ocrevus infusions. Her next infusion is due and the prior auth hasn't been submitted yet. She also has generalized anxiety that worsens around infusion periods. She works remotely and is organized, but relies on her care manager to initiate the authorization process. Her last MRI showed no new lesions.",
    reasoning: 'Prior auth for Ocrevus must be submitted within 13 days to avoid an infusion delay. A lapse in biologic therapy increases relapse risk.',
    layers: {
      automated:  'HCC score 2.0 - relapsing-remitting MS on Ocrevus. Prior auth for next infusion not yet submitted. Last MRI no new lesions. Anxiety worsens during infusion windows.',
      assessment: 'HRA completed 2/2026. GAD-7 score 11. PHQ-9 score 5. PAM score 64 (Level 3). Relies on care manager to initiate prior auth process.',
      sdoh:       'Employed remotely; stable housing and income. No food or transportation concerns. Husband supportive.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-11', memberId: 'nadia-foster', name: 'Nadia Foster', dob: '03/19/1978',
    plan: 'Alaska Care Plus', condition: 'Multiple Sclerosis, Depression', riskScore: 2.1, riskLevel: 'medium', daysUntilDue: 17,
    snapshot: "Nadia is a 48-year-old with relapsing-remitting MS on Tecfidera. Her prior authorization expires on 6/28 and needs to be renewed. She had one relapse in the past year and her last neurology visit was three months ago. She screens positive for mild-to-moderate depression (PHQ-9 of 9) and reports fatigue affecting her social life. She works part-time with a disability accommodation and her husband is supportive.",
    reasoning: 'DMT refill authorization expires in 17 days — a gap in MS medication increases relapse risk significantly. Depression screen is also due this cycle. Proactive outreach now prevents a medication gap and captures the behavioral health screen in one contact.',
    layers: {
      automated:  'HCC score 2.1 - relapsing-remitting MS on disease-modifying therapy. Prior auth for Tecfidera expires 6/28/2026. One relapse in past 12 months. Neurologist visit 3 months ago.',
      assessment: 'HRA completed 2/2026. PHQ-9 score 9 (mild-moderate depression). PAM score 63 (Level 3). Member self-managing but fatigued; expresses concern about long-term disability trajectory.',
      sdoh:       'Employed part-time; disability accommodation in place. Reports fatigue limiting social activity. Husband supportive. No food or housing concerns. Lives in Anchorage — good provider access.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-12', memberId: 'darnell-washington', name: 'Darnell Washington', dob: '11/05/1967',
    plan: 'Alaska Premier Health', condition: 'Type 2 Diabetes, Hypertension', riskScore: 1.7, riskLevel: 'medium', daysUntilDue: 21,
    snapshot: "Darnell is a 58-year-old with well-managed Type 2 Diabetes and hypertension. His A1C is 7.4% and his BP is 132/84 on medication. He takes his medications consistently but has gaps in understanding his monitoring targets — he's not clear on what his lab numbers mean. His wife is involved in his care. He has open HEDIS gaps for HbA1c repeat and nephropathy screening this cycle.",
    reasoning: 'Annual HEDIS CDC measure outreach due in 21 days — HbA1c and nephropathy screening both open. Medication adherence is strong but health literacy gaps around monitoring put him at risk for silent progression. Adequate runway to close both gaps in one outreach cycle.',
    layers: {
      automated:  'HCC score 1.7 - 2 well-managed chronic conditions. A1C 7.4% (last draw 3 months ago, due for repeat). BP 132/84 on medication. No acute utilization. HEDIS CDC measure open for HbA1c and nephropathy screen.',
      assessment: 'HRA completed 1/2026. PHQ-9 score 3. PAM score 66 (Level 3). Member adherent to medication but reports confusion about monitoring targets. Health coaching referral pending.',
      sdoh:       'Employed; moderate income. Wife engaged in care. No SDOH concerns. Good health literacy for medications, gaps around lab monitoring and diet targets.',
    },
    assignedPriority: null,
  },

  // ── LOW PRIORITY (6 members, sorted most time remaining first) ───────────
  {
    id: 'im-15', memberId: 'patricia-morales', name: 'Patricia Morales', dob: '12/01/1991',
    plan: 'Alaska Premier Health', condition: 'Migraine, Iron Deficiency Anemia', riskScore: 0.5, riskLevel: 'low', daysUntilDue: 28,
    snapshot: "Patricia is a 34-year-old graduate student and full-time employee managing migraines and iron deficiency anemia. Both conditions are well-controlled — her ferritin levels have been normalizing and her triptan use is within the expected range. She's highly self-directed, follows up with her PCP on her own, and has no SDOH barriers. Annual check-in only.",
    reasoning: 'Annual check-in due in 28 days. Both conditions are well-controlled and member is highly self-managing. Plenty of time — schedule a brief touchpoint in the next few weeks to close the cycle.',
    layers: {
      automated:  'HCC score 0.5 - 2 low-acuity conditions. Ferritin levels normalizing per last lab. Triptan use within expected range. No hospitalizations in 12+ months.',
      assessment: 'HRA completed 3/2026. PHQ-9 score 2. PAM score 88 (Level 4 - highly activated). Self-managing effectively; tracks symptoms and follows up with PCP proactively.',
      sdoh:       'Employed full-time; graduate student. Busy schedule but no significant SDOH barriers. Adequate nutrition and stable housing.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-16', memberId: 'wanda-hutchins', name: 'Wanda Hutchins', dob: '12/30/1953',
    plan: 'Alaska Premier Health', condition: 'Osteoporosis, History of Falls', riskScore: 0.8, riskLevel: 'low', daysUntilDue: 19,
    snapshot: "Wanda is a 72-year-old with osteoporosis and a prior fall history — no falls in the past 10 months since completing a balance program. Her bisphosphonate adherence is 94% and her DEXA from February shows stable bone density. Her annual physical is in about two weeks. She's active, lives with her husband, and manages her own care.",
    reasoning: 'Annual physical coming up is a natural touchpoint in 19 days. Fall prevention reinforcement is the key action — no escalation needed.',
    layers: {
      automated:  'HCC score 0.8 - osteoporosis; 1 fall-related ER visit 10 months ago, none since. Bisphosphonate adherence 94%. DEXA 2/2026 stable. Annual physical due.',
      assessment: 'HRA completed 2/2026. PHQ-9 score 2. PAM score 78 (Level 4). Completed fall prevention program; reports improved balance and confidence.',
      sdoh:       'Lives with husband; active social life. No food, housing, or transportation concerns.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-17', memberId: 'linda-castillo', name: 'Linda Castillo', dob: '05/08/1985',
    plan: 'Alaska Care Plus', condition: 'Asthma, Seasonal Allergies', riskScore: 0.9, riskLevel: 'low', daysUntilDue: 16,
    snapshot: "Linda is a 41-year-old with well-controlled asthma and seasonal allergies. She uses her rescue inhaler at the expected rate and hasn't had an ER or urgent care visit in over a year. Her preventive care is current and she's highly self-managing. No SDOH concerns. Routine 6-month check-in.",
    reasoning: 'Routine 6-month check-in due in 16 days. Both conditions well-controlled; PAM of 84 confirms high self-management. A brief check-in call is sufficient — no clinical escalation needed.',
    layers: {
      automated:  'HCC score 0.9 - 2 conditions, both well-controlled. Rescue inhaler fills within expected range (1/quarter). No ER or urgent care visits in 12 months. Preventive care up to date.',
      assessment: 'HRA completed 1/2026. PHQ-9 score 1. PAM score 84 (Level 4 - high activation). Highly self-managing; no significant barriers identified.',
      sdoh:       'Stable housing and employment. Active lifestyle. No SDOH concerns flagged.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-18', memberId: 'paulo-ferreira', name: 'Paulo Ferreira', dob: '06/18/1957',
    plan: 'Alaska Care Plus', condition: 'Type 2 Diabetes, Hyperlipidemia', riskScore: 0.7, riskLevel: 'low', daysUntilDue: 12,
    snapshot: "Paulo is a 68-year-old retired bilingual (Portuguese/English) member with well-controlled Type 2 Diabetes (A1C 6.9%) and hyperlipidemia on a statin. His lipid panel is due this cycle and the lab order is already placed. He actively manages his own health and has no SDOH concerns. A reminder call to confirm the lab appointment is all that's needed.",
    reasoning: 'Lipid panel due in 12 days — lab order is placed, member needs a brief reminder to confirm.',
    layers: {
      automated:  'HCC score 0.7 - T2DM well-controlled (A1C 6.9%). Statin adherence 95%. Lipid panel due; lab order in place. No acute utilization in 16 months.',
      assessment: 'HRA completed 4/2026. PHQ-9 score 2. PAM score 82 (Level 4). Highly self-managing; tracks labs independently.',
      sdoh:       'Retired; active lifestyle. No SDOH concerns. Portuguese and English spoken.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-19', memberId: 'grace-obi', name: 'Grace Obi', dob: '09/14/1988',
    plan: 'Alaska Care Plus', condition: 'Hypothyroidism, Mild Anemia', riskScore: 0.6, riskLevel: 'low', daysUntilDue: 8,
    snapshot: "Grace is a 37-year-old with hypothyroidism and mild anemia. Her Levothyroxine dose was adjusted two months ago and her TSH recheck is due in 8 days — the lab order is already in place. Her hemoglobin is stable at 11.8. She's proactive about her care, prefers text or email contact, and has no SDOH concerns. A brief reminder to confirm she's scheduled the lab is all that's needed.",
    reasoning: 'TSH lab check due in 8 days — straightforward follow-up on a recent Levothyroxine dose adjustment. Both conditions are stable; outreach is a quick courtesy call to confirm labs are scheduled.',
    layers: {
      automated:  'HCC score 0.6 - hypothyroidism on Levothyroxine (dose adjusted 2 months ago). TSH recheck due 6/19/2026. Hemoglobin stable at 11.8. No acute utilization. Prescription fill rate 97%.',
      assessment: 'HRA completed 4/2026. PHQ-9 score 2. PAM score 81 (Level 4). Member proactively tracks symptoms and communicates with PCP. No care management barriers identified.',
      sdoh:       'Employed; young family. No SDOH concerns. Prefers text or email contact. Health literate and self-directed.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-20', memberId: 'victor-nguyen', name: 'Victor Nguyen', dob: '04/02/1960',
    plan: 'Alaska Premier Health', condition: 'Type 2 Diabetes, Hyperlipidemia', riskScore: 0.7, riskLevel: 'low', daysUntilDue: 3,
    snapshot: "Victor is a 66-year-old retired bilingual (English/Vietnamese) member with well-controlled Type 2 Diabetes and hyperlipidemia. His A1C is 6.8% and his statin adherence is 94%. A lipid panel is due in 3 days and the lab order is already placed — he just needs a reminder to confirm the appointment. He independently tracks his labs and follows his PCP's guidance closely.",
    reasoning: 'Lipid panel due in 3 days — lab order is already placed, member just needs a reminder call to confirm the appointment. Both conditions are well-controlled. Lowest-effort contact on the panel this cycle.',
    layers: {
      automated:  'HCC score 0.7 - T2DM well-controlled (A1C 6.8%). Statin adherence 94%. Lipid panel due 6/14/2026 (lab order in place). No acute utilization in 18 months.',
      assessment: 'HRA completed 5/2026. PHQ-9 score 1. PAM score 83 (Level 4). Highly self-managing; no gaps identified. Member tracks labs independently and follows PCP guidance.',
      sdoh:       'Retired; active lifestyle. Strong family support network. No SDOH concerns. English and Vietnamese spoken — English preferred for care contacts.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-21', memberId: 'beverly-osei', name: 'Beverly Osei', dob: '02/11/1963',
    plan: 'Alaska Care Plus', condition: 'Hypothyroidism, Osteopenia', riskScore: 0.6, riskLevel: 'low', daysUntilDue: 24,
    snapshot: "Beverly is a 63-year-old retired nurse with hypothyroidism and osteopenia, both stable. Her TSH is well-controlled on a steady Levothyroxine dose and her most recent DEXA scan from January 2026 shows no significant change. She's highly health literate, attends all her appointments independently, and has no SDOH concerns. Annual wellness check-in only.",
    reasoning: 'Routine annual touchpoint due in 24 days. TSH is stable and DEXA scan is current. No clinical urgency — a brief wellness check-in is sufficient this cycle.',
    layers: {
      automated:  'HCC score 0.6 - hypothyroidism well-controlled on stable Levothyroxine dose. Osteopenia monitored; DEXA current (1/2026). No acute utilization in 14 months. Calcium and Vitamin D supplements adherent.',
      assessment: 'HRA completed 2/2026. PHQ-9 score 3. PAM score 80 (Level 4). Proactive about preventive care; attends all scheduled appointments independently.',
      sdoh:       'Retired nurse; strong health literacy. Lives with spouse. No SDOH concerns. Prefers afternoon calls. Reliable transportation.',
    },
    assignedPriority: null,
  },
  {
    id: 'im-22', memberId: 'terry-block', name: 'Terry Block', dob: '07/29/1975',
    plan: 'Alaska Premier Health', condition: 'Seasonal Allergies, Mild Hypertension', riskScore: 0.4, riskLevel: 'low', daysUntilDue: 30,
    snapshot: "Terry is a 50-year-old employed member with mild hypertension and seasonal allergies, both well-controlled. His BP averages 124/78 on medication and his allergy symptoms are managed OTC. No ER, urgent care, or hospital activity in two years. He's highly self-managing with no SDOH concerns. Full 30 days remaining — schedule at end of cycle.",
    reasoning: 'Lowest-complexity member on the panel. BP is well-controlled and allergy season is winding down. Full 30 days remaining — schedule at the end of the cycle or bundle with another low-priority outreach.',
    layers: {
      automated:  'HCC score 0.4 - mild hypertension well-controlled (BP avg 124/78). Allergy medication OTC, no Rx fills needed. No ER, urgent care, or hospital activity in 24 months.',
      assessment: 'HRA completed 4/2026. PHQ-9 score 1. PAM score 86 (Level 4). Member self-managing effectively; no behavioral health or SDOH concerns identified.',
      sdoh:       'Employed full-time. Stable housing, income, and social support. No SDOH flags. Healthy lifestyle reported. No barriers to care.',
    },
    assignedPriority: null,
  },
]

const RISK_COLORS: Record<IntakeMember['riskLevel'], string> = {
  high:   '#d32f2f',
  medium: '#ed6c02',
  low:    '#2e7d32',
}

const RISK_BG: Record<IntakeMember['riskLevel'], string> = {
  high:   '#fdecea',
  medium: '#fff4e5',
  low:    '#edf7ed',
}


function MonthlyIntake() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [intakeOpen, setIntakeOpen] = useState(false)
  const [sageSelected, setSageSelected] = useState<Set<string>>(new Set())
  const [sageRunning, setSageRunning] = useState<Set<string>>(new Set())
  const [sageDone, setSageDone] = useState<Set<string>>(new Set())
  const [sageAllDone, setSageAllDone] = useState(false)

  const [actSelected, setActSelected] = useState<Set<string>>(new Set())
  const [actRunning, setActRunning] = useState<Set<string>>(new Set())
  const [actDone, setActDone] = useState<Set<string>>(new Set())
  const [actAllDone, setActAllDone] = useState(false)

  const sortByDue = (a: IntakeMember, b: IntakeMember) => a.daysUntilDue - b.daysUntilDue

  const grouped = {
    high:   INTAKE_MEMBERS.filter(m => m.riskLevel === 'high').sort(sortByDue),
    medium: INTAKE_MEMBERS.filter(m => m.riskLevel === 'medium').sort(sortByDue),
    low:    INTAKE_MEMBERS.filter(m => m.riskLevel === 'low').sort(sortByDue),
  }

  function toggleSage(id: string) {
    if (sageRunning.has(id) || sageDone.has(id)) return
    setSageSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function runSage() {
    const queue = Array.from(sageSelected).filter(id => !sageDone.has(id))
    if (!queue.length) return
    setSageSelected(new Set())
    setSageRunning(new Set(queue))
    setSageAllDone(false)
    queue.forEach((id, i) => {
      setTimeout(() => {
        setSageRunning(prev => { const next = new Set(prev); next.delete(id); return next })
        setSageDone(prev => { const next = new Set(prev); next.add(id); return next })
        if (i === queue.length - 1) setTimeout(() => setSageAllDone(true), 400)
      }, (i + 1) * 1200)
    })
  }

  function toggleAct(id: string) {
    if (actRunning.has(id) || actDone.has(id)) return
    setActSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function runAct() {
    const queue = [...grouped.high, ...grouped.medium, ...grouped.low].filter(m => actSelected.has(m.id) && !actDone.has(m.id)).map(m => m.id)
    if (!queue.length) return
    setActSelected(new Set())
    setActRunning(new Set(queue))
    setActAllDone(false)
    queue.forEach((id, i) => {
      setTimeout(() => {
        setActRunning(prev => { const next = new Set(prev); next.delete(id); return next })
        setActDone(prev => { const next = new Set(prev); next.add(id); return next })
        if (i === queue.length - 1) setTimeout(() => setActAllDone(true), 400)
      }, (i + 1) * 1200)
    })
  }

  const allMembers = [...grouped.high, ...grouped.medium, ...grouped.low]
  const actQueue = allMembers.filter(m => actSelected.has(m.id))
  const actRunningList = allMembers.filter(m => actRunning.has(m.id))
  const actDoneList = allMembers.filter(m => actDone.has(m.id) && !actAllDone)
  const actQueueVisible = actQueue.length > 0 || actRunning.size > 0 || actDoneList.length > 0

  const sageQueue = grouped.low.filter(m => sageSelected.has(m.id))
  const sageRunningList = grouped.low.filter(m => sageRunning.has(m.id))
  const sageDoneList = grouped.low.filter(m => sageDone.has(m.id) && !sageAllDone)
  const queueVisible = sageQueue.length > 0 || sageRunning.size > 0 || sageDoneList.length > 0

  return (
    <div className={styles.cards}>
      <Card icon="TaskAlt" iconColor="primary" title="Today's Tasks">
        <button
          className={styles.intakeTaskRow}
          type="button"
          onClick={() => setIntakeOpen(o => !o)}
          aria-expanded={intakeOpen}
        >
          <div className={styles.intakeTaskLeft}>
            <div className={styles.intakeTaskTitle}>Member Intake</div>
            <div className={styles.intakeTaskMeta}>
              Haven has reviewed {INTAKE_MEMBERS.length} members, ready for your review
            </div>
          </div>
          <div className={styles.intakeTaskRight}>
            <Icon name={intakeOpen ? 'ExpandLess' : 'ExpandMore'} size="sm" color="action" />
          </div>
        </button>

        {intakeOpen && (
          <div className={styles.intakePanel}>
            {/* Header bar */}
            <div className={styles.intakePanelHeader}>
              <div className={styles.intakePanelMeta}>
                <Icon name="AutoAwesome" size="sm" color="primary" />
                <span>Haven draft - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Groups */}
            {(['high', 'medium', 'low'] as const).map(level => {
              const uncheckedInGroup = level === 'low'
                ? grouped.low.filter(m => !sageSelected.has(m.id) && !sageDone.has(m.id))
                : grouped[level].filter(m => !actSelected.has(m.id) && !actDone.has(m.id))
              const addAllInGroup = () => {
                if (level === 'low') {
                  setSageSelected(prev => new Set([...prev, ...uncheckedInGroup.map(m => m.id)]))
                } else {
                  setActSelected(prev => new Set([...prev, ...uncheckedInGroup.map(m => m.id)]))
                }
              }
              return (
              <div key={level} className={styles.intakeGroup} style={{ background: RISK_BG[level] }}>
                <div className={styles.intakeGroupHeader} style={{ borderLeftColor: RISK_COLORS[level] }}>
                  <span className={styles.intakeGroupLabel} style={{ color: RISK_COLORS[level] }}>
                    {level === 'high' ? 'Outreach needed soon' : level === 'medium' ? 'Outreach this month' : 'Outreach when available'}
                  </span>
                  <span className={styles.intakeGroupCount}>{grouped[level].length} members</span>
                </div>

                {grouped[level].map(m => {
                  const isExpanded = expanded === m.id
                  const isSageChecked = sageSelected.has(m.id)
                  const isSageDone = sageDone.has(m.id)
                  const isActChecked = actSelected.has(m.id)
                  const isActDone = actDone.has(m.id)
                  const rowDone = isSageDone || isActDone
                  return (
                    <div key={m.id} className={`${styles.memberGroup} ${rowDone ? styles.intakeRowDone : ''}`}>
                      {/* Member header row — colored Person icon + name + condition + due badge + expand */}
                      <div className={styles.memberGroupHeader}>
                        <Icon name="Person" size="sm" sx={{ color: RISK_COLORS[m.riskLevel] }} />
                        <span className={styles.alertMember}>{m.name}</span>
                        <span className={styles.intakeConditionInline}>{m.condition}</span>
                        <span className={styles.intakeDueBadge} style={{ color: RISK_COLORS[m.riskLevel], background: RISK_BG[m.riskLevel] }}>
                          {m.daysUntilDue <= 1 ? 'Due today' : `${m.daysUntilDue}d left`}
                        </span>
                        <button
                          className={styles.intakeExpandBtn}
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : m.id)}
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          <Icon name={isExpanded ? 'ExpandLess' : 'ExpandMore'} size="sm" color="action" />
                        </button>
                      </div>

                      <div className={styles.alertItem}>

                        {level === 'low' && (
                          <button
                            className={`${styles.alertAction} ${styles.alertActionWrap} ${isSageChecked ? styles.alertActionChecked : ''}`}
                            type="button"
                            onClick={() => toggleSage(m.id)}
                            aria-pressed={isSageChecked}
                            disabled={isSageDone || sageRunning.has(m.id)}
                          >
                            <Icon
                              name={isSageDone ? 'CheckCircle' : isSageChecked ? 'CheckBox' : 'CheckBoxOutlineBlank'}
                              size="sm"
                              color={isSageDone || isSageChecked ? 'primary' : 'action'}
                            />
                            Outreach with Sage
                          </button>
                        )}

                        <button
                          className={`${styles.alertAction} ${styles.alertActionWrap} ${isActChecked ? styles.alertActionChecked : ''}`}
                          type="button"
                          onClick={() => toggleAct(m.id)}
                          aria-pressed={isActChecked}
                          disabled={isActDone || actRunning.has(m.id)}
                        >
                          <Icon
                            name={isActDone ? 'CheckCircle' : isActChecked ? 'CheckBox' : 'CheckBoxOutlineBlank'}
                            size="sm"
                            color={isActDone || isActChecked ? 'primary' : 'action'}
                          />
                          Add activity to call {m.name} to take assessment
                        </button>

                        {isExpanded && (
                          <div className={styles.intakeRowDetail}>
                            <p className={styles.intakeSnapshotText}>{m.snapshot}</p>
                            <div className={styles.intakeMemberMeta}>
                              <span>DOB {m.dob}</span>
                              <span>{m.plan}</span>
                              <button
                                className={styles.intakeProfileLink}
                                type="button"
                                onClick={() => window.parent.postMessage({ type: 'MEMBER_SWITCH', memberId: m.memberId, memberName: m.name }, '*')}
                              >
                                View profile
                                <Icon name="OpenInNew" size="xs" color="primary" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {uncheckedInGroup.length > 0 && (
                  <div className={`${styles.addAllRow} ${styles.addAllRowSection}`}>
                    <button className={styles.addAllBtn} type="button" onClick={addAllInGroup}>Add all</button>
                  </div>
                )}
              </div>
              )
            })}

            {/* Sage queue */}
            {queueVisible && (
              <div className={styles.queueSection}>
                <div className={styles.queueHeader}>
                  <Icon name="AutoAwesome" size="sm" color="primary" />
                  <span className={styles.queueTitle}>Task List ({sageQueue.length + sageRunning.size + sageDoneList.length})</span>
                  {sageQueue.length > 0 && sageRunning.size === 0 && (
                    <button className={styles.automateAllBtn} type="button" onClick={runSage}>
                      <Icon name="PlayArrow" size="sm" color="inverse" />
                      Run Tasks
                    </button>
                  )}
                </div>
                <div className={styles.queueItems}>
                  {[...sageQueue, ...sageRunningList, ...sageDoneList].map(m => {
                    const isRunning = sageRunning.has(m.id)
                    const isDone = sageDone.has(m.id)
                    return (
                      <div key={m.id} className={`${styles.queueItem} ${isDone ? styles.queueItemDone : ''}`}>
                        {isRunning ? (
                          <span className={styles.queueItemSpinner} aria-label="Running" />
                        ) : isDone ? (
                          <Icon name="CheckCircle" size="sm" color="primary" />
                        ) : (
                          <button className={styles.queueItemCheck} type="button" onClick={() => toggleSage(m.id)} aria-label={`Remove ${m.name} from queue`}>
                            <Icon name="CheckBox" size="sm" color="primary" />
                          </button>
                        )}
                        <div className={styles.queueItemText}>
                          <span className={styles.queueMember}>{m.name}</span>
                          <span className={`${styles.queueAction} ${isRunning ? styles.queueActionRunning : ''}`}>
                            Outreach with Sage
                          </span>
                          <span className={styles.sageStepsLabel}>Sage will perform these actions:</span>
                          <ul className={styles.sageSteps}>
                            <li>Sage will call member using phone number on file.</li>
                            <li>Sage will give assessment to member on your behalf.</li>
                            <li>Sage will pick up answers and insights based on what member says.</li>
                            <li>You will get a notification after Sage is done with member call and see information.</li>
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {sageAllDone && (
              <div className={styles.allDoneBanner}>
                <Icon name="CheckCircle" size="sm" color="primary" />
                <span>Complete!</span>
              </div>
            )}

            {/* Activity queue */}
            {actQueueVisible && (
              <div className={styles.queueSection}>
                <div className={styles.queueHeader}>
                  <Icon name="TaskAlt" size="sm" color="primary" />
                  <span className={styles.queueTitle}>Tasks ({actQueue.length + actRunning.size + actDoneList.length})</span>
                  {actQueue.length > 0 && actRunning.size === 0 && (
                    <button className={styles.automateAllBtn} type="button" onClick={runAct}>
                      <Icon name="PlayArrow" size="sm" color="inverse" />
                      Run Tasks
                    </button>
                  )}
                </div>
                <div className={styles.queueItems}>
                  {[...actQueue, ...actRunningList, ...actDoneList].map(m => {
                    const isRunning = actRunning.has(m.id)
                    const isDone = actDone.has(m.id)
                    return (
                      <div key={m.id} className={`${styles.queueItem} ${isDone ? styles.queueItemDone : ''}`}>
                        {isRunning ? (
                          <span className={styles.queueItemSpinner} aria-label="Running" />
                        ) : isDone ? (
                          <Icon name="CheckCircle" size="sm" color="primary" />
                        ) : (
                          <button className={styles.queueItemCheck} type="button" onClick={() => toggleAct(m.id)} aria-label={`Remove ${m.name} from queue`}>
                            <Icon name="CheckBox" size="sm" color="primary" />
                          </button>
                        )}
                        <div className={styles.queueItemText}>
                          <span className={styles.queueMember}>{m.name}</span>
                          <span className={`${styles.queueAction} ${isRunning ? styles.queueActionRunning : ''}`}>
                            Add activity to call {m.name} to take assessment
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {actAllDone && (
              <div className={styles.allDoneBanner}>
                <Icon name="CheckCircle" size="sm" color="primary" />
                <span>Complete!</span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export function HomeWelcome({ onPrompt, day = 0 }: HomeWelcomeProps) {
  return (
    <div className={styles.root}>
      <Typography variant="h4">Welcome back, Beatrice</Typography>
      {day === 0 && <Day0 onPrompt={onPrompt} />}
      {day === 1 && <Day1 onPrompt={onPrompt} />}
      {day === 2 && <Day2 onPrompt={onPrompt} />}
      {day === 3 && <Day3 onPrompt={onPrompt} />}
      {day === 4 && <Day4 onPrompt={onPrompt} />}
      {day === 'intake' && <MonthlyIntake />}
    </div>
  )
}
