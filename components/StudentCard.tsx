import { Student } from '../models/users';
import styles from '../styles/Components.module.css';

type StudentCardProps = { student: Student };

const StudentCard: React.FC<StudentCardProps> = ({ student: studentObj }) => {
  return (
    <>
      <div className={styles.listElem}>
        <div>
          <p>{studentObj.first_name + ' ' + studentObj.last_name}</p>
        </div>
        <div>
          {['Level ' + studentObj.level,
          '•',
          studentObj.email].join(' ')}
        </div>
      </div>
    </>

  )
}

export default StudentCard;