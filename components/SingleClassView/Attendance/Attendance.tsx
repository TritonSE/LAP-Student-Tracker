import React, { useContext, useState } from "react";
import styles from "./attendance.module.css";
import { AttendanceBox } from "./AttendanceBox";
import { APIContext } from "../../../context/APIContext";
import { CustomError } from "../../util/CustomError";
import { CustomLoader } from "../../util/CustomLoader";
import { DateTime } from "luxon";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import useSWR from "swr";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

type AttendanceProps = {
  classId: string,
}
export const Attendance: React.FC<AttendanceProps> = ({ classId }) => {
  const api = useContext(APIContext);

  const [date, setDate] = useState<DateTime>(DateTime.fromJSDate(new Date()));
  console.log(date.set({ hour: 0, minute: 0 }).toUTC().toISO());
  const { data: sessionId, error } = useSWR(`api/class/${classId}/attendance`, () => api.getSessions(classId, date.set({ hour: 0, minute: 0 }).toUTC().toISO()));
  console.log(sessionId);
  const { data: attendances } = useSWR(`api/class/${classId}/attendance/${sessionId}`, () => api.getAttendanceFromSessionID(sessionId[0].sessionId, classId));
  console.log(attendances);

  if (error) return <CustomError />;
  if (!sessionId) return <CustomLoader />;
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>Attendance</div>
      <div className={styles.dateContainer}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={date}
            className={styles.dateInput}
            onChange={(newDate) => {
              setDate(newDate ? newDate : date);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <AttendanceBox attendances={attendances}></AttendanceBox>
    </div>
  );
};
