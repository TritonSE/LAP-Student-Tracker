import React from "react";
import styles from "./ProfileViewLeft.module.css";
import {Loader} from "../../util/Loader";
import {ProfilePicture} from "./ProfilePicture";

type ProfileViewLeftProps = {
  firstName: string;
  lastName: string;
  image: File | null;
  editProfileClicked: boolean;
  validInput: boolean;
  imageLoading: boolean;
  onImageChange: (img: File) => void;
  handleEditProfileClicked: () => Promise<void>;
  onError: (errorMsg: string) => void;
};

// component for left hand side of the profile view. Display first and last names, as well as edit profile button
const ProfileViewLeft: React.FC<ProfileViewLeftProps> = ({
  firstName,
  lastName,
  image,
  imageLoading,
  editProfileClicked,
  validInput,
  onImageChange,
  handleEditProfileClicked,
    onError
}) => {
  const buttonText = editProfileClicked ? "Save" : "Edit Profile";

  return (
    <div className={styles.rightContainer}>
      <div className={styles.circlePadding}></div>
      {imageLoading ? (
        <Loader />
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
      <div className={styles.center}>
        <button
          disabled={!validInput}
          onClick={async () => await handleEditProfileClicked()}
          className={styles.editButton}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export { ProfileViewLeft };
