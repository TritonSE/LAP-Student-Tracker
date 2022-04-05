import React from "react";
import styles from "../../styles/ForgotPassword.module.css"
import TextField from "@mui/material/TextField";


const cssTextField = {
    color: "black",
    width: 690,
    height: 80,
    "& .MuiFilledInput-input": {
      color: "#000000",
    },
    "& .MuiFormLabel-root": {
      color: "#494C4E",
    },
};

type ForgotPasswordMainProps = {
    onEmailChange: (newEmail: string) => void;
    onNextButtonClick: () => void;
    onBackButtonClick: () => void;
    currEmail: string,
    error: string,
}

const ForgotPasswordMain: React.FC<ForgotPasswordMainProps> = ({
    onEmailChange,
    onNextButtonClick,
    onBackButtonClick,
    currEmail,
    error
}) => {

    return (
        <div className={styles.contentContainer}>
            <h2 className={styles.title}>Forgot Password</h2>
            <p className={styles.text}>To reset your password, please use the form below. We’ll send you an email with a link to reset your password.</p>
            <TextField
                id="filled-basic"
                value={currEmail}
                label="Enter email"
                variant="filled"
                type="text"
                color="warning"
                InputProps={{ disableUnderline: true }}
                sx={cssTextField}
                onChange={(e) => onEmailChange(e.target.value)}
            />
            <div className={styles.errorMessage}> {error != null ? error : ""} </div>
            <div className={styles.buttonContainer}>
                <button className={styles.backButton} onClick={() => onBackButtonClick()}>
                    Back
                </button>
                <button className={styles.nextButton} onClick={() => onNextButtonClick()}>
                    Next
                </button>
            </div>

        </div>

    );

};

export default ForgotPasswordMain;
