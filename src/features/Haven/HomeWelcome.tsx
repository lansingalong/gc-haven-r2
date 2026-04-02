import { Avatar, Chip, Typography } from '@/components'
import { Icon } from '@/components/Icons'
import styles from './HomeWelcome.module.css'

const HOME_PROMPTS: Array<{ label: string; icon: string }> = [
  { label: 'Continue where you left off', icon: 'History' },
  { label: 'Check priority list',         icon: 'PriorityHigh' },
  { label: 'Prepare for a call',          icon: 'Phone' },
  // 4th prompt — add label here when ready
]

export interface HomeWelcomeProps {
  onPrompt: (text: string) => void
}

export function HomeWelcome({ onPrompt }: HomeWelcomeProps) {
  return (
    <div className={styles.root}>
      <Typography variant="h4">Welcome back</Typography>
      <Typography variant="body2">Pick a prompt or ask your own question</Typography>
      <div className={styles.prompts}>
        {HOME_PROMPTS.map(({ label, icon }) => (
          <Chip
            key={label}
            label={label}
            onClick={() => onPrompt(label)}
            avatar={
              <Avatar size={24}>
                <Icon name={icon as never} size="xs" color="action" />
              </Avatar>
            }
          />
        ))}
      </div>
    </div>
  )
}
