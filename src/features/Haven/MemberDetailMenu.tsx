import styles from './MemberDetailMenu.module.css'

const BASE_PROMPTS = [
  "What is this member's current risk level?",
  "What is this member's last recorded health indicator?",
  "What services is this member eligible for?",
  "What is this member's current medication list?",
  "What are the missing care gaps for the member?",
]

const MEMBER_PROMPTS: Record<string, string[]> = {
  'maria-rivera':   ["What is the member's ADL or IADL status?"],
}

export interface MemberDetailMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
  memberId?: string
}

export function MemberDetailMenu({ onSelect, onClose, memberId = '' }: MemberDetailMenuProps) {
  const prompts = [...BASE_PROMPTS, ...(MEMBER_PROMPTS[memberId] ?? [])]
  return (
    <div className={styles.menu} role="menu">
      {prompts.map((label) => (
        <button
          key={label}
          className={styles.item}
          role="menuitem"
          type="button"
          onClick={() => { onSelect(label); onClose() }}
        >
          <span className={styles.itemLabel}>{label}</span>
        </button>
      ))}
    </div>
  )
}
