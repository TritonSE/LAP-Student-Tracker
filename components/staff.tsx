import React, { useState, useEffect, FunctionComponent } from 'react';
import styles from '../styles/Components.module.css';

type Props = {
  staff: Array<String> | undefined;
}

const Staff: FunctionComponent<Props> = ({ staff }) => (
  <div className={styles.compContainer}>
    <div className={styles.topBar}>
      <h1 className={styles.compTitle}>Staff</h1>
      <input type="text" placeholder="Search staff" className={styles.searchBar}></input>
    </div>
  </div>
)

export default Staff;