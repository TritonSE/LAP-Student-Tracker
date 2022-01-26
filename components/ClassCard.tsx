import moment from "moment";
import styles from "../styles/Components.module.css";

type ClassCardProps = {
  name: string;
  minLevel: number;
  maxLevel: number;
  recurrence: number[];
  timeStart: string;
  timeEnd: string;
};

const ClassCard: React.FC<ClassCardProps> = ({
  name,
  minLevel,
  maxLevel,
  recurrence,
  timeStart,
  timeEnd,
}) => {
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
        <p className={styles.leftText}>{`${name} ${
          minLevel === maxLevel ? minLevel : minLevel + "-" + maxLevel
        }`}</p>
      </div>
      <div className={styles.rightText}>
        {[
          recurrence.map((day: number) => weekday[day]).join(", "),
          "•",
          convertTime(timeStart, timeEnd),
        ].join(" ")}
      </div>
    </div>
  );
};

export default ClassCard;
