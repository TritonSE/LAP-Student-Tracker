import React, { useState, useContext } from "react";
import { UserCalendar } from "../Calendar/UserCalendar";
import { AvailabilityModal } from "../ManageAvailabilityWizard/AvailabilityModal";
import styles from "./AdminHomePage.module.css"; //TODO change to user specific
import useSWR from "swr";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
import { APIContext } from "../../context/APIContext";
import { DateTime } from "luxon";
import { Availability } from "../../models/availability";

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
        {showManageAvailability ? 
        <AvailabilityModal 
          handleClose={handleClose} 
          userId = {userId}
        /> : null}
      </div>
      
      <UserCalendar userId={userId} />
    </div>

    
  );
};

export { UserHomePage };
