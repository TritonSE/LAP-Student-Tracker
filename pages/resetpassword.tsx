import { useRouter } from "next/router";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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

    const auth = useContext(AuthContext);
    const router = useRouter();

    const [ newPassword, setNewPassword ] = useState<string>("");
    const [ confirmNewPassword, setConfirmNewPassword ] = useState<string>("");
    const [ error, setError ] = useState<Error | null>(null);

    // firebase requires passwords to be greater than 6 characters
    const passwordLengthOk = newPassword == "" || newPassword.length >= 6;
    const passwordsMatch = newPassword == "" || newPassword === confirmNewPassword;

    const errorMessage =
    error !== null
      ? error.message
      : !passwordLengthOk
      ? "Passwords must be greater than 6 characters"
      : !passwordsMatch
      ? "Passwords do not match"
      : null;

    const handleResetPassword = async():Promise<void> => {
        //retrieve code from url
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("oobCode")?.toString();
        if (passwordLengthOk && passwordsMatch && code){
            setError(null);
            const success = await auth.resetPassword(code, newPassword);
            if (success) router.push("/login");
            else setError(new Error("Password could not be reset"));
        }
    }

    return (
        <div>
            <div className={styles.headerContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div>
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
                <div className={styles.errorMessage}> {errorMessage != null ? errorMessage : ""} </div>
                <button className={styles.submitButton} onClick={() => handleResetPassword()}>
                        Submit
                </button>
            </div>

        </div>

        
    );

}

export default ResetPassword;