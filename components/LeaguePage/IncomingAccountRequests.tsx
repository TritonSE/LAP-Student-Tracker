import React, { useContext } from "react";
import { APIContext } from "../../context/APIContext";
import { Error } from "../util/Error";
import useSWR from "swr";
import styles from "./LeagueViews.module.css";
import { UnapprovedAccount } from "./UnapprovedAccount";
import Loader from "react-spinners/ClipLoader";
import { User } from "../../models/users";
import { Empty } from "../util/Empty";

const IncomingAccountRequests: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/users", () => client.getAllUsers(undefined, true));
  
  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Unapproved Requests" />;
  
  return (
    <div className={styles.reqCompContainer}>
      <h1 className={styles.reqTitle}>Incoming Account Requests</h1>
      <div className={styles.reqList}>
        <div className={styles.topReqBar}>
          <p>Name</p>
          <p>Email</p>
          <p>Time</p>
          <p>Position</p>
          <p>Approve</p>
        </div>
      </div>
        {data.map((user: User, index) => (
          <div className={styles.accountsContainer}>
            <UnapprovedAccount
              key={user.id}
              name={user.firstName}
              email={user.email}
              time="00/00/00"
              position={user.role}
              index={index}
            />
          </div>
        ))}
    </div>
  );
};

export { IncomingAccountRequests };