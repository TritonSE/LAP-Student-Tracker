import React, {useState} from "react";
import styles from "./roster.module.css";
import {TeacherTableView} from "./TeacherTableView";

export const Roster: React.FC = () => {
    const [showTeacher, setShowTeacher] = useState(true)
    const onC = (): void => {
        setShowTeacher(!showTeacher);
    };
  return (
    <div className={styles.container}>
      <div className={styles.title}>Roster</div>
        <div className={styles.spacer}/>
        <div className={styles.dropdownHeader}>
            <button className={styles.button} onClick={() => onC()}>
                <img src={"../../../assets/icons/downVector.png"}/>
            </button>
            <label className={styles.buttonLabel}> Teachers </label>
        </div>
        { showTeacher ? <TeacherTableView/> : null}
    </div>
  );
};
