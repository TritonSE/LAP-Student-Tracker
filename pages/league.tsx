import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from '../styles/League.module.css';

const allTabs = ['Classes', 'Students', 'Staff'] as const;
type Tab = (typeof allTabs)[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [content, setContent] = useState<Record<Tab, string[]> | null>(null);

  useEffect(
    () => {
      // eventually api call to get classes/students/staff...
      setContent({
        'Classes': ['Class 1', 'Class 2'],
        'Students': ['Student 1', 'Student 2'],
        'Staff': ['Staff 1', 'Staff 2'],
      })
    },
    []);

  return (
    <>
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
      </div>

      <h1>{display}</h1>
      {content ? content[display].map((item) => <li>{item}</li>) : null}
    </>

  )
}

export default League;