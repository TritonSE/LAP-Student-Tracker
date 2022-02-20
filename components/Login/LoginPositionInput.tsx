import styles from "../styles/components/LoginViews.module.css";
import React from "react";

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

export default LoginPositionInput;