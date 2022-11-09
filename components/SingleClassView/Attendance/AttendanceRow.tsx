import React, { useState } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models/Attendance";
import { CustomError } from "../../util/CustomError";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";

type AttendanceRowProps = {
    onAttendanceChange: (userId: string, newAttendance: AttendanceTypes) => void;
    name: string,
    userId: string,
    attendance: AttendanceTypes,
};

const AttendanceRow: React.FC<AttendanceRowProps> =  ({
    onAttendanceChange,
    name,
    userId,
    attendance,
}) => {
    return (
        <div className={styles.attendanceRow}>
            <p className={styles.userName}>{name}</p>
            <div className={styles.userAttendance}>
                <div>
                    <input
                        type="radio"
                        id="present"
                        name="select-attendance"
                        value="Present"
                        onChange={(_) => onAttendanceChange(userId, "Present")}
                        className={styles.attendanceButton}
                        checked={attendance == "Present"}
                    />
                    <label htmlFor="present" className={styles.positionText}>
                        Present
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="unexcused"
                        name="select-attendance"
                        value="Unexcused"
                        onChange={(_) => onAttendanceChange(userId, "Unexcused")}
                        className={styles.attendanceButton}
                        checked={attendance == "Unexcused"}
                    />
                    <label htmlFor="unexcused" className={styles.positionText}>
                        Unexcused
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="excused"
                        name="select-attendance"
                        value="Excused"
                        onChange={(_) => onAttendanceChange(userId, "Excused")}
                        className={styles.attendanceButton}
                        checked={attendance == "Excused"}
                    />
                    <label htmlFor="excused" className={styles.positionText}>
                        Excused
                    </label>
                </div>
            </div>
        </div>
    )
};
export { AttendanceRow }