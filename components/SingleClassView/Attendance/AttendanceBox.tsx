import React, { useState } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models/Attendance";
import { CustomError } from "../../util/CustomError";
import { AttendanceTypes, CreateAttendance } from "../,,/../../../models";
import { AttendanceRow } from "./AttendanceRow";


type AttendanceBoxProps = {
    attendances: Attendance[] | undefined
};

const AttendanceBox: React.FC<AttendanceBoxProps> =  ({
    attendances,
}) => {
    if (!attendances){
        return <p>This date has no sessions</p>
    }

    //get userIds and initial attendances from database
    const temp: [string, AttendanceTypes][] = []
    attendances.forEach(function(attendance, index){
        temp.push([attendance.userId, attendance.attendance])
    })
    const [newAttendances, setAttendance] = useState(new Map(temp));
    const updateAttendances = (key: string, value: AttendanceTypes) => {
        setAttendance(new Map(newAttendances.set(key, value)));
    }
    const names = new Map();
    attendances.forEach(function(attendance, index){
        const fullName = attendance.firstName + " " +attendance.lastName;
        names.set(attendance.userId, fullName);
    })

    console.log(names);
    console.log(newAttendances);

    const formSubmit = () => {
        
    }
    
    return (
        <div className={styles.boxContainer}>
            <form onSubmit={formSubmit}>
                <div className={styles.attendanceList}>
                    <div className={styles.attendanceRow}>
                        <p className={styles.userName}>Name</p>
                        <p>Attendance</p>
                    </div>
                    {attendances.map(attendance => {
                        return(
                            <AttendanceRow
                                onAttendanceChange={updateAttendances}
                                name={names.get(attendance.userId)}
                                userId={attendance.userId}
                                attendance={newAttendances.has(attendance.userId) ? newAttendances.get(attendance.userId) : null}
                            ></AttendanceRow>
                        )
                    })}
                </div>
                <hr></hr>
                <button className={styles.saveAttendance}>
                    Save Attendance
                </button>
            </form>
        </div>
    );
};

export { AttendanceBox };