import React from "react";
import styles from "./attendance.module.css";
import { AttendanceBox } from "./AttendanceBox";

export const Attendance: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Attendance</div>
      <AttendanceBox attendances={null}></AttendanceBox>
    </div>
  );
};
