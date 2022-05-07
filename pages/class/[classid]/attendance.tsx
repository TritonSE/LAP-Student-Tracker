import React from 'react';
import { ClassViewMenu } from '../../../components/ClassView/ClassViewMenu';
import type { NextApplicationPage } from "../../_app";

const AttendancePage: NextApplicationPage = () => {
    return (
        <div>
            <ClassViewMenu/>
            Attendance
        </div>
    )
  }

  export default AttendancePage;