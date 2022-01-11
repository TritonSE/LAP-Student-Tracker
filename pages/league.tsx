import type { NextPage } from 'next';
import React, { useState } from 'react';
import styles from '../styles/League.module.css';

const allTabs = ['Classes', 'Students', 'Staff'] as const;
type Tab = (typeof allTabs)[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);

  return (
    <div className={styles.tabContainer}>
      {/* Render Classes, Students, Staff tabs */}
      <div className={styles.tabs}>
        {allTabs.map((tabName) => {
          return (
            <button
              className={display === tabName ? styles.activeTab : styles.inactiveTab}
              onClick={() => setDisplay(tabName)}
            >
              {tabName}
            </button>)
        })}
      </div>

      {display}
    </div>
  )
}

export default League;