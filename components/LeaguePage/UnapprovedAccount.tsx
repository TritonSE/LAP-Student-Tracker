import { Int } from "io-ts";
import React from "react";
import styles from "./LeagueViews.module.css";

type UnapprovedAccountProps = {
  name: string;
  email: string;
  time: string | null;
  position: string;
  index: number;
};

const UnapprovedAccount: React.FC<UnapprovedAccountProps> = ({ name, email, time, position, index }) => {
  if (index % 2 == 0) {
    return (
      <div className={styles.accountBarGrey}>
        <p>{name}</p>
        <p>{email}</p>
        <p>{time}</p>
        <p>{position}</p>
        <div><button>Yes</button> / <button>No</button></div>
      </div>
    );
  } else {
    return (
      <div className={styles.accountBarWhite}>
        <p>{name}</p>
        <p>{email}</p>
        <p>{time}</p>
        <p>{position}</p>
        <div><button>Yes</button> / <button>No</button></div>
      </div>
    );
  }
};

export { UnapprovedAccount };