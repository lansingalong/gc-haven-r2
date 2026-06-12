import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon, AiAssistant } from '@/components/Icons'
import { MemberHeader } from './MemberHeader'
import { ChatWelcome } from './ChatWelcome'
import { MemberDetailMenu } from './MemberDetailMenu'
import { SummarizeMenu } from './SummarizeMenu'
import { ComplianceMenu } from './ComplianceMenu'
import { DocumentMenu } from './DocumentMenu'
import { ChatMessages, type Message, type FollowUpChip } from './ChatMessages'
import { AskHavenInput } from './AskHavenInput'
import styles from './HavenWindow.module.css'
import panelStyles from './HavenPanel.module.css'
import { getMockReply, getFollowUp, getFollowUpQuery, getGuardrailMessage, getRecommendedActionsFromNote, getLastUpdateData, getOpenCareGaps } from './mockReplies'
import { type SmartGoalData } from './SmartGoalCard'
import { HomeWelcome } from './HomeWelcome'
import { MemberChatWindow } from './MemberChatWindow'
import { SukiWindow, type Alert as SukiAlert } from './SukiWindow'
import { ChatHistoryDrawer } from './ChatHistoryDrawer'
import { PresetPromptsPanel } from './PresetPromptsPanel'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { CallInsightsCard } from './CallInsightsCard'
import { AddActivityModal, type ActivityConfig } from './AddActivityModal'
import { Alert } from '@/components'
import { useChatHistory } from './useChatHistory'
import chatIcon from '@/assets/chat.png'
import chevronForwardIcon from '@/assets/chevron_forward.png'

const JACKSON_SMART_GOAL: SmartGoalData = {
  goals: [
    {
      name: 'Blood Sugar Monitoring',
      description: 'Daily glucose logging to support A1C reduction',
      iconName: 'MonitorHeart',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Check blood sugar and log readings twice daily, before breakfast and before dinner' },
        { label: 'How will you and the member know progress is being made?', value: 'Twice daily readings logged in Wellframe and A1C target below 8.0% at next lab visit.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member agreed and has no major barriers.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Supports A1C reduction from 9.2%, consistent monitoring is the primary identified opportunity.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Wellframe app logging, phone calls, text.' },
      ],
    },
    {
      name: 'Medication Adherence',
      description: 'Consistent use of prescribed diabetes medications',
      iconName: 'Medication',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Take metformin as prescribed twice daily with meals and refill before running out' },
        { label: 'How will you and the member know progress is being made?', value: 'Member self-reports adherence weekly via Wellframe and pharmacy refill history shows no gaps.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has pharmacy coverage and is motivated to manage diabetes.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Medication adherence is essential to achieving A1C target and preventing complications.' },
        { label: 'What is the timeframe for this goal?', value: '60 days' },
        { label: 'How will progress be tracked?', value: 'Pharmacy refill data, Wellframe check-ins, care manager follow-up calls.' },
      ],
    },
    {
      name: 'Foot Care & Exam',
      description: 'Preventive foot care to reduce complication risk',
      iconName: 'HealthAndSafety',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Complete annual podiatry exam and perform daily foot inspection at home' },
        { label: 'How will you and the member know progress is being made?', value: 'Podiatry appointment scheduled and completed; member demonstrates daily inspection routine.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has transportation access and podiatry is covered under their plan.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Addresses open HEDIS gap for diabetic foot exam and reduces risk of amputation.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Appointment confirmation, HEDIS gap closure, member self-report.' },
      ],
    },
  ],
}

const MARIA_SMART_GOAL: SmartGoalData = {
  goals: [
    {
      name: 'Personal Care Aide Visits',
      description: 'Maintain aide support for ADLs and independent living',
      iconName: 'SupportAgent',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Participate in at least 3 approved personal care aide visits per week to assist with bathing, dressing, and meal preparation' },
        { label: 'How will you and the member know progress is being made?', value: 'Care aide visit logs completed weekly and member reports ability to complete 2+ ADLs independently by next assessment.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has authorized aide services and caregiver support at home.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Supports LTSS care plan objective to maintain independent living and prevent nursing facility placement.' },
        { label: 'What is the timeframe for this goal?', value: '60 days' },
        { label: 'How will progress be tracked?', value: 'Aide visit logs, monthly care manager check-ins, ADL reassessment.' },
      ],
    },
    {
      name: 'Home Safety & Fall Prevention',
      description: 'Reduce fall risk and improve safety in the home',
      iconName: 'HomeWork',
      fields: [
        { label: 'What behavior or action should the member take?', value: 'Complete a home safety assessment and implement at least 2 recommended modifications (e.g. grab bars, removal of tripping hazards)' },
        { label: 'How will you and the member know progress is being made?', value: 'Home safety checklist completed and modifications confirmed at next care manager visit.' },
        { label: "Is this realistic given the member's current barriers and abilities?", value: 'Yes, member has family support and modifications are covered under LTSS waiver.' },
        { label: "How does this goal connect to the member's condition or care plan?", value: 'Addresses fall risk identified in ADL assessment and supports continued community living.' },
        { label: 'What is the timeframe for this goal?', value: '30 days' },
        { label: 'How will progress be tracked?', value: 'Care manager home visit, member and caregiver self-report.' },
      ],
    },
  ],
}

