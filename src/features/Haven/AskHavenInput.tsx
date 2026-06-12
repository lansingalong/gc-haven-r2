import { KeyboardEvent, useRef, useState } from 'react'
import aiSparkle from '@/assets/ai_sparkle.png'
import sendIcon from '@/assets/send_icon.png'
import styles from './AskHavenInput.module.css'

export interface AskHavenInputProps {
  onSubmit?: (value: string) => void
}

export function AskHavenInput({ onSubmit }: AskHavenInputProps) {
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
            placeholder="Ask Haven"
            aria-label="Ask Haven"
          />
        </div>
        <button
          className={styles.sendBtn}
          onClick={handleSubmit}
          type="button"
          aria-label="Send"
          disabled={!value.trim()}
        >
          <img src={sendIcon} width={24} height={24} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
