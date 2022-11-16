import React, { useEffect, useState } from "react";
import { AdminCalendar } from "./Calendar/AdminCalendar";
import { EventsView } from "./EventsView/EventsView";
import homePageStyles from "./OveralHomePage.module.css";
import { CreateClassWizard } from "./CreateClassWizard/CreateClassWizard";
import { CreateOptions } from "./CreateOptions/CreateOptions";

const AdminHomePage: React.FC<object> = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(true);

  const handleClose = (): void => {
    setShowWizard(false);
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
              <CreateOptions />
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
      {showWizard ? <CreateClassWizard handleClose={handleClose} /> : null}

      {showManageClassesView ? (
        <EventsView setShowEventsViewPage={setShowManageClassesViewView} />
      ) : (
        <AdminCalendar />
      )}
    </div>
  );
};

export { AdminHomePage };
