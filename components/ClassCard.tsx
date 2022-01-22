import { Class } from "../models/classes";
import moment from "moment";
import styles from "../styles/Components.module.css";

type ClassCardProps = { class: Class };

const ClassCard: React.FC<ClassCardProps> = ({ class: classObj }) => {
  const weekday: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const convertTime = (startTime: string, endTime: string) => {
    const startTimeStr: string = moment(moment().format(startTime), "HH:mm").format("h");
    const endTimeStr: string = moment(moment().format(endTime), "HH:mm").format("h A");
    return startTimeStr + "-" + endTimeStr;
  };

  return (
    <div className={styles.listElem}>
      <div>
        <p className={styles.leftText}>{classObj.name}</p>
      </div>
      <div className={styles.rightText}>
        {[
          classObj.recurrence.map((day: number) => weekday[day]).join(", "),
          "•",
          convertTime(classObj.timeStart, classObj.timeEnd),
        ].join(" ")}
      </div>
    </div>
  );
};

export default ClassCard;
