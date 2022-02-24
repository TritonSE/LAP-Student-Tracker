import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import styles from "../../styles/components/LoginViews.module.css"

const cssTextField = {
    width: 690,
    height: 80,
};

type CreatePasswordProps = {
    onContentChange: ( newEmail: string, newPassword:string, confirmPassword:string ) => void;
    currNewEmail: string;
    currNewPassword: string;
    currConfirmPassword: string;
}


const CreatePassword: React.FC<CreatePasswordProps> = 
({onContentChange, currNewEmail, currNewPassword, currConfirmPassword}) => {

    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() =>{
        onContentChange(newEmail, newPassword, confirmPassword);
    });

    // set current values
    useEffect(() => {
        setNewEmail(currNewEmail);
        setNewPassword(currNewPassword);
        setConfirmPassword(currConfirmPassword);
    });

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
                    <TextField id="outlined-basic" label="Enter email" variant="outlined" color="warning" sx={cssTextField} onChange={e => setNewEmail(e.target.value)} />
                    <TextField id="outlined-basic" label="Create password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => setNewPassword(e.target.value)} />
                    <TextField id="outlined-basic" label="Confirm password" variant="outlined" color="warning" type="password" sx={cssTextField} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
            </div>

        </div>
        
    );
}

export default CreatePassword;