import React from "react";
import styles from "../../styles/components/ProfileViewRight.module.css";
import { ProfileInput } from "./ProfileInput";

type ProfileViewRightProps = {
  phoneNumber: string | null;
  email: string;
  role: string;
  disabled: boolean;
  errorMessage: string;
  handleEmailChange: (newEmail: string) => void;
  handlePhoneNumberChange: (newNumber: string) => void;
  handlePasswordChange: (newPassword: string) => void;
  handleConfirmPasswordChange: (confirmPassword: string) => void;
};

const ProfileViewRight: React.FC<ProfileViewRightProps> = ({
  phoneNumber,
  email,
  role,
  disabled,
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handlePhoneNumberChange,
  errorMessage,
}) => {
  return (
    <div className={styles.leftContainer}>
      <div className={styles.topTextPadding} />
      <div className={disabled ? styles.inputContainerDefault : styles.inputContainerWithPassword}>
        <div className={styles.spacing} />
        <ProfileInput
          label="Phone Number"
          defaultValue={phoneNumber}
          disabled={disabled}
          onContentChange={handlePhoneNumberChange}
        />
        <div className={styles.spacing} />
        <ProfileInput
          label="Email"
          defaultValue={email}
          disabled={disabled}
          onContentChange={handleEmailChange}
        />
        <div className={styles.spacing} />
        <ProfileInput label="Role" defaultValue={role} disabled={true} />
        {!disabled && (
          <div>
            <div className={styles.spacing} />
            <ProfileInput label="Password" defaultValue={role} disabled={true} password={true} />
            <div className={styles.spacing} />
            <ProfileInput
              label="New Password"
              defaultValue={role}
              disabled={disabled}
              password={true}
              onContentChange={handlePasswordChange}
            />
            <ProfileInput
              label="Confirm Password"
              defaultValue={role}
              disabled={disabled}
              onContentChange={handleConfirmPasswordChange}
              password={true}
            />
          </div>
        )}
      </div>

      <div className={styles.errorMessage}> {errorMessage} </div>

      {!disabled && (
        <div className={styles.buttonContainer}>
          <button className={styles.backButton}>
            <div className={styles.backText}>Back</div>
          </button>
          <button className={styles.signOutButton}>
            <div className={styles.signOutText}>Sign Out</div>
          </button>
        </div>
      )}
    </div>
  );
};

export { ProfileViewRight };
