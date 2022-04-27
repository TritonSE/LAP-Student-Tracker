import React, { useContext } from "react";
import styles from "./AdminHomePage.module.css";
import { HomePageClassCard } from "./HomePageClassCard";
import { Class } from "../../models/class";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
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
const HomePageClassScroll: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/class", () => client.getAllClasses());

  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Class" />;

  return (
    <>
      {data.map((classes: Class) => (
        <HomePageClassCard
          key={classes.eventInformationId}
          name={classes.name}
          minLevel={classes.minLevel}
          maxLevel={classes.maxLevel}
          rrstring={classes.rrstring}
          startTime={classes.startTime}
          endTime={classes.endTime}
          teachers={classes.teachers}
        />
      ))}
    </>
  );
};

const HomePageClassView: React.FC = () => {
  return (
      <div>
          <div className={styles.classtitle}>Classes</div>
          <HomePageClassScroll />
      </div>
    
  );
};

export { HomePageClassView, HomePageClassScroll };
