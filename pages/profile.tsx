import React, { useContext, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { ProfileViewLeft } from "../components/Profile/ProfileViewLeft";
import { ProfileViewRight } from "../components/Profile/ProfileViewRight";
import { APIContext } from "../context/APIContext";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Profile.module.css";
import { NextApplicationPage } from "./_app";
import { Error } from "../components/util/Error";
import { Loader } from "../components/util/Loader";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextApplicationPage = () => {

  const { user, error, updateUser, getError, clearError } = useContext(AuthContext);

  if (user == null) return <Error />

  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined | null>(user.phoneNumber);
  const [email, setEmail] = useState<string>(user.email);
  const [role, _] = useState<string>(user.role);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEditProfileClicked = async (): Promise<void> => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else {
      clearError();
      setErrorMessage("");
      await updateUser(user.id, user.email, currentPassword, email, phoneNumber, newPassword)
      setEditProfileClicked(false);
      // const error = getError();
      // if (error == null)

    }
  };

  const handleEmailChange = (newEmail: string): void => {
    setEmail(newEmail);
  };

  const handlePhoneNumberChange = (newNumber: string): void => {
    setPhoneNumber(newNumber);
  };

  const handleCurrentPasswordChange = (newVal: string): void => {
    setCurrentPassword(newVal)
  }

  const handleNewPassword = (newPassword: string): void => {
    setNewPassword(newPassword);
  };

  const handleConfirmPassword = (confirmPassword: string): void => {
    setConfirmPassword(confirmPassword);
  };


  const regEx = RegExp(/\S+@\S+\.\S+/);
  const validEmail = regEx.test(email);
  const phoneRegEx = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  const validPhoneNumber =
    phoneNumber === null ||
    phoneNumber === "" || phoneNumber != undefined &&
    (!/[a-z]/i.test(phoneNumber) && phoneRegEx.test(phoneNumber) && !(phoneNumber.length > 11));
  const validPassword = newPassword === "" || newPassword.length > 6;
  const validConfirmPassword = newPassword === confirmPassword;
  const validToSave = validPhoneNumber && validPassword && validEmail && validConfirmPassword;

  useEffect(() => {
    const tempMessage = error != null ? error.message : !validEmail
      ? "Enter a valid email"
      : !validPhoneNumber
        ? "Enter a valid phone number"
        : !validPassword
          ? "Passwords must be at least 6 characters"
          : !validConfirmPassword
            ? "Passwords do not match"
            : "";
    setErrorMessage(tempMessage)
  }, [validEmail, validPassword, validPhoneNumber, validConfirmPassword, error])

  // const errorMessage = !validEmail
  //   ? "Enter a valid email"
  //   : !validPhoneNumber
  //     ? "Enter a valid phone number"
  //     : !validPassword
  //       ? "Passwords must be at least 6 characters"
  //       : !validConfirmPassword
  //         ? "Passwords do not match"
  //         : "";

  return (
    <div className={styles.rectangleContainer}>
      <div className={styles.rectangle}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <ProfileViewLeft
              firstName="Anshul"
              lastName="Birla"
              editProfileClicked={editProfileClicked}
              handleEditProfileClicked={handleEditProfileClicked}
              validInput={validToSave}
            ></ProfileViewLeft>
          </div>
          <div className={styles.rightContainer}>
            <ProfileViewRight
              email={email}
              role={role}
              phoneNumber={phoneNumber}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              disabled={!editProfileClicked}
              errorMessage={errorMessage}
              handleEmailChange={handleEmailChange}
              handleCurrentPasswordChange={handleCurrentPasswordChange}
              handleConfirmPasswordChange={handleConfirmPassword}
              handlePasswordChange={handleNewPassword}
              handlePhoneNumberChange={handlePhoneNumberChange}
            ></ProfileViewRight>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.requireAuth = true;

export default Profile;
