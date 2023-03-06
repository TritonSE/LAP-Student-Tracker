import React, { useContext, useState, useEffect } from "react";
import styles from "./attendance.module.css";
import { AttendanceBox } from "./AttendanceBox";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { DateTime } from "luxon";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Attendance, MissingAttendance, SingleUserAttendance } from "../../../models";
import { MissingAttendanceComponent } from "./MissingAttendance";
import { AuthContext } from "../../../context/AuthContext";
import { StudentAttendanceBox } from "./StudentAttendanceBox";

type AttendanceComponentProps = {
  classId: string;
};
export const AttendanceComponent: React.FC<AttendanceComponentProps> = ({ classId }) => {
  const api = useContext(APIContext);
  const { user } = useContext(AuthContext);

  const [date, setDate] = useState<DateTime>(DateTime.fromJSDate(new Date()));
  const [loading, setLoading] = useState<boolean>(true);
  const [attendances, setAttendance] = useState<Attendance[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<SingleUserAttendance[]>([]);
  const [sessionID, setSessionID] = useState<string>("");
  const [missingAttendance, setMissingAttendance] = useState<MissingAttendance[]>([]);
  const [loadMissingAttendance, setLoadMissingAttendance] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sessions = await api.getSessions(
        classId,
        date.set({ hour: 0, minute: 0 }).toUTC().toISO()
      );
      if (sessions.length == 0) {
        setAttendance([]);
        setStudentAttendance([]);
        setLoading(false);
        return <p>This date has no sessions</p>;
      }
      setSessionID(sessions[0].sessionId);
      const sessionId = sessions[0].sessionId;
      if (user) {
        if (user.role == "Teacher" || user.role == "Admin") {
          const attendances = await api.getAttendanceFromSessionID(sessionId, classId);
          setAttendance(attendances);
        } else {
          const studentAttendance = await api.getSingleUserAttendanceFromSessionID(
            user.id,
            sessionId,
            classId
          );
          setStudentAttendance(studentAttendance);
        }
      }
      setLoading(false);
    })();
  }, [date]);

  useEffect(() => {
    (async () => {
      await refreshMissingAttendanceList();
    })();
  }, []);

  const changeDate = (newDate: DateTime): void => {
    setDate(newDate);
  };

  const refreshMissingAttendanceList = async (): Promise<void> => {
    setLoadMissingAttendance(true);
    const missedAttendance = await api.getMissingAttednance(classId);
    setMissingAttendance(missedAttendance);
    setLoadMissingAttendance(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Attendance</div>
      <div className={styles.dateAndMissingAttendanceContainer}>
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
        {user && (user.role == "Teacher" || user.role == "Admin") && (
          <div className={styles.missingAttendance}>
            {loadMissingAttendance ? (
              <CustomLoader></CustomLoader>
            ) : (
              <MissingAttendanceComponent
                changeDate={changeDate}
                missingAttendance={missingAttendance}
              />
            )}
          </div>
        )}
      </div>
      {/* Show all attendances for Teacher and Admin. Fot students only show that student's attendance 
          AttendanceBox --> renders all attendances
          StudentAttendanceBox --> renders single student attendance
      */}
      {loading ? (
        <CustomLoader></CustomLoader>
      ) : user && (user.role == "Teacher" || user.role == "Admin") ? (
        <AttendanceBox
          attendances={attendances}
          classId={classId}
          sessionId={sessionID}
          refreshMissingAttendanceList={refreshMissingAttendanceList}
        ></AttendanceBox>
      ) : (
        <StudentAttendanceBox studentAttendance={studentAttendance}></StudentAttendanceBox>
      )}
    </div>
  );
};
