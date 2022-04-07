import { useRouter } from "next/router";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/ForgotPassword.module.css";
import { ForgotPasswordMain }  from "../components/ResetPassword/ForgotPasswordLanding";
import { ForgotPasswordHelp } from "../components/ResetPassword/ForgotPasswordHelp";


const ForgotPassword: React.FC = () => {

    const auth = useContext(AuthContext);
    const router = useRouter();

    const [displayMain, setDisplayMain] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    

    const sendResetEmail = async (): Promise<void> => {
        auth.clearError();
        const success = await auth.forgotPassword(email);
        if (success) setDisplayMain(false);
    }

    const returnToLogin = (): void => {
        router.push("/home");
    }

    const returnToMain = ():void => {
        auth.clearError();
        setDisplayMain(true);
    }

    return (

        <div>
            <div className={styles.headerContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div>

            {displayMain
                ? <ForgotPasswordMain
                    onEmailChange = {setEmail}
                    onBackButtonClick = {returnToLogin}
                    onNextButtonClick = {sendResetEmail}
                    currEmail = {email}
                    error = {auth.error}>
                    </ForgotPasswordMain>
                : <ForgotPasswordHelp
                    onBackButtonClick = {returnToMain}
                    onNextButtonClick = {returnToLogin}>
                    </ForgotPasswordHelp>
            }
        </div>

    );
};

export default ForgotPassword;