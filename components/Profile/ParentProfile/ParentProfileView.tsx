import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./ParentProfileView.module.css";
import { CustomError } from "../../util/CustomError";
import { APIContext } from "../../../context/APIContext";
import { User } from "../../../models/";
import { ParentEditProfilePanel } from "./ParentEditProfilePanel";

// component that renders the admin/teacher profile page
type ParentProfileViewProps = {
  otherUser?: User; // if we need to display a user that is not the logged in one, pass the details here
};
const ParentProfileView: React.FC<ParentProfileViewProps> = ({ otherUser }) => {
  const authState = useContext(AuthContext);
  const { user: loggedInUser } = authState;

  const api = useContext(APIContext);

  // user will never be null, because if it is, client is redirected to login page
  if (loggedInUser == null) return <CustomError />;

  return (
    <div className={styles.rectangleContainer}>
      <div className={styles.rectangle}>
        <div className={styles.contentContainer}>
          <div className={styles.leftPanel}>
            <ParentEditProfilePanel
              loggedInUser={otherUser ? otherUser : loggedInUser}
              authState={authState}
              leagueAPI={api}
              customUser={otherUser == undefined}
            ></ParentEditProfilePanel>
          </div>
          <div className={styles.middlePanel}></div>
          <div className={styles.rightPanel}></div>
        </div>
      </div>
    </div>
  );
};

export { ParentProfileView };
