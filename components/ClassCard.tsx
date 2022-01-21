import { Class } from '../models/classes';
import styles from '../styles/Components.module.css';

type ClassCardProps = { class: Class };

const ClassCard: React.FC<ClassCardProps> = ({ class: classObj }) => {
  const weekday: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeString = (startTime: String, endTime: String) => {
    return startTime + ' - ' + endTime;
  }

  return (
    <>
      <div className={styles.listElem}>
        <div>
          <p>{classObj.name}</p>
        </div>
        <div>
          {[classObj.recurrence.map((day: number) => weekday[day]).join(', '),
          '•',
          timeString(classObj.timeStart, classObj.timeEnd)].join(' ')}
        </div>
      </div>
    </>

  )
}

export default ClassCard;