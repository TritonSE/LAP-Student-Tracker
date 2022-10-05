import styles from "./Navbar.module.css";
import React, {useContext} from "react";
import { useRouter } from "next/router";
import {AuthContext} from "../../context/AuthContext";


export const Navbar: React.FC = ({ children }) => {
  const router = useRouter();
  // let authUser = null;
  // try {
    const {user} = useContext(AuthContext);
  //   authUser = user;
  // } catch {
  //   return null;
  // }

  if (user == null) return null;
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <a className={styles.navlogo}>
          <img src="logo1.png"></img>
          <img src="logo2.png"></img>
        </a>
        <div>
          <div>
            <ul className={styles.navmenu}>
              <li className={styles.navitem}>
                <a
                  /* 
          These are the 3 navbar buttons, we may want to add some conditional 
          statements here to say when the buttons are displayed and not, like in
          the signup page, where they shouldn't be displayed
          */

                  className={router.pathname == "/home" ? styles.clicked : styles.navlink}
                  onClick={() => {
                    router.push("/home");
                  }}
                >
                  Home
                </a>
              </li>

                { user.role != "Student" ? <li className={styles.navitem}>
                <a
                  className={router.pathname == "/league" ? styles.clicked : styles.navlink}
                  onClick={() => {
                    router.push("/league");
                  }}
                >
                  The League
                </a>
              </li> : null }
              <li className={styles.navitem}>
                <a
                  className={router.pathname == "/profile" ? styles.clicked : styles.navlink}
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};
