import type { NextPage } from 'next';
import React, { useState } from 'react';
import styles from '../styles/League.module.css';

const League: NextPage = () => {

  const [display, setDisplay] = useState('');

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabs}>
        <button className={styles.tabLinks}>Classes</button>
        <button className={styles.tabLinks}>Students</button>
        <button className={styles.tabLinks}>Staff</button>
      </div>
    </div>
  )
}

export default League;