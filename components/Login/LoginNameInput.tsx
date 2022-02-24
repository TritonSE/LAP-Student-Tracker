import styles from "../../styles/components/LoginViews.module.css";
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { last } from "fp-ts/lib/ReadonlyNonEmptyArray";

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

type LoginNameInputProps = {
    onContentChange: (newFirstName: string, newLastName:string) => void;
    currFirstName: string;
    currLastName: string;
};

const LoginNameInput: React.FC<LoginNameInputProps> = 
({onContentChange, currFirstName, currLastName}) => {

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    useEffect(() =>{
        onContentChange(firstName, lastName);
    }, [firstName, lastName]);

    // set current values
    useEffect(() => {
        setFirstName(currFirstName);
        setLastName(currLastName);
    }, []);

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
                <TextField id="filled-basic" value={firstName} label="First" variant="filled" type="text" color="warning" InputProps = {{disableUnderline: true}} sx={cssTextField} onChange={e => setFirstName(e.target.value)} />
                <TextField id="filled-basic" value={lastName} label="Last" variant="filled" type="text" color="warning" InputProps = {{disableUnderline: true}} sx={cssTextField} onChange={e => setLastName(e.target.value)} />
            </div>

        </div>
    );
}

export default LoginNameInput;