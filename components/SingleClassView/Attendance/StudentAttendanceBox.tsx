import React, { useContext, useState } from "react";
import styles from "./attendance.module.css";
import { SingleUserAttendance } from "../../../models";
import moment from "moment";
import { CustomLoader } from "../../util/CustomLoader";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";
import { AttendanceRow } from "./AttendanceRow";
import { APIContext } from "../../../context/APIContext";

type StudentAttendanceBoxProps = {
  studentAttendance: SingleUserAttendance[];
};

const StudentAttendanceBox: React.FC<StudentAttendanceBoxProps> = ({
    studentAttendance,
}) => {
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
                    let date = moment.utc(singleAttendance.start).format("MM/DD dddd");
                    let start_time = moment.utc(singleAttendance.start).format("hh:mm A");
                    let end_time = moment.utc(singleAttendance.end).format("hh:mm A");
                    let time = start_time + " " + end_time;
                    return (
                        <div className={styles.attendanceRow}>
                            <p className={styles.classDate}>{date}</p>
                            <p className={styles.classTime}>{time}</p>
                            <div className={styles.userAttendanceStudent}>
                                {singleAttendance.attendance == "Present" ? (
                                    <button className={styles.presentButton}>Present</button>
                                ) : (
                                    <button className={styles.uncheckedButton}>Present</button>
                                )}
                                {singleAttendance.attendance == "Excused" ? (
                                    <button className={styles.excusedButton}>Excused</button>
                                ) : (
                                    <button className={styles.uncheckedButton}>Excused</button>
                                )}
                                {singleAttendance.attendance == "Unexcused" ? (
                                    <button className={styles.unexcusedButton}>Unexcused</button>
                                ) : (
                                    <button className={styles.uncheckedButton}>Unexcused</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export { StudentAttendanceBox };
