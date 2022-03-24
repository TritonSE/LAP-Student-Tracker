import React from "react"
import styles from "../../styles/components/ProfileViewLeft.module.css"

type ProfileViewLeftProps = {
  firstName: string,
  lastName: string,
  editProfileClicked: boolean
  handleEditProfileClicked: () => void
}

const ProfileViewLeft: React.FC<ProfileViewLeftProps> = ({ firstName, lastName, editProfileClicked, handleEditProfileClicked }) => {
  const onEditProfileClicked = () => handleEditProfileClicked();

  const buttonText = editProfileClicked ? "Save" : "Edit Profile"

  return (
    <div className={styles.rightContainer}>
      <div className={styles.circlePadding}></div>
      <div className={styles.circleContainer}>
        <div className={styles.circle}> </div>
      </div>
      <div className={styles.padding}></div>
      <div className={styles.name}> {firstName + " " + lastName}</div>
      <div className={styles.buttonPadding}></div>
      <div className={styles.center}>
        <button onClick={() => onEditProfileClicked()} className={styles.editButton}>{buttonText}</button>
      </div>
    </div>

  )



}

export { ProfileViewLeft }