import { NextPage } from "next";
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {

    const [currentPage, setCurrentPage] = useState<number>(0);

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
        }
    };


    const pages = [
        <LoginPageMain pageNumber={currentPage} changePage={changePage} key={0}></LoginPageMain>,
        <LoginNameInput key={1}></LoginNameInput>,
        <LoginPositionInput key={2}></LoginPositionInput>,
        <CreatePassword key={3}></CreatePassword>,
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