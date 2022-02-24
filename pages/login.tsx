import { NextPage } from "next";
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";
<<<<<<< HEAD
import { boolean } from "io-ts";
import { first } from "fp-ts/lib/Reader";
=======
import { AuthContext } from "../context/AuthContext";
>>>>>>> feature/Anshul-Birla/9-authentication-api

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

<<<<<<< HEAD
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
                    console.log(first_name)
                    if (first_name == "" || last_name == ""){
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
=======
    const authProvider = useContext(AuthContext)

    const onClickHandlerRight = (): void => {
        if (currentPage == 1 || currentPage == 2) {
            setCurrentPage(currentPage + 1);
        }
    };

    const onClickHandlerLeft = (): void => {
        if (currentPage == 0) {
            setCurrentPage(currentPage + 1);
        }
        else {
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (newPage: number): void => {
        if (newPage >= 0 && newPage < 4) {
            setCurrentPage(newPage);
>>>>>>> feature/Anshul-Birla/9-authentication-api
        }
    };


    const pages = [
        <LoginPageMain key={0} onContentChange={handleLoginPageMain} currEmail={email} currPassword={password} pageNumber={currentPage} changePage={changePage}></LoginPageMain>,
        <LoginNameInput key={1} onContentChange={handleLoginNameInput} currFirstName={first_name} currLastName={last_name}></LoginNameInput>,
        <LoginPositionInput key={2} onContentChange={handlePosition} currPosition={position}></LoginPositionInput>,
        <CreatePassword key={3} onContentChange={handleCreatePassword} currNewEmail={new_email} currNewPassword={new_password} currConfirmPassword={confirm_password}></CreatePassword>,
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