import * as MuiIcons from '@mui/icons-material'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { CSSProperties } from 'react'

/* ── Size scale (matches Quill spacing) ── */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

/* ── Color scale (maps to design system tokens) ── */
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'action'
  | 'disabled'
  | 'inverse'
  | 'inherit'

const colorMap: Record<IconColor, string> = {
  primary:   'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  error:     'var(--color-error)',
  warning:   'var(--color-warning)',
  info:      'var(--color-info)',
  success:   'var(--color-success)',
  action:    'var(--color-action-active)',
  disabled:  'var(--color-text-disabled)',
  inverse:   'var(--color-text-inverse)',
  inherit:   'currentColor',
}

/* ── Generic Icon ── */
export interface IconProps extends Omit<SvgIconProps, 'color'> {
  /** Any MUI icon name, e.g. "LocalHospital", "Close", "Send" */
  name: keyof typeof MuiIcons
  size?: IconSize
  color?: IconColor
}

export function Icon({ name, size = 'md', color, sx, ...rest }: IconProps) {
  const IconComponent = MuiIcons[name] as React.ComponentType<SvgIconProps>
  if (!IconComponent) {
    console.warn(`[Icon] Unknown icon: "${name}"`)
    return null
  }

  return (
    <IconComponent
      sx={{
        fontSize: sizeMap[size],
        ...(color ? { color: colorMap[color] } : {}),
        ...sx,
      }}
      {...rest}
    />
  )
}

/* ── AiAssistant — branded AI assistant icon ── */
export interface AiAssistantProps {
  filled?: boolean
  size?: IconSize
  color?: IconColor
  style?: CSSProperties
  className?: string
}

export function AiAssistant({
  filled = false,
  size = 'md',
  color = 'primary',
  style,
  className,
}: AiAssistantProps) {
  const px = sizeMap[size]
  const fill = colorMap[color]

  if (filled) {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
        aria-hidden="true"
      >
        <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill={fill} />
        <path d="M19 15L19.9 17.1L22 18L19.9 18.9L19 21L18.1 18.9L16 18L18.1 17.1L19 15Z" fill={fill} opacity="0.7" />
        <path d="M5 3L5.7 4.8L7.5 5.5L5.7 6.2L5 8L4.3 6.2L2.5 5.5L4.3 4.8L5 3Z" fill={fill} opacity="0.5" />
      </svg>
    )
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M19 15L19.9 17.1L22 18L19.9 18.9L19 21L18.1 18.9L16 18L18.1 17.1L19 15Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  )
}

/* ── HealthEdgeWordmark ── */
export type WordmarkStyle = 'default' | 'white' | 'blue'

export interface HealthEdgeWordmarkProps {
  style?: WordmarkStyle
  height?: number
  className?: string
  cssStyle?: CSSProperties
}

export function HealthEdgeWordmark({
  style: variant = 'default',
  height = 24,
  className,
  cssStyle,
}: HealthEdgeWordmarkProps) {
  const healthColor = variant === 'white' ? 'var(--color-text-inverse)' : 'var(--color-wordmark-health)'
  const edgeColor   = variant === 'white' ? 'var(--color-text-inverse)' : variant === 'blue' ? 'var(--color-primary)' : 'var(--color-wordmark-edge)'
  const width = Math.round(height * 5.4)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 162 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={cssStyle}
      aria-label="HealthEdge"
      role="img"
    >
      <text x="0" y="22" fontFamily="'Roboto', system-ui, sans-serif" fontWeight="700" fontSize="22" letterSpacing="-0.5" fill={healthColor}>HEALTH</text>
      <text x="88" y="22" fontFamily="'Roboto', system-ui, sans-serif" fontWeight="700" fontSize="22" letterSpacing="-0.5" fill={edgeColor}>EDGE</text>
      <path d="M81 4L86 15L81 26" stroke={edgeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
