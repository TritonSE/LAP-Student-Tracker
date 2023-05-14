import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../context/APIContext";
import styles from "./LeagueViews.module.css";
import { UnapprovedAccount } from "./UnapprovedAccount";
import { User } from "../../models";

type IncomingAccountRequestsProp = {
  offShowRequests: () => void;
};

const IncomingAccountRequests: React.FC<IncomingAccountRequestsProp> = ({ offShowRequests }) => {
  const client = useContext(APIContext);

  const [usersToApprove, setUsersToApprove] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const users = await client.getAllUsers(undefined, false);
      setUsersToApprove(users);
    })();
  }, [refresh]);

  // Use SWR hook to get the data from the backend
  // const { data, error } = useSWR(
  //   "/api/users/?approved=false",
  //   () => client.getAllUsers(undefined, false),
  //   {
  //     refreshInterval: 100,
  //   }
  // );

  // if (error) return <CustomError />;
  // if (!data) return <Loader />;

  const approveAccount = async (user: User): Promise<void> => {
    await client.updateUser(
      {
        approved: true,
      },
      user.id
    );

    setRefresh(!refresh);
  };

  const rejectAccount = async (user: User): Promise<void> => {
    await client.deleteUser(user.id);
    setRefresh(!refresh);
    // mutate("/api/users/?approved=false");
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
      {usersToApprove.map((user: User, index) => (
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
