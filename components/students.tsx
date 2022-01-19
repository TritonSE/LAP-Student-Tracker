import React, { useState, useEffect, FunctionComponent } from 'react';
import styles from '../styles/Components.module.css';

type Props = {
  students: Array<String> | undefined;
}

const filters =  ["Level 0", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8"];

const Students: FunctionComponent<Props> = ({ students }) => (
  <div className={styles.compContainer}>
    <div className={styles.leftContainer}>
      <h1 className={styles.compTitle}>Students</h1>
      <div className={styles.compList}>
        <ul className={styles.scroll}>
          {students?.map((c) => <li className={styles.listElem} key="{c}">{c}</li>)}
        </ul>
      </div>
    </div>
    <div className={styles.rightContainer}>
      <input type="text" placeholder="Search students" className={styles.searchBar}></input>
      <h2 className={styles.orderTitle}>Order By:</h2>
      <div className={styles.orderElem}>
        <p>Alphabetical</p>
        <input type="radio"></input>
      </div>
      <div className={styles.orderElem}>
        <p>Level</p>
        <input type="radio"></input>
      </div>
      <h2 className={styles.filterTitle}>Filter By:</h2>
      <ul className={styles.filterList}>
        {filters.map((l) => 
          <li className={styles.filterElem} key="{l}">
            <p>{l}</p>
            <input type="checkbox"></input>
          </li>)
        }
      </ul>
    </div>
  </div>
)

export default Students;