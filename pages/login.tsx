import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";

const Login: React.FC = () => {

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>(""); 
    const [first_name, setFirstName] = useState<string>("");
    const [last_name, setLastName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [new_email, setNewEmail] = useState<string>("");
    const [new_password, setNewPassword] = useState<string>("");    
    const [confirm_password, setConfirmPassword] = useState<string>("");

    const handleLoginPageMain = (newEmail: string, newPassword:string): void => {
        setEmail(newEmail);
        setPassword(newPassword);
    };
    const handleLoginNameInput = (newFirstName: string, newLastName: string): void => {
        setFirstName(newFirstName);
        setLastName(newLastName);
    };
    const handlePosition = (newPosition: string): void => {
        setPosition(newPosition);
    };
    const handleCreatePassword = (newEmail: string, newPassword:string, confirmPassword: string): void => {
        setNewEmail(newEmail);
        setNewPassword(newPassword);
        setConfirmPassword(confirmPassword);
    };
    const changePage = (newPage: number): void => {
        if (newPage >= 0 && newPage < 4){
            setCurrentPage(newPage);
        }
    };

    const pages = [
        <LoginPageMain onContentChange={handleLoginPageMain} currEmail={email} currPassword={password} pageNumber={currentPage} changePage={changePage} key={0}></LoginPageMain>,
        <LoginNameInput onContentChange={handleLoginNameInput} currFirstName={first_name} currLastName={last_name} key={1}></LoginNameInput>,
        <LoginPositionInput onContentChange={handlePosition} currPosition={position} key={2}></LoginPositionInput>,
        <CreatePassword onContentChange={handleCreatePassword} currNewEmail={new_email} currNewPassword={new_password} currConfirmPassword={confirm_password} key={3}></CreatePassword>,
    ];
    
    return (
        <div>
            {pages[currentPage]}
            {currentPage > 0 &&
                <div className={styles.buttonContainer}> 
                    <button className={styles.buttonOutline} onClick={() => changePage(currentPage-1)}>Back</button>
                    <button className={styles.buttonFilled} onClick={ () => changePage(currentPage+1) }>Next</button>
                </div>
            }
        </div>
        

    );
};

export default Login;