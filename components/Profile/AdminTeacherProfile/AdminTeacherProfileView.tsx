import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileViewLeft } from "./ProfileViewLeft";
import { ProfileViewRight } from "./ProfileViewRight";
import styles from "../../../styles/components/AdminTeacherProfile.module.css";
import { Error } from "../../util/Error";
import { useRouter } from "next/router";

// component that renders the admin/teacher profile page 
const AdminTeacherProfileView: React.FC = () => {
  const { user, error, updateUser, clearError, logout } = useContext(AuthContext);

  // user will never be null, because if it is, client is redirected to login page
  if (user == null) return <Error />;

  const router = useRouter();
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
      const success = await updateUser(
        user.id,
        user.email,
        currentPassword,
        email,
        phoneNumber,
        newPassword
      );
      if (success) setEditProfileClicked(false);
    }
  };

  const onBackClick = (): void => {
    setPhoneNumber(user.phoneNumber);
    setEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    clearError();
    setErrorMessage("");
    setEditProfileClicked(false);
  };

  const onSignoutClick = (): void => {
    logout();
    router.push("/login");
  };

  const handleEmailChange = (newEmail: string): void => {
    setEmail(newEmail);
  };

  const handlePhoneNumberChange = (newNumber: string): void => {
    setPhoneNumber(newNumber);
  };

  const handleCurrentPasswordChange = (newVal: string): void => {
    setCurrentPassword(newVal);
  };

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
    phoneNumber === "" ||
    (phoneNumber != undefined &&
      !/[a-z]/i.test(phoneNumber) &&
      phoneRegEx.test(phoneNumber) &&
      !(phoneNumber.length > 11));
  const validPassword = newPassword === "" || newPassword.length > 6;
  const validConfirmPassword = newPassword === confirmPassword;
  const validToSave = validPhoneNumber && validPassword && validEmail && validConfirmPassword;



  useEffect(() => {
    clearError();
  }, []);
  useEffect(() => {
    setErrorMessage(error != null
      ? error.message
      : !validEmail
        ? "Enter a valid email"
        : !validPhoneNumber
          ? "Enter a valid phone number"
          : !validPassword
            ? "Passwords must be at least 6 characters"
            : !validConfirmPassword
              ? "Passwords do not match"
              : "");
  }, [validEmail, validPassword, validPhoneNumber, validConfirmPassword, error]);



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
              onBackClick={onBackClick}
              onSignoutClick={onSignoutClick}
            ></ProfileViewRight>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminTeacherProfileView };
