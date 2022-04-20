import React, { useState } from "react";
import { Class } from "../../models/class";
import styles from "./LeagueViews.module.css";
import { ClassScroll } from "./ClassScroll";

type ClassViewProp = {
  classes: Class[];
};

export type OrderBy = {
  alpha: boolean;
  level: boolean;
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

const ClassView: React.FC<ClassViewProp> = () => {
  const [searchBox, setSearchBox] = useState("");
  const [orderBy, setOrderBy] = useState({ alpha: false, level: false });
  const [selectedClassLevels, setSelectedClassLevels] = useState<Set<number>>(new Set());

  const onSearchInput = (event: any): void => {
    setSearchBox(event.target.value);
  };

  const changeSort = (value: string): void => {
    if (value === "alpha") {
      setOrderBy({ alpha: true, level: false });
    }
    if (value === "level") {
      setOrderBy({ alpha: false, level: true });
    }
  };

  const onFilterCheck = (target: any): void => {
    const tempSelectedClassLevels = new Set(selectedClassLevels);
    if (target.checked) {
      tempSelectedClassLevels.add(Number(target.value));
    } else if (!target.checked) {
      tempSelectedClassLevels.delete(Number(target.value));
    }
    setSelectedClassLevels(tempSelectedClassLevels);
  };

  return (
    <div className={styles.compContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.compTitle}>Classes</h1>
        <div className={styles.compList}>
          <ul className={styles.scroll}>
            <ClassScroll
              searchQuery={searchBox}
              orderBy={orderBy}
              selectedLevels={selectedClassLevels}
            />
          </ul>
        </div>
      </div>
      <span className={styles.spacer} />
      <div className={styles.rightContainer}>
        <input
          type="text"
          placeholder="Search classes"
          className={styles.searchBar}
          onChange={onSearchInput}
        ></input>
        <h2 className={styles.orderTitle}>Order By:</h2>
        <div className={styles.orderElem}>
          <p className={styles.listItemText}>Alphabetical</p>
          <input
            type="radio"
            value="alpha"
            checked={orderBy.alpha}
            onChange={(e) => changeSort(e.target.value)}
          ></input>
        </div>
        <div className={styles.orderElem}>
          <p className={styles.listItemText}>Level</p>
          <input
            type="radio"
            value="level"
            checked={orderBy.level}
            onChange={(e) => changeSort(e.target.value)}
          ></input>
        </div>
        <h2 className={styles.filterTitle}>Filter By:</h2>
        <ul className={styles.filterList}>
          {filters.map((l, index) => (
            <li key={`${l}-${index}`}>
              <p className={styles.listItemText}>{l}</p>
              <input type="checkbox" value={index} onClick={(e) => onFilterCheck(e.target)}></input>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ClassView };
