import styles from "../styles/components/Error.module.css";
import React from "react";

// Error displayed when calls to the backend fail
const Error: React.FC = () => {
  return <div className={styles.error}>Something went wrong.</div>;
};

export default Error;
