import { useState, useEffect } from 'react'
import './tokens/variables.css'
import { HavenWindow } from './features/Haven/HavenWindow'

/**
 * Maps CWF member keys to Haven mock data IDs.
 * Members not listed here have no available clinical data in Haven.
 */
const MOCK_ID_MAP: Record<string, string> = {
  'jackson-thomas': 'AH0000007', // Henry Garcia mock profile (Diabetes)
  'maria-rivera':   'AH0000023', // Lisa Thompson mock profile (CHF)
}

interface ActiveMember {
  key: string
  name: string
  phone: string
  pcp: string
}

const DEFAULT_MEMBER: ActiveMember = {
  key: 'jackson-thomas',
  name: 'Jackson Thomas',
  phone: '(907) 555-0142',
  pcp: 'Dr. Sarah Chen',
}

export default function App() {
  const [view, setView] = useState<'home' | 'member'>('home')
  const [member, setMember] = useState<ActiveMember>(DEFAULT_MEMBER)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'VIEW_HOME') {
        setView('home')
      } else if (e.data?.type === 'MEMBER_SWITCH') {
        const { memberId, memberName, phone, pcp } = e.data
        setMember({ key: memberId, name: memberName, phone: phone ?? '', pcp: pcp ?? '' })
        setView('member')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const havenKey = view === 'home' ? 'home' : member.key

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src={`${import.meta.env.BASE_URL}cwf.html`}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="GuidingCare CWF"
      />
      <HavenWindow
        key={havenKey}
        isHome={view === 'home'}
        memberName={member.name}
        phone={member.phone}
        memberId={member.key}
        pcp={member.pcp}
        mockMemberId={MOCK_ID_MAP[member.key]}
        hasData={member.key in MOCK_ID_MAP}
        switchConfirmation={undefined}
      />
    </div>
  )
}
