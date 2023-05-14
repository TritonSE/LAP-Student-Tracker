import React, {useState} from "react";
import styles from "./ProfileViewLeft.module.css";
import { CustomLoader } from "../../util/CustomLoader";
import { ProfilePicture } from "./ProfilePicture";
import { Button } from "@mui/material";
import {Roles, VolunteerResponse} from "../../../models";
import {VolunteerResponsesView} from "../VolunteerResponses/VolunteerResponses";

type ProfileViewLeftProps = {
  firstName: string;
  lastName: string;
  image: File | null;
  editProfileClicked: boolean;
  validInput: boolean;
  imageLoading: boolean;
  editable: boolean;
  onImageChange: (img: File) => void;
  handleEditProfileClicked: () => Promise<void>;
  onError: (errorMsg: string) => void;
  id: string
  role: Roles
};

// component for left hand side of the profile view. Display first and last names, as well as edit profile button
const ProfileViewLeft: React.FC<ProfileViewLeftProps> = ({
  firstName,
  lastName,
  image,
  imageLoading,
  editProfileClicked,
  validInput,
  editable,
  onImageChange,
  handleEditProfileClicked,
  onError,
    id,
    role,
}) => {
  const buttonText = editProfileClicked ? "Save" : "Edit Profile";

  const [showResponses, setShowResponses] = useState(false);

  const closeResponsesView = () => {
    setShowResponses(false)
  }

  return (
    <div className={styles.rightContainer}>
      <div className={styles.circlePadding}></div>
      {imageLoading ? (
        <CustomLoader />
      ) : (
        <ProfilePicture
          profileEditable={editProfileClicked}
          onImageChange={onImageChange}
          firstName={firstName}
          lastName={lastName}
          image={image}
          onError={onError}
        />
      )}
      <div className={styles.padding}></div>
      <div className={styles.name}> {firstName + " " + lastName}</div>
      <div className={styles.buttonPadding}></div>
      {editable ? (
        <div className={styles.center}>
          <Button
            disabled={!validInput}
            variant="contained"
            onClick={async () => await handleEditProfileClicked()}
            className={styles.editButton}
          >
            {" "}
            {buttonText}
          </Button>
        </div>
      ): role == "Volunteer" ?  <div className={styles.center}> <Button
          variant="contained"
          onClick={ () => setShowResponses(true)}
          className={styles.editButton}
      >
        View Responses
      </Button> </div> : null}
      {showResponses ? <VolunteerResponsesView id={id} open={showResponses} handleClose={closeResponsesView}/> : null}
    </div>
  );
};

export { ProfileViewLeft };
