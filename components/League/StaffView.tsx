import React, { useContext } from "react";
import styles from "./LeagueViews.module.css";
import { StaffCard } from "./StaffCard";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { CustomError } from "../util/CustomError";
import { Empty } from "../util/Empty";
import { User } from "../../models/users";
import useSWR from "swr";

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

// Renders the list of staff or the corresponding error
const StaffScroll: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/staff", () => client.getStaff());

  if (error) return <CustomError />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Staff" />;

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

export { StaffView, StaffScroll };
