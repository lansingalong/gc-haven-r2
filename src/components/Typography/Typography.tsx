import { ReactNode, ElementType } from 'react'
import styles from './Typography.module.css'

export type TypographyVariant =
  | 'h4' | 'h6'
  | 'body1' | 'body2'
  | 'subtitle2'
  | 'caption' | 'overline'

const variantTag: Record<TypographyVariant, ElementType> = {
  h4: 'h4', h6: 'h6',
  body1: 'p', body2: 'p',
  subtitle2: 'span',
  caption: 'span', overline: 'span',
}

export interface TypographyProps {
  variant?: TypographyVariant
  children: ReactNode
  className?: string
  as?: ElementType
}

export function Typography({ variant = 'body1', children, className, as }: TypographyProps) {
  const Tag = as ?? variantTag[variant]
  return (
    <Tag className={[styles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
