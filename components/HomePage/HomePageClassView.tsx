import React, { useContext } from "react";
import styles from "./AdminHomePage.module.css";
import { HomePageClassCard } from "./HomePageClassCard";
import { Class } from "../../models/class";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
import { Empty } from "../util/Empty";
import useSWR from "swr";

const HomePageClassScroll: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/class", () => client.getAllClasses());
  console.log(data);
  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Class" />;

  return (
    <>
      {data.map((classes: Class) => (
        <HomePageClassCard
          key={classes.eventInformationId}
          name={classes.name!}
          minLevel={classes.minLevel!}
          maxLevel={classes.maxLevel!}
          rrstring={classes.rrstring!}
          startTime={classes.startTime!}
          endTime={classes.endTime!}
          teachers={classes.teachers!}
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
