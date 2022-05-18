import React, { useContext, useState } from "react";
import { APIContext } from "../../context/APIContext";
import { Error } from "../util/Error";
import useSWR, { mutate } from "swr";
import styles from "./LeagueViews.module.css";
import { UnapprovedAccount } from "./UnapprovedAccount";
import Loader from "react-spinners/ClipLoader";
import { User } from "../../models/users";
import { Empty } from "../util/Empty";

type IncomingAccountRequestsProp = {
  offShowRequests: () => void;
};

const IncomingAccountRequests: React.FC<IncomingAccountRequestsProp> = ({ offShowRequests }) => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/users", () => client.getAllUsers(undefined, true), { refreshInterval: 100 });

  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Unapproved Requests" />;

  const approveAccount = (user: User) => {
    client.updateUser({
      approved: true,
    }, user.id);
    mutate('api/users');
  }

  const rejectAccount = (user: User) => {
    client.deleteUser(user.id);
    mutate('api/users');
  }

  return (
    <div className={styles.reqCompContainer}>
      <button className={styles.backBtn} onClick={() => offShowRequests()}>
      </button>
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