import { NextPage } from "next";
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {

    const auth = useContext(AuthContext);
    
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>(""); 
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");    
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleEmail = (newEmail: string): void => {
        setEmail(newEmail);
    };

    const handlePassword = (newPassword: string): void => {
        setPassword(newPassword);
    }

    const handleFirstName = (newFirstName: string): void => {
        setFirstName(newFirstName);
    };

    const handleLastName = (newLastName: string): void => {
        setLastName(newLastName);
    };

    const handlePosition = (newPosition: string): void => {
        setPosition(newPosition);
    };

    const handleNewEmail = (newEmail: string): void => {
        setNewEmail(newEmail);
    };

    const handleNewPassword = (newPassword:string): void => {
        setNewPassword(newPassword);
    };

    const handleConfirmPassword = (confirmPassword: string): void => {
        setConfirmPassword(confirmPassword);
    };


    const changePage = (newPage: number): void => {
        
        let cont: boolean;
        cont = true;
        if (newPage < 0 || newPage >= 4){
            cont = false;
        }
        else{
            switch(newPage){
                // case 1:
                //     if (email == "" || password == ""){
                //         cont = false;
                //     }
                //     break;
                case 2:
                    console.log(firstName)
                    if (firstName == "" || lastName == ""){
                        cont = false;
                    }
                    break;
                case 3:
                    if (position == ""){
                        cont = false;
                    }
                    break;
            };
        }
        if (cont){
            setCurrentPage(newPage)
        }
    }
    const authProvider = useContext(AuthContext)



    const pages = [
        <LoginPageMain key={0} onEmailChange={handleEmail} onPasswordChange={handlePassword} currEmail={email} currPassword={password} pageNumber={currentPage} changePage={changePage}></LoginPageMain>,
        <LoginNameInput key={1} onFirstNameChange={handleFirstName} onLastNameChange={handleLastName} currFirstName={firstName} currLastName={lastName}></LoginNameInput>,
        <LoginPositionInput key={2} onContentChange={handlePosition} currPosition={position}></LoginPositionInput>,
        <CreatePassword key={3} onNewEmailChange={handleNewEmail} onNewPasswordChange={handleNewPassword} onConfirmPasswordChange={handleConfirmPassword} currNewEmail={newEmail} currNewPassword={newPassword} currConfirmPassword={confirmPassword}></CreatePassword>,
    ];

    return (
        <div>
            {pages[currentPage]}
            {currentPage > 0 &&
                <div className={styles.buttonContainer}>
                    <button className={styles.buttonOutline} onClick={() => changePage(currentPage - 1)}>Back</button>
                    <button className={styles.buttonFilled} onClick={() => changePage(currentPage + 1)}>Next</button>
                </div>
            }
        </div>


    );
};

export default Login;