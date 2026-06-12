import { ReactNode } from 'react'
import styles from './Alert.module.css'
import alertIcon from '@/assets/alert.svg'

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success'

export interface AlertProps {
  severity: AlertSeverity
  title?: string
  children?: ReactNode
  onClose?: () => void
  action?: ReactNode
  className?: string
}

export function Alert({ severity, title, children, onClose, action, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={[styles.root, styles[severity], className].filter(Boolean).join(' ')}
    >
      <img src={alertIcon} width={18} height={15} className={styles.icon} aria-hidden="true" alt="" />
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        {children && <span className={styles.body}>{children}</span>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Dismiss"
        >
          <span className="material-icons" aria-hidden="true" style={{ fontSize: 16 }}>close</span>
        </button>
      )}
    </div>
  )
}
