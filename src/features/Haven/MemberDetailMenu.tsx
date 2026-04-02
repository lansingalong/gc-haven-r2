import styles from './MemberDetailMenu.module.css'

const PROMPTS = [
  "What is this member's current risk level?",
  "What is this member's last recorded health indicator?",
  "What services is this member eligible for?",
  "What is this member's current medication list?",
]

export interface MemberDetailMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
}

export function MemberDetailMenu({ onSelect, onClose }: MemberDetailMenuProps) {
  return (
    <div className={styles.menu} role="menu">
      {PROMPTS.map((label) => (
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
