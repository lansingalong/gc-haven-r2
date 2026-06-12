import { useRef, useState } from 'react'
import { Icon } from '@/components/Icons'
import styles from './UracChecklistCard.module.css'

interface UracItem {
  id: number
  text: string
  checked: boolean
}

interface UracSection {
  title: string
  icon: string
  items: UracItem[]
}

let _id = 1000
const uid = () => ++_id

const INITIAL_SECTIONS: Omit<UracSection, 'items'>[] & { rawItems: string[]; preChecked: number[] }[] = [
  {
    title: 'Member identification & intake', icon: '01',
    rawItems: [
      'Verify member eligibility and active enrollment status',
      'Confirm member has been assessed for care management eligibility',
      'Document the referral source and referral date',
      'Record member consent for care management participation',
      'Assign appropriate acuity level / stratification tier',
    ],
    preChecked: [0, 1, 3],
  },
  {
    title: 'Assessment & care planning', icon: '02',
    rawItems: [
      "Complete or review initial comprehensive health assessment",
      "Identify member's primary diagnoses, comorbidities, and SDOH factors",
      'Document member goals using person-centered language',
      'Ensure care plan is individualized and evidence-based',
      'Set measurable outcomes with target timeframes',
      'Obtain member agreement on care plan goals',
    ],
    preChecked: [0, 1, 3],
  },
  {
    title: 'Care coordination & outreach', icon: '03',
    rawItems: [
      'Document all outreach attempts (date, time, method, outcome)',
      'Coordinate with treating providers as needed for this member',
      'Facilitate transitions of care following inpatient or ER discharge',
      'Address barriers to care access (transport, cost, language)',
      'Verify follow-up appointments are scheduled post-discharge',
    ],
    preChecked: [0, 1],
  },
  {
    title: 'Documentation & timeliness', icon: '04',
    rawItems: [
      'Document all member contacts within required timeframe (typically 24-48 hrs)',
      'Ensure all notes include date, time, duration, and method of contact',
      'Update care plan within required interval after significant changes',
      'Record interventions, referrals made, and member response',
      'Close or escalate open action items appropriately',
    ],
    preChecked: [0, 1],
  },
  {
    title: 'Utilization & clinical criteria', icon: '05',
    rawItems: [
      'Apply evidence-based clinical criteria for utilization decisions (e.g., MCG, InterQual)',
      'Document clinical rationale for all approval or denial decisions',
      'Ensure authorization decisions are made within required turnaround times',
      'Route complex cases to physician reviewer when criteria not met',
      'Notify members and providers of adverse determinations per policy',
    ],
    preChecked: [],
  },
  {
    title: 'Appeals & grievances', icon: '06',
    rawItems: [
      'Inform member of right to appeal any adverse determination',
      'Log grievances and appeals in the tracking system on day received',
      'Adhere to acknowledgment and resolution timeframes per URAC standards',
      'Escalate quality-of-care concerns to clinical leadership as needed',
    ],
    preChecked: [0, 1, 2, 3],
  },
  {
    title: 'Quality & compliance', icon: '07',
    rawItems: [
      'Confirm staff credentials and licensure are current in the system',
      'Participate in required QI activities and case review meetings',
      'Follow HIPAA protocols for all member communications and record handling',
      'Flag potential quality-of-care issues for review',
      'Complete required continuing education per URAC staff training standards',
    ],
    preChecked: [0, 1, 2, 3, 4],
  },
]

function buildSections(): UracSection[] {
  return INITIAL_SECTIONS.map(s => ({
    title: s.title,
    icon: s.icon,
    items: s.rawItems.map((text, i) => ({
      id: uid(),
      text,
      checked: s.preChecked.includes(i),
    })),
  }))
}

