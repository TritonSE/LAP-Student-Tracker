import styles from "../styles/components/LoginViews.module.css";
import React from "react";
import InputBox from "./LoginInputBox";

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

export default LoginPageMain;
