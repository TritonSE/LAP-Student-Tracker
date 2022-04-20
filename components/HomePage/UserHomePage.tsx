import React, { useState, useContext } from "react";
import { UserCalendar } from "../Calendar/UserCalendar";
import { AvailabilityModal } from "../ManageAvailabilityWizard/AvailabilityModal";
import styles from "./AdminHomePage.module.css"; //TODO change to user specific
import useSWR from "swr";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
import { APIContext } from "../../context/APIContext";

type UserHomeProp = {
  userId: string;
};

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  const [showManageAvailability, setShowManageAvailability] = useState(false);
  const client = useContext(APIContext);
  const { data, mutate, error } = useSWR(`api/availability/${userId}`, () => client.getAvailabilities(userId));
  if (error) return <Error />;
  if (!data) return <Loader />;

  const handleClose = (): void => {
    setShowManageAvailability(false);
  };

  const availability = {
    "Mon": (data.mon == null) ? [] : data.mon,
    "Tue": (data.tue == null) ? [] : data.tue,
    "Wed": (data.wed == null) ? [] : data.wed,
    "Thu": (data.thu == null) ? [] : data.thu,
    "Fri": (data.fri == null) ? [] : data.fri,
    "Sat": (data.sat == null) ? [] : data.sat,
  }
  const timeZone = data.timeZone

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
          initAvailability={availability}
          initTimeZone={timeZone}
          userId = {userId}
          mutate = {mutate}
        /> : null}
      </div>
      
      <UserCalendar userId={userId} />
    </div>

    
  );
};

export { UserHomePage };
