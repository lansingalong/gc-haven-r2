import styles from './MemberDetailMenu.module.css'

const PROMPTS = [
  'Prepare me for a member call',
  "Review member's current care plan",
  'Show me the last update I did for the member',
]

export interface SummarizeMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
}

export function SummarizeMenu({ onSelect, onClose }: SummarizeMenuProps) {
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
