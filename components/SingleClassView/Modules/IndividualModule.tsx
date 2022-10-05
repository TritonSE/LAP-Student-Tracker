import React from "react";
import styles from "./modules.module.css";
import {ModuleItem} from "./ModuleItem";


export const IndividualModule: React.FC = () => {
    return (
        <div>
            <div className={styles.moduleHeader}>Title</div>
            <ModuleItem></ModuleItem>
            <ModuleItem></ModuleItem>
            <ModuleItem></ModuleItem>
            <ModuleItem></ModuleItem>
        </div>



    )
}