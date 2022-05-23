import React, { useState } from "react";
import styles from "./LeagueViews.module.css";
<<<<<<< HEAD
import { StaffScroll } from "./StaffScroll";
=======
import { StaffCard } from "./StaffCard";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { CustomError } from "../util/CustomError";
import { Empty } from "../util/Empty";
import { User } from "../../models/users";
import useSWR from "swr";
>>>>>>> cd0ae1bcf20f6a6712ea407b80182503983e7a73

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

<<<<<<< HEAD
  const onSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchBox(event.target.value);
  };
=======
  if (error) return <CustomError />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Staff" />;
>>>>>>> cd0ae1bcf20f6a6712ea407b80182503983e7a73

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
