import React, { useState } from "react";
import { UserCalendar } from "../Calendar/UserCalendar";
import { UserHomePageClassView } from "./UserHomePageClassView";

import styles from "./AdminHomePage.module.css";

type UserHomeProp = {
  userId: string;
};

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  const [showManageClasses, setshowManageClasses] = useState(false);
  return (
    <div>
      {showManageClasses ? (
        <button onClick={() => setshowManageClasses(false)}>
          <img className={styles.backarrow} src="BackArrow.png" />
        </button>
      ) : (
        <div>
          <div className={styles.homeWrapper}></div>
          <button className={styles.manageBtn} onClick={() => setshowManageClasses(true)}>
            {<div style={{ color: "white" }}>Manage Classes</div>}
          </button>
        </div>
      )}

      <div>
        {showManageClasses ? (
          <UserHomePageClassView userId={userId} />
        ) : (
          <UserCalendar userId={userId} />
        )}
      </div>
    </div>
  );
};

export { UserHomePage };
