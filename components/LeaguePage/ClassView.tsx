import React, { useContext, useState } from "react";
import { Class } from "../../models/class";
import { ClassCard } from "./ClassCard";
import styles from "./LeagueViews.module.css";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { Empty } from "../util/Empty";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";

type ClassViewProp = {
  classes: Class[];
};

type OrderBy = {
  alpha: boolean;
  level: boolean;
};

type ClassScrollProp = {
  searchQuery: string;
  orderBy: OrderBy;
  selectedLevels: Set<number>;
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

const ClassScroll: React.FC<ClassScrollProp> = ({ searchQuery, orderBy, selectedLevels }) => {
  const client = useContext(APIContext);
  const { data: classes, error } = useSWR("/api/class", () => client.getAllClasses());

  if (error) return <Error />;
  if (!classes) return <Loader />;

  const checkIfLevelSelected = (selectedLevels: Set<number>, tempClass: Class) => {
    if (selectedLevels.size === 0) {
      return true;
    }

    let selected = false;

    Array(tempClass.maxLevel - tempClass.minLevel + 1)
      .fill(0)
      .map((_, i) => i + 1)
      .map((val) => val + tempClass.minLevel)
      .forEach((level) => {
        if (selectedLevels.has(level)) selected = true;
      });

    return selected;
  };

  const sortBy = (a: Class, b: Class): number => {
    if (orderBy.alpha) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    } else if (orderBy.level) {
      if (a.minLevel < b.minLevel) {
        return -1;
      }
      if (a.minLevel > b.minLevel) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  };

  const filteredClasses = classes
    .filter(
      (currClass) =>
        currClass.name.includes(searchQuery) && checkIfLevelSelected(selectedLevels, currClass)
    )
    .sort((a, b) => {
      return sortBy(a, b);
    });

  if (classes.length == 0) return <Empty userType="Classes" />;

  return (
    <>
      {filteredClasses.map((currClass: Class) => (
        <ClassCard
          key={currClass.eventInformationId}
          name={currClass.name}
          minLevel={currClass.minLevel}
          maxLevel={currClass.maxLevel}
          rrstring={currClass.rrstring}
          startTime={currClass.startTime}
          endTime={currClass.endTime}
        />
      ))}
    </>
  );
};

const ClassView: React.FC<ClassViewProp> = () => {
  const [searchBox, setSearchBox] = useState("");
  const [orderBy, setOrderBy] = useState({ alpha: false, level: false });
  const [selectedClassLevels, setSelectedClassLevels] = useState<Set<number>>(new Set());

  const onSearchInput = (event: any): void => {
    setSearchBox(event.target.value);
  };

  const changeSort = (event: any): void => {
    if (event.target.value === "alpha") {
      setOrderBy({ alpha: true, level: false });
    }
    if (event.target.value === "level") {
      setOrderBy({ alpha: false, level: true });
    }
  };

  const onFilterCheck = (event: any): void => {
    const tempSelectedClassLevels = new Set(selectedClassLevels);
    if (event.target.checked) {
      tempSelectedClassLevels.add(event.target.value);
    } else if (!event.target.checked) {
      tempSelectedClassLevels.delete(event.target.value);
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
          <input type="radio" value="alpha" checked={orderBy.alpha} onChange={changeSort}></input>
        </div>
        <div className={styles.orderElem}>
          <p className={styles.listItemText}>Level</p>
          <input type="radio" value="level" checked={orderBy.level} onChange={changeSort}></input>
        </div>
        <h2 className={styles.filterTitle}>Filter By:</h2>
        <ul className={styles.filterList}>
          {filters.map((l, index) => (
            <li key={`${l}-${index}`}>
              <p className={styles.listItemText}>{l}</p>
              <input type="checkbox" value={index} onClick={onFilterCheck}></input>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ClassView };
