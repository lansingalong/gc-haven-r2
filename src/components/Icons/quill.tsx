import type { CSSProperties } from 'react'

export interface AiSparkleProps {
  size?: number
  color?: string
  style?: CSSProperties
  className?: string
}

export function AiSparkle({
  size = 24,
  color = 'var(--color-primary)',
  style,
  className,
}: AiSparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z" fill={color} />
      <path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" fill={color} opacity="0.6" />
      <path d="M5 15L5.6 16.8L7.5 17.5L5.6 18.2L5 20L4.4 18.2L2.5 17.5L4.4 16.8L5 15Z" fill={color} opacity="0.4" />
    </svg>
  )
}
