import styles from "../../styles/components/LoginViews.module.css";
import React, { useState, useEffect } from "react";
import { string } from "io-ts";


type LoginPositionInputProps = {
    onContentChange: ( newPosition: string ) => void;
    currPosition: string;
};

const LoginPositionInput: React.FC <LoginPositionInputProps>= 
({ onContentChange, currPosition }) => {

    const [position, setPosition] = useState<string>("");

    useEffect(() =>{
        onContentChange(position);
    }, [position]);

    // set current values
    useEffect(() => {
        setPosition(currPosition);
    }, []);

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
                    <input type="radio" id="admin" name="select-position" value="Admin" onChange={e => setPosition(e.target.value)} className={styles.radioBox} checked={position=="Admin"}/>
                    <label htmlFor="admin" className={styles.positionText}>Admin</label><br></br>
                    <input type="radio" id="teacher" name="select-position" value="Teacher" onChange={e => setPosition(e.target.value)} className={styles.radioBox} checked={position=="Teacher"}/>
                    <label htmlFor="teacher" className={styles.positionText}>Teacher</label>
                </form>
            </div>
        </div>

    );
}

export default LoginPositionInput;