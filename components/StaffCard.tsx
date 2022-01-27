import styles from "../styles/league-components.module.css";

type StaffCardProps = {
  firstName: string;
  lastName: string;
  phone_number?: string;
  email: string;
};

const StaffCard: React.FC<StaffCardProps> = ({ firstName, lastName, phone_number, email }) => {
  return (
    <div className={styles.listElem}>
      <div>
        <p className={styles.leftText}>{firstName + " " + lastName}</p>
      </div>
      <div className={styles.rightText}>{[phone_number, "•", email].join(" ")}</div>
    </div>
  );
};

export default StaffCard;
