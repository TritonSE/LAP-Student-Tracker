import React from "react";
import TextField from "@mui/material/TextField";
import styles from "./LoginViews.module.css";

const cssTextField = {
  width: 690,
  height: 80,
};

type CreatePasswordProps = {
  onNewEmailChange: (newEmail: string) => void;
  onNewPasswordChange: (newPassword: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  currNewEmail: string;
  currNewPassword: string;
  currConfirmPassword: string;
  passwordLengthOk: boolean;
  passwordsMatch: boolean;
  validEmail: boolean;
  error: Error | null;
};
// component that handles creating the new email and password of a new user
const CreateEmailAndPassword: React.FC<CreatePasswordProps> = ({
  onNewEmailChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  currNewEmail,
  currNewPassword,
  currConfirmPassword,
  passwordsMatch,
  passwordLengthOk,
  validEmail,
  error,
}) => {
  // handle the displayed error message in a priority order
  const errorMessage =
    error !== null
      ? error.message
      : !validEmail
        ? "Enter a valid email"
        : !passwordLengthOk
          ? "Passwords must be greater than 6 characters"
          : !passwordsMatch
            ? "Passwords do not match"
            : null;
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src="logo1.png"></img>
          <img src="logo2.png"></img>
        </div>
      </div>
      <div className={styles.createContainer}>
        <div className={styles.enterTitle}>Enter email and create password</div>
        <div className={styles.textBoxContainer}>
          <TextField
            id="outlined-basic"
            value={currNewEmail}
            label="Enter email"
            variant="outlined"
            color="warning"
            sx={cssTextField}
            onChange={(e) => onNewEmailChange(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            value={currNewPassword}
            label="Create password"
            variant="outlined"
            color="warning"
            type="password"
            sx={cssTextField}
            onChange={(e) => onNewPasswordChange(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            value={currConfirmPassword}
            label="Confirm password"
            variant="outlined"
            color="warning"
            type="password"
            sx={cssTextField}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
          />
          {errorMessage && <div className={styles.passwordError}>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export { CreateEmailAndPassword };
