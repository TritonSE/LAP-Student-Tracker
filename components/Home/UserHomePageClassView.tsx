import React, { useContext } from "react";
import styles from "./AdminHomePage.module.css";
import { ClassCard } from "./ClassCard";
import { Class } from "../../models/class";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { Empty } from "../util/Empty";
import useSWR from "swr";
import {CustomError} from "../util/CustomError";
type UserHomePageProp = {
  userId: string | undefined;
};
const UserHomePageClassScroll: React.FC<UserHomePageProp> = ({ userId }) => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/class", () => client.getAllClasses(userId));
  if (error) return <CustomError />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Class" />;

  return (
    <>
      {data.map((classes: Class) => (
        <ClassCard
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

const UserHomePageClassView: React.FC<UserHomePageProp> = ({ userId }) => {
  return (
    <div>
      <div className={styles.classtitle}>Classes</div>
      <UserHomePageClassScroll userId={userId} />
    </div>
  );
};

export { UserHomePageClassView, UserHomePageClassScroll };
