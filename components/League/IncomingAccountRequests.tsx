import React, { useContext } from "react";
import { APIContext } from "../../context/APIContext";
import useSWR, { mutate } from "swr";
import styles from "./LeagueViews.module.css";
import { UnapprovedAccount } from "./UnapprovedAccount";
import Loader from "react-spinners/ClipLoader";
import { User } from "../../models";
import { CustomError } from "../util/CustomError";

type IncomingAccountRequestsProp = {
  offShowRequests: () => void;
};

const IncomingAccountRequests: React.FC<IncomingAccountRequestsProp> = ({ offShowRequests }) => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR(
    "/api/users/?approved=false",
    () => client.getAllUsers(undefined, false),
    {
      refreshInterval: 100,
    }
  );

  if (error) return <CustomError />;
  if (!data) return <Loader />;

  const approveAccount = (user: User): void => {
    client.updateUser(
      {
        approved: true,
      },
      user.id
    );
    mutate("/api/users/?approved=false");
  };

  const rejectAccount = (user: User): void => {
    client.deleteUser(user.id);
    mutate("/api/users/?approved=false");
  };

  return (
    <div className={styles.reqCompContainer}>
      <button className={styles.backBtn} onClick={() => offShowRequests()}></button>
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
        <div className={styles.accountsContainer} key={user.id}>
          <UnapprovedAccount
            key={user.id}
            user={user}
            index={index}
            approveAccount={approveAccount}
            rejectAccount={rejectAccount}
          />
        </div>
      ))}
    </div>
  );
};

export { IncomingAccountRequests };
