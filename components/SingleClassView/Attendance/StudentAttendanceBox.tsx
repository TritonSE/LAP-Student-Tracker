import React from "react";
import styles from "./attendance.module.css";
import { SingleUserAttendance } from "../../../models";
import { DateTime } from "luxon";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";

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
                  <Button
                    disabled
                    style={{ backgroundColor: "#F5B7B1", color: "#fff" }} // Replace with your desired color
                    variant="contained"
                    className={styles.baseAttendanceButton}
                  >
                    Present
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
                    className={styles.baseAttendanceButton}
                    variant="contained"
                    disabled
                  >
                    Present
                  </Button>
                )}
                {singleAttendance.attendance == "Excused" ? (
                  <Button
                    disabled
                    style={{ backgroundColor: "#E6BE8A", color: "#fff" }} // Replace with your desired color
                    variant="contained"
                    className={styles.baseAttendanceButton}
                  >
                    Excused
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
                    className={styles.baseAttendanceButton}
                    variant="contained"
                    disabled
                  >
                    Excused
                  </Button>
                )}
                {singleAttendance.attendance == "Unexcused" ? (
                  <Button
                    disabled
                    style={{ backgroundColor: "#B0E0E6", color: "#fff" }} // Replace with your desired color
                    variant="contained"
                    className={styles.baseAttendanceButton}
                  >
                    Unexcused
                  </Button>
                ) : (
                  <Button
                    style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
                    className={styles.baseAttendanceButton}
                    variant="contained"
                    disabled
                  >
                    Unexcused
                  </Button>
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
