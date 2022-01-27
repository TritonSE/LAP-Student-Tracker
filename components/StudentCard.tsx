import styles from "../styles/league-components.module.css";

type StudentCardProps = {
  firstName: string;
  lastName: string;
  level: number;
  classes: string[];
};

const StudentCard: React.FC<StudentCardProps> = ({ firstName, lastName, level, classes }) => {
  return (
    <div className={styles.listElem}>
      <div>
        <p className={styles.leftText}>{firstName + " " + lastName}</p>
      </div>
      <div className={styles.rightText}>{["Level " + level, "•", classes[0]].join(" ")}</div>
    </div>
  );
};

export default StudentCard;
