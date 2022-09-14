import React from "react";
import styles from "./LeagueViews.module.css";
import { User } from "../../models";

type UnapprovedAccountProps = {
  user: User;
  index: number;
  approveAccount: (user: User) => void;
  rejectAccount: (user: User) => void;
};

const UnapprovedAccount: React.FC<UnapprovedAccountProps> = ({
  user,
  index,
  approveAccount,
  rejectAccount,
}) => {
  if (index % 2 == 0) {
    return (
      <div className={styles.accountBarGrey}>
        <p>{user.firstName + " " + user.lastName}</p>
        <p>{user.email}</p>
        <p>{user.dateCreated}</p>
        <p>{user.role}</p>
        <div>
          <button className={styles.approveBtn} onClick={() => approveAccount(user)}>
            Yes
          </button>{" "}
          /{" "}
          <button className={styles.rejectBtn} onClick={() => rejectAccount(user)}>
            No
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.accountBarWhite}>
        <p>{user.firstName + " " + user.lastName}</p>
        <p>{user.email}</p>
        <p>00/00/00</p>
        <p>{user.role}</p>
        <div className={styles.approveBtnsContainer}>
          <button className={styles.approveBtn} onClick={() => approveAccount(user)}>
            Yes
          </button>{" "}
          /{" "}
          <button className={styles.rejectBtn} onClick={() => rejectAccount(user)}>
            No
          </button>
        </div>
      </div>
    );
  }
};

export { UnapprovedAccount };
