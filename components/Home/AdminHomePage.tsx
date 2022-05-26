import React, {useEffect, useState} from "react";
import { AdminCalendar } from "./Calendar/AdminCalendar";
import { EventsView } from "./EventsView";
import styles from "./AdminHomePage.module.css";
import {CreateClassWizard} from "./CreateClassWizard/CreateClassWizard";

const AdminHomePage: React.FC<object> = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(true);

  const handleClose = (): void => {
    setShowWizard(false);
  };


  useEffect( () => {
    setShowMainScreenButtons(!showManageClassesView);
  }, [showManageClassesView]);


  return (
    <div>
      {showMainScreenButtons && <div>
          <div className={styles.homeWrapper}>
            <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
              Create
              <img className={styles.addIcon} src="AddIcon.png" />
            </button>
            {showWizard ? <CreateClassWizard handleClose={handleClose} /> : null}
          </div>
          <button className={styles.manageBtn} onClick={() => setShowManageClassesViewView(true)}>
            {<div style={{ color: "white" }}>Manage Classes</div>}
          </button>
        </div> }
      {showWizard ? <CreateClassWizard handleClose={handleClose} /> : null}

      <div>{showManageClassesView ? <EventsView setShowEventsViewPage={setShowManageClassesViewView}/> : <AdminCalendar />}</div>
    </div>
  );
};

export { AdminHomePage };
