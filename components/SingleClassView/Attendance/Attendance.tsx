import React, { useContext, useState , useEffect} from "react";
import styles from "./attendance.module.css";
import { AttendanceBox } from "./AttendanceBox";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { DateTime } from "luxon";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

type AttendanceProps = {
  classId: string,
}
export const Attendance: React.FC<AttendanceProps> = ({ classId }) => {
  const api = useContext(APIContext);

  const [date, setDate] = useState<DateTime>(DateTime.fromJSDate(new Date()));
  const [loading, setLoading] = useState<boolean>(true);
  const [attendances, setAttendance] = useState<any>()

  useEffect( () => {
    (async () => {
      setLoading(true)
      const sessionId = await api.getSessions(classId, date.set({ hour: 0, minute: 0 }).toUTC().toISO())
      console.log(sessionId)
      if (sessionId === undefined || sessionId.length == 0) {
        setAttendance(null);
        return (<p>This date has no sessions</p>);
      }
      else{
        const attendances = await api.getAttendanceFromSessionID(sessionId[0].sessionId, classId);
        setAttendance(attendances);
      }
      setLoading(false)
    })();
  }, [date])
  
  
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
