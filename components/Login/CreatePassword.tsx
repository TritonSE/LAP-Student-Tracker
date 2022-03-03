import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import styles from "../../styles/components/LoginViews.module.css"

const cssTextField = {
    width: 690,
    height: 80,
};

type CreatePasswordProps = {
    onNewEmailChange: ( newEmail: string ) => void;
    onNewPasswordChange: ( newPassword:string ) => void;
    onConfirmPasswordChange: ( confirmPassword:string ) => void;
    currNewEmail: string;
    currNewPassword: string;
    currConfirmPassword: string;
}


const CreatePassword: React.FC<CreatePasswordProps> = 
({onNewEmailChange, onNewPasswordChange, onConfirmPasswordChange, currNewEmail, currNewPassword, currConfirmPassword}) => {

    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() =>{
        onNewEmailChange(newEmail);
    }, [newEmail]);

    useEffect(() =>{
        onNewPasswordChange(newPassword);
    }, [newPassword]);

    useEffect(() =>{
        onConfirmPasswordChange(confirmPassword);
    }, [confirmPassword]);

    // set current values
    useEffect(() => {
        setNewEmail(currNewEmail);
        setNewPassword(currNewPassword);
        setConfirmPassword(currConfirmPassword);
    }, []);

    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <img src="logo1.png"></img>
                    <img src="logo2.png"></img>
                </div>
            </div>
            <div className={styles.createContainer}>
                <div className={styles.enterTitle}>Enter email and create password</div>
                <div className={styles.textBoxContainer}>
                    <TextField id="outlined-basic" value={newEmail} label="Enter email" variant="outlined" color="warning" sx={cssTextField} onChange={e => setNewEmail(e.target.value)} />
                    <TextField id="outlined-basic" value={newPassword} label="Create password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => setNewPassword(e.target.value)} />
                    <TextField id="outlined-basic" value={confirmPassword} label="Confirm password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
            </div>

        </div>
        
    );
}

export default CreatePassword;