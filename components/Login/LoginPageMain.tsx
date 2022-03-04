import styles from "../../styles/components/LoginViews.module.css";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';

const cssTextField = {
    color: "black",
    width: 690,
    height: 80,
    '& .MuiFilledInput-input': {
        color: "#000000"
    },
    '& .MuiFormLabel-root': {
        color: "#494C4E"
    },
};

type LoginPageMainProps = {
    pageNumber: number;
    changePage: (newPage: number) => void;
    onEmailChange: (newEmail: string) => void;
    onPasswordChange: (newPassword: string) => void;
    currEmail: string;
    currPassword: string;
};

const LoginPageMain: React.FC<LoginPageMainProps> = 
({pageNumber, changePage, onEmailChange, onPasswordChange, currEmail, currPassword}) => {
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() =>{
        onEmailChange(email);
    }, [email]);

    useEffect(() => {
        onPasswordChange(password);
    }, [password]);

    // set current values
    useEffect(() => {
        setEmail(currEmail);
        setPassword(currPassword);
    }, []);

    console.log(pageNumber)

    return (
        <div className={styles.comContainer}>
            <img src="login-logo.png" className={styles.mainPageLogo}></img>
            <div className={styles.contentContainer}>
                <h2 className={styles.title}>Login</h2>
                <TextField id="filled-basic" value={email} label="Email" variant="filled" type="text" color="warning" InputProps = {{disableUnderline: true}} sx={cssTextField} onChange={e => setEmail(e.target.value)} />
                <TextField id="filled-basic" value={password} label="Password" variant="filled" type="password" color="warning" InputProps = {{disableUnderline: true}} sx={cssTextField} onChange={e => setPassword(e.target.value)} />
                <div className={styles.bottomContainer}>
                    <form>
                        <input type="checkbox" id="remember-me" name="remember-me" className={styles.checkbox}/>
                        <label className={styles.chkboxLabel}>Remember Me</label>
                    </form>
                    <div>
                        <a className={styles.forgotPassword}>Forgot Password?</a>
                    </div>
                </div>
                <div className={styles.buttonContainer}> 
                    <button className={styles.buttonOutline} onClick={ () => changePage(pageNumber + 1) }>Create Account</button>
                    <button className={styles.buttonFilled}>Login</button>
                </div>
            </div>
            
        </div>
    );
}

export default LoginPageMain;
