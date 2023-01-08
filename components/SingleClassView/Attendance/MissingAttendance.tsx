import React, { useState } from "react";
import styles from "./attendance.module.css";
import { DateTime } from "luxon";
import { MissingAttendance } from "../../../models";

type MissingAttendanceComponentProps = {
  missingAttendance: MissingAttendance[];
  changeDate: (newDate: DateTime) => void;
};

// component that renders the missing attendance data
const MissingAttendanceComponent: React.FC<MissingAttendanceComponentProps> = ({
  missingAttendance,
  changeDate,
}) => {
  return (
    <div className={styles.missingAttendanceContainer}>
      <div className={styles.missingAttendanceHeader}>Missing Attendance</div>
      <div>
        {missingAttendance.map((missingAttendanceElem, key) => {
          return (
            <MissingAttendanceRow
              key={key}
              changeDate={changeDate}
              startStr={missingAttendanceElem.startStr}
            />
          );
        })}
      </div>
    </div>
  );
};

type MissingAttendanceRowProps = {
  startStr: string;
  changeDate: (newDate: DateTime) => void;
};
const MissingAttendanceRow: React.FC<MissingAttendanceRowProps> = ({ startStr, changeDate }) => {
  const [date, _] = useState(DateTime.fromISO(startStr));
  // function that is passed from Attendance Component in order to change the date
  // in the overall component
  const onViewClick = (): void => {
    changeDate(date);
  };
  return (
    <div className={styles.missedAttendanceRow}>
      <div>{date.toLocaleString()}</div>
      <div>
        <button className={styles.viewButton} onClick={onViewClick}>
          View
        </button>
      </div>
    </div>
  );
};

export { MissingAttendanceComponent };
