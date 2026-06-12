import styles from './MemberDetailMenu.module.css'

const BASE_PROMPTS = [
  "What's missing for URAC compliance?",
  "Does this member have a consent on file?",
  "When was the last outreach attempt?",
  "Is this case overdue for a follow-up?",
  "Are there any open quality gaps for this member?",
]

const MEMBER_PROMPTS: Record<string, string[]> = {
  'jackson-thomas': ["What are the member's HEDIS gaps for diabetes?"],
  'maria-rivera':   ['Check authorization for home services'],
}

export interface ComplianceMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
  memberId?: string
}

export function ComplianceMenu({ onSelect, onClose, memberId = '' }: ComplianceMenuProps) {
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
