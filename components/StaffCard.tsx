import { User } from '../models/users';
import styles from '../styles/Components.module.css';

type StaffCardProps = { staff: User };

const StaffCard: React.FC<StaffCardProps> = ({ staff: staffObj }) => {
  return (
    <>
      <div className={styles.listElem}>
        <div>
          <p>{staffObj.first_name + ' ' + staffObj.last_name}</p>
        </div>
        <div>
          {[staffObj.phone_number,
          '•',
          staffObj.email].join(' ')}
        </div>
      </div>
    </>

  )
}

export default StaffCard;