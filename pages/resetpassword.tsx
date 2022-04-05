import { useRouter } from "next/router";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import firebase from "firebase/compat/app";
import styles from "../styles/ForgotPassword.module.css";
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

const ResetPassword: React.FC = () => {

    const auth = getAuth();
    const router = useRouter();

    const [ newPassword, setNewPassword ] = useState<string>("");
    const [ confirmNewPassword, setConfirmNewPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");

    // firebase requires passwords to be greater than 6 characters
    const passwordLengthOk = newPassword == "" || newPassword.length > 6;
    const passwordsMatch = newPassword == "" || newPassword === confirmNewPassword;

    const resetPassword = ():void => {

        //retrieve code from url
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("oobCode")?.toString();

        if (!passwordLengthOk){
            setError("Password length must be atleast six.")

        }
        else if (!passwordsMatch){
            setError("Passwords do not match.");
        }
        else if (code){
            setError("");
            firebase.auth().verifyPasswordResetCode(code)
            .then(function(email) {
                // Display a "new password" form with the user's email address
            })
            .catch(function() {
                setError("Password could not be reset.");
            })

            firebase.auth().confirmPasswordReset(code, newPassword)
            .then(function() {
                router.push("/login");
            })
            .catch(function() {
                setError("Password could not be reset.");
            })
        }


    }

    return (
        <div className={styles.contentContainer}>
            <h2 className={styles.title}>Reset Password</h2>
            <TextField
                id="filled-basic"
                label="Enter New Password"
                variant="filled"
                type="password"
                color="warning"
                InputProps={{ disableUnderline: true }}
                sx={cssTextField}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
                id="filled-basic"
                label="Confirm New Password"
                variant="filled"
                type="password"
                color="warning"
                InputProps={{ disableUnderline: true }}
                sx={cssTextField}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <div className={styles.errorMessage}> {error != null ? error : ""} </div>
            <button className={styles.submitButton} onClick={() => resetPassword()}>
                    Submit
            </button>

        </div>
    );

}

export default ResetPassword;