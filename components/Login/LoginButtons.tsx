import React, { useState, useEffect } from "react";
import styles from "../../styles/components/LoginViews.module.css";

type NextButtonProps = {
    check: boolean[],
    currPage: number,
    onContentChange: (newPage: number) => void;
}

type BackButtonProps = {
    currPage: number,
    onContentChange: (newPage: number) => void;
}

export const NextButton : React.FC<NextButtonProps> = ({ check, currPage, onContentChange }) => {

    const changePage = (newPage: number): void => {

        if (newPage < 4 && check[newPage]){
            onContentChange(newPage)
        }

    }
    return (
        <button className={styles.buttonOutline} onClick={() => changePage(currPage + 1)}>Next</button>
    );

};

export const BackButton: React.FC<BackButtonProps> = ({ currPage, onContentChange }) => {


    const changePage = (newPage: number): void => {

        if (newPage >= 0){
            onContentChange(newPage)
        }

    }
    return (
        <button className={styles.buttonOutline} onClick={() => changePage(currPage - 1)}>Back</button>
    );

};

