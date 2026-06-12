import { useState, useRef, useEffect, useCallback } from 'react'
import { Icon } from '@/components/Icons'
import type { ChatSession } from './useChatHistory'
import type { Message } from './ChatMessages'
import { SettingsPanel } from './SettingsPanel'
import { useHavenSettings } from './useHavenSettings'
import styles from './ChatHistoryDrawer.module.css'

interface ChatHistoryDrawerProps {
  sessions: ChatSession[]
  onClose: () => void
  onSelectSession: (messages: Message[], id: string) => void
  onNewConversation: () => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onClearHistory: () => void
  onLearnMore?: () => void
}

function SessionItem({ session, onSelect, onDelete, onToggleFavorite }: {
  session: ChatSession
  onSelect: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const cancelBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); menuBtnRef.current?.focus() }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [menuOpen])

  useEffect(() => {
    if (confirmDelete) cancelBtnRef.current?.focus()
  }, [confirmDelete])

  const label = session.summary ?? session.preview
  const favLabel = session.favorited ? 'Favorited' : ''

  return (
    <div className={styles.sessionRow}>
      <button
        className={styles.sessionItem}
        onClick={onSelect}
        type="button"
        aria-label={favLabel ? `${label} (${favLabel})` : label}
      >
        <span className={styles.sessionContent} aria-hidden="true">
          <span className={styles.sessionSummary}>{label}</span>
        </span>
      </button>

      <div className={styles.menuWrap} ref={menuRef}>
        <button
          ref={menuBtnRef}
          className={styles.menuBtn}
          type="button"
          aria-label={`More options for: ${label}`}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
        >
          <Icon name="MoreVert" size="sm" color="inherit" aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className={styles.dropdown} role="menu" aria-label={`Options for: ${label}`}>
            <button
              className={styles.dropdownItem}
              type="button"
              role="menuitem"
              onClick={() => { onToggleFavorite(); setMenuOpen(false) }}
            >
              <Icon name={session.favorited ? 'StarBorder' : 'Star'} size="sm" color="action" aria-hidden="true" />
              {session.favorited ? 'Unfavorite' : 'Favorite'}
            </button>
            <button
              className={`${styles.dropdownItem} ${styles.dropdownItemDelete}`}
              type="button"
              role="menuitem"
              onClick={() => { setMenuOpen(false); setConfirmDelete(true) }}
            >
              <Icon name="DeleteOutlined" size="sm" color="error" aria-hidden="true" />
              Delete
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className={styles.confirmDialog}>
            <p className={styles.confirmText}>Delete this chat?</p>
            <div className={styles.confirmActions}>
              <button
                ref={cancelBtnRef}
                className={styles.confirmCancel}
                type="button"
                onClick={() => { setConfirmDelete(false); menuBtnRef.current?.focus() }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDelete}
                type="button"
                onClick={() => { setConfirmDelete(false); onDelete() }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ChatHistoryDrawer({ sessions, onClose, onSelectSession, onNewConversation, onDelete, onToggleFavorite, onClearHistory, onLearnMore }: ChatHistoryDrawerProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings, updateSettings } = useHavenSettings()

  const handleLearnMore = () => {
    onClose()
    onLearnMore?.()
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  return (
    <div className={styles.root} onKeyDown={handleKeyDown}>
      <nav className={styles.sidebar} aria-label="Chat history">
        {settingsOpen ? (
          <SettingsPanel
            settings={settings}
            onUpdate={updateSettings}
            onBack={() => setSettingsOpen(false)}
            onClearHistory={() => { onClearHistory(); setSettingsOpen(false) }}
            sessionCount={sessions.length}
            onLearnMore={handleLearnMore}
          />
        ) : (
          <>
            <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close sidebar">
              <Icon name="Close" size="md" color="action" />
            </button>

            <button
              className={styles.newChatBtn}
              onClick={() => { onNewConversation(); onClose() }}
              type="button"
            >
              <span className={styles.newChatIcon}>
                <Icon name="Add" size="sm" color="inverse" />
              </span>
              <span className={styles.newChatLabel}>New Chat</span>
            </button>

            <div className={styles.list} role="list">
              {sessions.filter(s => s.favorited).length > 0 && (
                <div role="group" aria-label="Favorites">
                  <p className={styles.listLabel} aria-hidden="true">Favorites</p>
                  {sessions.filter(s => s.favorited).map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      onSelect={() => { onSelectSession(session.messages, session.id); onClose() }}
                      onDelete={() => onDelete(session.id)}
                      onToggleFavorite={() => onToggleFavorite(session.id)}
                    />
                  ))}
                </div>
              )}
              {sessions.filter(s => !s.favorited).length > 0 && (
                <div role="group" aria-label="Recent">
                  <p className={styles.listLabel} aria-hidden="true">Recent</p>
                  {sessions.filter(s => !s.favorited).map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      onSelect={() => { onSelectSession(session.messages, session.id); onClose() }}
                      onDelete={() => onDelete(session.id)}
                      onToggleFavorite={() => onToggleFavorite(session.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              className={styles.settingsBtn}
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              <Icon name="Settings" size="sm" color="action" />
              <span className={styles.settingsLabel}>Settings</span>
            </button>
          </>
        )}
      </nav>

      <div
        className={styles.overlay}
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
