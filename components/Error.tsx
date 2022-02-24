import React from "react";
import styles from "../styles/components/util/Error.module.css";

// Error displayed when calls to the backend fail
const Error: React.FC = () => {
  return <div className={styles.error}>Something went wrong.</div>;
};

export { Error };
