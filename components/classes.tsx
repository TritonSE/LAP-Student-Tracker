import React, { useState, useEffect, FunctionComponent } from 'react';
import { TypeFlags } from 'typescript';
import styles from '../styles/Components.module.css';

type Props = {
  classes: Array<String> | undefined;
}

const Classes: FunctionComponent<Props> = ({ classes }) => (
  <div className={styles.compContainer}>
    <div className={styles.topBar}>
      <h1 className={styles.compTitle}>Classes</h1>
      <input type="text" placeholder="Search classes" className={styles.searchBar}></input>
    </div>
  </div>
)

export default Classes;
