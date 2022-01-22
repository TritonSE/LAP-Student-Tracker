import React, { FunctionComponent } from "react";
import { Class } from "../models/classes";
import ClassCard from "../components/ClassCard";
import styles from "../styles/Components.module.css";

type Props = {
  classes: Class[];
};

const filters = [
  "Level 0",
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level 6",
  "Level 7",
  "Level 8",
];

const Classes: FunctionComponent<Props> = ({ classes }) => (
  <div className={styles.compContainer}>
    <div className={styles.leftContainer}>
      <h1 className={styles.compTitle}>Classes</h1>
      <div className={styles.compList}>
        <ul className={styles.scroll}>
          {classes.map((c) => (
            <ClassCard key={c.id} class={c} />
          ))}
        </ul>
      </div>
    </div>
    <div className={styles.rightContainer}>
      <input type="text" placeholder="Search classes" className={styles.searchBar}></input>
      <h2 className={styles.orderTitle}>Order By:</h2>
      <div className={styles.orderElem}>
        <p className={styles.listItemText}>Alphabetical</p>
        <input type="radio"></input>
      </div>
      <div className={styles.orderElem}>
        <p className={styles.listItemText}>Level</p>
        <input type="radio"></input>
      </div>
      <h2 className={styles.filterTitle}>Filter By:</h2>
      <ul className={styles.filterList}>
        {filters.map((l) => (
          <li key={l}>
            <p className={styles.listItemText}>{l}</p>
            <input type="checkbox"></input>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Classes;
