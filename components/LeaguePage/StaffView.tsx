import React, {useState} from "react";
import styles from "./LeagueViews.module.css";
import {StaffScroll} from "./StaffScroll";


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

const onFilterCheck = (checked: boolean, value: string): void => {
  const tempSelectedFilters = new Set(selectedClassLevels);
  if (checked) {
    tempSelectedFilters.add(Number(value));
  } else if (!checked) {
    tempSelectedFilters.delete(Number(value));
  }
  setSelectedClassLevels(tempSelectedFilters);
};


const StaffView: React.FC = () => {
  const [searchBox, setSearchBox] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <div className={styles.compContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.compTitle}>Staff</h1>
        <div className={styles.compList}>
          <ul className={styles.scroll}>
            <StaffScroll searchQuery={searchBox} selectedFilters={selectedFilters}/>
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
              <input
                type="checkbox"
                value={l}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFilterCheck(e.target.checked, e.target.value)
                }
              ></input>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { StaffView };
