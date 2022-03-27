import React from "react";
import styles from "./ProfileViewRight.module.css";
import { ProfileInput } from "./ProfileInput";

type ProfileViewRightProps = {
  phoneNumber: string | null | undefined;
  email: string;
  role: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  disabled: boolean;
  errorMessage: string;
  // functions that handle updating states of their respective variables
  handleEmailChange: (newEmail: string) => void;
  handlePhoneNumberChange: (newNumber: string) => void;
  handleCurrentPasswordChange: (newVal: string) => void;
  handlePasswordChange: (newPassword: string) => void;
  handleConfirmPasswordChange: (confirmPassword: string) => void;

  // button onclick handlers
  onBackClick: () => void;
  onSignoutClick: () => void;
};

const ProfileViewRight: React.FC<ProfileViewRightProps> = ({
  phoneNumber,
  email,
  role,
  currentPassword,
  newPassword,
  confirmPassword,
  disabled,
  errorMessage,
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handlePhoneNumberChange,
  handleCurrentPasswordChange,
  onBackClick,
  onSignoutClick,
}) => {
  return (
    <div className={styles.leftContainer}>
      <div className={styles.topTextPadding} />
      <div className={disabled ? styles.inputContainerDefault : styles.inputContainerWithPassword}>
        <div className={styles.spacing} />
        <ProfileInput
          label="Phone Number"
          defaultValue={phoneNumber ? phoneNumber : ""}
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
            <ProfileInput
              label="Password"
              defaultValue={currentPassword}
              disabled={disabled}
              onContentChange={handleCurrentPasswordChange}
              password={true}
            />
            <div className={styles.spacing} />
            <ProfileInput
              label="New Password"
              defaultValue={newPassword}
              disabled={disabled}
              password={true}
              onContentChange={handlePasswordChange}
            />
            <ProfileInput
              label="Confirm Password"
              defaultValue={confirmPassword}
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
          <button className={styles.backButton} onClick={() => onBackClick()}>
            <div className={styles.backText}>Back</div>
          </button>
          <button className={styles.signOutButton} onClick={() => onSignoutClick()}>
            <div className={styles.signOutText}>Sign Out</div>
          </button>
        </div>
      )}
    </div>
  );
};

export { ProfileViewRight };
