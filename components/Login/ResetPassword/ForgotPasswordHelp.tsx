import React from "react";
import styles from "../../../styles/ForgotPassword.module.css";
import Button from "@mui/material/Button";

type ForgotPasswordMainProps = {
  onNextButtonClick: () => void;
  onBackButtonClick: () => void;
};

const ForgotPasswordHelp: React.FC<ForgotPasswordMainProps> = ({
  onNextButtonClick,
  onBackButtonClick,
}) => {
  return (
    <div className={styles.contentContainer}>
      <h2 className={styles.title}>Help is on the way!</h2>
      <p className={styles.text}>
        {" "}
        Check your email inbox - we just emailed you a link to reset your password.{" "}
      </p>
      <p className={styles.text}>
        {" "}
        If you don’t receive anything, first check your spam folder and then try again.{" "}
      </p>

      <div className={styles.buttonContainer}>
        <Button
          variant={"outlined"}
          className={styles.backButton}
          onClick={() => onBackButtonClick()}
        >
          Back
        </Button>
        <Button
          variant={"contained"}
          className={styles.nextButton}
          onClick={() => onNextButtonClick()}
        >
          Return to Sign In
        </Button>
      </div>
    </div>
  );
};

export { ForgotPasswordHelp };
