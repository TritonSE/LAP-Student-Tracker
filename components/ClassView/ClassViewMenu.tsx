import React from "react";
import { useRouter } from "next/router";
import styles from "./ClassView.module.css";

const BackButton: React.FC = () => {
    const router = useRouter();
    const onClick = () => {
        router.push("/home");
    }
    return (
        <>
            <img src="back_button.svg" onClick={onClick} alt="back" className={styles.backbutton}/>
        </>
    )
}

export const ClassViewMenu: React.FC = () => {
    const router = useRouter();
    const id = router.query.classid;

    return (
      <nav className={styles.navbar}>
            <ul className={styles.navmenu}>
            <BackButton/>
              <li className={styles.navtitle}>
                Java 1-2: Cat
              </li>
              <li className={styles.navitem}>
                <a
                  // href="/attendance"
                  className={router.pathname.includes("attendance") ? styles.clicked : styles.navlink}
                  // onClick={() => { router.push("/class/" + id + "/attendance") }}
                  onClick={() => { router.push("/class/attendance") }}
                >
                  Attendance
                </a>
              </li>

              <li className={styles.navitem}>
                <a
                  id="roster"
                  className={router.pathname.includes("roster") ? styles.clicked : styles.navlink}
                  // onClick={ () => { router.push("/class/" + id + "/roster") }}
                  onClick={ () => { router.push("/class/roster") }}
                >
                  Roster
                </a>
              </li>
              <li className={styles.navitem}>
                <a
                  id="modules"
                  className={router.pathname.includes("modules") ? styles.clicked : styles.navlink}
                  // onClick={ () => { router.push("/class/" + id + "/modules") }}
                  onClick={ () => { router.push("/class/modules") }}
                >
                  Modules
                </a>
              </li>
            </ul>
      </nav>
    )
}