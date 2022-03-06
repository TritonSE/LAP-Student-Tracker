import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import styles from "../../styles/components/LoginViews.module.css";

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
    passwordLengthOk: boolean,
    passwordsMatch: boolean
}


const CreatePassword: React.FC<CreatePasswordProps> =
    ({ onNewEmailChange, onNewPasswordChange, onConfirmPasswordChange, currNewEmail, currNewPassword, currConfirmPassword, passwordsMatch, passwordLengthOk }) => {
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
                        <TextField id="outlined-basic" value={currNewEmail} label="Enter email" variant="outlined" color="warning" sx={cssTextField} onChange={e => onNewEmailChange(e.target.value)} />
                        <TextField id="outlined-basic" value={currNewPassword} label="Create password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => onNewPasswordChange(e.target.value)} />
                        <TextField id="outlined-basic" value={currConfirmPassword} label="Confirm password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => onConfirmPasswordChange(e.target.value)} />
                        {!passwordLengthOk && <div className={styles.passwordError}>Passwords must be greater than 6 characters</div>
                        }
                        {passwordLengthOk && !passwordsMatch && <div className={styles.passwordError}>Passwords do not match</div>}
                    </div>
                </div>

            </div>

        );
    }

export default CreatePassword;