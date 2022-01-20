import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from '../styles/League.module.css';
import Classes from '../components/classes';
import Students from '../components/students';
import Staff from '../components/staff';
import { Class } from '../models/classes';
import ClassCard from '../components/ClassCard';

const allTabs = ['Classes', 'Students', 'Staff'] as const;
type Tab = (typeof allTabs)[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [content, setContent] = useState<Record<Tab, string[]> | null>(null);
  const testClass: Class = {
      id: 'class_id',
      name: 'CSE 123',
      level: 3,
      recurrence: [1,2,3],
      timeStart: 1,
      timeEnd: 2,
      //teachers:
  }

  useEffect(
    () => {
      // Eventually api call to get classes/students/staff...
      setContent({
        'Classes': ['Class 1', 'Class 2'],
        'Students': ['Student 1', 'Student 2'],
        'Staff': ['Staff 1', 'Staff 2'],
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
      <ClassCard class={testClass} />
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