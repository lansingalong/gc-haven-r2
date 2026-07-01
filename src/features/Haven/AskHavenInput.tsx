import { KeyboardEvent, useRef, useState } from 'react'
import aiSparkle from '@/assets/ai_sparkle.png'
import { Icon } from '@/components/Icons'
import { T, type Language } from './translations'
import styles from './AskHavenInput.module.css'

export interface AskHavenInputProps {
  onSubmit?: (value: string) => void
  language?: Language
}

export function AskHavenInput({ onSubmit, language = 'english' }: AskHavenInputProps) {
  const t = T[language]
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.left}>
          <img src={aiSparkle} width={24} height={24} alt="" aria-hidden="true" />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.askHavenPlaceholder}
            aria-label={t.askHavenPlaceholder}
          />
        </div>
        <button
          className={styles.sendBtn}
          onClick={handleSubmit}
          type="button"
          aria-label="Send"
          disabled={!value.trim()}
        >
          <Icon name="Send" size="md" color="inherit" />
        </button>
      </div>
    </div>
  )
}
