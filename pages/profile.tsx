import type { NextPage } from "next";
import { useState } from "react";
import { ProfileViewLeft } from "../components/Profile/ProfileViewLeft";
import { ProfileViewRight } from "../components/Profile/ProfileViewRight";
import styles from "../styles/Profile.module.css";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextPage = () => {
  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>("8584851087");
  const [email, setEmail] = useState<string>("email");
  const [role, setRole] = useState<string>("role");


  // const toggleProfileEdit = () => {
  //   setEditProfileClicked(!editProfileClicked);
  // }

  const handleEditProfileClicked = () => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else setEditProfileClicked(false)
  }




  return (
    <div className={styles.rectangleContainer}>
      <div className={styles.rectangle}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <ProfileViewLeft firstName="Anshul" lastName="Birla" editProfileClicked={editProfileClicked} handleEditProfileClicked={handleEditProfileClicked}></ProfileViewLeft>
          </div>
          <div className={styles.rightContainer}>
            <ProfileViewRight email={email} role={role} phoneNumber={phoneNumber} disabled={!editProfileClicked}></ProfileViewRight>
          </div>
        </div>


      </div>
    </div >

  )
};
export default Profile;