export function UracChecklistCard() {
  const [sections, setSections] = useState<UracSection[]>(buildSections)
  const [open, setOpen] = useState<boolean[]>(INITIAL_SECTIONS.map(() => false))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [addingIn, setAddingIn] = useState<number | null>(null)
  const [addText, setAddText] = useState('')
  const addInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const totalAll = sections.reduce((s, sec) => s + sec.items.length, 0)
  const totalDone = sections.reduce((s, sec) => s + sec.items.filter(i => i.checked).length, 0)
  const pct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0

  const toggleCheck = (si: number, id: number) => {
    setSections(prev => prev.map((sec, r) =>
      r !== si ? sec : { ...sec, items: sec.items.map(it => it.id === id ? { ...it, checked: !it.checked } : it) }
    ))
    setOpen(prev => prev.map((v, r) => r === si ? true : v))
  }

  const deleteItem = (si: number, id: number) => {
    setSections(prev => prev.map((sec, r) =>
      r !== si ? sec : { ...sec, items: sec.items.filter(it => it.id !== id) }
    ))
  }

  const startEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const commitEdit = (si: number, id: number) => {
    if (editText.trim()) {
      setSections(prev => prev.map((sec, r) =>
        r !== si ? sec : { ...sec, items: sec.items.map(it => it.id === id ? { ...it, text: editText.trim() } : it) }
      ))
    }
    setEditingId(null)
  }

  const startAdd = (si: number) => {
    setAddingIn(si)
    setAddText('')
    setOpen(prev => prev.map((v, r) => r === si ? true : v))
    setTimeout(() => addInputRef.current?.focus(), 0)
  }

  const commitAdd = (si: number) => {
    if (addText.trim()) {
      setSections(prev => prev.map((sec, r) =>
        r !== si ? sec : { ...sec, items: [...sec.items, { id: uid(), text: addText.trim(), checked: false }] }
      ))
    }
    setAddingIn(null)
    setAddText('')
  }

  return (
    <div className={styles.card}>
      <div
        className={styles.topBar}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall URAC completion: ${totalDone} of ${totalAll} items`}
      >
        <div className={styles.progressWrap}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressLabel} aria-hidden="true">{totalDone} / {totalAll} complete</span>
      </div>

      {sections.map((section, si) => {
        const done = section.items.filter(i => i.checked).length
        const total = section.items.length
        const isOpen = open[si]
        const badgeVariant = total === 0 ? 'none' : done === total ? 'done' : done > 0 ? 'partial' : 'none'
        const statusLabel = total === 0 ? '0 of 0' : done === total ? 'complete' : `${done} of ${total} complete`
        const panelId = `urac-panel-${si}`

        return (
          <div key={si} className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => setOpen(prev => prev.map((v, r) => r === si ? !v : v))}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={`${section.title}, ${statusLabel}`}
            >
              <div className={styles.sectionTitle} aria-hidden="true">
                <span className={styles.sectionIcon} aria-hidden="true">{section.icon}</span>
                {section.title}
                <span className={`${styles.badge} ${styles[`badge_${badgeVariant}`]}`}>
                  {total === 0 ? '0/0' : done === total ? 'Complete' : `${done}/${total}`}
                </span>
              </div>
              <Icon name={isOpen ? 'ExpandMore' : 'ChevronRight'} size="xs" color="action" aria-hidden />
            </button>

            {isOpen && (
              <div
                id={panelId}
                className={styles.items}
                role="list"
                aria-label={`${section.title} checklist items`}
              >
                {section.items.map(item => (
                  <div key={item.id} className={styles.item} role="listitem">
                    <input
                      type="checkbox"
                      id={`urac-cb-${item.id}`}
                      className={styles.checkbox}
                      checked={item.checked}
                      onChange={() => toggleCheck(si, item.id)}
                      aria-label={item.text}
                    />
                    {editingId === item.id ? (
                      <input
                        ref={editInputRef}
                        className={styles.editInput}
                        value={editText}
                        aria-label="Edit checklist item"
                        onChange={e => setEditText(e.target.value)}
                        onBlur={() => commitEdit(si, item.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitEdit(si, item.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                    ) : (
                      <span
                        role="button"
                        tabIndex={0}
                        className={`${styles.itemLabel} ${item.checked ? styles.itemLabelChecked : ''}`}
                        aria-label={`Edit: ${item.text}`}
                        onClick={() => startEdit(item.id, item.text)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            startEdit(item.id, item.text)
                          }
                        }}
                      >
                        {item.text}
                      </span>
                    )}
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => deleteItem(si, item.id)}
                      aria-label={`Delete: ${item.text}`}
                    >
                      <Icon name="Close" size="xs" color="action" aria-hidden />
                    </button>
                  </div>
                ))}

                {addingIn === si ? (
                  <div className={styles.addRow} role="listitem">
                    <input
                      ref={addInputRef}
                      className={styles.editInput}
                      placeholder="New item…"
                      aria-label={`Add new item to ${section.title}`}
                      value={addText}
                      onChange={e => setAddText(e.target.value)}
                      onBlur={() => commitAdd(si)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitAdd(si)
                        if (e.key === 'Escape') { setAddingIn(null); setAddText('') }
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => startAdd(si)}
                    aria-label={`Add item to ${section.title}`}
                  >
                    <Icon name="Add" size="xs" color="primary" aria-hidden />
                    Add item
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
