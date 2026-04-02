import { Icon, Typography } from '@/components'
import sukiIcon from '@/assets/suki.png'
import styles from './MemberHeader.module.css'

export interface MemberHeaderProps {
  memberName: string
  phone: string
  memberId: string
  pcp: string
}

export function MemberHeader({ memberName, phone, memberId, pcp }: MemberHeaderProps) {
  return (
    <div className={styles.root}>
      {/* Row 1 — member name */}
      <div className={styles.nameRow}>
        <Icon name="Person" size="md" color="action" />
        <Typography variant="h6">{memberName}</Typography>
        <button className={styles.sukiBtn} type="button" aria-label="Suki voice scribe">
          <img src={sukiIcon} width={28} height={28} alt="Suki" />
        </button>
      </div>

      {/* Row 2 — data fields */}
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <Typography variant="caption">Preferred Phone Number</Typography>
          <Typography variant="subtitle2">{phone}</Typography>
        </div>
        <div className={styles.field}>
          <Typography variant="caption">Member ID</Typography>
          <Typography variant="subtitle2">{memberId}</Typography>
        </div>
        <div className={styles.field}>
          <Typography variant="caption">Primary Care Provider</Typography>
          <Typography variant="subtitle2">{pcp}</Typography>
        </div>
      </div>
    </div>
  )
}
