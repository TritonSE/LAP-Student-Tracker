import React, { useContext } from "react";
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

const BackButton: React.FC = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/home");
  };
  return (
    <>
      <img src="back_button.svg" onClick={onClick} alt="back" className={styles.backbutton} />
    </>
  );
};

const Class: NextApplicationPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { classid } = router.query;
  const client = useContext(APIContext);
  console.log(typeof classid);
  const { data: currClass, error } = useSWR("/api/class" + classid, () => client.getClass(classid));

  const [attendance, setAttendance] = React.useState(false);
  const [roster, setRoster] = React.useState(false);
  const [modules, setModules] = React.useState(false);

  const handleUpdate = (name: string): void => {
    if (name == "attendance") {
      setAttendance(true);
      setRoster(false);
      setModules(false);
    } else if (name == "roster") {
      setAttendance(false);
      setRoster(true);
      setModules(false);
    } else if (name == "modules") {
      setAttendance(false);
      setRoster(false);
      setModules(true);
    }
  };

  if (user == null) return <Error />;
  if (currClass == null) return <Error />;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <ul className={styles.navmenu}>
          <li className={styles.navtitle}>{currClass.name}</li>
          <li className={styles.navitem}>
            <a
              className={attendance ? styles.clicked : styles.navlink}
              onClick={() => handleUpdate("attendance")}
            >
              Attendance
            </a>
          </li>

          <li className={styles.navitem}>
            <a
              id="roster"
              className={roster ? styles.clicked : styles.navlink}
              onClick={() => handleUpdate("roster")}
            >
              Roster
            </a>
          </li>
          <li className={styles.navitem}>
            <a
              id="modules"
              className={modules ? styles.clicked : styles.navlink}
              onClick={() => handleUpdate("modules")}
            >
              Modules
            </a>
          </li>
        </ul>
      </nav>
      {roster && <Roster />}
      {attendance && <Attendance />}
      {modules && <Module />}
    </div>
  );
};

export default Class;
