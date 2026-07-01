import { useState } from 'react'

export interface HavenSettings {
  preferredName: string
  roleDescription: string
  styleAndTone: 'casual' | 'professional' | 'clinical'
  language: 'english' | 'spanish'
  workType: 'clinician' | 'care-coordinator' | 'case-manager' | 'admin' | 'other'
  fontStyle: 'default' | 'serif' | 'dyslexic'
}

const DEFAULT: HavenSettings = {
  preferredName: '',
  roleDescription: '',
  styleAndTone: 'casual',
  language: 'english',
  workType: 'care-coordinator',
  fontStyle: 'default',
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
