import React, { useState } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models/Attendance";
import { CustomError } from "../../util/CustomError";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";

type AttendanceRowProps = {
    onAttendanceChange: (userId: string, newAttendance: AttendanceTypes) => void;
    name: string,
    userId: string,
    attendance: AttendanceTypes | undefined,
};

const AttendanceRow: React.FC<AttendanceRowProps> =  ({
    onAttendanceChange,
    name,
    userId,
    attendance,
}) => {
    console.log(attendance, name);
    return (
        <div className={styles.attendanceRow}>
            <p className={styles.userName}>{name}</p>
            <div className={styles.userAttendance}>
                {attendance == "Present" ? (
                    <button
                        className={styles.presentButton}
                    >Present</button>
                ): (
                    <button
                        onClick={(_) => onAttendanceChange(userId, "Present")}
                        className={styles.uncheckedButton}
                    >Present</button>
                )}
                {attendance == "Excused" ? (
                    <button
                        className={styles.excusedButton}
                    >Excused</button>
                ): (
                    <button
                        onClick={(_) => onAttendanceChange(userId, "Excused")}
                        className={styles.uncheckedButton}
                    >Excused</button>
                )}
                {attendance == "Unexcused" ? (
                    <button
                        className={styles.unexcusedButton}
                    >Unexcused</button>
                ): (
                    <button
                        onClick={(_) => onAttendanceChange(userId, "Unexcused")}
                        className={styles.uncheckedButton}
                    >Unexcused</button>
                )}
            </div>
        </div>
    )
};
export { AttendanceRow }