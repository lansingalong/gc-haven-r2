import { Avatar, Chip, Typography } from '@/components'
import memberIcon from '@/assets/member_icon.png'
import styles from './ChatWelcome.module.css'

export interface ChatWelcomeProps {
  onMemberDetails: () => void
}

export function ChatWelcome({ onMemberDetails }: ChatWelcomeProps) {
  return (
    <div className={styles.root}>
      <Typography variant="h4">Welcome</Typography>
      <Typography variant="body2">Pick a prompt or ask your own question</Typography>
      <div className={styles.chipRow}>
        <Chip
          label="Get member details"
          onClick={onMemberDetails}
          avatar={
            <Avatar size={24}>
              <img src={memberIcon} width={16} height={16} alt="" aria-hidden="true" />
            </Avatar>
          }
        />
      </div>
    </div>
  )
}
