import React from "react";
import { useRouter } from "next/router";
import styles from "./ClassView.module.css";

const BackButton: React.FC = () => {
    const router = useRouter();
    const onClick = () => {
        router.back();
    }
    return (
        <>
            <img src="back_button.png" onClick={onClick} alt="back" className={styles.backbutton}/>
        </>
    )
}

export const ClassViewMenu: React.FC = () => {
    const router = useRouter();
    const id = router.query.classid;

    return (
    <>
      <BackButton/>
      <nav className={styles.navbar}>
            <ul className={styles.navmenu}>
              <li className={styles.navitem}>
                <a
                  // href="/attendance"
                  className={router.pathname.includes("attendance") ? styles.clicked : styles.navlink}
                  onClick={() => { router.push("/class/" + id + "/attendance") }}
                >
                  Attendance
                </a>
              </li>

              <li className={styles.navitem}>
                <a
                  id="roster"
                  className={router.pathname.includes("roster") ? styles.clicked : styles.navlink}
                  onClick={ () => { router.push("/class/" + id + "/roster") }}
                >
                  Roster
                </a>
              </li>
              <li className={styles.navitem}>
                <a
                  id="modules"
                  className={router.pathname.includes("modules") ? styles.clicked : styles.navlink}
                  onClick={ () => { router.push("/class/" + id + "/modules") }}
                >
                  Modules
                </a>
              </li>
            </ul>
      </nav>
    </>
    )
}