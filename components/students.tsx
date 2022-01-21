import React, { FunctionComponent } from "react";
import { Student } from "../models/users";
import StudentCard from "../components/StudentCard";
import styles from "../styles/Components.module.css";

type Props = {
  students: Student[] | undefined;
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

const Students: FunctionComponent<Props> = ({ students }) => (
  <div className={styles.compContainer}>
    <div className={styles.leftContainer}>
      <h1 className={styles.compTitle}>Students</h1>
      <div className={styles.compList}>
        <ul className={styles.scroll}>
          {students?.map((c) => (
            <StudentCard key={c.id} student={c} />
          ))}
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
        {filters.map((l) => (
          <li key={l}>
            <p>{l}</p>
            <input type="checkbox"></input>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Students;
