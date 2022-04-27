import { boolean } from "fp-ts";
import React, { useContext } from "react";
import styles from "./LeagueViews.module.css";

type IncomingRequestProps = {
  requests: boolean;
  toggleShowRequests: () => void;
};

const IncomingRequestBtn: React.FC<IncomingRequestProps> = ({ requests, toggleShowRequests }) => {
  return (
    <div>
      <button className={styles.requestBtn} onClick={() => toggleShowRequests()}>
        Incoming Requests
      </button>
    </div>
  );
};

export { IncomingRequestBtn };