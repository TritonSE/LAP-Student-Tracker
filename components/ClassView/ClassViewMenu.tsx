import React, { useState } from "react";
import { useRouter } from "next/router";

import styles from "./ClassView.module.css";

const AttendanceView: React.FC = () => {
  return (
      <div>
          Attendance
      </div>
  )
}

const RosterView: React.FC = () => {
  return (
      <div>
          Roster
      </div>
  )
}

const ModulesView: React.FC = () => {
  return (
      <div>
          Modules
      </div>
  )
} 
const BackButton: React.FC = () => {
    const router = useRouter();
    const onClick = () => {
        router.push("/home");
    }
    return (
        <div onClick={onClick}>
            Back
        </div>
    )
}

export const ClassViewMenu: React.FC = () => {
    const router = useRouter();

    const [modules, setModules] = useState(false);
    const [attendance, setAttendance] = useState(false);
    const [roster, setRoster] = useState(false);
    
    const setClicked = (id: string): void => {
        if(id == "attendance"){
            setAttendance(true);
            setRoster(false);
            setModules(false);
        }
        if(id == "roster"){
            setAttendance(false);
            setRoster(true);
            setModules(false);
        }
        if(id == "modules"){
            setAttendance(false);
            setRoster(false);
            setModules(true);
        }
    }

    return (
    <>
      <nav className={styles.navbar}>
            <ul className={styles.navmenu}>
              <li className={styles.navitem}>
                <a
                
                  // className={router.pathname.includes("attendance") ? styles.clicked : styles.navlink}
                  className={attendance ? styles.clicked : styles.navlink}
                  // onClick={() => { router.push("/class/attendance") }}
                  onClick={() => { setClicked("attendance") }}
                >
                  Attendance
                </a>
              </li>

              <li className={styles.navitem}>
                <a
                  id="roster"
                  // className={router.pathname.includes("roster") ? styles.clicked : styles.navlink}
                  className={roster ? styles.clicked : styles.navlink}
                  // onClick={ () => { router.push("/class/roster") }}
                  onClick={() => { setClicked("roster") }}
                >
                  Roster
                </a>
              </li>
              <li className={styles.navitem}>
                <a
                  id="modules"
                  // className={router.pathname.includes("modules") ? styles.clicked : styles.navlink}
                  className={modules ? styles.clicked : styles.navlink}
                  // onClick={ () => { router.push("/class/modules") }}
                  onClick={() => { setClicked("modules") }}
                >
                  Modules
                </a>
              </li>
            </ul>
      </nav>
      {attendance && <AttendanceView />}
      {roster && <RosterView />}
      {modules && <ModulesView />}
    </>
    )
}