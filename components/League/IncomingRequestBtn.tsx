import React from "react";
import styles from "./LeagueViews.module.css";

type IncomingRequestProps = {
  requests: boolean | undefined;
  onShowRequests: () => void;
};

const IncomingRequestBtn: React.FC<IncomingRequestProps> = ({ requests, onShowRequests }) => {
  if (requests) {
    return (
      <div>
        <button className={styles.requestBtn} onClick={() => onShowRequests()}>
          Incoming Requests
          <span className={styles.notificationIcon}></span>
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button className={styles.requestBtn} onClick={() => onShowRequests()}>
          Incoming Requests
        </button>
      </div>
    );
  }
};

export { IncomingRequestBtn };
