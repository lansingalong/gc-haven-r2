import { Avatar, Chip, Typography } from '@/components'
import { Icon } from '@/components/Icons'
import memberIcon from '@/assets/member_icon.png'
import { T, type Language } from './translations'
import styles from './ChatWelcome.module.css'

export interface ChatWelcomeProps {
  onMemberDetails: () => void
  onSummarizeMenu: () => void
  language?: Language
}

export function ChatWelcome({ onMemberDetails, onSummarizeMenu, language = 'english' }: ChatWelcomeProps) {
  const t = T[language]
  return (
    <div className={styles.root}>
      <Typography variant="h4">{t.welcomeTitle}</Typography>
      <Typography variant="body2">{t.welcomeSubtitle}</Typography>
      <div className={styles.chipRow}>
        <Chip
          label={t.getPrompts}
          onClick={onMemberDetails}
          avatar={
            <Avatar size={26}>
              <img src={memberIcon} width={16} height={16} alt="" aria-hidden="true" />
            </Avatar>
          }
        />
        <Chip
          label={t.summarizePrompts}
          onClick={onSummarizeMenu}
          avatar={
            <Avatar size={26}>
              <Icon name="Article" size="xs" sx={{ color: '#1B456F' }} />
            </Avatar>
          }
        />
      </div>
    </div>
  )
}
