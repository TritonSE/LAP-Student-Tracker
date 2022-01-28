import styles from "../styles/Navbar.module.css";
import React from "react";
export const Navbar: React.FC = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <a className={styles.navlogo}>
            <img src="logo1.png"></img>
            <img src="logo2.png"></img>
          </a>

          <ul className={styles.navmenu}>
            <li className={styles.navitem}>
              <a
                /* 
            These are the 3 navbar buttons, we may want to add some conditional 
            statements here to say when the buttons are displayed and not, like in
            the signup page, where they shouldn't be displayed
            */
                href="home"
                className={styles.navlink}
              >
                Home
              </a>
            </li>
            <li className={styles.navitem}>
              <a href="league" className={styles.navlink}>
                The League
              </a>
            </li>
            <li className={styles.navitem}>
              <a href="profile" className={styles.navlink}>
                Profile
              </a>
            </li>
          </ul>
          <button className={styles.none}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </nav>
      </header>
      {children}
    </>
  );
};
