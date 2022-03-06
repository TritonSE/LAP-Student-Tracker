import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";
import { AuthContext } from "../context/AuthContext";
import { NextButton, BackButton } from "../components/Login/LoginButtons";

const Login: React.FC = () => {

    const auth = useContext(AuthContext);
    const router = useRouter();
    // useEffect(() => {
    //     console.log("HELLO")
    //     console.log(auth)
    //     if (auth.user != null)
    //         router.push("/home")
    // }, [])

    // if (auth.user != null) {
    //     console.log("hello")
    //     router.push("/home")
    // }

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [position, setPosition] = useState<"Admin" | "Teacher" | "Volunteer" | "Parent" | "Student">("Admin");
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

    const handlePosition = (newPosition: "Admin" | "Teacher" | "Volunteer" | "Parent" | "Student"): void => {
        setPosition(newPosition);
    };

    const handleConfirmPassword = (confirmPassword: string): void => {
        setConfirmPassword(confirmPassword);
    };

    const handlePage = (newPage: number): void => {
        setCurrentPage(newPage);
    }

    let check: boolean[] = [
        true, //0 (login)
        true, //1 name input
        Boolean(firstName && lastName), //2 position
        Boolean(position), //3 create account
        Boolean(email && password && confirmPassword), //4 signup
    ];

    const onLoginClick = (): void => {
        auth.signup('Anshul', "Birla", email, 'Admin', password);
        console.log("HELLO")
        if (!auth.user || auth.error != null) {
            alert(auth.error);
        }
        else {
            router.push("/home");
        }

    };

    const onSignUpClick = (): void => {
        auth.signup(firstName, lastName, email, position, password);
    };
    console.log(auth.user)
    if (auth.user !== null) {
        router.push("/home")
    }

    const pages = [
        <LoginPageMain key={0} onEmailChange={handleEmail} onPasswordChange={handlePassword} currEmail={email} currPassword={password} pageNumber={currentPage} changePage={handlePage} onLoginClick={onLoginClick}></LoginPageMain>,
        <LoginNameInput key={1} onFirstNameChange={handleFirstName} onLastNameChange={handleLastName} currFirstName={firstName} currLastName={lastName}></LoginNameInput>,
        <LoginPositionInput key={2} onContentChange={handlePosition} currPosition={position}></LoginPositionInput>,
        <CreatePassword key={3} onNewEmailChange={handleEmail} onNewPasswordChange={handlePassword} onConfirmPasswordChange={handleConfirmPassword} currNewEmail={email} currNewPassword={password} currConfirmPassword={confirmPassword}></CreatePassword>,
    ];

    return (
        <div>
            {pages[currentPage]}
            {currentPage > 0 &&
                <div className={styles.buttonContainer}>
                    <BackButton currPage={currentPage} onContentChange={handlePage}></BackButton>
                    <NextButton check={check} currPage={currentPage} onContentChange={handlePage} onSignUpClick={onSignUpClick}></NextButton>
                </div>
            }
        </div>


    );
};

export default Login;