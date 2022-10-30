import React, { useState } from "react";
import styles from "./attendance.module.css";
import { Attendance } from "../../../models/Attendance";

type AttendanceBoxProps = {
    attendances: Attendance[] | null;
};

const AttendanceBox: React.FC<AttendanceBoxProps> =  ({
    attendances,
}) => {
    const [option, setOption] = useState("");
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
                    <div className={styles.attendanceRow}>
                        <p className={styles.userName}>Albert Alizi</p>
                        <div className={styles.userAttendance}>
                            <div>
                                <input
                                    type="radio"
                                    id="present"
                                    name="select-attendance"
                                    value="Present"
                                    onChange={(_) => setOption("Present")}
                                    className={styles.attendanceButton}
                                    checked={option == "Present"}
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
                                    onChange={(_) => setOption("Unexcused")}
                                    className={styles.attendanceButton}
                                    checked={option == "Unexcused"}
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
                                    onChange={(_) => setOption("Excused")}
                                    className={styles.attendanceButton}
                                    checked={option == "Excused"}
                                />
                                <label htmlFor="excused" className={styles.positionText}>
                                    Excused
                                </label>
                            </div>
                        </div>
                    </div>
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