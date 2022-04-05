import React, { useContext } from "react";
import { Class } from "../../models/class";
import { ClassCard } from "./ClassCard";
import styles from "./LeagueViews.module.css";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { Error } from "../util/Error";
import { Loader } from "../util/Loader";
import { Empty } from "../util/Empty";

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

const ClassScroll: React.FC = () => {
  const client = useContext(APIContext);
  const { data, error } = useSWR("/api/class", () => client.getAllClasses());

  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Classes" />;

  return (
    <>
      {data.map((classs: Class) => (
        <ClassCard
          key={classs.eventInformationId}
          name={classs.name}
          minLevel={classs.minLevel}
          maxLevel={classs.maxLevel}
          rrstring={classs.rrstring}
          startTime={classs.startTime}
          endTime={classs.endTime}
        />
      ))}
    </>
  );
};

const ClassView: React.FC = () => (
  <div className={styles.compContainer}>
    <div className={styles.leftContainer}>
      <h1 className={styles.compTitle}>Classes</h1>
      <div className={styles.compList}>
        <ul className={styles.scroll}>
          <ClassScroll />
        </ul>
      </div>
    </div>
    <span className={styles.spacer} />
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

export { ClassView };
