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
  const timeString = (startTime: string, endTime: string) => {
    const startTimeStr: string = moment(moment().format(startTime), "HH:mm").format("h");
    const endTimeStr: string = moment(moment().format(endTime), "HH:mm").format("h A");
    return startTimeStr + "-" + endTimeStr;
  };

  return (
    <>
      <div className={styles.listElem}>
        <div>
          <p>{classObj.name}</p>
        </div>
        <div>
          {[
            classObj.recurrence?.map((day?: number) => weekday[day!]).join(", "),
            "•",
            timeString(classObj.timeStart, classObj.timeEnd),
          ].join(" ")}
        </div>
      </div>
    </>
  );
};

export default ClassCard;
