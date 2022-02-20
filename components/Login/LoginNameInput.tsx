import styles from "../styles/components/LoginViews.module.css";
import React from "react";
import InputBox from "./LoginInputBox";

const LoginNameInput: React.FC = () => {
    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <img src="logo1.png"></img>
                    <img src="logo2.png"></img>
                </div>
            </div>
            <div className={styles.nameContainer}>
                <h2 className={styles.title}>What is your name?</h2>
                <InputBox text="first"/>
                <InputBox text="last"/>
            </div>

        </div>
        

    );
}

export default LoginNameInput;