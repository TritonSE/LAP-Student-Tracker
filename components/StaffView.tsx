import React from "react";
import styles from "../styles/components/LeagueViews.module.css";
import StaffScroll from "./StaffScroll";

const filters = [
  "Administration",
  "Teachers",
  "Volunteers",
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

const StaffView: React.FC = () => {
  return (
    <div className={styles.compContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.compTitle}>Staff</h1>
        <div className={styles.compList}>
          <ul className={styles.scroll}>
            <StaffScroll />
          </ul>
        </div>
      </div>
      <span className={styles.spacer} />
      <div className={styles.rightContainer}>
        <input type="text" placeholder="Search staff" className={styles.searchBar}></input>
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
};

export default StaffView;
