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
        {showManageAvailability ? (
          <AvailabilityModal
            handleClose={handleClose}
            initAvailability={availability}
            initTimeZone={"Los Angeles"}
          />
        ) : null}
      </div>
      <AdminCalendar />;
    </div>
  );
};

export { AdminHomePage };
