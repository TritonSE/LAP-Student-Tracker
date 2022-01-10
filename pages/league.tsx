import type { NextPage } from 'next';
import React, { useState } from 'react';
import styles from '../styles/League.module.css';

const League: NextPage = () => {
  const [display, setDisplay] = useState<"Classes" | "Students" | "Staff">("Classes");

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabs}>
        <button
          className={display === "Classes" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setDisplay("Classes")}
        >
          Classes
        </button>
        <button
          className={display === "Students" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setDisplay("Students")}
        >
          Students
        </button>
        <button
          className={display === "Staff" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setDisplay("Staff")}
        >
          Staff
        </button>
      </div>
      {display}
    </div>
  )
}

export default League;