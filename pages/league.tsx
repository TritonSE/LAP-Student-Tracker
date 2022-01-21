import { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from '../styles/League.module.css';
import Classes from '../components/classes';
import Students from '../components/students';
import Staff from '../components/staff';
import { Class } from '../models/classes';
import { User, Student } from '../models/users';

const allTabs = ['Classes', 'Students', 'Staff'] as const;
type Tab = (typeof allTabs)[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [content, setContent] = useState<{
    'Classes': Class[],
    'Students': Student[],
    'Staff': User[],
  }>({
    'Classes': [],
    'Students': [],
    'Staff': [],
  });

  // start dummy data, delete once api is implemented
  const testStaff: User = {
    id: 'staff_id',
    first_name: 'Rick',
    last_name: 'Ord',
    email: 'ricko@ucsd.edu',
    role: 'Teacher',
    phone_number: '(123) 456-7890',
    address: '123',
  }
  const testClass: Class = {
      id: 'class_id',
      name: 'CSE 123',
      level: 3,
      recurrence: [1,2,3],
      timeStart: "13:00",
      timeEnd: "14:00",
      teachers: [testStaff]
  }
  const testStudent: Student = {
    id: 'student_id',
    first_name: 'Gary',
    last_name: 'Gillespie',
    email: 'garyg@ucsd.edu',
    role: 'Student',
    phone_number: '(123) 456-7890',
    address: '123',
    level: 3,
  }
  const testStaffArray: User[] = Array(5).fill(testStaff);
  const testClassArray: Class[] = Array(5).fill(testClass);
  const testStudentArray: Student[] = Array(5).fill(testStudent);
  // end dummy data

  useEffect(
    () => {
      // Eventually api call to get classes/students/staff...
      // Use dummy data for now
      setContent({
        'Classes': testClassArray,
        'Students': testStudentArray,
        'Staff': testStaffArray,
      })
    },
    []);

  // Renders specific content component based on tab state
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
              <button key={tabName}
                className={display === tabName ? styles.activeTab : styles.inactiveTab}
                onClick={() => setDisplay(tabName)}
              >
                {tabName}
              </button>)
          })}
        </div>
      </div>

      {/* Render tab content */}
      {renderComponent(display)}
    </>

  )
}

export default League;