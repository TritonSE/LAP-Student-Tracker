import React, { useContext, useState, useEffect } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models/Attendance";
import { CustomError } from "../../util/CustomError";
import { CustomLoader } from "../../util/CustomLoader";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";
import { AttendanceRow } from "./AttendanceRow";
import { APIContext } from "../../../context/APIContext";

type AttendanceBoxProps = {
  attendances: Attendance[] | undefined;
  sessionId: string;
  classId: string;
};

const AttendanceBox: React.FC<AttendanceBoxProps> = ({ attendances, sessionId, classId }) => {
  if (!attendances) {
    return <p>This date has no sessions</p>;
  }
  const api = useContext(APIContext);
  //get userIds and initial attendances from database
  const userIdToAttendance: [string, AttendanceTypes][] = [];
  attendances.forEach((attendance) => {
    userIdToAttendance.push([attendance.userId, attendance.attendance]);
  });
  const [newAttendances, setAttendance] = useState(new Map(userIdToAttendance));
  const updateAttendances = (key: string, value: AttendanceTypes) => {
    setAttendance(new Map(newAttendances.set(key, value)));
  };
  const names = new Map();
  attendances.forEach(function (attendance) {
    const fullName = attendance.firstName + " " + attendance.lastName;
    names.set(attendance.userId, fullName);
  });
  const [saveAttendances, setSaveAttendances] = useState<boolean>(true);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setLoadingSave(true);
      const attendanceArray: CreateAttendance[] = [];
      newAttendances.forEach((attendance, userId) => {
        attendanceArray.push({
          userId: userId,
          attendance: attendance,
        });
      });
      await api.createAttendance(sessionId, classId, attendanceArray);
      setLoadingSave(false);
    })();
  }, [saveAttendances]);

  return (
    <div className={styles.boxContainer}>
      <div>
        <div className={styles.attendanceList}>
          <div className={styles.attendanceRow}>
            <p className={styles.userName}>Name</p>
            <p>Attendance</p>
          </div>
          {attendances.map((attendance) => {
            return (
              <AttendanceRow
                onAttendanceChange={updateAttendances}
                name={names.get(attendance.userId)}
                userId={attendance.userId}
                attendance={
                  newAttendances.has(attendance.userId)
                    ? newAttendances.get(attendance.userId)
                    : null
                }
              ></AttendanceRow>
            );
          })}
        </div>
        <hr></hr>
        <button
          className={styles.saveAttendance}
          onClick={() => {
            setSaveAttendances(!saveAttendances);
          }}
        >
          {loadingSave ? <CustomLoader></CustomLoader> : "Save Attendance"}
        </button>
      </div>
    </div>
  );
};

export { AttendanceBox };
