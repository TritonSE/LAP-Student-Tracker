import React, { useState, useContext } from "react";
import type { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/class.module.css";
import { Error } from "../../components/util/Error";
import { Roster } from "../../components/Roster/Roster";
import { useRouter } from "next/router";
import { Attendance } from "../../components/Attendance/Attendance";
import { Module } from "../../components/ModuleView/Module";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { BackButton } from "../../components/util/BackButton";

const Class: NextApplicationPage = () => {
  const router = useRouter();
  const client = useContext(APIContext);

  const { user } = useContext(AuthContext);
  const classId = router.query.classId as string;
  const { data: currClass } = useSWR("/api/class" + classId, () => client.getClass(classId));

  const [currentModule, setCurrentModule] = useState<string>("roster");

  if (user == null) return <Error />;
  if (currClass == null) return <Error />;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <ul className={styles.navmenu}>
          <BackButton linkTo="/home" />
          <li className={styles.navtitle}>{currClass.name}</li>
          <li className={styles.navitem}>
            <a
              className={currentModule == "attendance" ? styles.clicked : styles.navlink}
              onClick={() => setCurrentModule("attendance")}
            >
              Attendance
            </a>
          </li>

          <li className={styles.navitem}>
            <a
              id="roster"
              className={currentModule == "roster" ? styles.clicked : styles.navlink}
              onClick={() => setCurrentModule("roster")}
            >
              Roster
            </a>
          </li>
          <li className={styles.navitem}>
            <a
              id="modules"
              className={currentModule == "modules" ? styles.clicked : styles.navlink}
              onClick={() => setCurrentModule("modules")}
            >
              Modules
            </a>
          </li>
        </ul>
      </nav>
      {currentModule == "attendance" ? (
        <Attendance />
      ) : currentModule == "roster" ? (
        <Roster />
      ) : (
        <Module />
      )}
    </div>
  );
};

export default Class;
