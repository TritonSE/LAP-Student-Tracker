import React, { useEffect, useState } from "react";
import { AdminCalendar } from "./Calendar/AdminCalendar";
import { EventsView } from "./EventsView/EventsView";
import homePageStyles from "./OveralHomePage.module.css";
import { CreateOptions } from "./CreateOptions/CreateOptions";
import { CreateClassWizard } from "./CreateClassWizard/CreateClassWizard";
import { CreateEventWizard } from "./CreateEventWizard/CreateEventWizard";

const AdminHomePage: React.FC<object> = () => {
  const [showClassWizard, setShowClassWizard] = useState(false);
  const [showEventWizard, setShowEventWizard] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(true);

  const handleClose = (): void => {
    setShowClassWizard(false);
    setShowEventWizard(false);
  };

  useEffect(() => {
    setShowMainScreenButtons(!showManageClassesView);
  }, [showManageClassesView]);

  return (
    <div className={homePageStyles.homeWrapper}>
      {showMainScreenButtons && (
        <div>
          <div className={homePageStyles.buttonWrapper}>
            <div className={homePageStyles.createBtnWrapper}>
              <CreateOptions
                handleClickClass={setShowClassWizard}
                handleClickOneOffEvent={setShowEventWizard}
              />
            </div>
            <button
              className={homePageStyles.manageBtn}
              onClick={() => setShowManageClassesViewView(true)}
            >
              {<div style={{ color: "white" }}>Manage Classes</div>}
            </button>
          </div>
        </div>
      )}
      {showClassWizard ? <CreateClassWizard handleClose={handleClose} /> : null}
      {showEventWizard ? <CreateEventWizard handleClose={handleClose} /> : null}

      {showManageClassesView ? (
        <EventsView setShowEventsViewPage={setShowManageClassesViewView} />
      ) : (
        <AdminCalendar />
      )}
    </div>
  );
};

export { AdminHomePage };
