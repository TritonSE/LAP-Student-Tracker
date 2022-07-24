import React, { useState } from "react";
import styles from "./LeagueViews.module.css";
import { StaffScroll } from "./StaffScroll";

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
  const [searchBox, setSearchBox] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const onSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchBox(event.target.value);
  };

  const onFilterCheck = (checked: boolean, value: string): void => {
    setSelectedFilters((oldFilters) => {
      if (checked) {
        // adds the filter to the selected filters list if the checkbox was checked
        if (!oldFilters.includes(value)) {
          oldFilters.push(value);
        }
      } else if (!checked) {
        // remove the filter from selected filters list if the checkbox was unchecked
        const index = oldFilters.indexOf(value);
        if (index > -1) {
          oldFilters.splice(index, 1);
        }
      }
      return [...oldFilters];
    });
  };

  return (
    <div className={styles.compContainer}>
      <div className={styles.leftContainer}>
        <h1 className={styles.compTitle}>Staff</h1>
        <div className={styles.compList}>
          <ul className={styles.scroll}>
            <StaffScroll searchQuery={searchBox} selectedFilters={selectedFilters} />
          </ul>
        </div>
      </div>
      <span className={styles.spacer} />
      <div className={styles.rightContainer}>
        <input
          type="text"
          placeholder="Search staff"
          className={styles.searchBar}
          onChange={onSearchInput}
        ></input>
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
