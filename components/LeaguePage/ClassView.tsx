import { Input } from "@mui/material";
import React, { useState } from "react";
import { Class } from "../../models/class";
import { ClassCard } from "./ClassCard";
import styles from "./LeagueViews.module.css";

type ClassViewProp = {
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

const ClassView: React.FC<ClassViewProp> = ({ classes }) => {
  const [searchBox, setSearchBox] = useState("");
  const [orderBy, setOrderBy] = useState({alpha: false, level: false});
  const [selectedClassLevels, setSelectedClassLevels] = useState({});

  const onSearchInput = (event: any) => {
    setSearchBox(event.target.value);
  };

  const changeSort = (event: any) => {
    if (event.target.value === "alpha") {
      setOrderBy({alpha: true, level: false});
    }
    if (event.target.value === "level") {
      setOrderBy({alpha: false, level: true});
    }
  };

  const onFilterCheck = (event: any) => {
    const newSelectedClassLevels: any = { ...selectedClassLevels };
    newSelectedClassLevels[event.target.value] = event.target.checked;
    setSelectedClassLevels(newSelectedClassLevels);
    console.log(selectedClassLevels);
  };
  
  const sortBy = (a: Class, b: Class) => {
    if (orderBy.alpha) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      else {
        return 0;
      }
    }
    else if (orderBy.level) {
      if (a.minLevel < b.minLevel) {
        return -1;
      }
      if (a.minLevel > b.minLevel) {
        return 1;
      }
      else {
        return 0;
      }
    }
    return 0;
  };

  return (
    <div className={styles.compContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.compTitle}>Classes</h1>
        <div className={styles.compList}>
          <ul className={styles.scroll}>
            {(classes.filter((tempClass) => 
              tempClass.name.includes(searchBox)))
              .sort(sortBy)
              .map((tempClass) => 
              <ClassCard
                key={tempClass.eventInformationId}
                name={tempClass.name}
                minLevel={tempClass.minLevel}
                maxLevel={tempClass.maxLevel}
                rrstring={tempClass.rrstring}
                startTime={tempClass.startTime}
                endTime={tempClass.endTime}
              />
            )}
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
          <input type="radio" value="alpha" checked={orderBy.alpha} onChange={changeSort}></input>
        </div>
        <div className={styles.orderElem}>
          <p className={styles.listItemText}>Level</p>
          <input type="radio" value="level" checked={orderBy.level} onChange={changeSort}></input>
        </div>
        <h2 className={styles.filterTitle}>Filter By:</h2>
        <ul className={styles.filterList}>
          {filters.map((l) => (
            <li key={l}>
              <p className={styles.listItemText}>{l}</p>
              <input type="checkbox" value={l} onClick={onFilterCheck}></input>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ClassView };
