import React, { useState } from "react";
import { UserCalendar } from "../Calendar/UserCalendar";
import { AvailabilityModal } from "../ManageAvailabilityWizard/AvailabilityModal";
import styles from "./AdminHomePage.module.css"; //TODO change to user specific

type UserHomeProp = {
  userId: string;
};

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  const [showManageAvailability, setShowManageAvailability] = useState(false);

  const handleClose = (): void => {
    setShowManageAvailability(false);
  };

  return (
    <div>
      <div className={styles.homeWrapper}>
        <button className={styles.createBtn} onClick={() => setShowManageAvailability(true)}>
          Manage
          <img className={styles.addIcon} src="AddIcon.png" />
        </button>
        {showManageAvailability ? (
          <AvailabilityModal handleClose={handleClose} userId={userId} />
        ) : null}
      </div>

      <UserCalendar userId={userId} />
    </div>
  );
};

export { UserHomePage };
