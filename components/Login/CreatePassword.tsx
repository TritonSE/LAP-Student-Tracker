import React from "react";
import TextField from '@mui/material/TextField';
import styles from "../../styles/components/LoginViews.module.css"


const CreatePassword: React.FC = () => {
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
                    <TextField id="outlined-basic" label="Enter email" variant="outlined" color="warning" sx={{width: 690, height: 80}}/>
                    <TextField id="outlined-basic" label="Create password" variant="outlined" color="warning" type="password" sx={{width: 690, height: 80}}/>
                    <TextField id="outlined-basic" label="Confirm password" variant="outlined" color="warning" type="password" sx={{width: 690, height: 80}}/>
                </div>
            </div>

        </div>
        
    );
}

export default CreatePassword;