import React, { useContext } from "react";
import styles from "./LeagueViews.module.css";

const IncomingAccountRequests: React.FC = () => {
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
        <ul></ul>
      </div>
    </div>
  );
};

export { IncomingAccountRequests };