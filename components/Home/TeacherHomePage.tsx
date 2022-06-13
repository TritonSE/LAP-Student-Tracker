import React, {useEffect, useState} from "react";
import { UserCalendar } from "./Calendar/UserCalendar";
import { AvailabilityModal } from "./ManageAvailabilityWizard/AvailabilityModal";
import homeStyles from "./OveralHomePage.module.css"
import {EventsView} from "./EventsView/EventsView"; //TODO change to user specific

type TeacherHomeProp = {
  userId: string;
};

const TeacherHomePage: React.FC<TeacherHomeProp> = ({ userId }) => {
  const [showManageAvailability, setShowManageAvailability] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(true);


    useEffect( () => {
        setShowMainScreenButtons(!showManageClassesView);
    }, [showManageClassesView]);


  const handleClose = (): void => {
    setShowManageAvailability(false);
  };
  console.log(userId);
  return (
      <div className={homeStyles.homeWrapper}>
          {showMainScreenButtons && <div>
              <div className={homeStyles.buttonWrapper}>
                  <div className={homeStyles.createBtnWrapper}>
                      <button className={homeStyles.createBtn} onClick={() => setShowManageAvailability(true)}>
                          Manage
                          <img className={homeStyles.addIcon} src="/AddIcon.png" />
                      </button>
                  </div>
                  <button className={homeStyles.manageBtn} onClick={() => setShowManageClassesViewView(true)}>
                      {<div style={{ color: "white" }}>Manage Classes</div>}
                  </button>
              </div>
          </div> }
          { showManageAvailability ? <AvailabilityModal handleClose={handleClose} userId={userId}/> : null}
          { showManageClassesView ? <EventsView setShowEventsViewPage={setShowManageClassesViewView} userId={userId}/> : <UserCalendar userId={userId}/>}
      </div>

  );
};

export { TeacherHomePage };
