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
          const date = DateTime.fromISO(singleAttendance.end).toLocal().toFormat("MM/dd EEEE");
          return (
            <div key={singleAttendance.sessionId} className={styles.attendanceRow}>
              <p className={styles.classDate}>{date}</p>
              <p className={styles.classTime}>{time}</p>
              <div className={styles.userAttendanceStudent}>
                {singleAttendance.attendance == "Present" ? (
                  <button className={styles.presentButton}>Present</button>
                ) : (
                  <button className={styles.uncheckedButton}>Present</button>
                )}
                {singleAttendance.attendance == "Excused" ? (
                  <button className={styles.excusedButton}>Excused</button>
                ) : (
                  <button className={styles.uncheckedButton}>Excused</button>
                )}
                {singleAttendance.attendance == "Unexcused" ? (
                  <button className={styles.unexcusedButton}>Unexcused</button>
                ) : (
                  <button className={styles.uncheckedButton}>Unexcused</button>
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
