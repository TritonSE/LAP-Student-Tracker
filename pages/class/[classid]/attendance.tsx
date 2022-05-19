import React from 'react';
import { Attendance } from '../../../components/Attendance/Attendance';
import { ClassViewMenu } from '../../../components/ClassView/ClassViewMenu';
import styles from '../../../styles/class.module.css';
import type { NextApplicationPage } from "../../_app";

const AttendancePage: NextApplicationPage = () => {
    return (
        <div className={styles.container}>
            <ClassViewMenu/>
            <Attendance/>
        </div>
    )
  }

  export default AttendancePage;