function postToIframe(data: object) {
  const iframes = document.querySelectorAll('iframe')
  iframes.forEach(f => f.contentWindow?.postMessage(data, '*'))
}

export interface HavenWindowProps {
  memberName?: string
  phone?: string
  memberId?: string
  pcp?: string
  /** Provide to wire a real AI backend; omit to use built-in demo replies */
  onSend?: (value: string) => Promise<string>
  onLearnMore?: () => void
  defaultRight?: number
  defaultBottom?: number
  defaultWidth?: number
  defaultHeight?: number
  /** Member ID used to select the correct mock data set */
  mockMemberId?: string
  /** Whether clinical data is available for this member in Haven */
  hasData?: boolean
  /** Confirmation message shown when the window is first opened after a member switch */
  switchConfirmation?: string
  /** True when the care manager is on the home dashboard (no active member) */
  isHome?: boolean
  age?: string
  gender?: string
  dob?: string
  /** Which demo day is active — auto-opens Haven on home view */
  day?: 0 | 1 | 2 | 3 | 4 | 'intake'
}

type WindowState = 'open' | 'minimized' | 'closed'
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_W = 360
const MIN_H = 300

export function HavenWindow({
  memberName = 'Henry Tom Garcia',
  phone = '909-851-3064',
  memberId = 'AH58319473',
  pcp = 'Ambetter',
  onSend,
  defaultRight = 24,
  defaultBottom = 118,
  defaultWidth = 500,
  defaultHeight = 657,
  mockMemberId = 'AH58319473',
  hasData = true,
  switchConfirmation,
  isHome = false,
  age = '26',
  gender = 'Male',
  dob = '03/01/1989',
  day = 1 as 1 | 2 | 3 | 'intake',
}: HavenWindowProps) {
  const [winState, setWinState] = useState<WindowState>(isHome ? 'open' : 'closed')
  const [menuOpen, setMenuOpen] = useState(false)
  const [summarizeMenuOpen, setSummarizeMenuOpen] = useState(false)
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(false)
  const [documentMenuOpen, setDocumentMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [memberChatOpen, setMemberChatOpen] = useState(false)
  const [sukiOpen, setSukiOpen] = useState(false)
  const [fabExpanded, setFabExpanded] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [sukiActionsReady, setSukiActionsReady] = useState(false)
  const [callInsightsOpen, setCallInsightsOpen] = useState(false)
  const [liveAlerts, setLiveAlerts] = useState<SukiAlert[]>([])
  const [alertTaskLabels, setAlertTaskLabels] = useState<Record<string, string[]>>({})
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)
  const [alertTaskView, setAlertTaskView] = useState<string | null>(null) // alert id in task-list view
  const [addedAlertTasks, setAddedAlertTasks] = useState<Set<string>>(new Set())
  const [skipWelcome, setSkipWelcome] = useState(false)
  const [doneAlertTasks, setDoneAlertTasks] = useState<Set<string>>(new Set())
  const [openAlertModal, setOpenAlertModal] = useState<{ alertId: string; taskIdx: number; task: string } | null>(null)

  const { getSessionsForMember, saveSession, upsertSession, deleteSession, toggleFavorite, clearAllForMember } = useChatHistory()
  const [historyVersion, setHistoryVersion] = useState(0)
  const refreshHistory = () => setHistoryVersion(v => v + 1)
  const historySessions = useMemo(() => getSessionsForMember(memberId), [getSessionsForMember, memberId, historyVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stable ID for the current in-progress conversation — reset on new chat / member switch
  const currentSessionId = useRef(`session-${Date.now()}`)

  // Auto-save after every assistant reply
  useEffect(() => {
    const hasAssistantReply = messages.some(m => m.role === 'assistant')
    if (!hasAssistantReply) return
    upsertSession(currentSessionId.current, memberId, memberName, messages)
    refreshHistory()
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  // Refs so the unmount cleanup can read the latest values without stale closures
  const messagesRef = useRef<Message[]>([])
  const memberIdRef = useRef(memberId)
  const memberNameRef = useRef(memberName)
  const saveSessionRef = useRef(saveSession)
  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => { memberIdRef.current = memberId }, [memberId])
  useEffect(() => { memberNameRef.current = memberName }, [memberName])
  useEffect(() => { saveSessionRef.current = saveSession }, [saveSession])

  // Save session when member switches (component unmounts due to key change in App)
  useEffect(() => {
    return () => {
      saveSessionRef.current(memberIdRef.current, memberNameRef.current, messagesRef.current)
    }
  }, [])

  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight })
  const [posReady, setPosReady] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  // Set to true on unmount so any in-progress async response is discarded (member switched)
  const cancelledRef = useRef(false)
  // Prevents showing the open-time message more than once per member instance
  const openMsgShownRef = useRef(false)
  // Saved window state - restored when FAB is re-expanded
  const savedFabStateRef = useRef<{ winState: WindowState; memberChatOpen: boolean; sukiOpen: boolean } | null>(null)

  useEffect(() => {
    setPos({
      left: window.innerWidth - defaultRight - defaultWidth,
      top: window.innerHeight - defaultBottom - defaultHeight,
    })
    setPosReady(true)
    cancelledRef.current = false
    // On unmount (member switch), cancel any in-flight response
    return () => { cancelledRef.current = true }
  }, [defaultBottom, defaultRight, defaultWidth, defaultHeight])

  /* ── Show confirmation or no-data message on first open ── */
  useEffect(() => {
    if (winState !== 'open' || openMsgShownRef.current) return
    openMsgShownRef.current = true

    if (!hasData) {
      // Restricted member: surface a clear no-data message, enforce restricted context
      setMessages([{
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `No clinical data is currently available for ${memberName} in Haven.\n\nPlease verify the member's record in GuidingCare before proceeding. Haven cannot answer clinical questions for this member until their data is available in the system.`,
        isError: true,
      }])
    } else if (switchConfirmation) {
      // Acknowledge the member switch
      setMessages([{
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: switchConfirmation,
      }])
    }
  }, [winState, hasData, memberName, switchConfirmation])

  /* ── Learn more ── */
  const handleLearnMore = useCallback(() => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: 'What does Haven have access to?' }
    const replyMsg: Message = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      content: `**I have access to:**\n• Member demographics\n• Clinical history\n• Care plan (goals, interventions)\n• Assessments\n• Eligibility\n• Care gaps\n• Claims data\n\n**I cannot help with:**\n• Clinical decisions or diagnosis\n• Systems outside this platform\n• Guaranteed accurate information, always verify yourself`,
    }
    setMessages(prev => [...prev, userMsg, replyMsg])
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setLearnMoreOpen(true)
  }, [])

  /* ── Send a message ── */
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    cancelledRef.current = false
    setSkipWelcome(false)

    // No-data members: block queries and surface a clear message
    if (!hasData) {
      setMessages(prev => [...prev,
        { id: `u-${Date.now()}`, role: 'user', content: trimmed },
        {
          id: `a-${Date.now() + 1}`,
          role: 'assistant',
          content: `Haven does not have clinical data available for ${memberName}. Questions about this member cannot be answered until their record is available in the system.`,
          isError: true,
        },
      ])
      return
    }

    // If user says "yes", resolve against the last assistant message's follow-up query
    const isYes = /^yes[.!]?\s*$/i.test(trimmed)
    const lastFollowUpQuery = isYes
      ? [...messages].reverse().find(m => m.role === 'assistant' && m.followUpQuery)?.followUpQuery
      : undefined
    const resolvedText = lastFollowUpQuery ?? trimmed

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed }

    // Real backend: show typing indicator while awaiting the network call
    if (onSend) {
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      try {
        const reply = await onSend(resolvedText)
        if (cancelledRef.current) return
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          followUp: getFollowUp(resolvedText),
          followUpQuery: getFollowUpQuery(resolvedText),
        }])
      } finally {
        if (!cancelledRef.current) setLoading(false)
      }
      return
    }

    // Last update - early return with card
    if (/show me the last update/i.test(resolvedText)) {
      const lastUpdate = getLastUpdateData(memberName, mockMemberId)
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant' as const, content: '', lastUpdate }])
      return
    }

    // URAC checklist - early return with interactive card
    if (resolvedText.toLowerCase().includes('urac')) {
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here are the remaining tasks to complete for URAC compliance. Items already completed based on ${memberName.split(' ')[0]}'s record are checked off.`,
        uracChecklist: true,
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // Care plan summary - early return with interactive card (Jackson / Henry only)
    const isCarePlanReview = /review.*care plan|care plan.*review|review.*member.*care|review.*current.*care/i.test(resolvedText)
    if (isCarePlanReview && mockMemberId === 'AH58319473') {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here's a summary of ${firstName}'s current plan of care. You can update status, priority, and target dates inline.`,
        carePlanSummary: true,
        followUpChips: [
          { label: 'Help me make a SMART Goal for the member', query: 'Help me make a SMART goal for the member' },
          { label: 'Print plan', query: 'Print plan', inlineRow: true },
          { label: 'Schedule follow-up', query: 'Schedule follow-up', inlineRow: true },
          { label: 'Complete all for me', query: 'Complete all for me', isComplete: true },
        ],
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // SMART goal - early return with interactive card
    const smartGoalData = resolvedText.toLowerCase().includes('smart goal')
      ? mockMemberId === 'AH58319473' ? JACKSON_SMART_GOAL
      : mockMemberId === 'AH72940158' ? MARIA_SMART_GOAL
      : null
      : null
    if (smartGoalData) {
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, userMsg, {
        id: `a-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: `Here's a SMART goal based on ${firstName}'s current care plan. Review and edit each field, then add to the care plan.`,
        smartGoal: smartGoalData,
      }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      return
    }

    // Care gaps - append follow-up chips to add each open gap to the care plan
    const isCareGapsQuery = /missing care gap|care gap|gaps in care|open gap/i.test(resolvedText)
    if (isCareGapsQuery) {
      const replyContent = getMockReply(resolvedText, memberName, mockMemberId)
      const openGaps = getOpenCareGaps(mockMemberId).slice(0, 3)
      const chips: FollowUpChip[] = openGaps.map(gap => ({
        label: `Add "${gap.opportunity}" to care plan`,
        query: `__ADD_CARE_GAP__${JSON.stringify({ opportunity: gap.opportunity, goal: gap.goal, category: gap.category })}`,
      }))
      setMessages(prev => [...prev, userMsg])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: replyContent,
        followUpChips: chips,
      }])
      return
    }

    // Add gap to care plan - post to CWF and confirm
    if (resolvedText.startsWith('__ADD_CARE_GAP__')) {
      const gap = JSON.parse(resolvedText.slice('__ADD_CARE_GAP__'.length)) as { opportunity: string; goal: string; category: string }
      const firstName = memberName.split(' ')[0]
      setMessages(prev => [...prev, { ...userMsg, content: `Add "${gap.opportunity}" to care plan` }])
      setMenuOpen(false)
      setSummarizeMenuOpen(false)
      setComplianceMenuOpen(false)
      setDocumentMenuOpen(false)
      setLearnMoreOpen(false)
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      setLoading(false)
      if (cancelledRef.current) return
      postToIframe({ type: 'HAVEN_ADD_CARE_GAP', opportunity: gap.opportunity, goal: gap.goal, category: gap.category })
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant' as const,
        content: `"${gap.opportunity}" has been added to ${firstName}'s care plan.`,
      }])
      return
    }

    // Mock path: show typing indicator briefly before resolving
    const guardrail = getGuardrailMessage(resolvedText)
    const replyContent = guardrail ?? getMockReply(resolvedText, memberName, mockMemberId)
    setMessages(prev => [...prev, userMsg])
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setLearnMoreOpen(false)
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    setLoading(false)
    if (cancelledRef.current) return
    setMessages(prev => [...prev, {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: replyContent,
      followUp: guardrail ? undefined : getFollowUp(resolvedText),
      followUpQuery: guardrail ? undefined : getFollowUpQuery(resolvedText),
    }])
  }, [loading, hasData, memberName, memberId, mockMemberId, onSend, messages])

  /* ── Drag ── */
  const dragState = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null)

  const onChromeMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    dragState.current = { startX: e.clientX, startY: e.clientY, startLeft: pos.left, startTop: pos.top }
  }, [pos])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setPos({
        left: Math.max(0, Math.min(window.innerWidth - size.w, dragState.current.startLeft + dx)),
        top: Math.max(0, Math.min(window.innerHeight - 28, dragState.current.startTop + dy)),
      })
    }
    const onMouseUp = () => { dragState.current = null }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [size.w])

  /* ── Resize ── */
  const resizeState = useRef<{ dir: ResizeDir; startX: number; startY: number; startLeft: number; startTop: number; startW: number; startH: number } | null>(null)

  const onResizeMouseDown = useCallback((dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    resizeState.current = { dir, startX: e.clientX, startY: e.clientY, startLeft: pos.left, startTop: pos.top, startW: size.w, startH: size.h }
  }, [pos, size])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const r = resizeState.current
      if (!r) return
      const dx = e.clientX - r.startX
      const dy = e.clientY - r.startY
      let { startLeft: newLeft, startTop: newTop, startW: newW, startH: newH } = r
      if (r.dir.includes('e')) newW = Math.max(MIN_W, r.startW + dx)
      if (r.dir.includes('w')) { newW = Math.max(MIN_W, r.startW - dx); newLeft = r.startLeft + (r.startW - newW) }
      if (r.dir.includes('s')) newH = Math.max(MIN_H, r.startH + dy)
      if (r.dir.includes('n')) { newH = Math.max(MIN_H, r.startH - dy); newTop = r.startTop + (r.startH - newH) }
      setSize({ w: newW, h: newH }); setPos({ left: newLeft, top: newTop })
    }
    const onMouseUp = () => { resizeState.current = null }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [])

  /* ── Window controls ── */
  const handleClose    = () => {
    saveSession(memberId, memberName, messages)
    setWinState('closed')
    setMenuOpen(false)
    setSummarizeMenuOpen(false)
    setComplianceMenuOpen(false)
    setDocumentMenuOpen(false)
    setMessages([])
  }
  const handleMinimize = () => setWinState(s => s === 'minimized' ? 'open' : 'minimized')
  const handleMaximize = () => { if (winState === 'minimized') setWinState('open') }

  const openWindow = useCallback(() => {
    setPos({ left: window.innerWidth - defaultRight - defaultWidth, top: window.innerHeight - defaultBottom - defaultHeight })
    setPosReady(true)
    setWinState('open')
  }, [defaultRight, defaultWidth, defaultBottom, defaultHeight])

  const openMemberChat = useCallback(() => {
    setMemberChatOpen(true)
  }, [])

  const handleActivityAdded = useCallback((config: ActivityConfig, _destination: 'activities' | 'care-plan') => {
    postToIframe({ type: 'HAVEN_ADD_ACTIVITY', activityType: config.activityType, contactType: config.contactType })
  }, [])

  // Bottom edge of the Haven window (px from viewport top) - used to align MemberChatWindow
  const havenBottomY = posReady
    ? pos.top + size.h
    : window.innerHeight - defaultBottom

  const memberChat = !isHome && memberChatOpen ? (
    <MemberChatWindow
      memberName={memberName}
      memberKey={memberId}
      onClose={() => setMemberChatOpen(false)}
      havenBottomY={havenBottomY}
      zIndex={sukiOpen ? 800 : undefined}
    />
  ) : null

  /* ── FAB minimize / expand ── */
  const minimizeFab = useCallback(() => {
    savedFabStateRef.current = { winState, memberChatOpen, sukiOpen }
    setWinState('closed')
    setMemberChatOpen(false)
    setSukiOpen(false)
    setFabExpanded(false)
  }, [winState, memberChatOpen, sukiOpen])

  const expandFab = useCallback(() => {
    if (savedFabStateRef.current) {
      const { winState: sw, memberChatOpen: sm, sukiOpen: ss } = savedFabStateRef.current
      setWinState(sw)
      setMemberChatOpen(sm)
      setSukiOpen(ss)
    }
    setFabExpanded(true)
  }, [])

  // ── FAB - always rendered ──
  const fabStyle: React.CSSProperties = sukiOpen ? { zIndex: 800 } : {}

  const fab = isHome ? (
    <div className={styles.fabCard}>
      <button className={winState === 'closed' ? styles.fabHavenFilled : styles.fabHaven} onClick={openWindow} type="button" aria-label="Open Haven AI assistant">
        <Icon name="AutoAwesome" size="md" color={winState === 'closed' ? 'inverse' : 'primary'} />
        Haven
      </button>
    </div>
  ) : !fabExpanded ? (
    <button
      className={styles.fabMinimized}
      style={fabStyle}
      onClick={expandFab}
      type="button"
      aria-label="Expand"
    >
      <img src={chevronForwardIcon} width={29} height={29} alt="" aria-hidden="true" className={styles.fabChevronMin} style={{ transform: 'rotate(180deg)' }} />
    </button>
  ) : (
    <div className={styles.fabCard} style={fabStyle}>
      <button
        className={styles.fabChevronBtn}
        onClick={minimizeFab}
        type="button"
        aria-label="Minimize"
      >
        <img src={chevronForwardIcon} width={29} height={29} alt="" aria-hidden="true" className={styles.fabChevron} />
      </button>
      <div className={styles.fabDivider} />
      <button className={styles.fabMember} onClick={openMemberChat} type="button" aria-label={`Message ${memberName}`}>
        <img src={chatIcon} width={33} height={33} alt="" aria-hidden="true" />
        <span className={styles.fabMemberName}>{memberName}</span>
      </button>
      <div className={styles.fabDivider} />
      <button className={winState === 'closed' ? styles.fabHavenFilled : styles.fabHaven} onClick={openWindow} type="button" aria-label="Open Haven AI assistant">
        <Icon name="AutoAwesome" size="md" color={winState === 'closed' ? 'inverse' : 'primary'} />
        Haven
      </button>
    </div>
  )

  const sukiNode = sukiOpen && !isHome ? (
    <SukiWindow
      onClose={() => { setSukiOpen(false); setAlertTaskLabels({}); setExpandedAlertId(null) }}
      onNoteSent={() => {
        setSukiOpen(false)
        setCallInsightsOpen(true)
        openMsgShownRef.current = true
        setWinState('open')
      }}
      onAlert={(alert) => {
        setLiveAlerts(prev => prev.some(a => a.id === alert.id) ? prev : [...prev, alert])
      }}
      memberName={memberName}
      memberId={memberId}
      phone={phone}
      pcp={pcp}
      age={age}
      gender={gender}
      dob={dob}
      havenLeft={posReady ? pos.left : window.innerWidth - defaultRight - defaultWidth}
      havenTop={posReady ? pos.top : window.innerHeight - defaultBottom - defaultHeight}
    />
  ) : null

  if (winState === 'closed') {
    return (
      <>
        {memberChat}
        {fab}
        {sukiNode}
      </>
    )
  }

  const isMinimized = winState === 'minimized'
  const windowStyle: React.CSSProperties = {
    ...(posReady
      ? { left: pos.left, top: pos.top, width: size.w, height: isMinimized ? 28 : size.h }
      : { right: defaultRight, bottom: defaultBottom, width: size.w, height: isMinimized ? 28 : size.h }),
    ...(sukiOpen ? { zIndex: 800, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, transition: 'border-radius 0.18s ease' } : { transition: 'border-radius 0.18s ease' }),
  }

  const hasMessages = messages.length > 0 || loading

  return (
    <>
    {memberChat}
    {fab}
    {sukiNode}
    <div ref={windowRef} className={styles.window} style={windowStyle} role="dialog" aria-label="Haven AI assistant" aria-modal="false">
      {/* Resize handles */}
      {!isMinimized && (
        <>
          <div className={styles.resizeN}  onMouseDown={onResizeMouseDown('n')}  />
          <div className={styles.resizeS}  onMouseDown={onResizeMouseDown('s')}  />
          <div className={styles.resizeE}  onMouseDown={onResizeMouseDown('e')}  />
          <div className={styles.resizeW}  onMouseDown={onResizeMouseDown('w')}  />
          <div className={styles.resizeNE} onMouseDown={onResizeMouseDown('ne')} />
          <div className={styles.resizeNW} onMouseDown={onResizeMouseDown('nw')} />
          <div className={styles.resizeSE} onMouseDown={onResizeMouseDown('se')} />
          <div className={styles.resizeSW} onMouseDown={onResizeMouseDown('sw')} />
        </>
      )}

      {/* Chrome bar */}
      <div className={styles.chrome} onMouseDown={onChromeMouseDown}>
        <div className={styles.trafficLights}>
          <button className={`${styles.trafficBtn} ${styles.btnClose}`}  onClick={handleClose}    type="button" aria-label="Close"    title="Close"    />
          <button className={`${styles.trafficBtn} ${styles.btnMin}`}    onClick={handleMinimize} type="button" aria-label={isMinimized ? 'Restore' : 'Minimize'} title={isMinimized ? 'Restore' : 'Minimize'} />
          <button className={`${styles.trafficBtn} ${styles.btnMax}`}    onClick={handleMaximize} type="button" aria-label="Maximize"  title="Maximize"  />
        </div>
        <span className={styles.chromeTitle}>Haven</span>
      </div>

      {/* Window body */}
      {!isMinimized && (
        <div className={styles.body}>
          {!isHome && <MemberHeader memberName={memberName} phone={phone} memberId={memberId} pcp={pcp} onSukiClick={() => setSukiOpen(true)} onPresetsClick={() => setPresetsOpen(true)} onHistoryClick={() => setHistoryOpen(true)} />}

          <div className={panelStyles.chatArea}>
            {/* Back button - learn more only */}
            {learnMoreOpen && (
              <button
                type="button"
                className={panelStyles.backBtn}
                onClick={() => { setMessages([]); setLearnMoreOpen(false) }}
                aria-label="Back"
              >
                <Icon name="ArrowBack" size="sm" color="action" />
                Back
              </button>
            )}

            {/* Scroll area */}
            <div className={panelStyles.chatScroll}>
              {/* Live call alerts from Suki - only shown after the call ends */}
              {liveAlerts.length > 0 && !isHome && !sukiOpen && !callInsightsOpen && (() => {
                // All tasks added across every alert (keyed by alertId:idx)
                const allAddedEntries = liveAlerts.flatMap(a => {
                  const labels = alertTaskLabels[a.id] ?? a.tasks
                  return labels
                    .map((label, idx) => ({ alertId: a.id, task: label, taskKey: `${a.id}:${idx}` }))
                    .filter(({ taskKey }) => addedAlertTasks.has(taskKey))
                })
                const hasAdded = allAddedEntries.length > 0

                if (alertTaskView === 'unified') {
                  return (
                    <div className={panelStyles.insightsWrap}>
                      <div className={panelStyles.liveAlertStack}>
                        <div className={panelStyles.liveAlertTaskListCard}>
                          <div className={panelStyles.liveAlertTaskListHeader}>
                            <button type="button" className={panelStyles.liveAlertBackBtn} onClick={() => setAlertTaskView(null)}>
                              <Icon name="ArrowBack" size="xs" color="action" />
                            </button>
                            <Icon name="TaskAlt" size="sm" color="primary" />
                            <span className={panelStyles.liveAlertTaskListTitle}>Task List</span>
                          </div>
                          <div className={panelStyles.liveAlertTasks}>
                            {allAddedEntries.map(({ alertId, task, taskKey }) => {
                              const isDone = doneAlertTasks.has(taskKey)
                              return (
                                <div key={taskKey} className={`${panelStyles.liveAlertTask} ${isDone ? panelStyles.liveAlertTaskDone : ''}`}>
                                  <span className={panelStyles.liveAlertTaskIcon}>
                                    <Icon name={isDone ? 'CheckCircle' : 'RadioButtonUnchecked'} size="md" color={isDone ? 'success' : 'action'} />
                                  </span>
                                  <button
                                    type="button"
                                    className={`${panelStyles.liveAlertTaskLink}${isDone ? ` ${panelStyles.liveAlertTaskLinkDone}` : ''}`}
                                    onClick={() => setOpenAlertModal({ alertId, taskIdx: parseInt(taskKey.split(':')[1]), task })}
                                  >
                                    {task}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className={panelStyles.insightsWrap}>
                    <div className={panelStyles.liveAlertStack}>
                    {liveAlerts.map(alert => {
                      const labels = alertTaskLabels[alert.id] ?? alert.tasks
                      return (
                        <Alert
                          key={alert.id}
                          severity="warning"
                          title={alert.label}
                          onClose={() => {
                            setLiveAlerts(prev => prev.filter(a => a.id !== alert.id))
                            if (expandedAlertId === alert.id) setExpandedAlertId(null)
                          }}
                          action={
                            expandedAlertId === alert.id ? (
                              <div className={panelStyles.liveAlertExpanded}>
                                <p className={panelStyles.liveAlertDetail}>{alert.detail}</p>
                                <div className={panelStyles.liveAlertTasks}>
                                  {labels.map((label, idx) => {
                                    const taskKey = `${alert.id}:${idx}`
                                    const added = addedAlertTasks.has(taskKey)
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={`${panelStyles.liveAlertTask}${added ? ` ${panelStyles.liveAlertTaskAdded}` : ''}`}
                                        onClick={() => setAddedAlertTasks(prev => {
                                          const next = new Set(prev)
                                          added ? next.delete(taskKey) : next.add(taskKey)
                                          return next
                                        })}
                                      >
                                        <input
                                          className={panelStyles.liveAlertTaskInput}
                                          type="text"
                                          value={label}
                                          placeholder="Describe the task…"
                                          aria-label={`Task ${idx + 1}`}
                                          onClick={e => e.stopPropagation()}
                                          onChange={e => {
                                            e.stopPropagation()
                                            setAlertTaskLabels(prev => {
                                              const updated = [...(prev[alert.id] ?? alert.tasks)]
                                              updated[idx] = e.target.value
                                              return { ...prev, [alert.id]: updated }
                                            })
                                          }}
                                        />
                                        <span
                                          className={`${panelStyles.liveAlertTaskAddBtn}${added ? ` ${panelStyles.liveAlertTaskAddBtnAdded}` : ''}`}
                                          aria-hidden="true"
                                        >
                                          {added ? '✓' : '+'}
                                        </span>
                                      </button>
                                    )
                                  })}
                                  <button
                                    type="button"
                                    className={panelStyles.liveAlertAddTaskBtn}
                                    onClick={() => setAlertTaskLabels(prev => ({
                                      ...prev,
                                      [alert.id]: [...(prev[alert.id] ?? alert.tasks), ''],
                                    }))}
                                  >
                                    <Icon name="AddCircleOutline" size="sm" color="primary" />
                                    Add your own task
                                  </button>
                                </div>
                                <button type="button" className={panelStyles.liveAlertCollapseBtn} onClick={() => setExpandedAlertId(null)}>Hide actions</button>
                              </div>
                            ) : (
                              <button type="button" className={panelStyles.liveAlertReviewBtn} onClick={() => setExpandedAlertId(alert.id)}>
                                Review actions
                              </button>
                            )
                          }
                        />
                      )
                    })}
                    {hasAdded && (
                      <button type="button" className={panelStyles.liveAlertFinishBtn} onClick={() => setAlertTaskView('unified')}>
                        <Icon name="TaskAlt" size="sm" color="inherit" />
                        View Task List ({allAddedEntries.length})
                      </button>
                    )}
                    </div>
                  </div>
                )
              })()}
              {openAlertModal && (() => {
                const taskKey = `${openAlertModal.alertId}:${openAlertModal.taskIdx}`
                const activityConfig: ActivityConfig = {
                  title: 'Add Activity',
                  activityType: 'Follow-up',
                  contactType: 'Member - Phone',
                  scheduledDate: '',
                }
                return (
                  <AddActivityModal
                    config={activityConfig}
                    memberName={memberName}
                    onClose={() => setOpenAlertModal(null)}
                    onAdd={() => {
                      setDoneAlertTasks(prev => new Set(prev).add(taskKey))
                      handleActivityAdded(activityConfig, 'activities')
                      setOpenAlertModal(null)
                    }}
                  />
                )
              })()}
              {callInsightsOpen && !isHome && (
                <div className={panelStyles.insightsWrap}>
                  <CallInsightsCard
                    memberFirstName={memberName.split(' ')[0]}
                    memberName={memberName}
                    alerts={liveAlerts}
                    onDismiss={() => { setCallInsightsOpen(false); setLiveAlerts([]) }}
                  />
                </div>
              )}
              {sukiActionsReady && !isHome && (
                <RecommendedActionsCard
                  memberName={memberName}
                  onDismiss={() => setSukiActionsReady(false)}
                  onActivityAdded={handleActivityAdded}
                  onNavigate={(dest) => {
                    postToIframe({ type: dest === 'activities' ? 'HAVEN_NAVIGATE_OUTSTANDING' : 'HAVEN_NAVIGATE_CARE_PLAN' })
                  }}
                />
              )}
              {hasMessages ? (
                <ChatMessages
                  messages={messages}
                  loading={loading}
                  onGoalAdded={(payload) => {
                    postToIframe({ type: 'HAVEN_ADD_SMART_GOAL', ...payload })
                  }}
                  onFollowUpChip={(query) => sendMessage(query)}
                  onNavigateNote={() => postToIframe({ type: 'HAVEN_NAVIGATE_NOTES' })}
                  onNavigateActivity={() => postToIframe({ type: 'HAVEN_NAVIGATE_OUTSTANDING' })}
                />
              ) : (
                !skipWelcome && !sukiActionsReady && liveAlerts.length === 0 && !callInsightsOpen && (
                  <div className={panelStyles.welcomeWrap}>
                    {isHome
                      ? <HomeWelcome onPrompt={sendMessage} onPresetsClick={() => setPresetsOpen(true)} day={day} />
                      : <ChatWelcome onMemberDetails={() => setMenuOpen(true)} onSummarizeMenu={() => setSummarizeMenuOpen(true)} />
                    }
                  </div>
                )
              )}
            </div>

            {/* Member detail menu - floats above input bar (member view only) */}
            {!isHome && menuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setMenuOpen(false)} aria-label="Back">
                  <Icon name="ArrowBack" size="sm" color="action" />
                  Back
                </button>
                <div className={panelStyles.menuCard}>
                  <MemberDetailMenu onClose={() => setMenuOpen(false)} onSelect={sendMessage} memberId={memberId} />
                </div>
              </div>
            )}

            {/* Summarize menu - floats above input bar (member view only) */}
            {!isHome && summarizeMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setSummarizeMenuOpen(false)} aria-label="Back">
                  <Icon name="ArrowBack" size="sm" color="action" />
                  Back
                </button>
                <div className={panelStyles.menuCard}>
                  <SummarizeMenu onClose={() => setSummarizeMenuOpen(false)} onSelect={sendMessage} />
                </div>
              </div>
            )}

            {/* Compliance menu - floats above input bar (member view only) */}
            {!isHome && complianceMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setComplianceMenuOpen(false)} aria-label="Back">
                  <Icon name="ArrowBack" size="sm" color="action" />
                  Back
                </button>
                <div className={panelStyles.menuCard}>
                  <ComplianceMenu onClose={() => setComplianceMenuOpen(false)} onSelect={sendMessage} memberId={memberId} />
                </div>
              </div>
            )}

            {/* Document menu - floats above input bar (member view only) */}
            {!isHome && documentMenuOpen && !hasMessages && (
              <div className={panelStyles.menuOverlay}>
                <button type="button" className={panelStyles.menuBackBtn} onClick={() => setDocumentMenuOpen(false)} aria-label="Back">
                  <Icon name="ArrowBack" size="sm" color="action" />
                  Back
                </button>
                <div className={panelStyles.menuCard}>
                  <DocumentMenu onClose={() => setDocumentMenuOpen(false)} onSelect={sendMessage} />
                </div>
              </div>
            )}

            {/* Input + disclaimer */}
            <div className={panelStyles.bottom}>
              <AskHavenInput onSubmit={sendMessage} />
              <p className={panelStyles.disclaimer}>
                Once closed, a chat can't be continued.{' '}
                Check your responses for accuracy.{' '}
                <button type="button" className={panelStyles.disclaimerLink} onClick={handleLearnMore}>
                  What this assistant has access to
                </button>
              </p>
            </div>
          </div>

          {/* Preset prompts panel */}
          {presetsOpen && (
            <PresetPromptsPanel
              onClose={() => setPresetsOpen(false)}
              onSelectPrompt={(text) => { sendMessage(text); setPresetsOpen(false) }}
              memberName={memberName}
              memberId={memberId}
            />
          )}

          {/* Chat history drawer - covers entire body including member header */}
          {historyOpen && !isHome && (
            <ChatHistoryDrawer
              sessions={historySessions}
              onClose={() => setHistoryOpen(false)}
              onSelectSession={(msgs, id) => { currentSessionId.current = id; setMessages(msgs); setLearnMoreOpen(false); setSkipWelcome(false) }}
              onNewConversation={() => {
                currentSessionId.current = `session-${Date.now()}`
                setMessages([])
                setLearnMoreOpen(false)
                setSkipWelcome(true)
              }}
              onDelete={(id) => { deleteSession(id); refreshHistory() }}
              onToggleFavorite={(id) => { toggleFavorite(id); refreshHistory() }}
              onClearHistory={() => { clearAllForMember(memberId); refreshHistory() }}
              onLearnMore={handleLearnMore}
            />
          )}
        </div>
      )}
    </div>
    </>
  )
}
