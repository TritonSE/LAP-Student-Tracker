import React from 'react';
import { ClassViewMenu } from '../../components/ClassView/ClassViewMenu';
import { Module } from '../../components/ModuleView/Module';
import styles from '../../styles/class.module.css';
import type { NextApplicationPage } from "../_app";

const ModulesPage: NextApplicationPage = () => {
    return (
        <div className={styles.container}>
            <ClassViewMenu/>
            <Module/>
        </div>
    )
  } 

  export default ModulesPage;