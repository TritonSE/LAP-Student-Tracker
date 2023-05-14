import React, { useContext, useEffect, useState } from "react";
import type { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/class.module.css";
import { Roster } from "../../components/SingleClassView/Roster/Roster";
import { useRouter } from "next/router";
import { APIContext } from "../../context/APIContext";
import { BackButton } from "../../components/util/BackButton";
import { CustomError } from "../../components/util/CustomError";
import { CustomLoader } from "../../components/util/CustomLoader";
import { AttendanceComponent } from "../../components/SingleClassView/Attendance/AttendanceComponent";
import { ClassModule } from "../../components/SingleClassView/Module/ClassModule";
import { Communicate } from "../../components/SingleClassView/Communicate/Communicate";
import { Class as ClassType } from "../../models";

const Class: NextApplicationPage = () => {
  const router = useRouter();
  const client = useContext(APIContext);

  const query = router.query;
  const studentId = query.studentId as string | undefined;

  const { user } = useContext(AuthContext);
  const [currClass, setCurrClass] = useState<ClassType | null>(null);
  const classId = router.query.classId as string;

  useEffect(() => {
    (async () => {
      let currClass;
      try {
        currClass = await client.getClass(classId);
      } catch (e) {
        // users might be able to get here when the class does not exist, so just redirect back to home
        router.push("/home");
      }
      await client.refreshClassSessions(classId);
      setCurrClass(currClass as ClassType);
    })();
  }, []);

  const [currentModule, setCurrentModule] = useState<string>("roster");

  if (user == null) return <CustomError />;
  if (currClass == null) return <CustomLoader />;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <ul className={styles.navmenu}>
          <BackButton linkTo="/home" />
          <li className={styles.navtitle}>
            {currClass.name.length <= 10
              ? currClass.name.trim()
              : currClass.name.substring(0, 10) + " ..."}
          </li>
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
          <li className={styles.navitem}>
            <a
              id="communicate"
              className={currentModule == "communicate" ? styles.clicked : styles.navlink}
              onClick={() => setCurrentModule("communicate")}
            >
              Communicate
            </a>
          </li>
        </ul>
      </nav>
      {currentModule == "attendance" ? (
        <AttendanceComponent classId={classId} studentId={studentId} />
      ) : currentModule == "roster" ? (
        <Roster id={classId} />
      ) : currentModule == "modules" ? (
        <ClassModule enableEditing={user.role != "Student"} id={classId} />
      ) : (
        <Communicate id={classId} />
      )}
    </div>
  );
};

Class.requireAuth = true;

export default Class;
