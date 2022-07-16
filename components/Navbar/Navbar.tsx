import styles from "./Navbar.module.css";
import React from "react";
import { useRouter } from "next/router";

export const Navbar: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <>
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

              <li className={styles.navitem}>
                <a
                  className={router.pathname == "/league" ? styles.clicked : styles.navlink}
                  onClick={() => {
                    router.push("/league");
                  }}
                >
                  The League
                </a>
              </li>
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
    </>
  );
};
