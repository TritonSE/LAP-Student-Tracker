import React, { useState, useEffect, FunctionComponent } from 'react';
import styles from '../styles/Components.module.css';

type Props = {
  students: Array<String> | undefined;
}

const Students: FunctionComponent<Props> = ({ students }) => (
  <div className={styles.compContainer}>
    <div className={styles.topBar}>
      <h1 className={styles.compTitle}>Students</h1>
      <input type="text" placeholder="Search students" className={styles.searchBar}></input>
    </div>
    <div className={styles.compList}>
      <ul>
        {students?.map((c) => <li className={styles.listElem} key="{c}">{c}</li>)}
      </ul>
    </div>
  </div>
)

export default Students;