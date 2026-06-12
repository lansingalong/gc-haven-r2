import { ReactNode } from 'react'
import styles from './Chip.module.css'

export interface ChipProps {
  label: string
  avatar?: ReactNode
  onClick?: () => void
  className?: string
}

export function Chip({ label, avatar, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      className={[styles.root, onClick ? styles.clickable : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {avatar && <span className={styles.avatar}>{avatar}</span>}
      <span className={styles.label}>{label}</span>
    </button>
  )
}
