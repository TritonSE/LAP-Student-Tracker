import React from "react";
import { TextField } from '@mui/material';
import styles from "../../styles/components/ProfileViewRight.module.css"
import { ProfileInput } from "./ProfileInput";

type ProfileViewRightProps = {
  phoneNumber: string | null,
  email: string,
  role: string,
  disabled: boolean
}



const ProfileViewRight: React.FC<ProfileViewRightProps> = ({ phoneNumber, email, role, disabled }) => {
  return (
    <div className={styles.leftContainer}>
      <div className={styles.topTextPadding} />
      <div className={styles.inputContainer}>
        <div className={styles.spacing} />
        <ProfileInput label="Phone Number" defaultValue={phoneNumber} disabled={disabled} />
        <div className={styles.spacing} />
        <ProfileInput label="Email" defaultValue={email} disabled={disabled} />
        <div className={styles.spacing} />
        <ProfileInput label="Role" defaultValue={role} disabled={disabled} />
        <div className={styles.spacing} />
        <ProfileInput label="Role" defaultValue={role} disabled={disabled} />
        <div className={styles.spacing} />
        <ProfileInput label="Role" defaultValue={role} disabled={disabled} />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backButton}>
          <div className={styles.backText}>Back</div>
        </button>
        <button className={styles.signOutButton}>
          <div className={styles.signOutText}>Sign Out</div>
        </button>
      </div>
    </div>




  )
}

export { ProfileViewRight }