import React, { useState } from "react";
import { AdminCalendar } from "../Calendar/AdminCalendar";
import { HomePageClassView } from "./HomePageClassView";
import { CreateEventsWizard } from "../CreateEventsWizard/CreateEventsWizard";
import styles from "./AdminHomePage.module.css";

const AdminHomePage: React.FC<object> = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showManageClasses, setshowManageClasses] = useState(false);

  const handleClose = (): void => {
    setShowWizard(false);
  };

  return (
    <div>
      {showManageClasses ? 
      <button onClick={() => setshowManageClasses(false)}>
      <img className={styles.backarrow} src="BackArrow.png" />
    </button>
      : 
      <div>
      <div className={styles.homeWrapper}>
        <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
          Create
          <img className={styles.addIcon} src="AddIcon.png" />
        </button>
        {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}
      </div>
      <button className={styles.manageBtn} onClick={() => setshowManageClasses(true)}>
      {<div style={{color: "white"}}>Manage Classes</div> }
    </button>
    </div>
      }
        
        {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}

      <div>
      { showManageClasses ? 
      
      
      <HomePageClassView/>: <AdminCalendar />}
      </div>
    </div>
  );
};

export { AdminHomePage };
