import React, { useState } from "react";
import { AdminCalendar } from "../Calendar/AdminCalendar";
import { CreateEventsWizard } from "../CreateEventsWizard/CreateEventsWizard";
import { AvailabilityModal } from "../ManageAvailabilityWizard/AvailabilityModal";
import styles from "./AdminHomePage.module.css";

const AdminHomePage: React.FC<object> = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showManageAvailability, setShowManageAvailability] = useState(false);

  const handleClose = (): void => {
    setShowWizard(false);
    setShowManageAvailability(false);
  };

  const availability = {
    "Mon" : [["7:00","8:15"], ["10:00", "12:00"]],
    "Tue" : [["8:00","9:15"], ["11:00", "11:15"]],
    "Wed" : [["9:00","10:15"]],
    "Thu" : [["10:00","13:45"]],
    "Fri" : [["11:00","14:45"]],
    "Sat" : [["12:00","15:45"]],

  }

  return (
    <div>
      <div className={styles.homeWrapper}>
        <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
          Create
          <img className={styles.addIcon} src="AddIcon.png" />
        </button>
        {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}

        <button className={styles.createBtn} onClick={() => setShowManageAvailability(true)}>
          Manage
          <img className={styles.addIcon} src="AddIcon.png" />
        </button>
        {showManageAvailability ? 
        <AvailabilityModal 
          handleClose={handleClose} 
          initAvailability={availability}
          initTimeZone={"Los Angeles"}
        /> : null}
      </div>
      <AdminCalendar/>;
    </div>
  );
};

export { AdminHomePage };
