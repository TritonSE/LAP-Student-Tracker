import React from "react";
import styles from "./attendance.module.css";
import { SingleUserAttendance } from "../../../models";
import { DateTime } from "luxon";

type StudentAttendanceBoxProps = {
  studentAttendance: SingleUserAttendance[];
};

const StudentAttendanceBox: React.FC<StudentAttendanceBoxProps> = ({ studentAttendance }) => {
  if (studentAttendance.length == 0) {
    return <p>This date has no sessions</p>;
  }
  return (
    <div className={styles.boxContainer}>
      <div className={styles.attendanceList}>
        <div className={styles.attendanceRow}>
          <p className={styles.classDate}>Date</p>
          <p className={styles.classTime}>Time</p>
          <p className={styles.attendanceBoxtext}>Attendance</p>
        </div>
        {studentAttendance.map((singleAttendance) => {
          const startTimeISO = DateTime.fromISO(singleAttendance.start)
            .toLocal()
            .toFormat("h:mm a");
          const endTimeISO = DateTime.fromISO(singleAttendance.end).toLocal().toFormat("h:mm a");
          const time = startTimeISO + " - " + endTimeISO;
          const date = DateTime.fromISO(singleAttendance.end).toLocal().toFormat("MM/dd");
          return (
            <div key={singleAttendance.sessionId} className={styles.attendanceRow}>
              <p className={styles.classDate}>{date}</p>
              <p className={styles.classTime}>{time}</p>
              <div className={styles.userAttendanceStudent}>
                {singleAttendance.attendance == "Present" ? (
                  <button disabled className={styles.presentButtonStudent}>Present</button>
                ) : (
                  <button disabled className={styles.uncheckedButtonStudent}>Present</button>
                )}
                {singleAttendance.attendance == "Excused" ? (
                  <button disabled className={styles.excusedButtonStudent}>Excused</button>
                ) : (
                  <button disabled className={styles.uncheckedButtonStudent}>Excused</button>
                )}
                {singleAttendance.attendance == "Unexcused" ? (
                  <button disabled className={styles.unexcusedButtonStudent}>Unexcused</button>
                ) : (
                  <button disabled className={styles.uncheckedButtonStudent}>Unexcused</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { StudentAttendanceBox };
