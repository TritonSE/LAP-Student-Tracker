import React, { useContext } from "react";
import styles from "../styles/components/LeagueViews.module.css";
import StaffCard from "./StaffCard";
import { APIContext } from "../context/APIContext";
import Loader from "./util/Loader";
import Error from "./util/Error";
import Empty from "./util/Empty";
import useSWR from "swr";
import { User } from "../models/users";

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

const StaffScroll: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/staff", () => client.getStaff());

  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Staff"/>;

  return (
    <>
      {data.map((user: User) => (
        <StaffCard
          key={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          phone_number={user.phoneNumber}
          email={user.email}
        />
      ))}
    </>
  );
};


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
