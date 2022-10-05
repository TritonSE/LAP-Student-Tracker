import React from "react";
import styles from "./modules.module.css";
import {IndividualModule} from "./IndividualModule";

export const Module: React.FC = () => {

    



    return (
    <div className={styles.container}>
        <div className={styles.titleBar}>
            <div className={styles.title}>Module</div>
            <div className={styles.buttonDiv}>
            <button className={styles.addItemButton}>Add Module</button>
            </div>
        </div>
        <IndividualModule></IndividualModule>
    </div>
    );
};
