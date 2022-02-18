import React from "react";
import { Student } from "../models/students";
import StudentCard from "./StudentCard";
import styles from "../styles/components/LeagueViews.module.css";

type StudentViewProp = {
  students: Student[];
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

const StudentView: React.FC<StudentViewProp> = ({ students }) => (
  <div className={styles.compContainer}>
    <div className={styles.leftContainer}>
      <h1 className={styles.compTitle}>Students</h1>
      <div className={styles.compList}>
        <ul className={styles.scroll}>
          {students.map((c) => (
            <StudentCard
              key={c.id}
              firstName={c.firstName}
              lastName={c.lastName}
              level={c.level}
              classes={c.classes}
            />
          ))}
        </ul>
      </div>
    </div>
    <span className={styles.spacer} />
    <div className={styles.rightContainer}>
      <input type="text" placeholder="Search students" className={styles.searchBar}></input>
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

export default StudentView;
