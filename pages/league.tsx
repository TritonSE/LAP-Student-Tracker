import React, { useState } from "react";
import styles from "../styles/League.module.css";
import { ClassView } from "../components/League/ClassView";
import { StudentView } from "../components/League/StudentView";
import { StaffView } from "../components/League/StaffView";
import { NextApplicationPage } from "./_app";
import { IncomingAccountRequests } from "../components/League/IncomingAccountRequests";

const allTabs = ["Classes", "Students", "Staff"] as const;
type Tab = typeof allTabs[number];

const League: NextApplicationPage = () => {
  const [display, setDisplay] = useState<Tab>(allTabs[0]);
  const [showRequests, setShowRequests] = useState<boolean>(false);

  // Functionality for income request button on staff view
  const onShowRequests = (): void => {
    setShowRequests(true);
  };

  const offShowRequests = (): void => {
    setShowRequests(false);
  };

  // Renders specific content component based on tab state
  const renderComponent = (display: string): JSX.Element | undefined => {
    if (display == "Classes") return <ClassView />;
    if (display == "Students") return <StudentView />;
    if (display == "Staff") return <StaffView onShowRequests={onShowRequests} />;
  };

  if (showRequests) {
    return <IncomingAccountRequests offShowRequests={offShowRequests} />;
  }

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

League.requireAuth = true;

export default League;
