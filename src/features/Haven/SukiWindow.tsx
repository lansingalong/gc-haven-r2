import { useEffect, useRef, useState } from 'react'
import styles from './SukiWindow.module.css'

const SUKI_W = 440
const SUKI_H = 660

interface Note { name: string; date: string; status: 'done' | 'pending' }

const CURRENT_NOTES: Note[] = [
  { name: 'Note Name', date: '06/10/2026', status: 'done' },
  { name: 'Note Name', date: '06/09/2026', status: 'pending' },
]

const PRIOR_NOTES: Note[] = [
  { name: 'Diabetes Management Check-In', date: '04/30/2026', status: 'done' },
  { name: 'Hypertension & Medication Review', date: '04/28/2026', status: 'done' },
]

const NOTE_TEXT =
  "26 year old female with history of diabetes mellitus and essential hypertension presenting with right knee pain. The likely diagnosis is osteoarthritis with acute inflammation, characterized by medial knee pain and swelling. The patient's diabetes displays suboptimal control with fasting glucose levels around 180 mg/dL. Hypertension is present, with recent blood pressure 142/88 mmHg, requiring further management."

const SUMMARY_TEXT =
  "The care manager conducted a check-in call with the member regarding ongoing management of Type 2 diabetes mellitus and essential hypertension. The member reported intermittent medication adherence and difficulty with dietary modifications. Fasting glucose has been elevated, averaging approximately 180 mg/dL. Blood pressure was self-reported at 142/88 mmHg.\n\nThe member expressed interest in speaking with a nutritionist and raised concerns about knee pain limiting physical activity. Care gaps reviewed include overdue HbA1c lab work and a pending cardiology follow-up. The member agreed to schedule an appointment with their PCP within the next two weeks and confirmed willingness to participate in a structured care plan review."

// Mock transcript lines - 'CM' and 'Member' are replaced at render time with real names
const TRANSCRIPT_LINES = [
  { speaker: 'CM', text: 'Hi, this is Beatrice calling from GuidingCare. Am I speaking with Jackson?' },
  { speaker: 'Member', text: 'Yes, this is Jackson.' },
  { speaker: 'CM', text: "Great! I'm calling to check in on how you've been doing with your medications." },
  { speaker: 'Member', text: "I've been taking the Metformin most days, but I sometimes forget the evening dose." },
  { speaker: 'CM', text: 'Got it. And how have your blood sugar levels been lately?' },
  { speaker: 'Member', text: "They've been a bit high - usually around 180 in the morning." },
  { speaker: 'CM', text: "Okay, I'll note that. Have you had any issues with transportation to your upcoming PCP visit?" },
  { speaker: 'Member', text: "Yeah, I don't have a car so I was hoping my brother could drive me." },
  { speaker: 'CM', text: "Understood. We can also look into a ride service if needed. I'll flag that in your care plan." },
]

export interface Alert {
  id: string
  label: string
  detail: string
  tasks: string[]
}

// Alerts keyed by the transcript line index that triggers them
const TRANSCRIPT_ALERTS: Record<number, Alert> = {
  3: {
    id: 'med-adherence',
    label: 'Medication adherence issue detected',
    detail: 'Member reports missing evening Metformin doses - not documented in care plan.',
    tasks: [
      'Add medication adherence barrier to care plan',
      'Schedule pharmacist medication review',
      'Set up evening dose reminder in care plan',
    ],
  },
  7: {
    id: 'transportation',
    label: 'New issue identified: Transportation barrier',
    detail: 'Member reports no personal vehicle - not documented as a care barrier.',
    tasks: [
      'Add transportation barrier to care plan',
      'Research non-emergency medical transport options',
      'Document SDOH transportation flag in member record',
    ],
  },
}

// Bar heights (px) for the waveform - alternating yellow accent bars
const BAR_HEIGHTS = [18,32,48,26,54,22,40,60,28,44,70,30,52,24,64,38,56,20,46,66,34,58,22,50,72,28,42,62,36,54]
const YELLOW_BARS  = new Set([2,6,10,14,18,22,26])

