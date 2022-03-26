import React, { useContext, useState } from "react";
import useSWR from "swr";
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

  const { user } = useContext(AuthContext);

  if (user == null) return <Error />

  const client = useContext(APIContext);

  const { data, error } = useSWR("/api/users/[id]", () => client.getUser(user.id))

  if (error) return <Error />;
  if (!data) return <Loader />;


  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(data.phoneNumber ? data.phoneNumber : null);
  const [email, setEmail] = useState<string>(data.email);
  const [role, _] = useState<string>(data.role);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEditProfileClicked = (): void => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else setEditProfileClicked(false);
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

  // const handleSaveClick = ()

  const regEx = RegExp(/\S+@\S+\.\S+/);
  const validEmail = regEx.test(email);
  const phoneRegEx = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  const validPhoneNumber =
    phoneNumber === null ||
    phoneNumber == "" ||
    (!/[a-z]/i.test(phoneNumber) && phoneRegEx.test(phoneNumber) && !(phoneNumber.length > 11));
  const validPassword = newPassword === "" || newPassword.length > 6;
  const validConfirmPassword = newPassword === confirmPassword;
  const validToSave = validPhoneNumber && validPassword && validEmail && validConfirmPassword;

  const errorMessage = !validEmail
    ? "Enter a valid email"
    : !validPhoneNumber
      ? "Enter a valid phone number"
      : !validPassword
        ? "Passwords must be at least 6 characters"
        : !validConfirmPassword
          ? "Passwords do not match"
          : "";

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
