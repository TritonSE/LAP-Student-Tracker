import React, { useContext, useState } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models";
import { CustomLoader } from "../../util/CustomLoader";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";
import { AttendanceRow } from "./AttendanceRow";
import { APIContext } from "../../../context/APIContext";

type AttendanceBoxProps = {
  attendances: Attendance[];
  sessionId: string;
  classId: string;
  refreshMissingAttendanceList: () => Promise<void>;
};

const AttendanceBox: React.FC<AttendanceBoxProps> = ({
  attendances,
  sessionId,
  classId,
  refreshMissingAttendanceList,
}) => {
  if (attendances.length == 0) {
    return <p>This date has no sessions</p>;
  }
  const api = useContext(APIContext);
  //get userIds and initial attendances from database
  const userIdToAttendance: [string, AttendanceTypes][] = [];

  attendances.forEach((attendance) => {
    userIdToAttendance.push([attendance.userId, attendance.attendance]);
  });
  // map of new attendance values, in case we have to update
  const [newAttendances, setAttendance] = useState(new Map(userIdToAttendance));
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const updateAttendances = (key: string, value: AttendanceTypes): void => {
    setAttendance(new Map(newAttendances.set(key, value)));
  };
  const idToFirstName = new Map();
  attendances.forEach((attendance) => {
    const fullName = attendance.firstName + " " + attendance.lastName;
    idToFirstName.set(attendance.userId, fullName);
  });

  // async function to update attendance in database
  const updateAttendance = async (): Promise<void> => {
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
    await refreshMissingAttendanceList();
  };

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
                name={idToFirstName.get(attendance.userId)}
                userId={attendance.userId}
                attendance={
                  newAttendances.has(attendance.userId)
                    ? newAttendances.get(attendance.userId)
                    : null
                }
                key={attendance.userId}
              ></AttendanceRow>
            );
          })}
        </div>
        <hr></hr>
        <button
          className={styles.saveAttendance}
          onClick={async () => {
            await updateAttendance();
          }}
        >
          {loadingSave ? <CustomLoader></CustomLoader> : "Save Attendance  "}
        </button>
      </div>
    </div>
  );
};

export { AttendanceBox };
