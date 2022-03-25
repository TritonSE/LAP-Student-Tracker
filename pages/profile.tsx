import type { NextPage } from "next";
import { useState } from "react";
import { ProfileViewLeft } from "../components/Profile/ProfileViewLeft";
import { ProfileViewRight } from "../components/Profile/ProfileViewRight";
import styles from "../styles/Profile.module.css";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextPage = () => {
  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("email@ucsd.edu");
  const [role, _] = useState<string>("role");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEditProfileClicked = () => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else
      setEditProfileClicked(false)
  }

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  }

  const handlePhoneNumberChange = (newNumber: string) => {
    setPhoneNumber(newNumber);
  }

  const handleNewPassword = (newPassword: string) => {
    setNewPassword(newPassword)
  }

  const handleConfirmPassword = (confirmPassword: string) => {
    setConfirmPassword(confirmPassword)
  }




  //^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
  const regEx = RegExp(/\S+@\S+\.\S+/);
  const validEmail = regEx.test(email);

  const phoneRegEx = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
  const validPhoneNumber = phoneNumber === null || phoneNumber == "" || !/[a-z]/i.test(phoneNumber) && phoneRegEx.test(phoneNumber) && !(phoneNumber.length > 11);
  const validPassword = newPassword === "" || newPassword.length > 6;
  const validConfirmPassword = newPassword === confirmPassword;


  const validToSave = validPhoneNumber && validPassword && validEmail && validConfirmPassword;

  const errorMessage = !validEmail ? "Enter a valid email" : !validPhoneNumber ? "Enter a valid phone number" : !validPassword ? "Passwords must be at least 6 characters" : !validConfirmPassword ? "Passwords do not match" : "";

  return (
    <div className={styles.rectangleContainer}>
      <div className={styles.rectangle}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <ProfileViewLeft firstName="Anshul" lastName="Birla" editProfileClicked={editProfileClicked} handleEditProfileClicked={handleEditProfileClicked} validInput={validToSave}></ProfileViewLeft>
          </div>
          <div className={styles.rightContainer}>
            <ProfileViewRight email={email} role={role} phoneNumber={phoneNumber} disabled={!editProfileClicked} errorMessage={errorMessage} handleEmailChange={handleEmailChange} handleConfirmPasswordChange={handleConfirmPassword} handlePasswordChange={handleNewPassword} handlePhoneNumberChange={handlePhoneNumberChange} ></ProfileViewRight>
          </div>
        </div>


      </div>
    </div >

  )
};
export default Profile;
