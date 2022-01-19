import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from '../styles/League.module.css';
import Classes from '../components/classes';
import Students from '../components/students';
import Staff from '../components/staff';
import { render } from '@testing-library/react';

const allTabs = ['Classes', 'Students', 'Staff'] as const;
type Tab = (typeof allTabs)[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [content, setContent] = useState<Record<Tab, string[]> | null>(null);

  useEffect(
    () => {
      // Eventually api call to get classes/students/staff...
      setContent({
        'Classes': ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',],
        'Students': ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10'],
        'Staff': ['Staff 1', 'Staff 2', 'Staff 3', 'Staff 4', 'Staff 5', 'Staff 6', 'Staff 7', 'Staff 8', 'Staff 9', 'Staff 10'],
      })
    },
    []);

  // Renders specific component based on state
  const renderComponent = (display: String) => {
    if (display == 'Classes') return <Classes classes={content?.Classes}/>
    if (display == 'Students') return <Students students={content?.Students}/>
    if (display == 'Staff') return <Staff staff={content?.Staff}/>
  }

  return (
    <>
      <div className={styles.tabsContainer}>
        {/* Render Classes, Students, Staff tabs */}
        <div className={styles.tabs}>
          {allTabs.map((tabName) => {
            return (
              <button key="{tabName}"
                className={display === tabName ? styles.activeTab : styles.inactiveTab}
                onClick={() => setDisplay(tabName)}
              >
                {tabName}
              </button>)
          })}
        </div>
      </div>

      {renderComponent(display)}
    </>

  )
}

export default League;