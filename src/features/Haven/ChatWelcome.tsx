import { Avatar, Chip, Typography } from '@/components'
import { Icon } from '@/components/Icons'
import memberIcon from '@/assets/member_icon.png'
import styles from './ChatWelcome.module.css'

export interface ChatWelcomeProps {
  onMemberDetails: () => void
  onSummarizeMenu: () => void
}

export function ChatWelcome({ onMemberDetails, onSummarizeMenu }: ChatWelcomeProps) {
  return (
    <div className={styles.root}>
      <Typography variant="h4">Welcome</Typography>
      <Typography variant="body2">Pick a prompt or ask your own question</Typography>
      <div className={styles.chipRow}>
        <Chip
          label="Get member details"
          onClick={onMemberDetails}
          avatar={
            <Avatar size={26}>
              <img src={memberIcon} width={16} height={16} alt="" aria-hidden="true" />
            </Avatar>
          }
        />
        <Chip
          label="Summarize for me"
          onClick={onSummarizeMenu}
          avatar={
            <Avatar size={26}>
              <Icon name="Article" size="xs" sx={{ color: 'var(--color-icon-navy)' }} />
            </Avatar>
          }
        />
      </div>
    </div>
  )
}
