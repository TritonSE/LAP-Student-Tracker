import React, { useContext, useState } from "react";
import styles from "./attendance.module.css";
import { AttendanceBox } from "./AttendanceBox";
import { APIContext } from "../../../context/APIContext";
import { CustomError } from "../../util/CustomError";
import { CustomLoader } from "../../util/CustomLoader";
import useSWR from "swr";

type AttendanceProps = {
  classId: string,
}
export const Attendance: React.FC<AttendanceProps> = ({ classId }) => {
  const api = useContext(APIContext);
  const curr_time = "2022-11-06T05:00:00.000Z";
  const { data: sessionId, error } = useSWR(`api/class/${classId}/attendance`, () => api.getSessions(classId, curr_time));
  console.log(sessionId);
  if (error) return <CustomError />;
  if (!sessionId) return <CustomLoader />;
  

  return (
    <div className={styles.container}>
      <div className={styles.title}>Attendance</div>
      <AttendanceBox attendances={null}></AttendanceBox>
    </div>
  );
};
