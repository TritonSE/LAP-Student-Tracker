import React, { useState } from "react";
import { CreateEventsWizard } from "./CreateEventsWizard";
import styles from "./AdminHomeView.module.css";

const AdminHomeView: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const handleClose = (): void => {
    setShowWizard(false);
  };

  return (
    <div className={styles.homeWrapper}>
      <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
        Create
        <img className={styles.addIcon} src="AddIcon.png" />
      </button>
      {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}
    </div>
  );
};

export { AdminHomeView };
