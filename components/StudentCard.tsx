import { Student } from "../models/users";
import styles from "../styles/Components.module.css";

type StudentCardProps = { student: Student };

const StudentCard: React.FC<StudentCardProps> = ({ student: studentObj }) => {
  return (
    <div className={styles.listElem}>
      <div>
        <p className={styles.leftText}>{studentObj.firstName + " " + studentObj.lastName}</p>
      </div>
      <div className={styles.rightText}>
        {["Level " + studentObj.level, "•", studentObj.classes[0]].join(" ")}
      </div>
    </div>
  );
};

export default StudentCard;
