import { useRouter } from "next/router";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "../styles/ForgotPassword.module.css";
import ForgotPasswordMain from "../components/ResetPassword/ForgotPasswordLanding";
import ForgotPasswordHelp from "../components/ResetPassword/ForgotPasswordHelp";


const ForgotPassword: React.FC = () => {

    const auth = getAuth();
    const router = useRouter();

    const [displayMain, setDisplayMain] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    

    const sendResetEmail = (): void => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            setDisplayMain(false)
        })
        .catch((e) => {
            setError("No existing account with this email.")
        });
    }

    const returnToLogin = (): void => {
        router.push("/home");
    }

    const returnToMain = ():void => {
        setDisplayMain(true);
    }

    return (

        <div>
            <div className={styles.headerContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div>

            {displayMain && (
                <ForgotPasswordMain
                    onEmailChange = {setEmail}
                    onBackButtonClick = {returnToLogin}
                    onNextButtonClick = {sendResetEmail}
                    currEmail = {email}
                    error = {error}
                ></ForgotPasswordMain>

            )}
            {!displayMain && (
                <ForgotPasswordHelp
                    onBackButtonClick = {returnToMain}
                    onNextButtonClick = {returnToLogin}
                ></ForgotPasswordHelp>
            )}
        </div>

    );
};

export default ForgotPassword;