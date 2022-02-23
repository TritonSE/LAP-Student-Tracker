import styles from "../../styles/components/util/Error.module.css";
import React from "react";

// Error text
const Error: React.FC = () => {
  return <div className={styles.error}>Something went wrong.</div>;
};

export default Error;
