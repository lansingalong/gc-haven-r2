import styles from './MemberDetailMenu.module.css'

const PROMPTS = [
  'Help me make a SMART goal for the member',
  'Help me document an outreach attempt',
  'Help me document an opportunity, goal or intervention for the member',
]

export interface DocumentMenuProps {
  onSelect: (prompt: string) => void
  onClose: () => void
}

export function DocumentMenu({ onSelect, onClose }: DocumentMenuProps) {
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
