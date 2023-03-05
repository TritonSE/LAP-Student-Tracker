import React, { useContext, useEffect, useState } from "react";
import { UserCalendar } from "./Calendar/UserCalendar";
import { AvailabilityModal } from "./ManageAvailabilityWizard/AvailabilityModal";
import homeStyles from "./OveralHomePage.module.css";
import { EventsView } from "./EventsView/EventsView";
import { AuthContext } from "../../context/AuthContext";
import { CustomError } from "../util/CustomError"; //TODO change to user specific

type UserHomePageProp = {
  userId: string;
};

/**
 * Displays the home page for a normal user, with additional content for teachers
 */
const UserHomePage: React.FC<UserHomePageProp> = ({ userId }) => {
  const { user } = useContext(AuthContext);

  if (user == null) return <CustomError />;

  const [showManageAvailability, setShowManageAvailability] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(false);

  useEffect(() => {
    setShowMainScreenButtons(!showManageClassesView);
  }, [showManageClassesView]);

  useEffect(() => {
    setShowMainScreenButtons(user.role === "Teacher");
  }, []);

  const handleClose = (): void => {
    setShowManageAvailability(false);
  };
  return (
    <div className={homeStyles.homeWrapper}>
      {showMainScreenButtons && (
        <div>
          <div className={homeStyles.buttonWrapper}>
            <div className={homeStyles.createBtnWrapper}>
              <button
                className={homeStyles.createBtn}
                onClick={() => setShowManageAvailability(true)}
              >
                Manage
                <img className={homeStyles.addIcon} src="/AddIcon.png" />
              </button>
            </div>
          </div>
        </div>
      )}
      {showManageAvailability ? (
        <AvailabilityModal handleClose={handleClose} userId={userId} />
      ) : null}
      {showManageClassesView ? (
        <EventsView setShowEventsViewPage={setShowManageClassesViewView} userId={userId} />
      ) : (
        <UserCalendar userId={userId} />
      )}
    </div>
  );
};

export { UserHomePage };
