import { ReactNode } from 'react'
import styles from './Avatar.module.css'

export interface AvatarProps {
  size?: number
  background?: string
  children?: ReactNode
  className?: string
}

export function Avatar({ size = 24, background = 'var(--color-avatar-bg)', children, className }: AvatarProps) {
  return (
    <span
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, background }}
    >
      {children}
    </span>
  )
}