interface SukiWindowProps {
  onClose: () => void
  onNoteSent?: (summaryText: string) => void
  onAlert?: (alert: Alert) => void
  memberName: string
  memberId: string
  phone: string
  pcp: string
  age?: string
  gender?: string
  dob?: string
  havenLeft: number
  havenTop: number
}

type View = 'notes' | 'detail' | 'summary'

export function SukiWindow({ onClose, onNoteSent, onAlert, memberName, memberId, phone, pcp, age, gender, dob, havenLeft, havenTop }: SukiWindowProps) {
  const [view, setView]                   = useState<View>('notes')
  const [ambientActive, setAmbientActive] = useState(false)
  const [ambientPaused, setAmbientPaused] = useState(false)
  const [elapsed, setElapsed]             = useState(0)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [reminderSent, setReminderSent]     = useState(false)

  // Transcript state: list of fully-revealed lines + the current line being typed
  const [transcriptLines, setTranscriptLines] = useState<{ speaker: string; text: string }[]>([])
  const [currentLine, setCurrentLine] = useState<{ speaker: string; text: string } | null>(null)
  const transcriptBottomRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  const firedAlertsRef = useRef<Set<string>>(new Set())

  const stopAmbient = () => {
    setAmbientActive(false)
    setAmbientPaused(false)
    pausedRef.current = false
  }

  useEffect(() => {
    if (!ambientActive || ambientPaused) { return }
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [ambientActive, ambientPaused])

  // Stream transcript lines word-by-word while ambient is active
  useEffect(() => {
    if (!ambientActive) {
      setTranscriptLines([])
      setCurrentLine(null)
      setElapsed(0)
      firedAlertsRef.current = new Set()
      return
    }

    let cancelled = false
    let lineIdx = 0
    let wordIdx = 0

    const tick = () => {
      if (cancelled) return
      if (pausedRef.current) { setTimeout(tick, 100); return }

      const line = TRANSCRIPT_LINES[lineIdx]
      if (!line) return

      const words = line.text.split(' ')
      wordIdx++
      setCurrentLine({ speaker: line.speaker, text: words.slice(0, wordIdx).join(' ') })

      if (wordIdx >= words.length) {
        const completed = { speaker: line.speaker, text: line.text }
        setTranscriptLines(prev => [...prev, completed])
        setCurrentLine(null)
        // Fire alert if this line index has one
        const alert = TRANSCRIPT_ALERTS[lineIdx]
        if (alert && !firedAlertsRef.current.has(alert.id)) {
          firedAlertsRef.current.add(alert.id)
          setTimeout(() => onAlert?.(alert), 400)
        }
        lineIdx++
        wordIdx = 0
        if (lineIdx < TRANSCRIPT_LINES.length) {
          setTimeout(tick, 900)
        }
      } else {
        setTimeout(tick, 120)
      }
    }

    setTimeout(tick, 800)
    return () => { cancelled = true }
  }, [ambientActive])

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcriptLines, currentLine])

  const fmtTimer = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `00.${mm}.${ss}`
  }

  const handleAmbientDone = () => {
    setAmbientActive(false)
    setSummaryLoading(true)
    setView('summary')
    setTimeout(() => setSummaryLoading(false), 2200)
  }

  const handleSummaryDone = () => {
    onNoteSent?.(SUMMARY_TEXT)
    onClose()
  }

  // Use first two name parts for display
  const displayName = memberName.split(' ').slice(0, 2).join(' ')
  const firstName = memberName.split(' ')[0] || 'Member'

  const left = Math.max(16, havenLeft - SUKI_W)
  const top  = havenTop

  return (
    <div
      data-suki
      className={styles.window}
      style={{ left, top, width: SUKI_W, height: SUKI_H }}
      role="dialog"
      aria-label="Suki"
      aria-modal="false"
    >
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <span className={styles.poweredBy}>
          Powered by <strong className={styles.sukiBrand}>Suki</strong>
        </span>
        <div className={styles.topActions}>
          <button className={styles.iconBtn} type="button" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06-.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
          <button className={styles.iconBtn} type="button" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── NOTES LIST VIEW ── */}
      {view === 'notes' && (
        <div className={styles.notesView}>
          {/* Member hero */}
          <div className={styles.hero}>
            <h1 className={styles.heroName}>{displayName}</h1>
            <p className={styles.heroMeta}>{age} . {gender}. DOB:{dob}</p>
            <button
              className={`${styles.startAmbientBtn}${ambientActive ? ` ${styles.startAmbientBtnActive}` : ''}`}
              type="button"
              onClick={() => setAmbientActive(true)}
            >
              Start Ambient
            </button>
          </div>

          {/* Notes */}
          <div className={styles.notesList}>
            <p className={styles.sectionLabel}>CURRENT NOTES</p>
            {CURRENT_NOTES.map((note, i) => (
              <button key={i} className={styles.noteRow} type="button" onClick={() => setView('detail')}>
                <span className={styles.noteName}>{note.name}</span>
                <span className={styles.noteDate}>{note.date}</span>
                {note.status === 'done'
                  ? <span className={styles.statusCheck} aria-label="Complete">✓</span>
                  : <span className={styles.statusDot} aria-label="Pending" />
                }
              </button>
            ))}

            <p className={styles.sectionLabel} style={{ marginTop: 20 }}>PRIOR NOTES</p>
            {PRIOR_NOTES.map((note, i) => (
              <button key={i} className={styles.noteRow} type="button" onClick={() => setView('detail')}>
                <span className={styles.noteName}>{note.name}</span>
                <span className={styles.noteDate}>{note.date}</span>
                {note.status === 'done'
                  ? <span className={styles.statusCheck} aria-label="Complete">✓</span>
                  : <span className={styles.statusDot} aria-label="Pending" />
                }
              </button>
            ))}
          </div>

          {/* ── Ambient overlay (Frame 6490) ── */}
          {ambientActive && (
            <div className={styles.ambientOverlay}>
              <button
                className={styles.ambientCloseBtn}
                type="button"
                aria-label="Close ambient"
                onClick={stopAmbient}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              {/* Haven status pill */}
              <div className={styles.havenPill} aria-live="polite">
                <span className={styles.havenPillDot} aria-hidden="true" />
                Haven is transcribing and gathering insights…
              </div>

              {/* Live transcript */}
              <div className={styles.transcriptScroll}>
                {transcriptLines.map((line, i) => (
                  <p key={i} className={styles.transcriptLine}>
                    <span className={styles.transcriptSpeaker}>
                      {line.speaker === 'CM' ? 'Beatrice' : firstName}:
                    </span>{' '}
                    {line.text}
                  </p>
                ))}
                {currentLine && (
                  <p className={styles.transcriptLine}>
                    <span className={styles.transcriptSpeaker}>
                      {currentLine.speaker === 'CM' ? 'Beatrice' : firstName}:
                    </span>{' '}
                    {currentLine.text}
                    <span className={styles.transcriptCursor} />
                  </p>
                )}
                <div ref={transcriptBottomRef} />
              </div>

              {/* Waveform */}
              <div className={styles.waveformWrap} aria-hidden="true">
                <div className={styles.waveformBars}>
                  {BAR_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className={`${styles.waveBar} ${YELLOW_BARS.has(i) ? styles.waveBarYellow : styles.waveBarWhite}`}
                      style={{
                        height: h,
                        animationDelay: `${(i * 0.07).toFixed(2)}s`,
                        animationPlayState: ambientPaused ? 'paused' : 'running',
                      }}
                    />
                  ))}
                </div>
                <div className={styles.waveformLine} />
              </div>

              {/* Listening row */}
              <div className={styles.ambientInfo}>
                <span className={styles.listeningLabel}>Listening...</span>
                <span className={styles.timerLabel}>{fmtTimer(elapsed)}</span>
              </div>

              {/* Controls */}
              <div className={styles.ambientControls}>
                <button
                  className={styles.pauseBtn}
                  type="button"
                  onClick={() => {
                    const next = !ambientPaused
                    setAmbientPaused(next)
                    pausedRef.current = next
                  }}
                >
                  {ambientPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  className={styles.ambientDoneBtn}
                  type="button"
                  aria-label="Done"
                  onClick={handleAmbientDone}
                >
                  <svg width="18" height="14" viewBox="0 0 22 17" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 8l7 7L21 1"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NOTE DETAIL VIEW ── */}
      {view === 'detail' && (
        <div className={styles.detailView}>
          <div className={styles.detailNav}>
            <button className={styles.backBtn} type="button" aria-label="Back" onClick={() => setView('notes')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <button className={styles.moreBtn} type="button" aria-label="More options">
              <svg width="4" height="18" viewBox="0 0 4 18" fill="currentColor">
                <circle cx="2" cy="2" r="2"/>
                <circle cx="2" cy="9" r="2"/>
                <circle cx="2" cy="16" r="2"/>
              </svg>
            </button>
          </div>

          <div className={styles.detailDivider} />

          <div className={styles.detailScroll}>
            <div className={styles.notePageHeader}>
              <h2 className={styles.detailNoteLabel}>NOTE</h2>
              <span className={styles.readOnlyBadge} aria-label="Read only">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Read Only
              </span>
            </div>

            <p className={styles.detailNoteName}>{memberName}</p>
            <p className={styles.detailNoteSubMeta}>{age} • {gender} • {memberId}</p>

            <div className={styles.detailMetaRow}>
              <div>
                <p className={styles.detailMetaKey}>DATE OF BIRTH</p>
                <p className={styles.detailMetaVal}>{dob}</p>
              </div>
              <div>
                <p className={styles.detailMetaKey}>DATE OF SERVICE</p>
                <p className={styles.detailMetaVal}>06/09/2026</p>
              </div>
            </div>

            <div className={styles.detailSection}>
              <p className={styles.detailSectionTitle}>Assesment</p>
              <p className={styles.detailSectionBody}>{NOTE_TEXT}</p>
            </div>
          </div>

          <div className={styles.detailFooter}>
            <button className={styles.addSectionBtn} type="button" aria-label="Add section">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
            </button>
            <button className={styles.doneBtn} type="button" onClick={() => setView('notes')}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── SUMMARY VIEW ── */}
      {view === 'summary' && (
        <div className={styles.summaryView}>
          <div className={styles.detailNav}>
            <button className={styles.backBtn} type="button" aria-label="Back" onClick={() => setView('notes')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
          </div>

          <div className={styles.detailDivider} />

          <div className={styles.summaryScroll}>
            <div className={styles.notePageHeader}>
              <h2 className={styles.detailNoteLabel}>NOTE</h2>
              <span className={styles.readOnlyBadge} aria-label="Read only">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Read Only
              </span>
            </div>

            <p className={styles.detailNoteName}>{memberName}</p>
            <p className={styles.detailNoteSubMeta}>{age} • {gender} • {memberId}</p>

            <div className={styles.detailMetaRow}>
              <div>
                <p className={styles.detailMetaKey}>DATE OF BIRTH</p>
                <p className={styles.detailMetaVal}>{dob}</p>
              </div>
              <div>
                <p className={styles.detailMetaKey}>DATE OF SERVICE</p>
                <p className={styles.detailMetaVal}>06/09/2026</p>
              </div>
            </div>

            <div className={styles.detailSection}>
              <p className={styles.detailSectionTitle}>AI Summary</p>
              {summaryLoading ? (
                <div className={styles.summaryGenerating} aria-label="Generating summary">
                  <div className={styles.generatingDots}>
                    <span /><span /><span />
                  </div>
                  <p className={styles.generatingLabel}>Haven is processing the call…</p>
                </div>
              ) : (
                <p className={styles.detailSectionBody}>{SUMMARY_TEXT}</p>
              )}
            </div>
          </div>

          <div className={styles.detailFooter}>
            <button className={styles.doneBtn} type="button" onClick={handleSummaryDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
