import React, { useContext, useState } from "react";
import type { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/class.module.css";
import { Roster } from "../../components/SingleClassView/Roster/Roster";
import { useRouter } from "next/router";
import { APIContext } from "../../context/APIContext";
import { BackButton } from "../../components/util/BackButton";
import { CustomError } from "../../components/util/CustomError";
import useSWR from "swr";
import { CustomLoader } from "../../components/util/CustomLoader";
import { AttendanceComponent } from "../../components/SingleClassView/Attendance/AttendanceComponent";
import { ClassModule } from "../../components/SingleClassView/Module/ClassModule";

const Class: NextApplicationPage = () => {
  const router = useRouter();
  const client = useContext(APIContext);

  const { user } = useContext(AuthContext);
  const classId = router.query.classId as string;
  const { data: currClass } = useSWR("/api/class" + classId, () => client.getClass(classId));

  const [currentModule, setCurrentModule] = useState<string>("roster");

  if (user == null) return <CustomError />;
  if (currClass == null) return <CustomLoader />;

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
        <AttendanceComponent classId={classId} />
      ) : currentModule == "roster" ? (
        <Roster id={classId} />
      ) : (
        <ClassModule enableEditing={user.role == "Student" ? false : true} id={classId} />
      )}
    </div>
  );
};

Class.requireAuth = true;

export default Class;
