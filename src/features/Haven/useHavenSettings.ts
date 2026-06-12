import { useState } from 'react'

export interface HavenSettings {
  responseDetail: 'concise' | 'standard' | 'detailed'
  showFollowUps: boolean
  historyRetention: '30days' | '90days' | 'forever'
}

const DEFAULT: HavenSettings = {
  responseDetail: 'standard',
  showFollowUps: true,
  historyRetention: 'forever',
}

const STORAGE_KEY = 'haven-settings-v1'

export function useHavenSettings() {
  const [settings, setSettings] = useState<HavenSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...DEFAULT, ...JSON.parse(stored) } : DEFAULT
    } catch {
      return DEFAULT
    }
  })

  const updateSettings = (patch: Partial<HavenSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* quota exceeded */ }
      return next
    })
  }

  return { settings, updateSettings }
}
