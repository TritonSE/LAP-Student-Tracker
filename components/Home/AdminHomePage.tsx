import React, { useState } from "react";
import { AdminCalendar } from "./Calendar/AdminCalendar";
import { CreateClassWizard } from "./CreateClassWizard/CreateClassWizard";
import styles from "./AdminHomePage.module.css";

const AdminHomePage: React.FC<object> = () => {
  const [showWizard, setShowWizard] = useState(false);

  const handleClose = (): void => {
    setShowWizard(false);
  };

  return (
    <div>
      <div className={styles.homeWrapper}>
        <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
          Create
          <img className={styles.addIcon} src="/AddIcon.png" />
        </button>
        {showWizard ? <CreateClassWizard handleClose={handleClose} /> : null}
      </div>
      <AdminCalendar />;
    </div>
  );
};

export { AdminHomePage };
