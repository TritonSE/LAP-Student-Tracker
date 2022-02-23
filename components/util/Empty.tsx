import styles from "../../styles/components/Empty.module.css";
import React from "react";

// Displayed when there is no data to display
const Empty: React.FC<{ userType: string }> = ({ userType }) => {
  return <div className={styles.empty}>There are no {userType}.</div>;
};

export default Empty;
