import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "../styles/League.module.css";
import { ClassView } from "../components/ClassView";
import { StudentView } from "../components/StudentView";
import { StaffView } from "../components/StaffView";
import { Class } from "../models/class";
import { User } from "../models/users";
import { Student } from "../models/students";
import { RRule, RRuleSet, rrulestr } from "rrule";


const allTabs = ["Classes", "Students", "Staff"] as const;
type Tab = typeof allTabs[number];

const League: NextPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [content, setContent] = useState<{
    Classes: Class[];
    Students: Student[];
    Staff: User[];
  }>({
    Classes: [],
    Students: [],
    Staff: [],
  });

  // start dummy data, delete once api is implemented
  const testClass: Class = {
    eventInformationId: "class_id",
    minLevel: 3,
    maxLevel: 5,
    rrstring:
      "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
    startTime: "08:34:00+00",
    endTime: "09:34:00+00",
    language: "java"
  };
  const testStudent: Student = {
    id: "student_id",
    firstName: "Gary",
    lastName: "Gillespie",
    email: "garyg@ucsd.edu",
    role: "Student",
    phoneNumber: "(123) 456-7890",
    address: "123",
    level: 3,
    classes: ["CSE 123"],
  };
  const testClassArray: Class[] = Array(25).fill(testClass);
  const testStudentArray: Student[] = Array(5).fill(testStudent);
  // end dummy data

  useEffect(() => {
    // Eventually api call to get classes/students/staff...
    // Use dummy data for now

    setContent({
      Classes: testClassArray,
      Students: testStudentArray,
      Staff: [],
    });
  }, []);

  // Renders specific content component based on tab state
  const renderComponent = (display: string): JSX.Element | undefined => {
    if (display == "Classes") return <ClassView classes={content.Classes} />;
    if (display == "Students") return <StudentView students={content.Students} />;
    if (display == "Staff") return <StaffView />;
  };

  return (
    <>
      <div className={styles.tabsContainer}>
        {/* Render Classes, Students, Staff tabs */}
        <div className={styles.tabs}>
          {allTabs.map((tabName, idx) => {
            return (
              <div className={styles.tabWrapper} key={tabName}>
                <button
                  key={tabName}
                  className={`${styles.tabButton} ${
                    display === tabName ? styles.activeTab : styles.inactiveTab
                  }`}
                  onClick={() => setDisplay(tabName)}
                >
                  {tabName}
                </button>
                {idx !== allTabs.length - 1 ? <div className={styles.verticalLine} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Render tab content */}
      {renderComponent(display)}
    </>
  );
};

export default League;
