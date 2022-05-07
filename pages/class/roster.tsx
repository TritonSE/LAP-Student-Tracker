import React from 'react';
import { ClassViewMenu } from '../../components/ClassView/ClassViewMenu';
import { Roster } from '../../components/Roster/Roster';
import type { NextApplicationPage } from "../_app";
import styles from '../../styles/class.module.css';

const RosterPage: NextApplicationPage = () => {
    return (
        <div className={styles.container}>
            <ClassViewMenu/>
            <Roster/>
        </div>
    )
  }

  export default RosterPage;