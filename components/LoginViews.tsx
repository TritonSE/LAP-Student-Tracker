import styles from "../styles/components/LoginViews.module.css";
import React from "react";
import InputBox from "./LoginInputBox"

const LoginPageMain: React.FC = () => {
    return (
        <div className={styles.comContainer}>
            <img src="login-logo.png" className={styles.mainPageLogo}></img>
            {/* <div className={styles.logoContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div> */}
            <div className={styles.contentContainer}>
                <h2 className={styles.title}>Login</h2>
                <InputBox text="email"/>
                <InputBox text="password"/>
                <div className={styles.bottomContainer}>
                    <form>
                        <input type="checkbox" id="remember-me" name="remember-me" className={styles.checkbox}/>
                        <label className={styles.chkboxLabel}>Remember Me</label>
                    </form>
                    <div>
                        <a className={styles.forgotPassword}>Forgot Password?</a>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

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

const LoginPositionInput: React.FC = () => {
    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <img src="logo1.png"></img>
                    <img src="logo2.png"></img>
                </div>
            </div>
            <div className={styles.positionContainer}>
                <h2 className={styles.title}>Select your position:</h2>
                <form>
                    <input type="radio" id="position" name="select-position" value="Admin" className={styles.radioBox}/>
                    <label className={styles.positionText}>Admin</label><br></br>
                    <input type="radio" id="position" name="select-position" value="Admin" className={styles.radioBox}/>
                    <label className={styles.positionText}>Teacher</label>
                </form>
            </div>
            

        </div>

    );
}



export { LoginPageMain, LoginNameInput, LoginPositionInput };
