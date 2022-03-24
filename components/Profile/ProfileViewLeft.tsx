import React from "react"
import styles from "../../styles/components/ProfileViewLeft.module.css"

type ProfileViewLeftProps = {
  firstName: string,
  lastName: string,
  handleEditProfileClicked: () => void
}

const ProfileViewLeft: React.FC<ProfileViewLeftProps> = ({ firstName, lastName, handleEditProfileClicked }) => {
  const onEditProfileClicked = () => handleEditProfileClicked();

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
        <button onClick={() => onEditProfileClicked()} className={styles.editButton}>Edit Profile</button>
      </div>
    </div>

  )



}

export { ProfileViewLeft }