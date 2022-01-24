import styles from "../styles/Navbar.module.css";
import type { NextPage } from 'next'
export const Navbar: NextPage = ({children})=>{
    return <> 
          <header className={styles.header}>
        <nav className={styles.navbar}>
            <a className={styles.navlogo}><img src="logo1.png"></img><img src="logo2.png"></img></a>

          <ul className={styles.navmenu}>
            <li className={styles.navitem}>
                <a 
                href= "home"
                className={styles.navlink}>Home</a>
            </li>
            <li className={styles.navitem}>
                <a 
                href= "league"
                className={styles.navlink}>The League</a>
       
            </li>
            <li className={styles.navitem}>
                <a 
                href= "profile"
                className={styles.navlink}>Profile</a>
      
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
}